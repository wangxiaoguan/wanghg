

import React, {Component} from "react";

import {Switch,Route,Redirect,NavLink} from "react-router-dom"
import Home from "./home";
import Good from "./good";
import My from "./my";


const activeStyle = {color:"orange",background:"yellowgreen"};
const op = {flex:1,height:50,lineHeight:'50px',textAlign:"center"}

export default class App extends Component{
    render(){
        return (
            <div>
                 <div style={{border:'3px solid blue',display:"flex",width:"50%",height:50}}>
                    <p style={op}><NavLink activeStyle={activeStyle} to="/app/home" exact  >首页</NavLink></p>
                    <p style={op}><NavLink activeStyle={activeStyle} to="/app/good" exact  >商品列表</NavLink></p>
                    <p style={op}><NavLink activeStyle={activeStyle} to="/app/car" exact  >购物车</NavLink></p>
                    <p style={op}><NavLink activeStyle={activeStyle} to="/app/my" exact  >我</NavLink></p>
                </div>
                <div style={{border:'3px solid yellowgreen'}}>
                    <Switch>
                        <Route path="/app/home" component={Home} />
                        <Route path="/app/good" component={Good} />
                        <Route path="/app/car" component={Car} />
                        <Route path="/app/my" component={My} />
                        <Redirect from="/app/" to="/app/home"/>
                       
                        {/* <Route component={Home} /> */}
                    </Switch>
                </div>
               
            </div>
        )
    }
}


const Car = ({login}) =>{
    console.log(login);
    // if(!login){
    //   return  ( <Redirect to="/app/my"  />)
    // }
    return (
        <div>
            <h1>car-car-car </h1>
            <h2>等待开发中....</h2>
        </div>
    )
}

