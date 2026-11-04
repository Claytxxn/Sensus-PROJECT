from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


class TipoUsuario(str, Enum):
    admin = "admin"
    psicologo = "psicologo"
    cliente = "cliente"


class UsuarioOut(BaseModel):
    id: UUID
    auth_user_id: UUID
    nome: str
    email: str
    telefone: str | None = None
    data_nascimento: date | None = None
    tipo: TipoUsuario
    data_cadastro: datetime | None = None
    ativo: bool


class UsuariosPage(BaseModel):
    total: int
    items: list[UsuarioOut]


class CadastroIn(BaseModel):
    nome: str = Field(min_length=2, max_length=100)
    email: EmailStr
    senha: str = Field(min_length=8, max_length=72)
    telefone: str = Field(default="", max_length=15)
    data_nascimento: date

    @field_validator("email")
    @classmethod
    def _email_cabe_no_banco(cls, v: str) -> str:
        if len(v) > 100:
            raise ValueError("e-mail deve ter no máximo 100 caracteres")
        return v.lower()


class UsuarioAdminIn(CadastroIn):
    """Criação de qualquer perfil por um admin."""

    tipo: TipoUsuario
    # psicólogo
    crp: str | None = Field(default=None, max_length=20)
    valor_consulta: Decimal | None = Field(default=None, ge=0)
    especialidade: str | None = Field(default=None, max_length=100)
    # admin
    cargo: str | None = Field(default=None, max_length=50)

    @model_validator(mode="after")
    def _psicologo_exige_dados(self):
        if self.tipo == TipoUsuario.psicologo and (not self.crp or self.valor_consulta is None):
            raise ValueError("psicólogo exige 'crp' e 'valor_consulta'")
        return self


class UsuarioUpdate(BaseModel):
    nome: str | None = Field(default=None, min_length=2, max_length=100)
    telefone: str | None = Field(default=None, max_length=15)
    data_nascimento: date | None = None


class AtivoIn(BaseModel):
    ativo: bool


class LoginIn(BaseModel):
    email: EmailStr
    senha: str


class RefreshIn(BaseModel):
    refresh_token: str


class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
