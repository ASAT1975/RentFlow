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
    paddingBottom: 8,
  },
  iconBadge: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primarySoft,
    marginTop: 12,
  },
  title: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: '800',
    color: Brand.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 22,
    fontSize: 15,
    lineHeight: 22,
    color: Brand.textSecondary,
    textAlign: 'center',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
    padding: 18,
    shadowColor: '#1B1F33',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  cardBody: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: Brand.textSecondary,
  },
  fieldLabel: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: '600',
    color: Brand.textSecondary,
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayChip: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
  },
  dayChipOn: {
    borderColor: Brand.primary,
    backgroundColor: Brand.primarySoft,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.textSecondary,
  },
  dayTextOn: {
    color: Brand.primary,
  },
  note: {
    marginTop: 16,
    fontSize: 13,
    lineHeight: 19,
    color: Brand.textMuted,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 24,
    paddingBottom: 8,
    gap: 12,
  },
});
