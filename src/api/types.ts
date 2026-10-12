// Mirrors the ArabyOn.Api DTOs. Enums are serialized as strings, property names as camelCase.
// Money is always integer minor units (e.g. piasters for EGP), never floats.

export type Role = 'Student' | 'TA' | 'Admin'
export type UserStatus = 'PendingVerification' | 'Active' | 'Suspended' | 'Banned'
export type ProgramStatus = 'Draft' | 'Published' | 'Archived'

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
  joinUrl: string | null
}

export interface SessionListQuery extends PageQuery {
  taOfferingId?: string
}

export interface CreateSessionRequest {
  taOfferingId: string
  title: string
  startsAtUtc: string
  endsAtUtc: string
}
