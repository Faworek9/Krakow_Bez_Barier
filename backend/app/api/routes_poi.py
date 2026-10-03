from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException, Depends
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

from app.models.user import User, UserRole, BusinessPlaceCreateRequest
from app.api.routes_auth import get_current_user
from app.models.poi import (
    AccessibilityFeatures, 
    ElevatorInfo, 
    ToiletInfo, 
    DataProvenance, 
    CredibilityLevel, 
    SurfaceType, 
    Coordinates
)
import uuid
from datetime import datetime, timezone

@router.post("/business", response_model=POI, summary="Dodaj nowy lokal jako zarejestrowana firma")
def create_business_place(
    req: BusinessPlaceCreateRequest,
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.BUSINESS:
        raise HTTPException(
            status_code=403, 
            detail="Tylko zarejestrowane profile firm i lokali mogą dodawać obiekty z deklaracją właściciela."
        )

    poi_id = f"biz-{uuid.uuid4().hex[:8]}"
    company_label = (
        current_user.business_info.company_name 
        if current_user.business_info and current_user.business_info.company_name 
        else current_user.display_name
    )

    surface_enum = SurfaceType.COBBLESTONE_SMOOTH
    if req.surface_type == "asfalt":
        surface_enum = SurfaceType.ASPHALT
    elif req.surface_type == "plyty_chodnikowe":
        surface_enum = SurfaceType.PAVING_SLABS
    elif req.surface_type == "kocie_lby":
        surface_enum = SurfaceType.COBBLESTONE_ROUGH

    new_poi = POI(
        id=poi_id,
        name=req.name,
        category=req.category,
        address=req.address,
        district=req.district,
        location=Coordinates(lat=req.lat or 50.0614, lng=req.lng or 19.9365),
        description=req.description or f"Lokal zgłoszony przez oficjalnego partnera: {company_label}.",
        features=AccessibilityFeatures(
            entrance_width_cm=req.entrance_width_cm,
            steps_at_entrance=req.steps_at_entrance,
            has_ramp=req.has_ramp,
            ramp_slope_percent=req.ramp_slope_percent,
            max_curb_cm=req.max_curb_cm,
            surface_type=surface_enum,
            elevator=ElevatorInfo(available=req.has_elevator),
            accessible_toilet=ToiletInfo(available=req.has_accessible_toilet),
            tactile_paving=req.tactile_paving,
            hearing_loop=req.hearing_loop,
            guide_dog_allowed=req.guide_dog_allowed
        ),
        meta=DataProvenance(
            source_name=f"Deklaracja Właściciela ({company_label})",
            source_url=current_user.business_info.website if current_user.business_info else None,
            last_verified_at=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            credibility_level=CredibilityLevel.VERIFIED_OFFICIAL,
            credibility_score=95,
            has_data_gaps=False,
            data_gaps=[],
            verified_by=current_user.display_name
        ),
        owner_user_id=current_user.id
    )

    repo.add_or_update_poi(new_poi)
    return new_poi

@router.get("/my-places", response_model=List[POI], summary="Pobierz lokale przypisane do zalogowanej firmy")
def get_my_business_places(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.BUSINESS:
        raise HTTPException(status_code=403, detail="Dostępne wyłącznie dla kont biznesowych.")
    return repo.get_places_by_owner(current_user.id)

