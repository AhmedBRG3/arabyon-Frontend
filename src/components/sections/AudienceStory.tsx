import { useI18n } from '../../i18n/I18nContext'
import { SpeakGlyph, CapGlyph, BookGlyph } from '../ui/storyGlyphs'
import { ScrollStorySection, type StoryChapter } from './ScrollStorySection'

export function AudienceStory() {
  const { t } = useI18n()

  const chapters: StoryChapter[] = [
    {
      label: t('home.audienceSpeakTitle'),
      title: t('home.audienceSpeakTitle'),
      text: t('home.audienceSpeakDesc'),
      renderIcon: (draw, className) => <SpeakGlyph draw={draw} className={className} />,
      to: '/programs/conversational',
      ctaLabel: t('common.learnMore'),
    },
    {
      label: t('home.audienceIgcseTitle'),
      title: t('home.audienceIgcseTitle'),
      text: t('home.audienceIgcseDesc'),
      renderIcon: (draw, className) => <CapGlyph draw={draw} className={className} />,
      to: '/programs/igcse',
      ctaLabel: t('common.learnMore'),
    },
    {
      label: t('home.audienceUaeTitle'),
      title: t('home.audienceUaeTitle'),
      text: t('home.audienceUaeDesc'),
      renderIcon: (draw, className) => <BookGlyph draw={draw} className={className} />,
      to: '/programs/uae',
      ctaLabel: t('common.learnMore'),
    },
  ]

  return <ScrollStorySection chapters={chapters} vhPerChapter={80} vhPerTransition={26} />
}
