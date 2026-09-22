import type { ComponentType, ReactNode, SVGProps } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n/I18nContext'
import { Container } from '../layout/Container'
import { Reveal } from '../ui/Reveal'
import { UsersIcon, LaptopIcon, ChatIcon, BookIcon, PlayIcon, ArrowIcon } from '../ui/icons'
import logo from '../../assets/logo.png'

type Icon = ComponentType<SVGProps<SVGSVGElement>>

function HeroButton({
  to,
  variant,
  icon: Icon,
  children,
}: {
  to: string
  variant: 'solid' | 'outline'
  icon: Icon
  children: ReactNode
}) {
  const solid = variant === 'solid'
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-3 rounded-full py-1.5 ps-6 pe-1.5 text-sm font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 ${
        solid
          ? 'bg-teal-950 text-white shadow-md shadow-teal-950/20 hover:bg-teal-800 hover:shadow-lg hover:shadow-teal-950/25'
          : 'border border-teal-950/20 text-teal-950 hover:border-teal-950/40 hover:bg-teal-950/5'
      }`}
    >
      {children}
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:scale-110 ${
          solid ? 'bg-white text-teal-950' : 'bg-teal-950 text-white'
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
    </Link>
  )
}

function HeroIllustration({ locale }: { locale: 'en' | 'ar' }) {
  const labels =
    locale === 'ar' ? ['اللغة العربية', 'التواصل', 'المستقبل'] : ['Arabic', 'Connection', 'Future']
  const books = [
    { label: labels[0], className: 'bg-teal-950 text-white' },
    { label: labels[1], className: 'border border-teal-950/10 bg-sand-50 text-teal-950' },
    { label: labels[2], className: 'bg-gold-400 text-teal-950' },
  ]
  return (
    <div className="relative mx-auto flex h-60 w-60 items-center justify-center sm:h-72 sm:w-72">
      <div className="animate-float-slow pointer-events-none absolute -end-6 -top-6 h-40 w-40 rounded-full bg-teal-500/10 blur-2xl" />
      <div className="animate-float pointer-events-none absolute -start-8 bottom-0 h-36 w-36 rounded-full bg-gold-400/15 blur-2xl" />

      <div className="relative w-52 -rotate-3 sm:w-60">
        {books.map((book, i) => (
          <div
            key={book.label}
            className={`flex items-center justify-between rounded-xl px-5 py-3.5 shadow-md shadow-teal-950/10 ${book.className}`}
            style={{ marginTop: i === 0 ? 0 : -6, transform: `translateX(${i * 6}px)` }}
          >
            <span className="text-sm font-bold">{book.label}</span>
            <span className="h-2 w-2 rounded-full bg-current opacity-40" />
          </div>
        ))}
      </div>

      <div className="absolute -end-1 top-4 h-16 w-3 rotate-45 rounded-full bg-gold-500 shadow-sm sm:top-6" />

      <div className="absolute -start-6 -top-8 flex gap-1 sm:-start-8 sm:-top-10">
        <span className="h-10 w-4 -rotate-12 rounded-full bg-teal-600" />
        <span className="h-12 w-4 rounded-full bg-teal-700" />
        <span className="h-10 w-4 rotate-12 rounded-full bg-teal-600" />
      </div>
    </div>
  )
}

function WaveDivider() {
  return (
    <div className="relative -mb-px text-teal-50" aria-hidden>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="h-14 w-full md:h-20">
        <path
          fill="currentColor"
          d="M0,32 C240,80 480,0 720,24 C960,48 1200,88 1440,40 L1440,80 L0,80 Z"
        />
      </svg>
    </div>
  )
}

export function HomeHero() {
  const { t, locale } = useI18n()

  const features: { Icon: Icon; titleKey: string; descKey: string }[] = [
    { Icon: UsersIcon, titleKey: 'home.feature1Title', descKey: 'home.feature1Desc' },
    { Icon: LaptopIcon, titleKey: 'home.feature2Title', descKey: 'home.feature2Desc' },
    { Icon: ChatIcon, titleKey: 'home.feature3Title', descKey: 'home.feature3Desc' },
    { Icon: BookIcon, titleKey: 'home.feature4Title', descKey: 'home.feature4Desc' },
  ]

  return (
    <section className="relative overflow-hidden bg-sand-50">
      <Container className="relative pb-14 pt-12 md:pb-20 md:pt-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <img src={logo} alt={t('logoAlt')} width={720} height={327} className="mx-auto h-16 w-auto sm:h-20 md:h-24" />

          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold-400/60" />
            <span className="inline-flex items-center rounded-full border border-gold-400/50 bg-white px-5 py-2 text-sm font-semibold text-teal-700 shadow-sm shadow-teal-950/5">
              {t('home.heroKicker')}
            </span>
            <span className="h-px w-8 bg-gold-400/60" />
          </div>

          <h1 className="mx-auto mt-6 text-3xl font-bold leading-tight text-teal-950 sm:text-4xl md:text-5xl">
            {t('home.heroHeadline')}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-700 md:text-lg">
            {t('home.heroSub')}
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-10 grid items-center gap-10 md:mt-14 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:order-2 md:justify-start">
            <HeroButton to="/book-trial" variant="solid" icon={ArrowIcon}>
              {t('home.heroCtaPrimary')}
            </HeroButton>
            <HeroButton to="/programs/conversational" variant="outline" icon={PlayIcon}>
              {t('home.heroCtaSecondary')}
            </HeroButton>
          </div>
          <div className="md:order-1">
            <HeroIllustration locale={locale} />
          </div>
        </Reveal>
      </Container>

      <Container className="relative">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-teal-950/8 pt-10 sm:grid-cols-4 sm:divide-x sm:divide-teal-950/8">
          {features.map(({ Icon, titleKey, descKey }, i) => (
            <Reveal key={titleKey} delay={i * 80} className="flex flex-col items-center gap-3 px-2 text-center sm:px-6">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm shadow-teal-950/5">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="font-bold text-teal-950">{t(titleKey)}</h3>
              <p className="text-sm leading-relaxed text-ink-700">{t(descKey)}</p>
            </Reveal>
          ))}
        </div>
      </Container>

      <WaveDivider />

      <div className="bg-teal-50 pb-14 pt-2 text-center md:pb-20">
        <Reveal>
          <h2 className="text-xl font-bold text-teal-950 sm:text-2xl">{t('home.heroWelcome')}</h2>
          <span className="mx-auto mt-4 block h-1 w-14 rounded-full bg-gold-400" />
        </Reveal>
      </div>
    </section>
  )
}
