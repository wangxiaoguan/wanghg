






import React,{Component} from "react";



import axios from "axios";


import "./index.scss";

import { WingBlank, WhiteSpace ,Button,  Modal,ActionSheet,NavBar,Icon,Toast  } from 'antd-mobile';

const alert = Modal.alert;
const prompt = Modal.prompt;






export class My4 extends Component{

    goback=()=>{ const {history} = this.props;history.goBack();}

    render(){
        return (
            <div id="my4"  className="common" style={{marginTop:45}}>
                <NavBar
                        mode="dark"
                        style={{backgroundColor:"red"}}
                        icon={<Icon type="left" />}
                        leftContent={"返回"}
                        onLeftClick={this.goback}
                >{"我的金币"}</NavBar>
                <WhiteSpace size="lg" />
                <h1>无</h1>
                <WhiteSpace size="lg" />
            </div>
        )
    }
}

//WingBlank 左右留白 <WingBlank><p></p></WingBlank>
//WhiteSpace 上下留白 <WhiteSpace size="lg"></WhiteSpace>或者<WhiteSpace size="lg" />