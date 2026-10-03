from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.models.poi import UserPreferences, SurfaceType

class RouteSegment(BaseModel):
    step_number: int
    instruction: str
    distance_meters: int
    surface_type: SurfaceType
    curb_height_cm: float
    has_stairs: bool
    steps_count: int
    has_incline: bool
    incline_percent: Optional[float]
    warning: Optional[str] = None
    lat: float
    lng: float

class RouteResponse(BaseModel):
    route_id: str
    title: str
    total_distance_meters: int
    estimated_time_minutes: int
    surface_summary: Dict[str, float]       # np. {"asfalt": 65.0, "kostka_brukowa": 35.0}
    max_curb_cm: float
    total_stairs_count: int
    has_critical_barriers: bool
    accessibility_score: int                # 0-100
    accessibility_status: str               # "recommended", "passable_with_effort", "not_recommended"
    status_label_pl: str
    segments: List[RouteSegment]
    barriers_detected: List[str]
    advantages_detected: List[str]

# Predefiniowane trasy demonstracyjne w centrum Krakowa
DEMO_ROUTES: Dict[str, Dict[str, Any]] = {
    "dworzec-rynek": {
        "route_id": "dworzec-rynek",
        "title": "Kraków Główny PKP -> Sukiennice (Rynek Główny)",
        "total_distance_meters": 850,
        "estimated_time_minutes": 12,
        "surface_summary": {
            "plyty_chodnikowe": 55.0,
            "asfalt": 25.0,
            "kostka_brukowa": 20.0
        },
        "max_curb_cm": 1.5,
        "total_stairs_count": 0,
        "segments": [
            {
                "step_number": 1,
                "instruction": "Wyjazd windą z peronu dworca na płytę Dworca Głównego / Tunel Magda.",
                "distance_meters": 100,
                "surface_type": SurfaceType.INDOOR_TILES,
                "curb_height_cm": 0.0,
                "has_stairs": False,
                "steps_count": 0,
                "has_incline": False,
                "incline_percent": 0.0,
                "warning": None,
                "lat": 50.0672,
                "lng": 19.9485
            },
            {
                "step_number": 2,
                "instruction": "Przejazd przez plac Jana Nowaka-Jeziorańskiego w stronę ul. Lubicz i Plant.",
                "distance_meters": 200,
                "surface_type": SurfaceType.PAVING_SLABS,
                "curb_height_cm": 1.0,
                "has_stairs": False,
                "steps_count": 0,
                "has_incline": False,
                "incline_percent": 0.0,
                "warning": None,
                "lat": 50.0655,
                "lng": 19.9455
            },
            {
                "step_number": 3,
                "instruction": "Wejście w Planty Krakowskie przy Teatrze im. J. Słowackiego (obniżone krawężniki 1cm).",
                "distance_meters": 250,
                "surface_type": SurfaceType.ASPHALT,
                "curb_height_cm": 1.0,
                "has_stairs": False,
                "steps_count": 0,
                "has_incline": False,
                "incline_percent": 1.5,
                "warning": "Miejsca odpoczynku: ławki co 30 metrów",
                "lat": 50.0638,
                "lng": 19.9429
            },
            {
                "step_number": 4,
                "instruction": "Skręt w ul. Szpitalną w kierunku Rynku Głównego.",
                "distance_meters": 200,
                "surface_type": SurfaceType.PAVING_SLABS,
                "curb_height_cm": 1.5,
                "has_stairs": False,
                "steps_count": 0,
                "has_incline": False,
                "incline_percent": 0.0,
                "warning": None,
                "lat": 50.0628,
                "lng": 19.9395
            },
            {
                "step_number": 5,
                "instruction": "Wjazd na płytę Rynku Głównego w stronę Sukiennic.",
                "distance_meters": 100,
                "surface_type": SurfaceType.COBBLESTONE_SMOOTH,
                "curb_height_cm": 1.5,
                "has_stairs": False,
                "steps_count": 0,
                "has_incline": False,
                "incline_percent": 0.0,
                "warning": "Płyta Rynku posiada kostkę brukową – zalecane poruszanie się pasami z gładkich płyt granitowych.",
                "lat": 50.0617,
                "lng": 19.9373
            }
        ]
    },
    "rynek-wawel": {
        "route_id": "rynek-wawel",
        "title": "Rynek Główny -> Zamek Królewski na Wawelu",
        "total_distance_meters": 950,
        "estimated_time_minutes": 15,
        "surface_summary": {
            "plyty_chodnikowe": 60.0,
            "kocie_lby": 40.0
        },
        "max_curb_cm": 2.5,
        "total_stairs_count": 0,
        "segments": [
            {
                "step_number": 1,
                "instruction": "Rozpoczęcie od Sukiennic, przejazd w stronę ul. Grodzkiej.",
                "distance_meters": 150,
                "surface_type": SurfaceType.COBBLESTONE_SMOOTH,
                "curb_height_cm": 1.0,
                "has_stairs": False,
                "steps_count": 0,
                "has_incline": False,
                "incline_percent": 0.0,
                "warning": None,
                "lat": 50.0605,
                "lng": 19.9378
            },
            {
                "step_number": 2,
                "instruction": "Kontynuacja ul. Grodzką do Placu Wszystkich Świętych.",
                "distance_meters": 300,
                "surface_type": SurfaceType.PAVING_SLABS,
                "curb_height_cm": 1.5,
                "has_stairs": False,
                "steps_count": 0,
                "has_incline": False,
                "incline_percent": 0.0,
                "warning": "Przejazd przez torowisko tramwajowe na pl. Wszystkich Świętych – obniżone krawężniki.",
                "lat": 50.0585,
                "lng": 19.9385
            },
            {
                "step_number": 3,
                "instruction": "Skręt w malowniczą ul. Kanoniczą (kamienny trakt pod Wawel).",
                "distance_meters": 300,
                "surface_type": SurfaceType.COBBLESTONE_ROUGH,
                "curb_height_cm": 2.5,
                "has_stairs": False,
                "steps_count": 0,
                "has_incline": True,
                "incline_percent": 3.0,
                "warning": "Nawierzchnia typu kocie łby. Wózki i walizki mogą odczuwać znaczne drgania.",
                "lat": 50.0560,
                "lng": 19.9370
            },
            {
                "step_number": 4,
                "instruction": "Podejście pod bramę Wawelu (droga wjazdowa).",
                "distance_meters": 200,
                "surface_type": SurfaceType.COBBLESTONE_ROUGH,
                "curb_height_cm": 2.0,
                "has_stairs": False,
                "steps_count": 0,
                "has_incline": True,
                "incline_percent": 8.5,
                "warning": "Strome podejście (8.5%). Dla osób na wózkach manualnych zalecana asysta.",
                "lat": 50.0544,
                "lng": 19.9354
            }
        ]
    }
}

class RoutingService:
    def get_available_routes(self) -> List[Dict[str, Any]]:
        return [
            {"route_id": k, "title": v["title"], "distance_meters": v["total_distance_meters"]}
            for k, v in DEMO_ROUTES.items()
        ]

    def evaluate_route(self, route_id: str, prefs: UserPreferences) -> RouteResponse:
        data = DEMO_ROUTES.get(route_id, DEMO_ROUTES["dworzec-rynek"])
        
        barriers: List[str] = []
        advantages: List[str] = []
        score = 100
        has_critical = False
        
        # Analiza schodów
        if data["total_stairs_count"] > 0:
            if prefs.avoid_stairs:
                barriers.append(f"Na trasie występuje {data['total_stairs_count']} stopni schodów bez windy.")
                score -= 50
                has_critical = True
        else:
            advantages.append("Trasa bezschodowa (0 stopni na całej długości).")

        # Analiza krawężników
        if data["max_curb_cm"] > prefs.max_curb_cm:
            barriers.append(f"Maksymalny próg na trasie: {data['max_curb_cm']} cm (Twój limit: {prefs.max_curb_cm} cm).")
            score -= 20
        else:
            advantages.append(f"Krawężniki i zjazdy obniżone do {data['max_curb_cm']} cm.")

        # Analiza nawierzchni
        rough_pct = data["surface_summary"].get("kocie_lby", 0.0)
        if rough_pct > 0 and prefs.avoid_rough_surfaces:
            barriers.append(f"{rough_pct}% trasy to trudna nawierzchnia (kocie łby / stary bruk).")
            score -= int(rough_pct * 0.4)

        score = max(10, min(100, score))
        if score >= 80 and not has_critical:
            status = "recommended"
            status_label_pl = "Rekomendowana, w pełni dostępna trasa"
        elif score >= 50 and not has_critical:
            status = "passable_with_effort"
            status_label_pl = "Przejezdna, wymaga wzmożonej uwagi lub asysty"
        else:
            status = "not_recommended"
            status_label_pl = "Nierozpoznana lub odradzana ze względu na bariery"

        return RouteResponse(
            route_id=data["route_id"],
            title=data["title"],
            total_distance_meters=data["total_distance_meters"],
            estimated_time_minutes=data["estimated_time_minutes"],
            surface_summary=data["surface_summary"],
            max_curb_cm=data["max_curb_cm"],
            total_stairs_count=data["total_stairs_count"],
            has_critical_barriers=has_critical,
            accessibility_score=score,
            accessibility_status=status,
            status_label_pl=status_label_pl,
            segments=[RouteSegment(**s) for s in data["segments"]],
            barriers_detected=barriers,
            advantages_detected=advantages
        )

routing_service = RoutingService()
