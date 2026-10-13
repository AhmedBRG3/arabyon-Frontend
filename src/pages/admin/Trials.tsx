import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../api/endpoints'
import type { TrialRequest, TrialRequestStatus } from '../../api/types'
import { useI18n } from '../../i18n/I18nContext'
import { formatDateTime } from '../../lib/format'
import { TRIAL_STATUSES, trialStatusTone } from '../../lib/labels'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { EmptyState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Label, Select, TextArea } from '../../components/ui/Field'
import { Pill } from '../../components/ui/Pill'
import { PageLoader } from '../../components/ui/Spinner'

// The public form posts option values; show them with the form's own translated labels.
const answerKeys: Record<string, string> = {
  canada: 'bookTrial.formCountryCanada',
  uae: 'bookTrial.formCountryUAE',
  other: 'bookTrial.formCountryOther',
  conversational: 'bookTrial.formProgramConversational',
  igcse: 'bookTrial.formProgramIGCSE',
  'uae-curriculum': 'bookTrial.formProgramUAE',
  unsure: 'bookTrial.formProgramUnsure',
  morning: 'bookTrial.formTimeMorning',
  afternoon: 'bookTrial.formTimeAfternoon',
  evening: 'bookTrial.formTimeEvening',
}

export function AdminTrials() {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const [status, setStatus] = useState<TrialRequestStatus | ''>('New')
  const trials = useQuery({
    queryKey: ['admin', 'trials', status],
    queryFn: () => adminApi.trials({ status: status || undefined, pageSize: 100 }),
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('trials.title')}
        description={t('trials.sub')}
        actions={
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as TrialRequestStatus | '')}
            className="max-w-48"
            aria-label={t('admin.status')}
          >
            <option value="">{t('admin.allStatuses')}</option>
            {TRIAL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`trialStatus.${s}`)}
              </option>
            ))}
          </Select>
        }
      />

      {trials.isPending && <PageLoader />}
      {trials.isError && <Alert tone="error">{errorMessage(trials.error)}</Alert>}
      {trials.data?.items.length === 0 && <EmptyState>{t('trials.empty')}</EmptyState>}
      {trials.data && trials.data.items.length > 0 && (
        <ul className="space-y-4">
          {trials.data.items.map((trial) => (
            <TrialRow key={trial.id} trial={trial} />
          ))}
        </ul>
      )}
    </div>
  )
}

function TrialRow({ trial }: { trial: TrialRequest }) {
  const { t, locale } = useI18n()
  const errorMessage = useErrorMessage()
  const queryClient = useQueryClient()
  const answer = (value: string | null) => (value ? (answerKeys[value] ? t(answerKeys[value]) : value) : '—')

  const update = useMutation({
    mutationFn: ({ status, notes }: { status: TrialRequestStatus; notes: string | null }) => adminApi.updateTrial(trial.id, status, notes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'trials'] }),
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    update.mutate({ status: data.get('status') as TrialRequestStatus, notes: String(data.get('notes')).trim() || null })
  }

  return (
    <li>
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-teal-950">{trial.fullName}</h3>
              <Pill tone={trialStatusTone(trial.status)}>{t(`trialStatus.${trial.status}`)}</Pill>
            </div>
            <div dir="ltr" className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-start text-sm">
              <a href={`mailto:${trial.email}`} className="text-teal-700 hover:underline">
                {trial.email}
              </a>
              {trial.whatsApp && (
                <a href={`https://wa.me/${trial.whatsApp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-teal-700 hover:underline">
                  WhatsApp {trial.whatsApp}
                </a>
              )}
            </div>
            <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-ink-500">{t('bookTrial.formCountry')}</dt>
                <dd className="text-ink-900">{answer(trial.country)}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">{t('bookTrial.formProgram')}</dt>
                <dd className="text-ink-900">{answer(trial.program)}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-500">{t('bookTrial.formTime')}</dt>
                <dd className="text-ink-900">{answer(trial.preferredTime)}</dd>
              </div>
            </dl>
          </div>
          <span className="text-xs text-ink-500">{formatDateTime(trial.createdAtUtc, locale)}</span>
        </div>

        <form key={`${trial.status}|${trial.adminNotes}`} onSubmit={handleSubmit} className="mt-5 grid gap-4 border-t border-teal-950/8 pt-5 sm:grid-cols-[12rem_1fr_auto] sm:items-end">
          <div>
            <Label htmlFor={`status-${trial.id}`}>{t('admin.status')}</Label>
            <Select id={`status-${trial.id}`} name="status" defaultValue={trial.status}>
              {TRIAL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t(`trialStatus.${s}`)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor={`notes-${trial.id}`}>{t('trials.notes')}</Label>
            <TextArea id={`notes-${trial.id}`} name="notes" rows={1} maxLength={2000} defaultValue={trial.adminNotes ?? ''} placeholder={t('trials.notesPlaceholder')} />
          </div>
          <Button type="submit" variant="secondary" disabled={update.isPending}>
            {update.isPending ? t('common.saving') : t('common.save')}
          </Button>
        </form>
        {update.isError && (
          <Alert tone="error" className="mt-4">
            {errorMessage(update.error)}
          </Alert>
        )}
      </Panel>
    </li>
  )
}
