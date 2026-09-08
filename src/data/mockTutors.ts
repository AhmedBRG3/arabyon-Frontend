// Placeholder tutor bios — replace with real instructor profiles before launch.
export interface Tutor {
  name: { en: string; ar: string }
  role: { en: string; ar: string }
  bio: { en: string; ar: string }
  initials: string
}

export const tutors: Tutor[] = [
  {
    name: { en: 'Nadia F.', ar: 'نادية ف.' },
    role: { en: 'Conversational Arabic Lead', ar: 'مسؤولة برنامج المحادثة' },
    bio: {
      en: 'Native Egyptian Arabic speaker with 9 years teaching adult learners MSA and dialect.',
      ar: 'ناطقة أصلية باللهجة المصرية، بخبرة 9 سنوات في تدريس البالغين الفصحى واللهجات.',
    },
    initials: 'NF',
  },
  {
    name: { en: 'Yousef A.', ar: 'يوسف أ.' },
    role: { en: 'IGCSE Arabic Specialist', ar: 'مختص عربي آي جي سي إس إي' },
    bio: {
      en: 'Cambridge-trained educator specializing in First and Foreign Language Arabic exam prep.',
      ar: 'مربٍّ مدرّب من كامبريدج متخصص في تحضير امتحانات اللغة الأولى والأجنبية العربية.',
    },
    initials: 'YA',
  },
  {
    name: { en: 'Rania S.', ar: 'رانيا س.' },
    role: { en: 'Gulf Dialect Instructor', ar: 'مدرّسة اللهجة الخليجية' },
    bio: {
      en: 'Emirati instructor focused on practical, everyday Khaleeji conversation skills.',
      ar: 'مدرّسة إماراتية تركز على مهارات المحادثة الخليجية اليومية العملية.',
    },
    initials: 'RS',
  },
  {
    name: { en: 'Karim T.', ar: 'كريم ت.' },
    role: { en: 'IGCSE Arabic Tutor', ar: 'مدرّس عربي آي جي سي إس إي' },
    bio: {
      en: 'Edexcel examiner-trained tutor with a focus on writing and reading comprehension.',
      ar: 'مدرّس مدرّب على معايير ممتحني إيديكسل مع تركيز على الكتابة والفهم القرائي.',
    },
    initials: 'KT',
  },
]
