import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/primary-button';
import { Brand } from '@/constants/brand';
import { LANDLORD, PROPERTY, PROPERTY_PHOTO } from '@/constants/tenant-data';
import { formatGhs, initialsOf } from '@/lib/format';
import { useAuth } from '@/store/auth';
import { useTenant } from '@/store/tenant';

import { styles } from './styles';

type DetailRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
};

function DetailRow({ icon, label, value, last }: DetailRowProps) {
  return (
    <View style={[styles.detailRow, last && styles.detailRowLast]}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={16} color={Brand.textSecondary} />
      </View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

type StarsProps = { value: number; onChange?: (n: number) => void; size?: number };

/** Five-star rating row. Read-only when `onChange` is omitted. */
function Stars({ value, onChange, size = 20 }: StarsProps) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const star = (
          <Ionicons
            name={filled ? 'star' : 'star-outline'}
            size={size}
            color={filled ? Brand.warning : Brand.textMuted}
          />
        );
        if (!onChange) return <View key={n}>{star}</View>;
        return (
          <Pressable
            key={n}
            onPress={() => onChange(n)}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${n} star${n > 1 ? 's' : ''}`}>
            {star}
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * Tenant — Profile. Personal details, the apartment being rented, a Help button
 * that surfaces the landlord's contact details, and a Rate & Review flow.
 */
export function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { unit } = useTenant();
  const [rateVisible, setRateVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);

  const name = user?.name ?? 'Tenant';
  const userEmail = user?.email ?? '—';

  const logOut = () => {
    signOut();
    router.replace('/');
  };

  const submitReview = () => {
    if (rating === 0) return;
    setHasReviewed(true);
    setRateVisible(false);
  };

  const call = () => Linking.openURL(`tel:${LANDLORD.phone.replace(/\s/g, '')}`).catch(() => {});
  const email = () => Linking.openURL(`mailto:${LANDLORD.email}`).catch(() => {});

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Pressable
        onPress={() => router.push('/tenant/settings')}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Settings"
        style={styles.settingsBtn}>
        <Ionicons name="settings-outline" size={20} color={Brand.textPrimary} />
      </Pressable>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <Animated.View entering={FadeInDown.duration(450)} style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initialsOf(name)}</Text>
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={13} color={Brand.onPrimary} />
            </View>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{userEmail}</Text>
        </Animated.View>

        {/* Personal information */}
        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.card}>
            <DetailRow icon="person-outline" label="Full Name" value={name} />
            <DetailRow icon="mail-outline" label="Email Address" value={userEmail} last />
          </View>
        </Animated.View>

        {/* Apartment details */}
        {unit ? (
          <Animated.View entering={FadeInDown.delay(160).duration(500)}>
            <Text style={styles.sectionTitle}>My Apartment</Text>
            <View style={styles.card}>
              <View style={styles.apartmentHeader}>
                <Image source={PROPERTY_PHOTO} style={styles.apartmentThumb} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.apartmentName}>{unit.property}</Text>
                  <Text style={styles.apartmentAddress}>Unit {unit.unitNumber}</Text>
                </View>
              </View>
              <View style={styles.cardDivider} />
              <DetailRow icon="bed-outline" label="Room / Unit" value={unit.unitNumber} />
              <DetailRow icon="cash-outline" label="Monthly Rent" value={formatGhs(unit.rentAmount)} last />
            </View>
          </Animated.View>
        ) : null}

        {/* Help — contact landlord */}
        <Animated.View entering={FadeInDown.delay(220).duration(500)}>
          <Text style={styles.sectionTitle}>Support</Text>
          <Pressable
            onPress={() => setContactVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Help — contact your landlord"
            style={({ pressed }) => [styles.helpCta, pressed && styles.ctaPressed]}>
            <View style={[styles.ctaIcon, { backgroundColor: Brand.primarySoft }]}>
              <Ionicons name="help-buoy-outline" size={22} color={Brand.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ctaTitle}>Help &amp; Support</Text>
              <Text style={styles.ctaSubtitle}>Need help? Contact your landlord</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Brand.textMuted} />
          </Pressable>
        </Animated.View>

        {/* Rate & review */}
        <Animated.View entering={FadeInDown.delay(280).duration(500)}>
          <Text style={styles.sectionTitle}>Rate Your Apartment</Text>
          {hasReviewed ? (
            <View style={styles.card}>
              <View style={styles.reviewedRow}>
                <Stars value={rating} size={22} />
                <Pressable
                  onPress={() => setRateVisible(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Edit your review">
                  <Text style={styles.editLink}>Edit</Text>
                </Pressable>
              </View>
              {review.trim().length > 0 ? (
                <Text style={styles.reviewText}>“{review.trim()}”</Text>
              ) : null}
            </View>
          ) : (
            <Pressable
              onPress={() => setRateVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Rate and review your apartment"
              style={({ pressed }) => [styles.helpCta, pressed && styles.ctaPressed]}>
              <View style={[styles.ctaIcon, { backgroundColor: Brand.warningSoft }]}>
                <Ionicons name="star" size={22} color={Brand.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.ctaTitle}>Rate &amp; Review</Text>
                <Text style={styles.ctaSubtitle}>Share your experience at this property</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Brand.textMuted} />
            </Pressable>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(340).duration(500)} style={styles.signOut}>
          <PrimaryButton
            label="Log Out"
            variant="outline"
            leading={<Ionicons name="log-out-outline" size={20} color={Brand.danger} />}
            onPress={logOut}
          />
        </Animated.View>
      </ScrollView>

      {/* Contact landlord modal */}
      <Modal
        visible={contactVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setContactVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setContactVisible(false)}>
          <Animated.View entering={FadeInUp.duration(260)}>
            <Pressable style={styles.sheet} onPress={() => {}}>
              <View style={styles.sheetHandle} />
              <Pressable
                onPress={() => setContactVisible(false)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Close"
                style={styles.sheetClose}>
                <Ionicons name="close" size={22} color={Brand.textSecondary} />
              </Pressable>

              <Text style={styles.sheetTitle}>Contact Landlord</Text>

              <View style={styles.landlordRow}>
                <View style={styles.landlordAvatar}>
                  <Text style={styles.landlordInitials}>JD</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.landlordName}>{LANDLORD.name}</Text>
                  <Text style={styles.landlordRole}>Property Manager · {PROPERTY.name}</Text>
                </View>
              </View>

              <Pressable style={styles.contactRow} onPress={call} accessibilityRole="button">
                <View style={[styles.contactIcon, { backgroundColor: Brand.successSoft }]}>
                  <Ionicons name="call" size={18} color={Brand.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactLabel}>Phone</Text>
                  <Text style={styles.contactValue}>{LANDLORD.phone}</Text>
                </View>
                <View style={[styles.contactAction, { backgroundColor: Brand.successSoft }]}>
                  <Text style={[styles.contactActionText, { color: Brand.success }]}>Call</Text>
                </View>
              </Pressable>

              <Pressable style={styles.contactRow} onPress={email} accessibilityRole="button">
                <View style={[styles.contactIcon, { backgroundColor: Brand.primarySoft }]}>
                  <Ionicons name="mail" size={18} color={Brand.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>{LANDLORD.email}</Text>
                </View>
                <View style={[styles.contactAction, { backgroundColor: Brand.primarySoft }]}>
                  <Text style={[styles.contactActionText, { color: Brand.primary }]}>Email</Text>
                </View>
              </Pressable>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Rate & review modal */}
      <Modal
        visible={rateVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRateVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setRateVisible(false)}>
          <Animated.View entering={FadeInUp.duration(260)}>
            <Pressable style={styles.sheet} onPress={() => {}}>
              <View style={styles.sheetHandle} />
              <Pressable
                onPress={() => setRateVisible(false)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Close"
                style={styles.sheetClose}>
                <Ionicons name="close" size={22} color={Brand.textSecondary} />
              </Pressable>

              <Text style={styles.sheetTitle}>Rate your apartment</Text>
              <Text style={styles.sheetSubtitle}>How’s your experience at {PROPERTY.name}?</Text>

              <View style={styles.sheetStars}>
                <Stars value={rating} onChange={setRating} size={38} />
              </View>

              <TextInput
                style={styles.reviewInput}
                value={review}
                onChangeText={setReview}
                placeholder="Share more about your experience (optional)…"
                placeholderTextColor={Brand.textMuted}
                multiline
                textAlignVertical="top"
              />

              <PrimaryButton label="Submit Review" disabled={rating === 0} onPress={submitReview} />
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

export default ProfileScreen;
