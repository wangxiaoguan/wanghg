

import React,{Component} from "react";

import {Route,Switch} from "react-router-dom";

import { Button, WhiteSpace, WingBlank } from 'antd-mobile';

import {App} from "./app";

const Buttons = (props) => (
    <WingBlank>
      <Button type="ghost" inline size="large">登录</Button>
      <Button type="warning" inline size="small">{props.action}</Button>
      <Button type="warning" inline={true} size="small" loading>警告</Button>
      <WhiteSpace />
      <Button type="primary" inline size="small" style={{ marginRight: '4px' }}>主要</Button>
      <WhiteSpace />
    </WingBlank>
  );

export class Layout extends Component{
        render(){
            return(
                <div>
                    <App action="警告"/>
                    <Buttons action="危险" />
                </div>
            )
        }
}