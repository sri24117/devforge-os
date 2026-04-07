from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "DevForge OS"
    DATABASE_URL: str
    REDIS_URL: str
    MICROSERVICE_URL: str = "http://localhost:5001"
    SECRET_KEY: str = "DEVFORGE_SUPER_SECRET_KEY_CHANGEME"
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
