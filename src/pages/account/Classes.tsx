import { useQuery } from '@tanstack/react-query'
import { sessionsApi } from '../../api/endpoints'
import { useI18n } from '../../i18n/I18nContext'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { SessionRow } from '../../components/dashboard/SessionRow'
import { EmptyState, PageHeader } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { PageLoader } from '../../components/ui/Spinner'

/** Upcoming sessions of the courses the student has subscribed to. */
export function Classes() {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const sessions = useQuery({ queryKey: ['sessions', 'list'], queryFn: () => sessionsApi.list({ pageSize: 50 }) })

  return (
    <div className="space-y-6">
      <PageHeader title={t('classes.title')} description={t('classes.sub')} />

      {sessions.isPending && <PageLoader />}
      {sessions.isError && <Alert tone="error">{errorMessage(sessions.error)}</Alert>}
      {sessions.data?.items.length === 0 && <EmptyState>{t('classes.empty')}</EmptyState>}
      {sessions.data && sessions.data.items.length > 0 && (
        <ul className="space-y-4">
          {sessions.data.items.map((session) => (
            <SessionRow key={session.id} session={session} showTutor />
          ))}
        </ul>
      )}
    </div>
  )
}
