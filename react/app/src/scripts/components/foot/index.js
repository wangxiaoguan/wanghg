

import React,{Component} from "react";
import "./index.scss";

import {NavLink} from "react-router-dom"

export class Foot extends Component{

    state = {
        footList:[
            {txt:"首页",path:"/app/home",name:"home",icon:"icon-shouye"},
            {txt:"分类",path:"/app/sort",name:"sort",icon:"icon-leimupinleifenleileibie2"},
            {txt:"购物车",path:"/app/car",name:"car",icon:"icon-gouwuche"},
            {txt:"个人中心",path:"/app/mine",name:"mine",icon:"icon-iconfontgerenzhongxin"},
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
