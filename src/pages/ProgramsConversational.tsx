import { useI18n } from '../i18n/I18nContext'
import { Container } from '../components/layout/Container'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PlaceholderBadge } from '../components/ui/PlaceholderBadge'
import { Reveal } from '../components/ui/Reveal'
import { IconBadge } from '../components/ui/IconBadge'
import { UserIcon, UsersIcon } from '../components/ui/icons'
import { scheduleSlots } from '../data/scheduleMock'

export function ProgramsConversational() {
  const { t, td, locale } = useI18n()
  const levels = td<string[]>('programs.conversational.levels')
  const fusha = td<{ title: string; desc: string }[]>('programs.conversational.fusha')

  return (
    <div>
      <section className="bg-teal-950 py-16 text-center md:py-20">
        <Container>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold-300">
              {t('programs.conversational.kicker')}
            </span>
            <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
              {t('programs.conversational.title')}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-teal-100/85 md:text-base">
              {t('programs.conversational.sub')}
            </p>
            <Button to="/book-trial" size="lg" className="mt-7">
              {t('common.bookFreeTrial')}
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* Levels */}
      <section className="py-16 md:py-20">
        <Container>
          <Reveal>
            <h2 className="text-center text-xl font-bold text-teal-950 sm:text-2xl">
              {t('programs.conversational.levelsTitle')}
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {levels.map((level, i) => (
              <Reveal key={level} delay={i * 90}>
                <Card hoverable className="group text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-teal-950 text-sm font-bold text-gold-300 transition-transform duration-300 ease-out group-hover:scale-110">
                    {i + 1}
                  </div>
                  <p className="mt-3 font-semibold text-teal-950">{level}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Class format */}
      <section className="bg-teal-50 py-16 md:py-20">
        <Container>
          <Reveal>
            <h2 className="text-center text-xl font-bold text-teal-950 sm:text-2xl">
              {t('programs.conversational.formatTitle')}
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Reveal delay={80}>
              <Card hoverable className="group h-full">
                <IconBadge tone="teal">
                  <UserIcon className="h-6 w-6" />
                </IconBadge>
                <h3 className="mt-3 font-bold text-teal-950">{t('programs.conversational.formatOneOnOne')}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">
                  {t('programs.conversational.formatOneOnOneDesc')}
                </p>
              </Card>
            </Reveal>
            <Reveal delay={160}>
              <Card hoverable className="group h-full">
                <IconBadge tone="gold">
                  <UsersIcon className="h-6 w-6" />
                </IconBadge>
                <h3 className="mt-3 font-bold text-teal-950">{t('programs.conversational.formatGroup')}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">
                  {t('programs.conversational.formatGroupDesc')}
                </p>
              </Card>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Why Fusha */}
      <section className="py-16 md:py-20">
        <Container>
          <Reveal>
            <h2 className="text-center text-xl font-bold text-teal-950 sm:text-2xl">
              {t('programs.conversational.fushaTitle')}
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {fusha.map((item, i) => (
              <Reveal key={item.title} delay={80 + i * 80}>
                <Card hoverable className="h-full">
                  <h3 className="font-bold text-teal-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{item.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Schedule mockup */}
      <section className="bg-teal-50 py-16 md:py-20">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-xl font-bold text-teal-950 sm:text-2xl">
                {t('programs.conversational.scheduleTitle')}
              </h2>
              <p className="mt-2 text-sm text-ink-700">{t('programs.conversational.scheduleSub')}</p>
            </div>
          </Reveal>
          <Reveal delay={100} className="relative mx-auto mt-8 max-w-3xl">
            <PlaceholderBadge className="absolute -top-3 end-4 z-10" />
            <div className="overflow-x-auto rounded-2xl border border-teal-950/10 bg-white">
              <table className="w-full min-w-[560px] text-start text-sm">
                <thead>
                  <tr className="border-b border-teal-950/10 bg-teal-950/5 text-xs font-semibold uppercase tracking-wide text-teal-950">
                    <th className="px-5 py-3 text-start">{locale === 'ar' ? 'اليوم' : 'Day'}</th>
                    <th className="px-5 py-3 text-start">{locale === 'ar' ? 'كندا (EST/PST)' : 'Canada (EST/PST)'}</th>
                    <th className="px-5 py-3 text-start">{locale === 'ar' ? 'الإمارات (GST)' : 'UAE (GST)'}</th>
                    <th className="px-5 py-3 text-start">{locale === 'ar' ? 'الشكل' : 'Format'}</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleSlots.map((slot) => (
                    <tr
                      key={slot.day.en}
                      className="border-b border-teal-950/5 transition-colors duration-200 last:border-0 hover:bg-teal-50/70"
                    >
                      <td className="px-5 py-3 font-medium text-teal-950">{slot.day[locale]}</td>
                      <td className="px-5 py-3 text-ink-700" dir="ltr">
                        {slot.canadaTime}
                      </td>
                      <td className="px-5 py-3 text-ink-700" dir="ltr">
                        {slot.uaeTime}
                      </td>
                      <td className="px-5 py-3 text-ink-700">{slot.format[locale]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <Container>
          <Reveal>
            <div className="rounded-3xl bg-gradient-to-br from-teal-800 to-teal-950 px-8 py-14 text-center transition-shadow duration-500 hover:shadow-2xl hover:shadow-teal-950/30 md:px-16">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">{t('programs.conversational.ctaTitle')}</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-teal-100/85">{t('programs.conversational.ctaDesc')}</p>
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
