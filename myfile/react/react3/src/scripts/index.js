

import React,{Component} from "react";
import ReactDOM , {render} from "react-dom";  //render  = ReactDOM.render

const rootElement = document.getElementById("app")

import {HashRouter as Router} from "react-router-dom";

import {Layout} from "./containers";

import {Provider} from "react-redux"

import store from "./store"

const hotRender = (Component)=>{
    render(
        <Provider store={store}>
            <Router  basename = "/">
                <Component/>
            </Router>
        </Provider>,
        rootElement
    )
}

hotRender(Layout);



// import "./flux"
// import "./redux"
// import "./react-redux"
// import "./react-redux2"







