import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import type { Role } from '../../api/types'
import { useAuth } from '../../auth/AuthContext'
import { useI18n } from '../../i18n/I18nContext'
import { Container } from '../layout/Container'
import { ResendVerificationButton } from '../auth/ResendVerificationButton'
import { Alert } from '../ui/Alert'

interface NavGroup {
  key: string
  roles?: Role[]
  items: { to: string; key: string; roles?: Role[]; end?: boolean }[]
}

const groups: NavGroup[] = [
  {
    key: 'dashboard.groupAccount',
    items: [
      { to: '/account', key: 'dashboard.navProfile', end: true },
      { to: '/account/classes', key: 'dashboard.navClasses', roles: ['Student'] },
      { to: '/account/billing', key: 'dashboard.navBilling', roles: ['Student'] },
    ],
  },
  {
    key: 'dashboard.groupTeaching',
    roles: ['TA'],
    items: [
      { to: '/ta/courses', key: 'dashboard.navCourses' },
      { to: '/ta/offerings', key: 'dashboard.navOfferings' },
      { to: '/ta/sessions', key: 'dashboard.navSessions' },
      { to: '/ta/students', key: 'dashboard.navStudents' },
      { to: '/ta/earnings', key: 'dashboard.navEarnings' },
    ],
  },
  {
    key: 'dashboard.groupAdmin',
    roles: ['Admin'],
    items: [
      { to: '/admin/users', key: 'dashboard.navUsers' },
      { to: '/admin/programs', key: 'dashboard.navPrograms' },
      { to: '/admin/offerings', key: 'dashboard.navAllOfferings' },
      { to: '/admin/trials', key: 'dashboard.navTrials' },
      { to: '/admin/payments', key: 'dashboard.navPayments' },
      { to: '/admin/zoom', key: 'dashboard.navZoom' },
    ],
  },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-teal-950 text-white' : 'text-ink-700 hover:bg-teal-950/5 hover:text-teal-950'
  }`

export function DashboardLayout() {
  const { t } = useI18n()
  const { user, hasRole, logout } = useAuth()
  const navigate = useNavigate()

  const visibleGroups = groups
    .filter((group) => !group.roles || hasRole(...group.roles))
    .map((group) => ({ ...group, items: group.items.filter((item) => !item.roles || hasRole(...item.roles)) }))

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <Container className="py-8 md:py-12">
      <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
        <aside>
          <div className="rounded-2xl border border-teal-950/8 bg-white p-4 shadow-sm shadow-teal-950/5">
            <div className="border-b border-teal-950/8 pb-3">
              <div className="truncate font-semibold text-teal-950">{user?.fullName}</div>
              <div dir="ltr" className="truncate text-start text-xs text-ink-500">
                {user?.email}
              </div>
            </div>
            <nav className="mt-3 flex gap-4 overflow-x-auto lg:flex-col lg:overflow-visible">
              {visibleGroups.map((group) => (
                <div key={group.key} className="flex shrink-0 gap-1 lg:flex-col">
                  <div className="hidden px-3.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-ink-500 lg:block">
                    {t(group.key)}
                  </div>
                  {group.items.map((item) => (
                    <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                      {t(item.key)}
                    </NavLink>
                  ))}
                </div>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="mt-3 w-full rounded-xl border border-teal-950/15 px-3.5 py-2 text-sm font-semibold text-teal-950 transition-colors hover:bg-teal-950/5"
            >
              {t('auth.logout')}
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          {user && !user.emailVerified && (
            <Alert tone="warning" className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <span>{t('dashboard.verifyEmailBanner')}</span>
              <ResendVerificationButton email={user.email} />
            </Alert>
          )}
          <Outlet />
        </div>
      </div>
    </Container>
  )
}
