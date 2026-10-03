import httpx
from typing import List, Dict, Any, Optional
from app.config import settings

class OSMOverpassService:
    """
    Konektor do OpenStreetMap (Overpass API)
    Umożliwia dynamiczne pobieranie obiektów z tagami dostępności w wybranym obszarze Krakowa.
    Zgodnie z wymaganiami konkursu, architektura oddziela pozyskiwanie danych od prezentacji.
    """
    def __init__(self, endpoint_url: str = settings.OVERPASS_URL):
        self.endpoint_url = endpoint_url

    async def fetch_accessible_places_in_bbox(
        self, 
        south: float = 50.040, 
        west: float = 19.910, 
        north: float = 50.080, 
        east: float = 19.970,
        amenity_type: str = "cafe|restaurant|museum|public_building"
    ) -> List[Dict[str, Any]]:
        query = f"""
        [out:json][timeout:15];
        (
          node["wheelchair"]({south},{west},{north},{east});
          way["wheelchair"]({south},{west},{north},{east});
        );
        out body;
        >;
        out skel qt;
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(self.endpoint_url, data={"data": query})
                if response.status_code == 200:
                    data = response.json()
                    return data.get("elements", [])
                return []
        except Exception as e:
            # Fallback w przypadku awarii lub ograniczenia limitów Overpass API
            print(f"[OSM Service Warning] Nie udało się połączyć z Overpass API: {e}")
            return []

    def parse_osm_element_to_features(self, element: Dict[str, Any]) -> Dict[str, Any]:
        """
        Mapowanie tagów OSM na nasz znormalizowany model cech dostępności.
        """
        tags = element.get("tags", {})
        wheelchair_tag = tags.get("wheelchair", "unknown")
        
        # Ekstrakcja liczby stopni
        step_count = None
        if "step_count" in tags:
            try:
                step_count = int(tags["step_count"])
            except ValueError:
                pass
        elif wheelchair_tag == "no":
            step_count = 1  # Wskaźnik istnienia barier
        elif wheelchair_tag == "yes":
            step_count = 0

        # Ekstrakcja rampy
        has_ramp = tags.get("ramp") in ("yes", "separate") or tags.get("wheelchair:ramp") == "yes"

        # Szerokość drzwi
        door_width = None
        if "door:width" in tags:
            try:
                door_width = int(tags["door:width"].replace("m", "").replace("cm", "").strip())
            except ValueError:
                pass

        return {
            "entrance_width_cm": door_width,
            "steps_at_entrance": step_count,
            "has_ramp": has_ramp,
            "surface": tags.get("surface", "nieznana"),
            "toilet_wheelchair": tags.get("toilets:wheelchair") == "yes"
        }
