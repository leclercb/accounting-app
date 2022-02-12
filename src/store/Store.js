import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import Reducers from 'reducers/Reducers';

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [
    thunk
];

export const store = createStore(
    Reducers,
    composeEnhancers(applyMiddleware(
        thunk,
        ...middlewares
    )));