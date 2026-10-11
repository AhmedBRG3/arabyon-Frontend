import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { offeringsApi, programsApi } from '../../api/endpoints'
import type { CreateOfferingRequest } from '../../api/types'
import { useI18n } from '../../i18n/I18nContext'
import { toMinorUnits } from '../../lib/format'
import { CURRENCIES } from '../../lib/labels'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { OfferingRow } from '../../components/dashboard/OfferingRow'
import { EmptyState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Label, Select, TextInput } from '../../components/ui/Field'
import { PageLoader } from '../../components/ui/Spinner'

export function TaOfferings() {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const [creating, setCreating] = useState(false)
  const mine = useQuery({ queryKey: ['offerings', 'mine'], queryFn: offeringsApi.mine })

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('offerings.mineTitle')}
        description={t('offerings.mineSub')}
        actions={!creating && <Button onClick={() => setCreating(true)}>{t('offerings.new')}</Button>}
      />

      {creating && <CreateOfferingForm takenProgramIds={mine.data?.map((o) => o.programId) ?? []} onDone={() => setCreating(false)} />}

      {mine.isPending && <PageLoader />}
      {mine.isError && <Alert tone="error">{errorMessage(mine.error)}</Alert>}
      {mine.data?.length === 0 && !creating && <EmptyState>{t('offerings.mineEmpty')}</EmptyState>}
      {mine.data && mine.data.length > 0 && (
        <ul className="space-y-4">
          {mine.data.map((offering) => (
            <OfferingRow key={offering.id} offering={offering} />
          ))}
        </ul>
      )}
    </div>
  )
}

function CreateOfferingForm({ takenProgramIds, onDone }: { takenProgramIds: string[]; onDone: () => void }) {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<string | null>(null)
  const programs = useQuery({ queryKey: ['programs', 'public'], queryFn: () => programsApi.list({ status: 'Published', pageSize: 100 }) })
  const available = programs.data?.items.filter((p) => !takenProgramIds.includes(p.id)) ?? []

  const create = useMutation({
    mutationFn: (body: CreateOfferingRequest) => offeringsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offerings'] })
      onDone()
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const currency = String(data.get('currency'))
    const price = toMinorUnits(String(data.get('price')), currency)
    if (price === null) {
      setFormError(t('offerings.invalidPrice'))
      return
    }
    setFormError(null)
    create.mutate({
      programId: String(data.get('programId')),
      monthlyPriceMinorUnits: price,
      currency,
      capacity: Number(data.get('capacity')),
    })
  }

  return (
    <Panel title={t('offerings.new')}>
      {programs.isPending ? (
        <PageLoader />
      ) : available.length === 0 ? (
        <>
          <EmptyState>{t('offerings.noPrograms')}</EmptyState>
          <Button variant="ghost" className="mt-4" onClick={onDone}>
            {t('common.cancel')}
          </Button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="programId">{t('offerings.program')}</Label>
            <Select id="programId" name="programId" required>
              {available.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <Label htmlFor="price">{t('offerings.monthlyPrice')}</Label>
              <TextInput id="price" name="price" inputMode="decimal" required dir="ltr" placeholder="1500" />
            </div>
            <div>
              <Label htmlFor="currency">{t('offerings.currency')}</Label>
              <Select id="currency" name="currency" defaultValue="EGP">
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="capacity">{t('offerings.capacity')}</Label>
              <TextInput id="capacity" name="capacity" type="number" min={1} max={1000} required defaultValue={6} dir="ltr" />
            </div>
          </div>
          {(formError || create.isError) && <Alert tone="error">{formError ?? errorMessage(create.error)}</Alert>}
          <div className="flex gap-3">
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? t('common.saving') : t('offerings.create')}
            </Button>
            <Button type="button" variant="ghost" onClick={onDone}>
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      )}
    </Panel>
  )
}
