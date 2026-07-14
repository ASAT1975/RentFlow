import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/api';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { TextField } from '@/components/ui/text-field';
import { Brand } from '@/constants/brand';
import { STATUS_META } from '@/constants/maintenance-data';
import { STATUS_LABEL, useMaintenance } from '@/store/maintenance';

import { styles } from './styles';

type Mode = 'requests' | 'new';

const CATEGORIES = [
  { label: 'Plumbing', emoji: '🚰' },
  { label: 'Electrical', emoji: '⚡' },
  { label: 'Heating / AC', emoji: '❄️' },
  { label: 'Appliance', emoji: '📺' },
  { label: 'Structural', emoji: '🏗️' },
  { label: 'Other', emoji: '🔧' },
];

const PRIORITIES = [
  { key: 'Low', emoji: '🟢', color: Brand.success },
  { key: 'Medium', emoji: '🟡', color: Brand.warning },
  { key: 'High', emoji: '🔴', color: Brand.danger },
];

const MAX_PHOTOS = 4;

/**
 * Tenant — Maintenance. Two modes via a segmented control: "My Requests" lists
 * the tenant's reports with live status, and "New Request" is the report form
 * (category, description, priority, optional photos) sent to the landlord.
 */
export function ReportScreen() {
  const router = useRouter();
  const { requests, submit: submitRequest } = useMaintenance();
  const [mode, setMode] = useState<Mode>('requests');
  const [category, setCategory] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = !!category && title.trim().length > 0 && description.trim().length > 0;

  const stats = [
    { emoji: '🟣', label: 'Open', color: Brand.primary, value: requests.filter((r) => r.status === 'PENDING').length },
    { emoji: '🟡', label: 'In Progress', color: Brand.warning, value: requests.filter((r) => r.status === 'IN_PROGRESS').length },
    { emoji: '🟢', label: 'Completed', color: Brand.success, value: requests.filter((r) => r.status === 'RESOLVED').length },
  ];

  const submit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      // Preserve the category/priority (backend stores only title + description).
      const body = `${description.trim()}\n\nCategory: ${category} · Priority: ${priority}`;
      await submitRequest(title, body);
      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Could not send your request. Please try again.';
      Alert.alert('Submit failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  const addPhotos = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: MAX_PHOTOS - photos.length,
        quality: 0.7,
      });
      if (!result.canceled) {
        setPhotos((prev) => [...prev, ...result.assets.map((a) => a.uri)].slice(0, MAX_PHOTOS));
      }
    } catch {
      // Picker unavailable / cancelled.
    }
  };

  const removePhoto = (uri: string) => setPhotos((prev) => prev.filter((p) => p !== uri));

  const resetForm = () => {
    setCategory(null);
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setPhotos([]);
    setSubmitted(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.headerWrap}>
        <Text style={styles.heading}>Maintenance 🛠️</Text>
        <Text style={styles.subheading}>Report and track issues in your home</Text>
        <SegmentedControl<Mode>
          options={[
            { key: 'requests', label: 'My Requests' },
            { key: 'new', label: 'New Request' },
          ]}
          value={mode}
          onChange={(m) => {
            setMode(m);
            if (m === 'requests') setSubmitted(false);
          }}
          style={styles.segment}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {mode === 'requests' ? (
          <Animated.View entering={FadeIn.duration(300)}>
            <View style={styles.statsRow}>
              {stats.map((s) => (
                <View key={s.label} style={styles.statCard}>
                  <Text style={styles.statEmoji}>{s.emoji}</Text>
                  <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            {requests.map((r, i) => {
              const label = STATUS_LABEL[r.status];
              const st = STATUS_META[label];
              return (
                <Animated.View key={r.id} entering={FadeInDown.delay(i * 70).duration(450)}>
                  <Pressable
                    onPress={() =>
                      router.push({ pathname: '/tenant/request/[id]', params: { id: String(r.id) } })
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`${r.title}, ${label}`}
                    style={({ pressed }) => [styles.requestCard, pressed && styles.requestCardPressed]}>
                    <View style={styles.requestEmojiWrap}>
                      <Text style={styles.requestEmoji}>🔧</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.requestTitle}>{r.title}</Text>
                      <Text style={styles.requestMeta}>{r.submittedDate}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: st.tint }]}>
                      <Text style={[styles.statusText, { color: st.color }]}>{label}</Text>
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}

            {requests.length === 0 ? (
              <Text style={styles.subheading}>No requests yet. Report an issue below.</Text>
            ) : null}

            <Pressable
              onPress={() => setMode('new')}
              accessibilityRole="button"
              style={({ pressed }) => [styles.newCta, pressed && styles.newCtaPressed]}>
              <Ionicons name="add-circle" size={20} color={Brand.primary} />
              <Text style={styles.newCtaText}>Report a New Issue</Text>
            </Pressable>
          </Animated.View>
        ) : submitted ? (
          <Animated.View entering={FadeIn.duration(350)} style={styles.successWrap}>
            <View style={styles.successBadge}>
              <Ionicons name="checkmark-circle" size={56} color={Brand.success} />
            </View>
            <Text style={styles.successTitle}>Request Sent 🎉</Text>
            <Text style={styles.successBody}>
              Your landlord has been notified and will review your report shortly.
            </Text>
            <View style={styles.successButton}>
              <PrimaryButton
                label="View My Requests"
                variant="secondary"
                onPress={() => {
                  resetForm();
                  setMode('requests');
                }}
              />
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text style={styles.label}>📂 Category</Text>
            <View style={styles.chips}>
              {CATEGORIES.map((c) => {
                const on = category === c.label;
                return (
                  <Pressable
                    key={c.label}
                    onPress={() => setCategory(c.label)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                    style={[styles.chip, on && styles.chipSelected]}>
                    <Text style={[styles.chipText, on && styles.chipTextSelected]}>
                      {c.emoji} {c.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <TextField
              label="📝 Title"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Leaking kitchen tap"
              containerStyle={styles.field}
            />

            <Text style={styles.label}>💬 Description</Text>
            <View style={styles.textareaWrap}>
              <TextInput
                style={styles.textarea}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the issue in as much detail as you can…"
                placeholderTextColor={Brand.textMuted}
                multiline
                textAlignVertical="top"
              />
            </View>

            <Text style={styles.label}>🚦 Priority</Text>
            <View style={styles.priorities}>
              {PRIORITIES.map((p) => {
                const on = priority === p.key;
                return (
                  <Pressable
                    key={p.key}
                    onPress={() => setPriority(p.key)}
                    style={[styles.priority, on && { borderColor: p.color, backgroundColor: p.color + '14' }]}>
                    <Text style={styles.priorityEmoji}>{p.emoji}</Text>
                    <Text style={[styles.priorityText, on && { color: p.color }]}>{p.key}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>📸 Photos (optional)</Text>
            <View style={styles.photoRow}>
              {photos.map((uri) => (
                <View key={uri} style={styles.photoThumb}>
                  <Image source={{ uri }} style={styles.photoImg} contentFit="cover" />
                  <Pressable
                    onPress={() => removePhoto(uri)}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel="Remove photo"
                    style={styles.photoRemove}>
                    <Ionicons name="close" size={13} color="#FFFFFF" />
                  </Pressable>
                </View>
              ))}
              {photos.length < MAX_PHOTOS ? (
                <Pressable
                  onPress={addPhotos}
                  accessibilityRole="button"
                  accessibilityLabel="Add photo"
                  style={styles.addPhoto}>
                  <Ionicons name="camera-outline" size={24} color={Brand.primary} />
                  <Text style={styles.addPhotoText}>Add</Text>
                </Pressable>
              ) : null}
            </View>

            <View style={styles.noteCard}>
              <Text style={styles.noteEmoji}>📨</Text>
              <Text style={styles.noteText}>
                Your landlord receives this report instantly and can respond from their dashboard.
              </Text>
            </View>

            <View style={styles.submit}>
              <PrimaryButton
                label={submitting ? 'Sending…' : 'Submit Request'}
                disabled={!canSubmit || submitting}
                onPress={submit}
              />
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default ReportScreen;
