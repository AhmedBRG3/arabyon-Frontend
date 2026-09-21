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
      en: 'Native Arabic speaker with 9 years teaching adult learners Modern Standard Arabic (Fusha).',
      ar: 'ناطقة أصلية بالعربية، بخبرة 9 سنوات في تدريس العربية الفصحى للبالغين.',
    },
    initials: 'NF',
  },
  {
    name: { en: 'Yousef A.', ar: 'يوسف أ.' },
    role: { en: 'IGCSE Arabic Specialist', ar: 'مختص عربي آي جي سي إس إي' },
    bio: {
      en: 'Educator specializing in IGCSE Arabic exam preparation for Arab students.',
      ar: 'مربٍّ متخصص في تحضير الطلاب العرب لامتحانات اللغة العربية في آي جي سي إس إي.',
    },
    initials: 'YA',
  },
  {
    name: { en: 'Rania S.', ar: 'رانيا س.' },
    role: { en: 'UAE Curriculum Instructor', ar: 'مدرّسة المناهج الإماراتية' },
    bio: {
      en: 'Emirati instructor supporting students following the UAE Ministry of Education curriculum.',
      ar: 'مدرّسة إماراتية تدعم الطلاب الذين يدرسون منهج وزارة التربية والتعليم الإماراتية.',
    },
    initials: 'RS',
  },
  {
    name: { en: 'Karim T.', ar: 'كريم ت.' },
    role: { en: 'IGCSE Arabic Tutor', ar: 'مدرّس عربي آي جي سي إس إي' },
    bio: {
      en: 'IGCSE Arabic tutor with a focus on writing and reading comprehension.',
      ar: 'مدرّس عربي آي جي سي إس إي مع تركيز على الكتابة والفهم القرائي.',
    },
    initials: 'KT',
  },
]
