import { useState, type FormEvent } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { Container } from '../components/layout/Container'
import { Button } from '../components/ui/Button'
import { Label, TextArea, TextInput } from '../components/ui/Field'
import { Reveal } from '../components/ui/Reveal'
import { WhatsAppIcon, MailIcon, InstagramIcon, FacebookIcon, YoutubeIcon, CheckIcon } from '../components/ui/icons'

const socials = [
  { label: 'Instagram', Icon: InstagramIcon },
  { label: 'Facebook', Icon: FacebookIcon },
  { label: 'YouTube', Icon: YoutubeIcon },
]

export function Contact() {
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
          {t('contact.kicker')}
        </span>
        <h1 className="mt-5 text-3xl font-bold text-teal-950">{t('contact.title')}</h1>
        <p className="mt-3 text-sm text-ink-700">{t('contact.sub')}</p>
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-5">
        <Reveal delay={80} className="md:col-span-3">
          <div className="rounded-3xl border border-teal-950/8 bg-white p-6 shadow-sm shadow-teal-950/5 sm:p-8">
            {submitted ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-14 w-14 animate-[pop-in_0.4s_ease-out] items-center justify-center rounded-full bg-teal-50 text-teal-700">
                  <CheckIcon className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-teal-950">{t('contact.successTitle')}</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-700">{t('contact.successDesc')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="c-name">{t('contact.formName')}</Label>
                  <TextInput id="c-name" required placeholder="Jane Doe" />
                </div>
                <div>
                  <Label htmlFor="c-email">{t('contact.formEmail')}</Label>
                  <TextInput id="c-email" type="email" required placeholder="jane@example.com" />
                </div>
                <div>
                  <Label htmlFor="c-message">{t('contact.formMessage')}</Label>
                  <TextArea id="c-message" required rows={5} placeholder="How can we help?" />
                </div>
                <Button type="submit" size="lg" className="w-full justify-center">
                  {t('contact.formSubmit')}
                </Button>
              </form>
            )}
          </div>
        </Reveal>

        <Reveal delay={160} className="flex flex-col gap-5 md:col-span-2">
          <a
            href="https://wa.me/10000000000"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-teal-950/8 bg-white p-5 shadow-sm shadow-teal-950/5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-teal-600/25 hover:shadow-lg hover:shadow-teal-950/10"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-700 transition-all duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-teal-700 group-hover:text-white">
              <WhatsAppIcon className="h-5 w-5" />
            </span>
            <div>
              <div className="font-semibold text-teal-950">{t('contact.whatsapp')}</div>
              <div dir="ltr" className="text-start text-xs text-ink-500">
                +1 (000) 000-0000
              </div>
            </div>
          </a>

          <a
            href="mailto:hello@alhuda.example"
            className="group flex items-center gap-3 rounded-2xl border border-teal-950/8 bg-white p-5 shadow-sm shadow-teal-950/5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-teal-600/25 hover:shadow-lg hover:shadow-teal-950/10"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-700 transition-all duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-teal-700 group-hover:text-white">
              <MailIcon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">{t('contact.emailLabel')}</div>
              <div className="font-semibold text-teal-950">hello@alhuda.example</div>
            </div>
          </a>

          <div className="rounded-2xl border border-teal-950/8 bg-white p-5 shadow-sm shadow-teal-950/5">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">{t('contact.socialTitle')}</div>
            <div className="mt-3 flex gap-2">
              {socials.map(({ label, Icon }) => (
                <span
                  key={label}
                  title={label}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-teal-50 text-teal-700 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 hover:bg-teal-700 hover:text-white"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Container>
  )
}
