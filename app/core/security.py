from functools import lru_cache

import jwt
from fastapi import HTTPException, status
from jwt import PyJWKClient

from app.core.config import get_settings


@lru_cache
def _jwks_client() -> PyJWKClient:
    return PyJWKClient(f"{get_settings().supabase_url}/auth/v1/.well-known/jwks.json")


def decode_token(token: str) -> dict:
    """Valida o JWT emitido pelo Supabase Auth e devolve o payload.

    - Com SUPABASE_JWT_SECRET: valida HS256 (projetos com JWT legado).
    - Sem ele: valida pela chave pública do projeto (JWKS).
    """
    s = get_settings()
    try:
        if s.supabase_jwt_secret:
            return jwt.decode(
                token, s.supabase_jwt_secret, algorithms=["HS256"], audience="authenticated"
            )
        key = _jwks_client().get_signing_key_from_jwt(token).key
        return jwt.decode(token, key, algorithms=["ES256", "RS256"], audience="authenticated")
    except jwt.PyJWTError:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "Token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
