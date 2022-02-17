import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from 'translations/Resources';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export const t = i18n.t;

export default i18n;