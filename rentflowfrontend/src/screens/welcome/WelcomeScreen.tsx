import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/ui/primary-button";
import { Brand } from "@/constants/brand";

import { styles } from "./styles";

const BUILDING = require("../../../assets/images/welcome-building.png");

/**
 * Welcome / onboarding screen — the first thing users see after the splash.
 * Mirrors the mockup: language selector, brand heading, the building
 * illustration, and the primary "Get Started" call to action. Content animates
 * in on mount and the illustration floats gently.
 */
export function WelcomeScreen() {
  const router = useRouter();

  const handleGoogleSignIn = () => {
    // This is a placeholder for the actual Google Sign-In logic.
    // You would typically use a library like @react-native-google-signin/google-signin
    // or expo-auth-session/providers/google here.
    console.log("Attempting Google Sign-In...");
    // On success, you would navigate or update auth state.
  };

  // Gentle continuous float for the illustration.
  const float = useSharedValue(0);
  useEffect(() => {
    float.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [float]);
  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(float.value, [0, 1], [-7, 7]) }],
  }));

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          <Pressable
            style={styles.langPill}
            accessibilityRole="button"
            accessibilityLabel="Change language, currently English"
          >
            <MaterialCommunityIcons
              name="web"
              size={16}
              color={Brand.textSecondary}
            />
            <Text style={styles.langText}>English</Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={18}
              color={Brand.textSecondary}
            />
          </Pressable>
        </Animated.View>

        <View
          style={[styles.heading, { flex: 1, justifyContent: "flex-start" }]}
        >
          <Animated.Text
            entering={FadeInDown.delay(120).duration(600).springify()}
            style={styles.welcomeTo}
          >
            Welcome to
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(200).duration(600).springify()}
            style={styles.brand}
          >
            RentFlow
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(280).duration(600).springify()}
            style={styles.subtitle}
          >
            The smart way to manage your properties and tenants
          </Animated.Text>
          <Animated.View
            entering={FadeIn.delay(320).duration(800)}
            style={styles.illustration}
          >
            <Animated.View style={[styles.illoWrap, floatStyle]}>
              <Image
                source={BUILDING}
                style={styles.illoImage}
                contentFit="contain"
                accessibilityLabel="Apartment building illustration"
              />
            </Animated.View>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInUp.delay(420).duration(600).springify()}
          style={styles.footer}
        >
          <PrimaryButton
            label="Get Started"
            onPress={() =>
              router.push({ pathname: "/login", params: { mode: "signup" } })
            }
          />
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.socialButton,
              pressed && styles.socialButtonPressed,
            ]}
            onPress={handleGoogleSignIn}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            <MaterialCommunityIcons name="google" size={20} color="#4285F4" />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </Pressable>
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Text
              style={styles.loginLink}
              accessibilityRole="link"
              onPress={() =>
                router.push({ pathname: "/login", params: { mode: "login" } })
              }
            >
              Login
            </Text>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

export default WelcomeScreen;
