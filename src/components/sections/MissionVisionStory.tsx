import { useI18n } from '../../i18n/I18nContext'
import { EyeGlyph, CompassGlyph } from '../ui/storyGlyphs'
import { ScrollStorySection, type StoryChapter } from './ScrollStorySection'

export function MissionVisionStory() {
  const { t } = useI18n()

  const chapters: StoryChapter[] = [
    {
      label: t('home.visionTitle'),
      title: t('home.visionTitle'),
      text: t('home.visionText'),
      renderIcon: (draw, className) => <EyeGlyph draw={draw} className={className} />,
    },
    {
      label: t('home.missionTitle'),
      title: t('home.missionTitle'),
      text: t('home.missionText'),
      renderIcon: (draw, className) => <CompassGlyph draw={draw} className={className} />,
    },
  ]

  return <ScrollStorySection chapters={chapters} showScrollHint vhPerChapter={100} vhPerTransition={40} />
}
