# Scenariusz Wideo Demonstracyjnego (Maksymalnie 3 Minuty)
*Projekt: Kraków Bez Barier (AccessKraków)*

---

### [0:00 - 0:30] Wprowadzenie i Zdefiniowanie Problemu
- **Wizualia**: Widok na ekran główny aplikacji AccessKraków. W tle historyczna mapa Krakowa (Rynek Główny / Sukiennice / Dworzec Główny).
- **Lektor**:
  > „Witajcie. Każdego dnia tysiące osób odwiedzają Kraków – osoby na wózkach inwalidzkich, rodzice z wózkami dziecięcymi, czy turyści ciągnący ciężkie walizki po bruku. Dla nich proste oznaczenie 'miejsce dostępne' to za mało. Nie wiemy, czy w środku jest próg 5 cm, czy winda pomieści szeroki wózek elektryczny, a nawierzchnia to zabytkowe kocie łby.
  > Oto 'Kraków Bez Barier' – narzędzie, które daje konkretne parametry architektoniczne, transparentność źródeł i pełną kontrolę nad Twoją podróżą.”

---

### [0:30 - 1:15] Scenariusz 1: Osoba na Wózku Inwalidzkim (Precyzyjny Audyt)
- **Działanie w aplikacji**:
  1. Kliknięcie profilu: **„Osoba na wózku”** (min. szerokość drzwi: 85 cm, max próg: 2 cm, bez schodów, wymagana toaleta z uchwytami).
  2. Sprawdzenie obiektu: **Kraków Główny (Dworzec)** – aplikacja pokazuje zielony badge dopasowania 98% (drzwi 140 cm, 0 stopni, windy na perony z Braillem i komunikatami głosowymi).
  3. Sprawdzenie obiektu trudnego: **Kawiarnia na Kazimierzu** – system natychmiast ostrzega: *Schody 1 stopień (15 cm) bez podjazdu, wąskie drzwi 78 cm, toaleta niedostosowana*.
- **Lektor**:
  > „Użytkownik nie podaje informacji o chorobie – zachowujemy 100% prywatności. Wybiera po prostu profil wózkowy. Sprawdzamy Dworzec Główny: pełen sukces, windy, toaleta z uchwytami, certyfikowany audyt PKP i UMK z kwietnia 2026. Z kolei kawiarnia na Kazimierzu od razu sygnalizuje czerwoną barierę: stopień 15 cm i wąskie drzwi, uniemożliwiające samodzielny wjazd.”

---

### [1:15 - 1:55] Scenariusz 2: Turysta z Walizką i Planer Tras
- **Działanie w aplikacji**:
  1. Przełączenie profilu na: **„Turysta z walizką”** (filtr automatycznie włącza unikanie nawierzchni z kocich łbów).
  2. Przejście do zakładki: **„Dostępne Trasy Piesze”**.
  3. Wybór trasy: **Kraków Główny PKP → Sukiennice (Rynek Główny)**.
  4. Prezentacja paska struktury nawierzchni: 55% płyt chodnikowych, 25% asfaltu (Planty), 20% gładkiej kostki.
  5. Pokazanie etapów trasy krok po kroku: wyjazd windą, obniżone krawężniki przy Teatrze Słowackiego, ławki do odpoczynku.
- **Lektor**:
  > „Zmieńmy profil na turystę z ciężką walizką. Wchodzimy w Planer Tras: system analizuje trasę z Dworca na Rynek. Wykrywa, że alejki na Plantach mają gładki asfalt i krawężniki 1 cm, a na Rynku rekomenduje pas gładkich płyt zamiast nierównego bruku. Mamy też podgląd nawigacji krok po kroku.”

---

### [1:55 - 2:25] Scenariusz 3: Reakcja na Brak Danych i Korekta Społecznościowa (Wymóg Konkursu!)
- **Działanie w aplikacji**:
  1. Wyszukanie obiektu: **Restauracja 'Pod Basztą' (ul. Floriańska)**.
  2. Obiekt wyświetla się z pulsującym, ostrzegawczym statusem: **„Uwaga: Luki w danych architektonicznych”**.
  3. Pokazanie szczegółów: *Brak pomiaru szerokości wejścia, brak potwierdzenia obecności stopni*.
  4. Kliknięcie: **„Zgłoś poprawkę / nową barierę”**.
  5. Krótki formularz: wpisanie rzeczywistych danych (np. 0 stopni, drzwi 90 cm) i wysłanie zgłoszenia.
- **Lektor**:
  > „Co w sytuacji, gdy danych brakuje? Nasza zasada brzmi: brak informacji NIGDY nie jest potwierdzeniem dostępności! Restauracja zaimportowana ze starych danych OSM otrzymuje wyraźne ostrzeżenie o luce danych. Użytkownik widzi dokładnie, jakich informacji brakuje, i jednym kliknięciem może zgłosić korektę z poziomu telefonu, wzbogacając bazę miejską.”

---

### [2:25 - 3:00] Dostępność WCAG, Model Biznesowy i Podsumowanie
- **Działanie w aplikacji**:
  1. Krótki pokaz nawigacji wyłącznie klawiaturą (wyraźny focus na elementach).
  2. Kliknięcie przycisku **„Kontrast”** – włączenie trybu wysokiego kontrastu (żółto-czarny/wysoki kontrast WCAG).
  3. Przełączenie na widok **„Tylko Lista”** (tekstowa alternatywa dla osób niewidomych).
- **Lektor**:
  > „Aplikacja została zaprojektowana zgodnie z WCAG 2.2 AA – działa płynnie z klawiatury, z czytnikami ekranu i w trybie wysokiego kontrastu.
  > Nasz model biznesowy opiera się na certyfikacji B2B i widżetach dla hoteli oraz API dla portali rezerwacyjnych. Aplikacja działa w kontenerach na Google Cloud Run, dzięki czemu koszt jej utrzymania jest minimalny, a skalowanie na kolejne polskie miasta zajmuje zaledwie kilka dni.
  > Dziękujemy – twórzmy razem Kraków bez barier!”
