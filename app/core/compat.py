# O pacote de auth do supabase-py mudou de nome entre versões.
try:
    from supabase_auth.errors import AuthApiError
except ImportError:  # versões antigas
    from gotrue.errors import AuthApiError

__all__ = ["AuthApiError"]
