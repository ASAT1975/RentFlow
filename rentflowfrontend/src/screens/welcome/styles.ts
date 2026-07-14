import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.surface,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },

  // Language selector (top-right).
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Brand.surfaceAlt,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  langText: {
    fontSize: 14,
    fontWeight: '600',
    color: Brand.textPrimary,
  },

  // Heading.
  heading: {
    marginTop: 16,
  },
  welcomeTo: {
    fontSize: 26,
    fontWeight: '700',
    color: Brand.textPrimary,
  },
  brand: {
    fontSize: 36,
    fontWeight: '800',
    color: Brand.primary,
    marginTop: 2,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: Brand.textSecondary,
    maxWidth: 280,
  },

  // Illustration.
  illustration: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illoWrap: {
    width: '100%',
    alignItems: 'center',
  },
  illoImage: {
    width: '100%',
    maxWidth: 360,
    aspectRatio: 1.252,
  },

  // Footer.
  footer: {
    gap: 16,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  loginText: {
    fontSize: 14,
    color: Brand.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.primary,
  },
});
