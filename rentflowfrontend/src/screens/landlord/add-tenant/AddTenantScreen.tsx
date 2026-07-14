import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/ui/back-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { Brand } from '@/constants/brand';
import { usePortfolio } from '@/store/portfolio';

import { styles } from './styles';

/**
 * Landlord — Add New Tenant. Pushed from the Tenants tab "+" button. Captures
 * the new tenant's details and which property/unit they're joining, then hands
 * off to the referral-code screen so the landlord can share an invite.
 */
export function AddTenantScreen() {
  const router = useRouter();
  const { properties, addTenant } = usePortfolio();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyId, setPropertyId] = useState<string | null>(properties[0]?.id ?? null);
  const [unit, setUnit] = useState('');
  const [rent, setRent] = useState('');

  const property = properties.find((p) => p.id === propertyId);
  const canContinue = name.trim().length > 0 && !!property && unit.trim().length > 0;

  const generateCode = () => {
    if (!canContinue || !property) return;
    addTenant({ name, property: property.name, unit, rent });
    router.push({
      pathname: '/landlord/tenant-code',
      params: { name: name.trim(), property: property.name, unit: unit.trim() },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Add Tenant</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)}>
          <View style={styles.heroIcon}>
            <Ionicons name="person-add" size={24} color={Brand.primary} />
          </View>
          <Text style={styles.title}>New Tenant</Text>
          <Text style={styles.subtitle}>
            Enter their details, then generate a referral code for them to join.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <TextField
            label="Tenant Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Adwoa Mensah"
            containerStyle={styles.field}
          />
          <TextField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+233 24 000 0000"
            keyboardType="phone-pad"
            containerStyle={styles.field}
          />

          <Text style={styles.label}>Property</Text>
          <View style={styles.chips}>
            {properties.map((p) => {
              const on = p.id === propertyId;
              return (
                <Pressable
                  key={p.id}
                  onPress={() => setPropertyId(p.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  style={[styles.chip, on && styles.chipOn]}>
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>
                    {p.emoji} {p.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.row}>
            <TextField
              label="Unit"
              value={unit}
              onChangeText={setUnit}
              placeholder="B3"
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
            label="Generate Referral Code"
            disabled={!canContinue}
            leading={<Ionicons name="qr-code-outline" size={19} color={Brand.onPrimary} />}
            onPress={generateCode}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AddTenantScreen;
