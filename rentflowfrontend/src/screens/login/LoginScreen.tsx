import { Ionicons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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

export function LoginScreen() {
  const router = useRouter();
  const { mode: modeParam } = useLocalSearchParams<{ mode?: string }>();
  const { signIn, beginSignup, signInWithGoogle } = useAuth();
  const [googleRequest, googleResponse, promptGoogle] =
    Google.useAuthRequest(googleConfig);

  const [mode, setMode] = useState<Mode>(
    modeParam === "signup" ? "signup" : "login",
  );
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isSignup = mode === "signup";

  const submit = async () => {
    if (submitting) return;
    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      Alert.alert("Missing details", "Please enter your email and password.");
      return;
    }
    if (isSignup && !form.name.trim()) {
      Alert.alert("Missing details", "Please enter your name.");
      return;
    }

    if (isSignup) {
      beginSignup({ name: form.name.trim(), email, password, phone: form.phone.trim() || undefined });
      router.push("/choose-role");
      return;
    }

    setSubmitting(true);
    try {
      const role = await signIn(email, password);
      router.replace(
        role === "LANDLORD" ? "/landlord/dashboard" : "/tenant/dashboard",
      );
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.";
      Alert.alert("Login failed", message);
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
              ? "/landlord/dashboard"
              : "/tenant/dashboard",
          );
        }
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Google sign-in failed. Please try again.";
        Alert.alert("Google sign-in failed", message);
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, signInWithGoogle, router],
  );

  useEffect(() => {
    if (googleResponse?.type === "success") {
      const accessToken = googleResponse.authentication?.accessToken;
      if (accessToken) void handleGoogleToken(accessToken);
    } else if (googleResponse?.type === "error") {
      Alert.alert(
        "Google sign-in failed",
        "The Google sign-in was cancelled or failed.",
      );
    }
  }, [googleResponse, handleGoogleToken]);

  const onGoogle = () => {
    if (!googleConfigured || !googleRequest) {
      Alert.alert(
        "Google sign-in not set up",
        "Add your Google OAuth client IDs (EXPO_PUBLIC_GOOGLE_*) to a .env file to enable this.",
      );
      return;
    }
    void promptGoogle();
  };

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

          <Animated.View
            entering={FadeInDown.delay(100).duration(500)}
            style={styles.segment}
          >
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
                    label="Name"
                    value={form.name}
                    onChangeText={set("name")}
                    placeholder="John Doe"
                    autoCapitalize="words"
                    autoComplete="name"
                    containerStyle={styles.field}
                  />
                  <TextField
                    label="Phone (optional)"
                    value={form.phone}
                    onChangeText={set("phone")}
                    placeholder="+233 XX XXX XXXX"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    containerStyle={styles.field}
                  />
                </>
              ) : null}

              <TextField
                label="Email"
                value={form.email}
                onChangeText={set("email")}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                containerStyle={styles.field}
              />

              <TextField
                label="Password"
                value={form.password}
                onChangeText={set("password")}
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

          <Animated.View
            entering={FadeInDown.delay(260).duration(500)}
            style={styles.submitButton}
          >
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
                leading={
                  <Ionicons name="logo-google" size={20} color="#EA4335" />
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

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  container: {
    flexGrow: 1,
    padding: Spacing.four,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Brand.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Brand.textSecondary,
    textAlign: "center",
    marginTop: Spacing.one,
  },
  segment: {
    marginTop: Spacing.six,
    marginHorizontal: Spacing.two,
  },
  field: {
    marginTop: Spacing.four,
  },
  forgot: {
    marginTop: Spacing.three,
    color: Brand.primary,
    fontWeight: "500",
    textAlign: "right",
  },
  submitButton: {
    marginTop: 24,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.five,
    gap: Spacing.two,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Brand.border,
  },
  dividerText: {
    color: Brand.textSecondary,
    fontWeight: "500",
  },
  social: {
    gap: Spacing.three,
  },
});
