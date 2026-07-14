import { Platform, StyleSheet } from 'react-native';

import { Brand } from '@/constants/brand';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 28,
    fontSize: 15,
    color: Brand.textSecondary,
  },

  card: {
    backgroundColor: Brand.surface,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Brand.border,
    ...Platform.select({
      ios: {
        shadowColor: '#1B1F33',
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconTile: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '800',
    color: Brand.textPrimary,
  },
  cardDesc: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: Brand.textSecondary,
    maxWidth: '92%',
  },
});
