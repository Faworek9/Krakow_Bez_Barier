from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field

class CredibilityLevel(str, Enum):
    VERIFIED_OFFICIAL = "VERIFIED_OFFICIAL"       # Oficjalny audyt UMK / zarządca obiektu
    VERIFIED_COMMUNITY = "VERIFIED_COMMUNITY"     # Zweryfikowane przez 3+ użytkowników / fundację
    OPEN_DATA_IMPORT = "OPEN_DATA_IMPORT"         # Import z OpenStreetMap / Otwarte Dane
    UNVERIFIED_REPORT = "UNVERIFIED_REPORT"       # Pojedyncze niezweryfikowane zgłoszenie
    DATA_GAP = "DATA_GAP"                         # Istotne braki danych

class SurfaceType(str, Enum):
    ASPHALT = "asfalt"
    PAVING_SLABS = "plyty_chodnikowe"
    COBBLESTONE_SMOOTH = "kostka_brukowa"
    COBBLESTONE_ROUGH = "kocie_lby"
    GRAVEL = "szuter"
    INDOOR_TILES = "plytki_wewnetrzne"
    UNKNOWN = "nieznana"

class ElevatorInfo(BaseModel):
    available: bool = False
    cabin_dimensions: Optional[str] = None  # np. "110x140 cm"
    door_width_cm: Optional[int] = None
    has_braille: bool = False
    has_audio_signals: bool = False

class ToiletInfo(BaseModel):
    available: bool = False
    entry_flat: bool = False                # brak progu
    door_width_cm: Optional[int] = None
    has_grab_rails: bool = False           # poręcze/uchwyty
    has_emergency_cord: bool = False       # sznurek alarmowy
    wheelchair_turning_space: bool = False # przestrzeń manewrowa >= 150cm

class AccessibilityFeatures(BaseModel):
    entrance_width_cm: Optional[int] = None
    steps_at_entrance: Optional[int] = None
    has_ramp: Optional[bool] = None
    ramp_slope_percent: Optional[float] = None
    max_curb_cm: Optional[float] = None
    door_type: Optional[str] = None  # np. "automatyczne", "przesuwne", "reczne_lekkie", "reczne_ciezkie"
    surface_type: SurfaceType = SurfaceType.UNKNOWN
    elevator: ElevatorInfo = Field(default_factory=ElevatorInfo)
    accessible_toilet: ToiletInfo = Field(default_factory=ToiletInfo)
    rest_places_nearby: bool = False       # ławeczki z oparciem
    hearing_loop: bool = False             # pętla indukcyjna
    guide_dog_allowed: bool = True
    tactile_paving: bool = False           # oznaczenia fakturowe dla niewidomych

class DataProvenance(BaseModel):
    source_name: str                       # np. "Miejski Audyt Dostępności UMK"
    source_url: Optional[str] = None
    last_verified_at: str                  # ISO data, np. "2026-06-15"
    credibility_level: CredibilityLevel = CredibilityLevel.OPEN_DATA_IMPORT
    credibility_score: int = Field(ge=0, le=100, default=60)
    has_data_gaps: bool = False
    data_gaps: List[str] = []              # np. ["Brak danych o szerokości drzwi"]
    verified_by: Optional[str] = None

class Coordinates(BaseModel):
    lat: float
    lng: float

class POI(BaseModel):
    id: str
    name: str
    category: str                          # muzeum, urzad, dworzec, zabytek, kawiarnia, park, toaleta
    address: str
    district: Optional[str] = "Śródmieście"
    location: Coordinates
    description: Optional[str] = None
    features: AccessibilityFeatures
    meta: DataProvenance

class UserPreferences(BaseModel):
    """
    Profil potrzeb ruchowych i preferencji.
    RODO / Privacy-first: Użytkownik NIE podaje jednostki chorobowej ani orzeczenia!
    Wybiera wyłącznie parametry fizyczne, których potrzebuje.
    """
    preset_name: Optional[str] = None      # "wheelchair", "stroller", "luggage", "senior", "custom"
    min_door_width_cm: int = 80
    max_curb_cm: float = 2.0
    avoid_stairs: bool = True
    avoid_rough_surfaces: bool = False     # unikanie kocich łbów / nierównego bruku
    require_elevator_if_multi_floor: bool = True
    require_accessible_toilet: bool = False
    require_rest_places: bool = False
    require_hearing_loop: bool = False

class AccessibilityEvaluation(BaseModel):
    poi_id: str
    match_score: int                       # 0 - 100 %
    status: str                            # "ideal", "good", "warning", "inaccessible", "insufficient_data"
    status_label_pl: str
    advantages: List[str]                  # udogodnienia spełniające potrzeby
    barriers: List[str]                    # wykryte przeszkody (np. "Schody: 4 stopnie bez rampy")
    data_gap_warnings: List[str]           # ostrzeżenia o brakach danych
    can_access_independently: bool
