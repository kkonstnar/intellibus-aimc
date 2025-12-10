/**
 * User Identification Utility
 * Creates and manages a persistent user ID across PostHog and Google Analytics
 */

/**
 * Generate a unique user ID
 */
const generateUserId = (): string => {
  return "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
};

/**
 * Get or create user ID
 * Returns existing ID from localStorage or creates new one
 */
export const getUserId = (): string => {
  const storageKey = "analytics_user_id";

  // Try to get existing ID
  let userId = localStorage.getItem(storageKey);

  if (!userId) {
    // Generate new ID
    userId = generateUserId();

    try {
      localStorage.setItem(storageKey, userId);
    } catch (error) {
      console.warn("Could not save user ID to localStorage:", error);
    }
  }

  return userId;
};

/**
 * Reset user ID (useful for logout or testing)
 */
export const resetUserId = (): void => {
  const storageKey = "analytics_user_id";
  localStorage.removeItem(storageKey);
};

/**
 * Get session ID (resets each session)
 */
export const getSessionId = (): string => {
  const storageKey = "analytics_session_id";

  // Check if we have a session ID in sessionStorage
  let sessionId = sessionStorage.getItem(storageKey);

  if (!sessionId) {
    sessionId =
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

    try {
      sessionStorage.setItem(storageKey, sessionId);
    } catch (error) {
      console.warn("Could not save session ID:", error);
    }
  }

  return sessionId;
};

export default {
  getUserId,
  resetUserId,
  getSessionId,
};
