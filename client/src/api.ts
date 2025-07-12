// client/src/api.ts
const API_BASE_URL = (import.meta.env as any).PROD 
  ? '' // When deployed, API calls will be relative to the deployed domain
  : 'http://localhost:5000'; // Your local development server

// Simple API call function
export const callAPI = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};