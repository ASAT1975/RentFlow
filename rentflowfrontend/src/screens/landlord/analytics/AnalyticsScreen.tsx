import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/brand';
import { usePayments } from '@/store/payments';
import { usePortfolio } from '@/store/portfolio';

import { styles } from './styles';

const CHART_HEIGHT = 130;

type Metric = {
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  color: string;
  label: string;
  value: string;
};

function formatGhs(n: number) {
  return `GH₵ ${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

export function AnalyticsScreen() {
  const { properties, summary } = usePortfolio();
  const { payments } = usePayments();

  const avgRent = summary.tenants
    ? Math.round(Number(summary.monthlyRevenue.replace(/[^0-9]/g, '')) / summary.tenants)
    : 0;

  // Build a 6-month revenue trend from real payment data.
  const revenueTrend = (() => {
    const months: { month: string; value: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('en-GB', { month: 'short' });
      const value = payments
        .filter((p) => {
          const pd = p.paidDate ? new Date(p.paidDate) : null;
          return pd && pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
        })
        .reduce((sum, p) => sum + p.amountPaid, 0);
      months.push({ month: label, value });
    }
    return months;
  })();

  const metrics: Metric[] = [
    { icon: 'bed-outline', tint: Brand.primarySoft, color: Brand.primary, label: 'Occupancy', value: `${Math.round(summary.occupancyRate * 100)}%` },
    { icon: 'wallet-outline', tint: Brand.successSoft, color: Brand.success, label: 'Monthly Revenue', value: summary.monthlyRevenue },
    { icon: 'cash-outline', tint: Brand.warningSoft, color: Brand.warning, label: 'Avg. Rent', value: formatGhs(avgRent) },
    { icon: 'business-outline', tint: Brand.primarySoft, color: Brand.accent, label: 'Properties', value: String(summary.properties) },
  ];

  const maxTrend = Math.max(1, ...revenueTrend.map((d) => d.value));
  const maxProp = Math.max(
    1,
    ...properties.map((p) => Number(p.revenue.replace(/[^0-9]/g, ''))),
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Revenue trend */}
        <Animated.View entering={FadeInDown.duration(450)} style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.cardTitle}>Revenue</Text>
            <Text style={styles.cardSub}>Last 6 months</Text>
          </View>
          <View style={styles.chart}>
            {revenueTrend.map((d, i) => {
              const last = i === revenueTrend.length - 1;
              const h = Math.max(6, (d.value / maxTrend) * CHART_HEIGHT);
              return (
                <View key={d.month} style={styles.chartCol}>
                  <View
                    style={[
                      styles.bar,
                      { height: h, backgroundColor: last ? Brand.primary : Brand.primarySoft },
                    ]}
                  />
                  <Text style={styles.chartLabel}>{d.month}</Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Key metrics */}
        <Animated.View entering={FadeInDown.delay(100).duration(450)} style={styles.metricsGrid}>
          {metrics.map((m) => (
            <View key={m.label} style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: m.tint }]}>
                <Ionicons name={m.icon} size={18} color={m.color} />
              </View>
              <Text style={styles.metricValue}>{m.value}</Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Revenue by property */}
        <Animated.View entering={FadeInDown.delay(180).duration(450)} style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Revenue by Property</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(220).duration(450)} style={styles.card}>
          {properties.length === 0 ? (
            <Text style={styles.cardSub}>No properties yet.</Text>
          ) : null}
          {properties.map((p, i) => {
            const value = Number(p.revenue.replace(/[^0-9]/g, ''));
            const pct = Math.round((value / maxProp) * 100);
            return (
              <View key={p.id} style={[styles.propRow, i > 0 && styles.propRowGap]}>
                <View style={styles.propTop}>
                  <Text style={styles.propName} numberOfLines={1}>
                    {p.emoji}  {p.name}
                  </Text>
                  <Text style={styles.propValue}>{p.revenue}</Text>
                </View>
                <View style={styles.hTrack}>
                  <View style={[styles.hFill, { width: `${pct}%` }]} />
                </View>
              </View>
            );
          })}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AnalyticsScreen;
