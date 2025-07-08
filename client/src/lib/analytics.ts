// Analytics tracking utilities
import { apiRequest } from "./queryClient";

let sessionId: string;

// Generate or get session ID
function getSessionId(): string {
  if (!sessionId) {
    sessionId = localStorage.getItem('analytics_session') || 
                Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
    localStorage.setItem('analytics_session', sessionId);
  }
  return sessionId;
}

// Track page view
export async function trackPageView(page: string): Promise<void> {
  try {
    await apiRequest("POST", "/api/track/pageview", {
      page,
      sessionId: getSessionId()
    });
  } catch (error) {
    // Silently fail analytics tracking to not disrupt user experience
    console.debug("Analytics tracking failed:", error);
  }
}

// Track page view on route changes
export function setupAnalytics(): void {
  // Track initial page view
  trackPageView(window.location.pathname);

  // Track page views on navigation
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    trackPageView(window.location.pathname);
  };

  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    trackPageView(window.location.pathname);
  };

  // Track browser back/forward navigation
  window.addEventListener('popstate', () => {
    trackPageView(window.location.pathname);
  });
}