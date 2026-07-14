import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  spacer: {
    width: 40,
    height: 40,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 32,
  },

  // Summary.
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: Brand.primarySoft,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.surface,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.primary,
  },
  summaryValue: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: '800',
    color: Brand.primary,
  },
  summaryCount: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.primary,
  },

  // Receipt card.
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    marginBottom: 12,
    borderRadius: 18,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  cardPressed: {
    backgroundColor: Brand.surfaceAlt,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.successSoft,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  cardMeta: {
    marginTop: 2,
    fontSize: 12,
    color: Brand.textSecondary,
  },
  cardMethod: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: Brand.textMuted,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  cardAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  download: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: Brand.primarySoft,
  },
  downloadText: {
    fontSize: 12,
    fontWeight: '700',
    color: Brand.primary,
  },
});
