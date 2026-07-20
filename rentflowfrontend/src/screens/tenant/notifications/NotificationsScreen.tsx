import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { ApiError } from "@/api";
import { Brand } from "@/constants/brand";
import { formatGhs } from "@/lib/format";
import { useMaintenance } from "@/store/maintenance";
import { usePayments } from "@/store/payments";
import { useTenant } from "@/store/tenant";
import { styles } from "./styles";

type NotifType = "payments" | "maintenance" | "alerts";

type Notif = {
  type: NotifType;
  title: string;
  body: string;
  time: string;
};

const META: Record<
  NotifType,
  { icon: keyof typeof Ionicons.glyphMap; tint: string; color: string }
> = {
  payments: {
    icon: "cash-outline",
    tint: Brand.primarySoft,
    color: Brand.primary,
  },
  maintenance: {
    icon: "construct-outline",
    tint: Brand.warningSoft,
    color: Brand.warning,
  },
  alerts: {
    icon: "megaphone-outline",
    tint: Brand.successSoft,
    color: Brand.success,
  },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "payments", label: "Payments" },
  { key: "maintenance", label: "Maintenance" },
  { key: "alerts", label: "Alerts" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

/**
 * Tenant — Notifications. Opened from the bell on Home. Shows every alert the
 * tenant has received, grouped by recency, with quick type filters.
 */
export function NotificationsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>("all");
  const { authorizePayment, deauthorizePayment, unit, refresh } = useTenant();
  const { payments } = usePayments();
  const { requests } = useMaintenance();
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isDeauthorizing, setIsDeauthorizing] = useState(false);

  // Build real notifications from payments and maintenance data.
  const allNotifs: Notif[] = useMemo(() => {
    const notifs: Notif[] = [];
    for (const p of payments) {
      if (p.status === 'PAID' && p.paidDate) {
        notifs.push({
          type: 'payments',
          title: 'Payment Successful ✅',
          body: `Your payment of ${formatGhs(p.amountPaid)} was successful.`,
          time: new Date(p.paidDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        });
      } else if (p.status === 'OVERDUE') {
        notifs.push({
          type: 'payments',
          title: 'Rent Overdue ⚠️',
          body: `Your rent of ${formatGhs(p.totalAmount)} was due on ${p.dueDate}.`,
          time: p.dueDate,
        });
      } else if (p.status === 'PENDING' || p.status === 'PARTIAL') {
        notifs.push({
          type: 'payments',
          title: 'Rent Reminder 💰',
          body: `Your rent of ${formatGhs(p.balance)} is due on ${p.dueDate}.`,
          time: p.dueDate,
        });
      }
    }
    for (const r of requests) {
      const statusLabel = r.status === 'RESOLVED' ? 'completed ✅' : r.status === 'IN_PROGRESS' ? 'in progress 🔧' : 'received';
      notifs.push({
        type: 'maintenance',
        title: r.status === 'RESOLVED' ? 'Request Completed 🎉' : 'Maintenance Update 🔧',
        body: `Your request '${r.title}' has been ${statusLabel}.`,
        time: r.submittedDate,
      });
    }
    return notifs;
  }, [payments, requests]);

  const groups = useMemo(() => {
    const filtered = filter === 'all' ? allNotifs : allNotifs.filter((n) => n.type === filter);
    if (filtered.length === 0) return [];
    return [{ label: 'Activity', items: filtered }];
  }, [allNotifs, filter]);

  const onAuthorize = useCallback(async () => {
    setIsAuthorizing(true);
    try {
      // The day of the month for rent payment can be made dynamic if needed.
      const authorizationUrl = await authorizePayment(15);
      await WebBrowser.openBrowserAsync(authorizationUrl);
      // After the browser closes, you might want to refresh the tenant's status
      // to reflect that payments are now authorized.
      Alert.alert(
        "Authorization Complete",
        "Your account is now set up for automatic rent payments.",
      );
      await refresh();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "An unknown error occurred.";
      Alert.alert("Authorization Failed", message);
    } finally {
      setIsAuthorizing(false);
    }
  }, [authorizePayment, refresh]);

  const onDeauthorize = useCallback(() => {
    Alert.alert(
      "Disable Automatic Payments?",
      "Are you sure? You will need to make rent payments manually each month.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disable",
          style: "destructive",
          onPress: async () => {
            setIsDeauthorizing(true);
            try {
              await deauthorizePayment();
              Alert.alert(
                "Payments Disabled",
                "Automatic rent payments have been turned off.",
              );
            } catch (err) {
              const message =
                err instanceof ApiError
                  ? err.message
                  : "An unknown error occurred.";
              Alert.alert("Failed to Disable", message);
            } finally {
              setIsDeauthorizing(false);
            }
          },
        },
      ],
    );
  }, [deauthorizePayment]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.iconBtn}
        >
          <Ionicons name="arrow-back" size={22} color={Brand.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        {/* Spacer to keep the title centered now that settings is removed. */}
        <View style={styles.iconBtnSpacer} />
      </View>

      <View style={styles.historyBanner}>
        <Text style={styles.historyBannerText}>
          Keep track of your payments.
        </Text>
        <Pressable onPress={() => router.push("/tenant/payment-history")}>
          <Text style={styles.historyBannerLink}>View History →</Text>
        </Pressable>
      </View>

      {/* Filter chips */}
      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const on = f.key === filter;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.filter, on && styles.filterOn]}
            >
              <Text style={[styles.filterText, on && styles.filterTextOn]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {groups.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons
              name="notifications-off-outline"
              size={36}
              color={Brand.textMuted}
            />
            <Text style={styles.emptyText}>No notifications here yet</Text>
          </View>
        ) : (
          <>
            {unit &&
              (unit.paymentAuthorized ? (
                <Animated.View
                  entering={FadeInDown.duration(450)}
                  style={styles.authCard}
                >
                  <View style={styles.authCardIcon}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={24}
                      color={Brand.success}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.authCardTitle}>You're all set!</Text>
                    <Text style={styles.authCardBody}>
                      Your rent of {formatGhs(unit.rentAmount)} will be
                      automatically paid each month.
                    </Text>
                  </View>
                  <Pressable
                    style={[
                      styles.authButton,
                      styles.authButtonDestructive,
                      isDeauthorizing && styles.authButtonDisabled,
                    ]}
                    onPress={onDeauthorize}
                    disabled={isDeauthorizing}
                  >
                    <Text style={styles.authButtonText}>
                      {isDeauthorizing ? "Disabling..." : "Disable"}
                    </Text>
                  </Pressable>
                </Animated.View>
              ) : (
                <Animated.View
                  entering={FadeInDown.duration(450)}
                  style={styles.authCard}
                >
                  <View style={styles.authCardIcon}>
                    <Ionicons
                      name="card-outline"
                      size={24}
                      color={Brand.primary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.authCardTitle}>Automate Your Rent</Text>
                    <Text style={styles.authCardBody}>
                      Set up automatic payments and never worry about a due date
                      again.
                    </Text>
                  </View>
                  <Pressable
                    style={[
                      styles.authButton,
                      isAuthorizing && styles.authButtonDisabled,
                    ]}
                    onPress={onAuthorize}
                    disabled={isAuthorizing}
                  >
                    <Text style={styles.authButtonText}>
                      {isAuthorizing ? "Setting up..." : "Set Up"}
                    </Text>
                  </Pressable>
                </Animated.View>
              ))}

            {groups.map((g, gi) => (
              <Animated.View
                key={g.label}
                entering={FadeInDown.delay((gi + 1) * 60).duration(450)}
              >
                <Text style={styles.groupLabel}>{g.label}</Text>
                {g.items.map((item, i) => {
                  const meta = META[item.type];
                  return (
                    <View key={`${g.label}-${i}`} style={styles.item}>
                      <View
                        style={[
                          styles.itemIcon,
                          { backgroundColor: meta.tint },
                        ]}
                      >
                        <Ionicons
                          name={meta.icon}
                          size={20}
                          color={meta.color}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.itemTop}>
                          <Text style={styles.itemTitle}>{item.title}</Text>
                          <Text style={styles.itemTime}>{item.time}</Text>
                        </View>
                        <Text style={styles.itemBody}>{item.body}</Text>
                      </View>
                    </View>
                  );
                })}
              </Animated.View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default NotificationsScreen;
