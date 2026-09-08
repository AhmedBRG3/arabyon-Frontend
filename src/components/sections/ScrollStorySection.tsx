import { useRef, type ReactNode } from 'react'
import { useI18n } from '../../i18n/I18nContext'
import { Container } from '../layout/Container'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { PlaceholderBadge } from '../ui/PlaceholderBadge'
import { Reveal } from '../ui/Reveal'
import {
  useScrollProgress,
  smoothstep,
  chapterWeight,
  usePrefersReducedMotion,
} from '../../hooks/useScrollProgress'

export interface StoryChapter {
  /** Short word/phrase shown in the top chapter-picker row. */
  label: string
  kicker?: string
  title: string
  text: string
  renderIcon: (draw: number, className: string) => ReactNode
  to?: string
  ctaLabel?: string
  meta?: string
  badge?: boolean
}

/** Slowly rotating, very faint geometric backdrop — decorative only. */
function GeometricBackdrop({ rotation }: { rotation: number }) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 h-[140vmin] w-[140vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
      style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
    >
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <g stroke="var(--color-gold-300)" strokeWidth="0.5" fill="none">
          <polygon points="100,10 130,70 190,70 145,110 160,170 100,135 40,170 55,110 10,70 70,70" />
          <circle cx="100" cy="100" r="90" />
          <circle cx="100" cy="100" r="65" />
        </g>
      </svg>
    </div>
  )
}

function ChapterLabel({ label, weight }: { label: string; weight: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-300"
        style={{ color: `color-mix(in srgb, var(--color-gold-300) ${30 + weight * 70}%, rgba(255,255,255,0.35))` }}
      >
        {label}
      </span>
      <span
        className="h-0.5 w-8 origin-center rounded-full bg-gold-400 transition-transform duration-300"
        style={{ transform: `scaleX(${0.25 + weight * 0.75})` }}
      />
    </div>
  )
}

function StaticFallback({ chapters }: { chapters: StoryChapter[] }) {
  const cols = chapters.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
  return (
    <section className="bg-teal-950 py-16 md:py-24">
      <Container>
        <div className={`grid gap-6 ${cols}`}>
          {chapters.map((c, i) => (
            <Reveal key={c.label} delay={i * 80}>
              <Card hoverable className="group relative h-full !border-white/10 !bg-white/5">
                {c.badge && <PlaceholderBadge className="absolute -top-3 end-4" />}
                {c.renderIcon(1, 'h-8 w-8 text-gold-300')}
                {c.kicker && (
                  <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-gold-300/80">{c.kicker}</div>
                )}
                <h2 className="mt-3 text-xl font-bold text-white">{c.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-teal-100/80">{c.text}</p>
                {c.meta && <p className="mt-3 text-xs text-teal-100/50">{c.meta}</p>}
                {c.to && (
                  <Button to={c.to} variant="secondary" className="mt-5">
                    {c.ctaLabel}
                  </Button>
                )}
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

export function ScrollStorySection({
  chapters,
  showScrollHint = false,
  vhPerChapter = 90,
  vhPerTransition = 30,
}: {
  chapters: StoryChapter[]
  showScrollHint?: boolean
  vhPerChapter?: number
  vhPerTransition?: number
}) {
  const { t } = useI18n()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const progress = useScrollProgress(wrapperRef)
  const reducedMotion = usePrefersReducedMotion()
  const count = chapters.length

  if (reducedMotion) return <StaticFallback chapters={chapters} />

  const weights = chapters.map((_, i) => chapterWeight(i, count, progress))
  const draws = chapters.map((_, i) => {
    const segment = 1 / count
    return smoothstep(i * segment, i * segment + segment * 0.55, progress)
  })
  const railHeight = Math.round(progress * 100)
  const totalVh = vhPerChapter * count + vhPerTransition * (count - 1)

  return (
    <section ref={wrapperRef} className="relative" style={{ height: `${totalVh}vh` }}>
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] items-center justify-center bg-teal-950 md:top-20 md:h-[calc(100vh-5rem)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <GeometricBackdrop rotation={progress * 50} />
          <div className="animate-float absolute -end-24 -top-24 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="animate-float-slow absolute -start-20 bottom-0 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />
        </div>

        <div className="absolute inset-y-10 start-6 hidden w-px bg-white/10 md:block">
          <div className="w-full bg-gold-400 transition-[height] duration-100" style={{ height: `${railHeight}%` }} />
        </div>

        <Container className="relative flex h-full flex-col items-center justify-center py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
            {chapters.map((c, i) => (
              <ChapterLabel key={c.label} label={c.label} weight={weights[i]} />
            ))}
          </div>

          <div className="relative mt-5 grid w-full max-w-2xl place-items-center text-center sm:mt-8">
            {chapters.map((c, i) => {
              const w = weights[i]
              const drift = i % 2 === 0 ? -14 : 14
              return (
                <div
                  key={c.label}
                  className="col-start-1 row-start-1 flex flex-col items-center px-2"
                  style={{
                    opacity: w,
                    transform: `translateY(${(1 - w) * drift}px) scale(${0.98 + w * 0.02})`,
                    filter: `blur(${(1 - w) * 6}px)`,
                    pointerEvents: w > 0.5 ? 'auto' : 'none',
                  }}
                >
                  {c.renderIcon(draws[i], 'h-9 w-9 text-gold-300 sm:h-12 sm:w-12 md:h-14 md:w-14')}
                  {c.badge && <PlaceholderBadge className="mt-3" />}
                  {c.kicker && (
                    <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-gold-300/80">
                      {c.kicker}
                    </span>
                  )}
                  <h2 className="mt-3 text-xl font-bold text-white sm:mt-4 sm:text-3xl md:text-4xl">{c.title}</h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-teal-50/90 sm:mt-4 sm:text-base md:text-lg">
                    {c.text}
                  </p>
                  {c.meta && <p className="mt-3 text-xs text-teal-100/60">{c.meta}</p>}
                  {c.to && (
                    <Button to={c.to} variant="secondary" className="mt-5">
                      {c.ctaLabel}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>

          {showScrollHint && (
            <div
              className="mt-6 hidden flex-col items-center gap-1 transition-opacity duration-300 [@media(min-height:700px)]:flex sm:mt-8"
              style={{ opacity: 1 - smoothstep(0.05, 0.16, progress) }}
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-teal-100/50">
                {t('common.scrollHint')}
              </span>
              <div className="h-8 w-5 rounded-full border border-teal-100/25">
                <div className="mx-auto mt-1.5 h-1.5 w-1.5 animate-bounce rounded-full bg-gold-300" />
              </div>
            </div>
          )}
        </Container>
      </div>
    </section>
  )
}
