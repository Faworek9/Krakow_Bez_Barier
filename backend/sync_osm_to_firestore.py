"""
Skrypt synchronizacji danych z OpenStreetMap (Overpass API) bezpośrednio do bazy Google Cloud Firestore.
Może być uruchamiany lokalnie lub jako Cloud Run Job (np. raz na dobę przez Cloud Scheduler).
"""

import asyncio
import os
import sys
from pathlib import Path

# Ustawienie ścieżki Pythona i kodowania
sys.path.insert(0, str(Path(__file__).resolve().parent))
try:
    if sys.stdout.encoding.lower() != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

from app.services.osm_service import OSMOverpassService
from app.services.firestore_service import firestore_service
from app.models.poi import (
    POI, 
    AccessibilityFeatures, 
    ElevatorInfo, 
    ToiletInfo, 
    DataProvenance, 
    CredibilityLevel, 
    SurfaceType, 
    Coordinates
)

async def run_sync():
    print("=" * 60)
    print("🚀 Rozpoczynanie synchronizacji OSM -> Google Cloud Firestore")
    print("=" * 60)

    if not firestore_service.is_connected:
        print("❌ Błąd: Brak połączenia z Firestore! Upewnij się, że plik backend/service_account.json istnieje.")
        return

    # Najpierw upewniamy się, że bazowe zaaudytowane miejsca są w Firestore
    initial_seeded = firestore_service.seed_initial_places_if_empty()
    if initial_seeded > 0:
        print(f"✅ Zapisano {initial_seeded} bazowych obiektów z audytem UMK / ZDMK.")

    osm_service = OSMOverpassService()
    print("📡 Odpytywanie Overpass API dla centrum Krakowa...")
    elements = await osm_service.fetch_accessible_places_in_bbox()
    print(f"📦 Pobrano {len(elements)} elementów z tagami dostępności z OSM.")

    saved_count = 0
    for el in elements:
        tags = el.get("tags", {})
        name = tags.get("name")
        if not name:
            continue  # Pomijamy elementy bez nazwy

        el_id = f"osm-{el.get('id')}"
        lat = el.get("lat")
        lon = el.get("lon")
        if not lat or not lon:
            continue

        category = tags.get("amenity") or tags.get("tourism") or tags.get("historic") or "inne"
        if category in ["cafe", "restaurant", "bar", "fast_food"]:
            cat_norm = "kawiarnia" if category == "cafe" else "restauracja"
        elif category in ["museum", "gallery", "arts_centre"]:
            cat_norm = "muzeum"
        elif category in ["monument", "memorial", "castle"]:
            cat_norm = "zabytek"
        elif category in ["townhall", "courthouse", "police"]:
            cat_norm = "urzad"
        elif category in ["toilets"]:
            cat_norm = "toaleta"
        else:
            cat_norm = "inne"

        street = tags.get("addr:street", "")
        housenumber = tags.get("addr:housenumber", "")
        address = f"ul. {street} {housenumber}".strip() if street else "Kraków"

        features_raw = osm_service.parse_osm_element_to_features(el)
        wheelchair_tag = tags.get("wheelchair", "unknown")

        has_gaps = (
            features_raw["steps_at_entrance"] is None or 
            features_raw["entrance_width_cm"] is None
        )
        data_gaps = []
        if features_raw["steps_at_entrance"] is None:
            data_gaps.append("Brak w OSM precyzyjnej liczby schodów wejściowych")
        if features_raw["entrance_width_cm"] is None:
            data_gaps.append("Brak w OSM pomiaru szerokości wejścia w cm")

        poi = POI(
            id=el_id,
            name=name,
            category=cat_norm,
            address=address,
            district="Stare Miasto / Śródmieście",
            location=Coordinates(lat=float(lat), lng=float(lon)),
            description=f"Obiekt zaimportowany z OpenStreetMap (tag wheelchair={wheelchair_tag}).",
            features=AccessibilityFeatures(
                entrance_width_cm=features_raw["entrance_width_cm"],
                steps_at_entrance=features_raw["steps_at_entrance"],
                has_ramp=features_raw["has_ramp"],
                surface_type=SurfaceType.COBBLESTONE_SMOOTH if "kostka" in features_raw["surface"] else SurfaceType.UNKNOWN,
                elevator=ElevatorInfo(available=tags.get("elevator") == "yes"),
                accessible_toilet=ToiletInfo(available=features_raw["toilet_wheelchair"])
            ),
            meta=DataProvenance(
                source_name="OpenStreetMap (Overpass API)",
                source_url=f"https://www.openstreetmap.org/{el.get('type', 'node')}/{el.get('id')}",
                last_verified_at="2026-10-01",
                credibility_level=CredibilityLevel.OPEN_DATA_IMPORT,
                credibility_score=65 if not has_gaps else 45,
                has_data_gaps=has_gaps,
                data_gaps=data_gaps
            )
        )

        success = firestore_service.save_poi(poi)
        if success:
            saved_count += 1

    print(f"🎉 Synchronizacja zakończona sukcesem! Zapisano/zaktualizowano {saved_count} obiektów w Firestore.")

if __name__ == "__main__":
    asyncio.run(run_sync())
