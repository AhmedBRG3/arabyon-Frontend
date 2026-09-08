// Placeholder sample schedule — for illustration only, not real bookable slots.
export interface ScheduleSlot {
  day: { en: string; ar: string }
  canadaTime: string
  uaeTime: string
  format: { en: string; ar: string }
}

export const scheduleSlots: ScheduleSlot[] = [
  { day: { en: 'Monday', ar: 'الإثنين' }, canadaTime: '6:00 PM EST', uaeTime: '3:00 AM GST', format: { en: '1-on-1', ar: 'فردي' } },
  { day: { en: 'Tuesday', ar: 'الثلاثاء' }, canadaTime: '9:00 AM PST', uaeTime: '8:00 PM GST', format: { en: 'Group', ar: 'جماعي' } },
  { day: { en: 'Wednesday', ar: 'الأربعاء' }, canadaTime: '7:30 PM EST', uaeTime: '4:30 AM GST', format: { en: '1-on-1', ar: 'فردي' } },
  { day: { en: 'Thursday', ar: 'الخميس' }, canadaTime: '10:00 AM PST', uaeTime: '9:00 PM GST', format: { en: 'Group', ar: 'جماعي' } },
  { day: { en: 'Saturday', ar: 'السبت' }, canadaTime: '11:00 AM EST', uaeTime: '8:00 PM GST', format: { en: '1-on-1', ar: 'فردي' } },
]
