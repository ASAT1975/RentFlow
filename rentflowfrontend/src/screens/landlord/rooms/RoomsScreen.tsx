import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/api';
import { BackButton } from '@/components/ui/back-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { Brand } from '@/constants/brand';
import { usePortfolio } from '@/store/portfolio';

import { styles } from './styles';

const ROOM_TYPES = [
  { label: 'Studio', emoji: '🛏️' },
  { label: '1 Bedroom', emoji: '🚪' },
  { label: '2 Bedroom', emoji: '🏠' },
  { label: 'Self-contained', emoji: '🔑' },
];

type Room = { id: string; name: string; type: string; rent: string };

/**
 * Landlord — Add Rooms (setup step 2). Capture each rentable room/unit in the
 * property before inviting tenants. Rooms are created on the backend as units
 * for the property set up on the previous screen when the landlord continues.
 */
export function RoomsScreen() {
  const router = useRouter();
  const { createUnit } = usePortfolio();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState<string>('Studio');
  const [rent, setRent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canAdd = name.trim().length > 0 && rent.trim().length > 0;

  const addRoom = () => {
    if (!canAdd) return;
    setRooms((prev) => [...prev, { id: String(Date.now()), name: name.trim(), type, rent: rent.trim() }]);
    setName('');
    setRent('');
    setType('Studio');
  };

  const removeRoom = (id: string) => setRooms((prev) => prev.filter((r) => r.id !== id));

  const submit = async () => {
    if (rooms.length === 0 || submitting) return;
    setSubmitting(true);
    try {
      for (const room of rooms) {
        await createUnit({ name: room.name, type: room.type, rent: room.rent });
      }
      router.push('/landlord/existing-tenants');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Could not save the rooms. Please try again.';
      Alert.alert('Something went wrong', message);
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
            <View key={i} style={[styles.step, i <= 1 && styles.stepActive, i === 1 && styles.stepCurrent]} />
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
          <Text style={styles.title}>Add Rooms</Text>
          <Text style={styles.subtitle}>Add the rooms or units available in this property.</Text>
        </Animated.View>

        {/* Add form */}
        <Animated.View entering={FadeInDown.delay(80).duration(500)} style={styles.formCard}>
          <TextField
            label="Room / Unit Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Unit B3"
            containerStyle={styles.field}
          />
          <Text style={styles.label}>Type</Text>
          <View style={styles.chips}>
            {ROOM_TYPES.map((t) => {
              const on = type === t.label;
              return (
                <Pressable key={t.label} onPress={() => setType(t.label)} style={[styles.chip, on && styles.chipOn]}>
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>
                    {t.emoji} {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <TextField
            label="Monthly Rent (GH₵)"
            value={rent}
            onChangeText={setRent}
            placeholder="600"
            keyboardType="number-pad"
            containerStyle={styles.field}
          />
          <Pressable
            onPress={addRoom}
            disabled={!canAdd}
            accessibilityRole="button"
            style={[styles.addBtn, !canAdd && styles.addBtnDisabled]}>
            <Ionicons name="add" size={18} color={Brand.primary} />
            <Text style={styles.addBtnText}>Add Room</Text>
          </Pressable>
        </Animated.View>

        {/* Added rooms */}
        <Text style={styles.listHeading}>
          {rooms.length} {rooms.length === 1 ? 'Room' : 'Rooms'} Added
        </Text>
        {rooms.map((r) => (
          <Animated.View
            key={r.id}
            entering={FadeInDown.duration(350)}
            layout={Layout.springify()}
            style={styles.roomCard}>
            <View style={styles.roomIcon}>
              <Ionicons name="bed-outline" size={20} color={Brand.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.roomName}>{r.name}</Text>
              <Text style={styles.roomMeta}>
                {r.type} · GH₵ {r.rent}
              </Text>
            </View>
            <Pressable
              onPress={() => removeRoom(r.id)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${r.name}`}
              style={styles.removeBtn}>
              <Ionicons name="close" size={16} color={Brand.textSecondary} />
            </Pressable>
          </Animated.View>
        ))}

        <View style={styles.footer}>
          <PrimaryButton
            label={submitting ? 'Saving…' : 'Continue'}
            disabled={rooms.length === 0 || submitting}
            onPress={submit}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default RoomsScreen;
