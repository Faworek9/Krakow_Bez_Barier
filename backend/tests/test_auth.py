import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.user import UserRole

client = TestClient(app)

def test_demo_login_user():
    """Weryfikacja logowania demonstracyjnego dla roli 'user'."""
    res = client.post("/api/auth/demo/user")
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "jan@krakowbezbarier.pl"
    assert data["user"]["role"] == "user"

def test_demo_login_business():
    """Weryfikacja logowania demonstracyjnego dla roli 'business'."""
    res = client.post("/api/auth/demo/business")
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "kontakt@kawiarniarelaks.pl"
    assert data["user"]["role"] == "business"
    assert data["user"]["business_info"] is not None
    assert data["user"]["business_info"]["company_name"] == "Kawiarnia Relaks sp. z o.o."

def test_register_and_login_new_user():
    """Weryfikacja pełnego cyklu rejestracji i logowania nowego mieszkańca."""
    email = "nowy_mieszkaniec_test@krakow.pl"
    reg_payload = {
        "email": email,
        "password": "moje_bezpieczne_haslo",
        "role": "user",
        "display_name": "Anna Nowak"
    }
    # Rejestracja
    res = client.post("/api/auth/register", json=reg_payload)
    assert res.status_code in [200, 400]  # 400 jeśli już istniał z poprzedniego testu

    # Logowanie
    login_payload = {
        "email": email,
        "password": "moje_bezpieczne_haslo"
    }
    res_login = client.post("/api/auth/login", json=login_payload)
    assert res_login.status_code == 200
    token = res_login.json()["access_token"]
    assert token is not None

    # Test endpointu /me
    res_me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res_me.status_code == 200
    assert res_me.json()["display_name"] == "Anna Nowak"

def test_business_can_add_place_and_user_cannot():
    """Weryfikacja uprawnień: tylko konto 'business' może dodawać oficjalny lokal."""
    # 1. Zalogowanie jako użytkownik indywidualny
    res_user = client.post("/api/auth/demo/user")
    user_token = res_user.json()["access_token"]

    place_payload = {
        "name": "Moja Testowa Kawiarnia Dostępna",
        "category": "kawiarnia",
        "address": "ul. Floriańska 22, Kraków",
        "district": "Stare Miasto",
        "entrance_width_cm": 95,
        "steps_at_entrance": 0,
        "has_ramp": False,
        "surface_type": "plyty_chodnikowe",
        "has_accessible_toilet": True,
        "has_elevator": False
    }

    # Użytkownik indywidualny nie może dodać
    res_forbidden = client.post(
        "/api/poi/business", 
        json=place_payload, 
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res_forbidden.status_code == 403

    # 2. Zalogowanie jako firma
    res_biz = client.post("/api/auth/demo/business")
    biz_token = res_biz.json()["access_token"]

    # Firma może dodać
    res_success = client.post(
        "/api/poi/business", 
        json=place_payload, 
        headers={"Authorization": f"Bearer {biz_token}"}
    )
    assert res_success.status_code == 200
    created_poi = res_success.json()
    assert created_poi["name"] == "Moja Testowa Kawiarnia Dostępna"
    assert created_poi["meta"]["credibility_level"] == "VERIFIED_OFFICIAL"
    assert "Relaks" in created_poi["meta"]["source_name"]
