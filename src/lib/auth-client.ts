// Better Auth Client Configuration

import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

// Get API URL from environment or use current origin for Next.js
const API_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000");

// Get frontend URL from environment or use current origin
const FRONTEND_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000");

// Build plugins array - only add Polar if we're on client and can load it
const plugins: any[] = [magicLinkClient()];

// Only add polarClient if environment allows
if (typeof window !== "undefined") {
  try {
    const { polarClient } = require("@polar-sh/better-auth");
    plugins.push(polarClient());
  } catch (e) {
    console.log("Polar client not available");
  }
}

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins,
});

// Export convenient hooks for components
export const { useSession, signIn, signOut } = authClient;

// Helper function to send magic link
export const sendMagicLink = async (email: string) => {
  try {
    console.log("[AUTH CLIENT] Sending magic link to:", email);
    console.log("[AUTH CLIENT] API URL:", API_URL);
    console.log("[AUTH CLIENT] Callback URL:", `${FRONTEND_URL}/auth/verify`);

    // Route through /auth/verify to properly handle session establishment
    const result = await authClient.signIn.magicLink({
      email,
      callbackURL: `${FRONTEND_URL}/auth/verify`,
    });

    console.log("[AUTH CLIENT] Result:", result);

    if (result.error) {
      throw new Error(result.error.message || "Failed to send magic link");
    }

    return { success: true };
  } catch (error) {
    console.error("[AUTH CLIENT] Error sending magic link:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
