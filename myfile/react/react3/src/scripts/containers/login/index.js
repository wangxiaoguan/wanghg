

import React,{Component} from "react";
import "./index.scss";

import {Head} from "../../components/head";
import { List, InputItem, WhiteSpace,WingBlank,Button } from 'antd-mobile';

export class Login extends Component{
    render(){
        return (
            <div>
                <Head title="登录" show={true} history={this.props.history} />
                <List>
                    <WingBlank>
                    <InputItem
                        
                        clear
                        placeholder="请输入手机号"
                        ref={el => this.autoFocusInst = el}
                    >手机号</InputItem>
                    <WhiteSpace size="lg"/>
                    <InputItem
                    
                        clear
                        placeholder="请输入验证码"
                        ref={el => this.inputRef = el}
                    >验证码
                    <Button type="warning" className="code" size="small">获取验证码</Button>
                    </InputItem>
                     <WhiteSpace size="lg"/>
                    <Button type="primary" size="large">登录</Button>
                    </WingBlank>
                </List>
            </div>
        )
    }
}