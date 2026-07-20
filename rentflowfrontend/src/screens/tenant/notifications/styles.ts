import { StyleSheet } from "react-native";

import { Brand } from "@/constants/brand";
import { Spacing } from "@/constants/theme";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  iconBtn: {
    padding: Spacing.one,
  },
  iconBtnSpacer: {
    width: 22 + Spacing.one * 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Brand.textPrimary,
  },
  historyBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    backgroundColor: Brand.primarySoft,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  historyBannerText: {
    color: Brand.textSecondary,
    fontWeight: "500",
  },
  historyBannerLink: {
    color: Brand.primary,
    fontWeight: "600",
  },
  filters: {
    flexDirection: "row",
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  filter: {
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: 99,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  filterOn: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  filterText: {
    fontWeight: "500",
    color: Brand.textSecondary,
  },
  filterTextOn: {
    color: "#fff",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 16,
    color: Brand.textMuted,
  },
  groupLabel: {
    fontWeight: "600",
    color: Brand.textPrimary,
    marginBottom: Spacing.two,
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  itemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  itemTitle: {
    fontWeight: "600",
    color: Brand.textPrimary,
    flex: 1,
  },
  itemTime: {
    fontSize: 12,
    color: Brand.textSecondary,
    paddingLeft: Spacing.two,
  },
  itemBody: {
    color: Brand.textSecondary,
    lineHeight: 20,
  },
  authCard: {
    backgroundColor: Brand.surface,
    borderRadius: 12,
    padding: Spacing.four,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  authCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Brand.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },
  authCardTitle: {
    fontWeight: "600",
    fontSize: 16,
    color: Brand.textPrimary,
    marginBottom: Spacing.half,
  },
  authCardBody: {
    color: Brand.textSecondary,
    lineHeight: 18,
  },
  authButton: {
    backgroundColor: Brand.primary,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: 99,
  },
  authButtonDestructive: {
    backgroundColor: "#DC3545",
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
