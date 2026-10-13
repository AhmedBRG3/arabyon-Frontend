import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { Lesson } from '../../api/types'
import { useI18n } from '../../i18n/I18nContext'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { EmptyState } from './Panel'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { TextInput } from '../ui/Field'

/** The lesson endpoints of one program; admins use /programs/{id}, tutors /ta/courses/{id}. */
export interface LessonApi {
  add: (title: string) => Promise<unknown>
  rename: (lessonId: string, title: string) => Promise<unknown>
  remove: (lessonId: string) => Promise<unknown>
  reorder: (lessonIds: string[]) => Promise<unknown>
}

/** Ordered lesson list with add, rename, delete and move up/down. */
export function LessonEditor({ lessons, lessonApi, onChanged }: { lessons: Lesson[]; lessonApi: LessonApi; onChanged: () => void }) {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()

  const addLesson = useMutation({ mutationFn: lessonApi.add, onSuccess: onChanged })
  const renameLesson = useMutation({
    mutationFn: ({ lessonId, title }: { lessonId: string; title: string }) => lessonApi.rename(lessonId, title),
    onSuccess: onChanged,
  })
  const deleteLesson = useMutation({ mutationFn: lessonApi.remove, onSuccess: onChanged })
  const reorder = useMutation({ mutationFn: lessonApi.reorder, onSuccess: onChanged })

  const sorted = [...lessons].sort((a, b) => a.order - b.order)
  const mutationError = [addLesson, renameLesson, deleteLesson, reorder].find((m) => m.isError)?.error

  const move = (index: number, delta: number) => {
    const ids = sorted.map((l) => l.id)
    const [moved] = ids.splice(index, 1)
    ids.splice(index + delta, 0, moved!)
    reorder.mutate(ids)
  }

  const handleAddLesson = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const title = String(new FormData(form).get('lessonTitle')).trim()
    if (title) addLesson.mutate(title, { onSuccess: () => form.reset() })
  }

  return (
    <>
      {mutationError && (
        <Alert tone="error" className="mb-4">
          {errorMessage(mutationError)}
        </Alert>
      )}
      {sorted.length === 0 ? (
        <EmptyState>{t('admin.noLessons')}</EmptyState>
      ) : (
        <ol className="space-y-2">
          {sorted.map((lesson, i) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              index={i}
              isFirst={i === 0}
              isLast={i === sorted.length - 1}
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
    </>
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
