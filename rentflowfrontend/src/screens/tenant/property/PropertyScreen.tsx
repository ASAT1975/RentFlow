import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/primary-button';
import { Brand } from '@/constants/brand';
import { LANDLORD, PROPERTY, PROPERTY_PHOTO } from '@/constants/tenant-data';
import { formatGhs } from '@/lib/format';
import { useTenant } from '@/store/tenant';

import { styles } from './styles';

/** Inline 5-star row for a numeric rating. */
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

type OtherProperty = { name: string; location: string; rating: number; reviews: number };

const OTHER_PROPERTIES: OtherProperty[] = [
  { name: 'Palm Grove Residences', location: 'Cantonments, Accra', rating: 4.8, reviews: 32 },
  { name: 'Lakeside Court', location: 'Tema, Community 18', rating: 4.3, reviews: 18 },
  { name: 'Hilltop Villas', location: 'Aburi, Eastern', rating: 4.5, reviews: 11 },
];

type Review = { initials: string; name: string; rating: number; text: string };

const REVIEWS: Review[] = [
  { initials: 'AB', name: 'Ama B.', rating: 5, text: 'Very responsive landlord — fixes issues quickly and keeps the place secure.' },
  { initials: 'KO', name: 'Kojo O.', rating: 4, text: 'Well-maintained property and fair with the rent. Highly recommend.' },
];

/**
 * Tenant — Property Details. Opened from the Property quick action on Home.
 * Shows the rented unit's details, how tenants rate the landlord, and the
 * landlord's other properties.
 */
export function PropertyScreen() {
  const router = useRouter();
  const { unit } = useTenant();

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
          <Image source={PROPERTY_PHOTO} style={styles.photo} contentFit="cover" transition={250} />
          <View style={styles.cardBody}>
            <Text style={styles.propertyName}>{unit?.property ?? PROPERTY.name}</Text>
            <Text style={styles.propertyAddress}>{PROPERTY.address}</Text>
            <Text style={styles.description}>{PROPERTY.description}</Text>

            <View style={styles.divider} />

            <Row icon="bed-outline" label="Your Room" value={unit?.unitNumber ?? PROPERTY.room} />
            <Row
              icon="cash-outline"
              label="Monthly Rent"
              value={unit ? formatGhs(unit.rentAmount) : PROPERTY.monthlyRent}
            />
            <Row icon="person-outline" label="Landlord" value={LANDLORD.name} last />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(450)} style={styles.lease}>
          <PrimaryButton
            label="View Lease Agreement"
            variant="outline"
            leading={<Ionicons name="document-text-outline" size={20} color={Brand.primary} />}
          />
        </Animated.View>

        {/* Landlord rating */}
        <Animated.View entering={FadeInDown.delay(140).duration(450)}>
          <Text style={styles.sectionTitle}>Your Landlord</Text>
          <View style={styles.landlordCard}>
            <View style={styles.landlordAvatar}>
              <Text style={styles.landlordInitials}>JD</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.landlordName}>{LANDLORD.name}</Text>
              <Text style={styles.landlordRole}>Property Manager</Text>
            </View>
            <View style={styles.ratingBox}>
              <Text style={styles.ratingScore}>4.6</Text>
              <Stars value={4.6} size={13} />
              <Text style={styles.ratingCount}>61 reviews</Text>
            </View>
          </View>
        </Animated.View>

        {/* Tenant reviews */}
        <Animated.View entering={FadeInDown.delay(200).duration(450)}>
          <Text style={styles.sectionTitle}>What Tenants Say</Text>
          {REVIEWS.map((rv) => (
            <View key={rv.name} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewInitials}>{rv.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewName}>{rv.name}</Text>
                  <Stars value={rv.rating} size={12} />
                </View>
              </View>
              <Text style={styles.reviewText}>“{rv.text}”</Text>
            </View>
          ))}
        </Animated.View>

        {/* Other properties */}
        <Animated.View entering={FadeInDown.delay(260).duration(450)}>
          <Text style={styles.sectionTitle}>More from {LANDLORD.name}</Text>
          {OTHER_PROPERTIES.map((p) => (
            <Pressable
              key={p.name}
              accessibilityRole="button"
              style={({ pressed }) => [styles.otherCard, pressed && styles.otherCardPressed]}>
              <View style={styles.otherThumb}>
                <Ionicons name="business" size={22} color={Brand.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.otherName}>{p.name}</Text>
                <Text style={styles.otherLocation}>{p.location}</Text>
              </View>
              <View style={styles.otherRating}>
                <Ionicons name="star" size={14} color={Brand.warning} />
                <Text style={styles.otherScore}>{p.rating.toFixed(1)}</Text>
                <Text style={styles.otherReviews}>({p.reviews})</Text>
              </View>
            </Pressable>
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
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

export default PropertyScreen;
