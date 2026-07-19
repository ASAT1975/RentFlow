import { api } from "./client";
import {
  type AuthResponse,
  type GoogleAuthResponse,
  type MaintenanceRequest,
  type MaintenanceStatus,
  type Payment,
  type Property,
  type PropertyCreated,
  type Role,
  type Unit,
  type UnitSummary,
} from "./types";

export { ApiError, getAuthToken, setAuthToken } from "./client";
export { API_BASE_URL, API_URL } from "./config";
export type * from "./types";

export const authApi = {
  register: (name: string, email: string, password: string, role: Role) =>
    api.post<AuthResponse>("/api/auth/register", {
      name,
      email,
      password,
      role,
    }),
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/api/auth/login", { email, password }),
  google: (accessToken: string, role?: Role) =>
    api.post<GoogleAuthResponse>("/api/auth/google", { accessToken, role }),
  /** Register an Expo push token with the backend for the signed-in user. */
  registerPushToken: (token: string) => {
    return api.post("/api/auth/push-token", { token });
  },
};

export const propertiesApi = {
  my: () => api.get<Property[]>("/api/properties/my"),
  create: (name: string, address: string, rentAmount: number) =>
    api.post<PropertyCreated>("/api/properties/create", {
      name,
      address,
      rentAmount,
    }),
};

export const unitsApi = {
  forProperty: (propertyId: number) =>
    api.get<Unit[]>(`/api/units/property/${propertyId}`),
  create: (
    propertyId: number,
    unitNumber: string,
    description: string,
    rentAmount: number,
  ) =>
    api.post<Unit>("/api/units/create", {
      propertyId,
      unitNumber,
      description,
      rentAmount,
    }),
  join: (inviteCode: string) =>
    api.post<UnitSummary>("/api/units/join", { inviteCode }),
  mine: () => api.get<UnitSummary>("/api/units/my"),
  authorizePayment: (rentDueDay: number) =>
    api.post<{ authorizationUrl: string }>("/api/units/authorize-payment", {
      rentDueDay,
    }),
};

export const maintenanceApi = {
  mine: () => api.get<MaintenanceRequest[]>("/api/maintenance/my"),
  forProperty: (propertyId: number) =>
    api.get<MaintenanceRequest[]>(`/api/maintenance/property/${propertyId}`),
  submit: (propertyId: number, title: string, description: string) =>
    api.post("/api/maintenance/submit", { propertyId, title, description }),
  updateStatus: (id: number, status: MaintenanceStatus) =>
    api.post(`/api/maintenance/${id}/status`, { status }),
};

export const paymentsApi = {
  mine: () => api.get<Payment[]>("/api/payments/my"),
  forProperty: (propertyId: number) =>
    api.get<Payment[]>(`/api/payments/property/${propertyId}`),
  create: (
    tenantEmail: string,
    propertyId: number,
    totalAmount: number,
    dueDate: string,
  ) =>
    api.post("/api/payments/create", {
      tenantEmail,
      propertyId,
      totalAmount,
      dueDate,
    }),
  pay: (paymentId: number, amount: number) =>
    api.post(`/api/payments/${paymentId}/pay`, { amount }),
};

export const reviewsApi = {
  // ... (to be implemented)
};
