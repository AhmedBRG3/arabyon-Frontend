import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { programsApi } from '../../api/endpoints'
import type { ProgramStatus, SaveProgramRequest } from '../../api/types'
import { useI18n } from '../../i18n/I18nContext'
import { PROGRAM_STATUSES, programStatusTone } from '../../lib/labels'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { EmptyState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Label, Select, TextArea, TextInput } from '../../components/ui/Field'
import { Pill } from '../../components/ui/Pill'
import { PageLoader } from '../../components/ui/Spinner'

export function AdminPrograms() {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const [status, setStatus] = useState<ProgramStatus | ''>('')
  const [creating, setCreating] = useState(false)

  const programs = useQuery({
    queryKey: ['admin', 'programs', status],
    queryFn: () => programsApi.list({ status: status || undefined, pageSize: 100 }),
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.programsTitle')}
        description={t('admin.programsSub')}
        actions={!creating && <Button onClick={() => setCreating(true)}>{t('admin.newProgram')}</Button>}
      />

      {creating && <CreateProgramForm onCancel={() => setCreating(false)} />}

      <Panel>
        <div className="mb-4 flex justify-end">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProgramStatus | '')}
            className="max-w-48"
            aria-label={t('admin.status')}
          >
            <option value="">{t('admin.allStatuses')}</option>
            {PROGRAM_STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`programStatus.${s}`)}
              </option>
            ))}
          </Select>
        </div>
        {programs.isPending && <PageLoader />}
        {programs.isError && <Alert tone="error">{errorMessage(programs.error)}</Alert>}
        {programs.data?.items.length === 0 && <EmptyState>{t('admin.noPrograms')}</EmptyState>}
        {programs.data && programs.data.items.length > 0 && (
          <ul className="divide-y divide-teal-950/8">
            {programs.data.items.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <Link to={`/admin/programs/${p.id}`} className="font-semibold text-teal-950 hover:underline">
                    {p.title}
                  </Link>
                  <p className="text-xs text-ink-500">
                    {t('admin.lessonCount').replace('{count}', String(p.lessonCount))}
                    {p.ownerName && ` · ${t('admin.byTutor').replace('{tutor}', p.ownerName)}`}
                  </p>
                </div>
                <Pill tone={programStatusTone(p.status)}>{t(`programStatus.${p.status}`)}</Pill>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  )
}

function CreateProgramForm({ onCancel }: { onCancel: () => void }) {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const create = useMutation({
    mutationFn: (body: SaveProgramRequest) => programsApi.create(body),
    onSuccess: (program) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'programs'] })
      navigate(`/admin/programs/${program.id}`)
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    create.mutate({ title: String(data.get('title')).trim(), description: String(data.get('description')).trim() || null })
  }

  return (
    <Panel title={t('admin.newProgram')}>
      <form onSubmit={handleSubmit}>
        <ProgramFields idPrefix="new-program" />
        {create.isError && <Alert tone="error" className="mt-4">{errorMessage(create.error)}</Alert>}
        <div className="mt-5 flex gap-3">
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? t('common.saving') : t('admin.createProgram')}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        </div>
      </form>
    </Panel>
  )
}

/** Title + description inputs shared by the create and edit forms. */
export function ProgramFields({ idPrefix, title = '', description = '' }: { idPrefix: string; title?: string; description?: string | null }) {
  const { t } = useI18n()
  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor={`${idPrefix}-title`}>{t('admin.programTitle')}</Label>
        <TextInput id={`${idPrefix}-title`} name="title" required maxLength={200} defaultValue={title} />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-description`}>{t('admin.programDescription')}</Label>
        <TextArea id={`${idPrefix}-description`} name="description" rows={4} maxLength={4000} defaultValue={description ?? ''} />
      </div>
    </div>
  )
}
