

import React, {Component} from "react"
import ReactDOM, {render} from 'react-dom'


import { Counter } from "./counter";

import store from "./store";//store={action.city与state }对象

const hotRender = () => (
    render(
        <Counter {...store.getState()} />,
        document.getElementById("app")
    )
)

hotRender()

store.subscribe(hotRender)


