#!/bin/bash
# ==============================================================================
# Skrypt wdrożenia projektu "Kraków Bez Barier" na Google Cloud Run
# ==============================================================================
set -e

# Konfiguracja projektu GCP
PROJECT_ID=${GCP_PROJECT_ID:-"krakow-bez-barier-2026"}
REGION=${GCP_REGION:-"europe-west1"} # Lub europe-central2 (Warszawa)
REPO_NAME="krakow-bez-barier-repo"

echo "=== 1. Weryfikacja konfiguracji Google Cloud ==="
echo "Projekt GCP: $PROJECT_ID"
echo "Region: $REGION"

gcloud config set project "$PROJECT_ID"

echo "=== 2. Aktywacja wymaganych usług GCP ==="
gcloud services enable \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com

echo "=== 3. Utworzenie repozytorium Artifact Registry (jeśli nie istnieje) ==="
gcloud artifacts repositories describe "$REPO_NAME" --location="$REGION" >/dev/null 2>&1 || \
gcloud artifacts repositories create "$REPO_NAME" \
    --repository-format=docker \
    --location="$REGION" \
    --description="Docker repozytorium dla Kraków Bez Barier"

REGISTRY_URL="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME"

echo "=== 4. Budowanie i wdrożenie Backendu FastAPI ==="
BACKEND_IMAGE="$REGISTRY_URL/backend:latest"
gcloud builds submit ./backend --tag "$BACKEND_IMAGE"

gcloud run deploy krakow-backend \
    --image "$BACKEND_IMAGE" \
    --platform managed \
    --region "$REGION" \
    --allow-unauthenticated \
    --port 8080 \
    --set-env-vars ENVIRONMENT=production

BACKEND_URL=$(gcloud run services describe krakow-backend --platform managed --region "$REGION" --format 'value(status.url)')
echo "Backend pomyślnie wdrożony pod adresem: $BACKEND_URL"

echo "=== 5. Budowanie i wdrożenie Frontendu React ==="
FRONTEND_IMAGE="$REGISTRY_URL/frontend:latest"
gcloud builds submit ./frontend --tag "$FRONTEND_IMAGE"

gcloud run deploy krakow-frontend \
    --image "$FRONTEND_IMAGE" \
    --platform managed \
    --region "$REGION" \
    --allow-unauthenticated \
    --port 80

FRONTEND_URL=$(gcloud run services describe krakow-frontend --platform managed --region "$REGION" --format 'value(status.url)')

echo "=============================================================================="
echo "SUKCES! Aplikacja 'Kraków Bez Barier' działa na Google Cloud Run:"
echo "Frontend: $FRONTEND_URL"
echo "Backend API: $BACKEND_URL"
echo "Dokumentacja Swagger: $BACKEND_URL/docs"
echo "=============================================================================="
