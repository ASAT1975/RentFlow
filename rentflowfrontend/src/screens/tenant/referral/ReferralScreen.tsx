import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/api';
import { BackButton } from '@/components/ui/back-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { Brand } from '@/constants/brand';
import { useTenant } from '@/store/tenant';

import { styles } from './styles';

/**
 * Tenant — Enter Referral Code. The tenant types the code their landlord gave
 * them (or scans it) and verifies to find the property.
 */
export function ReferralScreen() {
  const router = useRouter();
  const { joinUnit } = useTenant();
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  const verify = async () => {
    const trimmed = code.trim();
    if (!trimmed || verifying) {
      if (!trimmed) Alert.alert('Enter a code', 'Please enter the referral code from your landlord.');
      return;
    }
    setVerifying(true);
    try {
      await joinUnit(trimmed);
      router.push('/tenant/verify');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'That code did not work. Please check and try again.';
      Alert.alert('Invalid code', message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)}>
          <BackButton />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(60).duration(500)}>
          <Text style={styles.title}>Enter Referral Code</Text>
          <Text style={styles.subtitle}>Enter the code provided by your landlord</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(140).duration(500)}>
          <TextField
            label="Referral Code"
            value={code}
            onChangeText={(t) => setCode(t.toUpperCase())}
            placeholder="RF-7K9X2L"
            autoCapitalize="characters"
            autoCorrect={false}
            containerStyle={styles.field}
            rightSlot={
              <Pressable
                style={styles.scanButton}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Scan referral code">
                <Ionicons name="scan-outline" size={22} color={Brand.primary} />
              </Pressable>
            }
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).duration(500)}>
          <PrimaryButton
            label={verifying ? 'Verifying…' : 'Verify Code'}
            onPress={verify}
            disabled={verifying}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.helpCard}>
          <View style={styles.helpIcon}>
            <Ionicons name="help-circle-outline" size={22} color={Brand.textSecondary} />
          </View>
          <View style={styles.helpTextWrap}>
            <Text style={styles.helpTitle}>Don&apos;t have a code?</Text>
            <Text style={styles.helpBody}>
              Please contact your landlord to get a referral code.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ReferralScreen;
