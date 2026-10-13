import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../api/endpoints'
import type { SubscriptionStatus } from '../../api/types'
import { useI18n } from '../../i18n/I18nContext'
import { formatDate, formatMoney } from '../../lib/format'
import { SUBSCRIPTION_STATUSES, subscriptionStatusTone } from '../../lib/labels'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { EmptyState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Field'
import { Pill } from '../../components/ui/Pill'
import { PageLoader } from '../../components/ui/Spinner'

const PAGE_SIZE = 50

/** Every subscription. No gateway is connected yet, so none has a payment behind it. */
export function AdminPayments() {
  const { t, locale } = useI18n()
  const errorMessage = useErrorMessage()
  const [status, setStatus] = useState<SubscriptionStatus | ''>('')
  const [page, setPage] = useState(1)
  const subscriptions = useQuery({
    queryKey: ['admin', 'subscriptions', status, page],
    queryFn: () => adminApi.subscriptions({ status: status || undefined, page, pageSize: PAGE_SIZE }),
  })
  const totalPages = Math.max(1, Math.ceil((subscriptions.data?.totalCount ?? 0) / PAGE_SIZE))

  return (
    <div className="space-y-6">
      <PageHeader title={t('payments.title')} description={t('payments.sub')} />
      <Alert tone="warning">{t('payments.noGatewayNote')}</Alert>

      <Panel>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-ink-700">
            {subscriptions.data && t('payments.count').replace('{count}', String(subscriptions.data.totalCount))}
          </span>
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as SubscriptionStatus | '')
              setPage(1)
            }}
            className="max-w-48"
            aria-label={t('admin.status')}
          >
            <option value="">{t('admin.allStatuses')}</option>
            {SUBSCRIPTION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`subscriptionStatus.${s}`)}
              </option>
            ))}
          </Select>
        </div>

        {subscriptions.isPending && <PageLoader />}
        {subscriptions.isError && <Alert tone="error">{errorMessage(subscriptions.error)}</Alert>}
        {subscriptions.data?.items.length === 0 && <EmptyState>{t('payments.empty')}</EmptyState>}
        {subscriptions.data && subscriptions.data.items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-teal-950/8 text-xs uppercase tracking-wide text-ink-500">
                  <th className="py-2 pe-4 text-start font-semibold">{t('payments.student')}</th>
                  <th className="py-2 pe-4 text-start font-semibold">{t('payments.course')}</th>
                  <th className="py-2 pe-4 text-end font-semibold">{t('offerings.monthlyPrice')}</th>
                  <th className="py-2 pe-4 text-start font-semibold">{t('admin.status')}</th>
                  <th className="py-2 pe-4 text-start font-semibold">{t('payments.payment')}</th>
                  <th className="py-2 text-start font-semibold">{t('payments.since')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-950/8">
                {subscriptions.data.items.map((row) => (
                  <tr key={row.id}>
                    <td className="py-3 pe-4">
                      <div className="font-semibold text-teal-950">{row.studentName}</div>
                      <div dir="ltr" className="text-start text-xs text-ink-500">
                        {row.studentEmail}
                      </div>
                    </td>
                    <td className="py-3 pe-4">
                      <div className="text-teal-950">{row.programTitle}</div>
                      <div className="text-xs text-ink-500">{row.taName}</div>
                    </td>
                    <td className="py-3 pe-4 text-end">{formatMoney(row.monthlyPriceMinorUnits, row.currency, locale)}</td>
                    <td className="py-3 pe-4">
                      <Pill tone={subscriptionStatusTone(row.status)}>{t(`subscriptionStatus.${row.status}`)}</Pill>
                    </td>
                    <td className="py-3 pe-4 text-ink-700">{row.hasPayments ? t('payments.paid') : t('payments.freeAccess')}</td>
                    <td className="py-3 text-ink-700">{formatDate(row.createdAtUtc, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <Button variant="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              {t('common.previous')}
            </Button>
            <span className="text-sm text-ink-500">
              {page} / {totalPages}
            </span>
            <Button variant="ghost" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              {t('common.next')}
            </Button>
          </div>
        )}
      </Panel>
    </div>
  )
}
