# Prezentacja Projektu: Kraków Bez Barier (AccessKraków)
*Zgodna z wymogami konkursowymi: dokładnie 10 slajdów*

---

## SLAJD 1: Tytuł i Misja Projektu
- **Tytuł**: Kraków Bez Barier (AccessKraków)
- **Podtytuł**: Wiarygodna, spersonalizowana ocena dostępności przestrzeni miejskiej i tras dla każdego
- **Misja**: Likwidujemy binarne etykiety „dostępne / niedostępne”. Dajemy każdemu turyście i mieszkańcowi precyzyjne parametry architektoniczne, by mógł samodzielnie ocenić przydatność trasy do swoich unikalnych potrzeb.
- **Logotyp / Hasło**: *Kraków otwarty, przejrzysty, bez barier.*

---

## SLAJD 2: Zdefiniowany Problem
- **Pułapka binarnego oznaczenia**: Miejsce oznaczone jako „dostępne” może mieć próg 5 cm lub stromy podjazd 12% – dla wózka elektrycznego to bariera nie do przejścia.
- **Różnorodność potrzeb w Krakowie**:
  - Osoba na wózku potrzebuje szerokich drzwi (&gt;85 cm) i windy z kabiną min. 110x140 cm.
  - Turysta z ciężką walizką potrzebuje gładkiej nawierzchni i unika zabytkowych „kocich łbów”.
  - Rodzic ze spacerówką szuka miejsc odpoczynku i bezstopniowych zjazdów.
- **Problem braku wiarygodności**: Wiele portali prezentuje nieaktualne dane, a brak informacji traktuje błędnie jako „brak barier”.

---

## SLAJD 3: Nasze Rozwiązanie – Platforma AccessKraków
- **Parametryczna ocena**: Zamiast arbitralnego werdyktu, analizujemy: liczbę stopni, wysokość progu w cm, szerokość przejścia, kąt rampy, typ nawierzchni, toaletę z uchwytami i miejsca odpoczynku.
- **Dynamiczny silnik dopasowania**: Użytkownik wybiera szybki profil (Wózek / Walizka / Spacerówka / Senior) lub ustawia własne limity fizyczne.
- **Podwójny widok**: Interaktywna mapa + w 100% dostępna lista tekstowa z wykazem konkretnych barier (spełnienie standardu WCAG 2.2 AA).

---

## SLAJD 4: Prywatność i Etyka Danych (Privacy by Design)
- **Zero pytań o stan zdrowia i orzeczenia**: Użytkownik nie podaje informacji o swojej niepełnosprawności (pełna zgodność z RODO i etyką).
- **Koncentracja na parametrach otoczenia**: Pytamy wyłącznie o to, jaki próg jesteś w stanie pokonać i jakiej szerokości drzwi potrzebujesz.
- **Bezpieczeństwo**: Szyfrowane połączenia HTTPS/TLS, anonimowość profili wyszukiwania.

---

## SLAJD 5: Transparentność, Źródła i Poziomy Wiarygodności
- **Koniec z fałszywym poczuciem bezpieczeństwa**:
  - Każdy obiekt posiada: **Źródło**, **Datę weryfikacji** oraz **Poziom Wiarygodności**.
- **System Odznak Wiarygodności**:
  - 🟢 **Oficjalny audyt miejski / zarządcy (90-100%)** – potwierdzone pomiarami.
  - 🔵 **Zweryfikowane społecznościowo (70-89%)** – potwierdzone przez min. 3 użytkowników / fundację.
  - ⚪ **Import OpenStreetMap (50-69%)** – otwarte dane bez świeżej weryfikacji.
  - 🟡 **Pojedyncze zgłoszenie (<50%)** – wymaga potwierdzenia.
- **Zasada „Brak danych != Dostępne”**: Jeśli brakuje danych o windzie lub progach, obiekt otrzymuje ostrzegawczą żółtą/czerwoną etykietę: *„Uwaga: luki w danych architektonicznych”*.

---

## SLAJD 6: Architektura Techniczna i Google Cloud
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Leaflet (lekkość, szybkość, pełna responsywność).
- **Backend**: Python 3.11 + FastAPI (wysoka asynchroniczna wydajność, Pydantic, REST API).
- **Oddzielenie warstw**: Niezależne moduły ingestii danych (OSM Overpass API, Otwarte Dane Krakowa, Repozytorium Zgłoszeń).
- **Chmura Google Cloud**:
  - **Google Cloud Run**: Bezserwerowe kontenery Docker (automatyczne skalowanie do zera = minimalne koszty wdrożenia).
  - **Google Artifact Registry**: Bezpieczny rejestr obrazów kontenerowych.
  - **Cloud SQL (PostgreSQL + PostGIS)**: Zaawansowane operacje przestrzenne.

---

## SLAJD 7: Dostępność Cyfrowa (WCAG 2.2 AA w Praktyce)
- **Nawigacja z klawiatury**: 100% funkcji aplikacji dostępnych wyłącznie klawiszami Tab / Enter / Spacja (widoczne focus rings).
- **Czytniki ekranu**: Semantyczny HTML, atrybuty ARIA, komunikaty o zmianie liczby wyników (`aria-live="polite"`).
- **Tekstowa alternatywa dla mapy**: Pełna lista kafelkowa i nawigacja krok po kroku jako równorzędna alternatywa dla mapy graficznej.
- **Wysoki kontrast**: Dedykowany tryb wysokiego kontrastu (> 4.5:1 dla tekstu, > 3:1 dla elementów interaktywnych).

---

## SLAJD 8: Model Biznesowy i Komercjalizacja (Wycena 20%)
- **B2B SaaS: Certyfikat i Widget „Obiekt Przyjazny Mobilności”**:
  - Hotele, restauracje, muzea i centra konferencyjne w Krakowie wykupują roczną subskrypcję na oficjalny widżet z audytem dostępności na swoją stronę.
  - Wzrost konwersji rezerwacji od gości o ograniczonej mobilności i rodzin z dziećmi.
- **B2B API dla platform rezerwacyjnych**:
  - Płatny dostęp do API z mikrodanymi dostępności dla portali turystycznych (Booking.com, TripAdvisor, portale kongresowe Kraków Network).
- **B2G (Współpraca z Miastem)**:
  - Generowanie raportów o „białych plamach dostępności” w przestrzeni miejskiej dla ZDMK i UMK.

---

## SLAJD 9: Skalowalność i Plan Przejścia do Stałej Usługi
- **Łatwość wdrożenia w innych miastach**:
  - Architektura oparta na standardzie OpenStreetMap i GeoJSON pozwala uruchomić aplikację we Wrocławiu, Gdańsku czy Warszawie w kilka dni roboczych.
- **Podmiot odpowiedzialny i utrzymanie**:
  - Spółka celowa / Partnerstwo NGO i Tech Startup.
  - Koszty stałe infrastruktury w Google Cloud Run: **poniżej 80-120 zł / mies.** w początkowej fazie dzięki serverless.
  - Finansowanie: Przychody z certyfikacji B2B + granty miejskie na dostępność cyfrową.

---

## SLAJD 10: Podsumowanie i Demonstracja
- **Działający prototyp**: Przetestowany na kluczowych punktach Krakowa (Dworzec Główny, Rynek Główny, Wawel, Kazimierz).
- **Bezpieczny, etyczny, transparentny**: Prawdziwe informacje, wyraźne ostrzeżenia o brakach danych, pełne wsparcie WCAG.
- **Gotowy do wdrożenia**: Repozytorium Docker + skrypty wdrożeniowe na Google Cloud Run.
- **Dziękujemy za uwagę! Zapraszamy do zadawania pytań.**
