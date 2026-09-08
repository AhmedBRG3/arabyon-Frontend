import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50 disabled:pointer-events-none active:scale-95 active:duration-100'

const variants: Record<Variant, string> = {
  primary:
    'bg-gold-500 text-teal-950 hover:bg-gold-400 shadow-md shadow-gold-500/20 hover:shadow-xl hover:shadow-gold-500/35 hover:-translate-y-1 hover:scale-[1.03]',
  secondary: 'bg-teal-950 text-white hover:bg-teal-800 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-950/25',
  ghost: 'bg-transparent text-teal-950 border border-teal-950/15 hover:bg-teal-950/5 hover:border-teal-950/30 hover:-translate-y-0.5',
}

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; to?: undefined }
type LinkProps = CommonProps & { href?: string; to?: string }

export function Button(props: ButtonProps | LinkProps) {
  const { variant = 'primary', size = 'md', children, className = '', ...rest } = props
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    )
  }
  if ('href' in props && props.href) {
    return (
      <a href={props.href} className={classes}>
        {children}
      </a>
    )
  }
  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
