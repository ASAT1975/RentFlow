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
import { usePortfolio } from '@/store/portfolio';

import { styles } from './styles';

const PROPERTY_TYPES = [
  { label: 'Apartments', emoji: '🏢' },
  { label: 'House', emoji: '🏠' },
  { label: 'Compound', emoji: '🏘️' },
  { label: 'Hostel', emoji: '🛏️' },
];

/**
 * Landlord — Property Setup. First screen of the landlord journey (from Choose
 * Role → "I am a Landlord"). Captures the first property so tenants can later
 * join it with a referral code.
 */
export function SetupScreen() {
  const router = useRouter();
  const { createProperty } = usePortfolio();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<string | null>(null);
  const [units, setUnits] = useState('');
  const [rent, setRent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canContinue =
    name.trim().length > 0 &&
    location.trim().length > 0 &&
    !!type &&
    units.trim().length > 0 &&
    rent.trim().length > 0;

  const submit = async () => {
    if (!canContinue || submitting) return;
    setSubmitting(true);
    try {
      await createProperty({ name, location, type, units, rent });
      router.push('/landlord/rooms');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Could not create the property. Please try again.';
      Alert.alert('Setup failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.headerRow}>
        <BackButton />
        <View style={styles.steps}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.step, i === 0 && styles.stepActive]} />
          ))}
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)}>
          <View style={styles.heroIcon}>
            <Ionicons name="business" size={28} color={Brand.primary} />
          </View>
          <Text style={styles.title}>Set Up Your Property</Text>
          <Text style={styles.subtitle}>
            Add your first property so tenants can join it with a referral code.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <TextField
            label="Property Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Green Villa Apartments"
            containerStyle={styles.field}
          />

          <Text style={styles.label}>Property Type</Text>
          <View style={styles.chips}>
            {PROPERTY_TYPES.map((t) => {
              const on = type === t.label;
              return (
                <Pressable
                  key={t.label}
                  onPress={() => setType(t.label)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  style={[styles.chip, on && styles.chipOn]}>
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>
                    {t.emoji} {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TextField
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. East Legon, Accra"
            containerStyle={styles.field}
          />

          <View style={styles.row}>
            <TextField
              label="Number of Units"
              value={units}
              onChangeText={setUnits}
              placeholder="12"
              keyboardType="number-pad"
              containerStyle={styles.rowField}
            />
            <TextField
              label="Monthly Rent (GH₵)"
              value={rent}
              onChangeText={setRent}
              placeholder="600"
              keyboardType="number-pad"
              containerStyle={styles.rowField}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(500)} style={styles.footer}>
          <PrimaryButton
            label={submitting ? 'Creating…' : 'Continue'}
            disabled={!canContinue || submitting}
            onPress={submit}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SetupScreen;
