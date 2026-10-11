import type { ReactNode } from 'react'

type Tone = 'teal' | 'gold' | 'gray' | 'red'

const tones: Record<Tone, string> = {
  teal: 'bg-teal-50 text-teal-700',
  gold: 'bg-gold-100 text-gold-600',
  gray: 'bg-sand-100 text-ink-500',
  red: 'bg-red-50 text-red-700',
}

export function Pill({ tone = 'gray', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  )
}
