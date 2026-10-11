import { api } from './client'
import type {
  AccessTokenResponse,
  AdminUserSummary,
  ChangePasswordRequest,
  CreateOfferingRequest,
  Lesson,
  LoginRequest,
  Offering,
  OfferingListQuery,
  PagedResult,
  ProgramDetail,
  ProgramListQuery,
  ProgramStatus,
  ProgramSummary,
  RegisterRequest,
  ResetPasswordRequest,
  Role,
  SaveProgramRequest,
  UpdateOfferingRequest,
  UpdateStudentProfileRequest,
  UpdateTAProfileRequest,
  UserListQuery,
  UserProfile,
  UserStatus,
} from './types'

export const authApi = {
  register: (body: RegisterRequest) => api<void>('/auth/register', { method: 'POST', body }),
  verifyEmail: (token: string) => api<void>('/auth/verify-email', { method: 'POST', body: { token } }),
  login: (body: LoginRequest) => api<AccessTokenResponse>('/auth/login', { method: 'POST', body }),
  logout: () => api<void>('/auth/logout', { method: 'POST' }),
  forgotPassword: (email: string) => api<void>('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (body: ResetPasswordRequest) => api<void>('/auth/reset-password', { method: 'POST', body }),
  changePassword: (body: ChangePasswordRequest) =>
    api<AccessTokenResponse>('/auth/change-password', { method: 'POST', body }),
}

export const usersApi = {
  me: () => api<UserProfile>('/users/me'),
  updateMe: (fullName: string) => api<UserProfile>('/users/me', { method: 'PUT', body: { fullName } }),
  updateStudentProfile: (body: UpdateStudentProfileRequest) =>
    api<UserProfile>('/users/me/student-profile', { method: 'PUT', body }),
  updateTAProfile: (body: UpdateTAProfileRequest) => api<UserProfile>('/users/me/ta-profile', { method: 'PUT', body }),
}

export const programsApi = {
  list: (query: ProgramListQuery = {}) => api<PagedResult<ProgramSummary>>('/programs', { query: { ...query } }),
  get: (id: string) => api<ProgramDetail>(`/programs/${id}`),
  create: (body: SaveProgramRequest) => api<ProgramDetail>('/programs', { method: 'POST', body }),
  update: (id: string, body: SaveProgramRequest) => api<ProgramDetail>(`/programs/${id}`, { method: 'PUT', body }),
  changeStatus: (id: string, status: ProgramStatus) =>
    api<ProgramDetail>(`/programs/${id}/status`, { method: 'PUT', body: { status } }),
  addLesson: (id: string, title: string) => api<Lesson>(`/programs/${id}/lessons`, { method: 'POST', body: { title } }),
  updateLesson: (id: string, lessonId: string, title: string) =>
    api<Lesson>(`/programs/${id}/lessons/${lessonId}`, { method: 'PUT', body: { title } }),
  deleteLesson: (id: string, lessonId: string) => api<void>(`/programs/${id}/lessons/${lessonId}`, { method: 'DELETE' }),
  reorderLessons: (id: string, lessonIds: string[]) =>
    api<Lesson[]>(`/programs/${id}/lessons/order`, { method: 'PUT', body: { lessonIds } }),
}

export const offeringsApi = {
  list: (query: OfferingListQuery = {}) => api<PagedResult<Offering>>('/offerings', { query: { ...query } }),
  get: (id: string) => api<Offering>(`/offerings/${id}`),
  mine: () => api<Offering[]>('/offerings/mine'),
  create: (body: CreateOfferingRequest) => api<Offering>('/offerings', { method: 'POST', body }),
  update: (id: string, body: UpdateOfferingRequest) => api<Offering>(`/offerings/${id}`, { method: 'PUT', body }),
}

export const adminUsersApi = {
  list: (query: UserListQuery = {}) => api<PagedResult<AdminUserSummary>>('/admin/users', { query: { ...query } }),
  get: (id: string) => api<UserProfile>(`/admin/users/${id}`),
  assignRole: (id: string, role: Role) => api<UserProfile>(`/admin/users/${id}/roles`, { method: 'POST', body: { role } }),
  removeRole: (id: string, role: Role) => api<UserProfile>(`/admin/users/${id}/roles/${role}`, { method: 'DELETE' }),
  changeStatus: (id: string, status: UserStatus) =>
    api<UserProfile>(`/admin/users/${id}/status`, { method: 'PUT', body: { status } }),
}
