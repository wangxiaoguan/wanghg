
// 视口 layout

import React,{Component} from "react";
import {Route,Switch,Redirect} from "react-router-dom";

import {Guide} from "./guide"
import {App} from "./app"
import {Login} from "./login"
import {ContactDetail} from "./contact-detail"

export class  Layout extends Component{
    render(){
        return (
            <div className="section">
                <Route
                render={
                    ({match,location,history})=>(
                        <Switch location={location}>
                            <Route path="/" exact component={Guide} />
                            <Route path="/app/:tab?" component={App} />
                            <Route path="/login" component={Login} />
                            <Route path="/contact/detail/:id?/:title?" component={ContactDetail} />
                            <Route render={    ()=>{ return (<Redirect to="/app/wechat" />)  } } />
                        </Switch>
                    )
                }
                >

                </Route>
            </div>
        )
    }
}