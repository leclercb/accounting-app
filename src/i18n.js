import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            'Expenses': 'Expenses',
            'Income': 'Income',
            'Movements': 'Movements',
            'Rules': 'Rules'
        }
    },
    fr: {
        translation: {
            'Expenses': 'Dépenses',
            'Income': 'Revenus',
            'Movements': 'Mouvements',
            'Rules': 'Règles'
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;