

import {createStore } from 'redux';

import reducers from './reducer';

const store = createStore(reducers);//action.city与state     接收reducers 作为参数 

export default store;

