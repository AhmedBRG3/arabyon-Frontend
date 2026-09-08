import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useI18n } from '../../i18n/I18nContext'
import { Container } from './Container'
import { Button } from '../ui/Button'

const navItems = [
  { to: '/', key: 'nav.home' },
  { to: '/programs/conversational', key: 'nav.programsConversational' },
  { to: '/programs/igcse', key: 'nav.programsIGCSE' },
  { to: '/about', key: 'nav.about' },
  { to: '/faqs', key: 'nav.faqs' },
  { to: '/blog', key: 'nav.blog' },
  { to: '/contact', key: 'nav.contact' },
]

export function Header() {
  const { t, locale, toggleLocale } = useI18n()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-teal-950/10 bg-sand-50/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="group flex items-center gap-2 font-display text-lg font-bold text-teal-950 md:text-xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-950 font-display text-sm text-gold-300 transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 md:h-10 md:w-10">
            A
          </span>
          {t('brand')}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group/link relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-teal-950' : 'text-ink-700 hover:text-teal-950'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {t(item.key)}
                  <span
                    className={`pointer-events-none absolute inset-x-3.5 bottom-1 h-0.5 origin-center scale-x-0 rounded-full bg-gold-500 transition-transform duration-300 ease-out group-hover/link:scale-x-100 ${
                      isActive ? 'scale-x-100' : ''
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={toggleLocale}
            className="rounded-full border border-teal-950/15 px-3 py-2 text-sm font-semibold text-teal-950 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-950/30 hover:bg-teal-950/5 hover:shadow-sm active:scale-95"
            aria-label="Switch language"
          >
            {locale === 'en' ? 'العربية' : 'English'}
          </button>
          <div className="hidden sm:block">
            <Button to="/book-trial" size="md">
              {t('common.bookFreeTrial')}
            </Button>
          </div>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-teal-950/15 transition-colors hover:bg-teal-950/5 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className="sr-only">Menu</span>
            <div className="flex h-4 w-5 flex-col justify-between">
              <span
                className={`h-0.5 w-5 origin-center bg-teal-950 transition-transform duration-300 ease-out ${
                  open ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-0.5 w-5 bg-teal-950 transition-opacity duration-200 ${open ? 'opacity-0' : 'opacity-100'}`}
              />
              <span
                className={`h-0.5 w-5 origin-center bg-teal-950 transition-transform duration-300 ease-out ${
                  open ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </Container>

      <div
        className={`overflow-hidden border-t border-teal-950/10 bg-sand-50 transition-all duration-300 ease-out lg:hidden ${
          open ? 'max-h-[32rem] opacity-100' : 'max-h-0 border-t-0 opacity-0'
        }`}
      >
        <Container className="flex flex-col gap-1 py-4">
          {navItems.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ease-out hover:translate-x-1 hover:bg-teal-950/5 ${
                  isActive ? 'bg-teal-950/8 text-teal-950' : 'text-ink-700'
                } ${open ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'}`
              }
              style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
            >
              {t(item.key)}
            </NavLink>
          ))}
          <div className="mt-2 sm:hidden">
            <Button to="/book-trial" size="md" className="w-full justify-center">
              {t('common.bookFreeTrial')}
            </Button>
          </div>
        </Container>
      </div>
    </header>
  )
}
