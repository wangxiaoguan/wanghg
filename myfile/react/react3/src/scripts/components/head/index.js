

import React,{Component} from "react";
import "./index.scss";

import {NavBar,Icon} from "antd-mobile"

export class Head extends Component{

    goback=()=>{
        const {history} = this.props;
        console.log(this.props);
        history.goBack();
    }

    render(){
        const {show,title} = this.props;
        return (
            <NavBar
                mode="dark"
                icon={show?<Icon type="left" />:""}
                leftContent={show?"返回":""}
                onLeftClick={show?this.goback:console.log()}
                rightContent={show?[ <Icon key="1" type="ellipsis" />]:""}
            >{title}</NavBar>
        )
    }
}
