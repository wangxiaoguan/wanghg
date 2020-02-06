



// 视口 layout

import React,{Component} from "react";
import {Route,Switch,Redirect} from "react-router-dom";

import {After1} from "./after1";
import {After2} from "./after2";
import {After3} from "./after3";
import {After4} from "./after4";
import {My1} from "./my1";
import {My2} from "./my2";
import {My3} from "./my3";
import {My4} from "./my4";


export class  Item extends Component{
    render(){
        return (
            <div className="section">
               
                        <Switch>
                            
                            <Route path="/item/after1" component={After1} />
                            <Route path="/item/after2" component={After2} />
                            <Route path="/item/after3" component={After3} />
                            <Route path="/item/after4" component={After4} />
                            <Route path="/item/my1" component={My1} />
                            <Route path="/item/my2" component={My2} />
                            <Route path="/item/my3" component={My3} />
                            <Route path="/item/my4" component={My4} />
                        </Switch>
                
            </div>
        )
    }
}