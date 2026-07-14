import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/api';
import { googleConfig, googleConfigured } from '@/auth/google';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { TextField } from '@/components/ui/text-field';
import { useAuth } from '@/store/auth';

import { styles } from './styles';

// Required for the auth-session redirect to resolve when the app regains focus.
WebBrowser.maybeCompleteAuthSession();

type Mode = 'login' | 'signup';

/**
 * Login / Sign Up screen. The segmented control switches between modes, which
 * swaps the field set: Login = username, email, password; Sign Up = name,
 * username, phone, email, password. Reached from the Welcome screen with an
 * initial `mode` param.
 */
export function LoginScreen() {
  const router = useRouter();
  const { mode: modeParam } = useLocalSearchParams<{ mode?: string }>();
  const { signIn, beginSignup, signInWithGoogle } = useAuth();
  const [googleRequest, googleResponse, promptGoogle] = Google.useAuthRequest(googleConfig);

  const [mode, setMode] = useState<Mode>(modeParam === 'signup' ? 'signup' : 'login');
  const [form, setForm] = useState({
    name: '',
    username: '',
    phone: '',
    email: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isSignup = mode === 'signup';

  const submit = async () => {
    if (submitting) return;
    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      Alert.alert('Missing details', 'Please enter your email and password.');
      return;
    }
    if (isSignup && !form.name.trim()) {
      Alert.alert('Missing details', 'Please enter your name.');
      return;
    }

    if (isSignup) {
      // Defer registration until a role is chosen on the next screen.
      beginSignup({ name: form.name.trim(), email, password });
      router.push('/choose-role');
      return;
    }

    setSubmitting(true);
    try {
      const role = await signIn(email, password);
      router.replace(role === 'LANDLORD' ? '/landlord/dashboard' : '/tenant/dashboard');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
      Alert.alert('Login failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleToken = async (accessToken: string) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await signInWithGoogle(accessToken);
      if (result.status === 'needsRole') {
        router.push('/choose-role');
      } else {
        router.replace(result.role === 'LANDLORD' ? '/landlord/dashboard' : '/tenant/dashboard');
      }
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Google sign-in failed. Please try again.';
      Alert.alert('Google sign-in failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle the Google auth-session result once the browser flow returns.
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const accessToken = googleResponse.authentication?.accessToken;
      if (accessToken) void handleGoogleToken(accessToken);
    } else if (googleResponse?.type === 'error') {
      Alert.alert('Google sign-in failed', 'The Google sign-in was cancelled or failed.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleResponse]);

  const onGoogle = () => {
    if (!googleConfigured || !googleRequest) {
      Alert.alert(
        'Google sign-in not set up',
        'Add your Google OAuth client IDs (EXPO_PUBLIC_GOOGLE_*) to a .env file to enable this.',
      );
      return;
    }
    void promptGoogle();
  };

  const notImplemented = () =>
    Alert.alert('Coming soon', 'Apple sign-in isn’t available yet.');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(500)}>
            <Text style={styles.title}>Welcome Back 👋</Text>
            <Text style={styles.subtitle}>
              {isSignup ? 'Create your account' : 'Login to your account'}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.segment}>
            <SegmentedControl<Mode>
              options={[
                { key: 'login', label: 'Login' },
                { key: 'signup', label: 'Sign Up' },
              ]}
              value={mode}
              onChange={setMode}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(180).duration(500)}>
            {/* Re-keying by mode cross-fades the field set when switching. */}
            <Animated.View key={mode} entering={FadeIn.duration(220)}>
              {isSignup ? (
                <TextField
                  label="Name"
                  value={form.name}
                  onChangeText={set('name')}
                  placeholder="John Doe"
                  autoCapitalize="words"
                  autoComplete="name"
                  containerStyle={styles.field}
                />
              ) : null}

              <TextField
                label="Username"
                value={form.username}
                onChangeText={set('username')}
                placeholder="johndoe"
                autoCapitalize="none"
                autoComplete="username"
                containerStyle={styles.field}
              />

              {isSignup ? (
                <TextField
                  label="Phone Number"
                  value={form.phone}
                  onChangeText={set('phone')}
                  placeholder="+233 24 123 4567"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  containerStyle={styles.field}
                />
              ) : null}

              <TextField
                label="Email"
                value={form.email}
                onChangeText={set('email')}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                containerStyle={styles.field}
              />

              <TextField
                label="Password"
                value={form.password}
                onChangeText={set('password')}
                placeholder="••••••••"
                secureTextEntry
                autoCapitalize="none"
                containerStyle={styles.field}
              />

              {!isSignup ? (
                <Text style={styles.forgot} accessibilityRole="link">
                  Forgot Password?
                </Text>
              ) : null}
            </Animated.View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(260).duration(500)}>
            <PrimaryButton
              label={submitting ? 'Please wait…' : isSignup ? 'Sign Up' : 'Login'}
              onPress={submit}
              disabled={submitting}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(340).duration(500)}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.social}>
              <PrimaryButton
                label="Continue with Google"
                variant="outline"
                onPress={onGoogle}
                disabled={submitting}
                leading={<Ionicons name="logo-google" size={20} color="#EA4335" />}
              />
              <PrimaryButton
                label="Continue with Apple"
                variant="outline"
                onPress={notImplemented}
                leading={
                  <Ionicons name="logo-apple" size={20} color={Platform.OS === 'ios' ? '#000' : '#111'} />
                }
              />
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default LoginScreen;
