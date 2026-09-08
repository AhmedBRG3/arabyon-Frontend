import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function SpeakIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5.5h16a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H9l-4.2 3.3A.5.5 0 0 1 4 19V16H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" />
      <path d="M8 10h8M8 13h5" />
    </svg>
  )
}

export function CapIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m2.5 9 9.5-4.5L21.5 9 12 13.5 2.5 9Z" />
      <path d="M6 11v4.2c0 .5.3.9.8 1.1a12.3 12.3 0 0 0 10.4 0c.5-.2.8-.6.8-1.1V11" />
      <path d="M21.5 9v6" />
    </svg>
  )
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2" />
    </svg>
  )
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19.5c0-3.3 2.7-5.7 6-5.7s6 2.4 6 5.7" />
      <path d="M15.5 6a3 3 0 0 1 0 5.8" />
      <path d="M18 14.2c2.3.5 4 2.3 4 5.3" />
    </svg>
  )
}

export function BookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5.5c1.8-1 4.4-1.2 8-.4v13.4c-3.6-.8-6.2-.6-8 .4v-13.4Z" />
      <path d="M20 5.5c-1.8-1-4.4-1.2-8-.4v13.4c3.6-.8 6.2-.6 8 .4v-13.4Z" />
    </svg>
  )
}

export function PencilIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14.5 4.5 19.5 9.5 8 21H3v-5L14.5 4.5Z" />
      <path d="M12.5 6.5 17.5 11.5" />
    </svg>
  )
}

export function HeadphonesIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 13.5v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.4" />
      <rect x="17" y="13" width="4" height="6" rx="1.4" />
    </svg>
  )
}

export function ChatIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5.5h16a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H9l-4.2 3.3A.5.5 0 0 1 4 19V16H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" />
    </svg>
  )
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="1.6" />
      <path d="m4 6.5 8 6.5 8-6.5" />
    </svg>
  )
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 18.5 3.7 20l1.5-3.3A8 8 0 1 1 7 18.5Z" />
      <path d="M8.7 8.6c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .5.4.2.5.6 1.5.7 1.6.1.1.1.3 0 .5-.1.2-.2.3-.3.4l-.4.5c-.1.2-.3.3-.1.6.2.3.9 1.4 1.9 2.2 1.3 1.1 2.2 1.4 2.5 1.5.3.1.5.1.6-.1l.6-.7c.2-.2.3-.2.5-.1l1.5.7c.2.1.3.1.4.3.1.2.1.9-.2 1.3-.3.5-1.2.9-1.7.9-.5 0-1.1 0-3.4-1.4-2.4-1.6-3.8-4-4-4.3-.1-.3-.9-1.3-.9-2.4 0-1.1.6-1.7.8-1.9Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.9" cy="7.1" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M13.8 8.6h-1.3c-.6 0-1 .5-1 1.1v1.6H13.8l-.3 2h-2v6" />
    </svg>
  )
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <path d="M10.5 9.7v4.6l4-2.3-4-2.3Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12.5 9.5 17 19 7" />
    </svg>
  )
}

export function ArrowIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function EyeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  )
}

export function CompassIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m14.8 9.2-1.6 4.4-4.4 1.6 1.6-4.4 4.4-1.6Z" />
    </svg>
  )
}
