

import React,{Component} from "react";
import "./index.scss";

import {NavLink} from "react-router-dom"

export class Foot extends Component{

    state = {
        footList:[
            {txt:"微信",path:"/app/wechat",name:"wechat",icon:"icon-wechat"},
            {txt:"通讯录",path:"/app/contacts",name:"contacts",icon:"icon-tongxunlu"},
            {txt:"发现",path:"/app/find",name:"find",icon:"icon-faxian"},
            {txt:"我",path:"/app/mine",name:"mine",icon:"icon-wo"},
        ]
    }

    render(){
        return (
            <footer>
                    {
                        this.state.footList.map((foot,index)=>{
                            return (
                                <div key={index}>
                                    <NavLink to={foot.path} activeClassName="active-nav" > 
                                        <i className={"iconfont "+foot.icon }></i>
                                        <span>{foot.txt}</span>
                                    </NavLink>
                                </div>
                            )
                        })
                    }
            </footer>
        )
    }
}
