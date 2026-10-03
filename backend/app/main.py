from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

# Rejestracja routerów
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

@app.get("/", tags=["System"])
def root():
    return {
        "message": "Witaj w API Kraków Bez Barier (AccessKrakow). Przejdź do /docs aby zobaczyć dokumentację OpenAPI.",
        "docs_url": "/docs"
    }
