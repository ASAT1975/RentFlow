import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/brand';
import { formatGhs } from '@/lib/format';
import { usePayments } from '@/store/payments';

import { styles } from './styles';

const STATUS_ICON: Record<string, { name: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  PAID:        { name: 'checkmark-circle', color: Brand.success,     bg: Brand.successSoft },
  PARTIAL:     { name: 'time-outline',     color: Brand.warning,     bg: Brand.warningSoft },
  PENDING:     { name: 'ellipse-outline',  color: Brand.textMuted,   bg: Brand.surfaceAlt  },
  OVERDUE:     { name: 'alert-circle',     color: Brand.danger,       bg: Brand.dangerSoft   },
};

export function PaymentHistoryScreen() {
  const router = useRouter();
  const { payments } = usePayments();

  const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);

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
        <Text style={styles.headerTitle}>Payment History</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(450)} style={styles.summary}>
          <View style={styles.summaryIcon}>
            <Ionicons name="wallet-outline" size={22} color={Brand.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryLabel}>Total Paid</Text>
            <Text style={styles.summaryValue}>{formatGhs(totalPaid)}</Text>
          </View>
          <Text style={styles.summaryCount}>{payments.length} records</Text>
        </Animated.View>

        {payments.length === 0 ? (
          <Text style={styles.empty}>No payment records yet.</Text>
        ) : null}

        {payments.map((p, i) => {
          const icon = STATUS_ICON[p.status] ?? STATUS_ICON.PENDING;
          return (
            <Animated.View key={p.id} entering={FadeInDown.delay(60 + i * 60).duration(450)}>
              <View style={styles.card}>
                <View style={[styles.cardIcon, { backgroundColor: icon.bg }]}>
                  <Ionicons name={icon.name} size={22} color={icon.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Rent · #{p.id}</Text>
                  <Text style={styles.cardMeta}>
                    Due {p.dueDate}
                    {p.paidDate ? ` · Paid ${p.paidDate}` : ''}
                  </Text>
                  <Text style={[styles.cardStatus, { color: icon.color }]}>{p.status}</Text>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.cardAmount}>{formatGhs(p.amountPaid)}</Text>
                  {p.balance > 0 ? (
                    <Text style={styles.cardBalance}>bal {formatGhs(p.balance)}</Text>
                  ) : null}
                </View>
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

export default PaymentHistoryScreen;
