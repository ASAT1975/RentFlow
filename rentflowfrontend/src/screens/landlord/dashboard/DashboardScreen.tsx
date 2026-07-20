import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/brand';
import { useAuth } from '@/store/auth';
import { STATUS_LABEL, useMaintenance } from '@/store/maintenance';
import { usePayments } from '@/store/payments';
import { usePortfolio } from '@/store/portfolio';

import { styles } from './styles';

function formatGhs(n: number) {
  return `GH₵ ${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

type Stat = {
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  color: string;
  label: string;
  value: string;
};

function firstNameOf(name?: string) {
  return name?.trim().split(/\s+/)[0] || 'there';
}

function initialsOf(name?: string) {
  return (
    (name ?? '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || '👤'
  );
}

/**
 * Landlord — Dashboard. Portfolio overview: this month's revenue and
 * collection, headline stats, maintenance needing attention and recent
 * activity across all properties.
 */
export function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { summary, loading, refresh } = usePortfolio();
  const { requests } = useMaintenance();
  const { payments, collected, expected } = usePayments();

  const openRequests = requests.filter((r) => r.status !== 'RESOLVED');
  const collectionRate = expected > 0 ? collected / expected : 0;
  const recentPayments = [...payments]
    .sort((a, b) => (b.paidDate ?? b.dueDate) > (a.paidDate ?? a.dueDate) ? 1 : -1)
    .slice(0, 5);

  const stats: Stat[] = [
    { icon: 'business-outline', tint: Brand.primarySoft, color: Brand.primary, label: 'Properties', value: String(summary.properties) },
    { icon: 'people-outline', tint: Brand.successSoft, color: Brand.success, label: 'Tenants', value: String(summary.tenants) },
    { icon: 'bed-outline', tint: Brand.primarySoft, color: Brand.accent, label: 'Occupancy', value: `${Math.round(summary.occupancyRate * 100)}%` },
    { icon: 'home-outline', tint: Brand.warningSoft, color: Brand.warning, label: 'Units', value: String(summary.units) },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={Brand.primary} />
        }>
        <Animated.View entering={FadeInDown.duration(450)} style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Hello, {firstNameOf(user?.name)} 👋</Text>
            <Text style={styles.greetingSub}>Here&apos;s your portfolio today</Text>
          </View>
          <Pressable
            onPress={() => router.push('/landlord/profile')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            style={({ pressed }) => [styles.avatar, pressed && { opacity: 0.7 }]}>
            <Text style={styles.avatarText}>{initialsOf(user?.name)}</Text>
          </Pressable>
        </Animated.View>

        {/* Revenue */}
        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <LinearGradient
            colors={[Brand.heroTop, Brand.heroMid, Brand.heroBottom]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.revenueCard}>
            <Text style={styles.revenueLabel}>Expected Monthly Revenue</Text>
            <Text style={styles.revenueValue}>{summary.monthlyRevenue}</Text>

            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${collectionRate * 100}%` }]} />
            </View>
            <View style={styles.revenueRow}>
              <Text style={styles.revenueMeta}>Collected {formatGhs(collected)}</Text>
              <Text style={styles.revenueMeta}>{Math.round(collectionRate * 100)}%</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats grid */}
        <Animated.View entering={FadeInDown.delay(160).duration(500)} style={styles.statsGrid}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.tint }]}>
                <Ionicons name={s.icon} size={18} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Pending maintenance */}
        <Animated.View entering={FadeInDown.delay(220).duration(500)} style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Needs Attention</Text>
          <Text style={styles.badgeCount}>{openRequests.length}</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(260).duration(500)} style={styles.card}>
          {openRequests.length === 0 ? (
            <View style={styles.row}>
              <View style={styles.emojiTile}>
                <Text style={styles.emoji}>✅</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>All caught up</Text>
                <Text style={styles.rowMeta}>No open maintenance requests</Text>
              </View>
            </View>
          ) : (
            openRequests.map((m, i) => {
              const label = STATUS_LABEL[m.status];
              return (
                <View key={m.id}>
                  {i > 0 && <View style={styles.divider} />}
                  <Pressable
                    onPress={() => router.push(`/landlord/maintenance/${m.id}`)}
                    accessibilityRole="button"
                    accessibilityLabel={`Open ${m.title} request`}
                    style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>
                    <View style={styles.emojiTile}>
                      <Text style={styles.emoji}>🔧</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle}>{m.title}</Text>
                      <Text style={styles.rowMeta}>{m.propertyName ?? m.tenantName ?? '—'}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            label === 'Open' ? Brand.primarySoft : Brand.warningSoft,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.statusText,
                          { color: label === 'Open' ? Brand.primary : Brand.warning },
                        ]}>
                        {label}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={Brand.textMuted} />
                  </Pressable>
                </View>
              );
            })
          )}
        </Animated.View>

        {/* Recent payments */}
        <Animated.View entering={FadeInDown.delay(320).duration(500)} style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Recent Payments</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(360).duration(500)} style={styles.card}>
          {recentPayments.length === 0 ? (
            <View style={styles.row}>
              <View style={styles.emojiTile}><Text style={styles.emoji}>💳</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>No payments yet</Text>
                <Text style={styles.rowMeta}>Payments will appear here once charged</Text>
              </View>
            </View>
          ) : (
            recentPayments.map((p, i) => (
              <View key={p.id}>
                {i > 0 && <View style={styles.divider} />}
                <View style={styles.row}>
                  <View style={styles.emojiTile}><Text style={styles.emoji}>💰</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowTitle}>{p.tenantName ?? 'Tenant'}</Text>
                    <Text style={styles.rowMeta}>{p.propertyName ?? '—'} · {formatGhs(p.amountPaid)}</Text>
                  </View>
                  <Text style={styles.rowTime}>{p.paidDate ? new Date(p.paidDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : p.dueDate}</Text>
                </View>
              </View>
            ))
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default DashboardScreen;
