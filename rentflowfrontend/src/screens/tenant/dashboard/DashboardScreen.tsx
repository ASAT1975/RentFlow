import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaymentSheet } from '@/components/payment-sheet';
import { Brand } from '@/constants/brand';
import { formatGhs } from '@/lib/format';
import { useAuth } from '@/store/auth';
import { usePayments } from '@/store/payments';
import { useTenant } from '@/store/tenant';

import { styles } from './styles';

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PAID: 'Paid',
  PARTIAL: 'Partial',
  PENDING: 'Due',
  OVERDUE: 'Overdue',
};

type Overview = {
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  color: string;
  label: string;
  value: string;
};

function firstNameOf(name?: string) {
  return name?.trim().split(/\s+/)[0] || 'there';
}

/**
 * Tenant — Home. The hub once a tenant has joined a property: greeting, their
 * unit + rent, quick actions and (once wired) payment history.
 */
export function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { unit } = useTenant();
  const { payments, outstanding, pay } = usePayments();
  const [payVisible, setPayVisible] = useState(false);

  const rent = unit ? formatGhs(unit.rentAmount) : '—';
  const nextDue = payments.find((p) => p.status !== 'PAID');
  const outstandingLabel = formatGhs(outstanding);
  const overview: Overview[] = [
    { icon: 'business-outline', tint: Brand.primarySoft, color: Brand.primary, label: 'Property', value: unit?.property ?? '—' },
    { icon: 'bed-outline', tint: Brand.primarySoft, color: Brand.accent, label: 'Your Room', value: unit?.unitNumber ?? '—' },
    { icon: 'cash-outline', tint: Brand.warningSoft, color: Brand.warning, label: 'Monthly Rent', value: rent },
    { icon: 'checkmark-circle-outline', tint: Brand.successSoft, color: Brand.success, label: 'Status', value: unit?.status === 'OCCUPIED' ? 'Active' : '—' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(450)} style={styles.header}>
          <View style={styles.headerCenter}>
            <Text style={styles.greeting}>Hello, {firstNameOf(user?.name)} 👋</Text>
            <Text style={styles.greetingSub}>Welcome back to your home</Text>
          </View>
          <Pressable
            style={styles.iconBtn}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => router.push('/tenant/notifications')}>
            <Ionicons name="notifications-outline" size={22} color={Brand.textPrimary} />
            <View style={styles.bellDot} />
          </Pressable>
        </Animated.View>

        {/* Next rent due */}
        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <LinearGradient
            colors={[Brand.heroTop, Brand.heroMid, Brand.heroBottom]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.rentCard}>
            <View style={styles.rentRow}>
              <View>
                <Text style={styles.rentLabel}>Your Home</Text>
                <Text style={styles.rentDate}>{unit?.property ?? '—'}</Text>
                <View style={styles.remainingPill}>
                  <Ionicons name="bed-outline" size={13} color={Brand.onHero} />
                  <Text style={styles.remainingText}>Unit {unit?.unitNumber ?? '—'}</Text>
                </View>
              </View>
              <View style={styles.rentRight}>
                <Text style={styles.outLabel}>{outstanding > 0 ? 'Outstanding' : 'Monthly Rent'}</Text>
                <Text style={styles.outValue}>{outstanding > 0 ? outstandingLabel : rent}</Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Pay rent now"
              disabled={!nextDue}
              onPress={() => setPayVisible(true)}
              style={({ pressed }) => [
                styles.payButton,
                pressed && styles.payButtonPressed,
                !nextDue && { opacity: 0.6 },
              ]}>
              <Ionicons name={nextDue ? 'card' : 'checkmark-circle'} size={18} color={Brand.primary} />
              <Text style={styles.payButtonText}>{nextDue ? 'Pay Now' : 'All Paid'}</Text>
            </Pressable>
          </LinearGradient>
        </Animated.View>

        {/* Overview */}
        <Animated.View entering={FadeInDown.delay(160).duration(500)} style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Overview</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.overviewGrid}>
          {overview.map((item) => (
            <View key={item.label} style={styles.overviewCard}>
              <View style={[styles.overviewIcon, { backgroundColor: item.tint }]}>
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <Text style={styles.overviewLabel}>{item.label}</Text>
              <Text style={styles.overviewValue}>{item.value}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Quick actions */}
        <Animated.View entering={FadeInDown.delay(240).duration(500)} style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(280).duration(500)} style={styles.actionsRow}>
          <QuickAction icon="card-outline" tint={Brand.primarySoft} color={Brand.primary} label="Pay Rent" onPress={() => setPayVisible(true)} />
          <QuickAction icon="construct-outline" tint={Brand.warningSoft} color={Brand.warning} label="Maintenance" onPress={() => router.push('/tenant/report')} />
          <QuickAction icon="receipt-outline" tint={Brand.successSoft} color={Brand.success} label="Receipts" onPress={() => router.push('/tenant/receipts')} />
          <QuickAction icon="business-outline" tint={Brand.primarySoft} color={Brand.accent} label="Property" onPress={() => router.push('/tenant/property')} />
        </Animated.View>

        {/* Payment history */}
        <Animated.View entering={FadeInDown.delay(320).duration(500)} style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Payment History</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(360).duration(500)} style={styles.historyCard}>
          {payments.length === 0 ? (
            <View style={styles.historyRow}>
              <View style={styles.historyIcon}>
                <Ionicons name="receipt-outline" size={20} color={Brand.textMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyTitle}>No payments yet</Text>
                <Text style={styles.historyDate}>Your rent dues will appear here.</Text>
              </View>
            </View>
          ) : (
            payments.map((p, index) => {
              const isPaid = p.status === 'PAID';
              return (
                <View key={p.id}>
                  {index > 0 && <View style={styles.historyDivider} />}
                  <View style={styles.historyRow}>
                    <View style={styles.historyIcon}>
                      <Ionicons
                        name={isPaid ? 'checkmark-circle' : 'time-outline'}
                        size={20}
                        color={isPaid ? Brand.success : Brand.warning}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.historyTitle}>Rent · due {p.dueDate}</Text>
                      <Text style={styles.historyDate}>
                        {isPaid
                          ? `Paid ${formatGhs(p.amountPaid)}`
                          : `Balance ${formatGhs(p.balance)}`}
                      </Text>
                    </View>
                    <View style={styles.historyRight}>
                      <Text style={styles.historyAmount}>{formatGhs(p.totalAmount)}</Text>
                      <View style={[styles.paidTag, !isPaid && { backgroundColor: Brand.warningSoft }]}>
                        <Text style={[styles.paidTagText, !isPaid && { color: Brand.warning }]}>
                          {PAYMENT_STATUS_LABEL[p.status] ?? p.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </Animated.View>
      </ScrollView>

      <PaymentSheet
        visible={payVisible}
        amount={nextDue ? formatGhs(nextDue.balance) : rent}
        onPay={nextDue ? () => pay(nextDue.id, nextDue.balance) : undefined}
        onClose={() => setPayVisible(false)}
      />
    </SafeAreaView>
  );
}

type QuickActionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  color: string;
  label: string;
  onPress?: () => void;
};

function QuickAction({ icon, tint, color, label, onPress }: QuickActionProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.actionTile, pressed && styles.actionTilePressed]}>
      <View style={[styles.actionIcon, { backgroundColor: tint }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

export default DashboardScreen;
