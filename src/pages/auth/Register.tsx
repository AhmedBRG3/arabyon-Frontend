import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../../api/endpoints'
import { useI18n } from '../../i18n/I18nContext'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { AuthCard, authLinkClass } from '../../components/auth/AuthCard'
import { ResendVerificationButton } from '../../components/auth/ResendVerificationButton'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Label, TextInput } from '../../components/ui/Field'
import { CheckIcon } from '../../components/ui/icons'

export const MIN_PASSWORD_LENGTH = 8

export function Register() {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (data.get('password') !== data.get('confirm')) {
      setError(t('auth.passwordMismatch'))
      return
    }
    setSending(true)
    setError(null)
    const email = String(data.get('email')).trim()
    try {
      await authApi.register({
        fullName: String(data.get('fullName')).trim(),
        email,
        password: String(data.get('password')),
      })
      setRegisteredEmail(email)
      setDone(true)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <AuthCard title={t('auth.registerDoneTitle')}>
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 animate-[pop-in_0.4s_ease-out] items-center justify-center rounded-full bg-teal-50 text-teal-700">
            <CheckIcon className="h-7 w-7" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-700">{t('auth.registerDoneDesc')}</p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <Button to="/login">{t('auth.loginSubmit')}</Button>
            <ResendVerificationButton email={registeredEmail} />
          </div>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title={t('auth.registerTitle')}
      sub={t('auth.registerSub')}
      footer={
        <>
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className={authLinkClass}>
            {t('auth.loginLink')}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="fullName">{t('auth.fullName')}</Label>
          <TextInput id="fullName" name="fullName" required maxLength={200} autoComplete="name" />
        </div>
        <div>
          <Label htmlFor="email">{t('auth.email')}</Label>
          <TextInput id="email" name="email" type="email" required maxLength={256} autoComplete="email" dir="ltr" />
        </div>
        <div>
          <Label htmlFor="password">{t('auth.password')}</Label>
          <TextInput
            id="password"
            name="password"
            type="password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            maxLength={128}
            autoComplete="new-password"
            dir="ltr"
            aria-describedby="password-hint"
          />
          <p id="password-hint" className="mt-1.5 text-xs text-ink-500">
            {t('auth.passwordHint')}
          </p>
        </div>
        <div>
          <Label htmlFor="confirm">{t('auth.confirmPassword')}</Label>
          <TextInput id="confirm" name="confirm" type="password" required autoComplete="new-password" dir="ltr" />
        </div>
        {error && <Alert tone="error">{error}</Alert>}
        <Button type="submit" size="lg" className="w-full justify-center" disabled={sending}>
          {sending ? t('common.sending') : t('auth.registerSubmit')}
        </Button>
      </form>
    </AuthCard>
  )
}
