import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { offeringsApi, programsApi } from '../../api/endpoints'
import { useI18n } from '../../i18n/I18nContext'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { OfferingRow } from '../../components/dashboard/OfferingRow'
import { EmptyState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Field'
import { PageLoader } from '../../components/ui/Spinner'

const PAGE_SIZE = 20

export function AdminOfferings() {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const [programId, setProgramId] = useState('')
  const [page, setPage] = useState(1)

  const programs = useQuery({ queryKey: ['admin', 'programs', ''], queryFn: () => programsApi.list({ pageSize: 100 }) })
  const offerings = useQuery({
    queryKey: ['offerings', 'admin', programId, page],
    queryFn: () => offeringsApi.list({ programId: programId || undefined, page, pageSize: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  })
  const totalPages = offerings.data ? Math.max(1, Math.ceil(offerings.data.totalCount / PAGE_SIZE)) : 1

  return (
    <div className="space-y-6">
      <PageHeader title={t('admin.offeringsTitle')} description={t('admin.offeringsSub')} />

      <Panel>
        <div className="mb-4 flex justify-end">
          <Select
            value={programId}
            onChange={(e) => {
              setProgramId(e.target.value)
              setPage(1)
            }}
            className="max-w-64"
            aria-label={t('offerings.program')}
          >
            <option value="">{t('tutors.allPrograms')}</option>
            {programs.data?.items.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </Select>
        </div>

        {offerings.isPending && <PageLoader />}
        {offerings.isError && <Alert tone="error">{errorMessage(offerings.error)}</Alert>}
        {offerings.data?.items.length === 0 && <EmptyState>{t('admin.noOfferings')}</EmptyState>}
        {offerings.data && offerings.data.items.length > 0 && (
          <ul className="space-y-4">
            {offerings.data.items.map((offering) => (
              <OfferingRow key={offering.id} offering={offering} showTutor />
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="mt-5 flex items-center justify-end gap-3">
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
        <p className="mt-5 text-xs text-ink-500">{t('admin.offeringsNote')}</p>
      </Panel>
    </div>
  )
}
