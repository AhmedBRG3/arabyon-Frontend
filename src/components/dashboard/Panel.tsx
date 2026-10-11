import type { ReactNode } from 'react'
import { useI18n } from '../../i18n/I18nContext'
import { PlaceholderBadge } from '../ui/PlaceholderBadge'

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-teal-950">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-ink-700">{description}</p>}
      </div>
      {actions}
    </div>
  )
}

/** White card used for every dashboard section. */
export function Panel({ title, children, className = '' }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-teal-950/8 bg-white p-5 shadow-sm shadow-teal-950/5 sm:p-6 ${className}`}>
      {title && <h2 className="mb-4 text-base font-bold text-teal-950">{title}</h2>}
      {children}
    </section>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-xl bg-sand-50 p-6 text-center text-sm text-ink-500">{children}</p>
}

/**
 * Screen whose backend module isn't built yet. `ns` points at an i18n block with
 * `title`, `description` and a `points` list describing what the screen will do.
 */
export function ComingSoon({ ns }: { ns: string }) {
  const { t, td } = useI18n()
  const points = td<string[]>(`${ns}.points`) ?? []

  return (
    <div>
      <PageHeader title={t(`${ns}.title`)} description={t(`${ns}.description`)} />
      <Panel>
        <PlaceholderBadge />
        <h2 className="mt-4 font-bold text-teal-950">{t('dashboard.comingSoonTitle')}</h2>
        <ul className="mt-3 space-y-2">
          {points.map((point) => (
            <li key={point} className="flex gap-2 text-sm leading-relaxed text-ink-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
              {point}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
