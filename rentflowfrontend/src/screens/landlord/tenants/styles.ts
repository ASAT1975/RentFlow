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
    paddingTop: 6,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  headerSub: {
    marginTop: 2,
    fontSize: 13,
    color: Brand.textSecondary,
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primary,
  },

  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  filter: {
    paddingHorizontal: 16,
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
    paddingTop: 8,
    paddingBottom: 28,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  rowPressed: {
    backgroundColor: Brand.surfaceAlt,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primarySoft,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: Brand.primary,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.textPrimary,
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: Brand.textSecondary,
  },
  right: {
    alignItems: 'flex-end',
    gap: 5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  amount: {
    fontSize: 13,
    fontWeight: '800',
    color: Brand.textPrimary,
  },

  empty: {
    alignItems: 'center',
    paddingTop: 70,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: Brand.textMuted,
  },
});
