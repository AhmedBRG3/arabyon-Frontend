import { ProgramPage } from '../components/sections/ProgramPage'
import { SpeakIcon, HeadphonesIcon, BookIcon, PencilIcon } from '../components/ui/icons'

export function ProgramsIGCSE() {
  return <ProgramPage ns="programs.igcse" skillIcons={[SpeakIcon, HeadphonesIcon, BookIcon, PencilIcon]} />
}
