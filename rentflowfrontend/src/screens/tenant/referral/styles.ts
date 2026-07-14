import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.surface,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 24,
  },

  title: {
    marginTop: 8,
    fontSize: 26,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 28,
    fontSize: 15,
    lineHeight: 22,
    color: Brand.textSecondary,
  },

  field: {
    marginBottom: 22,
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  helpCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 28,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Brand.surfaceAlt,
  },
  helpIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surface,
  },
  helpTextWrap: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.textPrimary,
  },
  helpBody: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textSecondary,
  },
});
