

import React, {Component} from "react"
import ReactDOM, {render} from 'react-dom'
import { Counter } from "./views/counter";
import store from "./store";
import { increment, decrement } from "./actions";

const hotRender = () => (
    render(
        <Counter
        value = {store.getState()}
        {...store.getState()}
        increment = { ()=>store.dispatch(  increment()   ) }
        decrement = { (count)=>store.dispatch( decrement(count) )}
        />,
        document.getElementById("app")
    )
)


hotRender()

// 监听 
store.subscribe(hotRender)


