import time

import jwt
import pytest
from fastapi import HTTPException

from app.core.security import decode_token

SECRET = "segredo-de-teste-0123456789-0123456789"


def make_token(secret=SECRET, **over):
    payload = {"sub": "u-1", "aud": "authenticated", "exp": int(time.time()) + 3600, **over}
    return jwt.encode(payload, secret, algorithm="HS256")


def test_token_valido():
    assert decode_token(make_token())["sub"] == "u-1"


@pytest.mark.parametrize(
    "token",
    [
        make_token(exp=int(time.time()) - 10),
        make_token(aud="outro"),
        make_token(secret="outro-segredo-0123456789-0123456789-01"),
        "lixo",
    ],
)
def test_token_invalido(token):
    with pytest.raises(HTTPException) as e:
        decode_token(token)
    assert e.value.status_code == 401
