# Kraków Bez Barier (AccessKraków)

Platforma internetowa oceny dostępności przestrzeni miejskiej, obiektów użyteczności publicznej i tras pieszych w Krakowie, stworzona w odpowiedzi na wyzwanie konkursowe **„Kraków bez barier”**.

Aplikacja jest skierowana do:
- **Osób poruszających się na wózkach** (manualnych i elektrycznych),
- **Turystów z ciężkimi walizkami** (nawierzchnie bez kocich łbów, podjazdy),
- **Rodziców z wózkami dziecięcymi** (płaskie wjazdy, windy, ławeczki),
- **Seniorów i osób o ograniczonej sprawności ruchowej**.

---

## 🚀 Główne Cechy Rozwiązania

1. **Parametryczna ocena barier (Koniec z binarnym tak/nie)**:
   - Liczba stopni, wysokość krawężnika/progu w cm, szerokość drzwi w cm, kąt rampy, typ nawierzchni, toaleta z uchwytami, miejsca odpoczynku.
2. **Transparentność i poziomy wiarygodności**:
   - Każdy obiekt zawiera źródło (UMK, OSM, audyt), datę ostatniej weryfikacji i status zaufania.
   - **Brak danych != Dostępne**: luki informacyjne są wyraźnie oznaczane jako ostrzeżenia.
3. **Prywatność i RODO (Privacy by Design)**:
   - Zero pytań o stan zdrowia czy niepełnosprawność. Użytkownik wybiera wyłącznie parametry fizyczne, których potrzebuje.
4. **Dostępność cyfrowa (WCAG 2.2 AA)**:
   - Pełna obsługa klawiaturą (widoczne focus rings), semantyczny HTML dla czytników ekranu, tryb wysokiego kontrastu, w 100% dostępna lista tekstowa jako alternatywa dla mapy.
5. **Nawigacja i Planer Tras**:
   - Analiza etapów trasy krok po kroku (np. Dworzec Główny → Sukiennice) z podziałem na nawierzchnie (asfalt vs bruk).
6. **Gotowość do chmury Google Cloud**:
   - Skonteneryzowane obrazy Docker zoptymalizowane pod **Google Cloud Run** i automatyczny deploy.

---

## 🛠️ Stos Technologiczny

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Leaflet, Lucide Icons.
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, Uvicorn, Httpx, Pytest.
- **Chmura & DevOps**: Google Cloud Run, Google Artifact Registry, Docker, Docker Compose, Nginx.
- **Dane Otwarte**: OpenStreetMap (Overpass API), Portal Otwarte Dane Miasta Krakowa, MSIP.

---

## 💻 Szybkie Uruchomienie Lokalne

### Opcja 1: Uruchomienie skryptem PowerShell (Zalecane na Windows)
W terminalu głównym projektu:
```powershell
.\start_dev.ps1
```
Skrypt automatycznie uruchomi backend FastAPI (port `8000`) oraz deweloperski serwer React Vite (port `5173`).

---

### Opcja 2: Uruchomienie za pomocą Docker Compose
```bash
docker compose up --build
```
- Aplikacja frontendowa (React): [http://localhost:3000](http://localhost:3000)
- Backend REST API (FastAPI): [http://localhost:8000](http://localhost:8000)
- Interaktywna dokumentacja Swagger API: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Opcja 3: Uruchomienie ręczne w dwóch terminalach

#### 1. Backend (FastAPI):
```powershell
cd backend
.\.venv\Scripts\python.exe run.py
```

#### 2. Frontend (React):
```powershell
cd frontend
& "C:\Program Files\nodejs\npm.cmd" run dev
```

---

## ☁️ Wdrożenie na Google Cloud Run

Projekt zawiera gotowy skrypt wdrożeniowy w katalogu `deployment/`:
```bash
export GCP_PROJECT_ID="twoj-projekt-gcp"
export GCP_REGION="europe-west1" # lub europe-central2 (Warszawa)

chmod +x deployment/gcp-cloud-run-deploy.sh
./deployment/gcp-cloud-run-deploy.sh
```

---

## 📁 Dokumentacja Konkursowa

W katalogu `docs/` znajdują się materiały przygotowane pod wymogi formalne oceny:
- [`docs/PREZENTACJA_10_SLAJDOW.md`](docs/PREZENTACJA_10_SLAJDOW.md) – Kompletna treść prezentacji (maks. 10 slajdów zgodnie z regulaminem).
- [`docs/SCENARIUSZ_WIDEO_3MIN.md`](docs/SCENARIUSZ_WIDEO_3MIN.md) – Precyzyjny scenariusz nagrania wideo demonstracyjnego (poniżej 3 minut).
- [`docs/MODEL_BIZNESOWY_I_SKALOWANIE.md`](docs/MODEL_BIZNESOWY_I_SKALOWANIE.md) – Model przychodowy B2B/B2G, RODO, koszty utrzymania na GCP i procedura skalowania na kolejne miasta.

---

## 📄 Licencje i Źródła
- Dane OpenStreetMap: &copy; autorzy OpenStreetMap, licencja ODbL.
- Dane miejskie: Portal Otwarte Dane Miasta Krakowa, ZDMK, UMK.
- Kod źródłowy: Licencja MIT.
