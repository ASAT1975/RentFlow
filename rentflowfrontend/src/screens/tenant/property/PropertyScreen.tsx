import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { reviewsApi, type Review } from '@/api';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Brand } from '@/constants/brand';
import { formatGhs, initialsOf } from '@/lib/format';
import { useTenant } from '@/store/tenant';

import { styles } from './styles';

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const rounded = Math.round(value);
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name={n <= rounded ? 'star' : 'star-outline'}
          size={size}
          color={Brand.warning}
        />
      ))}
    </View>
  );
}

type RowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
};

function Row({ icon, label, value, last }: RowProps) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={16} color={Brand.textSecondary} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export function PropertyScreen() {
  const router = useRouter();
  const { unit } = useTenant();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!unit?.propertyId) return;
    reviewsApi.forPropertyByType(unit.propertyId, 'TENANT_REVIEW')
      .then(setReviews)
      .catch(() => {});
  }, [unit?.propertyId]);

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

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
        <Text style={styles.headerTitle}>Property Details</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Property card */}
        <Animated.View entering={FadeInDown.duration(450)} style={styles.card}>
          <View style={[styles.photo, { alignItems: 'center', justifyContent: 'center', backgroundColor: Brand.primarySoft }]}>
            <Ionicons name="business" size={56} color={Brand.primary} />
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.propertyName}>{unit?.property ?? '—'}</Text>
            <View style={styles.divider} />
            <Row icon="bed-outline" label="Your Unit" value={unit?.unitNumber ?? '—'} />
            <Row icon="cash-outline" label="Monthly Rent" value={unit ? formatGhs(unit.rentAmount) : '—'} last />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(450)} style={styles.lease}>
          <PrimaryButton
            label="View Lease Agreement"
            variant="outline"
            leading={<Ionicons name="document-text-outline" size={20} color={Brand.primary} />}
          />
        </Animated.View>

        {/* Landlord */}
        <Animated.View entering={FadeInDown.delay(140).duration(450)}>
          <Text style={styles.sectionTitle}>Your Landlord</Text>
          <View style={styles.landlordCard}>
            <View style={styles.landlordAvatar}>
              <Text style={styles.landlordInitials}>{initialsOf(unit?.landlordName ?? 'LL')}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.landlordName}>{unit?.landlordName ?? 'Your Landlord'}</Text>
              <Text style={styles.landlordRole}>Property Manager</Text>
            </View>
            {avgRating != null && (
              <View style={styles.ratingBox}>
                <Text style={styles.ratingScore}>{avgRating.toFixed(1)}</Text>
                <Stars value={avgRating} size={13} />
                <Text style={styles.ratingCount}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Tenant reviews */}
        {reviews.length > 0 && (
          <Animated.View entering={FadeInDown.delay(200).duration(450)}>
            <Text style={styles.sectionTitle}>What Tenants Say</Text>
            {reviews.map((rv) => (
              <View key={rv.id} style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewInitials}>★</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Stars value={rv.rating} size={12} />
                  </View>
                </View>
                <Text style={styles.reviewText}>"{rv.comment}"</Text>
              </View>
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default PropertyScreen;
