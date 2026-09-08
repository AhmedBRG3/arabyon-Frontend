import { useI18n } from '../../i18n/I18nContext'
import { BookGlyph, CapGlyph } from '../ui/storyGlyphs'
import { ScrollStorySection, type StoryChapter } from './ScrollStorySection'

export function ProgramsStory() {
  const { t } = useI18n()

  const chapters: StoryChapter[] = [
    {
      label: t('programs.conversational.kicker'),
      kicker: t('programs.conversational.kicker'),
      title: t('programs.conversational.title'),
      text: t('programs.conversational.sub'),
      renderIcon: (draw, className) => <BookGlyph draw={draw} className={className} />,
      to: '/programs/conversational',
      ctaLabel: t('common.learnMore'),
    },
    {
      label: t('programs.igcse.kicker'),
      kicker: t('programs.igcse.kicker'),
      title: t('programs.igcse.title'),
      text: t('programs.igcse.sub'),
      renderIcon: (draw, className) => <CapGlyph draw={draw} className={className} />,
      to: '/programs/igcse',
      ctaLabel: t('common.learnMore'),
    },
  ]

  return <ScrollStorySection chapters={chapters} vhPerChapter={90} vhPerTransition={30} />
}
