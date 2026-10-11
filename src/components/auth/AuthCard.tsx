import type { ReactNode } from 'react'
import { Container } from '../layout/Container'
import { Reveal } from '../ui/Reveal'

export function AuthCard({ title, sub, children, footer }: { title: string; sub?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <Container className="py-16 md:py-20">
      <Reveal className="mx-auto max-w-md">
        <div className="rounded-3xl border border-teal-950/8 bg-white p-6 shadow-sm shadow-teal-950/5 sm:p-8">
          <h1 className="text-2xl font-bold text-teal-950">{title}</h1>
          {sub && <p className="mt-2 text-sm text-ink-700">{sub}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-5 text-center text-sm text-ink-700">{footer}</div>}
      </Reveal>
    </Container>
  )
}

export const authLinkClass = 'font-semibold text-teal-700 underline-offset-4 hover:underline'
