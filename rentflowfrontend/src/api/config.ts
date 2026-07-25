import Constants from "expo-constants";

const PRODUCTION_URL = "https://rentflow-7qo8.onrender.com";

function resolveBaseUrl(): string {
  if (__DEV__) {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const lanIp = hostUri.split(":")[0];
      return `http://${lanIp}:8080`;
    }
    return "http://localhost:8080";
  }
  return PRODUCTION_URL;
}

export const API_BASE_URL = resolveBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;
