/**
 * Brand constants for the RentFlow splash screen.
 *
 * Everything except the logo glyph is recreated with native components, spacing
 * and typography — only the custom "R" house mark is an image (recoloured to
 * brand indigo so it fits the blue UI). Colours come from the shared brand
 * palette so the splash stays in sync with the rest of the app.
 */
import { Platform } from 'react-native';

import { Brand } from '@/constants/brand';
import { Fonts, Spacing } from '@/constants/theme';

/** The custom logo glyph (indigo on white) cropped from the original artwork. */
export const LOGO = require('../../../assets/images/rentflow-logo-blue.png');

/** Brand tagline shown under the wordmark. */
export const TAGLINE = 'Manage properties. Simplify rent. Grow your business.';

export const SplashColors = {
  /** Diagonal blue → indigo gradient behind everything. */
  gradient: [Brand.heroTop, Brand.heroMid, Brand.heroBottom] as const,
  /** Solid fallback while the gradient mounts. */
  background: Brand.heroMid,
  /** Soft highlight that adds depth to the gradient. */
  glow: '#8A98F2',
  /** White squircle badge that holds the logo. */
  badge: Brand.surface,
  /** Soft shadow cast by the badge (iOS only; Android uses elevation). */
  badgeShadow: '#15163F',
  /** Wordmark colour. */
  wordmark: Brand.onHero,
  /** Subtle drop shadow behind the wordmark for legibility. */
  wordmarkShadow: 'rgba(12, 12, 50, 0.35)',
  /** Tagline colour (slightly translucent white). */
  tagline: 'rgba(255, 255, 255, 0.88)',
} as const;

/**
 * Responsive sizing rules. Pixel sizes are derived at render time from the
 * window dimensions and clamped, so the layout scales sensibly from small
 * phones up to tablets on both Android and iOS.
 */
export const Layout = {
  /** Badge width as a fraction of the screen's shorter side. */
  badgeRatio: 0.27,
  badgeMinSize: 92,
  badgeMaxSize: 148,
  /** Corner radius as a fraction of the badge size (squircle look). */
  badgeRadiusRatio: 0.28,
  /** Logo size as a fraction of the badge size. */
  logoRatio: 0.66,
  /** Wordmark font size as a fraction of the screen width. */
  titleRatio: 0.092,
  titleMinSize: 30,
  titleMaxSize: 46,
  /** Vertical gap between the badge and the text group. */
  gap: Spacing.four,
} as const;

/**
 * Heavy, slightly rounded face for the wordmark. iOS gets SF Rounded for the
 * friendly look of the artwork; other platforms fall back to the system font
 * with a heavy weight.
 */
export const WordmarkFontFamily = Platform.OS === 'ios' ? Fonts?.rounded : undefined;

/**
 * Animation timing (milliseconds). Kept here so the choreography is easy to
 * tune in one place.
 */
export const Animation = {
  /** Badge fade/scale-in on mount. */
  badgeFadeMs: 520,
  /** Wordmark starts slightly after the badge. */
  titleDelayMs: 320,
  titleFadeMs: 440,
  /** Tagline trails the wordmark. */
  taglineDelayMs: 540,
  taglineFadeMs: 460,
  /** Gentle "breathing" pulse on the badge. */
  pulseDelayMs: 720,
  pulsePeriodMs: 1150,
  /** Slow drift of the background glow. */
  glowDriftMs: 6000,
  /** How long the fully-revealed splash holds before it fades out. */
  holdMs: 1500,
  /** Fade-out that hands off to the app. */
  fadeOutMs: 480,
} as const;

/** Clamp a value into the inclusive [min, max] range. */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);
