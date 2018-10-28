
//Action 是一个对象。其中的type属性是必须的，表示 Action 的名称。
//const action = {type: 'ADD_TODO', payload: 'Learn Redux'};


import city from './city';

import num from './number';

import msg from './msg'

import {combineReducers} from 'redux'




const reducers= combineReducers({
    city,num,msg
})


export default reducers