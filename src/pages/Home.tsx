import { useI18n } from '../i18n/I18nContext'
import { Container } from '../components/layout/Container'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { CountUp } from '../components/ui/CountUp'
import { HomeHero } from '../components/sections/HomeHero'
import { MissionVisionStory } from '../components/sections/MissionVisionStory'
import { AudienceStory } from '../components/sections/AudienceStory'
import { TestimonialsStory } from '../components/sections/TestimonialsStory'
import { ProgramsStory } from '../components/sections/ProgramsStory'

const stats = [
  { valueKey: 'home.statStudents', labelKey: 'home.statStudentsLabel' },
  { valueKey: 'home.statCountries', labelKey: 'home.statCountriesLabel' },
  { valueKey: 'home.statRating', labelKey: 'home.statRatingLabel' },
  { valueKey: 'home.statTutors', labelKey: 'home.statTutorsLabel' },
]

export function Home() {
  const { t } = useI18n()

  return (
    <div>
      {/* Hero */}
      <HomeHero />

      {/* Vision & Mission — cinematic scroll-pinned story */}
      <MissionVisionStory />

      {/* Audience entry points — cinematic scroll-pinned story */}
      <section className="pt-16 md:pt-24">
        <Container>
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-center text-2xl font-bold text-teal-950 sm:text-3xl">
              {t('home.audienceTitle')}
            </h2>
          </Reveal>
        </Container>
      </section>
      <AudienceStory />

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
        </Container>
      </section>

      {/* Testimonials — cinematic scroll-pinned story */}
      <TestimonialsStory />

      {/* Program highlights — cinematic scroll-pinned story */}
      <section className="pt-16 md:pt-24">
        <Container>
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-teal-950 sm:text-3xl">{t('home.programsTitle')}</h2>
          </Reveal>
        </Container>
      </section>
      <ProgramsStory />

      {/* CTA banner */}
      <section className="py-20 md:py-28">
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
