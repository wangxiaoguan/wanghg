

import React,{Component} from "react";

import ReactDOM , {render} from "react-dom";  //render  = ReactDOM.render

const rootElement = document.getElementById("app")

import {HashRouter as Router} from "react-router-dom";

import {Layout} from "./containers";//主视图

//第一种加载到视图方式 优点:如http://localhost:5000仍然可进入组件
// const hotRender = (Component)=>{
//     render(<Router basename = "/"><Component/></Router>,rootElement)}

// hotRender(Layout);

// import "./flux";

// import "./redux";

//第二种加载到视图方式 缺点:如http://localhost:5000不可进入组件
render(
    <Router>
        <Layout/>
    </Router>,rootElement)





