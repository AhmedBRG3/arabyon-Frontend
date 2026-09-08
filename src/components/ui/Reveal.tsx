import { useEffect, useRef, useState, type ReactNode } from 'react'

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reveal = () => {
      setVisible(true)
      observer.disconnect()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal()
      },
      { threshold: 0.15 },
    )
    observer.observe(el)

    // Fallback: some environments suspend IntersectionObserver callbacks
    // while the document isn't visible (e.g. a backgrounded preview pane).
    // If the element is already in the viewport shortly after mount, reveal
    // it directly rather than waiting indefinitely for a callback that may
    // never fire.
    const fallback = window.setTimeout(() => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) reveal()
    }, 120)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
