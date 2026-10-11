import type { AccessTokenResponse, ProblemDetails } from './types'

/**
 * Base URL of ArabyOn.Api. In dev this is `/api`, which Vite proxies to the API (see vite.config.ts)
 * so the refresh cookie stays same-origin. In production point it at the API's own subdomain,
 * e.g. https://api.arabyon.com — it must share the site's registrable domain because the
 * refresh cookie is SameSite=Strict.
 */
const BASE_URL = ((import.meta.env.VITE_API_URL as string | undefined) || '/api').replace(/\/$/, '')

// Refresh this long before the access token actually expires, so in-flight requests don't race it.
const EXPIRY_SKEW_MS = 30_000

export class ApiError extends Error {
  readonly status: number
  readonly title: string
  readonly fieldErrors: Record<string, string[]>

  constructor(status: number, title: string, fieldErrors: Record<string, string[]> = {}) {
    super(title)
    this.name = 'ApiError'
    this.status = status
    this.title = title
    this.fieldErrors = fieldErrors
  }
}

// The access token lives in memory only (never localStorage); the refresh token is an HttpOnly cookie.
let accessToken: string | null = null
let accessTokenExpiresAt = 0

const sessionEndedListeners = new Set<() => void>()

export function setAccessToken(token: AccessTokenResponse | null) {
  accessToken = token?.accessToken ?? null
  accessTokenExpiresAt = token ? Date.parse(token.expiresAtUtc) : 0
}

/** Called when a refresh fails, i.e. the server-side session is gone. */
export function onSessionEnded(listener: () => void) {
  sessionEndedListeners.add(listener)
  return () => {
    sessionEndedListeners.delete(listener)
  }
}

let refreshInFlight: Promise<string | null> | null = null

/**
 * Exchanges the refresh cookie for a new access token. Calls are collapsed into one in-flight request,
 * and serialized across tabs with a Web Lock: the API rotates refresh tokens and treats reuse of an old
 * one as theft (revoking the whole session), so two concurrent refreshes would log the user out.
 *
 * Resolves to null when the API rejects the session. Throws ApiError(0) when the API can't be reached
 * (offline, or the request was aborted by a navigation) — that says nothing about the session, so
 * callers must not sign the user out for it.
 */
export function refreshAccessToken(): Promise<string | null> {
  refreshInFlight ??= withRefreshLock(async () => {
    let res: Response
    try {
      res = await fetch(`${BASE_URL}/auth/refresh`, { method: 'POST', credentials: 'include' })
    } catch {
      throw new ApiError(0, 'Network error')
    }
    if (!res.ok) {
      setAccessToken(null)
      sessionEndedListeners.forEach((listener) => listener())
      return null
    }
    const body = (await res.json()) as AccessTokenResponse
    setAccessToken(body)
    return body.accessToken
  }).finally(() => {
    refreshInFlight = null
  })
  return refreshInFlight
}

async function withRefreshLock<T>(fn: () => Promise<T>): Promise<T> {
  if (typeof navigator !== 'undefined' && navigator.locks) {
    // `await` flattens the callback's promise; older lib.dom typings return Promise<Promise<T>> here.
    return await navigator.locks.request('arabyon-auth-refresh', fn)
  }
  return fn()
}

type Query = Record<string, string | number | boolean | null | undefined>

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  query?: Query
  signal?: AbortSignal
}

function buildUrl(path: string, query?: Query) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value))
  }
  const qs = params.toString()
  return `${BASE_URL}${path}${qs ? `?${qs}` : ''}`
}

async function send(path: string, options: RequestOptions, token: string | null) {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  return fetch(buildUrl(path, options.query), {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
    signal: options.signal,
  })
}

async function toApiError(res: Response): Promise<ApiError> {
  let problem: ProblemDetails = {}
  try {
    problem = (await res.json()) as ProblemDetails
  } catch {
    // Non-JSON error body (e.g. a proxy error page) — fall back to the status code.
  }
  return new ApiError(res.status, problem.title ?? res.statusText, problem.errors ?? {})
}

/**
 * Calls the API with the current access token, refreshing it first when it is about to expire and
 * retrying once after a 401. Throws ApiError for non-2xx responses (status 0 for network failures).
 */
export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const isAuthEndpoint = path.startsWith('/auth/')

  let token = accessToken
  if (token && !isAuthEndpoint && Date.now() > accessTokenExpiresAt - EXPIRY_SKEW_MS) {
    token = await refreshAccessToken()
  }

  let res: Response
  try {
    res = await send(path, options, token)
    if (res.status === 401 && token && !isAuthEndpoint) {
      const refreshed = await refreshAccessToken()
      if (refreshed) res = await send(path, options, refreshed)
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new ApiError(0, 'Network error')
  }

  if (!res.ok) throw await toApiError(res)
  if (res.status === 204 || res.headers.get('Content-Length') === '0') return undefined as T

  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}
