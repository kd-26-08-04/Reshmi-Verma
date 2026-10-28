/**
 * Global API URL Helper for HealthwithReshmi™
 * Resolves API URL dynamically from:
 * 1. import.meta.env.VITE_API_URL (e.g. 'https://reshmi-verma-eurb.onrender.com')
 * 2. Fallback to relative endpoint if VITE_API_URL is not defined
 */
const LIVE_BACKEND_URL = 'https://reshmi-verma-eurb.onrender.com';

// In local development, use relative endpoint ('') so Vite proxy routes /api to http://localhost:5000.
// This completely avoids CORS preflight blocking on localhost:3000, 3001, etc.
// In production, use VITE_API_URL or LIVE_BACKEND_URL.
const RAW_API_URL = import.meta.env.DEV && import.meta.env.VITE_FORCE_LIVE_API !== 'true'
  ? ''
  : (import.meta.env.VITE_API_URL || LIVE_BACKEND_URL);

export const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');

export const RAZORPAY_PAYMENT_URL = import.meta.env.VITE_RAZORPAY_PAYMENT_LINK || 'https://rzp.io/rzp/healthwithreshmi';

export function getApiUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL) return cleanEndpoint;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

export default getApiUrl;
