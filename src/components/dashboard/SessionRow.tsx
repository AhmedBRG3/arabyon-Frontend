import type { Session } from '../../api/types'
import { useI18n } from '../../i18n/I18nContext'
import { formatDateTime, formatTime } from '../../lib/format'
import { sessionStatusTone } from '../../lib/labels'
import { Button } from '../ui/Button'
import { Pill } from '../ui/Pill'

/** One session with its time in the viewer's time zone and a link straight into the Zoom meeting. */
export function SessionRow({ session, showTutor = false }: { session: Session; showTutor?: boolean }) {
  const { t, locale } = useI18n()

  return (
    <li className="rounded-2xl border border-teal-950/8 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-teal-950">{session.title}</h3>
            <Pill tone={sessionStatusTone(session.status)}>{t(`sessions.status${session.status}`)}</Pill>
          </div>
          <p className="mt-0.5 text-sm text-ink-700">
            {session.programTitle}
            {showTutor && ` · ${t('classes.with').replace('{tutor}', session.taName)}`}
          </p>
          <p className="mt-1 text-sm text-ink-500">
            {formatDateTime(session.startsAtUtc, locale)} – {formatTime(session.endsAtUtc, locale)}
          </p>
        </div>
        {session.joinUrl && session.status !== 'Canceled' && (
          <Button href={session.joinUrl} target="_blank" rel="noreferrer">
            {t('sessions.join')}
          </Button>
        )}
      </div>
    </li>
  )
}
