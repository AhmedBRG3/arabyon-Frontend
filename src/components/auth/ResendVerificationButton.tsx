import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../api/endpoints'
import { useI18n } from '../../i18n/I18nContext'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { Button } from '../ui/Button'

const COOLDOWN_SECONDS = 30

/**
 * Resends the verification email for `email`. The API gives the same 202 response whether or not the
 * account exists or is already verified (see AuthService.ResendVerificationEmailAsync), so this button
 * can't tell success from "nothing to send" — it just confirms the request went through, and a short
 * cooldown stops repeat clicks from eating into the shared auth rate limit.
 */
export function ResendVerificationButton({ email, variant = 'ghost' }: { email: string; variant?: 'ghost' | 'primary' }) {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const [cooldown, setCooldown] = useState(0)

  const resend = useMutation({
    mutationFn: () => authApi.resendVerification(email),
    onSuccess: () => setCooldown(COOLDOWN_SECONDS),
  })

  useEffect(() => {
    if (cooldown <= 0) return
    const id = setInterval(() => setCooldown((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [cooldown])

  const label =
    cooldown > 0
      ? t('auth.resendSent').replace('{seconds}', String(cooldown))
      : resend.isPending
        ? t('common.sending')
        : t('auth.resendVerification')

  return (
    <div>
      <Button type="button" variant={variant} disabled={resend.isPending || cooldown > 0} onClick={() => resend.mutate()}>
        {label}
      </Button>
      {resend.isError && <p className="mt-2 text-xs text-red-700">{errorMessage(resend.error)}</p>}
    </div>
  )
}
