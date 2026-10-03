# Kraków Bez Barier (AccessKraków)

Platforma internetowa oceny dostępności przestrzeni miejskiej, obiektów użyteczności publicznej i tras pieszych w Krakowie, stworzona w odpowiedzi na wyzwanie konkursowe **„Kraków bez barier”**.

Aplikacja jest skierowana do:
- **Osób poruszających się na wózkach** (manualnych i elektrycznych),
- **Turystów z ciężkimi walizkami** (nawierzchnie bez kocich łbów, podjazdy, windy na dworcach),
- **Rodziców z wózkami dziecięcymi** (płaskie wjazdy, windy, przewijaki, ławeczki),
- **Seniorów i osób o ograniczonej sprawności ruchowej**,
- **Turystów międzynarodowych** (pełna dwujęzyczność: polski i angielski).

---

## 🚀 Główne Cechy Rozwiązania

1. **Parametryczna ocena barier (Koniec z binarnym tak/nie)**:
   - Liczba stopni, wysokość krawężnika/progu w cm, szerokość drzwi w cm, kąt rampy, typ nawierzchni, toaleta z uchwytami, miejsca odpoczynku.
2. **Transparentność i poziomy wiarygodności**:
   - Każdy obiekt zawiera źródło (audyt miejski UMK, OSM, weryfikacja społeczna), datę ostatniej weryfikacji i status zaufania.
   - **Brak danych != Dostępne**: luki informacyjne są wyraźnie oznaczane jako ostrzeżenia.
3. **Prywatność i RODO (Privacy by Design)**:
   - Zero pytań o stan zdrowia czy orzeczenia medyczne. Użytkownik wybiera wyłącznie parametry fizyczne, których potrzebuje.
4. **Pełna Dwujęzyczność (i18n: Polski / Angielski – PL / EN)**:
   - Kompletny system internacjonalizacji obejmujący cały interfejs, profile podróży, kategorie, filtry oraz komunikaty czytników ekranu.
   - Przełącznik języka w panelu Ustawień z automatyczną pamięcią (`localStorage: krakow_app_language`) i synchronizacją atrybutu `lang` dokumentu HTML.
   - Dwujęzyczny asystent głosowy (Web Speech API) mówiący w języku polskim (`pl-PL`) lub angielskim (`en-US`).
5. **Dostępność cyfrowa (WCAG 2.2 AA) & Centrum Ustawień (⚙️)**:
   - Pełna obsługa klawiaturą (widoczne focus rings), semantyczny HTML dla czytników ekranu (`aria-live`, `aria-label`).
   - Tryb wysokiego kontrastu (>7:1), responsywne skalowanie czcionki (Standardowa 100%, Powiększona 115%, Duża 130%) działające na poziomie jednostek `rem` całego dokumentu z podglądem na żywo, krój pisma dla osób z dysleksją (OpenDyslexic) oraz redukcja animacji.
   - Wszystkie opcje dostępności zgrupowane w jednym, przejrzystym panelu Ustawień.
6. **Ekosystem Mieszkańców i Biznesu (Role i Konta)**:
   - **Profil Mieszkańca / Recenzenta**: historia wysłanych uwag, status weryfikacji społecznej, punkty reputacji (`+10 pkt`) oraz formularz dodawania korekty zintegrowany z panelem „Moje zgłoszenia”.
   - **Profil Biznesowy / Lokalu**: dedykowany moduł dodawania lokalu (`+ Dodaj lokal`), zgłaszanie parametrów wejścia, windy i toalety dla kawiarni, muzeów i hoteli.
   - Wygodny modal logowania i rejestracji (`AuthModal`) z podziałem na role.
7. **Nowoczesna Strona Główna (HomePage)**:
   - Prezentacja kluczowych metryk dostępności (*10+ Obiektów*, *100% Parametrów*, *Brak danych != Dostępne*, *WCAG 2.2 AA*).
   - Błyskawiczna wyszukiwarka z popularnymi tagami (Sukiennice, Wawel, Dworzec Główny, Planty, Kazimierz, Cricoteka).
   - Wyróżnione obiekty, interaktywne profile mobilności i planer tras.
8. **Planer Dostępnych Tras Pieszych**:
   - Analiza etapów trasy krok po kroku (np. Dworzec Główny → Rynek Główny) z podziałem procentowym na nawierzchnie (płyty, asfalt, kocie łby).
9. **📍 Zakres Pilotażu i Skalowalność Geograficzna**:
   - **Obecny zakres demonstracyjny**: Skupia się na obszarze **Starego Miasta w Krakowie** (historyczne centrum, Wawel, Planty, Dworzec Główny) – terenie o najwyższym zagęszczeniu ruchu pieszego i specyficznych, zabytkowych barierach architektonicznych.
   - **Powiększanie obszaru przy skalowaniu**: Architektura aplikacji oparta na OpenStreetMap oraz elastycznych bounding boxach pozwala w procesie skalowania na płynne poszerzanie zasięgu:
     - **Faza I (Obecna)**: Stare Miasto w Krakowie (poligon pilotażowy),
     - **Faza II**: Dzielnice przyległe i turystyczne (Kazimierz, Podgórze, Krowodrza, Grzegórzki, Nowa Huta),
     - **Faza III**: Wszystkie 18 dzielnic Krakowa oraz obszar Metropolii Krakowskiej (węzły przesiadkowe, dworce, lotnisko Balice),
     - **Faza IV**: Skalowanie krajowe i międzynarodowe (inne miasta zabytkowe w Polsce i Europie).
10. **Gotowość do chmury Google Cloud**:
    - Skonteneryzowane obrazy Docker zoptymalizowane pod **Google Cloud Run** i automatyczny deploy (serverless).

---

## 🛠️ Stos Technologiczny

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Leaflet, Lucide Icons, Web Speech API.
- **Internacjonalizacja**: Autorski, typowany moduł i18n (`translations.ts`, `LanguageContext.tsx`).
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


```

---

## 📁 Dokumentacja Konkursowa i Koncepcja Projektu

- [📖 **`IDEA_I_KONCEPCJA_PROJEKTU.md`**](IDEA_I_KONCEPCJA_PROJEKTU.md) – **Główny manifest i koncepcja**: idea przewodnia, parametryzacja zamiast etykiet, grupy docelowe, model docelowy, piramida wiarygodności danych, system ról i dwujęzyczność międzynarodowa.
- [`docs/PREZENTACJA_10_SLAJDOW.md`](docs/PREZENTACJA_10_SLAJDOW.md) – Kompletna treść prezentacji konkursowej (dokładnie 10 slajdów zgodnie z regulaminem).
- [`docs/SCENARIUSZ_WIDEO_3MIN.md`](docs/SCENARIUSZ_WIDEO_3MIN.md) – Precyzyjny scenariusz nagrania wideo demonstracyjnego (poniżej 3 minut).
- [`docs/MODEL_BIZNESOWY_I_SKALOWANIE.md`](docs/MODEL_BIZNESOWY_I_SKALOWANIE.md) – Model przychodowy B2B/B2G, RODO, koszty utrzymania na GCP, moduł lokali biznesowych i procedura skalowania na kolejne miasta.

---

## 📄 Licencje i Źródła
- Dane OpenStreetMap: &copy; autorzy OpenStreetMap, licencja ODbL.
- Dane miejskie: Portal Otwarte Dane Miasta Krakowa, ZDMK, UMK.
- Kod źródłowy: Licencja MIT.
