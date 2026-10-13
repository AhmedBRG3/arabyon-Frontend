import { type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { programsApi } from '../../api/endpoints'
import type { ProgramDetail, ProgramStatus } from '../../api/types'
import { useI18n } from '../../i18n/I18nContext'
import { PROGRAM_STATUSES, programStatusTone } from '../../lib/labels'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { LessonEditor } from '../../components/dashboard/LessonEditor'
import { PageHeader, Panel } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Pill } from '../../components/ui/Pill'
import { PageLoader } from '../../components/ui/Spinner'
import { ProgramFields } from './Programs'

export function AdminProgramDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const queryClient = useQueryClient()
  const queryKey = ['admin', 'program', id]

  const program = useQuery({ queryKey, queryFn: () => programsApi.get(id!) })

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey })
    queryClient.invalidateQueries({ queryKey: ['admin', 'programs'] })
    queryClient.invalidateQueries({ queryKey: ['programs'] })
  }
  const setProgram = (updated: ProgramDetail) => {
    queryClient.setQueryData(queryKey, updated)
    queryClient.invalidateQueries({ queryKey: ['admin', 'programs'] })
    queryClient.invalidateQueries({ queryKey: ['programs'] })
  }

  const save = useMutation({
    mutationFn: (body: { title: string; description: string | null }) => programsApi.update(id!, body),
    onSuccess: setProgram,
  })
  const changeStatus = useMutation({ mutationFn: (s: ProgramStatus) => programsApi.changeStatus(id!, s), onSuccess: setProgram })

  if (program.isPending) return <PageLoader />
  if (program.isError) return <Alert tone="error">{errorMessage(program.error)}</Alert>

  const p = program.data
  const mutationError = [save, changeStatus].find((m) => m.isError)?.error

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    save.mutate({ title: String(data.get('title')).trim(), description: String(data.get('description')).trim() || null })
  }

  const nextStatuses = PROGRAM_STATUSES.filter((s) => s !== p.status)

  return (
    <div className="space-y-6">
      <Link to="/admin/programs" className="text-sm font-semibold text-teal-700 hover:underline">
        ← {t('admin.programsTitle')}
      </Link>
      <PageHeader
        title={p.title}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={programStatusTone(p.status)}>{t(`programStatus.${p.status}`)}</Pill>
            {nextStatuses.map((s) => (
              <Button key={s} variant={s === 'Published' ? 'primary' : 'ghost'} onClick={() => changeStatus.mutate(s)} disabled={changeStatus.isPending}>
                {t(`admin.statusAction.${s}`)}
              </Button>
            ))}
          </div>
        }
      />

      {mutationError && <Alert tone="error">{errorMessage(mutationError)}</Alert>}

      <Panel title={t('admin.programDetails')}>
        <form onSubmit={handleSave}>
          <ProgramFields key={`${p.title}|${p.description}`} idPrefix="edit-program" title={p.title} description={p.description} />
          <Button type="submit" className="mt-5" disabled={save.isPending}>
            {save.isPending ? t('common.saving') : t('common.save')}
          </Button>
        </form>
      </Panel>

      <Panel title={t('admin.lessonsTitle')}>
        <p className="mb-4 text-xs text-ink-500">{t('admin.lessonsNote')}</p>
        <LessonEditor
          lessons={p.lessons}
          onChanged={refresh}
          lessonApi={{
            add: (title) => programsApi.addLesson(id!, title),
            rename: (lessonId, title) => programsApi.updateLesson(id!, lessonId, title),
            remove: (lessonId) => programsApi.deleteLesson(id!, lessonId),
            reorder: (ids) => programsApi.reorderLessons(id!, ids),
          }}
        />
      </Panel>
    </div>
  )
}
