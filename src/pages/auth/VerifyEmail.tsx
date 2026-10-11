import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { authApi } from '../../api/endpoints'
import { useAuth } from '../../auth/AuthContext'
import { useI18n } from '../../i18n/I18nContext'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { AuthCard } from '../../components/auth/AuthCard'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'

export function VerifyEmail() {
  const { t } = useI18n()
  const { status: authStatus, reloadUser } = useAuth()
  const errorMessage = useErrorMessage()
  const [params] = useSearchParams()
  const token = params.get('token')
  const [state, setState] = useState<'verifying' | 'done' | 'error'>(token ? 'verifying' : 'error')
  const [error, setError] = useState<string>(() => (token ? '' : t('errors.invalidToken')))
  // Verification tokens are single-use, so StrictMode's double effect must not send it twice.
  const sent = useRef(false)

  useEffect(() => {
    if (!token || sent.current) return
    sent.current = true
    authApi
      .verifyEmail(token)
      .then(() => {
        setState('done')
        if (authStatus === 'authenticated') reloadUser().catch(() => {})
      })
      .catch((err) => {
        setError(errorMessage(err))
        setState('error')
      })
  }, [token, authStatus, reloadUser, errorMessage])

  return (
    <AuthCard title={t('auth.verifyTitle')}>
      {state === 'verifying' && (
        <div className="flex items-center gap-3 text-sm text-ink-700">
          <Spinner className="h-5 w-5" /> {t('auth.verifying')}
        </div>
      )}
      {state === 'done' && (
        <>
          <Alert tone="success">{t('auth.verifyDone')}</Alert>
          <Button to={authStatus === 'authenticated' ? '/account' : '/login'} className="mt-6">
            {authStatus === 'authenticated' ? t('dashboard.backToAccount') : t('auth.loginSubmit')}
          </Button>
        </>
      )}
      {state === 'error' && <Alert tone="error">{error}</Alert>}
    </AuthCard>
  )
}
