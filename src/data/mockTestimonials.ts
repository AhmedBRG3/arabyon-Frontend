// Placeholder testimonials — replace with real student quotes before launch.
export interface Testimonial {
  name: { en: string; ar: string }
  location: { en: string; ar: string }
  quote: { en: string; ar: string }
  program: { en: string; ar: string }
  initials: string
}

export const testimonials: Testimonial[] = [
  {
    name: { en: 'Sarah M.', ar: 'سارة م.' },
    location: { en: 'Toronto, Canada', ar: 'تورنتو، كندا' },
    quote: {
      en: 'I went from knowing zero Arabic to holding real conversations with my in-laws in eight months.',
      ar: 'انتقلت من عدم معرفة أي شيء بالعربية إلى إجراء محادثات حقيقية مع أهل زوجي خلال ثمانية أشهر.',
    },
    program: { en: 'Conversational Arabic', ar: 'المحادثة بالعربية' },
    initials: 'SM',
  },
  {
    name: { en: 'Omar K.', ar: 'عمر ك.' },
    location: { en: 'Dubai, UAE', ar: 'دبي، الإمارات' },
    quote: {
      en: 'My daughter went from a C to an A* in her IGCSE Arabic mock exams after two terms of tutoring.',
      ar: 'انتقلت ابنتي من تقدير C إلى A* في امتحانات آي جي سي إس إي التجريبية بعد فصلين من الدروس.',
    },
    program: { en: 'IGCSE Arabic', ar: 'عربي آي جي سي إس إي' },
    initials: 'OK',
  },
  {
    name: { en: 'Layla H.', ar: 'ليلى ح.' },
    location: { en: 'Vancouver, Canada', ar: 'فانكوفر، كندا' },
    quote: {
      en: 'The scheduling flexibility made it actually possible to keep up lessons around my work travel.',
      ar: 'مرونة الجدولة جعلت من الممكن فعليًا الاستمرار في الدروس رغم سفر العمل.',
    },
    program: { en: 'Conversational Arabic', ar: 'المحادثة بالعربية' },
    initials: 'LH',
  },
]
