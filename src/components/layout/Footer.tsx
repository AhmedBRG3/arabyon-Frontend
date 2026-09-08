import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n/I18nContext'
import { Container } from './Container'

export function Footer() {
  const { t } = useI18n()

  const quickLinks = [
    { to: '/programs/conversational', key: 'nav.programsConversational' },
    { to: '/programs/igcse', key: 'nav.programsIGCSE' },
    { to: '/about', key: 'nav.about' },
    { to: '/faqs', key: 'nav.faqs' },
    { to: '/blog', key: 'nav.blog' },
  ]

  return (
    <footer className="mt-24 border-t border-teal-950/10 bg-teal-950 text-teal-50">
      <Container className="grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="group flex items-center gap-2 font-display text-lg font-bold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 font-display text-sm text-teal-950 transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110">
              A
            </span>
            {t('brand')}
          </div>
          <p className="mt-4 max-w-xs text-sm text-teal-100/80">{t('footer.tagline')}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-300">{t('footer.quickLinks')}</h3>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="inline-block text-sm text-teal-100/80 transition-all duration-200 ease-out hover:translate-x-1 hover:text-white"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-300">{t('footer.contactTitle')}</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-teal-100/80">
            <li>
              <a href="mailto:hello@alhuda.example" className="transition-colors hover:text-white">
                hello@alhuda.example
              </a>
            </li>
            <li dir="ltr" className="text-start">
              <a href="tel:+10000000000" className="transition-colors hover:text-white">
                +1 (000) 000-0000
              </a>
            </li>
            <li>
              <Link
                to="/book-trial"
                className="inline-block underline decoration-gold-400 underline-offset-4 transition-all duration-200 ease-out hover:translate-x-1 hover:text-white"
              >
                {t('nav.bookTrial')}
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-teal-100/60 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {t('brand')}. {t('footer.rights')}
          </span>
          <span>Canada · UAE</span>
        </Container>
      </div>
    </footer>
  )
}
