from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.deps import get_current_user, require_roles
from app.schemas.usuario import (
    AtivoIn,
    TipoUsuario,
    UsuarioAdminIn,
    UsuarioOut,
    UsuariosPage,
    UsuarioUpdate,
)
from app.services import usuarios as svc

router = APIRouter(prefix="/usuarios", tags=["usuarios"])
somente_admin = require_roles(TipoUsuario.admin)


@router.get("/me", response_model=UsuarioOut)
def meu_perfil(usuario: dict = Depends(get_current_user)):
    return usuario


@router.patch("/me", response_model=UsuarioOut)
def atualizar_meu_perfil(body: UsuarioUpdate, usuario: dict = Depends(get_current_user)):
    dados = body.model_dump(mode="json", exclude_unset=True)
    if not dados:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Nenhum campo para atualizar")
    return svc.atualizar(usuario["id"], dados)


@router.get("", response_model=UsuariosPage)
def listar_usuarios(
    tipo: TipoUsuario | None = None,
    ativo: bool | None = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    _: dict = Depends(somente_admin),
):
    items, total = svc.listar(tipo, ativo, limit, offset)
    return UsuariosPage(total=total, items=items)


@router.post("", response_model=UsuarioOut, status_code=status.HTTP_201_CREATED)
def criar_usuario(body: UsuarioAdminIn, _: dict = Depends(somente_admin)):
    return svc.criar_usuario(body, body.tipo)


@router.get("/{usuario_id}", response_model=UsuarioOut)
def obter_usuario(usuario_id: UUID, _: dict = Depends(somente_admin)):
    usuario = svc.buscar_por_id(usuario_id)
    if usuario is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Usuário não encontrado")
    return usuario


@router.patch("/{usuario_id}/ativo", response_model=UsuarioOut)
def definir_ativo(usuario_id: UUID, body: AtivoIn, admin: dict = Depends(somente_admin)):
    if str(usuario_id) == str(admin["id"]) and not body.ativo:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Você não pode desativar a si mesmo")
    return svc.atualizar(usuario_id, {"ativo": body.ativo})
