import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { notification } from 'antd';
import App from 'App';
import { initializeShortcuts } from './shortcuts';
import LoadingIndicator from 'components/common/LoadingIndicator';
import { store } from 'store/Store';
import 'i18n.js';
import 'index.css';

initializeShortcuts();

window.addEventListener('error', function (e) {
    if (e.message === 'ResizeObserver loop limit exceeded') {
        return false;
    }

    // logger.error('Uncaught error', e);

    notification.error({
        message: 'An error occurred',
        description: e.error ? e.error.toString() : e.message
    });

    return false;
});

ReactDOM.render(
    <Provider store={store}>
        <React.Suspense fallback={(<LoadingIndicator />)}>
            <App />
        </React.Suspense>
    </Provider>,
    document.getElementById('root'));