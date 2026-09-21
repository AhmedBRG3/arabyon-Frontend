/** Large, single/double-path line glyphs designed to "draw in" via stroke-dashoffset (see `draw` prop, 0→1). */

function dashStyle(draw: number) {
  return { strokeDasharray: 1, strokeDashoffset: 1 - draw } as const
}

const strokeProps = {
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
}

export function EyeGlyph({ draw, className = '' }: { draw: number; className?: string }) {
  const dash = dashStyle(draw)
  return (
    <svg viewBox="0 0 64 64" className={className} {...strokeProps}>
      <path d="M4 32S15 13 32 13s28 19 28 19-11 19-28 19S4 32 4 32Z" pathLength={1} style={dash} />
      <circle cx="32" cy="32" r="8.5" pathLength={1} style={dash} />
    </svg>
  )
}

export function CompassGlyph({ draw, className = '' }: { draw: number; className?: string }) {
  const dash = dashStyle(draw)
  return (
    <svg viewBox="0 0 64 64" className={className} {...strokeProps}>
      <circle cx="32" cy="32" r="24" pathLength={1} style={dash} />
      <path d="m39.5 24.5-4.3 11.7-11.7 4.3 4.3-11.7 11.7-4.3Z" pathLength={1} style={dash} />
    </svg>
  )
}

export function SpeakGlyph({ draw, className = '' }: { draw: number; className?: string }) {
  const dash = dashStyle(draw)
  return (
    <svg viewBox="0 0 64 64" className={className} {...strokeProps}>
      <path
        d="M8 12h48a3 3 0 0 1 3 3v26a3 3 0 0 1-3 3H26l-12.6 9.6a1.2 1.2 0 0 1-1.9-1V44H8a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3Z"
        pathLength={1}
        style={dash}
      />
      <path d="M16 24h32M16 33h20" pathLength={1} style={dash} />
    </svg>
  )
}

export function CapGlyph({ draw, className = '' }: { draw: number; className?: string }) {
  const dash = dashStyle(draw)
  return (
    <svg viewBox="0 0 64 64" className={className} {...strokeProps}>
      <path d="M4 24 32 12l28 12-28 12L4 24Z" pathLength={1} style={dash} />
      <path d="M14 28v11c0 1.3.8 2.4 2 2.9a30 30 0 0 0 26 0c1.2-.5 2-1.6 2-2.9V28" pathLength={1} style={dash} />
      <path d="M56 24v15" pathLength={1} style={dash} />
    </svg>
  )
}

export function BookGlyph({ draw, className = '' }: { draw: number; className?: string }) {
  const dash = dashStyle(draw)
  return (
    <svg viewBox="0 0 64 64" className={className} {...strokeProps}>
      <path d="M8 12c4.5-2.5 11-3 24-1v34c-9-2-15.5-1.5-24 1V12Z" pathLength={1} style={dash} />
      <path d="M56 12c-4.5-2.5-11-3-24-1v34c9-2 15.5-1.5 24 1V12Z" pathLength={1} style={dash} />
    </svg>
  )
}

/** A drawn circle outline that cross-fades into a pair of initials once mostly drawn. */
export function AvatarGlyph({ draw, initials, className = '' }: { draw: number; initials: string; className?: string }) {
  const dash = dashStyle(draw)
  const textOpacity = Math.max(0, (draw - 0.6) / 0.4)
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <circle cx="32" cy="32" r="27" pathLength={1} style={dash} {...strokeProps} />
      <text
        x="32"
        y="32"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontSize="20"
        fontWeight="700"
        fontFamily="inherit"
        opacity={textOpacity}
      >
        {initials}
      </text>
    </svg>
  )
}
