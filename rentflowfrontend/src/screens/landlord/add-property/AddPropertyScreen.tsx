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
 * Landlord — Add New Property. Pushed from the Properties tab "+" button. Adds
 * another property to the portfolio, then returns to the list. Mirrors the
 * onboarding setup form but as a standalone screen.
 */
export function AddPropertyScreen() {
  const router = useRouter();
  const { createProperty } = usePortfolio();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<string | null>(null);
  const [units, setUnits] = useState('');
  const [rent, setRent] = useState('');
  const [saving, setSaving] = useState(false);

  const canSave =
    name.trim().length > 0 &&
    location.trim().length > 0 &&
    !!type &&
    units.trim().length > 0 &&
    rent.trim().length > 0;

  const save = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await createProperty({ name, location, type, units, rent });
      router.back();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Could not add the property. Please try again.';
      Alert.alert('Add property failed', message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Add Property</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)}>
          <View style={styles.heroIcon}>
            <Ionicons name="business" size={26} color={Brand.primary} />
          </View>
          <Text style={styles.title}>New Property</Text>
          <Text style={styles.subtitle}>
            Add the property details. You can invite tenants to it afterwards.
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
            label={saving ? 'Adding…' : 'Add Property'}
            disabled={!canSave || saving}
            leading={<Ionicons name="add" size={20} color={Brand.onPrimary} />}
            onPress={save}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AddPropertyScreen;
