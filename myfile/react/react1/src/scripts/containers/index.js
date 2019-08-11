
// 视口 layout

import React,{Component} from "react";
import {Route,Switch,Redirect} from "react-router-dom";

import {Guide} from "./guide"
import {App} from "./app"


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
                            <Route 
                                render={
                                    ()=>{
                                        return (<Redirect to="/app/wechat" />)
                                    }
                                }
                            />
                        </Switch>
                    )
                }
                >

                </Route>
            </div>
        )
    }
}