"""
Dopasowanie (snapping) geometrii tras do rzeczywistej sieci ulic i chodników.

Ręcznie zdefiniowane węzły grafu mają tylko 2-3 punkty na odcinek, przez co linia
na mapie ścinała zabudowę i nie pokrywała się z ulicami. Ten moduł pobiera
dokładną geometrię pieszą (profil "foot") z silnika OSRM opartego o OpenStreetMap.
W razie braku sieci / błędu zwracany jest None i wywołujący używa ścieżki zapasowej.
"""
import os
import threading
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, List, Optional, Tuple

import httpx

OSRM_FOOT_URL = os.getenv(
    "OSRM_FOOT_URL", "https://routing.openstreetmap.de/routed-foot/route/v1/foot"
)
SNAPPING_ENABLED = os.getenv("ROUTE_SNAPPING", "1") != "0"
_TIMEOUT = float(os.getenv("OSRM_TIMEOUT", "6"))
_HEADERS = {"User-Agent": "KrakowBezBarier/1.0 (accessible routing)"}

# (lat1, lng1, lat2, lng2) zaokrąglone -> (path [[lat,lng],...], distance_m) | None
_cache: Dict[Tuple[float, float, float, float], Optional[Tuple[List[List[float]], int]]] = {}
_cache_lock = threading.Lock()
# po błędzie sieci nie męczymy usługi przez chwilę kolejnymi zapytaniami
_failures = 0
_MAX_FAILURES = 3


def _key(a: List[float], b: List[float]) -> Tuple[float, float, float, float]:
    return (round(a[0], 5), round(a[1], 5), round(b[0], 5), round(b[1], 5))


def snap_leg(
    start: List[float], end: List[float]
) -> Optional[Tuple[List[List[float]], int]]:
    """Zwraca (ścieżka [[lat,lng],...], dystans w metrach) po realnych ulicach albo None."""
    global _failures
    if not SNAPPING_ENABLED or _failures >= _MAX_FAILURES:
        return None

    key = _key(start, end)
    with _cache_lock:
        if key in _cache:
            return _cache[key]

    url = f"{OSRM_FOOT_URL}/{start[1]},{start[0]};{end[1]},{end[0]}"
    result: Optional[Tuple[List[List[float]], int]] = None
    try:
        r = httpx.get(
            url,
            params={"overview": "full", "geometries": "geojson", "steps": "false"},
            headers=_HEADERS,
            timeout=_TIMEOUT,
        )
        r.raise_for_status()
        data = r.json()
        if data.get("code") == "Ok" and data.get("routes"):
            route = data["routes"][0]
            coords = route["geometry"]["coordinates"]
            if len(coords) >= 2:
                path = [[round(c[1], 6), round(c[0], 6)] for c in coords]
                result = (path, max(1, int(round(route["distance"]))))
        _failures = 0
    except Exception:
        _failures += 1
        return None  # nie cache'ujemy błędów

    with _cache_lock:
        _cache[key] = result
    return result


def snap_legs(
    legs: List[Tuple[List[float], List[float]]]
) -> List[Optional[Tuple[List[List[float]], int]]]:
    """Równoległe dopasowanie wielu odcinków (zachowuje kolejność)."""
    if not legs:
        return []
    with ThreadPoolExecutor(max_workers=min(6, len(legs))) as pool:
        return list(pool.map(lambda leg: snap_leg(leg[0], leg[1]), legs))
