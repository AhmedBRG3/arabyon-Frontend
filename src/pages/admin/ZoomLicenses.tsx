import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi, sessionsApi } from '../../api/endpoints'
import type { ZoomLicense } from '../../api/types'
import { useI18n } from '../../i18n/I18nContext'
import { formatDate } from '../../lib/format'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { SessionRow } from '../../components/dashboard/SessionRow'
import { EmptyState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Label, Select } from '../../components/ui/Field'
import { Pill } from '../../components/ui/Pill'
import { PageLoader } from '../../components/ui/Spinner'

/** The pool of Zoom host accounts classes are booked on. One license = one class at a time. */
export function AdminZoomLicenses() {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const [adding, setAdding] = useState(false)
  const licenses = useQuery({ queryKey: ['admin', 'zoomLicenses'], queryFn: adminApi.zoomLicenses })

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('zoom.title')}
        description={t('zoom.sub')}
        actions={!adding && <Button onClick={() => setAdding(true)}>{t('zoom.add')}</Button>}
      />

      {adding && <AddLicenseForm registered={licenses.data?.map((l) => l.zoomUserId) ?? []} onDone={() => setAdding(false)} />}

      {licenses.isPending && <PageLoader />}
      {licenses.isError && <Alert tone="error">{errorMessage(licenses.error)}</Alert>}
      {licenses.data?.length === 0 && !adding && <EmptyState>{t('zoom.empty')}</EmptyState>}
      {licenses.data && licenses.data.length > 0 && (
        <ul className="space-y-4">
          {licenses.data.map((license) => (
            <LicenseRow key={license.id} license={license} />
          ))}
        </ul>
      )}
    </div>
  )
}

function LicenseRow({ license }: { license: ZoomLicense }) {
  const { t, locale } = useI18n()
  const errorMessage = useErrorMessage()
  const queryClient = useQueryClient()
  const [showSessions, setShowSessions] = useState(false)

  const toggle = useMutation({
    mutationFn: () => adminApi.setZoomLicenseActive(license.id, !license.isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'zoomLicenses'] }),
  })
  const sessions = useQuery({
    queryKey: ['sessions', 'license', license.id],
    queryFn: () => sessionsApi.list({ zoomLicenseId: license.id, pageSize: 50 }),
    enabled: showSessions,
  })

  return (
    <li className="rounded-2xl border border-teal-950/8 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 dir="ltr" className="font-bold text-teal-950">
              {license.email}
            </h3>
            <Pill tone={license.isActive ? 'teal' : 'gray'}>{license.isActive ? t('offerings.active') : t('offerings.inactive')}</Pill>
          </div>
          <p className="mt-1 text-sm text-ink-500">
            {t('zoom.upcoming').replace('{count}', String(license.upcomingSessionCount))} ·{' '}
            {t('zoom.addedOn').replace('{date}', formatDate(license.createdAtUtc, locale))}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setShowSessions((v) => !v)}>
            {showSessions ? t('zoom.hideSessions') : t('zoom.showSessions')}
          </Button>
          <Button variant="secondary" onClick={() => toggle.mutate()} disabled={toggle.isPending}>
            {license.isActive ? t('offerings.deactivate') : t('offerings.activate')}
          </Button>
        </div>
      </div>
      {!license.isActive && license.upcomingSessionCount > 0 && (
        <Alert tone="warning" className="mt-4">
          {t('zoom.inactiveNote')}
        </Alert>
      )}
      {toggle.isError && (
        <Alert tone="error" className="mt-4">
          {errorMessage(toggle.error)}
        </Alert>
      )}
      {showSessions && (
        <div className="mt-5 border-t border-teal-950/8 pt-5">
          {sessions.isPending && <PageLoader />}
          {sessions.isError && <Alert tone="error">{errorMessage(sessions.error)}</Alert>}
          {sessions.data?.items.length === 0 && <EmptyState>{t('zoom.noSessions')}</EmptyState>}
          {sessions.data && sessions.data.items.length > 0 && (
            <ul className="space-y-3">
              {sessions.data.items.map((session) => (
                <SessionRow key={session.id} session={session} showTutor />
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  )
}

function AddLicenseForm({ registered, onDone }: { registered: string[]; onDone: () => void }) {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const queryClient = useQueryClient()
  // Straight from the Zoom account, so this also confirms the Server-to-Server app is connected.
  const zoomUsers = useQuery({ queryKey: ['admin', 'zoomUsers'], queryFn: adminApi.zoomUsers })
  const available = zoomUsers.data?.filter((u) => !registered.includes(u.id)) ?? []

  const create = useMutation({
    mutationFn: ({ id, email }: { id: string; email: string }) => adminApi.createZoomLicense(id, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'zoomLicenses'] })
      onDone()
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const user = available.find((u) => u.id === new FormData(e.currentTarget).get('zoomUserId'))
    if (user) create.mutate({ id: user.id, email: user.email })
  }

  return (
    <Panel title={t('zoom.add')}>
      {zoomUsers.isPending ? (
        <PageLoader />
      ) : zoomUsers.isError ? (
        <Alert tone="error">{errorMessage(zoomUsers.error)}</Alert>
      ) : available.length === 0 ? (
        <EmptyState>{t('zoom.noUsersLeft')}</EmptyState>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="zoomUserId">{t('zoom.zoomUser')}</Label>
            <Select id="zoomUserId" name="zoomUserId" required dir="ltr">
              {available.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email} ({user.type === 2 ? t('zoom.licensed') : t('zoom.basic')})
                </option>
              ))}
            </Select>
            <p className="mt-1.5 text-xs text-ink-500">{t('zoom.basicNote')}</p>
          </div>
          {create.isError && <Alert tone="error">{errorMessage(create.error)}</Alert>}
          <div className="flex gap-3">
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? t('common.saving') : t('zoom.register')}
            </Button>
            <Button type="button" variant="ghost" onClick={onDone}>
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      )}
      {(zoomUsers.isError || available.length === 0) && !zoomUsers.isPending && (
        <Button variant="ghost" className="mt-4" onClick={onDone}>
          {t('common.cancel')}
        </Button>
      )}
    </Panel>
  )
}
