import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/api';
import { Brand } from '@/constants/brand';
import {
  RENT_STATUS_META,
  type LandlordTenant,
  type RentStatus,
} from '@/constants/landlord-data';
import { formatGhs } from '@/lib/format';
import { usePayments } from '@/store/payments';
import { usePortfolio } from '@/store/portfolio';

import { styles } from './styles';

/** First day of next month, as an ISO date the backend can parse. */
function nextMonthDue() {
  const now = new Date();
  const due = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return due.toISOString().slice(0, 10);
}

const FILTERS = ['All', 'Paid', 'Due', 'Overdue'] as const;
type Filter = (typeof FILTERS)[number];

/**
 * Landlord — Tenants. Everyone renting across the portfolio with their rent
 * status, filterable by payment state.
 */
export function TenantsScreen() {
  const router = useRouter();
  const { tenants: allTenants, loading, refresh } = usePortfolio();
  const { charge } = usePayments();
  const [filter, setFilter] = useState<Filter>('All');

  const chargeRent = (t: LandlordTenant) => {
    if (!t.tenantEmail || t.propertyId == null || !t.rentAmount) {
      Alert.alert('Cannot charge rent', 'This tenant is missing billing details.');
      return;
    }
    const dueDate = nextMonthDue();
    Alert.alert('Charge rent', `Bill ${t.name} ${formatGhs(t.rentAmount)}, due ${dueDate}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Charge',
        onPress: async () => {
          try {
            await charge(t.tenantEmail!, t.propertyId!, t.rentAmount!, dueDate);
            Alert.alert('Rent charged', `${t.name} has been billed ${formatGhs(t.rentAmount!)}.`);
          } catch (err) {
            Alert.alert(
              'Charge failed',
              err instanceof ApiError ? err.message : 'Please try again.',
            );
          }
        },
      },
    ]);
  };

  const tenants = useMemo(
    () => (filter === 'All' ? allTenants : allTenants.filter((t) => t.status === filter)),
    [filter, allTenants],
  );

  const counts = useMemo(() => {
    const by = (s: RentStatus) => allTenants.filter((t) => t.status === s).length;
    return { Paid: by('Paid'), Due: by('Due'), Overdue: by('Overdue') };
  }, [allTenants]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Tenants</Text>
          <Text style={styles.headerSub}>
            {counts.Paid} paid · {counts.Due} due · {counts.Overdue} overdue
          </Text>
        </View>
        <Pressable
          style={styles.addBtn}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Add tenant"
          onPress={() => router.push('/landlord/add-tenant')}>
          <Ionicons name="person-add" size={19} color={Brand.onPrimary} />
        </Pressable>
      </View>

      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const on = f === filter;
          return (
            <Pressable key={f} onPress={() => setFilter(f)} style={[styles.filter, on && styles.filterOn]}>
              <Text style={[styles.filterText, on && styles.filterTextOn]}>{f}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={Brand.primary} />
        }>
        {tenants.map((t, i) => {
          const meta = RENT_STATUS_META[t.status];
          return (
            <Animated.View key={t.id} entering={FadeInDown.delay(i * 50).duration(420)}>
              <Pressable
                onPress={() => chargeRent(t)}
                accessibilityRole="button"
                accessibilityLabel={`Charge rent to ${t.name}`}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{t.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{t.name}</Text>
                  <Text style={styles.meta}>
                    {t.property} · {t.unit}
                  </Text>
                </View>
                <View style={styles.right}>
                  <View style={[styles.statusBadge, { backgroundColor: meta.tint }]}>
                    <Text style={[styles.statusText, { color: meta.color }]}>{t.status}</Text>
                  </View>
                  {t.status !== 'Paid' ? <Text style={styles.amount}>{t.amount}</Text> : null}
                </View>
              </Pressable>
            </Animated.View>
          );
        })}

        {tenants.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={36} color={Brand.textMuted} />
            <Text style={styles.emptyText}>No tenants in this group</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

export default TenantsScreen;
