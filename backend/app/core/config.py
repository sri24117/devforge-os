from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "DevForge OS"
    DATABASE_URL: str
    REDIS_URL: str
    MICROSERVICE_URL: str = "http://localhost:5001"
    SECRET_KEY: str = "DEVFORGE_SUPER_SECRET_KEY_CHANGEME"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    # Optional OAuth / external integrations
    GITHUB_CLIENT_ID: str | None = None
    GITHUB_CLIENT_SECRET: str | None = None
    GITHUB_REDIRECT_URI: str | None = None

    # V4 AI assistant via OpenRouter. Leave empty for safe offline fallback.
    OPENROUTER_API_KEY: str | None = None
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_SITE_URL: str = "http://localhost:5173"
    OPENROUTER_APP_NAME: str = "DevForge OS"
    AI_QUICK_MODEL: str = "google/gemma-2-9b-it:free"
    AI_DEEP_MODEL: str = "anthropic/claude-3.5-sonnet"
    AI_BALANCED_MODEL: str = "openai/gpt-4o-mini"

    # Plan limits. Keep conservative until payments are active.
    FREE_AI_DAILY_LIMIT: int = 10
    PRO_AI_DAILY_LIMIT: int = 100
    PREMIUM_AI_DAILY_LIMIT: int = 300
    FREE_COMPILER_DAILY_LIMIT: int = 20
    PRO_COMPILER_DAILY_LIMIT: int = 150
    PREMIUM_COMPILER_DAILY_LIMIT: int = 500

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
