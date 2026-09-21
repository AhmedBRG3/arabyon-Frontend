import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import en from './en.json'
import ar from './ar.json'

export type Locale = 'en' | 'ar'

const dictionaries: Record<Locale, typeof en> = { en, ar }

const STORAGE_KEY = 'institute-locale'

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'ar'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'ar' || stored === 'en' ? stored : 'ar'
}

function resolve(dict: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, dict)
}

interface I18nContextValue {
  locale: Locale
  dir: 'ltr' | 'rtl'
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (key: string) => string
  /** Returns raw data (arrays/objects) from the dictionary, e.g. FAQ items or blog posts. */
  td: <T,>(key: string) => T
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)
  const dir: 'ltr' | 'rtl' = locale === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
    window.localStorage.setItem(STORAGE_KEY, locale)
  }, [locale, dir])

  const setLocale = (next: Locale) => setLocaleState(next)
  const toggleLocale = () => setLocaleState((prev) => (prev === 'en' ? 'ar' : 'en'))

  const value = useMemo<I18nContextValue>(() => {
    const dict = dictionaries[locale]
    const fallback = dictionaries.en
    const t = (key: string) => {
      const val = resolve(dict, key)
      if (typeof val === 'string') return val
      const fallbackVal = resolve(fallback, key)
      if (typeof fallbackVal === 'string') return fallbackVal
      return key
    }
    const td = <T,>(key: string): T => {
      const val = resolve(dict, key)
      return (val ?? resolve(fallback, key)) as T
    }
    return { locale, dir, setLocale, toggleLocale, t, td }
  }, [locale, dir])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
