import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { authApi, setAuthToken, type Role } from "@/api";

export type GoogleSignInResult =
  | { status: "ok"; role: Role }
  | { status: "needsRole" };

export type AuthUser = {
  name: string;
  email: string;
  role: Role;
};

/** Sign-up details captured before the role is chosen (see ChooseRole flow). */
export type PendingSignup = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  /** Log in an existing user; returns their role so the caller can route. */
  signIn: (email: string, password: string) => Promise<Role>;
  /** Stash sign-up details until the user picks a role on the next screen. */
  beginSignup: (details: PendingSignup) => void;
  /** Finish registration with the chosen role; returns the role. */
  completeSignup: (role: Role) => Promise<Role>;
  /**
   * Exchange a Google access token for a session. Existing users are logged in;
   * a brand-new Google user returns `needsRole` and the token is stashed until
   * `completeSignup(role)` is called.
   */
  signInWithGoogle: (accessToken: string) => Promise<GoogleSignInResult>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Holds the authenticated session (JWT + user) for the whole app. The token is
 * mirrored into the API client so every request is authenticated. Kept in memory
 * only for now — persisting across reloads (expo-secure-store) is a follow-up.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [pendingSignup, setPendingSignup] = useState<PendingSignup | null>(
    null,
  );
  const [pendingGoogleToken, setPendingGoogleToken] = useState<string | null>(
    null,
  );

  const registerForPushNotifications = useCallback(async () => {
    // Push notifications require a development build — not supported in Expo Go.
  }, []);

  const applySession = useCallback(
    (nextToken: string, nextUser: AuthUser) => {
      setToken(nextToken);
      setUser(nextUser);
      setAuthToken(nextToken);

      // Once the user is authenticated, register for push notifications.
      // This won't re-prompt if permission is already granted.
      void registerForPushNotifications();
    },
    [registerForPushNotifications],
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<Role> => {
      const res = await authApi.login(email, password);
      applySession(res.token, { name: res.name, email, role: res.role });
      return res.role;
    },
    [applySession],
  );

  const beginSignup = useCallback((details: PendingSignup) => {
    setPendingSignup(details);
  }, []);

  const completeSignup = useCallback(
    async (role: Role): Promise<Role> => {
      // A pending Google sign-in takes priority over email/password.
      if (pendingGoogleToken) {
        const res = await authApi.google(pendingGoogleToken, role);
        if (!res.token)
          throw new Error("Google sign-in failed. Please try again.");
        applySession(res.token, {
          name: res.name,
          email: res.email,
          role: res.role,
        });
        setPendingGoogleToken(null);
        return res.role;
      }
      if (!pendingSignup) {
        throw new Error("Missing sign-up details. Please start again.");
      }
      const res = await authApi.register(
        pendingSignup.name,
        pendingSignup.email,
        pendingSignup.password,
        role,
        pendingSignup.phone,
      );
      applySession(res.token, {
        name: res.name,
        email: pendingSignup.email,
        role: res.role,
      });
      setPendingSignup(null);
      return res.role;
    },
    [applySession, pendingSignup, pendingGoogleToken],
  );

  const signInWithGoogle = useCallback(
    async (accessToken: string): Promise<GoogleSignInResult> => {
      const res = await authApi.google(accessToken);
      if (res.token) {
        applySession(res.token, {
          name: res.name,
          email: res.email,
          role: res.role,
        });
        return { status: "ok", role: res.role };
      }
      // New Google user: stash the token until a role is chosen.
      setPendingGoogleToken(accessToken);
      return { status: "needsRole" };
    },
    [applySession],
  );

  const signOut = useCallback(() => {
    setToken(null);
    setUser(null);
    setPendingSignup(null);
    setPendingGoogleToken(null);
    setAuthToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: token != null,
      signIn,
      beginSignup,
      completeSignup,
      signInWithGoogle,
      signOut,
    }),
    [
      user,
      token,
      signIn,
      beginSignup,
      completeSignup,
      signInWithGoogle,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
