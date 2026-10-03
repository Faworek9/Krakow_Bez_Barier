// Centralna konfiguracja adresu API backendu
export const API_BASE = 
  (import.meta as any).env?.VITE_API_BASE || 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://127.0.0.1:8000/api'
    : '/api');
