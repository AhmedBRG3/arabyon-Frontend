import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { authApi } from '../../api/endpoints'
import { useI18n } from '../../i18n/I18nContext'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { AuthCard, authLinkClass } from '../../components/auth/AuthCard'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Label, TextInput } from '../../components/ui/Field'
import { MIN_PASSWORD_LENGTH } from './Register'

export function ResetPassword() {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const [params] = useSearchParams()
  const token = params.get('token')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (data.get('password') !== data.get('confirm')) {
      setError(t('auth.passwordMismatch'))
      return
    }
    setSending(true)
    setError(null)
    try {
      await authApi.resetPassword({ token: token!, newPassword: String(data.get('password')) })
      setDone(true)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <AuthCard
      title={t('auth.resetTitle')}
      footer={
        <Link to="/login" className={authLinkClass}>
          {t('auth.backToLogin')}
        </Link>
      }
    >
      {!token ? (
        <Alert tone="error">{t('errors.invalidToken')}</Alert>
      ) : done ? (
        <>
          <Alert tone="success">{t('auth.resetDone')}</Alert>
          <Button to="/login" className="mt-6">
            {t('auth.loginSubmit')}
          </Button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="password">{t('auth.newPassword')}</Label>
            <TextInput
              id="password"
              name="password"
              type="password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              maxLength={128}
              autoComplete="new-password"
              dir="ltr"
            />
            <p className="mt-1.5 text-xs text-ink-500">{t('auth.passwordHint')}</p>
          </div>
          <div>
            <Label htmlFor="confirm">{t('auth.confirmPassword')}</Label>
            <TextInput id="confirm" name="confirm" type="password" required autoComplete="new-password" dir="ltr" />
          </div>
          {error && <Alert tone="error">{error}</Alert>}
          <Button type="submit" size="lg" className="w-full justify-center" disabled={sending}>
            {sending ? t('common.sending') : t('auth.resetSubmit')}
          </Button>
        </form>
      )}
    </AuthCard>
  )
}
