import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { programsApi } from '../../api/endpoints'
import type { Lesson, ProgramDetail, ProgramStatus } from '../../api/types'
import { useI18n } from '../../i18n/I18nContext'
import { PROGRAM_STATUSES, programStatusTone } from '../../lib/labels'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { EmptyState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { TextInput } from '../../components/ui/Field'
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
  const addLesson = useMutation({ mutationFn: (title: string) => programsApi.addLesson(id!, title), onSuccess: refresh })
  const renameLesson = useMutation({
    mutationFn: ({ lessonId, title }: { lessonId: string; title: string }) => programsApi.updateLesson(id!, lessonId, title),
    onSuccess: refresh,
  })
  const deleteLesson = useMutation({ mutationFn: (lessonId: string) => programsApi.deleteLesson(id!, lessonId), onSuccess: refresh })
  const reorder = useMutation({ mutationFn: (ids: string[]) => programsApi.reorderLessons(id!, ids), onSuccess: refresh })

  if (program.isPending) return <PageLoader />
  if (program.isError) return <Alert tone="error">{errorMessage(program.error)}</Alert>

  const p = program.data
  const lessons = [...p.lessons].sort((a, b) => a.order - b.order)
  const mutationError = [save, changeStatus, addLesson, renameLesson, deleteLesson, reorder].find((m) => m.isError)?.error

  const move = (index: number, delta: number) => {
    const ids = lessons.map((l) => l.id)
    const [moved] = ids.splice(index, 1)
    ids.splice(index + delta, 0, moved!)
    reorder.mutate(ids)
  }

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    save.mutate({ title: String(data.get('title')).trim(), description: String(data.get('description')).trim() || null })
  }

  const handleAddLesson = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const title = String(new FormData(form).get('lessonTitle')).trim()
    if (title) addLesson.mutate(title, { onSuccess: () => form.reset() })
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
        {lessons.length === 0 ? (
          <EmptyState>{t('admin.noLessons')}</EmptyState>
        ) : (
          <ol className="space-y-2">
            {lessons.map((lesson, i) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                index={i}
                isFirst={i === 0}
                isLast={i === lessons.length - 1}
                busy={reorder.isPending || deleteLesson.isPending || renameLesson.isPending}
                onMove={move}
                onRename={(title) => renameLesson.mutate({ lessonId: lesson.id, title })}
                onDelete={() => {
                  if (window.confirm(t('admin.confirmDeleteLesson'))) deleteLesson.mutate(lesson.id)
                }}
              />
            ))}
          </ol>
        )}
        <form onSubmit={handleAddLesson} className="mt-5 flex gap-2">
          <TextInput name="lessonTitle" required maxLength={200} placeholder={t('admin.lessonPlaceholder')} aria-label={t('admin.addLesson')} />
          <Button type="submit" variant="secondary" disabled={addLesson.isPending}>
            {t('admin.addLesson')}
          </Button>
        </form>
      </Panel>
    </div>
  )
}

interface LessonRowProps {
  lesson: Lesson
  index: number
  isFirst: boolean
  isLast: boolean
  busy: boolean
  onMove: (index: number, delta: number) => void
  onRename: (title: string) => void
  onDelete: () => void
}

function LessonRow({ lesson, index, isFirst, isLast, busy, onMove, onRename, onDelete }: LessonRowProps) {
  const { t } = useI18n()
  const [editing, setEditing] = useState(false)
  const iconButton =
    'flex h-8 w-8 items-center justify-center rounded-full border border-teal-950/15 text-sm text-teal-950 transition-colors hover:bg-teal-950/5 disabled:opacity-30'

  const handleRename = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const title = String(new FormData(e.currentTarget).get('title')).trim()
    if (title && title !== lesson.title) onRename(title)
    setEditing(false)
  }

  return (
    <li className="flex items-center gap-3 rounded-xl border border-teal-950/8 px-3 py-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-950 text-xs font-bold text-gold-300">
        {index + 1}
      </span>
      {editing ? (
        <form onSubmit={handleRename} className="flex flex-1 gap-2">
          <TextInput name="title" defaultValue={lesson.title} required maxLength={200} autoFocus aria-label={t('admin.lessonPlaceholder')} />
          <Button type="submit" variant="secondary">
            {t('common.save')}
          </Button>
        </form>
      ) : (
        <span className="flex-1 text-sm font-medium text-teal-950">{lesson.title}</span>
      )}
      <div className="flex shrink-0 gap-1">
        <button className={iconButton} disabled={busy || isFirst} onClick={() => onMove(index, -1)} aria-label={t('admin.moveUp')}>
          ↑
        </button>
        <button className={iconButton} disabled={busy || isLast} onClick={() => onMove(index, 1)} aria-label={t('admin.moveDown')}>
          ↓
        </button>
        {!editing && (
          <button className={iconButton} disabled={busy} onClick={() => setEditing(true)} aria-label={t('common.edit')}>
            ✎
          </button>
        )}
        <button className={`${iconButton} hover:bg-red-50 hover:text-red-700`} disabled={busy} onClick={onDelete} aria-label={t('common.delete')}>
          ×
        </button>
      </div>
    </li>
  )
}
