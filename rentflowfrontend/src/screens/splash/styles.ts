import { Platform, StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

import { SplashColors } from './constants';

/**
 * Static styles for the splash screen. Anything size-dependent (badge, logo and
 * wordmark dimensions) is computed responsively in the component and merged in
 * at render time, so this file only holds layout and appearance that never
 * changes between devices.
 */
export const styles = StyleSheet.create({
  /** Full-bleed canvas; the gradient paints on top of this fallback colour. */
  root: {
    flex: 1,
    backgroundColor: SplashColors.background,
  },
  /** Diagonal blue → indigo gradient filling the whole screen. */
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  /** Soft circular highlight near the top for depth (purely decorative). */
  glow: {
    position: 'absolute',
    width: '130%',
    aspectRatio: 1,
    borderRadius: 9999,
    top: '-34%',
    left: '-15%',
    backgroundColor: SplashColors.glow,
  },

  /** Content lives inside the safe area; gradient bleeds underneath it. */
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
  },

  /** White squircle that frames the logo, with a soft drop shadow. */
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SplashColors.badge,
    ...Platform.select({
      ios: {
        shadowColor: SplashColors.badgeShadow,
        shadowOpacity: 0.4,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 12 },
      },
      android: {
        elevation: 14,
      },
      default: {},
    }),
  },

  /** Wordmark + tagline grouped tightly together. */
  textGroup: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  wordmark: {
    color: SplashColors.wordmark,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: SplashColors.wordmarkShadow,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    color: SplashColors.tagline,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 280,
  },
});
