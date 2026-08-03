import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackButton } from "@/components/ui/back-button";
import { PrimaryButton } from "@/components/ui/primary-button";
import { TextField } from "@/components/ui/text-field";
import { Brand } from "@/constants/brand";
import { usePortfolio } from "@/store/portfolio";

import { styles } from "./styles";

export function AddTenantScreen() {
  const router = useRouter();
  const { properties, unitsByProperty } = usePortfolio();
  const [name, setName] = useState("");
  const [propertyId, setPropertyId] = useState<string | null>(
    properties[0]?.id ?? null,
  );

  const property = properties.find((p) => p.id === propertyId);
  const vacantUnits = property?.backendId
    ? (unitsByProperty[property.backendId] ?? []).filter((u) => u.status === "VACANT")
    : [];
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const selectedUnit = vacantUnits.find((u) => u.id === selectedUnitId) ?? null;

  const canContinue = name.trim().length > 0 && !!property && !!selectedUnit;

  const generateCode = () => {
    if (!canContinue || !property || !selectedUnit) return;
    router.push({
      pathname: "/landlord/tenant-code",
      params: {
        name: name.trim(),
        property: property.name,
        unit: selectedUnit.unitNumber,
        inviteCode: selectedUnit.inviteCode ?? "",
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Add Tenant</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
            returnKeyType="done"
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
                  style={[styles.chip, on && styles.chipOn]}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>
                    {p.emoji} {p.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Vacant Unit</Text>
          {vacantUnits.length === 0 ? (
            <Text style={[styles.chipText, { marginBottom: 12 }]}>
              No vacant units for this property.
            </Text>
          ) : (
            <View style={styles.chips}>
              {vacantUnits.map((u) => {
                const on = u.id === selectedUnitId;
                return (
                  <Pressable
                    key={u.id}
                    onPress={() => setSelectedUnitId(u.id)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                    style={[styles.chip, on && styles.chipOn]}
                  >
                    <Text style={[styles.chipText, on && styles.chipTextOn]}>
                      {u.unitNumber}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(160).duration(500)}
          style={styles.footer}
        >
          <PrimaryButton
            label="Generate Referral Code"
            disabled={!canContinue}
            leading={
              <Ionicons
                name="qr-code-outline"
                size={19}
                color={Brand.onPrimary}
              />
            }
            onPress={generateCode}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AddTenantScreen;
