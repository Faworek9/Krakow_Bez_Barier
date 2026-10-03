import uvicorn
import os

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"Uruchamianie serwera Kraków Bez Barier API na porcie {port}...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
