import type { ReactNode } from 'react'

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

