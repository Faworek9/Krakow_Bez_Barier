from enum import Enum
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr

class UserRole(str, Enum):
    USER = "user"          # Mieszkaniec / Turysta / Recenzent
    BUSINESS = "business"  # Właściciel Lokalu / Firma / Partner
    ADMIN = "admin"        # Moderator miejski

class BusinessInfo(BaseModel):
    company_name: str
    nip: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    verified_business: bool = True

class User(BaseModel):
    id: str
    email: str
    role: UserRole = UserRole.USER
    display_name: str
    password_hash: str
    salt: str
    created_at: str
    business_info: Optional[BusinessInfo] = None
    reputation_points: int = 10  # Punkty zaufania recenzenta

class UserResponse(BaseModel):
    id: str
    email: str
    role: UserRole
    display_name: str
    business_info: Optional[BusinessInfo] = None
    created_at: str
    reputation_points: int

class UserRegisterRequest(BaseModel):
    email: str
    password: str
    role: UserRole = UserRole.USER
    display_name: str
    # Opcjonalne pola firmowe
    company_name: Optional[str] = None
    nip: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class BusinessPlaceCreateRequest(BaseModel):
    name: str
    category: str = "kawiarnia"
    address: str
    district: str = "Stare Miasto"
    description: Optional[str] = None
    lat: Optional[float] = 50.0614
    lng: Optional[float] = 19.9365
    # Cechy dostępności
    entrance_width_cm: int = 90
    steps_at_entrance: int = 0
    has_ramp: bool = False
    ramp_slope_percent: Optional[float] = None
    max_curb_cm: float = 1.0
    surface_type: str = "kostka_brukowa"
    has_elevator: bool = False
    has_accessible_toilet: bool = True
    tactile_paving: bool = False
    hearing_loop: bool = False
    guide_dog_allowed: bool = True
