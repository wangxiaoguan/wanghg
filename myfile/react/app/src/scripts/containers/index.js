
// 视口 layout

import React,{Component} from "react";
import {Route,Switch,Redirect} from "react-router-dom";

import {Guide} from "./guide"
import {App} from "./app"
import {Register} from "./register"
import {Detail} from "./detail"

import {Item} from "./item"
import {Pay} from "./pay"

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
                            <Route path="/register" exact component={Register} />
                            <Route path="/detail/:id?" component={Detail} />
                            <Route path="/item/:num?" component={Item}/>
                            <Route path="/pay/:price?"  component={Pay}/>
                            {/* <Route path="/scale/:tab?" component={App} /> */}
                            <Route render={()=>{return (<Redirect to="/app/home" />)}}/>
                        </Switch>
                    )
                }
                >

                </Route>
            </div>
        )
    }
}