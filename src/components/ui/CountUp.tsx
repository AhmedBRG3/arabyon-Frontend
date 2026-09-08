import { useEffect, useRef, useState } from 'react'

function formatNumber(n: number, decimals: number, grouped: boolean) {
  const fixed = n.toFixed(decimals)
  if (!grouped) return fixed
  const [intPart, decPart] = fixed.split('.')
  const withCommas = Number(intPart).toLocaleString('en-US')
  return decPart ? `${withCommas}.${decPart}` : withCommas
}

/** Animates the numeric portion of a stat string (e.g. "1,200+", "4.9/5") from 0 when scrolled into view. */
export function CountUp({ value, duration = 1200 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const match = value.match(/[\d.,]+/)
    if (!match) {
      setDisplay(value)
      return
    }
    const raw = match[0]
    const grouped = raw.includes(',')
    const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
    const target = parseFloat(raw.replace(/,/g, ''))
    const start = performance.now()
    let frame: number

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const formatted = formatNumber(target * eased, decimals, grouped)
      setDisplay(value.replace(raw, formatted))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [started, value, duration])

  return <span ref={ref}>{display}</span>
}
