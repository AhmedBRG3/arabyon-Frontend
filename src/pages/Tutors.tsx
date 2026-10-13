import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { offeringsApi, programsApi } from '../api/endpoints'
import type { Offering } from '../api/types'
import { useI18n } from '../i18n/I18nContext'
import { formatMoney, initials } from '../lib/format'
import { useErrorMessage } from '../lib/useErrorMessage'
import { Container } from '../components/layout/Container'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Pill } from '../components/ui/Pill'
import { Reveal } from '../components/ui/Reveal'
import { PageLoader } from '../components/ui/Spinner'

const PAGE_SIZE = 24

export function Tutors() {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const [params, setParams] = useSearchParams()
  const programId = params.get('program') ?? undefined
  const page = Number(params.get('page')) || 1

  const programs = useQuery({
    queryKey: ['programs', 'public'],
    queryFn: () => programsApi.list({ status: 'Published', pageSize: 100 }),
  })
  const offerings = useQuery({
    queryKey: ['offerings', 'public', programId, page],
    queryFn: () => offeringsApi.list({ programId, page, pageSize: PAGE_SIZE }),
  })

  const setFilter = (next: { program?: string; page?: number }) => {
    const p = new URLSearchParams()
    if (next.program) p.set('program', next.program)
    if (next.page && next.page > 1) p.set('page', String(next.page))
    setParams(p)
  }

  const totalPages = offerings.data ? Math.ceil(offerings.data.totalCount / PAGE_SIZE) : 1

  return (
    <div>
      <section className="bg-teal-950 py-16 text-center md:py-20">
        <Container>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold-300">
              {t('tutors.kicker')}
            </span>
            <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-bold text-white sm:text-4xl">{t('tutors.title')}</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-teal-100/85">{t('tutors.sub')}</p>
          </Reveal>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        {programs.data && programs.data.items.length > 1 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            <FilterChip active={!programId} onClick={() => setFilter({})}>
              {t('tutors.allPrograms')}
            </FilterChip>
            {programs.data.items.map((program) => (
              <FilterChip key={program.id} active={programId === program.id} onClick={() => setFilter({ program: program.id })}>
                {program.title}
              </FilterChip>
            ))}
          </div>
        )}

        {offerings.isPending && <PageLoader />}
        {offerings.isError && <Alert tone="error">{errorMessage(offerings.error)}</Alert>}
        {offerings.data && offerings.data.items.length === 0 && (
          <div className="mx-auto max-w-md rounded-3xl border border-teal-950/8 bg-white p-8 text-center">
            <p className="text-sm text-ink-700">{t('tutors.empty')}</p>
            <Button to="/book-trial" className="mt-5">
              {t('common.bookFreeTrial')}
            </Button>
          </div>
        )}

        {offerings.data && offerings.data.items.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {offerings.data.items.map((offering, i) => (
                <Reveal key={offering.id} delay={(i % 3) * 80}>
                  <OfferingCard offering={offering} />
                </Reveal>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <Button variant="ghost" disabled={page <= 1} onClick={() => setFilter({ program: programId, page: page - 1 })}>
                  {t('common.previous')}
                </Button>
                <span className="text-sm text-ink-500">
                  {page} / {totalPages}
                </span>
                <Button variant="ghost" disabled={page >= totalPages} onClick={() => setFilter({ program: programId, page: page + 1 })}>
                  {t('common.next')}
                </Button>
              </div>
            )}
          </>
        )}

        <p className="mx-auto mt-12 max-w-xl text-center text-xs text-ink-500">{t('tutors.enrollmentNote')}</p>
      </Container>
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active ? 'bg-teal-950 text-white' : 'border border-teal-950/15 bg-white text-teal-950 hover:bg-teal-950/5'
      }`}
    >
      {children}
    </button>
  )
}

function OfferingCard({ offering }: { offering: Offering }) {
  const { t, locale } = useI18n()

  return (
    <article className="flex h-full flex-col rounded-2xl border border-teal-950/8 bg-white p-6 shadow-sm shadow-teal-950/5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-teal-600/25 hover:shadow-xl hover:shadow-teal-950/10">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-950 font-display text-sm font-bold text-gold-300">
          {initials(offering.taName)}
        </span>
        <div className="min-w-0">
          <h2 className="truncate font-bold text-teal-950">{offering.taName}</h2>
          <p className="truncate text-xs text-ink-500">{offering.programTitle}</p>
        </div>
      </div>

      {offering.taBio && <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-ink-700">{offering.taBio}</p>}

      <div className="mt-auto pt-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="font-display text-2xl font-bold text-teal-950">
              {formatMoney(offering.monthlyPriceMinorUnits, offering.currency, locale)}
            </div>
            <div className="text-xs text-ink-500">{t('tutors.perMonth')}</div>
          </div>
          <Pill tone="teal">{t('courses.studentCount').replace('{count}', String(offering.seatsTaken))}</Pill>
        </div>
        <Button to="/book-trial" className="mt-5 w-full justify-center">
          {t('common.bookFreeTrial')}
        </Button>
      </div>
    </article>
  )
}
