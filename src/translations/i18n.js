import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from 'translations/Resources';
import { getCoreSettingsSync } from 'utils/ElectronIpc';

const settings = getCoreSettingsSync();

export function initializeI18N() {
    i18next
        .use(initReactI18next)
        .init({
            resources,
            lng: settings.language,
            interpolation: {
                escapeValue: false
            }
        });
}