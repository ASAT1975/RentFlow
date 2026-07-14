import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.surface,
  },
  flex: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: Brand.textSecondary,
  },

  segment: {
    marginTop: 24,
    marginBottom: 24,
  },

  field: {
    marginBottom: 16,
  },

  forgot: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 22,
    fontSize: 13,
    fontWeight: '600',
    color: Brand.primary,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Brand.border,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: Brand.textMuted,
  },

  social: {
    gap: 12,
  },
});
