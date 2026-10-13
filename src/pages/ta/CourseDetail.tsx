import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { taApi } from '../../api/endpoints'
import type { ProgramStatus, TaCourse, UpdateTaCourseRequest } from '../../api/types'
import { useI18n } from '../../i18n/I18nContext'
import { toMajorUnits, toMinorUnits } from '../../lib/format'
import { PROGRAM_STATUSES, programStatusTone } from '../../lib/labels'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { LessonEditor } from '../../components/dashboard/LessonEditor'
import { PageHeader, Panel } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Label, TextArea, TextInput } from '../../components/ui/Field'
import { Pill } from '../../components/ui/Pill'
import { PageLoader } from '../../components/ui/Spinner'

export function TaCourseDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useI18n()
  const navigate = useNavigate()
  const errorMessage = useErrorMessage()
  const queryClient = useQueryClient()
  const queryKey = ['ta', 'course', id]
  const [priceError, setPriceError] = useState<string | null>(null)

  const course = useQuery({ queryKey, queryFn: () => taApi.course(id!) })

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['ta'] })
    queryClient.invalidateQueries({ queryKey: ['offerings'] })
    queryClient.invalidateQueries({ queryKey: ['programs'] })
  }
  const setCourse = (updated: TaCourse) => {
    queryClient.setQueryData(queryKey, updated)
    refresh()
  }

  const save = useMutation({ mutationFn: (body: UpdateTaCourseRequest) => taApi.updateCourse(id!, body), onSuccess: setCourse })
  const changeStatus = useMutation({ mutationFn: (s: ProgramStatus) => taApi.changeCourseStatus(id!, s), onSuccess: setCourse })
  const remove = useMutation({
    mutationFn: () => taApi.deleteCourse(id!),
    onSuccess: () => {
      refresh()
      navigate('/ta/courses')
    },
  })

  if (course.isPending) return <PageLoader />
  if (course.isError) return <Alert tone="error">{errorMessage(course.error)}</Alert>

  const c = course.data
  const mutationError = [save, changeStatus, remove].find((m) => m.isError)?.error
  const body = (overrides: Partial<UpdateTaCourseRequest> = {}): UpdateTaCourseRequest => ({
    title: c.title,
    description: c.description,
    monthlyPriceMinorUnits: c.monthlyPriceMinorUnits,
    capacity: c.capacity,
    isActive: c.isActive,
    ...overrides,
  })

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const price = toMinorUnits(String(data.get('price')), c.currency)
    if (price === null) {
      setPriceError(t('offerings.invalidPrice'))
      return
    }
    setPriceError(null)
    save.mutate(
      body({
        title: String(data.get('title')).trim(),
        description: String(data.get('description')).trim() || null,
        monthlyPriceMinorUnits: price,
        capacity: Number(data.get('capacity')),
      }),
    )
  }

  return (
    <div className="space-y-6">
      <Link to="/ta/courses" className="text-sm font-semibold text-teal-700 hover:underline">
        ← {t('courses.title')}
      </Link>
      <PageHeader
        title={c.title}
        description={t('courses.studentCount').replace('{count}', String(c.studentCount))}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={programStatusTone(c.status)}>{t(`programStatus.${c.status}`)}</Pill>
            {PROGRAM_STATUSES.filter((s) => s !== c.status).map((s) => (
              <Button key={s} variant={s === 'Published' ? 'primary' : 'ghost'} onClick={() => changeStatus.mutate(s)} disabled={changeStatus.isPending}>
                {t(`admin.statusAction.${s}`)}
              </Button>
            ))}
            <Button variant="secondary" onClick={() => save.mutate(body({ isActive: !c.isActive }))} disabled={save.isPending}>
              {c.isActive ? t('courses.pauseEnrollment') : t('courses.resumeEnrollment')}
            </Button>
            <Button
              variant="ghost"
              className="border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50"
              disabled={remove.isPending}
              onClick={() => {
                if (window.confirm(t('courses.confirmDelete'))) remove.mutate()
              }}
            >
              {t('courses.deleteCourse')}
            </Button>
          </div>
        }
      />

      {c.status !== 'Published' && <Alert tone="warning">{t('courses.notPublishedNote')}</Alert>}
      {!c.isActive && <Alert tone="warning">{t('courses.pausedNote')}</Alert>}
      {(priceError || mutationError) && <Alert tone="error">{priceError ?? errorMessage(mutationError)}</Alert>}

      <Panel title={t('admin.programDetails')}>
        <form key={`${c.title}|${c.description}|${c.monthlyPriceMinorUnits}|${c.capacity}`} onSubmit={handleSave} className="space-y-5">
          <div>
            <Label htmlFor="edit-course-title">{t('admin.programTitle')}</Label>
            <TextInput id="edit-course-title" name="title" required maxLength={200} defaultValue={c.title} />
          </div>
          <div>
            <Label htmlFor="edit-course-description">{t('admin.programDescription')}</Label>
            <TextArea id="edit-course-description" name="description" rows={3} maxLength={4000} defaultValue={c.description ?? ''} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="edit-course-price">
                {t('offerings.monthlyPrice')} ({c.currency})
              </Label>
              <TextInput
                id="edit-course-price"
                name="price"
                inputMode="decimal"
                required
                dir="ltr"
                defaultValue={toMajorUnits(c.monthlyPriceMinorUnits, c.currency)}
              />
            </div>
            <div>
              <Label htmlFor="edit-course-capacity">{t('offerings.capacity')}</Label>
              <TextInput id="edit-course-capacity" name="capacity" type="number" min={1} max={1000} required dir="ltr" defaultValue={c.capacity} />
            </div>
          </div>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? t('common.saving') : t('common.save')}
          </Button>
        </form>
      </Panel>

      <Panel title={t('admin.lessonsTitle')}>
        <p className="mb-4 text-xs text-ink-500">{t('admin.lessonsNote')}</p>
        <LessonEditor
          lessons={c.lessons}
          onChanged={() => queryClient.invalidateQueries({ queryKey })}
          lessonApi={{
            add: (title) => taApi.addLesson(id!, title),
            rename: (lessonId, title) => taApi.updateLesson(id!, lessonId, title),
            remove: (lessonId) => taApi.deleteLesson(id!, lessonId),
            reorder: (ids) => taApi.reorderLessons(id!, ids),
          }}
        />
      </Panel>
    </div>
  )
}
