import { useI18n } from '../../i18n/I18nContext'
import { AvatarGlyph } from '../ui/storyGlyphs'
import { ScrollStorySection, type StoryChapter } from './ScrollStorySection'
import { testimonials } from '../../data/mockTestimonials'

export function TestimonialsStory() {
  const { locale } = useI18n()

  const chapters: StoryChapter[] = testimonials.map((item) => ({
    label: item.name[locale],
    title: item.name[locale],
    text: `“${item.quote[locale]}”`,
    meta: `${item.location[locale]} · ${item.program[locale]}`,
    badge: true,
    renderIcon: (draw, className) => <AvatarGlyph draw={draw} initials={item.initials} className={className} />,
  }))

  return <ScrollStorySection chapters={chapters} vhPerChapter={80} vhPerTransition={26} />
}
