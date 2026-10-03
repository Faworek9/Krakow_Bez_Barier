# ==============================================================================
# Etap 1: Budowanie produkcyjne frontendu React (Vite + TypeScript + Tailwind)
# ==============================================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ==============================================================================
# Etap 2: Produkcyjny kontener Python (FastAPI + skompilowany frontend)
# ==============================================================================
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

WORKDIR /app

# Instalacja zależności systemowych
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instalacja zależności backendu
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Kopiowanie kodu aplikacji backendu
COPY backend/app/ ./app/

# Kopiowanie skompilowanego frontendu z etapu 1
COPY --from=frontend-builder /app/frontend/dist ./frontend_dist/

# Google Cloud Run nasłuchuje na dynamicznym porcie PORT (domyślnie 8080)
EXPOSE 8080

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
