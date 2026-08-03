/**
 * Google OAuth config for expo-auth-session.
 *
 * Setup steps:
 * 1. Go to https://console.cloud.google.com → APIs & Services → Credentials
 * 2. Create OAuth 2.0 Client IDs for Web, Android, and iOS
 *    - Android: package = com.shaikh67.RentFlow, SHA-1 from `expo fetch:android:hashes`
 *    - iOS: bundle ID = com.shaikh67.RentFlow
 * 3. Create a .env file in the project root with:
 *
 *    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=xxxx.apps.googleusercontent.com
 *    EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=xxxx.apps.googleusercontent.com
 *    EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=xxxx.apps.googleusercontent.com
 *
 * 4. Run a development build (not Expo Go) — Google OAuth does not work in Expo Go
 *    because Google blocks the exp:// redirect scheme.
 *    Use: `npx expo run:android` or `npx expo run:ios`
 */
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

export const googleConfig = {
  webClientId: webClientId ?? 'placeholder-not-configured',
  androidClientId: androidClientId ?? 'placeholder-not-configured',
  iosClientId: iosClientId ?? 'placeholder-not-configured',
  // Use the app scheme so Google accepts the redirect (requires dev build)
  redirectUri: AuthSession.makeRedirectUri({ scheme: 'rentflow' }),
  scopes: ['openid', 'profile', 'email'],
} as const;

/** True only when the client ID for this platform is actually set. */
export const googleConfigured = Boolean(
  Platform.OS === 'android'
    ? androidClientId
    : Platform.OS === 'ios'
      ? iosClientId
      : webClientId,
);
