import pytest
from app.models.poi import POI, UserPreferences, CredibilityLevel, SurfaceType
from app.services.accessibility_scorer import evaluate_poi_accessibility
from app.services.krakow_data_service import repo
from app.services.routing_service import routing_service

def test_fully_accessible_station_for_wheelchair():
    station = repo.get_place_by_id("poi-dworzec-glowny")
    assert station is not None
    
    prefs = UserPreferences(
        preset_name="wheelchair",
        min_door_width_cm=85,
        max_curb_cm=2.0,
        avoid_stairs=True,
        require_accessible_toilet=True
    )
    
    eval_result = evaluate_poi_accessibility(station, prefs)
    assert eval_result.match_score >= 90
    assert eval_result.can_access_independently is True
    assert eval_result.status in ("ideal", "good")
    assert len(eval_result.barriers) == 0

def test_cafe_with_stairs_detects_barrier():
    cafe = repo.get_place_by_id("poi-kazimierz-cafe-literacka")
    assert cafe is not None
    
    prefs = UserPreferences(
        preset_name="wheelchair",
        min_door_width_cm=85,
        max_curb_cm=2.0,
        avoid_stairs=True,
        avoid_rough_surfaces=True
    )
    
    eval_result = evaluate_poi_accessibility(cafe, prefs)
    assert eval_result.can_access_independently is False
    assert eval_result.match_score < 60
    # Sprawdzenie czy wykryto schody i wąskie drzwi
    barriers_text = " ".join(eval_result.barriers)
    assert "Schody przy wejściu" in barriers_text or "stopnie" in barriers_text
    assert "Wąskie wejście" in barriers_text

def test_data_gaps_not_treated_as_accessible():
    """
    Wymóg konkursowy: aplikacja nie powinna przedstawiać braku informacji
    jako potwierdzenia dostępności miejsca!
    """
    gap_place = repo.get_place_by_id("poi-restauracja-stara-kamienica-luki-danych")
    assert gap_place is not None
    
    prefs = UserPreferences(preset_name="wheelchair")
    eval_result = evaluate_poi_accessibility(gap_place, prefs)
    
    assert eval_result.status == "insufficient_data"
    assert len(eval_result.data_gap_warnings) > 0
    assert eval_result.can_access_independently is False

def test_luggage_tourist_rough_surface_penalty():
    route_res = routing_service.evaluate_route(
        "rynek-wawel",
        UserPreferences(avoid_rough_surfaces=True, max_curb_cm=3.0)
    )
    # Trasa Rynek -> Wawel ma kocie łby na Kanoniczej
    assert any("kocie łby" in b.lower() for b in route_res.barriers_detected)
