import type { ReactNode } from 'react'

type Tone = 'error' | 'success' | 'info' | 'warning'

const tones: Record<Tone, string> = {
  error: 'bg-red-50 text-red-700',
  success: 'bg-teal-50 text-teal-800',
  info: 'bg-sand-100 text-ink-700',
  warning: 'border border-dashed border-gold-500/60 bg-gold-100/60 text-gold-600',
}

export function Alert({ tone = 'info', children, className = '' }: { tone?: Tone; children: ReactNode; className?: string }) {
  // A div, not a p: some callers (e.g. a verify-email banner with a resend button) nest block content,
  // which isn't valid inside a <p>.
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`rounded-xl p-3 text-sm ${tones[tone]} ${className}`}>
      {children}
    </div>
  )
}
