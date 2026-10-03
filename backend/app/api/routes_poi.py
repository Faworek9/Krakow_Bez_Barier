from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException
from app.models.poi import POI, UserPreferences
from app.services.krakow_data_service import repo

router = APIRouter(prefix="/poi", tags=["Miejsca i Obiekty (POI)"])

@router.get("", summary="Pobierz listę miejsc z opcją wyszukiwania i filtrowania")
def get_places(
    query: Optional[str] = Query(None, description="Fraza wyszukiwania (nazwa, ulica, opis)"),
    category: Optional[str] = Query(None, description="Kategoria (muzeum, urzad, dworzec, zabytek, kawiarnia, park)"),
    district: Optional[str] = Query(None, description="Dzielnica (Stare Miasto, Kazimierz, Podgórze)"),
    credibility: Optional[str] = Query(None, description="Filtr wiarygodności (VERIFIED_OFFICIAL, VERIFIED_COMMUNITY itp.)"),
    only_without_gaps: bool = Query(False, description="Tylko obiekty z kompletnymi danymi")
) -> List[POI]:
    return repo.search_places(
        query=query,
        category=category,
        district=district,
        credibility_filter=credibility,
        only_without_gaps=only_without_gaps
    )

@router.post("/evaluate", summary="Oceń dostępność miejsc dla zadanego profilu preferencji")
def evaluate_places(prefs: UserPreferences):
    places = repo.get_all_places()
    return repo.evaluate_places(places, prefs)

@router.get("/{poi_id}", summary="Pobierz szczegółowe dane konkretnego miejsca wraz z audytem")
def get_place_detail(poi_id: str):
    poi = repo.get_place_by_id(poi_id)
    if not poi:
        raise HTTPException(status_code=404, detail="Nie znaleziono obiektu o podanym ID")
    return poi
