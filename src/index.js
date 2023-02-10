import React from 'react';
import { ConfigProvider, notification } from 'antd';
import { t } from 'i18next';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from 'App';
import { initializeShortcuts } from './shortcuts';
import LoadingIndicator from 'components/common/LoadingIndicator';
import { store } from 'store/Store';
import { initializeI18N } from 'translations/i18n';
import 'index.css';

initializeI18N();
initializeShortcuts();

window.addEventListener('error', function (e) {
    if (e.message === 'ResizeObserver loop limit exceeded') {
        return false;
    }

    // logger.error('Uncaught error', e);

    notification.error({
        message: t('error_occurred'),
        description: e.error ? e.error.toString() : e.message
    });

    return false;
});

ReactDOM.render(
    <ConfigProvider
        theme={{
            token: {
                colorPrimary: '#0e67c4',
                fontSize: 12
            },
            components: {
                Layout: {
                    colorBgHeader: '#0e67c4'
                }
            }
        }}>
        <Provider store={store}>
            <React.Suspense fallback={(<LoadingIndicator />)}>
                <App />
            </React.Suspense>
        </Provider>
    </ConfigProvider >,
    document.getElementById('root'));