import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { offeringsApi } from '../../api/endpoints'
import type { Offering } from '../../api/types'
import { useI18n } from '../../i18n/I18nContext'
import { formatMoney, toMajorUnits, toMinorUnits } from '../../lib/format'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Label, TextInput } from '../ui/Field'
import { Pill } from '../ui/Pill'

/** One offering with inline editing of price, capacity and active state (PUT /offerings/{id}). */
export function OfferingRow({ offering, showTutor = false }: { offering: Offering; showTutor?: boolean }) {
  const { t, locale } = useI18n()
  const errorMessage = useErrorMessage()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const update = useMutation({
    mutationFn: (body: Parameters<typeof offeringsApi.update>[1]) => offeringsApi.update(offering.id, body),
    onSuccess: () => {
      setEditing(false)
      queryClient.invalidateQueries({ queryKey: ['offerings'] })
    },
  })

  const toggleActive = () =>
    update.mutate({
      monthlyPriceMinorUnits: offering.monthlyPriceMinorUnits,
      capacity: offering.capacity,
      isActive: !offering.isActive,
    })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const price = toMinorUnits(String(data.get('price')), offering.currency)
    if (price === null) {
      setFormError(t('offerings.invalidPrice'))
      return
    }
    setFormError(null)
    update.mutate({ monthlyPriceMinorUnits: price, capacity: Number(data.get('capacity')), isActive: offering.isActive })
  }

  return (
    <li className="rounded-2xl border border-teal-950/8 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-teal-950">{offering.programTitle}</h3>
            <Pill tone={offering.isActive ? 'teal' : 'gray'}>{offering.isActive ? t('offerings.active') : t('offerings.inactive')}</Pill>
          </div>
          {showTutor && <p className="mt-0.5 text-sm text-ink-700">{offering.taName}</p>}
          <p className="mt-1 text-sm text-ink-500">
            {formatMoney(offering.monthlyPriceMinorUnits, offering.currency, locale)} {t('tutors.perMonth')} ·{' '}
            {t('offerings.seatsUsed').replace('{taken}', String(offering.seatsTaken)).replace('{capacity}', String(offering.capacity))}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setEditing((v) => !v)}>
            {editing ? t('common.cancel') : t('common.edit')}
          </Button>
          <Button variant="secondary" onClick={toggleActive} disabled={update.isPending}>
            {offering.isActive ? t('offerings.deactivate') : t('offerings.activate')}
          </Button>
        </div>
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 border-t border-teal-950/8 pt-5 sm:grid-cols-3 sm:items-end">
          <div>
            <Label htmlFor={`price-${offering.id}`}>
              {t('offerings.monthlyPrice')} ({offering.currency})
            </Label>
            <TextInput
              id={`price-${offering.id}`}
              name="price"
              inputMode="decimal"
              required
              dir="ltr"
              defaultValue={toMajorUnits(offering.monthlyPriceMinorUnits, offering.currency)}
            />
          </div>
          <div>
            <Label htmlFor={`capacity-${offering.id}`}>{t('offerings.capacity')}</Label>
            <TextInput
              id={`capacity-${offering.id}`}
              name="capacity"
              type="number"
              min={Math.max(1, offering.seatsTaken)}
              max={1000}
              required
              dir="ltr"
              defaultValue={offering.capacity}
            />
          </div>
          <Button type="submit" disabled={update.isPending}>
            {update.isPending ? t('common.saving') : t('common.save')}
          </Button>
        </form>
      )}

      {(formError || update.isError) && (
        <Alert tone="error" className="mt-4">
          {formError ?? errorMessage(update.error)}
        </Alert>
      )}
    </li>
  )
}
