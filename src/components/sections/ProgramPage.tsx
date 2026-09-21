import type { ComponentType, SVGProps } from 'react'
import { useI18n } from '../../i18n/I18nContext'
import { Container } from '../layout/Container'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Reveal } from '../ui/Reveal'
import { IconBadge } from '../ui/IconBadge'
import { CapIcon } from '../ui/icons'

type Icon = ComponentType<SVGProps<SVGSVGElement>>

interface Skill {
  title: string
  desc: string
}

/** Shared layout for curriculum programs (IGCSE, UAE). `ns` is the i18n namespace, e.g. "programs.igcse". */
export function ProgramPage({ ns, skillIcons }: { ns: string; skillIcons: Icon[] }) {
  const { t, td } = useI18n()
  const skills = td<Skill[]>(`${ns}.skills`)

  return (
    <div>
      <section className="bg-teal-950 py-16 text-center md:py-20">
        <Container>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold-300">
              {t(`${ns}.kicker`)}
            </span>
            <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-bold text-white sm:text-4xl">{t(`${ns}.title`)}</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-teal-100/85 md:text-base">{t(`${ns}.sub`)}</p>
            <Button to="/book-trial" size="lg" className="mt-7">
              {t('common.bookFreeTrial')}
            </Button>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <Reveal>
            <h2 className="text-center text-xl font-bold text-teal-950 sm:text-2xl">{t(`${ns}.whoTitle`)}</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Reveal delay={80}>
              <Card hoverable className="h-full">
                <h3 className="font-bold text-teal-950">{t(`${ns}.who1Title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{t(`${ns}.who1Desc`)}</p>
              </Card>
            </Reveal>
            <Reveal delay={160}>
              <Card hoverable className="h-full">
                <h3 className="font-bold text-teal-950">{t(`${ns}.who2Title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{t(`${ns}.who2Desc`)}</p>
              </Card>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-teal-50 py-16 md:py-20">
        <Container>
          <Reveal>
            <h2 className="text-center text-xl font-bold text-teal-950 sm:text-2xl">{t(`${ns}.skillsTitle`)}</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((skill, i) => {
              const Icon = skillIcons[i % skillIcons.length]
              return (
                <Reveal key={skill.title} delay={i * 90}>
                  <Card hoverable className="group h-full">
                    <IconBadge tone={i % 2 === 0 ? 'teal' : 'gold'}>
                      <Icon className="h-6 w-6" />
                    </IconBadge>
                    <h3 className="mt-3 font-bold text-teal-950">{skill.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-700">{skill.desc}</p>
                  </Card>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <Reveal>
            <div className="group mx-auto max-w-2xl rounded-3xl border border-teal-950/8 bg-white p-8 text-center shadow-sm shadow-teal-950/5 transition-shadow duration-300 hover:shadow-xl hover:shadow-teal-950/10 md:p-12">
              <IconBadge tone="gold" className="mx-auto">
                <CapIcon className="h-6 w-6" />
              </IconBadge>
              <h2 className="mt-4 text-xl font-bold text-teal-950">{t(`${ns}.tutorsTitle`)}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">{t(`${ns}.tutorsDesc`)}</p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="pb-16 md:pb-20">
        <Container>
          <Reveal>
            <div className="rounded-3xl bg-gradient-to-br from-teal-800 to-teal-950 px-8 py-14 text-center transition-shadow duration-500 hover:shadow-2xl hover:shadow-teal-950/30 md:px-16">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">{t(`${ns}.ctaTitle`)}</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-teal-100/85">{t(`${ns}.ctaDesc`)}</p>
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
