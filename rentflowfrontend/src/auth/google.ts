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
import { Platform } from "react-native";

export const googleConfig = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  androidClientId:
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
    "placeholder-not-configured",
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
} as const;

/** True once the client ID for *this* platform is configured. */
export const googleConfigured = Boolean(
  Platform.OS === "android"
    ? process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID
    : Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
      : googleConfig.webClientId,
);
