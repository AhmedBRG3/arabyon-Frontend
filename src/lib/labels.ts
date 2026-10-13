import type { ProgramStatus, Role, SessionStatus, SubscriptionStatus, TrialRequestStatus, UserStatus } from '../api/types'

export const ROLES: Role[] = ['Student', 'TA', 'Admin']
export const USER_STATUSES: UserStatus[] = ['PendingVerification', 'Active', 'Suspended', 'Banned']
export const PROGRAM_STATUSES: ProgramStatus[] = ['Draft', 'Published', 'Archived']
export const SUBSCRIPTION_STATUSES: SubscriptionStatus[] = ['Active', 'PastDue', 'Pending', 'Canceled', 'Expired']
export const TRIAL_STATUSES: TrialRequestStatus[] = ['New', 'Contacted', 'Scheduled', 'Converted', 'Closed']

// Currencies the business expects to price in; the API accepts any ISO 4217 code.
export const CURRENCIES = ['EGP', 'USD', 'AED', 'CAD']

export const userStatusTone = (status: UserStatus) =>
  status === 'Active' ? 'teal' : status === 'PendingVerification' ? 'gold' : 'red'

export const programStatusTone = (status: ProgramStatus) =>
  status === 'Published' ? 'teal' : status === 'Draft' ? 'gold' : 'gray'

export const subscriptionStatusTone = (status: SubscriptionStatus) =>
  status === 'Active' ? 'teal' : status === 'PastDue' || status === 'Pending' ? 'gold' : 'gray'

export const trialStatusTone = (status: TrialRequestStatus) =>
  status === 'New' ? 'gold' : status === 'Converted' ? 'teal' : status === 'Closed' ? 'gray' : 'teal'

export const sessionStatusTone = (status: SessionStatus) =>
  status === 'Scheduled' ? 'teal' : status === 'Live' ? 'gold' : status === 'Canceled' ? 'red' : 'gray'

// Lengths offered when a tutor schedules a session, in minutes.
export const SESSION_DURATIONS = [30, 45, 60, 90]
