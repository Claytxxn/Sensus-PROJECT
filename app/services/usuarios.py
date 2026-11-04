import logging

from fastapi import HTTPException, status

from app.core.compat import AuthApiError
from app.core.config import get_settings
from app.core.db import get_admin_client
from app.schemas.usuario import CadastroIn, TipoUsuario, UsuarioAdminIn

log = logging.getLogger(__name__)


def buscar_por_auth_id(auth_user_id: str) -> dict | None:
    res = (
        get_admin_client()
        .table("usuarios")
        .select("*")
        .eq("auth_user_id", str(auth_user_id))
        .limit(1)
        .execute()
    )
    return res.data[0] if res.data else None


def buscar_por_id(usuario_id) -> dict | None:
    res = (
        get_admin_client()
        .table("usuarios")
        .select("*")
        .eq("id", str(usuario_id))
        .limit(1)
        .execute()
    )
    return res.data[0] if res.data else None


def listar(tipo: TipoUsuario | None, ativo: bool | None, limit: int, offset: int):
    q = get_admin_client().table("usuarios").select("*", count="exact")
    if tipo:
        q = q.eq("tipo", tipo.value)
    if ativo is not None:
        q = q.eq("ativo", ativo)
    res = q.order("data_cadastro", desc=True).range(offset, offset + limit - 1).execute()
    return res.data, res.count or 0


def atualizar(usuario_id, dados: dict) -> dict:
    res = (
        get_admin_client().table("usuarios").update(dados).eq("id", str(usuario_id)).execute()
    )
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Usuário não encontrado")
    return res.data[0]


def _detalhes(body) -> dict:
    """Campos das tabelas de detalhe (psicologos / admin_detalhes)."""
    if not isinstance(body, UsuarioAdminIn):
        return {}
    if body.tipo == TipoUsuario.psicologo:
        d = {
            "crp": body.crp,
            "valor_consulta": str(body.valor_consulta),
            "especialidade": body.especialidade,
        }
    elif body.tipo == TipoUsuario.admin:
        d = {"cargo": body.cargo}
    else:
        d = {}
    return {k: v for k, v in d.items() if v is not None}


_TABELA_DETALHE = {
    TipoUsuario.cliente: "clientes",
    TipoUsuario.psicologo: "psicologos",
    TipoUsuario.admin: "admin_detalhes",
}


def criar_usuario(body: CadastroIn, tipo: TipoUsuario) -> dict:
    """Cria o usuário no Supabase Auth, espera o trigger on_auth_user_created
    criar a linha em `usuarios` e cria a linha de detalhe do perfil."""
    db = get_admin_client()
    try:
        resp = db.auth.admin.create_user(
            {
                "email": body.email,
                "password": body.senha,
                "email_confirm": get_settings().auto_confirmar_email,
                # É daqui que o trigger atual lê o tipo (raw_user_meta_data)...
                "user_metadata": {
                    "nome": body.nome,
                    "telefone": body.telefone,
                    "data_nascimento": body.data_nascimento.isoformat(),
                    "tipo": tipo.value,
                },
                # ...e daqui que ele deve ler depois do patch em sql/001 (só o servidor escreve).
                "app_metadata": {"tipo": tipo.value},
            }
        )
    except AuthApiError as e:
        msg = getattr(e, "message", str(e))
        code = status.HTTP_409_CONFLICT if "already" in msg.lower() else status.HTTP_400_BAD_REQUEST
        raise HTTPException(code, msg)

    auth_id = resp.user.id
    usuario = buscar_por_auth_id(auth_id)
    if usuario is None:
        _desfazer(auth_id)
        raise HTTPException(500, "Perfil não foi criado pelo trigger on_auth_user_created")

    try:
        db.table(_TABELA_DETALHE[tipo]).insert(
            {"id_usuario": usuario["id"], **_detalhes(body)}
        ).execute()
    except Exception as e:
        log.exception("Falha ao criar detalhes do perfil")
        _desfazer(auth_id)
        raise HTTPException(400, f"Não foi possível criar o perfil de {tipo.value}: {e}")
    return usuario


def _desfazer(auth_id) -> None:
    try:
        get_admin_client().auth.admin.delete_user(str(auth_id))
    except Exception:
        log.exception("Não foi possível remover o usuário órfão %s do Auth", auth_id)
