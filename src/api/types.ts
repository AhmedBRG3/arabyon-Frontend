// Mirrors the ArabyOn.Api DTOs. Enums are serialized as strings, property names as camelCase.
// Money is always integer minor units (e.g. piasters for EGP), never floats.

export type Role = 'Student' | 'TA' | 'Admin'
export type UserStatus = 'PendingVerification' | 'Active' | 'Suspended' | 'Banned'
export type ProgramStatus = 'Draft' | 'Published' | 'Archived'
export type SubscriptionStatus = 'Pending' | 'Active' | 'PastDue' | 'Canceled' | 'Expired'
export type TrialRequestStatus = 'New' | 'Contacted' | 'Scheduled' | 'Converted' | 'Closed'

export interface PagedResult<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
}

export interface PageQuery {
  page?: number
  pageSize?: number
}

/** RFC 7807 body returned by ExceptionHandlingMiddleware and by [ApiController] model validation. */
export interface ProblemDetails {
  status?: number
  title?: string
  errors?: Record<string, string[]>
}

// Auth

export interface AccessTokenResponse {
  accessToken: string
  expiresAtUtc: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// Users

export interface StudentProfileDto {
  phoneNumber: string | null
  gradeLevel: string | null
}

export interface TAProfileDto {
  bio: string | null
  subjects: string[]
}

export interface UserProfile {
  id: string
  email: string
  fullName: string
  status: UserStatus
  emailVerified: boolean
  roles: Role[]
  studentProfile: StudentProfileDto | null
  taProfile: TAProfileDto | null
  createdAtUtc: string
}

export interface UpdateStudentProfileRequest {
  phoneNumber: string | null
  gradeLevel: string | null
}

export interface UpdateTAProfileRequest {
  bio: string | null
  subjects: string[]
}

// Admin

export interface AdminUserSummary {
  id: string
  email: string
  fullName: string
  status: UserStatus
  emailVerified: boolean
  roles: Role[]
  createdAtUtc: string
}

export interface UserListQuery extends PageQuery {
  search?: string
  role?: Role
  status?: UserStatus
}

// Programs

export interface ProgramSummary {
  id: string
  title: string
  description: string | null
  status: ProgramStatus
  lessonCount: number
  createdAtUtc: string
  /** Set for courses a tutor authored themselves. */
  ownerName: string | null
}

export interface Lesson {
  id: string
  title: string
  order: number
}

export interface ProgramDetail {
  id: string
  title: string
  description: string | null
  status: ProgramStatus
  lessons: Lesson[]
}

export interface ProgramListQuery extends PageQuery {
  search?: string
  /** Honored for admins only; everyone else sees published programs. */
  status?: ProgramStatus
}

export interface SaveProgramRequest {
  title: string
  description: string | null
}

// Offerings

export interface Offering {
  id: string
  programId: string
  programTitle: string
  taId: string
  taName: string
  taBio: string | null
  monthlyPriceMinorUnits: number
  currency: string
  capacity: number
  seatsTaken: number
  isActive: boolean
}

export interface OfferingListQuery extends PageQuery {
  programId?: string
  taId?: string
}

export interface CreateOfferingRequest {
  programId: string
  monthlyPriceMinorUnits: number
  currency: string
  capacity: number
}

export interface UpdateOfferingRequest {
  monthlyPriceMinorUnits: number
  capacity: number
  isActive: boolean
}

// Sessions

export type SessionStatus = 'Scheduled' | 'Live' | 'Completed' | 'Canceled'

export interface Session {
  id: string
  taOfferingId: string
  programId: string
  programTitle: string
  taId: string
  taName: string
  title: string
  startsAtUtc: string
  endsAtUtc: string
  status: SessionStatus
  /** Null until the class gets its Zoom meeting; a series books each class shortly before it. */
  joinUrl: string | null
  seriesId: string | null
  seriesSequence: number | null
  seriesTotal: number | null
}

export interface SessionListQuery extends PageQuery {
  taOfferingId?: string
  /** Admin view of the sessions booked on one Zoom license. */
  zoomLicenseId?: string
}

export interface CreateSessionRequest {
  taOfferingId: string
  title: string
  startsAtUtc: string
  endsAtUtc: string
}

export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'

/** Classes on `daysOfWeek` at `startTime`, local to `timeZone` (IANA), counting from `startDate`. */
export interface CreateSessionSeriesRequest {
  taOfferingId: string
  title: string
  /** "YYYY-MM-DD" */
  startDate: string
  /** "HH:mm:ss" */
  startTime: string
  timeZone: string
  daysOfWeek: DayOfWeek[]
  durationMinutes: number
  totalCount: number
}

// Tutor courses: a program the tutor owns plus their priced offering of it. `id` is the program id.

export interface TaCourse {
  id: string
  offeringId: string
  title: string
  description: string | null
  status: ProgramStatus
  lessons: Lesson[]
  monthlyPriceMinorUnits: number
  currency: string
  capacity: number
  isActive: boolean
  studentCount: number
  createdAtUtc: string
}

export interface CreateTaCourseRequest {
  title: string
  description: string | null
  monthlyPriceMinorUnits: number
  currency: string
  capacity: number
  /** With at least one lesson the course is published straight away; otherwise it starts as a draft. */
  lessons: string[]
}

export interface UpdateTaCourseRequest {
  title: string
  description: string | null
  monthlyPriceMinorUnits: number
  capacity: number
  isActive: boolean
}

// Subscriptions (free until a payment gateway exists; a student subscribes from the course card)

export interface Subscription {
  id: string
  taOfferingId: string
  programId: string
  programTitle: string
  taId: string
  taName: string
  monthlyPriceMinorUnits: number
  currency: string
  status: SubscriptionStatus
  currentPeriodStartUtc: string | null
  currentPeriodEndUtc: string | null
  canceledAtUtc: string | null
  createdAtUtc: string
}

export interface AdminSubscriptionRow {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  taOfferingId: string
  programTitle: string
  taName: string
  monthlyPriceMinorUnits: number
  currency: string
  status: SubscriptionStatus
  hasPayments: boolean
  createdAtUtc: string
}

export interface AdminSubscriptionListQuery extends PageQuery {
  status?: SubscriptionStatus
  taOfferingId?: string
}

export interface RosterEntry {
  subscriptionId: string
  taOfferingId: string
  programTitle: string
  studentId: string
  studentName: string
  studentEmail: string
  status: SubscriptionStatus
  subscribedAtUtc: string
}

/** Projected, not paid: price x active students, since no payments are collected yet. */
export interface EarningsRow {
  taOfferingId: string
  programTitle: string
  monthlyPriceMinorUnits: number
  currency: string
  isActive: boolean
  activeStudents: number
  projectedMonthlyMinorUnits: number
  sessionsHeld: number
  sessionsUpcoming: number
}

export interface EarningsResponse {
  paymentsEnabled: boolean
  offerings: EarningsRow[]
}

// Trial requests

export interface CreateTrialRequest {
  name: string
  email: string
  whatsApp: string | null
  country: string | null
  program: string | null
  preferredTime: string | null
}

export interface TrialRequest {
  id: string
  fullName: string
  email: string
  whatsApp: string | null
  country: string | null
  program: string | null
  preferredTime: string | null
  status: TrialRequestStatus
  adminNotes: string | null
  createdAtUtc: string
  updatedAtUtc: string | null
}

export interface TrialListQuery extends PageQuery {
  status?: TrialRequestStatus
}

// Zoom licenses

export interface ZoomLicense {
  id: string
  zoomUserId: string
  email: string
  isActive: boolean
  assignedTaId: string | null
  createdAtUtc: string
  upcomingSessionCount: number
}

export interface ZoomUser {
  id: string
  email: string
  /** Zoom user type: 1 Basic, 2 Licensed. */
  type: number
}
