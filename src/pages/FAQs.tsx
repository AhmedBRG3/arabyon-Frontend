import { useI18n } from '../i18n/I18nContext'
import { Container } from '../components/layout/Container'
import { Accordion } from '../components/ui/Accordion'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'

export function FAQs() {
  const { t, td } = useI18n()
  const items = td<{ q: string; a: string }[]>('faqs.items')

  return (
    <Container className="py-16 md:py-20">
      <Reveal className="mx-auto max-w-xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
          {t('faqs.kicker')}
        </span>
        <h1 className="mt-5 text-3xl font-bold text-teal-950">{t('faqs.title')}</h1>
        <p className="mt-3 text-sm text-ink-700">{t('faqs.sub')}</p>
      </Reveal>

      <Reveal delay={100} className="mx-auto mt-10 max-w-2xl">
        <Accordion items={items} />
        <div className="mt-8 text-center">
          <Button to="/book-trial">{t('common.bookFreeTrial')}</Button>
        </div>
      </Reveal>
    </Container>
  )
}
