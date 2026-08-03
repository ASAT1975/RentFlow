import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/api';
import { Brand } from '@/constants/brand';
import { formatGhs } from '@/lib/format';
import { type PaymentItem, usePayments } from '@/store/payments';
import { usePortfolio } from '@/store/portfolio';

import { styles } from './styles';

type Filter = 'All' | 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE';

const FILTERS: Filter[] = ['All', 'PENDING', 'PARTIAL', 'PAID', 'OVERDUE'];

const FILTER_LABEL: Record<Filter, string> = {
  All: 'All',
  PENDING: 'Pending',
  PARTIAL: 'Partial',
  PAID: 'Paid',
  OVERDUE: 'Overdue',
};

const STATUS_META: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  PAID:    { icon: 'checkmark-circle', color: Brand.success, bg: Brand.successSoft },
  PARTIAL: { icon: 'time-outline',     color: Brand.warning, bg: Brand.warningSoft },
  PENDING: { icon: 'ellipse-outline',  color: Brand.textMuted, bg: Brand.surfaceAlt },
  OVERDUE: { icon: 'alert-circle',     color: Brand.danger,  bg: Brand.dangerSoft },
};

/** First day of next month as ISO date string. */
function nextMonthDue() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().slice(0, 10);
}

export function PaymentsScreen() {
  const router = useRouter();
  const { payments, loading, collected, expected, refresh, charge } = usePayments();
  const { tenants } = usePortfolio();
  const [filter, setFilter] = useState<Filter>('All');

  const visible = useMemo(
    () => (filter === 'All' ? payments : payments.filter((p) => p.status === filter)),
    [filter, payments],
  );

  const outstanding = expected - collected;

  const chargeAll = () => {
    const chargeable = tenants.filter(
      (t) => (t.status === 'Due' || t.status === 'Overdue') && t.tenantEmail && t.propertyId && t.rentAmount,
    );
    if (chargeable.length === 0) {
      Alert.alert('Nothing to charge', 'All tenants are up to date.');
      return;
    }
    Alert.alert(
      'Charge all due tenants',
      `Bill ${chargeable.length} tenant${chargeable.length > 1 ? 's' : ''} for this month?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Charge All',
          onPress: async () => {
            const dueDate = nextMonthDue();
            let failed = 0;
            for (const t of chargeable) {
              try {
                await charge(t.tenantEmail!, t.propertyId!, t.rentAmount!, dueDate);
              } catch {
                failed++;
              }
            }
            if (failed > 0) {
              Alert.alert('Partial success', `${chargeable.length - failed} charged, ${failed} failed.`);
            } else {
              Alert.alert('Done', `${chargeable.length} tenant${chargeable.length > 1 ? 's' : ''} billed.`);
            }
          },
        },
      ],
    );
  };

  const chargeOne = (p: PaymentItem) => {
    // Match tenant by name — tenants from portfolio store carry billing details
    const tenant = tenants.find((t) =>
      p.tenantName ? t.name === p.tenantName : t.tenantEmail === p.tenantName,
    );
    if (!tenant?.tenantEmail || !tenant.propertyId || !tenant.rentAmount) {
      // Fallback: if we can't match a tenant, show a generic error
      Alert.alert('Cannot charge', 'Billing details not available. Go to Tenants tab to charge manually.');
      return;
    }
    const dueDate = nextMonthDue();
    Alert.alert(
      'Charge rent',
      `Bill ${tenant.name} ${formatGhs(tenant.rentAmount)}, due ${dueDate}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Charge',
          onPress: async () => {
            try {
              await charge(tenant.tenantEmail!, tenant.propertyId!, tenant.rentAmount!, dueDate);
              Alert.alert('Charged', `${tenant.name} has been billed ${formatGhs(tenant.rentAmount!)}.`);
            } catch (err) {
              Alert.alert('Failed', err instanceof ApiError ? err.message : 'Please try again.');
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={Brand.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Payments</Text>
        <Pressable
          onPress={chargeAll}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Charge all due tenants"
          style={styles.chargeBtn}>
          <Ionicons name="flash" size={16} color={Brand.onPrimary} />
          <Text style={styles.chargeBtnText}>Charge All</Text>
        </Pressable>
      </View>

      {/* Summary cards */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Collected</Text>
          <Text style={[styles.summaryValue, { color: Brand.success }]}>{formatGhs(collected)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Expected</Text>
          <Text style={styles.summaryValue}>{formatGhs(expected)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Outstanding</Text>
          <Text style={[styles.summaryValue, { color: outstanding > 0 ? Brand.danger : Brand.success }]}>
            {formatGhs(outstanding)}
          </Text>
        </View>
      </Animated.View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}>
        {FILTERS.map((f) => {
          const on = f === filter;
          return (
            <Pressable key={f} onPress={() => setFilter(f)} style={[styles.filter, on && styles.filterOn]}>
              <Text style={[styles.filterText, on && styles.filterTextOn]}>{FILTER_LABEL[f]}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={Brand.primary} />}>
        {visible.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="wallet-outline" size={36} color={Brand.textMuted} />
            <Text style={styles.emptyText}>No payments in this group</Text>
          </View>
        ) : null}

        {visible.map((p, i) => {
          const meta = STATUS_META[p.status] ?? STATUS_META.PENDING;
          const canCharge = p.status === 'PENDING' || p.status === 'OVERDUE' || p.status === 'PARTIAL';
          return (
            <Animated.View key={p.id} entering={FadeInDown.delay(i * 50).duration(420)}>
              <Pressable
                onPress={() => canCharge && chargeOne(p)}
                accessibilityRole="button"
                style={({ pressed }) => [styles.card, pressed && canCharge && styles.cardPressed]}>
                <View style={[styles.cardIcon, { backgroundColor: meta.bg }]}>
                  <Ionicons name={meta.icon} size={22} color={meta.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardName}>{p.tenantName ?? 'Tenant'}</Text>
                  <Text style={styles.cardMeta}>
                    {p.propertyName ?? '—'} · Due {p.dueDate}
                    {p.paidDate ? ` · Paid ${p.paidDate}` : ''}
                  </Text>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.cardAmount}>{formatGhs(p.totalAmount)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
                    <Text style={[styles.statusText, { color: meta.color }]}>{p.status}</Text>
                  </View>
                  {canCharge ? (
                    <Ionicons name="flash-outline" size={14} color={Brand.textMuted} />
                  ) : null}
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

export default PaymentsScreen;
