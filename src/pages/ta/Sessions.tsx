import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { offeringsApi, sessionsApi } from '../../api/endpoints'
import type { CreateSessionRequest, Session } from '../../api/types'
import { useI18n } from '../../i18n/I18nContext'
import { SESSION_DURATIONS } from '../../lib/labels'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { SessionRow } from '../../components/dashboard/SessionRow'
import { EmptyState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Label, Select, TextInput } from '../../components/ui/Field'
import { PageLoader } from '../../components/ui/Spinner'

export function TaSessions() {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const [creating, setCreating] = useState(false)
  const mine = useQuery({ queryKey: ['sessions', 'mine'], queryFn: sessionsApi.mine })

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('sessions.mineTitle')}
        description={t('sessions.mineSub')}
        actions={!creating && <Button onClick={() => setCreating(true)}>{t('sessions.new')}</Button>}
      />

      {creating && <CreateSessionForm onDone={() => setCreating(false)} />}

      {mine.isPending && <PageLoader />}
      {mine.isError && <Alert tone="error">{errorMessage(mine.error)}</Alert>}
      {mine.data?.length === 0 && !creating && <EmptyState>{t('sessions.mineEmpty')}</EmptyState>}
      {mine.data && mine.data.length > 0 && (
        <ul className="space-y-4">
          {mine.data.map((session) => (
            <SessionRow key={session.id} session={session} actions={<CancelSessionButton session={session} />} />
          ))}
        </ul>
      )}
    </div>
  )
}

/** Shown for sessions that haven't ended; canceling frees the Zoom room and removes the class from students' lists. */
function CancelSessionButton({ session }: { session: Session }) {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const queryClient = useQueryClient()
  // Read once on mount; render must stay pure.
  const [now] = useState(Date.now)
  const cancel = useMutation({
    mutationFn: () => sessionsApi.cancel(session.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
    onError: (error) => window.alert(errorMessage(error)),
  })

  if (session.status === 'Canceled' || new Date(session.endsAtUtc).getTime() <= now) return null

  return (
    <Button
      variant="ghost"
      disabled={cancel.isPending}
      onClick={() => {
        if (window.confirm(t('sessions.confirmCancel'))) cancel.mutate()
      }}
    >
      {cancel.isPending ? t('common.saving') : t('sessions.cancel')}
    </Button>
  )
}

/** "YYYY-MM-DDTHH:mm" in the browser's local time, the format a datetime-local input expects. */
function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function nextFullHour() {
  const date = new Date()
  date.setHours(date.getHours() + 1, 0, 0, 0)
  return date
}

function CreateSessionForm({ onDone }: { onDone: () => void }) {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<string | null>(null)
  const offerings = useQuery({ queryKey: ['offerings', 'mine'], queryFn: offeringsApi.mine })
  const active = offerings.data?.filter((o) => o.isActive) ?? []

  const create = useMutation({
    mutationFn: (body: CreateSessionRequest) => sessionsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      onDone()
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    // datetime-local has no zone: the browser reads it as the tutor's local time, and toISOString sends UTC.
    const start = new Date(String(data.get('start')))
    if (Number.isNaN(start.getTime()) || start.getTime() <= Date.now()) {
      setFormError(t('errors.sessionStartInPast'))
      return
    }
    setFormError(null)
    const end = new Date(start.getTime() + Number(data.get('duration')) * 60_000)
    create.mutate({
      taOfferingId: String(data.get('taOfferingId')),
      title: String(data.get('title')).trim(),
      startsAtUtc: start.toISOString(),
      endsAtUtc: end.toISOString(),
    })
  }

  return (
    <Panel title={t('sessions.new')}>
      {offerings.isPending ? (
        <PageLoader />
      ) : active.length === 0 ? (
        <>
          <EmptyState>{t('sessions.noOfferings')}</EmptyState>
          <div className="mt-4 flex gap-3">
            <Button to="/ta/courses">{t('dashboard.navCourses')}</Button>
            <Button variant="ghost" onClick={onDone}>
              {t('common.cancel')}
            </Button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="taOfferingId">{t('sessions.offering')}</Label>
              <Select id="taOfferingId" name="taOfferingId" required>
                {active.map((offering) => (
                  <option key={offering.id} value={offering.id}>
                    {offering.programTitle}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="title">{t('sessions.title')}</Label>
              <TextInput id="title" name="title" required maxLength={200} placeholder={t('sessions.titlePlaceholder')} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="start">{t('sessions.start')}</Label>
              <TextInput
                id="start"
                name="start"
                type="datetime-local"
                required
                dir="ltr"
                min={toLocalInputValue(new Date())}
                defaultValue={toLocalInputValue(nextFullHour())}
              />
            </div>
            <div>
              <Label htmlFor="duration">{t('sessions.duration')}</Label>
              <Select id="duration" name="duration" defaultValue="60">
                {SESSION_DURATIONS.map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {t('sessions.minutes').replace('{count}', String(minutes))}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <p className="text-xs text-ink-500">{t('sessions.timezoneNote')}</p>
          {(formError || create.isError) && <Alert tone="error">{formError ?? errorMessage(create.error)}</Alert>}
          <div className="flex gap-3">
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? t('sessions.creating') : t('sessions.create')}
            </Button>
            <Button type="button" variant="ghost" onClick={onDone}>
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      )}
    </Panel>
  )
}
