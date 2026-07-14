/**
 * RentFlow brand palette.
 *
 * The app uses a blue / indigo design system. These tokens are shared across
 * every screen so the look stays consistent — screen-specific files should pull
 * colours from here instead of hard-coding hex values.
 */
export const Brand = {
  // Indigo primary — buttons, links, active states.
  primary: '#4F46E5',
  primaryPressed: '#4338CA',
  primarySoft: '#EEF0FF',
  onPrimary: '#FFFFFF',

  // Hero / splash gradient (blue → indigo, top-left → bottom-right).
  heroTop: '#4C63E6',
  heroMid: '#3A43D4',
  heroBottom: '#2A2B8C',
  onHero: '#FFFFFF',

  // Accent for the wordmark / links on light surfaces.
  accent: '#5B53E6',

  // Surfaces.
  background: '#F5F6FB',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F2F8',

  // Text.
  textPrimary: '#1B1F33',
  textSecondary: '#6B7280',
  textMuted: '#9AA0AE',

  // Status.
  success: '#16A34A',
  successSoft: '#DCFCE7',
  warning: '#F59E0B',
  warningSoft: '#FEF3C7',
  danger: '#EF4444',
  dangerSoft: '#FEE2E2',

  // Lines / borders.
  border: '#E6E8EF',
} as const;

export type BrandColor = keyof typeof Brand;
