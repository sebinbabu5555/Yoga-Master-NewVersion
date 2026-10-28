// Centralized API configuration
// In production (Vercel), set VITE_API_URL in your Vercel Project Settings -> Environment Variables.
// In development, it defaults to http://localhost:5000.
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
