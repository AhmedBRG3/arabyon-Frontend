import type { UserProfile } from '../api/types'

/** Where to land after login when no `next` was requested. */
export function homeFor(user: UserProfile) {
  if (user.roles.includes('Admin')) return '/admin/users'
  if (user.roles.includes('TA')) return '/ta/offerings'
  return '/account'
}

/** Only allows internal paths, so `?next=` can't be used as an open redirect. */
export function safeNext(next: string | null) {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : null
}
