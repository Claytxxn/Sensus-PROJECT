from functools import lru_cache

from supabase import Client, create_client

from app.core.config import get_settings


@lru_cache
def get_admin_client() -> Client:
    """Cliente com service_role (ignora o RLS). Nunca faça login com ele:
    o supabase-py troca o token do cliente e ele deixaria de ser admin."""
    s = get_settings()
    return create_client(s.supabase_url, s.supabase_service_role_key)


def new_anon_client() -> Client:
    """Cliente novo e descartável para login/refresh (chave anon)."""
    s = get_settings()
    return create_client(s.supabase_url, s.supabase_anon_key)
