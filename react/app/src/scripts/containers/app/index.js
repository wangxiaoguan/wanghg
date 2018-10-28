

import React,{Component} from "react";
import "./index.scss";
import {Switch,Route,Redirect} from "react-router-dom"


import {Home} from "../home"//首页
import {Sort} from "../sort"//分类
import {Car} from "../car"//购物车
import {Mine} from "../mine"//个人中心


import {Foot} from "../../components/foot";
 
export class App extends Component{
    render(){
        return (
            <div className="app">
                <Switch>
                    <Route path="/app/home" component={Home}/>
                    <Route path="/app/sort" component={Sort}/>
                    <Route path="/app/car" component={Car}/>
                    <Route path="/app/mine" component={Mine}/>
                    <Route render={()=>(<Redirect to="/app/home"  /> ) }   />
                    <Route component={Home}/>
                </Switch>
                <Foot/>
            </div>
        )
    }
}