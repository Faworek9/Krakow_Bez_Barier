import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.poi import UserPreferences

client = TestClient(app)

def test_list_demo_routes():
    res = client.get("/api/routes")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 2
    route_ids = [r["route_id"] for r in data]
    assert "dworzec-rynek" in route_ids
    assert "rynek-wawel" in route_ids

def test_evaluate_demo_route():
    prefs = {
        "min_door_width_cm": 80,
        "max_curb_cm": 2.0,
        "avoid_stairs": True,
        "avoid_rough_surfaces": False,
        "require_elevator_if_multi_floor": True,
        "require_accessible_toilet": False,
        "require_rest_places": False,
        "require_hearing_loop": False
    }
    res = client.post("/api/routes/evaluate/dworzec-rynek", json=prefs)
    assert res.status_code == 200
    data = res.json()
    assert data["route_id"] == "dworzec-rynek"
    assert data["total_distance_meters"] > 0
    assert len(data["segments"]) > 0
    assert data["accessibility_status"] in ["recommended", "passable_with_effort", "not_recommended"]

def test_custom_route_same_poi():
    payload = {
        "start_poi_id": "poi-dworzec-glowny",
        "destination_poi_id": "poi-dworzec-glowny",
        "preferences": {
            "min_door_width_cm": 80,
            "max_curb_cm": 2.0,
            "avoid_stairs": True,
            "avoid_rough_surfaces": False,
            "require_elevator_if_multi_floor": False,
            "require_accessible_toilet": False,
            "require_rest_places": False,
            "require_hearing_loop": False
        }
    }
    res = client.post("/api/routes/custom", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["total_distance_meters"] == 0
    assert data["accessibility_score"] == 100
    assert len(data["segments"]) == 1

def test_custom_route_surface_avoidance():
    # Od Sukiennic (Rynek) do Wawelu:
    # 1. Z zezwoleniem na kocie łby (avoid_rough_surfaces = False)
    payload_rough_allowed = {
        "start_poi_id": "poi-sukiennice",
        "destination_poi_id": "poi-wawel-zamek",
        "preferences": {
            "min_door_width_cm": 80,
            "max_curb_cm": 3.0,
            "avoid_stairs": True,
            "avoid_rough_surfaces": False,
            "require_elevator_if_multi_floor": False,
            "require_accessible_toilet": False,
            "require_rest_places": False,
            "require_hearing_loop": False
        }
    }
    res1 = client.post("/api/routes/custom", json=payload_rough_allowed)
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["total_distance_meters"] > 0

    # 2. Z wymogiem unikania kocich łbów (avoid_rough_surfaces = True)
    payload_rough_avoided = {
        "start_poi_id": "poi-sukiennice",
        "destination_poi_id": "poi-wawel-zamek",
        "preferences": {
            "min_door_width_cm": 80,
            "max_curb_cm": 3.0,
            "avoid_stairs": True,
            "avoid_rough_surfaces": True,
            "require_elevator_if_multi_floor": False,
            "require_accessible_toilet": False,
            "require_rest_places": False,
            "require_hearing_loop": False
        }
    }
    res2 = client.post("/api/routes/custom", json=payload_rough_avoided)
    assert res2.status_code == 200
    data2 = res2.json()

    # Kocie łby powinny zostać wyeliminowane lub zredukowane na trasie
    kocie_lby_pct_avoided = data2["surface_summary"].get("kocie_lby", 0.0)
    assert kocie_lby_pct_avoided == 0.0
    assert any("omija nierówne kocie łby" in adv for adv in data2["advantages_detected"])

def test_custom_route_cross_district_to_podgorze():
    # Trasa przez Wisłę: Dworzec Główny -> Cricoteka (Podgórze)
    payload = {
        "start_poi_id": "poi-dworzec-glowny",
        "destination_poi_id": "poi-cricoteka-podgorze",
        "preferences": {
            "min_door_width_cm": 85,
            "max_curb_cm": 2.0,
            "avoid_stairs": True,
            "avoid_rough_surfaces": True,
            "require_elevator_if_multi_floor": True,
            "require_accessible_toilet": False,
            "require_rest_places": False,
            "require_hearing_loop": False
        }
    }
    res = client.post("/api/routes/custom", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["total_distance_meters"] > 1500
    # Sprawdzenie, czy trasa przekracza Kładkę Bernatka
    assert any("Bernatka" in seg["instruction"] for seg in data["segments"])
    assert len(data["segments"]) >= 5
    # Sprawdzenie koordynatów dla mapy
    for seg in data["segments"]:
        assert len(seg["path"]) >= 2
        assert all(len(coord) == 2 for coord in seg["path"])

def test_custom_route_not_found():
    payload = {
        "start_poi_id": "non-existent-poi-1",
        "destination_poi_id": "poi-sukiennice",
        "preferences": {
            "min_door_width_cm": 80,
            "max_curb_cm": 2.0,
            "avoid_stairs": True,
            "avoid_rough_surfaces": False,
            "require_elevator_if_multi_floor": False,
            "require_accessible_toilet": False,
            "require_rest_places": False,
            "require_hearing_loop": False
        }
    }
    res = client.post("/api/routes/custom", json=payload)
    assert res.status_code == 404
