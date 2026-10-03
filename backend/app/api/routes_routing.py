from fastapi import APIRouter
from pydantic import BaseModel
from app.models.poi import UserPreferences
from app.services.routing_service import routing_service, RouteResponse

router = APIRouter(prefix="/routes", tags=["Wyznaczanie Dostępnych Tras"])

class CustomRouteRequest(BaseModel):
    start_poi_id: str
    destination_poi_id: str
    preferences: UserPreferences

@router.get("", summary="Lista dostępnych tras wzorcowych")
def list_demo_routes():
    return routing_service.get_available_routes()

@router.post("/evaluate/{route_id}", response_model=RouteResponse, summary="Oceń trasę pod kątem zadanego profilu potrzeb")
def evaluate_route(route_id: str, prefs: UserPreferences):
    return routing_service.evaluate_route(route_id, prefs)

@router.post("/custom", response_model=RouteResponse, summary="Wyznacz trasę między dowolnymi dwoma obiektami")
def plan_custom_route(req: CustomRouteRequest):
    return routing_service.plan_custom_route(req.start_poi_id, req.destination_poi_id, req.preferences)
