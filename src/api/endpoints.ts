import { api } from './client'
import type {
  AccessTokenResponse,
  AdminSubscriptionListQuery,
  AdminSubscriptionRow,
  AdminUserSummary,
  ChangePasswordRequest,
  CreateOfferingRequest,
  CreateSessionRequest,
  CreateSessionSeriesRequest,
  CreateTaCourseRequest,
  CreateTrialRequest,
  EarningsResponse,
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
  RosterEntry,
  SaveProgramRequest,
  Session,
  SessionListQuery,
  Subscription,
  TaCourse,
  TrialListQuery,
  TrialRequest,
  TrialRequestStatus,
  UpdateOfferingRequest,
  UpdateStudentProfileRequest,
  UpdateTaCourseRequest,
  UpdateTAProfileRequest,
  UserListQuery,
  UserProfile,
  UserStatus,
  ZoomLicense,
  ZoomUser,
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
  delete: (id: string) => api<void>(`/programs/${id}`, { method: 'DELETE' }),
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

export const sessionsApi = {
  list: (query: SessionListQuery = {}) => api<PagedResult<Session>>('/sessions', { query: { ...query } }),
  mine: () => api<Session[]>('/sessions/mine'),
  create: (body: CreateSessionRequest) => api<Session>('/sessions', { method: 'POST', body }),
  cancel: (id: string) => api<Session>(`/sessions/${id}/cancel`, { method: 'POST' }),
  createSeries: (body: CreateSessionSeriesRequest) => api<Session[]>('/sessions/series', { method: 'POST', body }),
  cancelSeries: (seriesId: string) => api<Session[]>(`/sessions/series/${seriesId}/cancel-remaining`, { method: 'POST' }),
}

/** The signed-in tutor's own courses, students and earnings. */
export const taApi = {
  courses: () => api<TaCourse[]>('/ta/courses'),
  course: (id: string) => api<TaCourse>(`/ta/courses/${id}`),
  createCourse: (body: CreateTaCourseRequest) => api<TaCourse>('/ta/courses', { method: 'POST', body }),
  updateCourse: (id: string, body: UpdateTaCourseRequest) => api<TaCourse>(`/ta/courses/${id}`, { method: 'PUT', body }),
  changeCourseStatus: (id: string, status: ProgramStatus) =>
    api<TaCourse>(`/ta/courses/${id}/status`, { method: 'PUT', body: { status } }),
  deleteCourse: (id: string) => api<void>(`/ta/courses/${id}`, { method: 'DELETE' }),
  addLesson: (id: string, title: string) => api<Lesson>(`/ta/courses/${id}/lessons`, { method: 'POST', body: { title } }),
  updateLesson: (id: string, lessonId: string, title: string) =>
    api<Lesson>(`/ta/courses/${id}/lessons/${lessonId}`, { method: 'PUT', body: { title } }),
  deleteLesson: (id: string, lessonId: string) => api<void>(`/ta/courses/${id}/lessons/${lessonId}`, { method: 'DELETE' }),
  reorderLessons: (id: string, lessonIds: string[]) =>
    api<Lesson[]>(`/ta/courses/${id}/lessons/order`, { method: 'PUT', body: { lessonIds } }),
  students: () => api<RosterEntry[]>('/ta/students'),
  earnings: () => api<EarningsResponse>('/ta/earnings'),
}

export const subscriptionsApi = {
  mine: () => api<Subscription[]>('/subscriptions/mine'),
  subscribe: (taOfferingId: string) => api<Subscription>('/subscriptions', { method: 'POST', body: { taOfferingId } }),
  cancel: (id: string) => api<Subscription>(`/subscriptions/${id}/cancel`, { method: 'POST' }),
  resume: (id: string) => api<Subscription>(`/subscriptions/${id}/resume`, { method: 'POST' }),
}

export const trialsApi = {
  submit: (body: CreateTrialRequest) => api<void>('/trial-requests', { method: 'POST', body }),
}

export const adminApi = {
  trials: (query: TrialListQuery = {}) => api<PagedResult<TrialRequest>>('/admin/trial-requests', { query: { ...query } }),
  updateTrial: (id: string, status: TrialRequestStatus, adminNotes: string | null) =>
    api<TrialRequest>(`/admin/trial-requests/${id}`, { method: 'PUT', body: { status, adminNotes } }),
  subscriptions: (query: AdminSubscriptionListQuery = {}) =>
    api<PagedResult<AdminSubscriptionRow>>('/admin/subscriptions', { query: { ...query } }),
  zoomLicenses: () => api<ZoomLicense[]>('/admin/zoom-licenses'),
  createZoomLicense: (zoomUserId: string, email: string) =>
    api<ZoomLicense>('/admin/zoom-licenses', { method: 'POST', body: { zoomUserId, email } }),
  setZoomLicenseActive: (id: string, isActive: boolean) =>
    api<ZoomLicense>(`/admin/zoom-licenses/${id}`, { method: 'PUT', body: { isActive } }),
  zoomUsers: () => api<ZoomUser[]>('/admin/zoom/users'),
}

export const adminUsersApi = {
  list: (query: UserListQuery = {}) => api<PagedResult<AdminUserSummary>>('/admin/users', { query: { ...query } }),
  get: (id: string) => api<UserProfile>(`/admin/users/${id}`),
  assignRole: (id: string, role: Role) => api<UserProfile>(`/admin/users/${id}/roles`, { method: 'POST', body: { role } }),
  removeRole: (id: string, role: Role) => api<UserProfile>(`/admin/users/${id}/roles/${role}`, { method: 'DELETE' }),
  changeStatus: (id: string, status: UserStatus) =>
    api<UserProfile>(`/admin/users/${id}/status`, { method: 'PUT', body: { status } }),
}
