//store
import {
  createStore,
  applyMiddleware,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
// import { createLogger } from 'redux-logger';
import rootSaga from './sagas';
import reducer from './reducer';
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];
// Store
export default createStore(
  reducer,
  applyMiddleware(...middlewares)
);
sagaMiddleware.run(rootSaga);



