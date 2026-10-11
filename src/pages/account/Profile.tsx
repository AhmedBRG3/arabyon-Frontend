import { useState, type FormEvent, type ReactNode } from 'react'
import { authApi, usersApi } from '../../api/endpoints'
import { setAccessToken } from '../../api/client'
import type { UserProfile } from '../../api/types'
import { useAuth } from '../../auth/AuthContext'
import { useI18n } from '../../i18n/I18nContext'
import { formatDate } from '../../lib/format'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { PageHeader, Panel } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Label, TextArea, TextInput } from '../../components/ui/Field'
import { Pill } from '../../components/ui/Pill'
import { MIN_PASSWORD_LENGTH } from '../auth/Register'

type SaveState = { status: 'idle' | 'saving' | 'saved' } | { status: 'error'; message: string }

/** Shared submit/feedback handling for the independent forms on this page. */
function useSave() {
  const errorMessage = useErrorMessage()
  const [state, setState] = useState<SaveState>({ status: 'idle' })

  const run = async (action: () => Promise<void>) => {
    setState({ status: 'saving' })
    try {
      await action()
      setState({ status: 'saved' })
    } catch (err) {
      setState({ status: 'error', message: errorMessage(err) })
    }
  }
  return { state, run, fail: (message: string) => setState({ status: 'error', message }) }
}

function FormFooter({ state, label }: { state: SaveState; label: string }) {
  const { t } = useI18n()
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="submit" disabled={state.status === 'saving'}>
        {state.status === 'saving' ? t('common.saving') : label}
      </Button>
      {state.status === 'saved' && <span className="text-sm font-medium text-teal-700">{t('common.saved')}</span>}
      {state.status === 'error' && <Alert tone="error" className="w-full">{state.message}</Alert>}
    </div>
  )
}

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}

export function Profile() {
  const { t, locale } = useI18n()
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="space-y-6">
      <PageHeader title={t('profile.title')} description={t('profile.sub')} />

      <Panel>
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">{t('auth.email')}</dt>
            <dd dir="ltr" className="mt-1 text-start font-medium text-teal-950">
              {user.email}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">{t('profile.roles')}</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {user.roles.map((role) => (
                <Pill key={role} tone="teal">
                  {t(`roles.${role}`)}
                </Pill>
              ))}
              {!user.emailVerified && <Pill tone="gold">{t('profile.unverified')}</Pill>}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">{t('profile.memberSince')}</dt>
            <dd className="mt-1 font-medium text-teal-950">{formatDate(user.createdAtUtc, locale)}</dd>
          </div>
        </dl>
      </Panel>

      <NameForm user={user} />
      {user.roles.includes('Student') && <StudentForm user={user} />}
      {user.roles.includes('TA') && <TutorForm user={user} />}
      <PasswordForm />
    </div>
  )
}

function NameForm({ user }: { user: UserProfile }) {
  const { t } = useI18n()
  const { setUser } = useAuth()
  const { state, run } = useSave()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fullName = String(new FormData(e.currentTarget).get('fullName')).trim()
    run(async () => setUser(await usersApi.updateMe(fullName)))
  }

  return (
    <Panel title={t('profile.basicTitle')}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field id="fullName" label={t('auth.fullName')}>
          <TextInput id="fullName" name="fullName" required maxLength={200} defaultValue={user.fullName} autoComplete="name" />
        </Field>
        <FormFooter state={state} label={t('common.save')} />
      </form>
    </Panel>
  )
}

function StudentForm({ user }: { user: UserProfile }) {
  const { t } = useI18n()
  const { setUser } = useAuth()
  const { state, run } = useSave()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const value = (key: string) => String(data.get(key)).trim() || null
    run(async () =>
      setUser(await usersApi.updateStudentProfile({ phoneNumber: value('phoneNumber'), gradeLevel: value('gradeLevel') })),
    )
  }

  return (
    <Panel title={t('profile.studentTitle')}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="phoneNumber" label={t('bookTrial.formPhone')}>
            <TextInput
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              maxLength={32}
              dir="ltr"
              placeholder="+1 000 000 0000"
              defaultValue={user.studentProfile?.phoneNumber ?? ''}
              autoComplete="tel"
            />
          </Field>
          <Field id="gradeLevel" label={t('profile.gradeLevel')}>
            <TextInput id="gradeLevel" name="gradeLevel" maxLength={64} defaultValue={user.studentProfile?.gradeLevel ?? ''} />
          </Field>
        </div>
        <FormFooter state={state} label={t('common.save')} />
      </form>
    </Panel>
  )
}

function TutorForm({ user }: { user: UserProfile }) {
  const { t } = useI18n()
  const { setUser } = useAuth()
  const { state, run } = useSave()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const subjects = String(data.get('subjects'))
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    run(async () => setUser(await usersApi.updateTAProfile({ bio: String(data.get('bio')).trim() || null, subjects })))
  }

  return (
    <Panel title={t('profile.tutorTitle')}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field id="bio" label={t('profile.bio')}>
          <TextArea id="bio" name="bio" rows={5} maxLength={2000} defaultValue={user.taProfile?.bio ?? ''} />
          <p className="mt-1.5 text-xs text-ink-500">{t('profile.bioHint')}</p>
        </Field>
        <Field id="subjects" label={t('profile.subjects')}>
          <TextInput id="subjects" name="subjects" defaultValue={user.taProfile?.subjects.join(', ') ?? ''} />
          <p className="mt-1.5 text-xs text-ink-500">{t('profile.subjectsHint')}</p>
        </Field>
        <FormFooter state={state} label={t('common.save')} />
      </form>
    </Panel>
  )
}

function PasswordForm() {
  const { t } = useI18n()
  const { state, run, fail } = useSave()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    if (data.get('newPassword') !== data.get('confirm')) {
      fail(t('auth.passwordMismatch'))
      return
    }
    run(async () => {
      // The API signs out every other device and returns fresh tokens for this one.
      const token = await authApi.changePassword({
        currentPassword: String(data.get('currentPassword')),
        newPassword: String(data.get('newPassword')),
      })
      setAccessToken(token)
      form.reset()
    })
  }

  return (
    <Panel title={t('profile.passwordTitle')}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field id="currentPassword" label={t('profile.currentPassword')}>
          <TextInput id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" dir="ltr" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="newPassword" label={t('auth.newPassword')}>
            <TextInput
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              maxLength={128}
              autoComplete="new-password"
              dir="ltr"
            />
          </Field>
          <Field id="confirm" label={t('auth.confirmPassword')}>
            <TextInput id="confirm" name="confirm" type="password" required autoComplete="new-password" dir="ltr" />
          </Field>
        </div>
        <p className="text-xs text-ink-500">{t('profile.passwordNote')}</p>
        <FormFooter state={state} label={t('profile.passwordSubmit')} />
      </form>
    </Panel>
  )
}
