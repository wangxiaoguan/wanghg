

import {createStore,applyMiddleware} from "redux"
import reducers from "./reducers";

import thunk from "redux-thunk"
import promise from "redux-promise"

import createSagaMiddleware, { END } from 'redux-saga'

import watchAsync from './sagas'

const sagaMiddleware = createSagaMiddleware();


const store = createStore(reducers,applyMiddleware(thunk,promise,sagaMiddleware));

store.runSaga = sagaMiddleware.run;
store.runSaga(watchAsync);
store.close = () => store.dispatch(END);


export default store;