/**
 * Global API URL Helper for HealthwithReshmi™
 * Resolves API URL dynamically from:
 * 1. import.meta.env.VITE_API_URL (e.g. 'https://reshmi-verma-eurb.onrender.com')
 * 2. Fallback to relative endpoint if VITE_API_URL is not defined
 */
const LIVE_BACKEND_URL = 'https://reshmi-verma-eurb.onrender.com';
const RAW_API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? LIVE_BACKEND_URL : '');
export const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');

export function getApiUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL) return cleanEndpoint;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

export default getApiUrl;
