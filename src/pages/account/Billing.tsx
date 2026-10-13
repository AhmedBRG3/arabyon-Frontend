import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { subscriptionsApi } from '../../api/endpoints'
import type { Subscription } from '../../api/types'
import { useI18n } from '../../i18n/I18nContext'
import { formatDate, formatMoney } from '../../lib/format'
import { subscriptionStatusTone } from '../../lib/labels'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { EmptyState, PageHeader } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Pill } from '../../components/ui/Pill'
import { PageLoader } from '../../components/ui/Spinner'

/** The student's subscriptions. Billing is off for now, so every course is included for free. */
export function Billing() {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const subscriptions = useQuery({ queryKey: ['subscriptions', 'mine'], queryFn: subscriptionsApi.mine })

  return (
    <div className="space-y-6">
      <PageHeader title={t('billing.title')} description={t('billing.sub')} />
      <Alert tone="success">{t('billing.freeNote')}</Alert>

      {subscriptions.isPending && <PageLoader />}
      {subscriptions.isError && <Alert tone="error">{errorMessage(subscriptions.error)}</Alert>}
      {subscriptions.data?.length === 0 && <EmptyState>{t('billing.empty')}</EmptyState>}
      {subscriptions.data && subscriptions.data.length > 0 && (
        <ul className="space-y-4">
          {subscriptions.data.map((subscription) => (
            <SubscriptionRow key={subscription.id} subscription={subscription} />
          ))}
        </ul>
      )}
    </div>
  )
}

function SubscriptionRow({ subscription }: { subscription: Subscription }) {
  const { t, locale } = useI18n()
  const errorMessage = useErrorMessage()
  const queryClient = useQueryClient()
  const active = subscription.status === 'Active'

  const toggle = useMutation({
    mutationFn: () => (active ? subscriptionsApi.cancel(subscription.id) : subscriptionsApi.resume(subscription.id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })

  const leave = () => {
    if (window.confirm(t('billing.confirmLeave'))) toggle.mutate()
  }

  return (
    <li className="rounded-2xl border border-teal-950/8 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-teal-950">{subscription.programTitle}</h3>
            <Pill tone={subscriptionStatusTone(subscription.status)}>{t(`subscriptionStatus.${subscription.status}`)}</Pill>
          </div>
          <p className="mt-0.5 text-sm text-ink-700">{t('classes.with').replace('{tutor}', subscription.taName)}</p>
          <p className="mt-1 text-sm text-ink-500">
            <span className="line-through">
              {formatMoney(subscription.monthlyPriceMinorUnits, subscription.currency, locale)} {t('tutors.perMonth')}
            </span>{' '}
            <span className="font-semibold text-teal-700">{t('billing.free')}</span>
            {subscription.currentPeriodStartUtc && active && (
              <> · {t('billing.since').replace('{date}', formatDate(subscription.currentPeriodStartUtc, locale))}</>
            )}
            {subscription.canceledAtUtc && !active && (
              <> · {t('billing.leftOn').replace('{date}', formatDate(subscription.canceledAtUtc, locale))}</>
            )}
          </p>
        </div>
        <Button variant={active ? 'ghost' : 'secondary'} onClick={active ? leave : () => toggle.mutate()} disabled={toggle.isPending}>
          {active ? t('billing.leave') : t('billing.rejoin')}
        </Button>
      </div>
      {toggle.isError && (
        <Alert tone="error" className="mt-4">
          {errorMessage(toggle.error)}
        </Alert>
      )}
    </li>
  )
}
