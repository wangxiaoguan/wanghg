
console.log("走秀");

import React, {Component} from "react";
import ReactDOM,{render} from "react-dom";
import {HashRouter,Switch,Route,Redirect} from "react-router-dom";

import App from "./app"
import { Fruit } from "./fruit";
import Login from "./login";
export default class Layout extends Component{
    render(){
        return (
            <HashRouter  basename = "/">
                <Switch>
                    <Route path="/" exact render={()=>(<Redirect to="/app/home"  />  )} />
                    {/* <Route path="/" exact render={({match})=>(<Redirect to="/app/home"  />  )} /> */}
                    {/* <Route render={({match,location,history})=>(<Redirect to="/app/home" />)}/> */}
                    <Route path="/app/:tab?" component={App}   strict={true} />
                    <Route path="/fruit/:fname/:id" component={Fruit} />
                    <Route path="/login" component={Login} />
                </Switch>
            </HashRouter>
        )
    }
}
render(
    <Layout/>,
    document.getElementById("app")
)


