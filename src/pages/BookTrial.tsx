import { useState, type FormEvent } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { Container } from '../components/layout/Container'
import { Button } from '../components/ui/Button'
import { Label, Select, TextInput } from '../components/ui/Field'
import { Reveal } from '../components/ui/Reveal'
import { CheckIcon } from '../components/ui/icons'
import { trialsApi } from '../api/endpoints'
import { useErrorMessage } from '../lib/useErrorMessage'

type Status = 'idle' | 'sending' | 'error' | 'done'

export function BookTrial() {
  const { t, td } = useI18n()
  const errorMessage = useErrorMessage()
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const howSteps = td<{ title: string; desc: string }[]>('bookTrial.how')
  const nextSteps = td<string[]>('bookTrial.next')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const field = (name: string) => String(data.get(name) ?? '').trim() || null
    setStatus('sending')
    try {
      // Saved by the API and followed up from the admin Trial requests screen.
      await trialsApi.submit({
        name: field('name') ?? '',
        email: field('email') ?? '',
        whatsApp: field('whatsapp'),
        country: field('country'),
        program: field('program'),
        preferredTime: field('preferredTime'),
      })
      setStatus('done')
    } catch (err) {
      setError(errorMessage(err))
      setStatus('error')
    }
  }

  return (
    <Container className="py-16 md:py-20">
      <Reveal className="mx-auto max-w-xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
          {t('bookTrial.kicker')}
        </span>
        <h1 className="mt-5 text-3xl font-bold text-teal-950">{t('bookTrial.title')}</h1>
        <p className="mt-3 text-sm text-ink-700">{t('bookTrial.sub')}</p>
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-5">
        <Reveal delay={100} className="lg:col-span-3">
          <div className="rounded-3xl border border-teal-950/8 bg-white p-6 shadow-sm shadow-teal-950/5 transition-shadow duration-300 hover:shadow-lg hover:shadow-teal-950/10 sm:p-8">
            {status === 'done' ? (
              <div className="py-4 text-center">
                <div className="mx-auto flex h-14 w-14 animate-[pop-in_0.4s_ease-out] items-center justify-center rounded-full bg-teal-50 text-teal-700">
                  <CheckIcon className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-teal-950">{t('bookTrial.successTitle')}</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-700">{t('bookTrial.successDesc')}</p>

                <div className="mt-6 rounded-2xl bg-teal-50 p-5 text-start">
                  <h3 className="text-sm font-bold text-teal-950">{t('bookTrial.nextTitle')}</h3>
                  <ol className="mt-3 space-y-2.5">
                    {nextSteps.map((step, i) => (
                      <li key={step} className="flex gap-3 text-sm leading-relaxed text-ink-700">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-950 text-xs font-bold text-gold-300">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <Button onClick={() => setStatus('idle')} className="mt-6">
                  {t('bookTrial.successButton')}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name">{t('bookTrial.formName')}</Label>
                  <TextInput id="name" name="name" required autoComplete="name" />
                </div>
                <div>
                  <Label htmlFor="email">{t('bookTrial.formEmail')}</Label>
                  <TextInput id="email" name="email" type="email" required autoComplete="email" dir="ltr" />
                </div>
                <div>
                  <Label htmlFor="phone">{t('bookTrial.formPhone')}</Label>
                  <TextInput
                    id="phone"
                    name="whatsapp"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+1 000 000 0000"
                    dir="ltr"
                    aria-describedby="phone-hint"
                  />
                  <p id="phone-hint" className="mt-1.5 text-xs text-ink-500">
                    {t('bookTrial.formPhoneHint')}
                  </p>
                </div>
                <div>
                  <Label htmlFor="country">{t('bookTrial.formCountry')}</Label>
                  <Select id="country" name="country" defaultValue="canada">
                    <option value="canada">{t('bookTrial.formCountryCanada')}</option>
                    <option value="uae">{t('bookTrial.formCountryUAE')}</option>
                    <option value="other">{t('bookTrial.formCountryOther')}</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="program">{t('bookTrial.formProgram')}</Label>
                  <Select id="program" name="program" defaultValue="conversational">
                    <option value="conversational">{t('bookTrial.formProgramConversational')}</option>
                    <option value="igcse">{t('bookTrial.formProgramIGCSE')}</option>
                    <option value="uae-curriculum">{t('bookTrial.formProgramUAE')}</option>
                    <option value="unsure">{t('bookTrial.formProgramUnsure')}</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="time">{t('bookTrial.formTime')}</Label>
                  <Select id="time" name="preferredTime" defaultValue="evening">
                    <option value="morning">{t('bookTrial.formTimeMorning')}</option>
                    <option value="afternoon">{t('bookTrial.formTimeAfternoon')}</option>
                    <option value="evening">{t('bookTrial.formTimeEvening')}</option>
                  </Select>
                </div>
                {status === 'error' && (
                  <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                    {error ?? t('common.errorTryAgain')}
                  </p>
                )}
                <Button type="submit" size="lg" className="w-full justify-center" disabled={status === 'sending'}>
                  {status === 'sending' ? t('common.sending') : t('bookTrial.formSubmit')}
                </Button>
              </form>
            )}
          </div>
        </Reveal>

        <Reveal delay={200} className="lg:col-span-2">
          <h2 className="text-lg font-bold text-teal-950">{t('bookTrial.howTitle')}</h2>
          <ol className="mt-5 space-y-5">
            {howSteps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-950 text-sm font-bold text-gold-300">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-teal-950">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-700">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Container>
  )
}
