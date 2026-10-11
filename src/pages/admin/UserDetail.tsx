import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { adminUsersApi } from '../../api/endpoints'
import type { Role, UserProfile, UserStatus } from '../../api/types'
import { useAuth } from '../../auth/AuthContext'
import { useI18n } from '../../i18n/I18nContext'
import { formatDate } from '../../lib/format'
import { ROLES, USER_STATUSES, userStatusTone } from '../../lib/labels'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { PageHeader, Panel } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { Pill } from '../../components/ui/Pill'
import { PageLoader } from '../../components/ui/Spinner'

export function AdminUserDetail() {
  const { id } = useParams<{ id: string }>()
  const { t, locale } = useI18n()
  const { user: me } = useAuth()
  const errorMessage = useErrorMessage()
  const queryClient = useQueryClient()
  const queryKey = ['admin', 'user', id]

  const user = useQuery({ queryKey, queryFn: () => adminUsersApi.get(id!) })

  const onSuccess = (updated: UserProfile) => {
    queryClient.setQueryData(queryKey, updated)
    queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
  }
  const toggleRole = useMutation({
    mutationFn: ({ role, on }: { role: Role; on: boolean }) =>
      on ? adminUsersApi.assignRole(id!, role) : adminUsersApi.removeRole(id!, role),
    onSuccess,
  })
  const changeStatus = useMutation({
    mutationFn: (status: UserStatus) => adminUsersApi.changeStatus(id!, status),
    onSuccess,
  })

  if (user.isPending) return <PageLoader />
  if (user.isError) return <Alert tone="error">{errorMessage(user.error)}</Alert>

  const u = user.data
  const isSelf = u.id === me?.id
  const mutationError = toggleRole.error ?? changeStatus.error

  return (
    <div className="space-y-6">
      <Link to="/admin/users" className="text-sm font-semibold text-teal-700 hover:underline">
        ← {t('admin.usersTitle')}
      </Link>
      <PageHeader title={u.fullName} />

      <Panel>
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">{t('auth.email')}</dt>
            <dd dir="ltr" className="mt-1 text-start font-medium text-teal-950">
              {u.email}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">{t('admin.emailVerified')}</dt>
            <dd className="mt-1">
              <Pill tone={u.emailVerified ? 'teal' : 'gold'}>{u.emailVerified ? t('common.yes') : t('common.no')}</Pill>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">{t('admin.joined')}</dt>
            <dd className="mt-1 font-medium text-teal-950">{formatDate(u.createdAtUtc, locale)}</dd>
          </div>
          {u.studentProfile?.phoneNumber && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">{t('bookTrial.formPhone')}</dt>
              <dd dir="ltr" className="mt-1 text-start font-medium text-teal-950">
                {u.studentProfile.phoneNumber}
              </dd>
            </div>
          )}
          {u.studentProfile?.gradeLevel && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">{t('profile.gradeLevel')}</dt>
              <dd className="mt-1 font-medium text-teal-950">{u.studentProfile.gradeLevel}</dd>
            </div>
          )}
        </dl>
        {u.taProfile?.bio && <p className="mt-5 border-t border-teal-950/8 pt-4 text-sm leading-relaxed text-ink-700">{u.taProfile.bio}</p>}
      </Panel>

      {mutationError && <Alert tone="error">{errorMessage(mutationError)}</Alert>}

      <div className="grid gap-6 md:grid-cols-2">
        <Panel title={t('profile.roles')}>
          <p className="mb-4 text-xs text-ink-500">{t('admin.rolesNote')}</p>
          <div className="space-y-2">
            {ROLES.map((role) => {
              const on = u.roles.includes(role)
              return (
                <label key={role} className="flex items-center gap-3 rounded-xl border border-teal-950/8 px-4 py-3 text-sm">
                  <input
                    type="checkbox"
                    checked={on}
                    disabled={toggleRole.isPending}
                    onChange={() => toggleRole.mutate({ role, on: !on })}
                    className="h-4 w-4 accent-teal-700"
                  />
                  <span className="font-medium text-teal-950">{t(`roles.${role}`)}</span>
                </label>
              )
            })}
          </div>
        </Panel>

        <Panel title={t('admin.status')}>
          <div className="mb-4">
            <Pill tone={userStatusTone(u.status)}>{t(`userStatus.${u.status}`)}</Pill>
          </div>
          {isSelf ? (
            <p className="text-sm text-ink-500">{t('errors.ownStatus')}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {USER_STATUSES.filter((s) => s !== u.status).map((s) => (
                <button
                  key={s}
                  onClick={() => changeStatus.mutate(s)}
                  disabled={changeStatus.isPending}
                  className="rounded-full border border-teal-950/15 px-4 py-2 text-sm font-semibold text-teal-950 transition-colors hover:bg-teal-950/5 disabled:opacity-50"
                >
                  {t('admin.setStatus').replace('{status}', t(`userStatus.${s}`))}
                </button>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}
