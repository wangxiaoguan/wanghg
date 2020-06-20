
import React,{Component} from "react";
import './react.scss'
export default class React4 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='react4'> 
                <h1>React-Redux的使用步骤</h1>
                <h2>type.js</h2>
<pre>{`
    export const ArticleData = 'ArticleData';
    export const FileData = 'FileData';
    export const FormData ='FormData';
`}</pre>
                <h2>action.js</h2>
<pre>{`
    import {ArticleData,FileData,FormData} from './type.js';
    export function setArticleData(n) {return { type: ArticleData, payload: n }}
    export function setFileData(n) {return { type: FileData, payload: n }}
    export function setFormData(n) {return { type: FormData, payload: n }}
`}</pre>    
                <h2>reducer.js</h2>
<pre>{`
    import { combineReducers } from 'redux';
    import {ArticleData,ActivityData,FormData} from './type.js';
    const articleData = (state = {}, action = {}) => {
        switch (action.type) {
            case ArticleData:
                return action.payload;
            default:
                return state;
        }
    };
    const activityData = (state = {}, action = {}) => {
        switch (action.type) {
            case ActivityData:
                return action.payload;
            default:
                return state;
        }
    };
    const formData = (state = {}, action = {}) => {
        switch (action.type) {
            case FormData:
                return action.payload;
            default:
                return state;
        }
    };
    export default combineReducers({
        articleData,
        activityData,
        formData,
    });
`}</pre>
                <h2>store.js</h2>
<pre>{`
    import {createStore} 'redux';
    import reducer from './reducer.js';
    export default createStore(
        reducer
    );
`}</pre>
                <h2>使用store</h2>
<pre>{`
    import store from './store.js'
    import {setArticleData,setFileData,setFormData} from './action.js';

    获取store状态数据
    store.getState()

    修改store状态数据
    store.dispatch(setArticleData(data1))
    store.dispatch(setFileData(data2))
    store.dispatch(setFormData(data3))

    监听函数
    store.subscribe(Func) 
`}</pre>
            </div>
    
        )
    }
}


