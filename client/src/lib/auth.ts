import type { User } from "../../types/schema";

const TOKEN_KEY = "driptech_auth_token";
const USER_KEY = "driptech_auth_user";

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): User | null {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAuthToken() && !!getUser();
}

export function hasRole(role: string): boolean {
  const user = getUser();
  return user?.role === role;
}

export function isAdmin(): boolean {
  const user = getUser();
  return user?.role === "admin" || user?.role === "super_admin";
}

export function isSuperAdmin(): boolean {
  const user = getUser();
  return user?.role === "super_admin";
}

// Create Authorization header for API requests
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Check if token is expired (basic check - in production use proper JWT validation)
export function isTokenExpired(): boolean {
  const token = getAuthToken();
  if (!token) return true;
  
  try {
    // Basic token structure check - in production, properly decode and validate JWT
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Date.now() / 1000;
    
    return payload.exp < now;
  } catch {
    return true;
  }
}

// Auto logout if token is expired
export function checkAuthStatus(): boolean {
  if (isTokenExpired()) {
    clearAuth();
    return false;
  }
  return isAuthenticated();
}
