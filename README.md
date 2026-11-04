# Sensus API — módulo de autenticação e usuários

Back end em **FastAPI** sobre o banco PostgreSQL/Supabase do projeto.

## Rodando

```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env        # preencha as chaves do Supabase
uvicorn app.main:app --reload
```

Documentação interativa: http://localhost:8000/docs · Testes: `pytest`

## Endpoints

| Método | Rota | Acesso | O que faz |
|---|---|---|---|
| POST | `/auth/cadastro` | público | Cria um **cliente** (ignora qualquer `tipo` enviado) |
| POST | `/auth/login` | público | E-mail + senha → access/refresh token |
| POST | `/auth/refresh` | público | Renova o token |
| GET/PATCH | `/usuarios/me` | logado | Ver / editar o próprio perfil (nome, telefone, nascimento) |
| GET | `/usuarios` | admin | Lista com filtros `tipo`, `ativo`, `limit`, `offset` |
| POST | `/usuarios` | admin | Cria admin, psicólogo ou cliente |
| GET | `/usuarios/{id}` | admin | Detalhe |
| PATCH | `/usuarios/{id}/ativo` | admin | Ativa/desativa (inativo não loga nem acessa a API) |

Rotas protegidas usam `Authorization: Bearer <access_token>`.
Para proteger rotas dos próximos módulos: `Depends(get_current_user)` ou
`Depends(require_roles(TipoUsuario.psicologo))` (em `app/deps.py`).

## Decisões importantes

- **`tipo` e `ativo` vêm do banco**, nunca de claims do token.
- O back end usa a **service_role** (ignora o RLS), então a autorização é feita aqui, nas dependencies.
  Nunca faça login com o cliente admin (`get_admin_client`); login/refresh usam um cliente anon descartável.
- Ao criar um usuário o back end cria também a linha em `clientes`, `psicologos` ou `admin_detalhes`
  e desfaz o usuário no Auth se isso falhar.
- Validação do JWT: com `SUPABASE_JWT_SECRET` (HS256, projetos legados) ou pelas chaves públicas
  (JWKS) quando ele está vazio. Veja em *Project Settings → JWT* qual o seu projeto usa.

## Antes de usar em produção

1. **Corrigir o trigger `on_auth_user_created`** (veja `sql/001_trigger_tipo_seguro.sql`): hoje o
   cadastro direto pelo Supabase permite escolher `tipo = admin`.
2. **Desligar signups públicos** no Supabase (*Authentication → Sign In / Providers → Allow new users to sign up*),
   para que só este back end crie usuários.
3. **Conferir as constraints** de `clientes`, `psicologos` e `admin_detalhes` no `clinica_supabase.sql`:
   o PDF veio com as tabelas quebradas, então o insert assume que só `id_usuario` (e `crp`/`valor_consulta`
   no psicólogo) são obrigatórios.
4. `AUTO_CONFIRMAR_EMAIL=false` quando houver fluxo de confirmação por e-mail.
