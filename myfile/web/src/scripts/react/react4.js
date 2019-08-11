
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
            <pre>{`
    //第一步，创建action
    const addOne = {
        type: 'ADD',
        num: 1
    }
    const addTwo = {
        type: 'ADD',
        num: 2
    }
    const square = {
        type: 'SQUARE'
    }
    
    //第二步，创建reducer
    let math = (state = 10, action) => {
        switch (action.type) {
        case ADD:
            return state + action.num
        case SQUARE:
            return state * state
        default:
            return state
        }
    }
    //第三步，创建store
    import { createStore } from 'redux'
    // const store = createStore(math)
    
    //第四步，测试，通过dispatch发出action，并通过getState()取得当前state值
    console.log(store.getState()) //默认值为10
    
    createStore(math).dispatch(addOne) //发起'+1'的action
    console.log(store.getState()) //当前值为10+1=11
    
    createStore(math).dispatch(square) //发起'乘方'的action
    console.log(store.getState()) //当前值为11*11=121
    
    createStore(math).dispatch(addTwo) //发起'+2'的action
    console.log(store.getState()) //当前值为121+2=123
`}</pre>
            </div>
    
        )
    }
}


