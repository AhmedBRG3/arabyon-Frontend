import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../../api/endpoints'
import { useI18n } from '../../i18n/I18nContext'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { AuthCard, authLinkClass } from '../../components/auth/AuthCard'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Label, TextInput } from '../../components/ui/Field'

export function ForgotPassword() {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = String(new FormData(e.currentTarget).get('email')).trim()
    setSending(true)
    setError(null)
    try {
      await authApi.forgotPassword(email)
      setDone(true)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <AuthCard
      title={t('auth.forgotTitle')}
      sub={t('auth.forgotSub')}
      footer={
        <Link to="/login" className={authLinkClass}>
          {t('auth.backToLogin')}
        </Link>
      }
    >
      {done ? (
        // Same message whether or not the account exists — the API doesn't reveal it either.
        <Alert tone="success">{t('auth.forgotDone')}</Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email">{t('auth.email')}</Label>
            <TextInput id="email" name="email" type="email" required autoComplete="email" dir="ltr" />
          </div>
          {error && <Alert tone="error">{error}</Alert>}
          <Button type="submit" size="lg" className="w-full justify-center" disabled={sending}>
            {sending ? t('common.sending') : t('auth.forgotSubmit')}
          </Button>
        </form>
      )}
    </AuthCard>
  )
}
