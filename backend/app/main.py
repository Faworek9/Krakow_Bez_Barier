import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.config import settings
from app.api.routes_poi import router as poi_router
from app.api.routes_routing import router as routing_router
from app.api.routes_feedback import router as feedback_router
from app.api.routes_auth import router as auth_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
    ## Kraków Bez Barier (AccessKrakow) - REST API
    Platforma oceny dostępności przestrzeni miejskiej i obiektów użyteczności publicznej w Krakowie.
    
    ### Główne cechy:
    * **Parametryczna ocena barier**: schody, rampy, windy, krawężniki, rodzaj nawierzchni, toalety dostosowane.
    * **Transparentność danych**: wskazanie źródła (UMK, OSM, audyt), daty weryfikacji oraz poziomu wiarygodności.
    * **Obsługa braków danych**: brak informacji nie jest traktowany jako potwierdzenie dostępności.
    * **Ochrona prywatności (RODO)**: brak gromadzenia danych wrażliwych o stanie zdrowia użytkownika.
    """,
    openapi_tags=[
        {"name": "Uwierzytelnianie i Profile (Konta)", "description": "Rejestracja, logowanie użytkowników i firm, konta demo"},
        {"name": "Miejsca i Obiekty (POI)", "description": "Wyszukiwanie, audyt i dopasowanie miejsc do profilu"},
        {"name": "Wyznaczanie Dostępnych Tras", "description": "Nawigacja z analizą nawierzchni, krawężników i schodów"},
        {"name": "Zgłoszenia Użytkowników i Aktualizacje", "description": "Korygowanie i dodawanie danych o barierach"}
    ]
)

# Konfiguracja CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rejestracja routerów API
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(poi_router, prefix=settings.API_V1_PREFIX)
app.include_router(routing_router, prefix=settings.API_V1_PREFIX)
app.include_router(feedback_router, prefix=settings.API_V1_PREFIX)

@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

# Wykrywanie skompilowanego frontendu produkcyjnego React
POSSIBLE_DIST_PATHS = [
    Path("/app/frontend_dist"),
    Path(__file__).resolve().parent.parent / "frontend_dist",
    Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
]

frontend_dist = next((p for p in POSSIBLE_DIST_PATHS if p.exists() and (p / "index.html").exists()), None)

if frontend_dist:
    assets_dir = frontend_dist / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/")
    def serve_frontend_root():
        return FileResponse(frontend_dist / "index.html")

    @app.get("/{full_path:path}")
    def serve_frontend_spa(full_path: str):
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return None
        candidate_file = frontend_dist / full_path
        if candidate_file.exists() and candidate_file.is_file():
            return FileResponse(candidate_file)
        return FileResponse(frontend_dist / "index.html")
else:
    @app.get("/", tags=["System"])
    def root():
        return {
            "message": "Witaj w API Kraków Bez Barier (AccessKrakow). Przejdź do /docs aby zobaczyć dokumentację OpenAPI.",
            "docs_url": "/docs"
        }
