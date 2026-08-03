import { Ionicons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { ApiError } from "@/api";
import { googleConfig, googleConfigured } from "@/auth/google";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TextField } from "@/components/ui/text-field";
import { Brand } from "@/constants/brand";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/store/auth";

type Mode = "login" | "signup";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s\-()]{7,15}$/;

export function LoginScreen() {
  const router = useRouter();
  const { mode: modeParam, google: googleParam } = useLocalSearchParams<{ mode?: string; google?: string }>();
  const { signIn, beginSignup, signInWithGoogle } = useAuth();
  const [googleRequest, googleResponse, promptGoogle] =
    Google.useAuthRequest({
      webClientId: googleConfig.webClientId,
      androidClientId: googleConfig.androidClientId,
      iosClientId: googleConfig.iosClientId,
      redirectUri: googleConfig.redirectUri,
      scopes: [...googleConfig.scopes],
    });

  const [mode, setMode] = useState<Mode>(
    modeParam === "signup" ? "signup" : "login",
  );
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitting, setSubmitting] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  const nameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const set = (key: keyof typeof form) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const isSignup = mode === "signup";

  const validate = (): boolean => {
    const next: Partial<typeof form> = {};
    if (isSignup && !form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_RE.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!form.password) {
      next.password = "Password is required.";
    } else if (isSignup && form.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }
    if (isSignup && form.phone.trim() && !PHONE_RE.test(form.phone.trim())) {
      next.phone = "Enter a valid phone number.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (submitting) return;
    if (!validate()) return;

    const email = form.email.trim();
    const password = form.password;

    if (isSignup) {
      beginSignup({ name: form.name.trim(), email, password, phone: form.phone.trim() || undefined });
      setSignedUp(true);
      setTimeout(() => router.push("/choose-role"), 2000);
      return;
    }

    setSubmitting(true);
    try {
      const role = await signIn(email, password);
      router.replace(
        role === "LANDLORD" ? "/landlord/(tabs)/dashboard" : "/tenant/(tabs)/dashboard",
      );
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      const isDuplicate =
        message.toLowerCase().includes("already exists") ||
        message.toLowerCase().includes("duplicate") ||
        message.toLowerCase().includes("already registered");
      Alert.alert(isDuplicate ? "Account already exists" : "Login failed", message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleToken = useCallback(
    async (accessToken: string) => {
      if (submitting) return;
      setSubmitting(true);
      try {
        const result = await signInWithGoogle(accessToken);
        if (result.status === "needsRole") {
          router.push("/choose-role");
        } else {
          router.replace(
            result.role === "LANDLORD"
              ? "/landlord/(tabs)/dashboard"
              : "/tenant/(tabs)/dashboard",
          );
        }
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "Google sign-in failed. Please try again.";
        Alert.alert("Google sign-in failed", message);
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, signInWithGoogle, router],
  );

  useEffect(() => {
    if (googleParam === "1" && googleRequest) void promptGoogle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleParam, googleRequest]);

  useEffect(() => {
    if (googleResponse?.type === "success") {
      const accessToken = googleResponse.authentication?.accessToken;
      if (accessToken) void handleGoogleToken(accessToken);
    } else if (googleResponse?.type === "error") {
      Alert.alert("Google sign-in failed", "The Google sign-in was cancelled or failed.");
    }
  }, [googleResponse, handleGoogleToken]);

  const onGoogle = () => {
    if (!googleConfigured || !googleRequest) {
      Alert.alert(
        'Google sign-in not available',
        'Add your Google OAuth client IDs to a .env file and run a development build (not Expo Go) to enable this.',
      );
      return;
    }
    void promptGoogle();
  };

  if (signedUp) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={72} color={Brand.success} />
          <Text style={styles.successTitle}>Account Created! 🎉</Text>
          <Text style={styles.successSubtitle}>Welcome, {form.name.trim()}! Let's set up your role.</Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(500)}>
            <Text style={styles.title}>Welcome Back 👋</Text>
            <Text style={styles.subtitle}>
              {isSignup ? "Create your account" : "Login to your account"}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.segment}>
            <SegmentedControl<Mode>
              options={[
                { key: "login", label: "Login" },
                { key: "signup", label: "Sign Up" },
              ]}
              value={mode}
              onChange={setMode}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(180).duration(500)}>
            <Animated.View key={mode} entering={FadeIn.duration(220)}>
              {isSignup ? (
                <>
                  <TextField
                    ref={nameRef}
                    label="Name"
                    value={form.name}
                    onChangeText={set("name")}
                    placeholder="John Doe"
                    autoCapitalize="words"
                    autoComplete="name"
                    containerStyle={styles.field}
                    returnKeyType="next"
                    onSubmitEditing={() => phoneRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                  {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

                  <TextField
                    ref={phoneRef}
                    label="Phone (optional)"
                    value={form.phone}
                    onChangeText={set("phone")}
                    placeholder="+233 XX XXX XXXX"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    containerStyle={styles.field}
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                  {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}
                </>
              ) : null}

              <TextField
                ref={emailRef}
                label="Email"
                value={form.email}
                onChangeText={set("email")}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                containerStyle={styles.field}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
              />
              {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

              <TextField
                ref={passwordRef}
                label="Password"
                value={form.password}
                onChangeText={set("password")}
                placeholder="••••••••"
                secureTextEntry
                autoCapitalize="none"
                containerStyle={styles.field}
                returnKeyType="done"
                onSubmitEditing={submit}
              />
              {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

              {!isSignup ? (
                <Text style={styles.forgot} accessibilityRole="link" onPress={() => router.push("/forgot-password")}>
                  Forgot Password?
                </Text>
              ) : null}
            </Animated.View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(260).duration(500)} style={styles.submitButton}>
            <PrimaryButton
              label={submitting ? "Please wait…" : isSignup ? "Sign Up" : "Login"}
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
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: Brand.background },
  container: { flexGrow: 1, padding: Spacing.four, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: Brand.textPrimary, textAlign: "center" },
  subtitle: { fontSize: 16, color: Brand.textSecondary, textAlign: "center", marginTop: Spacing.one },
  segment: { marginTop: Spacing.six, marginHorizontal: Spacing.two },
  field: { marginTop: Spacing.four },
  error: { marginTop: 4, fontSize: 12, color: Brand.danger, marginLeft: 2 },
  forgot: { marginTop: Spacing.three, color: Brand.primary, fontWeight: "500", textAlign: "right" },
  submitButton: { marginTop: 24 },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: Spacing.five, gap: Spacing.two },
  dividerLine: { flex: 1, height: 1, backgroundColor: Brand.border },
  dividerText: { color: Brand.textSecondary, fontWeight: "500" },
  social: { gap: Spacing.three },
  successContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: Spacing.three, padding: Spacing.four },
  successTitle: { fontSize: 26, fontWeight: "bold", color: Brand.textPrimary, textAlign: "center" },
  successSubtitle: { fontSize: 16, color: Brand.textSecondary, textAlign: "center" },
});
