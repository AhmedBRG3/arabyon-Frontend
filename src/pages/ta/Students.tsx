import { useQuery } from '@tanstack/react-query'
import { taApi } from '../../api/endpoints'
import type { RosterEntry } from '../../api/types'
import { useI18n } from '../../i18n/I18nContext'
import { formatDate } from '../../lib/format'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { EmptyState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { PageLoader } from '../../components/ui/Spinner'

/** Everyone subscribed to the tutor's offerings, grouped by course. */
export function TaStudents() {
  const { t, locale } = useI18n()
  const errorMessage = useErrorMessage()
  const roster = useQuery({ queryKey: ['ta', 'students'], queryFn: taApi.students })

  const byCourse = new Map<string, RosterEntry[]>()
  for (const entry of roster.data ?? []) {
    byCourse.set(entry.taOfferingId, [...(byCourse.get(entry.taOfferingId) ?? []), entry])
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('students.title')} description={t('students.sub')} />

      {roster.isPending && <PageLoader />}
      {roster.isError && <Alert tone="error">{errorMessage(roster.error)}</Alert>}
      {roster.data?.length === 0 && <EmptyState>{t('students.empty')}</EmptyState>}

      {[...byCourse.values()].map((entries) => (
        <Panel key={entries[0]!.taOfferingId} title={`${entries[0]!.programTitle} · ${t('courses.studentCount').replace('{count}', String(entries.length))}`}>
          <ul className="divide-y divide-teal-950/8">
            {entries.map((entry) => (
              <li key={entry.subscriptionId} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="font-semibold text-teal-950">{entry.studentName}</div>
                  <a dir="ltr" href={`mailto:${entry.studentEmail}`} className="block truncate text-start text-xs text-teal-700 hover:underline">
                    {entry.studentEmail}
                  </a>
                </div>
                <span className="text-xs text-ink-500">
                  {t('students.since').replace('{date}', formatDate(entry.subscribedAtUtc, locale))}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      ))}
    </div>
  )
}
