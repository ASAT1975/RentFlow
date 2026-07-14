import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/api';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Brand } from '@/constants/brand';
import { formatGhs } from '@/lib/format';
import { useTenant } from '@/store/tenant';

import { styles } from './styles';

const RENT_DUE_DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

/**
 * Tenant — Paystack authorization. After joining a unit the tenant picks their
 * monthly rent-due day and completes a one-time Paystack card authorization so
 * the backend scheduler can collect rent automatically.
 */
export function AuthorizePaymentScreen() {
  const router = useRouter();
  const { unit, authorizePayment } = useTenant();
  const [rentDueDay, setRentDueDay] = useState(1);
  const [authorizing, setAuthorizing] = useState(false);

  const startAuthorization = async () => {
    if (authorizing) return;
    setAuthorizing(true);
    try {
      const url = await authorizePayment(rentDueDay);
      await WebBrowser.openBrowserAsync(url);
      router.replace('/tenant/dashboard');
    } catch (err) {
      Alert.alert(
        'Authorization failed',
        err instanceof ApiError
          ? err.message
          : 'Could not start payment authorization. Please try again.',
      );
    } finally {
      setAuthorizing(false);
    }
  };

  const skip = () => router.replace('/tenant/dashboard');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)}>
          <View style={styles.iconBadge}>
            <Ionicons name="card-outline" size={36} color={Brand.primary} />
          </View>
          <Text style={styles.title}>Authorize Rent Payments</Text>
          <Text style={styles.subtitle}>
            Set up automatic rent collection through Paystack. You&apos;ll complete a one-time
            card authorization — rent is then charged on your chosen day each month.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(500)} style={styles.card}>
          <Text style={styles.cardTitle}>{unit?.property ?? 'Your property'}</Text>
          <Text style={styles.cardBody}>
            Unit {unit?.unitNumber ?? '—'} · {unit ? formatGhs(unit.rentAmount) : '—'} / month
          </Text>
          <Text style={styles.note}>
            A small GH₵ 1 verification charge confirms your card. Your landlord bills rent
            through RentFlow; the scheduler collects it on the due day you pick below.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(140).duration(500)}>
          <Text style={styles.fieldLabel}>Rent due day each month</Text>
          <View style={styles.dayGrid}>
            {RENT_DUE_DAYS.map((day) => {
              const on = day === rentDueDay;
              return (
                <Pressable
                  key={day}
                  onPress={() => setRentDueDay(day)}
                  accessibilityRole="button"
                  accessibilityLabel={`Due on day ${day}`}
                  style={[styles.dayChip, on && styles.dayChipOn]}>
                  <Text style={[styles.dayText, on && styles.dayTextOn]}>{day}</Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).duration(500)} style={styles.footer}>
          <PrimaryButton
            label={authorizing ? 'Opening Paystack…' : 'Authorize with Paystack'}
            disabled={authorizing}
            onPress={startAuthorization}
          />
          <PrimaryButton label="Skip for now" variant="ghost" onPress={skip} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AuthorizePaymentScreen;
