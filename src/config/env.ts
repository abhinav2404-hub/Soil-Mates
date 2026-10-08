// Read VITE_API_BASE_URL or fallback to relative URL (same-origin) for seamless dev & prod
export const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_BASE_URL || '';
