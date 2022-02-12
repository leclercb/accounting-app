import { combineReducers } from 'redux';
import App from 'reducers/App';
import Objects from 'reducers/Objects';
import Settings from 'reducers/Settings';
import Thread from 'reducers/Thread';

export default combineReducers({
    app: App(),
    movements: Objects('movements'),
    rules: Objects('rules'),
    settings: Settings(),
    thread: Thread()
});