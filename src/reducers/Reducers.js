import { combineReducers } from 'redux';
import undoable, { excludeAction } from 'redux-undo';
import App from 'reducers/App';
import AutoUpdater from 'reducers/AutoUpdater';
import Objects from 'reducers/Objects';
import Settings from 'reducers/Settings';
import Thread from 'reducers/Thread';

export default combineReducers({
    app: App(),
    autoUpdater: AutoUpdater(),
    movements: undoable(Objects('movements'), {
        limit: 10,
        filter: excludeAction(['SET_OBJECTS']),
        undoType: 'MOVEMENT_UNDO',
        redoType: 'MOVEMENT_REDO'
    }),
    rules: undoable(Objects('rules'), {
        limit: 10,
        filter: excludeAction(['SET_OBJECTS']),
        undoType: 'RULE_UNDO',
        redoType: 'RULE_REDO'
    }),
    settings: Settings(),
    thread: Thread()
});