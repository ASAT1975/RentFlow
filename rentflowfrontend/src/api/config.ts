import Constants from "expo-constants";
/**
 * Resolves the RentFlow backend base URL.
 *
 * Priority:
 *  1. `EXPO_PUBLIC_API_URL` — set this in a `.env` file for staging/production
 *     (e.g. `EXPO_PUBLIC_API_URL=https://api.rentflow.app`).
 *  2. In development, derive the dev machine's LAN IP from the Metro server URI
 *     (`Constants.expoConfig.hostUri`, e.g. `192.168.1.5:8081`) and point at the
 *     Spring Boot server on port 8080. This works on a physical device and the
 *     iOS simulator without any config, since the phone reaches the same LAN IP.
 *  3. Fall back to `localhost` (works for the iOS simulator / web on the host).
 *
 * The Spring Boot server binds `0.0.0.0:8080`, so LAN devices can reach it.
 */
function resolveBaseUrl(): string {
  const override = process.env.EXPO_PUBLIC_API_URL;
  if (override?.startsWith("http")) {
    return override.replace(/\/+$/, "");
  }

  if (__DEV__) {
    // In development, derive from hostUri to connect on the local network.
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const lanIp = hostUri.split(":")[0];
      // Assumes the backend is running on port 8080.
      return `http://${lanIp}:8080`;
    }
    // Fallback for web or simulators on the same machine.
    return "http://localhost:8080";
  }
  return "https://rentflow-7qo8.onrender.com"; // Production fallback
}

/** Root server URL, e.g. `http://192.168.1.5:8080`. */
export const API_BASE_URL = resolveBaseUrl();

/** API root, e.g. `http://192.168.1.5:8080/api`. */
export const API_URL = `${API_BASE_URL}/api`;
