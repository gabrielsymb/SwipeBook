// Serviço de API - centraliza comunicação HTTP
// Troque baseURL conforme seu backend
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: 10000,
};

export async function apiFetch(path, options = {}) {
  const url = `${API_CONFIG.baseURL}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status}: ${errorBody}`);
  }

  // Tenta JSON, se falhar retorna texto
  try {
    return await response.json();
  } catch (_) {
    return await response.text();
  }
}
