import math
import heapq
from typing import List, Optional, Dict, Any, Tuple
from pydantic import BaseModel, Field
from fastapi import HTTPException
from app.models.poi import UserPreferences, SurfaceType, POI
from app.services.krakow_data_service import repo

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
    path: List[List[float]] = Field(default_factory=list)

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

# Predefiniowane trasy demonstracyjne w centrum Krakowa z precyzyjnymi współrzędnymi ulic
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
                "lng": 19.9485,
                "path": [
                    [50.0672, 19.9485],
                    [50.0666, 19.9472],
                    [50.0658, 19.9460]
                ]
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
                "lng": 19.9455,
                "path": [
                    [50.0658, 19.9460],
                    [50.0652, 19.9450],
                    [50.0645, 19.9440],
                    [50.0638, 19.9429]
                ]
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
                "warning": "Miejsca odpoczynku: ławki co 30 metrów, gładki asfalt.",
                "lat": 50.0637,
                "lng": 19.9431,
                "path": [
                    [50.0638, 19.9429],
                    [50.0642, 19.9420],
                    [50.0649, 19.9415]
                ]
            },
            {
                "step_number": 4,
                "instruction": "Przejście obok Bramy Floriańskiej w deptak ul. Floriańskiej.",
                "distance_meters": 120,
                "surface_type": SurfaceType.PAVING_SLABS,
                "curb_height_cm": 1.5,
                "has_stairs": False,
                "steps_count": 0,
                "has_incline": False,
                "incline_percent": 0.0,
                "warning": None,
                "lat": 50.0649,
                "lng": 19.9415,
                "path": [
                    [50.0649, 19.9415],
                    [50.0640, 19.9404],
                    [50.0633, 19.9395]
                ]
            },
            {
                "step_number": 5,
                "instruction": "Wjazd na płytę Rynku Głównego wprost pod Sukiennice (gładka szlifowana kostka).",
                "distance_meters": 180,
                "surface_type": SurfaceType.COBBLESTONE_SMOOTH,
                "curb_height_cm": 1.0,
                "has_stairs": False,
                "steps_count": 0,
                "has_incline": False,
                "incline_percent": 0.0,
                "warning": None,
                "lat": 50.0617,
                "lng": 19.9373,
                "path": [
                    [50.0633, 19.9395],
                    [50.0625, 19.9384],
                    [50.0617, 19.9373]
                ]
            }
        ]
    },
    "rynek-wawel": {
        "route_id": "rynek-wawel",
        "title": "Sukiennice (Rynek Główny) -> Zamek Królewski na Wawelu",
        "total_distance_meters": 950,
        "estimated_time_minutes": 15,
        "surface_summary": {
            "kostka_brukowa": 50.0,
            "plyty_chodnikowe": 20.0,
            "kocie_lby": 30.0
        },
        "max_curb_cm": 2.5,
        "total_stairs_count": 0,
        "segments": [
            {
                "step_number": 1,
                "instruction": "Wyjazd z Rynku Głównego obok kościoła św. Wojciecha w ul. Grodzką.",
                "distance_meters": 150,
                "surface_type": SurfaceType.COBBLESTONE_SMOOTH,
                "curb_height_cm": 1.0,
                "has_stairs": False,
                "steps_count": 0,
                "has_incline": False,
                "incline_percent": 0.0,
                "warning": None,
                "lat": 50.0608,
                "lng": 19.9375,
                "path": [
                    [50.0617, 19.9373],
                    [50.0608, 19.9375],
                    [50.0598, 19.9378]
                ]
            },
            {
                "step_number": 2,
                "instruction": "Przejazd przez plac Wszystkich Świętych obok Urzędu Miasta Krakowa.",
                "distance_meters": 300,
                "surface_type": SurfaceType.PAVING_SLABS,
                "curb_height_cm": 1.5,
                "has_stairs": False,
                "steps_count": 0,
                "has_incline": False,
                "incline_percent": 0.0,
                "warning": "Przejazd przez torowisko tramwajowe z rowkami szynowymi.",
                "lat": 50.0588,
                "lng": 19.9382,
                "path": [
                    [50.0598, 19.9378],
                    [50.0588, 19.9382],
                    [50.0576, 19.9383]
                ]
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
                "lat": 50.0576,
                "lng": 19.9383,
                "path": [
                    [50.0576, 19.9383],
                    [50.0568, 19.9376],
                    [50.0560, 19.9370],
                    [50.0552, 19.9363]
                ]
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
                "warning": "Strome podejście (8.5%) i kocie łby. Dla osób na wózkach manualnych zalecana asysta.",
                "lat": 50.0552,
                "lng": 19.9363,
                "path": [
                    [50.0552, 19.9363],
                    [50.0548, 19.9358],
                    [50.0544, 19.9354]
                ]
            }
        ]
    }
}

# --- GRAF CIĄGÓW PIESZYCH KRAKOWA (KORYTARZE BEZ BARIER) ---
GRAPH_NODES: Dict[str, Dict[str, Any]] = {
    "HUB_DWORZEC_GLOWNY": {"name": "Kraków Główny (Dworzec Kolejowy)", "lat": 50.0668, "lng": 19.9482},
    "HUB_PLAC_NOWAKA": {"name": "Plac Jana Nowaka-Jeziorańskiego", "lat": 50.0655, "lng": 19.9455},
    "HUB_PLANTY_SLOWACKIEGO": {"name": "Planty przy Teatrze Słowackiego", "lat": 50.0637, "lng": 19.9431},
    "HUB_BASZTOWA_DLW": {"name": "ul. Basztowa / ul. Długa", "lat": 50.0662, "lng": 19.9388},
    "HUB_BRAMA_FLORIANSKA": {"name": "Brama Floriańska / Barbakan", "lat": 50.0649, "lng": 19.9415},
    "HUB_FLORIANSKA": {"name": "ul. Floriańska (deptak)", "lat": 50.0633, "lng": 19.9395},
    "HUB_SZCZEPANSKI": {"name": "Plac Szczepański", "lat": 50.0635, "lng": 19.9360},
    "HUB_SZEWSKA": {"name": "ul. Szewska", "lat": 50.0625, "lng": 19.9355},
    "HUB_RYNEK_GLOWNY": {"name": "Rynek Główny (Sukiennice)", "lat": 50.0617, "lng": 19.9373},
    "HUB_MALY_RYNEK": {"name": "Mały Rynek / ul. Mikołajska", "lat": 50.0618, "lng": 19.9395},
    "HUB_PLANTY_DOMINIKANSKA": {"name": "Planty / ul. Dominikańska", "lat": 50.0595, "lng": 19.9415},
    "HUB_WSZYSTKICH_SWIETYCH": {"name": "Plac Wszystkich Świętych / UMK", "lat": 50.0588, "lng": 19.9382},
    "HUB_GRODZKA_SENACKA": {"name": "ul. Grodzka (przy kościele św. Piotra i Pawła)", "lat": 50.0568, "lng": 19.9380},
    "HUB_KANONICZA": {"name": "ul. Kanonicza (historyczny trakt)", "lat": 50.0565, "lng": 19.9368},
    "HUB_PLANTY_PODZAMCZE": {"name": "Planty pod Wawelem", "lat": 50.0560, "lng": 19.9350},
    "HUB_WAWEL_BRAMA": {"name": "Zamek Królewski na Wawelu", "lat": 50.0544, "lng": 19.9354},
    "HUB_STRADOM": {"name": "ul. Stradomska / ul. Dietla", "lat": 50.0525, "lng": 19.9390},
    "HUB_DIETLA_STAROWISLNA": {"name": "ul. Dietla / ul. Starowiślna", "lat": 50.0545, "lng": 19.9445},
    "HUB_KAZIMIERZ_PLAC_NOWY": {"name": "Kazimierz - Plac Nowy", "lat": 50.0518, "lng": 19.9450},
    "HUB_KAZIMIERZ_SZEROKA": {"name": "Kazimierz - ul. Szeroka", "lat": 50.0528, "lng": 19.9478},
    "HUB_KAZIMIERZ_KRAKOWSKA": {"name": "Kazimierz - ul. Krakowska", "lat": 50.0512, "lng": 19.9448},
    "HUB_KAZIMIERZ_WOLNICA": {"name": "Kazimierz - Plac Wolnica", "lat": 50.0495, "lng": 19.9445},
    "HUB_KLADKA_KAZIMIERZ": {"name": "Kładka Bernatka (przyczółek Kazimierz)", "lat": 50.0490, "lng": 19.9472},
    "HUB_KLADKA_PODGORZE": {"name": "Kładka Bernatka (przyczółek Podgórze)", "lat": 50.0480, "lng": 19.9488},
    "HUB_NADWISLANSKA_CRICOTEKA": {"name": "Podgórze - Cricoteka / ul. Nadwiślańska", "lat": 50.0465, "lng": 19.9515},
    "HUB_PODGORZE_RYNEK": {"name": "Podgórze - Rynek Podgórski", "lat": 50.0455, "lng": 19.9490},
}

GRAPH_EDGES: List[Dict[str, Any]] = [
    {
        "u": "HUB_DWORZEC_GLOWNY",
        "v": "HUB_PLAC_NOWAKA",
        "distance_meters": 160,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 0.5,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Przejazd przez płytę Dworca Głównego na Plac Jana Nowaka-Jeziorańskiego.",
        "instruction_backward": "Przejazd przez Plac Jana Nowaka-Jeziorańskiego do wejścia na Dworzec Główny.",
        "path": [[50.0668, 19.9482], [50.0662, 19.9470], [50.0655, 19.9455]]
    },
    {
        "u": "HUB_PLAC_NOWAKA",
        "v": "HUB_PLANTY_SLOWACKIEGO",
        "distance_meters": 210,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Przejście w stronę Teatru Słowackiego i wjazd w aleję Plant.",
        "instruction_backward": "Przejście aleją Plant w kierunku Placu Jana Nowaka-Jeziorańskiego.",
        "path": [[50.0655, 19.9455], [50.0646, 19.9443], [50.0637, 19.9431]]
    },
    {
        "u": "HUB_PLAC_NOWAKA",
        "v": "HUB_BASZTOWA_DLW",
        "distance_meters": 490,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.5,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Wzdłuż ul. Basztowej (szeroki chodnik z płyt granitowych) ku ul. Długiej.",
        "instruction_backward": "Wzdłuż ul. Basztowej w stronę Dworca Głównego i Placu Nowaka-Jeziorańskiego.",
        "path": [[50.0655, 19.9455], [50.0660, 19.9420], [50.0662, 19.9388]]
    },
    {
        "u": "HUB_BASZTOWA_DLW",
        "v": "HUB_BRAMA_FLORIANSKA",
        "distance_meters": 230,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Przejście z ul. Basztowej pod Bramę Floriańską.",
        "instruction_backward": "Przejście z Bramy Floriańskiej w stronę skrzyżowania Basztowa / Długa.",
        "path": [[50.0662, 19.9388], [50.0655, 19.9402], [50.0649, 19.9415]]
    },
    {
        "u": "HUB_BASZTOWA_DLW",
        "v": "HUB_SZCZEPANSKI",
        "distance_meters": 350,
        "surface_type": SurfaceType.ASPHALT,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Aleja Plant od ul. Basztowej w stronę Placu Szczepańskiego.",
        "instruction_backward": "Aleja Plant z Placu Szczepańskiego w stronę ul. Basztowej.",
        "path": [[50.0662, 19.9388], [50.0648, 19.9372], [50.0635, 19.9360]]
    },
    {
        "u": "HUB_PLANTY_SLOWACKIEGO",
        "v": "HUB_BRAMA_FLORIANSKA",
        "distance_meters": 180,
        "surface_type": SurfaceType.ASPHALT,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Główna aleja Plant w stronę Barbakanu i Bramy Floriańskiej.",
        "instruction_backward": "Aleja Plant od Bramy Floriańskiej pod Teatr im. Słowackiego.",
        "path": [[50.0637, 19.9431], [50.0643, 19.9423], [50.0649, 19.9415]]
    },
    {
        "u": "HUB_PLANTY_SLOWACKIEGO",
        "v": "HUB_MALY_RYNEK",
        "distance_meters": 340,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.5,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Przejście ul. Mikołajską w kierunku Małego Rynku.",
        "instruction_backward": "Przejście z Małego Rynku ul. Mikołajską do Plant.",
        "path": [[50.0637, 19.9431], [50.0628, 19.9412], [50.0618, 19.9395]]
    },
    {
        "u": "HUB_PLANTY_SLOWACKIEGO",
        "v": "HUB_PLANTY_DOMINIKANSKA",
        "distance_meters": 480,
        "surface_type": SurfaceType.ASPHALT,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Główny asfaltowy trakt Plant w stronę Poczty Głównej i ul. Dominikańskiej.",
        "instruction_backward": "Aleja Plant od ul. Dominikańskiej w stronę Teatru Słowackiego.",
        "path": [[50.0637, 19.9431], [50.0616, 19.9423], [50.0595, 19.9415]]
    },
    {
        "u": "HUB_BRAMA_FLORIANSKA",
        "v": "HUB_FLORIANSKA",
        "distance_meters": 180,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Początkowy odcinek deptaku ul. Floriańskiej.",
        "instruction_backward": "Deptak ul. Floriańskiej w kierunku Bramy Floriańskiej.",
        "path": [[50.0649, 19.9415], [50.0641, 19.9405], [50.0633, 19.9395]]
    },
    {
        "u": "HUB_FLORIANSKA",
        "v": "HUB_RYNEK_GLOWNY",
        "distance_meters": 210,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Wjazd na płytę Rynku Głównego przy Kościele Mariackim.",
        "instruction_backward": "Wyjazd z Rynku Głównego w deptak ul. Floriańskiej.",
        "path": [[50.0633, 19.9395], [50.0625, 19.9384], [50.0617, 19.9373]]
    },
    {
        "u": "HUB_SZCZEPANSKI",
        "v": "HUB_SZEWSKA",
        "distance_meters": 120,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Przejście z Placu Szczepańskiego w stronę ul. Szewskiej.",
        "instruction_backward": "Przejście z ul. Szewskiej na płytę Placu Szczepańskiego.",
        "path": [[50.0635, 19.9360], [50.0630, 19.9358], [50.0625, 19.9355]]
    },
    {
        "u": "HUB_SZCZEPANSKI",
        "v": "HUB_RYNEK_GLOWNY",
        "distance_meters": 220,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "ul. Szczepańska wprost na płytę Rynku Głównego.",
        "instruction_backward": "Z Rynku Głównego ul. Szczepańską na Plac Szczepański.",
        "path": [[50.0635, 19.9360], [50.0626, 19.9367], [50.0617, 19.9373]]
    },
    {
        "u": "HUB_SZEWSKA",
        "v": "HUB_RYNEK_GLOWNY",
        "distance_meters": 170,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Deptak ul. Szewskiej na płytę Rynku Głównego.",
        "instruction_backward": "Z Rynku Głównego w głąb deptaku ul. Szewskiej.",
        "path": [[50.0625, 19.9355], [50.0621, 19.9364], [50.0617, 19.9373]]
    },
    {
        "u": "HUB_MALY_RYNEK",
        "v": "HUB_RYNEK_GLOWNY",
        "distance_meters": 160,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Pasaż łączący Mały Rynek z Sukiennicami na Rynku Głównym.",
        "instruction_backward": "Przejście z Rynku Głównego pod kamienice Małego Rynku.",
        "path": [[50.0618, 19.9395], [50.0617, 19.9384], [50.0617, 19.9373]]
    },
    {
        "u": "HUB_RYNEK_GLOWNY",
        "v": "HUB_WSZYSTKICH_SWIETYCH",
        "distance_meters": 320,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Przejście ul. Grodzką z Rynku na Plac Wszystkich Świętych.",
        "instruction_backward": "Przejście z Placu Wszystkich Świętych ul. Grodzką na Rynek.",
        "path": [[50.0617, 19.9373], [50.0602, 19.9378], [50.0588, 19.9382]]
    },
    {
        "u": "HUB_MALY_RYNEK",
        "v": "HUB_PLANTY_DOMINIKANSKA",
        "distance_meters": 310,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.5,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "ul. Sienna w stronę Plant i Poczty Głównej.",
        "instruction_backward": "Od Plant ul. Sienną na Mały Rynek.",
        "path": [[50.0618, 19.9395], [50.0607, 19.9405], [50.0595, 19.9415]]
    },
    {
        "u": "HUB_PLANTY_DOMINIKANSKA",
        "v": "HUB_WSZYSTKICH_SWIETYCH",
        "distance_meters": 250,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "ul. Dominikańska na Plac Wszystkich Świętych (UMK).",
        "instruction_backward": "Z Placu Wszystkich Świętych ul. Dominikańską w stronę Plant.",
        "path": [[50.0595, 19.9415], [50.0592, 19.9398], [50.0588, 19.9382]]
    },
    {
        "u": "HUB_WSZYSTKICH_SWIETYCH",
        "v": "HUB_GRODZKA_SENACKA",
        "distance_meters": 240,
        "surface_type": SurfaceType.COBBLESTONE_SMOOTH,
        "curb_height_cm": 1.5,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "ul. Grodzka - deptak z równych płyt i szlifowanego kamienia.",
        "instruction_backward": "ul. Grodzka w stronę Placu Wszystkich Świętych i Magistratu.",
        "path": [[50.0588, 19.9382], [50.0578, 19.9381], [50.0568, 19.9380]]
    },
    {
        "u": "HUB_WSZYSTKICH_SWIETYCH",
        "v": "HUB_KANONICZA",
        "distance_meters": 270,
        "surface_type": SurfaceType.COBBLESTONE_ROUGH,
        "curb_height_cm": 2.5,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 2.0,
        "warning": "Nawierzchnia typu kocie łby. Wózki i walizki mogą odczuwać silne drgania.",
        "instruction_forward": "ul. Kanonicza - historyczny trakt kamienny (uwaga: kocie łby).",
        "instruction_backward": "ul. Kanonicza w stronę Placu Wszystkich Świętych (kocie łby).",
        "path": [[50.0588, 19.9382], [50.0576, 19.9374], [50.0565, 19.9368]]
    },
    {
        "u": "HUB_WSZYSTKICH_SWIETYCH",
        "v": "HUB_PLANTY_PODZAMCZE",
        "distance_meters": 390,
        "surface_type": SurfaceType.ASPHALT,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "ul. Franciszkańska i wjazd w gładką asfaltową aleję Plant ku Wawelowi.",
        "instruction_backward": "Aleja Plant od Wawelu ku ul. Franciszkańskiej i pl. Wszystkich Świętych.",
        "path": [[50.0588, 19.9382], [50.0574, 19.9366], [50.0560, 19.9350]]
    },
    {
        "u": "HUB_GRODZKA_SENACKA",
        "v": "HUB_WAWEL_BRAMA",
        "distance_meters": 280,
        "surface_type": SurfaceType.COBBLESTONE_SMOOTH,
        "curb_height_cm": 1.5,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": True,
        "incline_percent": 4.5,
        "instruction_forward": "Podejście pod Bramę Herbową Wawelu od ul. Grodzkiej (szlifowany kamień).",
        "instruction_backward": "Zejście spod Wawelu w ul. Grodzką.",
        "path": [[50.0568, 19.9380], [50.0556, 19.9367], [50.0544, 19.9354]]
    },
    {
        "u": "HUB_KANONICZA",
        "v": "HUB_WAWEL_BRAMA",
        "distance_meters": 250,
        "surface_type": SurfaceType.COBBLESTONE_ROUGH,
        "curb_height_cm": 2.5,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": True,
        "incline_percent": 5.5,
        "warning": "Strome podejście i kocie łby pod bramą zamkową.",
        "instruction_forward": "Zjazd z ul. Kanoniczej pod bramę Wawelu (nierówna kostka bazaltowa).",
        "instruction_backward": "Od bramy Wawelu w ul. Kanoniczą (kocie łby).",
        "path": [[50.0565, 19.9368], [50.0554, 19.9361], [50.0544, 19.9354]]
    },
    {
        "u": "HUB_PLANTY_PODZAMCZE",
        "v": "HUB_WAWEL_BRAMA",
        "distance_meters": 210,
        "surface_type": SurfaceType.ASPHALT,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": True,
        "incline_percent": 3.5,
        "instruction_forward": "Łagodny asfaltowy podjazd pod Wawel od strony Plant.",
        "instruction_backward": "Łagodny zjazd spod Wawelu w aleję Plant.",
        "path": [[50.0560, 19.9350], [50.0552, 19.9352], [50.0544, 19.9354]]
    },
    {
        "u": "HUB_GRODZKA_SENACKA",
        "v": "HUB_STRADOM",
        "distance_meters": 490,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.5,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Przejście wzdłuż ul. Stradomskiej w stronę Kazimierza.",
        "instruction_backward": "ul. Stradomska w stronę Wawelu i ul. Grodzkiej.",
        "path": [[50.0568, 19.9380], [50.0546, 19.9385], [50.0525, 19.9390]]
    },
    {
        "u": "HUB_WAWEL_BRAMA",
        "v": "HUB_STRADOM",
        "distance_meters": 340,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.5,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 2.0,
        "instruction_forward": "Zejście ul. św. Idziego do ul. Stradomskiej.",
        "instruction_backward": "Podejście z ul. Stradomskiej pod mury Wawelu.",
        "path": [[50.0544, 19.9354], [50.0534, 19.9372], [50.0525, 19.9390]]
    },
    {
        "u": "HUB_STRADOM",
        "v": "HUB_DIETLA_STAROWISLNA",
        "distance_meters": 450,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.5,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Szeroki ciąg pieszy ul. Dietla w stronę ul. Starowiślnej.",
        "instruction_backward": "ul. Dietla w stronę skrzyżowania ze Stradomską.",
        "path": [[50.0525, 19.9390], [50.0535, 19.9418], [50.0545, 19.9445]]
    },
    {
        "u": "HUB_STRADOM",
        "v": "HUB_KAZIMIERZ_KRAKOWSKA",
        "distance_meters": 190,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Wjazd na Kazimierz przez zrewitalizowaną ul. Krakowską (równe płyty).",
        "instruction_backward": "Wyjazd z ul. Krakowskiej w stronę ul. Stradomskiej.",
        "path": [[50.0525, 19.9390], [50.0519, 19.9419], [50.0512, 19.9448]]
    },
    {
        "u": "HUB_STRADOM",
        "v": "HUB_KAZIMIERZ_PLAC_NOWY",
        "distance_meters": 440,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 2.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "ul. Meiselsa w kierunku Placu Nowego na Kazimierzu.",
        "instruction_backward": "Z Placu Nowego ul. Meiselsa ku ul. Stradomskiej.",
        "path": [[50.0525, 19.9390], [50.0521, 19.9420], [50.0518, 19.9450]]
    },
    {
        "u": "HUB_DIETLA_STAROWISLNA",
        "v": "HUB_KAZIMIERZ_SZEROKA",
        "distance_meters": 310,
        "surface_type": SurfaceType.COBBLESTONE_SMOOTH,
        "curb_height_cm": 1.5,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "ul. Miodowa w stronę zabytkowej ul. Szerokiej.",
        "instruction_backward": "Z ul. Szerokiej ku skrzyżowaniu Dietla / Starowiślna.",
        "path": [[50.0545, 19.9445], [50.0536, 19.9462], [50.0528, 19.9478]]
    },
    {
        "u": "HUB_KAZIMIERZ_PLAC_NOWY",
        "v": "HUB_KAZIMIERZ_SZEROKA",
        "distance_meters": 230,
        "surface_type": SurfaceType.COBBLESTONE_SMOOTH,
        "curb_height_cm": 1.5,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "ul. Nowa i Lewkowa łączące Plac Nowy z ul. Szeroką.",
        "instruction_backward": "Przejście z ul. Szerokiej na Plac Nowy.",
        "path": [[50.0518, 19.9450], [50.0523, 19.9464], [50.0528, 19.9478]]
    },
    {
        "u": "HUB_KAZIMIERZ_PLAC_NOWY",
        "v": "HUB_KAZIMIERZ_KRAKOWSKA",
        "distance_meters": 180,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Łącznik z Placu Nowego do ul. Krakowskiej.",
        "instruction_backward": "Z ul. Krakowskiej ku Placowi Nowemu.",
        "path": [[50.0518, 19.9450], [50.0515, 19.9449], [50.0512, 19.9448]]
    },
    {
        "u": "HUB_KAZIMIERZ_KRAKOWSKA",
        "v": "HUB_KAZIMIERZ_WOLNICA",
        "distance_meters": 220,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Zejście ul. Krakowską na płytę Placu Wolnica.",
        "instruction_backward": "Z Placu Wolnica w głąb ul. Krakowskiej.",
        "path": [[50.0512, 19.9448], [50.0503, 19.9446], [50.0495, 19.9445]]
    },
    {
        "u": "HUB_KAZIMIERZ_PLAC_NOWY",
        "v": "HUB_KAZIMIERZ_WOLNICA",
        "distance_meters": 270,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.5,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "ul. Bożego Ciała w stronę Placu Wolnica.",
        "instruction_backward": "Z Placu Wolnica ul. Bożego Ciała na Plac Nowy.",
        "path": [[50.0518, 19.9450], [50.0506, 19.9448], [50.0495, 19.9445]]
    },
    {
        "u": "HUB_KAZIMIERZ_WOLNICA",
        "v": "HUB_KLADKA_KAZIMIERZ",
        "distance_meters": 220,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "ul. Mostowa w stronę Wisły i rampy Kładki Bernatka.",
        "instruction_backward": "Zejście z Kładki Bernatka w ul. Mostową ku Placowi Wolnica.",
        "path": [[50.0495, 19.9445], [50.0492, 19.9458], [50.0490, 19.9472]]
    },
    {
        "u": "HUB_KLADKA_KAZIMIERZ",
        "v": "HUB_KLADKA_PODGORZE",
        "distance_meters": 150,
        "surface_type": SurfaceType.ASPHALT,
        "curb_height_cm": 0.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": True,
        "incline_percent": 4.0,
        "instruction_forward": "Przeprawa przez Wisłę - Kładka Ojca Bernatka (pomost pieszy bez barier).",
        "instruction_backward": "Przeprawa Kładką Ojca Bernatka na stronę Kazimierza (pomost bez barier).",
        "path": [[50.0490, 19.9472], [50.0485, 19.9480], [50.0480, 19.9488]]
    },
    {
        "u": "HUB_KLADKA_PODGORZE",
        "v": "HUB_NADWISLANSKA_CRICOTEKA",
        "distance_meters": 240,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.0,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "Bulwar Podgórski i ul. Nadwiślańska pod Ośrodek Cricoteka.",
        "instruction_backward": "Z ul. Nadwiślańskiej ku rampie Kładki Bernatka.",
        "path": [[50.0480, 19.9488], [50.0472, 19.9501], [50.0465, 19.9515]]
    },
    {
        "u": "HUB_KLADKA_PODGORZE",
        "v": "HUB_PODGORZE_RYNEK",
        "distance_meters": 290,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.5,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "ul. Brodzińskiego w stronę Rynku Podgórskiego.",
        "instruction_backward": "Z Rynku Podgórskiego ku Kładce Bernatka.",
        "path": [[50.0480, 19.9488], [50.0468, 19.9489], [50.0455, 19.9490]]
    },
    {
        "u": "HUB_NADWISLANSKA_CRICOTEKA",
        "v": "HUB_PODGORZE_RYNEK",
        "distance_meters": 260,
        "surface_type": SurfaceType.PAVING_SLABS,
        "curb_height_cm": 1.5,
        "has_stairs": False,
        "steps_count": 0,
        "has_incline": False,
        "incline_percent": 0.0,
        "instruction_forward": "ul. Nadwiślańska i Kalwaryjska ku Rynkowi Podgórskiemu.",
        "instruction_backward": "Z Rynku Podgórskiego ku Ośrodkowi Cricoteka.",
        "path": [[50.0465, 19.9515], [50.0460, 19.9502], [50.0455, 19.9490]]
    }
]

def haversine_distance_meters(lat1: float, lng1: float, lat2: float, lng2: float) -> int:
    R = 6371000
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return max(1, int(round(R * c)))

class RoutingService:
    def __init__(self):
        self._adj: Dict[str, List[Tuple[str, Dict[str, Any], bool]]] = {}
        self._build_graph()

    def _build_graph(self):
        for node_id in GRAPH_NODES:
            self._adj[node_id] = []
        for edge in GRAPH_EDGES:
            u = edge["u"]
            v = edge["v"]
            self._adj[u].append((v, edge, True))
            self._adj[v].append((u, edge, False))

    def _find_nearest_hub(self, lat: float, lng: float) -> Tuple[str, int]:
        best_node = "HUB_RYNEK_GLOWNY"
        min_dist = float("inf")
        for node_id, data in GRAPH_NODES.items():
            d = haversine_distance_meters(lat, lng, data["lat"], data["lng"])
            if d < min_dist:
                min_dist = d
                best_node = node_id
        return best_node, int(min_dist)

    def _edge_cost(self, edge: Dict[str, Any], prefs: UserPreferences) -> float:
        cost = float(edge["distance_meters"])
        if edge.get("has_stairs", False):
            if prefs.avoid_stairs:
                cost += 100000.0 + edge.get("steps_count", 0) * 1000.0
            else:
                cost += edge.get("steps_count", 0) * 20.0
        
        # Penalizacja kocich łbów (nierównego bruku) gdy włączona preferencja
        if edge["surface_type"] == SurfaceType.COBBLESTONE_ROUGH:
            if prefs.avoid_rough_surfaces:
                cost += edge["distance_meters"] * 12.0 + 5000.0
            else:
                cost += edge["distance_meters"] * 0.2

        # Krawężniki powyżej progu użytkownika
        if edge["curb_height_cm"] > prefs.max_curb_cm:
            cost += (edge["curb_height_cm"] - prefs.max_curb_cm) * 1500.0

        # Strome nachylenie
        if edge.get("has_incline") and edge.get("incline_percent"):
            if edge["incline_percent"] > 5.0:
                cost += edge["distance_meters"] * (edge["incline_percent"] / 4.0)
        return cost

    def _find_shortest_path(self, start_hub: str, dest_hub: str, prefs: UserPreferences) -> List[Tuple[Dict[str, Any], bool]]:
        """Dijkstra pathfinding uwzględniający bariery i preferencje użytkownika."""
        if start_hub == dest_hub:
            return []
        
        # heapq: (cost, node, path)
        pq: List[Tuple[float, str, List[Tuple[Dict[str, Any], bool]]]] = [(0.0, start_hub, [])]
        best_costs: Dict[str, float] = {start_hub: 0.0}

        while pq:
            cost, u, path = heapq.heappop(pq)
            if u == dest_hub:
                return path
            if cost > best_costs.get(u, float("inf")):
                continue

            for v, edge, is_forward in self._adj.get(u, []):
                e_cost = self._edge_cost(edge, prefs)
                new_cost = cost + e_cost
                if new_cost < best_costs.get(v, float("inf")):
                    best_costs[v] = new_cost
                    new_path = path + [(edge, is_forward)]
                    heapq.heappush(pq, (new_cost, v, new_path))
        return []

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

    def plan_custom_route(self, start_poi_id: str, dest_poi_id: str, prefs: UserPreferences) -> RouteResponse:
        """
        Dynamicznie wyznacza spersonalizowaną trasę pieszą/wózkową między dowolnymi dwoma obiektami w bazie,
        kalkulując koszty nawierzchni, schodów i krawężników zgodnie z profilem potrzeb.
        """
        start_poi = repo.get_place_by_id(start_poi_id)
        dest_poi = repo.get_place_by_id(dest_poi_id)

        if not start_poi or not dest_poi:
            raise HTTPException(status_code=404, detail="Nie znaleziono obiektu startowego lub docelowego.")

        # Przypadek 1: Start i cel to ten sam obiekt
        if start_poi.id == dest_poi.id:
            s_type = start_poi.features.surface_type or SurfaceType.PAVING_SLABS
            c_height = start_poi.features.max_curb_cm or 0.5
            return RouteResponse(
                route_id=f"custom_{start_poi.id}_{dest_poi.id}",
                title=f"{start_poi.name} (Jesteś na miejscu)",
                total_distance_meters=0,
                estimated_time_minutes=0,
                surface_summary={s_type.value: 100.0},
                max_curb_cm=c_height,
                total_stairs_count=0,
                has_critical_barriers=False,
                accessibility_score=100,
                accessibility_status="recommended",
                status_label_pl="Jesteś u celu trasy",
                segments=[
                    RouteSegment(
                        step_number=1,
                        instruction=f"Jesteś już w wybranym obiekcie docelowym: {start_poi.name} ({start_poi.address}).",
                        distance_meters=0,
                        surface_type=s_type,
                        curb_height_cm=c_height,
                        has_stairs=False,
                        steps_count=0,
                        has_incline=False,
                        incline_percent=0.0,
                        warning=None,
                        lat=start_poi.location.lat,
                        lng=start_poi.location.lng,
                        path=[[start_poi.location.lat, start_poi.location.lng]]
                    )
                ],
                barriers_detected=[],
                advantages_detected=["Punkt początkowy jest jednocześnie punktem docelowym."]
            )

        # Dopasowanie do najbliższych węzłów siatki pieszej Krakowa
        start_hub, dist_start = self._find_nearest_hub(start_poi.location.lat, start_poi.location.lng)
        dest_hub, dist_dest = self._find_nearest_hub(dest_poi.location.lat, dest_poi.location.lng)

        segments: List[RouteSegment] = []
        step_counter = 1

        # Krok początkowy łącznikowy (jeśli odległość od start_poi do start_hub > 20m)
        if dist_start > 20:
            hub_info = GRAPH_NODES[start_hub]
            s_type = start_poi.features.surface_type if start_poi.features.surface_type != SurfaceType.UNKNOWN else SurfaceType.PAVING_SLABS
            c_curb = start_poi.features.max_curb_cm or 1.0
            segments.append(
                RouteSegment(
                    step_number=step_counter,
                    instruction=f"Wyjście z: {start_poi.name} i przejście w stronę węzła: {hub_info['name']}.",
                    distance_meters=dist_start,
                    surface_type=s_type,
                    curb_height_cm=c_curb,
                    has_stairs=False,
                    steps_count=0,
                    has_incline=False,
                    incline_percent=None,
                    warning=None,
                    lat=start_poi.location.lat,
                    lng=start_poi.location.lng,
                    path=[[start_poi.location.lat, start_poi.location.lng], [hub_info["lat"], hub_info["lng"]]]
                )
            )
            step_counter += 1

        # Wyznaczenie ścieżki w grafie
        if start_hub == dest_hub:
            # Obiekty są w pobliżu tego samego węzła - bezpośredni odcinek
            direct_dist = haversine_distance_meters(
                start_poi.location.lat, start_poi.location.lng,
                dest_poi.location.lat, dest_poi.location.lng
            )
            if direct_dist > 10:
                s_type = dest_poi.features.surface_type if dest_poi.features.surface_type != SurfaceType.UNKNOWN else SurfaceType.PAVING_SLABS
                c_curb = max(start_poi.features.max_curb_cm or 1.0, dest_poi.features.max_curb_cm or 1.0)
                segments.append(
                    RouteSegment(
                        step_number=step_counter,
                        instruction=f"Przejście piesze z {start_poi.name} bezpośrednio do {dest_poi.name}.",
                        distance_meters=direct_dist,
                        surface_type=s_type,
                        curb_height_cm=c_curb,
                        has_stairs=False,
                        steps_count=0,
                        has_incline=False,
                        incline_percent=None,
                        warning=None,
                        lat=dest_poi.location.lat,
                        lng=dest_poi.location.lng,
                        path=[[start_poi.location.lat, start_poi.location.lng], [dest_poi.location.lat, dest_poi.location.lng]]
                    )
                )
                step_counter += 1
        else:
            path_edges = self._find_shortest_path(start_hub, dest_hub, prefs)
            for edge, is_forward in path_edges:
                edge_path = edge["path"] if is_forward else list(reversed(edge["path"]))
                instruction = edge["instruction_forward"] if is_forward else edge["instruction_backward"]
                segments.append(
                    RouteSegment(
                        step_number=step_counter,
                        instruction=instruction,
                        distance_meters=edge["distance_meters"],
                        surface_type=edge["surface_type"],
                        curb_height_cm=edge["curb_height_cm"],
                        has_stairs=edge.get("has_stairs", False),
                        steps_count=edge.get("steps_count", 0),
                        has_incline=edge.get("has_incline", False),
                        incline_percent=edge.get("incline_percent", None),
                        warning=edge.get("warning", None),
                        lat=edge_path[0][0],
                        lng=edge_path[0][1],
                        path=edge_path
                    )
                )
                step_counter += 1

        # Krok końcowy łącznikowy (jeśli odległość od dest_hub do dest_poi > 20m)
        if dist_dest > 20 and start_hub != dest_hub:
            hub_info = GRAPH_NODES[dest_hub]
            s_type = dest_poi.features.surface_type if dest_poi.features.surface_type != SurfaceType.UNKNOWN else SurfaceType.PAVING_SLABS
            c_curb = dest_poi.features.max_curb_cm or 1.0
            segments.append(
                RouteSegment(
                    step_number=step_counter,
                    instruction=f"Dojście od węzła {hub_info['name']} do wejścia do obiektu: {dest_poi.name}.",
                    distance_meters=dist_dest,
                    surface_type=s_type,
                    curb_height_cm=c_curb,
                    has_stairs=False,
                    steps_count=0,
                    has_incline=False,
                    incline_percent=None,
                    warning=None,
                    lat=hub_info["lat"],
                    lng=hub_info["lng"],
                    path=[[hub_info["lat"], hub_info["lng"]], [dest_poi.location.lat, dest_poi.location.lng]]
                )
            )

        # Zabezpieczenie przed pustą listą segmentów
        if not segments:
            segments.append(
                RouteSegment(
                    step_number=1,
                    instruction=f"Przejście piesze z {start_poi.name} do {dest_poi.name}.",
                    distance_meters=max(20, dist_start + dist_dest),
                    surface_type=SurfaceType.PAVING_SLABS,
                    curb_height_cm=1.0,
                    has_stairs=False,
                    steps_count=0,
                    has_incline=False,
                    incline_percent=None,
                    warning=None,
                    lat=start_poi.location.lat,
                    lng=start_poi.location.lng,
                    path=[[start_poi.location.lat, start_poi.location.lng], [dest_poi.location.lat, dest_poi.location.lng]]
                )
            )

        total_distance = sum(s.distance_meters for s in segments)
        estimated_time = max(1, int(round(total_distance / 65.0)))

        # Obliczenie procentowego udziału nawierzchni
        surface_dist: Dict[str, int] = {}
        for s in segments:
            st = s.surface_type.value
            surface_dist[st] = surface_dist.get(st, 0) + s.distance_meters

        surface_summary: Dict[str, float] = {}
        for st, dist in surface_dist.items():
            surface_summary[st] = round((dist / max(1, total_distance)) * 100.0, 1)

        max_curb = max(s.curb_height_cm for s in segments) if segments else 1.0
        total_stairs = sum(s.steps_count for s in segments)

        # Ocena dostępności i bariery
        barriers: List[str] = []
        advantages: List[str] = []
        score = 100
        has_critical = False

        if total_stairs > 0:
            if prefs.avoid_stairs:
                barriers.append(f"Na trasie występuje {total_stairs} stopni schodów bez windy.")
                score -= 50
                has_critical = True
        else:
            advantages.append("Trasa bezschodowa (0 stopni na całej długości).")

        if max_curb > prefs.max_curb_cm:
            barriers.append(f"Maksymalny próg na trasie: {max_curb} cm (Twój limit: {prefs.max_curb_cm} cm).")
            score -= 20
        else:
            advantages.append(f"Krawężniki i zjazdy nie przekraczają {max_curb} cm.")

        rough_pct = surface_summary.get("kocie_lby", 0.0)
        if rough_pct > 0 and prefs.avoid_rough_surfaces:
            barriers.append(f"{rough_pct}% trasy to trudna nawierzchnia (kocie łby / stary bruk).")
            score -= int(rough_pct * 0.4)
        elif rough_pct == 0.0:
            advantages.append("Trasa omija nierówne kocie łby i stary bruk.")

        smooth_pct = surface_summary.get("asfalt", 0.0) + surface_summary.get("plyty_chodnikowe", 0.0)
        if smooth_pct >= 60.0:
            advantages.append(f"Większość trasy ({smooth_pct:.0f}%) posiada gładką nawierzchnię (asfalt i płyty).")

        score = max(15, min(100, score))
        if score >= 80 and not has_critical:
            status = "recommended"
            status_label_pl = "Rekomendowana, w pełni dostępna trasa"
        elif score >= 50 and not has_critical:
            status = "passable_with_effort"
            status_label_pl = "Przejezdna, wymaga wzmożonej uwagi lub asysty"
        else:
            status = "not_recommended"
            status_label_pl = "Odradzana ze względu na wykryte bariery"

        return RouteResponse(
            route_id=f"custom_{start_poi.id}_{dest_poi.id}",
            title=f"{start_poi.name} -> {dest_poi.name}",
            total_distance_meters=total_distance,
            estimated_time_minutes=estimated_time,
            surface_summary=surface_summary,
            max_curb_cm=max_curb,
            total_stairs_count=total_stairs,
            has_critical_barriers=has_critical,
            accessibility_score=score,
            accessibility_status=status,
            status_label_pl=status_label_pl,
            segments=segments,
            barriers_detected=barriers,
            advantages_detected=advantages
        )

routing_service = RoutingService()
