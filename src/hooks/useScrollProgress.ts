import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Tracks how far a tall element has scrolled through the viewport, as 0→1.
 * 0 = the element's top has just reached the top of the viewport.
 * 1 = the element's bottom has just reached the top of the viewport
 * (i.e. it has scrolled fully past, assuming height > 100vh so the
 * element can be used with `position: sticky` on an inner panel).
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const raw = total > 0 ? -rect.top / total : 0
      setProgress(Math.min(1, Math.max(0, raw)))
    }

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [ref])

  return progress
}

/** Clamped 0→1 ramp between two progress values, with smoothstep easing. */
export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

/**
 * Splits 0→1 progress into `count` equal chapters and returns how "active"
 * chapter `i` is (0→1) at the given progress. Chapters never overlap at
 * meaningful weight — each fully resolves in or out, with a brief dead zone
 * at each boundary — so differently-sized content never sits legibly on
 * top of the next chapter mid-transition.
 */
export function chapterWeight(i: number, count: number, progress: number, fadeRatio = 0.16) {
  const segment = 1 / count
  const fade = segment * fadeRatio
  const gap = segment * 0.08

  const boundaryPrev = i / count
  const boundaryNext = (i + 1) / count

  const fadeIn = i === 0 ? 1 : smoothstep(boundaryPrev + gap, boundaryPrev + gap + fade, progress)
  const fadeOut = i === count - 1 ? 1 : 1 - smoothstep(boundaryNext - gap - fade, boundaryNext - gap, progress)

  return Math.min(fadeIn, fadeOut)
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}
