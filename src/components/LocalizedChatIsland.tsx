import type { Language } from '../data/tools/types';
import { TranslationProvider } from '../i18n/useTranslation';
import Chat from './Chat';

export default function LocalizedChatIsland({ lang }: { lang: Language }) {
  return (
    <TranslationProvider initialLanguage={lang}>
      <Chat />
    </TranslationProvider>
  );
}
