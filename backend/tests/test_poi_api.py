import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_get_poi_list():
    res = client.get("/api/poi")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 5
    # Sprawdzenie obecności metadanych wiarygodności
    first = data[0]
    assert "features" in first
    assert "meta" in first
    assert "credibility_level" in first["meta"]
    assert "source_name" in first["meta"]

def test_search_poi_query():
    res = client.get("/api/poi?query=Wawel")
    assert res.status_code == 200
    items = res.json()
    assert len(items) >= 1
    assert "Wawel" in items[0]["name"]

def test_evaluate_poi_endpoint():
    payload = {
        "min_door_width_cm": 85,
        "max_curb_cm": 2.0,
        "avoid_stairs": True,
        "avoid_rough_surfaces": False,
        "require_accessible_toilet": True
    }
    res = client.post("/api/poi/evaluate", json=payload)
    assert res.status_code == 200
    eval_list = res.json()
    assert len(eval_list) >= 5
    first_res = eval_list[0]
    assert "poi" in first_res
    assert "evaluation" in first_res
    assert "match_score" in first_res["evaluation"]

def test_routes_list_and_evaluate():
    res_list = client.get("/api/routes")
    assert res_list.status_code == 200
    routes = res_list.json()
    assert len(routes) >= 2
    
    # Ewaluacja trasy
    res_eval = client.post("/api/routes/evaluate/dworzec-rynek", json={"avoid_stairs": True})
    assert res_eval.status_code == 200
    route_data = res_eval.json()
    assert route_data["route_id"] == "dworzec-rynek"
    assert "segments" in route_data
    assert len(route_data["segments"]) > 0
