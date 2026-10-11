import type { FormEvent } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { adminUsersApi } from '../../api/endpoints'
import type { Role, UserStatus } from '../../api/types'
import { useI18n } from '../../i18n/I18nContext'
import { formatDate } from '../../lib/format'
import { ROLES, USER_STATUSES, userStatusTone } from '../../lib/labels'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { EmptyState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Select, TextInput } from '../../components/ui/Field'
import { Pill } from '../../components/ui/Pill'
import { PageLoader } from '../../components/ui/Spinner'

const PAGE_SIZE = 20

export function AdminUsers() {
  const { t, locale } = useI18n()
  const errorMessage = useErrorMessage()
  const [params, setParams] = useSearchParams()
  const search = params.get('search') ?? ''
  const role = (params.get('role') as Role | null) ?? undefined
  const status = (params.get('status') as UserStatus | null) ?? undefined
  const page = Number(params.get('page')) || 1

  const users = useQuery({
    queryKey: ['admin', 'users', { search, role, status, page }],
    queryFn: () => adminUsersApi.list({ search: search || undefined, role, status, page, pageSize: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  })
  const totalPages = users.data ? Math.max(1, Math.ceil(users.data.totalCount / PAGE_SIZE)) : 1

  const update = (changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    if (!('page' in changes)) next.delete('page')
    setParams(next)
  }

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    update({ search: String(new FormData(e.currentTarget).get('search')).trim() || undefined })
  }

  return (
    <div>
      <PageHeader title={t('admin.usersTitle')} description={t('admin.usersSub')} />

      <Panel>
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <form onSubmit={handleSearch} className="flex gap-2">
            <TextInput name="search" type="search" defaultValue={search} placeholder={t('admin.searchUsers')} aria-label={t('admin.searchUsers')} />
            <Button type="submit" variant="secondary">
              {t('common.search')}
            </Button>
          </form>
          <Select value={role ?? ''} onChange={(e) => update({ role: e.target.value || undefined })} aria-label={t('profile.roles')}>
            <option value="">{t('admin.allRoles')}</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {t(`roles.${r}`)}
              </option>
            ))}
          </Select>
          <Select value={status ?? ''} onChange={(e) => update({ status: e.target.value || undefined })} aria-label={t('admin.status')}>
            <option value="">{t('admin.allStatuses')}</option>
            {USER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`userStatus.${s}`)}
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-5">
          {users.isPending && <PageLoader />}
          {users.isError && <Alert tone="error">{errorMessage(users.error)}</Alert>}
          {users.data?.items.length === 0 && <EmptyState>{t('admin.noUsers')}</EmptyState>}
          {users.data && users.data.items.length > 0 && (
            <div className="-mx-5 overflow-x-auto sm:-mx-6">
              <table className="w-full min-w-[40rem] text-sm">
                <thead>
                  <tr className="border-b border-teal-950/8 text-start text-xs uppercase tracking-wide text-ink-500">
                    <th className="px-5 py-2 text-start font-semibold sm:px-6">{t('auth.fullName')}</th>
                    <th className="px-3 py-2 text-start font-semibold">{t('profile.roles')}</th>
                    <th className="px-3 py-2 text-start font-semibold">{t('admin.status')}</th>
                    <th className="px-5 py-2 text-start font-semibold sm:px-6">{t('admin.joined')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.data.items.map((u) => (
                    <tr key={u.id} className="border-b border-teal-950/5 last:border-0 hover:bg-sand-50">
                      <td className="px-5 py-3 sm:px-6">
                        <Link to={`/admin/users/${u.id}`} className="font-semibold text-teal-950 hover:underline">
                          {u.fullName}
                        </Link>
                        <div dir="ltr" className="text-start text-xs text-ink-500">
                          {u.email}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          {u.roles.map((r) => (
                            <Pill key={r} tone="teal">
                              {t(`roles.${r}`)}
                            </Pill>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <Pill tone={userStatusTone(u.status)}>{t(`userStatus.${u.status}`)}</Pill>
                      </td>
                      <td className="px-5 py-3 text-ink-500 sm:px-6">{formatDate(u.createdAtUtc, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-5 flex items-center justify-end gap-3">
            <Button variant="ghost" disabled={page <= 1} onClick={() => update({ page: String(page - 1) })}>
              {t('common.previous')}
            </Button>
            <span className="text-sm text-ink-500">
              {page} / {totalPages}
            </span>
            <Button variant="ghost" disabled={page >= totalPages} onClick={() => update({ page: String(page + 1) })}>
              {t('common.next')}
            </Button>
          </div>
        )}
      </Panel>
    </div>
  )
}
