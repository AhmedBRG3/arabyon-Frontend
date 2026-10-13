import { ApiError } from '../api/client'
import { useI18n } from '../i18n/I18nContext'

// The API returns English ProblemDetails titles only. Known ones get a translated message;
// a machine-readable error code from the API would make this map unnecessary.
const knownTitles: Record<string, string> = {
  'Invalid email or password.': 'errors.invalidCredentials',
  'Account is disabled.': 'errors.accountDisabled',
  'Email is already registered.': 'errors.emailTaken',
  'Invalid or expired token.': 'errors.invalidToken',
  'Current password is incorrect.': 'errors.wrongPassword',
  'You already have an offering for this program.': 'errors.offeringExists',
  'Offerings can only be created for published programs.': 'errors.programNotPublished',
  'Add at least one lesson before publishing.': 'errors.needLesson',
  'You cannot remove your own Admin role.': 'errors.ownAdminRole',
  'A user must keep at least one role.': 'errors.lastRole',
  "Deactivate this TA's offerings before removing the TA role.": 'errors.taHasOfferings',
  'You cannot change your own status.': 'errors.ownStatus',
  'End time must be after the start time.': 'errors.sessionEndBeforeStart',
  'Start time must be in the future.': 'errors.sessionStartInPast',
  'No Zoom license is free for that time. Pick a different time or ask an admin to add another license.':
    'errors.noLicenseAvailable',
  'That Zoom license was just booked by another session. Please try again.': 'errors.licenseJustBooked',
  'Zoom API request failed.': 'errors.zoomFailed',
  'Every lesson needs a title of at most 200 characters.': 'errors.lessonTitles',
  'This course belongs to another tutor.': 'errors.courseNotYours',
  'This course is no longer offered.': 'errors.courseUnavailable',
  'A session that has already ended cannot be canceled.': 'errors.sessionEnded',
  'This Zoom user is already registered as a license.': 'errors.licenseExists',
  'This course has students enrolled and cannot be deleted. Archive it instead.': 'errors.courseHasStudents',
  'You cannot subscribe to your own course.': 'errors.ownCourse',
  'This course is full.': 'errors.courseFull',
  'This course has scheduled or past classes and cannot be deleted. Archive it instead.': 'errors.courseHasClasses',
}

const byStatus: Record<number, string> = {
  0: 'errors.network',
  400: 'errors.validation',
  401: 'errors.unauthorized',
  403: 'errors.forbidden',
  404: 'errors.notFound',
  409: 'errors.conflict',
  429: 'errors.rateLimited',
}

/** Turns anything thrown by the API client into a message in the active language. */
export function useErrorMessage() {
  const { t, locale } = useI18n()

  return (error: unknown): string => {
    if (!(error instanceof ApiError)) return t('common.errorTryAgain')

    const known = knownTitles[error.title]
    if (known) return t(known)

    // Unmapped 4xx titles are still informative in English; Arabic gets the generic status message.
    if (locale === 'en' && error.status >= 400 && error.status < 500 && error.status !== 400 && error.title) {
      return error.title
    }
    if (error.status === 400 && locale === 'en') {
      const first = Object.values(error.fieldErrors)[0]?.[0]
      if (first) return first
    }
    return t(byStatus[error.status] ?? 'errors.server')
  }
}
