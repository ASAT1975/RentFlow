/**
 * Google OAuth client IDs, read from env (`.env`). Create these in the Google
 * Cloud console (APIs & Services → Credentials → OAuth client ID) and add them:
 *
 *   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=xxxx.apps.googleusercontent.com
 *   EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=xxxx.apps.googleusercontent.com
 *   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=xxxx.apps.googleusercontent.com
 *
 * Env vars must be referenced with static dot-notation so Expo can inline them.
 */
export const googleConfig = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
} as const;

/** True once at least one client ID is configured. */
export const googleConfigured = Boolean(
  googleConfig.webClientId || googleConfig.androidClientId || googleConfig.iosClientId,
);
