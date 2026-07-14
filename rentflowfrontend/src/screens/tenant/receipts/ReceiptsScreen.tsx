import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/brand';
import { formatGhs } from '@/lib/format';
import { usePayments } from '@/store/payments';

import { styles } from './styles';

/**
 * Tenant — Receipts. Opened from the Receipts quick action on Home. Lists every
 * settled payment the tenant has made.
 */
export function ReceiptsScreen() {
  const router = useRouter();
  const { payments } = usePayments();

  const receipts = payments.filter((p) => p.amountPaid > 0);
  const totalPaid = receipts.reduce((sum, p) => sum + p.amountPaid, 0);

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
        <Text style={styles.headerTitle}>Receipts</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(450)} style={styles.summary}>
          <View style={styles.summaryIcon}>
            <Ionicons name="receipt-outline" size={22} color={Brand.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryLabel}>Total Paid</Text>
            <Text style={styles.summaryValue}>{formatGhs(totalPaid)}</Text>
          </View>
          <Text style={styles.summaryCount}>{receipts.length} receipts</Text>
        </Animated.View>

        {receipts.length === 0 ? (
          <Text style={styles.summaryLabel}>No receipts yet.</Text>
        ) : null}

        {receipts.map((r, i) => (
          <Animated.View key={r.id} entering={FadeInDown.delay(60 + i * 60).duration(450)}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Receipt ${r.id}`}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
              <View style={styles.cardIcon}>
                <Ionicons name="checkmark-circle" size={22} color={Brand.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Rent · #{r.id}</Text>
                <Text style={styles.cardMeta}>
                  Due {r.dueDate}
                  {r.paidDate ? ` · Paid ${r.paidDate}` : ''}
                </Text>
                <Text style={styles.cardMethod}>{r.status === 'PAID' ? 'Paid in full' : 'Partial'}</Text>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.cardAmount}>{formatGhs(r.amountPaid)}</Text>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default ReceiptsScreen;
