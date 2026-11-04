import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.main import app
from app.schemas.usuario import UsuarioAdminIn
from app.services import usuarios as svc
from tests.test_security import make_token

client = TestClient(app)
ID = "11111111-1111-1111-1111-111111111111"


def fake_user(tipo="cliente", ativo=True):
    return {
        "id": ID,
        "auth_user_id": ID,
        "nome": "Ana",
        "email": "ana@example.com",
        "telefone": "",
        "data_nascimento": "2000-01-01",
        "tipo": tipo,
        "data_cadastro": None,
        "ativo": ativo,
    }


def auth():
    return {"Authorization": f"Bearer {make_token()}"}


def test_sem_token_401():
    assert client.get("/usuarios/me").status_code == 401


def test_me_ok(monkeypatch):
    monkeypatch.setattr(svc, "buscar_por_auth_id", lambda _: fake_user())
    r = client.get("/usuarios/me", headers=auth())
    assert r.status_code == 200 and r.json()["nome"] == "Ana"


def test_usuario_inativo_403(monkeypatch):
    monkeypatch.setattr(svc, "buscar_por_auth_id", lambda _: fake_user(ativo=False))
    assert client.get("/usuarios/me", headers=auth()).status_code == 403


def test_cliente_nao_lista_usuarios(monkeypatch):
    monkeypatch.setattr(svc, "buscar_por_auth_id", lambda _: fake_user("cliente"))
    assert client.get("/usuarios", headers=auth()).status_code == 403


def test_admin_lista_usuarios(monkeypatch):
    monkeypatch.setattr(svc, "buscar_por_auth_id", lambda _: fake_user("admin"))
    monkeypatch.setattr(svc, "listar", lambda *a: ([fake_user()], 1))
    r = client.get("/usuarios", headers=auth())
    assert r.status_code == 200 and r.json()["total"] == 1


def test_admin_nao_desativa_a_si_mesmo(monkeypatch):
    monkeypatch.setattr(svc, "buscar_por_auth_id", lambda _: fake_user("admin"))
    r = client.patch(f"/usuarios/{ID}/ativo", json={"ativo": False}, headers=auth())
    assert r.status_code == 400


def test_psicologo_exige_crp_e_valor():
    base = dict(nome="Carlos", email="c@example.com", senha="12345678", data_nascimento="1990-01-01")
    with pytest.raises(ValidationError):
        UsuarioAdminIn(**base, tipo="psicologo")
    ok = UsuarioAdminIn(**base, tipo="psicologo", crp="02/12345", valor_consulta="80.00")
    assert ok.crp == "02/12345"
