import { useState, type FormEvent } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { Container } from '../components/layout/Container'
import { Button } from '../components/ui/Button'
import { Label, Select, TextInput } from '../components/ui/Field'
import { PlaceholderBadge } from '../components/ui/PlaceholderBadge'
import { Reveal } from '../components/ui/Reveal'
import { CheckIcon } from '../components/ui/icons'

export function BookTrial() {
  const { t } = useI18n()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
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

      <Reveal delay={100} className="relative mx-auto mt-10 max-w-xl">
        <PlaceholderBadge className="absolute -top-3 end-4 z-10" />
        <div className="rounded-3xl border border-teal-950/8 bg-white p-6 shadow-sm shadow-teal-950/5 transition-shadow duration-300 hover:shadow-lg hover:shadow-teal-950/10 sm:p-8">
          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-14 w-14 animate-[pop-in_0.4s_ease-out] items-center justify-center rounded-full bg-teal-50 text-teal-700">
                <CheckIcon className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-teal-950">{t('bookTrial.successTitle')}</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-700">{t('bookTrial.successDesc')}</p>
              <Button onClick={() => setSubmitted(false)} className="mt-6">
                {t('bookTrial.successButton')}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name">{t('bookTrial.formName')}</Label>
                <TextInput id="name" required placeholder="Jane Doe" />
              </div>
              <div>
                <Label htmlFor="email">{t('bookTrial.formEmail')}</Label>
                <TextInput id="email" type="email" required placeholder="jane@example.com" />
              </div>
              <div>
                <Label htmlFor="country">{t('bookTrial.formCountry')}</Label>
                <Select id="country" defaultValue="canada">
                  <option value="canada">{t('bookTrial.formCountryCanada')}</option>
                  <option value="uae">{t('bookTrial.formCountryUAE')}</option>
                  <option value="other">{t('bookTrial.formCountryOther')}</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="program">{t('bookTrial.formProgram')}</Label>
                <Select id="program" defaultValue="conversational">
                  <option value="conversational">{t('bookTrial.formProgramConversational')}</option>
                  <option value="igcse">{t('bookTrial.formProgramIGCSE')}</option>
                  <option value="unsure">{t('bookTrial.formProgramUnsure')}</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="time">{t('bookTrial.formTime')}</Label>
                <Select id="time" defaultValue="evening">
                  <option value="morning">{t('bookTrial.formTimeMorning')}</option>
                  <option value="afternoon">{t('bookTrial.formTimeAfternoon')}</option>
                  <option value="evening">{t('bookTrial.formTimeEvening')}</option>
                </Select>
              </div>
              <Button type="submit" size="lg" className="w-full justify-center">
                {t('bookTrial.formSubmit')}
              </Button>
            </form>
          )}
        </div>
      </Reveal>
    </Container>
  )
}
