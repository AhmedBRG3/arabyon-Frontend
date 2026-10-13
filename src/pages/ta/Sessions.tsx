import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { offeringsApi, sessionsApi } from '../../api/endpoints'
import type { CreateSessionRequest, CreateSessionSeriesRequest, DayOfWeek, Session } from '../../api/types'
import { useI18n, type Locale } from '../../i18n/I18nContext'
import { formatDateTime, formatTime, formatWeekday } from '../../lib/format'
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
          {groupBySeries(mine.data).map((group) =>
            group.length === 1 && !group[0].seriesId ? (
              <SessionRow key={group[0].id} session={group[0]} actions={<CancelSessionButton session={group[0]} />} />
            ) : (
              <SeriesGroup key={group[0].seriesId} sessions={group} />
            ),
          )}
        </ul>
      )}
    </div>
  )
}

/** The series' weekdays in the viewer's time zone, Saturday first, e.g. "Mon, Wed". */
function seriesWeekdays(sessions: Session[], locale: Locale) {
  const days = new Set(sessions.map((s) => new Date(s.startsAtUtc).getDay()))
  return WEEK_ORDER.filter((day) => days.has(day))
    .map((day) => formatWeekday(day, locale))
    .join(locale === 'ar' ? '، ' : ', ')
}

/** One-off sessions stay single; a series' classes are gathered (in class order) where its first one appears. */
function groupBySeries(sessions: Session[]): Session[][] {
  const groups: Session[][] = []
  const bySeries = new Map<string, Session[]>()
  for (const session of sessions) {
    if (!session.seriesId) {
      groups.push([session])
      continue
    }
    let group = bySeries.get(session.seriesId)
    if (!group) {
      group = []
      bySeries.set(session.seriesId, group)
      groups.push(group)
    }
    group.push(session)
  }
  for (const group of bySeries.values()) group.sort((a, b) => (a.seriesSequence ?? 0) - (b.seriesSequence ?? 0))
  return groups
}

function SeriesGroup({ sessions }: { sessions: Session[] }) {
  const { t, locale } = useI18n()
  const errorMessage = useErrorMessage()
  const queryClient = useQueryClient()
  const [now] = useState(Date.now)
  const cancelRemaining = useMutation({
    mutationFn: () => sessionsApi.cancelSeries(sessions[0].seriesId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions'] }),
    onError: (error) => window.alert(errorMessage(error)),
  })
  const hasUpcoming = sessions.some((s) => s.status !== 'Canceled' && new Date(s.startsAtUtc).getTime() > now)

  return (
    <li className="rounded-3xl border border-teal-950/10 bg-sand-50 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="text-sm font-semibold text-teal-950">
          {t('sessions.seriesHeading')
            .replace('{title}', sessions[0].title)
            .replace('{total}', String(sessions[0].seriesTotal ?? sessions.length))
            .replace('{days}', seriesWeekdays(sessions, locale))
            .replace('{time}', formatTime(sessions[0].startsAtUtc, locale))}
        </p>
        {hasUpcoming && (
          <Button
            variant="ghost"
            disabled={cancelRemaining.isPending}
            onClick={() => {
              if (window.confirm(t('sessions.confirmCancelRemaining'))) cancelRemaining.mutate()
            }}
          >
            {cancelRemaining.isPending ? t('common.saving') : t('sessions.cancelRemaining')}
          </Button>
        )}
      </div>
      <ul className="space-y-3">
        {sessions.map((session) => (
          <SessionRow key={session.id} session={session} actions={<CancelSessionButton session={session} />} />
        ))}
      </ul>
    </li>
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

function DurationField() {
  const { t } = useI18n()
  return (
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
  )
}

/** "YYYY-MM-DDTHH:mm" in the browser's local time, the format a datetime-local input expects. */
function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

// JS getDay() order, which is also .NET's DayOfWeek order.
const DAY_NAMES: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
// The week is shown starting on Saturday, as in Egypt and most Arab countries.
const WEEK_ORDER = [6, 0, 1, 2, 3, 4, 5]

const pad2 = (n: number) => String(n).padStart(2, '0')
const toDateInputValue = (date: Date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`

/** The same walk the API does (SessionService.SeriesStartTimes), in the browser's time zone, for the preview. */
function seriesStarts(startDate: string, time: string, days: number[], count: number) {
  const [y, m, d] = startDate.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm) || days.length === 0 || !(count >= 1)) return []
  const starts: Date[] = []
  const now = Date.now()
  for (let i = 0; starts.length < count && i < 400; i++) {
    const day = new Date(y, m - 1, d + i, hh, mm)
    if (days.includes(day.getDay()) && day.getTime() > now) starts.push(day)
  }
  return starts
}

function nextFullHour() {
  const date = new Date()
  date.setHours(date.getHours() + 1, 0, 0, 0)
  return date
}

function CreateSessionForm({ onDone }: { onDone: () => void }) {
  const { t, locale } = useI18n()
  const errorMessage = useErrorMessage()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<string | null>(null)
  const [repeat, setRepeat] = useState(false)
  const [firstStart] = useState(nextFullHour)
  const [seriesDate, setSeriesDate] = useState(() => toDateInputValue(firstStart))
  const [seriesTime, setSeriesTime] = useState(() => `${pad2(firstStart.getHours())}:00`)
  const [seriesDays, setSeriesDays] = useState<number[]>(() => [firstStart.getDay()])
  const [seriesCount, setSeriesCount] = useState(8)
  const preview = repeat ? seriesStarts(seriesDate, seriesTime, seriesDays, seriesCount) : []
  const offerings = useQuery({ queryKey: ['offerings', 'mine'], queryFn: offeringsApi.mine })
  const active = offerings.data?.filter((o) => o.isActive) ?? []

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['sessions'] })
    onDone()
  }
  const createOne = useMutation({ mutationFn: (body: CreateSessionRequest) => sessionsApi.create(body), onSuccess })
  const createSeries = useMutation({ mutationFn: (body: CreateSessionSeriesRequest) => sessionsApi.createSeries(body), onSuccess })
  const create = repeat ? createSeries : createOne

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const common = { taOfferingId: String(data.get('taOfferingId')), title: String(data.get('title')).trim() }
    const duration = Number(data.get('duration'))

    if (repeat) {
      if (seriesDays.length === 0) {
        setFormError(t('sessions.pickDays'))
        return
      }
      setFormError(null)
      createSeries.mutate({
        ...common,
        startDate: seriesDate,
        startTime: `${seriesTime}:00`,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        daysOfWeek: WEEK_ORDER.filter((day) => seriesDays.includes(day)).map((day) => DAY_NAMES[day]),
        durationMinutes: duration,
        totalCount: seriesCount,
      })
      return
    }

    // datetime-local has no zone: the browser reads it as the tutor's local time, and toISOString sends UTC.
    const start = new Date(String(data.get('start')))
    if (Number.isNaN(start.getTime()) || start.getTime() <= Date.now()) {
      setFormError(t('errors.sessionStartInPast'))
      return
    }
    setFormError(null)
    createOne.mutate({ ...common, startsAtUtc: start.toISOString(), endsAtUtc: new Date(start.getTime() + duration * 60_000).toISOString() })
  }

  const toggleDay = (day: number) =>
    setSeriesDays((days) => (days.includes(day) ? days.filter((d) => d !== day) : [...days, day]))

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
          <label className="flex items-center gap-3 rounded-xl border border-teal-950/8 px-4 py-3 text-sm">
            <input type="checkbox" checked={repeat} onChange={(e) => setRepeat(e.target.checked)} className="h-4 w-4 accent-teal-700" />
            <span className="font-medium text-teal-950">{t('sessions.repeat')}</span>
          </label>
          {repeat ? (
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <Label htmlFor="seriesDate">{t('sessions.startingFrom')}</Label>
                  <TextInput
                    id="seriesDate"
                    type="date"
                    required
                    dir="ltr"
                    min={toDateInputValue(new Date())}
                    value={seriesDate}
                    onChange={(e) => setSeriesDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="seriesTime">{t('sessions.time')}</Label>
                  <TextInput id="seriesTime" type="time" required dir="ltr" value={seriesTime} onChange={(e) => setSeriesTime(e.target.value)} />
                </div>
                <DurationField />
              </div>
              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-teal-950">{t('sessions.days')}</legend>
                <div className="flex flex-wrap gap-2">
                  {WEEK_ORDER.map((day) => {
                    const on = seriesDays.includes(day)
                    return (
                      <button
                        key={day}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleDay(day)}
                        className={`min-w-14 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                          on ? 'bg-teal-950 text-white' : 'border border-teal-950/15 bg-white text-teal-950 hover:bg-teal-950/5'
                        }`}
                      >
                        {formatWeekday(day, locale)}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
              <div className="sm:w-1/3">
                <Label htmlFor="totalCount">{t('sessions.totalCount')}</Label>
                <TextInput
                  id="totalCount"
                  type="number"
                  min={2}
                  max={52}
                  required
                  dir="ltr"
                  value={seriesCount}
                  onChange={(e) => setSeriesCount(Number(e.target.value))}
                />
              </div>
              {preview.length > 0 && (
                <p className="rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-950">
                  {t('sessions.schedulePreview')
                    .replace('{count}', String(preview.length))
                    .replace('{first}', formatDateTime(preview[0].toISOString(), locale))
                    .replace('{last}', formatDateTime(preview[preview.length - 1].toISOString(), locale))}
                </p>
              )}
              <p className="text-xs text-ink-500">{t('sessions.repeatNote')}</p>
            </div>
          ) : (
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
                  defaultValue={toLocalInputValue(firstStart)}
                />
              </div>
              <DurationField />
            </div>
          )}
          <p className="text-xs text-ink-500">{t('sessions.timezoneNote')}</p>
          {(formError || create.isError) && <Alert tone="error">{formError ?? errorMessage(create.error)}</Alert>}
          <div className="flex gap-3">
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? t('sessions.creating') : repeat ? t('sessions.createSeries') : t('sessions.create')}
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
