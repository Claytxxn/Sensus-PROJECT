from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.security import decode_token
from app.schemas.usuario import TipoUsuario
from app.services import usuarios as usuarios_service

bearer = HTTPBearer(auto_error=False)


def get_current_user(cred: HTTPAuthorizationCredentials | None = Depends(bearer)) -> dict:
    if cred is None:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED, "Não autenticado", headers={"WWW-Authenticate": "Bearer"}
        )
    payload = decode_token(cred.credentials)
    # O perfil (tipo/ativo) vem SEMPRE do banco, nunca de claims do token.
    usuario = usuarios_service.buscar_por_auth_id(payload["sub"])
    if usuario is None:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Perfil não encontrado")
    if not usuario["ativo"]:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Usuário inativo")
    return usuario


def require_roles(*tipos: TipoUsuario):
    permitidos = {t.value for t in tipos}

    def checker(usuario: dict = Depends(get_current_user)) -> dict:
        if usuario["tipo"] not in permitidos:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Sem permissão")
        return usuario

    return checker
