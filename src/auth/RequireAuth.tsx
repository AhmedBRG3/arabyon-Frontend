import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { Role } from '../api/types'
import { useI18n } from '../i18n/I18nContext'
import { Container } from '../components/layout/Container'
import { Button } from '../components/ui/Button'
import { PageLoader } from '../components/ui/Spinner'
import { useAuth } from './AuthContext'

/**
 * Guards a route (or a layout route via <Outlet/>). The API enforces roles too — this only
 * keeps people out of screens whose every call would fail.
 */
export function RequireAuth({ roles, children }: { roles?: Role[]; children?: ReactNode }) {
  const { status, hasRole } = useAuth()
  const { t } = useI18n()
  const location = useLocation()

  if (status === 'loading') return <PageLoader />
  if (status === 'anonymous') {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?next=${next}`} replace />
  }
  if (roles && !hasRole(...roles)) {
    return (
      <Container className="py-24 text-center">
        <h1 className="text-2xl font-bold text-teal-950">{t('errors.forbiddenTitle')}</h1>
        <p className="mt-3 text-sm text-ink-500">{t('errors.forbidden')}</p>
        <Button to="/account" variant="ghost" className="mt-6">
          {t('dashboard.backToAccount')}
        </Button>
      </Container>
    )
  }
  return <>{children ?? <Outlet />}</>
}
