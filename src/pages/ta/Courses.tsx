import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { taApi } from '../../api/endpoints'
import type { CreateTaCourseRequest, TaCourse } from '../../api/types'
import { useI18n } from '../../i18n/I18nContext'
import { formatMoney, toMinorUnits } from '../../lib/format'
import { CURRENCIES, programStatusTone } from '../../lib/labels'
import { useErrorMessage } from '../../lib/useErrorMessage'
import { EmptyState, PageHeader, Panel } from '../../components/dashboard/Panel'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Label, Select, TextArea, TextInput } from '../../components/ui/Field'
import { Pill } from '../../components/ui/Pill'
import { PageLoader } from '../../components/ui/Spinner'

/** Courses the tutor authored, each with its own monthly price. */
export function TaCourses() {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const [creating, setCreating] = useState(false)
  const courses = useQuery({ queryKey: ['ta', 'courses'], queryFn: taApi.courses })

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('courses.title')}
        description={t('courses.sub')}
        actions={!creating && <Button onClick={() => setCreating(true)}>{t('courses.new')}</Button>}
      />

      {creating && <CreateCourseForm onCancel={() => setCreating(false)} />}

      {courses.isPending && <PageLoader />}
      {courses.isError && <Alert tone="error">{errorMessage(courses.error)}</Alert>}
      {courses.data?.length === 0 && !creating && <EmptyState>{t('courses.empty')}</EmptyState>}
      {courses.data && courses.data.length > 0 && (
        <ul className="space-y-4">
          {courses.data.map((course) => (
            <CourseRow key={course.id} course={course} />
          ))}
        </ul>
      )}
    </div>
  )
}

function CourseRow({ course }: { course: TaCourse }) {
  const { t, locale } = useI18n()
  return (
    <li className="rounded-2xl border border-teal-950/8 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/ta/courses/${course.id}`} className="font-bold text-teal-950 hover:underline">
              {course.title}
            </Link>
            <Pill tone={programStatusTone(course.status)}>{t(`programStatus.${course.status}`)}</Pill>
            {!course.isActive && <Pill tone="gray">{t('offerings.inactive')}</Pill>}
          </div>
          <p className="mt-1 text-sm text-ink-500">
            {formatMoney(course.monthlyPriceMinorUnits, course.currency, locale)} {t('tutors.perMonth')} ·{' '}
            {t('admin.lessonCount').replace('{count}', String(course.lessons.length))} ·{' '}
            {t('courses.studentCount').replace('{count}', String(course.studentCount))}
          </p>
        </div>
        <Button variant="ghost" to={`/ta/courses/${course.id}`}>
          {t('courses.manage')}
        </Button>
      </div>
    </li>
  )
}

function CreateCourseForm({ onCancel }: { onCancel: () => void }) {
  const { t } = useI18n()
  const errorMessage = useErrorMessage()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const create = useMutation({
    mutationFn: (body: CreateTaCourseRequest) => taApi.createCourse(body),
    onSuccess: (course) => {
      queryClient.invalidateQueries({ queryKey: ['ta'] })
      queryClient.invalidateQueries({ queryKey: ['offerings'] })
      navigate(`/ta/courses/${course.id}`)
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
      title: String(data.get('title')).trim(),
      description: String(data.get('description')).trim() || null,
      monthlyPriceMinorUnits: price,
      currency,
      capacity: Number(data.get('capacity')),
      lessons: String(data.get('lessons'))
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    })
  }

  return (
    <Panel title={t('courses.new')}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="course-title">{t('admin.programTitle')}</Label>
          <TextInput id="course-title" name="title" required maxLength={200} placeholder={t('courses.titlePlaceholder')} />
        </div>
        <div>
          <Label htmlFor="course-description">{t('admin.programDescription')}</Label>
          <TextArea id="course-description" name="description" rows={3} maxLength={4000} />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <Label htmlFor="course-price">{t('offerings.monthlyPrice')}</Label>
            <TextInput id="course-price" name="price" inputMode="decimal" required dir="ltr" placeholder="1500" />
          </div>
          <div>
            <Label htmlFor="course-currency">{t('offerings.currency')}</Label>
            <Select id="course-currency" name="currency" defaultValue="EGP">
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="course-capacity">{t('offerings.capacity')}</Label>
            <TextInput id="course-capacity" name="capacity" type="number" min={1} max={1000} required defaultValue={20} dir="ltr" />
          </div>
        </div>
        <div>
          <Label htmlFor="course-lessons">{t('courses.lessons')}</Label>
          <TextArea id="course-lessons" name="lessons" rows={4} placeholder={t('courses.lessonsPlaceholder')} />
          <p className="mt-1.5 text-xs text-ink-500">{t('courses.lessonsHint')}</p>
        </div>
        {(formError || create.isError) && <Alert tone="error">{formError ?? errorMessage(create.error)}</Alert>}
        <div className="flex gap-3">
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? t('common.saving') : t('courses.create')}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        </div>
      </form>
    </Panel>
  )
}
