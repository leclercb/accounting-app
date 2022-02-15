import { combineReducers } from 'redux';
import App from 'reducers/App';
import AutoUpdater from 'reducers/AutoUpdater';
import Objects from 'reducers/Objects';
import Settings from 'reducers/Settings';
import Thread from 'reducers/Thread';

export default combineReducers({
    app: App(),
    autoUpdater: AutoUpdater(),
    movements: Objects('movements'),
    rules: Objects('rules'),
    settings: Settings(),
    thread: Thread()
});