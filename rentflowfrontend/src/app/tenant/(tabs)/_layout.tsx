import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { Brand } from '@/constants/brand';

/**
 * Tenant tab navigator — the four sections a tenant lives in once they've
 * joined a property: Home, Rent, Report and Profile. Lives in a `(tabs)`
 * route group so the URLs stay `/tenant/<name>` while sharing this tab bar.
 */
export default function TenantTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Brand.primary,
        tabBarInactiveTintColor: Brand.textMuted,
        tabBarStyle: {
          backgroundColor: Brand.surface,
          borderTopColor: Brand.border,
          borderTopWidth: 1,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Maintenance',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'construct' : 'construct-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
