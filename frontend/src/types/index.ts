export type CredibilityLevel = 
  | 'VERIFIED_OFFICIAL'
  | 'VERIFIED_COMMUNITY'
  | 'OPEN_DATA_IMPORT'
  | 'UNVERIFIED_REPORT'
  | 'DATA_GAP';

export type SurfaceType = 
  | 'asfalt'
  | 'plyty_chodnikowe'
  | 'kostka_brukowa'
  | 'kocie_lby'
  | 'szuter'
  | 'plytki_wewnetrzne'
  | 'nieznana';

export interface ElevatorInfo {
  available: boolean;
  cabin_dimensions: string | null;
  door_width_cm: number | null;
  has_braille: boolean;
  has_audio_signals: boolean;
}

export interface ToiletInfo {
  available: boolean;
  entry_flat: boolean;
  door_width_cm: number | null;
  has_grab_rails: boolean;
  has_emergency_cord: boolean;
  wheelchair_turning_space: boolean;
}

export interface AccessibilityFeatures {
  entrance_width_cm: number | null;
  steps_at_entrance: number | null;
  has_ramp: boolean | null;
  ramp_slope_percent: number | null;
  max_curb_cm: number | null;
  door_type: string | null;
  surface_type: SurfaceType;
  elevator: ElevatorInfo;
  accessible_toilet: ToiletInfo;
  rest_places_nearby: boolean;
  hearing_loop: boolean;
  guide_dog_allowed: boolean;
  tactile_paving: boolean;
}

export interface DataProvenance {
  source_name: string;
  source_url: string | null;
  last_verified_at: string;
  credibility_level: CredibilityLevel;
  credibility_score: number;
  has_data_gaps: boolean;
  data_gaps: string[];
  verified_by: string | null;
}

export interface Coordinates {
  lat: float;
  lng: float;
}

type float = number;

export interface POI {
  id: string;
  name: string;
  category: string;
  address: string;
  district: string;
  location: Coordinates;
  description: string | null;
  features: AccessibilityFeatures;
  meta: DataProvenance;
}

export interface UserPreferences {
  preset_name?: string;
  min_door_width_cm: number;
  max_curb_cm: number;
  avoid_stairs: boolean;
  avoid_rough_surfaces: boolean;
  require_elevator_if_multi_floor: boolean;
  require_accessible_toilet: boolean;
  require_rest_places: boolean;
  require_hearing_loop: boolean;
}

export interface AccessibilityEvaluation {
  poi_id: string;
  match_score: number;
  status: 'ideal' | 'good' | 'warning' | 'inaccessible' | 'insufficient_data';
  status_label_pl: string;
  advantages: string[];
  barriers: string[];
  data_gap_warnings: string[];
  can_access_independently: boolean;
}

export interface EvaluatedPOI {
  poi: POI;
  evaluation: AccessibilityEvaluation;
}

export interface RouteSegment {
  step_number: number;
  instruction: string;
  distance_meters: number;
  surface_type: SurfaceType;
  curb_height_cm: number;
  has_stairs: boolean;
  steps_count: number;
  has_incline: boolean;
  incline_percent: number | null;
  warning: string | null;
  lat: number;
  lng: number;
  path?: [number, number][];
}

export interface RouteResponse {
  route_id: string;
  title: string;
  total_distance_meters: number;
  estimated_time_minutes: number;
  surface_summary: Record<string, number>;
  max_curb_cm: number;
  total_stairs_count: number;
  has_critical_barriers: boolean;
  accessibility_score: number;
  accessibility_status: 'recommended' | 'passable_with_effort' | 'not_recommended';
  status_label_pl: string;
  segments: RouteSegment[];
  barriers_detected: string[];
  advantages_detected: string[];
}
