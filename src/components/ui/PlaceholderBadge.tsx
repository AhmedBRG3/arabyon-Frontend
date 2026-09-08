import { useI18n } from '../../i18n/I18nContext'

export function PlaceholderBadge({ className = '' }: { className?: string }) {
  const { t } = useI18n()
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-dashed border-gold-500/60 bg-gold-100/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold-600 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
      {t('common.placeholderBadge')}
    </span>
  )
}
