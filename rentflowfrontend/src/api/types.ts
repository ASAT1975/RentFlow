/** Shapes returned by the RentFlow Spring Boot backend. */

export type Role = "LANDLORD" | "TENANT";
export type UnitStatus = "VACANT" | "OCCUPIED";
export type MaintenanceStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";
export type PaymentStatus = "PENDING" | "PARTIAL" | "PAID" | "OVERDUE";
export type ReviewType = "TENANT_REVIEW" | "LANDLORD_REVIEW";

/** `POST /api/auth/login` and `/register` response. */
export type AuthResponse = {
  token: string;
  role: Role;
  name: string;
};

/**
 * `POST /api/auth/google` response. Either an authenticated session (existing
 * user, or new user once a role is supplied) or a `needsRole` prompt for a
 * brand-new Google user.
 */
export type GoogleAuthResponse =
  | {
      token: string;
      role: Role;
      name: string;
      email: string;
      needsRole?: false;
    }
  | { needsRole: true; email: string; name: string; token?: undefined };

/** `Property` entity, as serialized by `GET /api/properties/my`. */
export type Property = {
  id: number;
  name: string;
  address: string;
  rentAmount: number;
  inviteCode: string | null;
};

/** `POST /api/properties/create` response. */
export type PropertyCreated = {
  id: number;
  name: string;
  address: string;
  rentAmount: number;
  inviteCode: string;
};

/** `POST /api/properties/join` response. */
export type PropertyJoined = {
  message: string;
  property: string;
  rentAmount: number;
};

/** A user as nested inside other entities (password is never serialized). */
export type UserRef = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

/** `RentUnit` entity, as serialized by `GET /api/units/property/{id}`. */
export type Unit = {
  id: number;
  unitNumber: string;
  description: string | null;
  rentAmount: number;
  inviteCode: string | null;
  status: UnitStatus;
  /** Present on the landlord's property-units listing when occupied. */
  tenant?: UserRef | null;
  /** Present on the landlord's property-units listing. */
  property?: Property | null;
};

/** `POST /api/units/join` and `GET /api/units/my` response. */
export type UnitSummary = {
  message?: string;
  unit?: string;
  unitNumber?: string;
  property: string;
  propertyId: number;
  rentAmount: number;
  status?: UnitStatus;
  paymentAuthorized?: boolean;
  landlordName?: string;
  landlordEmail?: string;
  landlordPhone?: string;
};

/** `MaintenanceRequest` entity. Nested `tenant`/`property` appear on list endpoints. */
export type MaintenanceRequest = {
  id: number;
  title: string;
  description: string;
  status: MaintenanceStatus;
  submittedDate: string;
  tenant?: UserRef | null;
  property?: Property | null;
};

/** `Payment` entity. Nested `tenant`/`property` appear on list endpoints. */
export type Payment = {
  id: number;
  totalAmount: number;
  amountPaid: number | null;
  balance: number;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string | null;
  tenant?: UserRef | null;
  property?: Property | null;
};

/** `Review` entity. */
export type Review = {
  id: number;
  comment: string;
  rating: number;
  type: ReviewType;
  reviewDate: string;
};
