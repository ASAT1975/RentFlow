import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { authApi } from "@/api/endpoints";
import { PrimaryButton } from "@/components/ui/primary-button";
import { TextField } from "@/components/ui/text-field";
import { Brand } from "@/constants/brand";
import { Spacing } from "@/constants/theme";

type Step = "email" | "code";

export function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const codeRef = useRef<TextInput>(null);
  const newPasswordRef = useRef<TextInput>(null);

  const sendCode = async () => {
    if (!email.trim()) return Alert.alert("Enter your email");
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setStep("code");
    } catch {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!code.trim() || !newPassword) return Alert.alert("Fill in all fields");
    setLoading(true);
    try {
      await authApi.resetPassword(email.trim(), code.trim(), newPassword);
      Alert.alert("Success", "Password reset! You can now log in.", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
    } catch {
      Alert.alert("Error", "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Animated.View entering={FadeInDown.duration(500)}>
            <Text style={styles.title}>{step === "email" ? "Forgot Password" : "Reset Password"}</Text>
            <Text style={styles.subtitle}>
              {step === "email"
                ? "Enter your email and we'll send you a reset code."
                : `Enter the 6-digit code sent to ${email} and your new password.`}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.fields}>
            {step === "email" ? (
              <TextField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="done"
                onSubmitEditing={sendCode}
              />
            ) : (
              <>
                <TextField
                  ref={codeRef}
                  label="Reset Code"
                  value={code}
                  onChangeText={setCode}
                  placeholder="123456"
                  keyboardType="number-pad"
                  returnKeyType="next"
                  onSubmitEditing={() => newPasswordRef.current?.focus()}
                  blurOnSubmit={false}
                />
                <TextField
                  ref={newPasswordRef}
                  label="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  autoCapitalize="none"
                  containerStyle={{ marginTop: 16 }}
                  returnKeyType="done"
                  onSubmitEditing={resetPassword}
                />
              </>
            )}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.button}>
            <PrimaryButton
              label={loading ? "Please wait…" : step === "email" ? "Send Code" : "Reset Password"}
              onPress={step === "email" ? sendCode : resetPassword}
              disabled={loading}
            />
          </Animated.View>

          <Text style={styles.back} onPress={() => router.back()}>
            Back to Login
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Brand.background },
  container: { flexGrow: 1, padding: Spacing.four, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: Brand.textPrimary },
  subtitle: { fontSize: 15, color: Brand.textSecondary, marginTop: 6, marginBottom: 8 },
  fields: { marginTop: Spacing.four },
  button: { marginTop: Spacing.six },
  back: { marginTop: Spacing.four, textAlign: "center", color: Brand.primary, fontWeight: "500" },
});
