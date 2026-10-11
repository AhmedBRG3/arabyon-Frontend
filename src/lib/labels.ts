import type { ProgramStatus, Role, UserStatus } from '../api/types'

export const ROLES: Role[] = ['Student', 'TA', 'Admin']
export const USER_STATUSES: UserStatus[] = ['PendingVerification', 'Active', 'Suspended', 'Banned']
export const PROGRAM_STATUSES: ProgramStatus[] = ['Draft', 'Published', 'Archived']

// Currencies the business expects to price in; the API accepts any ISO 4217 code.
export const CURRENCIES = ['EGP', 'USD', 'AED', 'CAD']

export const userStatusTone = (status: UserStatus) =>
  status === 'Active' ? 'teal' : status === 'PendingVerification' ? 'gold' : 'red'

export const programStatusTone = (status: ProgramStatus) =>
  status === 'Published' ? 'teal' : status === 'Draft' ? 'gold' : 'gray'
