import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { homeFor, safeNext } from '../../auth/redirects'
import { useI18n } from '../../i18n/I18nContext'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { AuthCard, authLinkClass } from '../../components/auth/AuthCard'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Label, TextInput } from '../../components/ui/Field'

export function Login() {
  const { t } = useI18n()
  const { status, user, login } = useAuth()
  const errorMessage = useErrorMessage()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (status === 'authenticated' && user && !sending) return <Navigate to={next ?? homeFor(user)} replace />

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setSending(true)
    setError(null)
    try {
      const me = await login(String(data.get('email')), String(data.get('password')))
      navigate(next ?? homeFor(me), { replace: true })
    } catch (err) {
      setError(errorMessage(err))
      setSending(false)
    }
  }

  return (
    <AuthCard
      title={t('auth.loginTitle')}
      sub={t('auth.loginSub')}
      footer={
        <>
          {t('auth.noAccount')}{' '}
          <Link to={`/register${next ? `?next=${encodeURIComponent(next)}` : ''}`} className={authLinkClass}>
            {t('auth.registerLink')}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="email">{t('auth.email')}</Label>
          <TextInput id="email" name="email" type="email" required autoComplete="email" dir="ltr" />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Link to="/forgot-password" className="text-xs font-semibold text-teal-700 hover:underline">
              {t('auth.forgotLink')}
            </Link>
          </div>
          <TextInput id="password" name="password" type="password" required autoComplete="current-password" dir="ltr" />
        </div>
        {error && <Alert tone="error">{error}</Alert>}
        <Button type="submit" size="lg" className="w-full justify-center" disabled={sending}>
          {sending ? t('common.sending') : t('auth.loginSubmit')}
        </Button>
      </form>
    </AuthCard>
  )
}
