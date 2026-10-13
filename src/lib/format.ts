import type { Locale } from '../i18n/I18nContext'

// Latin digits in Arabic too, matching the rest of the site's copy.
const intlLocale = (locale: Locale) => (locale === 'ar' ? 'ar-u-nu-latn' : 'en')

/** Number of decimal places a currency uses (2 for EGP/USD/AED/CAD, 0 for JPY, 3 for KWD...). */
export function currencyExponent(currency: string) {
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2
  } catch {
    return 2
  }
}

export function formatMoney(minorUnits: number, currency: string, locale: Locale) {
  const amount = minorUnits / 10 ** currencyExponent(currency)
  try {
    return new Intl.NumberFormat(intlLocale(locale), { style: 'currency', currency }).format(amount)
  } catch {
    return `${amount} ${currency}`
  }
}

/** Converts a user-typed major-unit amount ("250.50") to minor units, or null if it isn't a positive number. */
export function toMinorUnits(input: string, currency: string) {
  const value = Number(input.replace(',', '.'))
  if (!Number.isFinite(value) || value <= 0) return null
  return Math.round(value * 10 ** currencyExponent(currency))
}

export function toMajorUnits(minorUnits: number, currency: string) {
  return String(minorUnits / 10 ** currencyExponent(currency))
}

export function formatDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: 'medium' }).format(new Date(iso))
}

/** Date and time in the viewer's own time zone, e.g. "Oct 12, 2026, 3:00 PM". */
export function formatDateTime(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
}

export function formatTime(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale(locale), { timeStyle: 'short' }).format(new Date(iso))
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')
}

/** Short weekday name for a JS day index (0 = Sunday). */
export function formatWeekday(day: number, locale: Locale) {
  // 2024-01-07 was a Sunday.
  return new Intl.DateTimeFormat(intlLocale(locale), { weekday: 'short' }).format(new Date(2024, 0, 7 + day))
}
