import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ApiError, onSessionEnded, refreshAccessToken, setAccessToken } from '../api/client'
import { authApi, usersApi } from '../api/endpoints'
import type { Role, UserProfile } from '../api/types'

type AuthStatus = 'loading' | 'anonymous' | 'authenticated'

interface AuthContextValue {
  status: AuthStatus
  user: UserProfile | null
  login: (email: string, password: string) => Promise<UserProfile>
  logout: () => Promise<void>
  /** Replace the cached profile after an update endpoint returns the new one. */
  setUser: (user: UserProfile) => void
  reloadUser: () => Promise<void>
  hasRole: (...roles: Role[]) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

// Non-sensitive hint that a refresh cookie probably exists. Without it, anonymous visitors to the
// marketing site would each fire a POST /auth/refresh that is guaranteed to 401.
const SESSION_HINT_KEY = 'arabyon-session'

function readSessionHint() {
  try {
    return window.localStorage.getItem(SESSION_HINT_KEY) === '1'
  } catch {
    return false
  }
}

function writeSessionHint(on: boolean) {
  try {
    if (on) window.localStorage.setItem(SESSION_HINT_KEY, '1')
    else window.localStorage.removeItem(SESSION_HINT_KEY)
  } catch {
    // Storage blocked (private mode) — the session still works, it just won't survive a reload.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<AuthStatus>(() => (readSessionHint() ? 'loading' : 'anonymous'))
  const [user, setUserState] = useState<UserProfile | null>(null)

  const clearSession = useCallback(() => {
    setAccessToken(null)
    writeSessionHint(false)
    setUserState(null)
    setStatus('anonymous')
    queryClient.clear()
  }, [queryClient])

  useEffect(() => onSessionEnded(clearSession), [clearSession])

  // Restore the session on page load from the refresh cookie.
  useEffect(() => {
    if (!readSessionHint()) return
    let cancelled = false
    ;(async () => {
      try {
        const token = await refreshAccessToken()
        if (!token) {
          if (!cancelled) clearSession()
          return
        }
        const me = await usersApi.me()
        if (!cancelled) {
          setUserState(me)
          setStatus('authenticated')
        }
      } catch (err) {
        if (cancelled) return
        // Unreachable API (or a reload aborting this request) says nothing about the session:
        // show signed-out for now but keep the hint, so the next page load tries again.
        if (err instanceof ApiError && err.status === 0) setStatus('anonymous')
        else clearSession()
      }
    })()
    return () => {
      cancelled = true
    }
  }, [clearSession])

  const login = useCallback(async (email: string, password: string) => {
    const token = await authApi.login({ email, password })
    setAccessToken(token)
    writeSessionHint(true)
    const me = await usersApi.me()
    setUserState(me)
    setStatus('authenticated')
    return me
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      clearSession()
    }
  }, [clearSession])

  const reloadUser = useCallback(async () => {
    setUserState(await usersApi.me())
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      login,
      logout,
      setUser: setUserState,
      reloadUser,
      hasRole: (...roles) => !!user && roles.some((role) => user.roles.includes(role)),
    }),
    [status, user, login, logout, reloadUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
