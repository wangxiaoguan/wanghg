

import React,{Component} from "react";
import "./index.scss";
import {Switch,Route,Redirect} from "react-router-dom"

import {Wechat} from "../wechat"
import {Contacts} from "../contacts"
import {Find} from "../find"
import {Mine} from "../mine"
import {Foot} from "../../components/foot";
 
export class App extends Component{
    render(){
        return (
            <div className="app">
                <Switch>
                    <Route path="/app/wechat" component={Wechat}/>
                    <Route path="/app/contacts" component={Contacts}/>
                    <Route path="/app/find" component={Find}/>
                    <Route path="/app/mine" component={Mine}/>
                    <Route render={()=>(<Redirect to="/app/wechat"  /> ) }   />
                    <Route component={Wechat}/>
                </Switch>
                <Foot/>
            </div>
        )
    }
}