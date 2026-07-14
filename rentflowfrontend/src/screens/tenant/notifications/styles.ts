import { StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.background,
  },

  // Header.
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
  iconBtnSpacer: {
    width: 40,
    height: 40,
  },

  // Filter chips.
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  filter: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  filterOn: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.textSecondary,
  },
  filterTextOn: {
    color: Brand.onPrimary,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 28,
  },

  groupLabel: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: '800',
    color: Brand.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  item: {
    flexDirection: 'row',
    gap: 14,
    padding: 14,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  itemIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  itemTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: Brand.textPrimary,
  },
  itemTime: {
    fontSize: 12,
    color: Brand.textMuted,
  },
  itemBody: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 19,
    color: Brand.textSecondary,
  },

  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: Brand.textMuted,
  },
});
