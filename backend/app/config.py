from pydantic import BaseModel
import os

class Settings(BaseModel):
    PROJECT_NAME: str = "Kraków Bez Barier - AccessKrakow API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    
    # Domyślny punkt centralny (Kraków - Rynek Główny)
    KRAKOW_CENTER_LAT: float = 50.06143
    KRAKOW_CENTER_LNG: float = 19.93658
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*"
    ]
    
    # Źródła danych
    OVERPASS_URL: str = "https://overpass-api.de/api/interpreter"
    KRAKOW_OPEN_DATA_BASE_URL: str = "https://otwartedane.um.krakow.pl/api"
    
    # Środowisko
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

settings = Settings()
