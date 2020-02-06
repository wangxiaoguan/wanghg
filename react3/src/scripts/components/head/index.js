

import React,{Component} from "react";
import "./index.scss";

import {NavBar,Icon} from "antd-mobile"

export class Head extends Component{

    goback=()=>{
        const {history} = this.props;
        console.log(this.props);
        history.goBack();
    }
    // gotoLogin = () =>{
    //     const {history} = this.props;
    //     console.log(this.props);
    //     history.push("/register");
    // }

    render(){
        const {show,title} = this.props;
        return (
            <NavBar

                mode="dark"
                style={{backgroundColor:"red"}}
                // icon={show?<Icon type="left" />:""}
                // [ <Icon key="1" type="ellipsis" />]
                leftContent={show?"注册":""}
                // onLeftClick={show?this.gotoLogin:""}
                // rightContent={show?"注册":""}
            >{title}</NavBar>
        )
    }
}
