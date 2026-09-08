import type { ReactNode } from 'react'

export function Card({
  children,
  className = '',
  hoverable = false,
}: {
  children: ReactNode
  className?: string
  hoverable?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border border-teal-950/8 bg-white p-6 shadow-sm shadow-teal-950/5 transition-all duration-300 ease-out ${
        hoverable
          ? 'hover:-translate-y-1.5 hover:border-teal-600/25 hover:shadow-xl hover:shadow-teal-950/10'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
