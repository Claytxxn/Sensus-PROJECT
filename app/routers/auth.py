from fastapi import APIRouter, HTTPException, status

from app.core.compat import AuthApiError
from app.core.db import new_anon_client
from app.schemas.usuario import CadastroIn, LoginIn, RefreshIn, TipoUsuario, TokenOut, UsuarioOut
from app.services import usuarios as svc

router = APIRouter(prefix="/auth", tags=["auth"])


def _token_out(resp) -> TokenOut:
    s = resp.session
    usuario = svc.buscar_por_auth_id(resp.user.id)
    if usuario is None or not usuario["ativo"]:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Usuário inativo ou sem perfil")
    return TokenOut(
        access_token=s.access_token, refresh_token=s.refresh_token, expires_in=s.expires_in
    )


@router.post("/cadastro", response_model=UsuarioOut, status_code=status.HTTP_201_CREATED)
def cadastro(body: CadastroIn):
    """Cadastro público: sempre cria um CLIENTE, ignorando qualquer 'tipo' enviado."""
    return svc.criar_usuario(body, TipoUsuario.cliente)


@router.post("/login", response_model=TokenOut)
def login(body: LoginIn):
    try:
        resp = new_anon_client().auth.sign_in_with_password(
            {"email": body.email, "password": body.senha}
        )
    except AuthApiError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "E-mail ou senha inválidos")
    return _token_out(resp)


@router.post("/refresh", response_model=TokenOut)
def refresh(body: RefreshIn):
    try:
        resp = new_anon_client().auth.refresh_session(body.refresh_token)
    except AuthApiError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Refresh token inválido")
    return _token_out(resp)
