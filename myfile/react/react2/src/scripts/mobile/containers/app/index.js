

import React,{Component} from "react";

import {Button,WhiteSpace,WingBlank} from "antd-mobile"

import "./index.scss";


export class App extends Component{
    state= {subject:["语文","数学","英语","物理","化学"]}
    render(){
        return(
            <div>
                <WingBlank>
                <WhiteSpace/>
                <Button inline type="warning">{this.props.action}</Button>
                {
                    this.state.subject.map((sub,index)=>{
                        return(
                        <Button inline type='warning' key={index}>{sub}</Button>
                        )
                    })
                }
                <WhiteSpace/>
                </WingBlank>
            </div>
        )
    }
}