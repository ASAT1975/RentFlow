import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/ui/back-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Brand } from '@/constants/brand';
import { PROPERTY_PHOTO } from '@/constants/tenant-data';
import { formatGhs } from '@/lib/format';
import { useTenant } from '@/store/tenant';

import { styles } from './styles';

/** A single label / value line inside the property card. */
type DetailRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLabelWrap}>
        <View style={styles.detailIcon}>
          <Ionicons name={icon} size={16} color={Brand.textSecondary} />
        </View>
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

/**
 * Tenant — Verify Property. After a referral code is entered we show the
 * matching property so the tenant can confirm it's the right one before
 * joining.
 */
export function VerifyScreen() {
  const router = useRouter();
  const { unit } = useTenant();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)}>
          <BackButton />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(60).duration(500)}>
          <View style={styles.successBadge}>
            <Ionicons name="checkmark-circle" size={44} color={Brand.success} />
          </View>
          <Text style={styles.title}>Property Found</Text>
          <Text style={styles.subtitle}>Please confirm this is your property</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(140).duration(500)} style={styles.card}>
          <Image source={PROPERTY_PHOTO} style={styles.photo} contentFit="cover" transition={250} />

          <View style={styles.cardBody}>
            <Text style={styles.propertyName}>{unit?.property ?? 'Your property'}</Text>
            <Text style={styles.propertyAddress}>Confirm the details below</Text>

            <View style={styles.divider} />

            <DetailRow icon="bed-outline" label="Room / Unit" value={unit?.unitNumber ?? '—'} />
            <DetailRow
              icon="cash-outline"
              label="Monthly Rent"
              value={unit ? formatGhs(unit.rentAmount) : '—'}
            />
            <DetailRow
              icon="shield-checkmark-outline"
              label="Status"
              value={unit?.status === 'OCCUPIED' ? 'Joined' : (unit?.status ?? '—')}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).duration(500)} style={styles.footer}>
          <PrimaryButton
            label="Confirm & Continue"
            onPress={() => router.replace('/tenant/authorize-payment')}
          />
          <PrimaryButton
            label="This isn't my property"
            variant="ghost"
            onPress={() => router.back()}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default VerifyScreen;