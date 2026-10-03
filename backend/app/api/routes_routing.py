from fastapi import APIRouter
from app.models.poi import UserPreferences
from app.services.routing_service import routing_service, RouteResponse

router = APIRouter(prefix="/routes", tags=["Wyznaczanie Dostępnych Tras"])

@router.get("", summary="Lista dostępnych tras wzorcowych")
def list_demo_routes():
    return routing_service.get_available_routes()

@router.post("/evaluate/{route_id}", response_model=RouteResponse, summary="Oceń trasę pod kątem zadanego profilu potrzeb")
def evaluate_route(route_id: str, prefs: UserPreferences):
    return routing_service.evaluate_route(route_id, prefs)
