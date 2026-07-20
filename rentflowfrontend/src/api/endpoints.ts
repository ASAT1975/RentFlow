import { api } from "./client";
import type {
  AuthResponse,
  GoogleAuthResponse,
  MaintenanceRequest,
  MaintenanceStatus,
  Payment,
  Property,
  PropertyCreated,
  PropertyJoined,
  Review,
  ReviewType,
  Role,
  Unit,
  UnitSummary,
} from "./types";

export const authApi = {
  register: (name: string, email: string, password: string, role: Role, phone?: string) =>
    api.post<AuthResponse>("/auth/register", { name, email, password, role, phone }),
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }),
  /** Exchange a Google access token for a RentFlow session; `role` completes a new user. */
  google: (accessToken: string, role?: Role) =>
    api.post<GoogleAuthResponse>(
      "/auth/google",
      role ? { accessToken, role } : { accessToken },
    ),
  registerPushToken: (token: string) =>
    api.post<{ message: string }>("/auth/push-token", { token }),
};

export const propertiesApi = {
  create: (name: string, address: string, rentAmount: number) =>
    api.post<PropertyCreated>("/properties/create", {
      name,
      address,
      rentAmount,
    }),
  mine: () => api.get<Property[]>("/properties/my"),
  join: (inviteCode: string) =>
    api.post<PropertyJoined>("/properties/join", { inviteCode }),
};

export const unitsApi = {
  create: (
    propertyId: number,
    unitNumber: string,
    description: string,
    rentAmount: number,
  ) =>
    api.post<Unit>("/units/create", {
      propertyId,
      unitNumber,
      description,
      rentAmount,
    }),
  join: (inviteCode: string) =>
    api.post<UnitSummary>("/units/join", { inviteCode }),
  forProperty: (propertyId: number) =>
    api.get<Unit[]>(`/units/property/${propertyId}`),
  vacantForProperty: (propertyId: number) =>
    api.get<Unit[]>(`/units/property/${propertyId}/vacant`),
  mine: () => api.get<UnitSummary>("/units/my"),
  authorizePayment: (rentDueDay: number) =>
    api.post<{ authorizationUrl: string }>("/units/authorize-payment", {
      rentDueDay,
    }),
  deauthorizePayment: () =>
    api.post<{ message: string }>("/units/deauthorize-payment"),
};

export const maintenanceApi = {
  create: (propertyId: number, title: string, description: string) =>
    api.post<MaintenanceRequest>("/maintenance/create", {
      propertyId,
      title,
      description,
    }),
  updateStatus: (requestId: number, status: MaintenanceStatus) =>
    api.put<MaintenanceRequest>(`/maintenance/update/${requestId}`, { status }),
  forProperty: (propertyId: number) =>
    api.get<MaintenanceRequest[]>(`/maintenance/property/${propertyId}`),
  forTenant: (tenantId: number) =>
    api.get<MaintenanceRequest[]>(`/maintenance/tenant/${tenantId}`),
  mine: () => api.get<MaintenanceRequest[]>("/maintenance/my"),
};

export const paymentsApi = {
  charge: (
    tenantEmail: string,
    propertyId: number,
    totalAmount: number,
    dueDate: string,
  ) =>
    api.post<Payment>("/payments/charge", {
      tenantEmail,
      propertyId,
      totalAmount,
      dueDate,
    }),
  pay: (paymentId: number, amount: number) =>
    api.post<Payment>(`/payments/${paymentId}/pay`, { amount }),
  forProperty: (propertyId: number) =>
    api.get<Payment[]>(`/payments/property/${propertyId}`),
  mine: () => api.get<Payment[]>("/payments/my"),
};

export const reviewsApi = {
  create: (
    propertyId: number,
    comment: string,
    rating: number,
    type: ReviewType,
  ) =>
    api.post<Review>("/reviews/submit", { propertyId, comment, rating, type }),
  forProperty: (propertyId: number) =>
    api.get<Review[]>(`/reviews/property/${propertyId}`),
  forPropertyByType: (propertyId: number, type: ReviewType) =>
    api.get<Review[]>(`/reviews/property/${propertyId}/type/${type}`),
  mine: () => api.get<Review[]>("/reviews/my"),
};
