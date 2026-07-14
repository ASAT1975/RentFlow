import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Brand } from '@/constants/brand';

import { styles } from './styles';

type NotifType = 'payments' | 'maintenance' | 'alerts';

type Notif = {
  type: NotifType;
  title: string;
  body: string;
  time: string;
};

type Group = { label: string; items: Notif[] };

const GROUPS: Group[] = [
  {
    label: 'Today',
    items: [
      {
        type: 'payments',
        title: 'Rent Reminder 💰',
        body: 'Your rent of GH₵ 600.00 is due on 15th June, 2025.',
        time: '10:30 AM',
      },
      {
        type: 'maintenance',
        title: 'Maintenance Update 🔧',
        body: "Your request 'Leaky Faucet' has been received.",
        time: '9:15 AM',
      },
    ],
  },
  {
    label: 'Yesterday',
    items: [
      {
        type: 'payments',
        title: 'Payment Successful ✅',
        body: 'Your payment of GH₵ 600.00 was successful.',
        time: 'Yesterday',
      },
      {
        type: 'alerts',
        title: 'New Announcement 📢',
        body: 'Water supply maintenance on 20th May, 2025 from 10AM – 2PM.',
        time: 'Yesterday',
      },
    ],
  },
  {
    label: 'Earlier',
    items: [
      {
        type: 'maintenance',
        title: 'Request Completed 🎉',
        body: "'AC Not Cooling' has been marked as completed.",
        time: '28 Apr',
      },
      {
        type: 'payments',
        title: 'Payment Successful ✅',
        body: 'Your payment of GH₵ 600.00 was successful.',
        time: '15 Apr',
      },
    ],
  },
];

const META: Record<NotifType, { icon: keyof typeof Ionicons.glyphMap; tint: string; color: string }> = {
  payments: { icon: 'cash-outline', tint: Brand.primarySoft, color: Brand.primary },
  maintenance: { icon: 'construct-outline', tint: Brand.warningSoft, color: Brand.warning },
  alerts: { icon: 'megaphone-outline', tint: Brand.successSoft, color: Brand.success },
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'payments', label: 'Payments' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'alerts', label: 'Alerts' },
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];

/**
 * Tenant — Notifications. Opened from the bell on Home. Shows every alert the
 * tenant has received, grouped by recency, with quick type filters.
 */
export function NotificationsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>('all');

  const groups = useMemo(
    () =>
      GROUPS.map((g) => ({
        ...g,
        items: filter === 'all' ? g.items : g.items.filter((i) => i.type === filter),
      })).filter((g) => g.items.length > 0),
    [filter],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={Brand.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        {/* Spacer to keep the title centered now that settings is removed. */}
        <View style={styles.iconBtnSpacer} />
      </View>

      {/* Filter chips */}
      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const on = f.key === filter;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.filter, on && styles.filterOn]}>
              <Text style={[styles.filterText, on && styles.filterTextOn]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {groups.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={36} color={Brand.textMuted} />
            <Text style={styles.emptyText}>No notifications here yet</Text>
          </View>
        ) : (
          groups.map((g, gi) => (
            <Animated.View key={g.label} entering={FadeInDown.delay(gi * 60).duration(450)}>
              <Text style={styles.groupLabel}>{g.label}</Text>
              {g.items.map((item, i) => {
                const meta = META[item.type];
                return (
                  <View key={`${g.label}-${i}`} style={styles.item}>
                    <View style={[styles.itemIcon, { backgroundColor: meta.tint }]}>
                      <Ionicons name={meta.icon} size={20} color={meta.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.itemTop}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemTime}>{item.time}</Text>
                      </View>
                      <Text style={styles.itemBody}>{item.body}</Text>
                    </View>
                  </View>
                );
              })}
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default NotificationsScreen;
