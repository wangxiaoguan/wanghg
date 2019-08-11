

import React,{Component} from "react";
import ReactDOM , {render} from "react-dom";  //render  = ReactDOM.render

const rootElement = document.getElementById("app")

import {HashRouter as Router} from "react-router-dom";

import {Layout} from "./containers";

const hotRender = (Component)=>{
    render(
        <Router
            basename = "/"
        >
            <Component/>
        </Router>,
        rootElement
    )
}

hotRender(Layout);





