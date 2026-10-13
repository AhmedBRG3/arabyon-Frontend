import { useQuery } from '@tanstack/react-query'
import { taApi } from '../../api/endpoints'
import { useI18n } from '../../i18n/I18nContext'
import { formatMoney } from '../../lib/format'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { EmptyState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { Pill } from '../../components/ui/Pill'
import { PageLoader } from '../../components/ui/Spinner'

/** Monthly value of each offering (price x active students). Nothing is collected until payments are switched on. */
export function TaEarnings() {
  const { t, locale } = useI18n()
  const errorMessage = useErrorMessage()
  const earnings = useQuery({ queryKey: ['ta', 'earnings'], queryFn: taApi.earnings })

  // Offerings can be priced in different currencies, so totals are per currency.
  const totals = new Map<string, number>()
  for (const row of earnings.data?.offerings ?? []) {
    if (row.isActive) totals.set(row.currency, (totals.get(row.currency) ?? 0) + row.projectedMonthlyMinorUnits)
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('earnings.title')} description={t('earnings.sub')} />

      {earnings.isPending && <PageLoader />}
      {earnings.isError && <Alert tone="error">{errorMessage(earnings.error)}</Alert>}
      {earnings.data && !earnings.data.paymentsEnabled && <Alert tone="warning">{t('earnings.freeNote')}</Alert>}
      {earnings.data?.offerings.length === 0 && <EmptyState>{t('earnings.empty')}</EmptyState>}

      {totals.size > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...totals.entries()].map(([currency, total]) => (
            <div key={currency} className="rounded-2xl border border-teal-950/8 bg-white p-5 shadow-sm shadow-teal-950/5">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">{t('earnings.projectedTotal')}</div>
              <div className="mt-2 font-display text-2xl font-bold text-teal-950">{formatMoney(total, currency, locale)}</div>
              <div className="text-xs text-ink-500">{t('tutors.perMonth')}</div>
            </div>
          ))}
        </div>
      )}

      {earnings.data && earnings.data.offerings.length > 0 && (
        <Panel>
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead>
                <tr className="border-b border-teal-950/8 text-xs uppercase tracking-wide text-ink-500">
                  <th className="py-2 pe-4 text-start font-semibold">{t('earnings.course')}</th>
                  <th className="py-2 pe-4 text-end font-semibold">{t('offerings.monthlyPrice')}</th>
                  <th className="py-2 pe-4 text-end font-semibold">{t('earnings.students')}</th>
                  <th className="py-2 pe-4 text-end font-semibold">{t('earnings.projected')}</th>
                  <th className="py-2 text-end font-semibold">{t('earnings.sessions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-950/8">
                {earnings.data.offerings.map((row) => (
                  <tr key={row.taOfferingId}>
                    <td className="py-3 pe-4">
                      <span className="font-semibold text-teal-950">{row.programTitle}</span>{' '}
                      {!row.isActive && <Pill tone="gray">{t('offerings.inactive')}</Pill>}
                    </td>
                    <td className="py-3 pe-4 text-end">{formatMoney(row.monthlyPriceMinorUnits, row.currency, locale)}</td>
                    <td className="py-3 pe-4 text-end">{row.activeStudents}</td>
                    <td className="py-3 pe-4 text-end font-semibold text-teal-950">
                      {formatMoney(row.projectedMonthlyMinorUnits, row.currency, locale)}
                    </td>
                    <td className="py-3 text-end text-ink-700">
                      {t('earnings.sessionsValue').replace('{held}', String(row.sessionsHeld)).replace('{upcoming}', String(row.sessionsUpcoming))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  )
}
