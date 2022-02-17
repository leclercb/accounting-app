import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from 'translations/Resources';
import { getCoreSettings } from 'utils/ElectronIpc';

const settings = getCoreSettings();
console.log(settings);

export function initializeI18N() {
    i18next
        .use(initReactI18next)
        .init({
            resources,
            lng: 'en',
            languages: ['en', 'fr'],
            interpolation: {
                escapeValue: false
            }
        });
}