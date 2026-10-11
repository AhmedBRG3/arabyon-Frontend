import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../../i18n/I18nContext'
import { useAuth } from '../../auth/AuthContext'
import { homeFor } from '../../auth/redirects'
import { Container } from './Container'
import { Button } from '../ui/Button'
import { UserIcon } from '../ui/icons'
import logo from '../../assets/logo.png'

interface NavItem {
  to: string
  key: string
}

const programItems: NavItem[] = [
  { to: '/programs/conversational', key: 'nav.programsConversational' },
  { to: '/programs/igcse', key: 'nav.programsIGCSE' },
  { to: '/programs/uae', key: 'nav.programsUAE' },
]

const homeItem: NavItem = { to: '/', key: 'nav.home' }

const otherItems: NavItem[] = [
  { to: '/tutors', key: 'nav.tutors' },
  { to: '/about', key: 'nav.about' },
  { to: '/faqs', key: 'nav.faqs' },
  { to: '/blog', key: 'nav.blog' },
  { to: '/contact', key: 'nav.contact' },
]

// The mobile menu lists everything flat; on desktop the programs sit in a dropdown so the bar fits on one line.
const navItems = [homeItem, ...programItems, ...otherItems]

const desktopLinkClass = (active: boolean) =>
  `group/link relative whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition-colors ${
    active ? 'text-teal-950' : 'text-ink-700 hover:text-teal-950'
  }`

function Underline({ active }: { active: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute inset-x-2.5 bottom-1 h-0.5 origin-center scale-x-0 rounded-full bg-gold-500 transition-transform duration-300 ease-out group-hover/link:scale-x-100 ${
        active ? 'scale-x-100' : ''
      }`}
    />
  )
}

function DesktopLink({ item }: { item: NavItem }) {
  const { t } = useI18n()
  return (
    <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => desktopLinkClass(isActive)}>
      {({ isActive }) => (
        <>
          {t(item.key)}
          <Underline active={isActive} />
        </>
      )}
    </NavLink>
  )
}

function ProgramsMenu() {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const active = pathname.startsWith('/programs/')

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutside)
    return () => document.removeEventListener('pointerdown', closeOnOutside)
  }, [open])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false)
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false)
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        className={`${desktopLinkClass(active)} inline-flex items-center gap-1`}
      >
        {t('nav.programs')}
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
        </svg>
        <Underline active={active} />
      </button>
      <div
        className={`absolute start-0 top-full pt-2 transition-all duration-200 ease-out ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
        }`}
      >
        <div className="min-w-56 rounded-2xl border border-teal-950/10 bg-white p-2 shadow-xl shadow-teal-950/10">
          {programItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-teal-50 text-teal-950' : 'text-ink-700 hover:bg-teal-950/5 hover:text-teal-950'
                }`
              }
            >
              {t(item.key)}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Header() {
  const { t, locale, toggleLocale } = useI18n()
  const { status, user } = useAuth()
  const [open, setOpen] = useState(false)
  const account =
    status === 'authenticated' && user
      ? { to: homeFor(user), label: t('nav.myAccount') }
      : status === 'anonymous'
        ? { to: '/login', label: t('nav.login') }
        : null

  return (
    <header className="sticky top-0 z-50 border-b border-teal-950/10 bg-sand-50/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between md:h-20">
        <Link to="/" aria-label={t('logoAlt')} className="group flex items-center">
          <img
            src={logo}
            alt={t('logoAlt')}
            width={720}
            height={327}
            className="h-10 w-auto transition-transform duration-300 ease-out group-hover:scale-105 md:h-12"
          />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          <DesktopLink item={homeItem} />
          <ProgramsMenu />
          {otherItems.map((item) => (
            <DesktopLink key={item.to} item={item} />
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
          {account && (
            <Link
              to={account.to}
              aria-label={account.label}
              title={account.label}
              className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors md:inline-flex ${
                status === 'authenticated'
                  ? 'border-teal-950 bg-teal-950 text-gold-300 hover:bg-teal-800'
                  : 'border-teal-950/15 text-teal-950 hover:bg-teal-950/5'
              }`}
            >
              <UserIcon className="h-5 w-5" />
            </Link>
          )}
          <div className="hidden sm:block">
            <Button to="/book-trial" size="md" className="whitespace-nowrap">
              {t('common.bookFreeTrial')}
            </Button>
          </div>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-teal-950/15 transition-colors hover:bg-teal-950/5 xl:hidden"
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
        className={`overflow-hidden border-t border-teal-950/10 bg-sand-50 transition-all duration-300 ease-out xl:hidden ${
          open ? 'max-h-[42rem] opacity-100' : 'max-h-0 border-t-0 opacity-0'
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
          {account && (
            <NavLink
              to={account.to}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-teal-950 transition-colors hover:bg-teal-950/5 md:hidden"
            >
              {account.label}
            </NavLink>
          )}
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
