import { useI18n } from '../i18n/I18nContext'
import { Container } from '../components/layout/Container'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Reveal } from '../components/ui/Reveal'
import { IconBadge } from '../components/ui/IconBadge'
import { SpeakIcon, HeadphonesIcon, BookIcon, PencilIcon, CapIcon } from '../components/ui/icons'

const skills = [
  { titleKey: 'programs.igcse.skillSpeaking', descKey: 'programs.igcse.skillSpeakingDesc', Icon: SpeakIcon },
  { titleKey: 'programs.igcse.skillListening', descKey: 'programs.igcse.skillListeningDesc', Icon: HeadphonesIcon },
  { titleKey: 'programs.igcse.skillReading', descKey: 'programs.igcse.skillReadingDesc', Icon: BookIcon },
  { titleKey: 'programs.igcse.skillWriting', descKey: 'programs.igcse.skillWritingDesc', Icon: PencilIcon },
]

export function ProgramsIGCSE() {
  const { t } = useI18n()

  return (
    <div>
      <section className="bg-teal-950 py-16 text-center md:py-20">
        <Container>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold-300">
              {t('programs.igcse.kicker')}
            </span>
            <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
              {t('programs.igcse.title')}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-teal-100/85 md:text-base">{t('programs.igcse.sub')}</p>
            <Button to="/book-trial" size="lg" className="mt-7">
              {t('common.bookFreeTrial')}
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* Tracks */}
      <section className="py-16 md:py-20">
        <Container>
          <Reveal>
            <h2 className="text-center text-xl font-bold text-teal-950 sm:text-2xl">{t('programs.igcse.tracksTitle')}</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Reveal delay={80}>
              <Card hoverable className="h-full">
                <span className="text-xs font-semibold uppercase tracking-wide text-teal-600">First Language</span>
                <h3 className="mt-2 font-bold text-teal-950">{t('programs.igcse.trackFirstTitle')}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{t('programs.igcse.trackFirstDesc')}</p>
              </Card>
            </Reveal>
            <Reveal delay={160}>
              <Card hoverable className="h-full">
                <span className="text-xs font-semibold uppercase tracking-wide text-gold-600">Foreign Language</span>
                <h3 className="mt-2 font-bold text-teal-950">{t('programs.igcse.trackForeignTitle')}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{t('programs.igcse.trackForeignDesc')}</p>
              </Card>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Skill breakdown */}
      <section className="bg-teal-50 py-16 md:py-20">
        <Container>
          <Reveal>
            <h2 className="text-center text-xl font-bold text-teal-950 sm:text-2xl">{t('programs.igcse.skillsTitle')}</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map(({ titleKey, descKey, Icon }, i) => (
              <Reveal key={titleKey} delay={i * 90}>
                <Card hoverable className="group h-full">
                  <IconBadge tone={i % 2 === 0 ? 'teal' : 'gold'}>
                    <Icon className="h-6 w-6" />
                  </IconBadge>
                  <h3 className="mt-3 font-bold text-teal-950">{t(titleKey)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{t(descKey)}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Tutor qualifications */}
      <section className="py-16 md:py-20">
        <Container>
          <Reveal>
            <div className="group mx-auto max-w-2xl rounded-3xl border border-teal-950/8 bg-white p-8 text-center shadow-sm shadow-teal-950/5 transition-shadow duration-300 hover:shadow-xl hover:shadow-teal-950/10 md:p-12">
              <IconBadge tone="gold" className="mx-auto">
                <CapIcon className="h-6 w-6" />
              </IconBadge>
              <h2 className="mt-4 text-xl font-bold text-teal-950">{t('programs.igcse.tutorsTitle')}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">{t('programs.igcse.tutorsDesc')}</p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-16 md:pb-20">
        <Container>
          <Reveal>
            <div className="rounded-3xl bg-gradient-to-br from-teal-800 to-teal-950 px-8 py-14 text-center transition-shadow duration-500 hover:shadow-2xl hover:shadow-teal-950/30 md:px-16">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">{t('programs.igcse.ctaTitle')}</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-teal-100/85">{t('programs.igcse.ctaDesc')}</p>
              <Button to="/book-trial" size="lg" className="mt-7">
                {t('common.bookFreeTrial')}
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  )
}
