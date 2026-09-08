import type { ReactNode } from 'react'

const tones = {
  teal: 'bg-teal-50 text-teal-700 group-hover:bg-teal-700 group-hover:text-white',
  gold: 'bg-gold-100 text-gold-600 group-hover:bg-gold-500 group-hover:text-teal-950',
}

export function IconBadge({
  children,
  tone = 'teal',
  className = '',
}: {
  children: ReactNode
  tone?: keyof typeof tones
  className?: string
}) {
  return (
    <span
      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:rotate-3 group-hover:scale-105 ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
