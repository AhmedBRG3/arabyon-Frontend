import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nContext'
import { Container } from '../components/layout/Container'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PlaceholderBadge } from '../components/ui/PlaceholderBadge'
import { Reveal } from '../components/ui/Reveal'
import { CountUp } from '../components/ui/CountUp'
import { IconBadge } from '../components/ui/IconBadge'
import { SpeakIcon, CapIcon, EyeIcon, CompassIcon } from '../components/ui/icons'
import { testimonials } from '../data/mockTestimonials'

const stats = [
  { valueKey: 'home.statStudents', labelKey: 'home.statStudentsLabel' },
  { valueKey: 'home.statCountries', labelKey: 'home.statCountriesLabel' },
  { valueKey: 'home.statRating', labelKey: 'home.statRatingLabel' },
  { valueKey: 'home.statTutors', labelKey: 'home.statTutorsLabel' },
]

export function Home() {
  const { t, locale } = useI18n()

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-teal-950">
        <div className="animate-float pointer-events-none absolute -end-32 -top-32 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="animate-float-slow pointer-events-none absolute -start-24 bottom-0 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
        <Container className="relative py-20 md:py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold-300 transition-colors duration-300 hover:border-gold-400/60">
              {t('home.heroKicker')}
            </span>
            <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              {t('home.heroHeadline')}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-teal-100/85 md:text-lg">
              {t('home.heroSub')}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button to="/book-trial" size="lg">
                {t('home.heroCtaPrimary')}
              </Button>
              <Button
                to="/programs/conversational"
                size="lg"
                variant="ghost"
                className="!border-white/20 !text-white hover:!bg-white/10"
              >
                {t('home.heroCtaSecondary')}
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal delay={80}>
              <Card hoverable className="group h-full">
                <IconBadge tone="teal">
                  <EyeIcon className="h-6 w-6" />
                </IconBadge>
                <h2 className="mt-5 text-xl font-bold text-teal-950">{t('home.visionTitle')}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">{t('home.visionText')}</p>
              </Card>
            </Reveal>
            <Reveal delay={160}>
              <Card hoverable className="group h-full">
                <IconBadge tone="gold">
                  <CompassIcon className="h-6 w-6" />
                </IconBadge>
                <h2 className="mt-5 text-xl font-bold text-teal-950">{t('home.missionTitle')}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">{t('home.missionText')}</p>
              </Card>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Audience entry points */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-center text-2xl font-bold text-teal-950 sm:text-3xl">
              {t('home.audienceTitle')}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Reveal delay={80}>
              <Link
                to="/programs/conversational"
                className="group relative block overflow-hidden rounded-3xl border border-teal-950/8 bg-white p-8 shadow-sm shadow-teal-950/5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-teal-600/25 hover:shadow-xl hover:shadow-teal-950/10"
              >
                <IconBadge tone="teal">
                  <SpeakIcon className="h-6 w-6" />
                </IconBadge>
                <h3 className="mt-5 text-xl font-bold text-teal-950">{t('home.audienceSpeakTitle')}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">{t('home.audienceSpeakDesc')}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 transition-all group-hover:gap-2.5">
                  {t('common.learnMore')} <span aria-hidden>{locale === 'ar' ? '←' : '→'}</span>
                </span>
              </Link>
            </Reveal>

            <Reveal delay={160}>
              <Link
                to="/programs/igcse"
                className="group relative block overflow-hidden rounded-3xl border border-teal-950/8 bg-white p-8 shadow-sm shadow-teal-950/5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-gold-500/30 hover:shadow-xl hover:shadow-teal-950/10"
              >
                <IconBadge tone="gold">
                  <CapIcon className="h-6 w-6" />
                </IconBadge>
                <h3 className="mt-5 text-xl font-bold text-teal-950">{t('home.audienceIgcseTitle')}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">{t('home.audienceIgcseDesc')}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 transition-all group-hover:gap-2.5">
                  {t('common.learnMore')} <span aria-hidden>{locale === 'ar' ? '←' : '→'}</span>
                </span>
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Trust / stats */}
      <section className="bg-teal-50 py-16 md:py-20">
        <Container>
          <Reveal>
            <h2 className="text-center text-xl font-bold text-teal-950 sm:text-2xl">{t('home.trustTitle')}</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.labelKey} delay={i * 80} className="text-center">
                <div className="font-display text-3xl font-bold text-teal-950 sm:text-4xl">
                  <CountUp value={t(stat.valueKey)} />
                </div>
                <div className="mt-1 text-xs font-medium text-ink-700 sm:text-sm">{t(stat.labelKey)}</div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((item, i) => (
              <Reveal key={item.initials} delay={i * 100}>
                <Card hoverable className="relative h-full">
                  <PlaceholderBadge className="absolute -top-3 end-4" />
                  <p className="text-sm leading-relaxed text-ink-700">&ldquo;{item.quote[locale]}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-950 text-xs font-bold text-gold-300">
                      {item.initials}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-teal-950">{item.name[locale]}</div>
                      <div className="text-xs text-ink-500">
                        {item.location[locale]} · {item.program[locale]}
                      </div>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Program highlights */}
      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-teal-950 sm:text-3xl">{t('home.programsTitle')}</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Reveal delay={80}>
              <Card hoverable className="flex h-full flex-col">
                <span className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                  {t('programs.conversational.kicker')}
                </span>
                <h3 className="mt-2 text-lg font-bold text-teal-950">{t('programs.conversational.title')}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">{t('programs.conversational.sub')}</p>
                <Button to="/programs/conversational" variant="secondary" className="mt-6 self-start">
                  {t('common.learnMore')}
                </Button>
              </Card>
            </Reveal>
            <Reveal delay={160}>
              <Card hoverable className="flex h-full flex-col">
                <span className="text-xs font-semibold uppercase tracking-wide text-gold-600">
                  {t('programs.igcse.kicker')}
                </span>
                <h3 className="mt-2 text-lg font-bold text-teal-950">{t('programs.igcse.title')}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">{t('programs.igcse.sub')}</p>
                <Button to="/programs/igcse" variant="secondary" className="mt-6 self-start">
                  {t('common.learnMore')}
                </Button>
              </Card>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* CTA banner */}
      <section className="pb-20 md:pb-28">
        <Container>
          <Reveal>
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 to-teal-950 px-8 py-14 text-center transition-shadow duration-500 hover:shadow-2xl hover:shadow-teal-950/30 md:px-16 md:py-16">
              <div className="animate-float pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-gold-500/20 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />
              <h2 className="text-2xl font-bold text-white sm:text-3xl">{t('home.ctaBannerTitle')}</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-teal-100/85 md:text-base">{t('home.ctaBannerDesc')}</p>
              <Button to="/book-trial" size="lg" className="mt-7">
                {t('home.ctaBannerButton')}
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  )
}
