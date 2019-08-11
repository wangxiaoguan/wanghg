

import {createStore } from 'redux'
import reducers from './reducers';
const store = createStore(reducers);   // 接收reducers 作为参数 
export default store;

