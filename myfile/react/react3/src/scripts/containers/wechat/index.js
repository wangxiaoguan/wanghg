

import React,{Component} from "react";
import "./index.scss";
import {Head} from "../../components/head";

import { WingBlank, WhiteSpace ,Button,  Modal,ActionSheet  } from 'antd-mobile';

const alert = Modal.alert;
const prompt = Modal.prompt;
const showAlert = () => {
    const alertInstance = alert('删除', '你确定删除吗????', [
      { text: '取消', onPress: () => {console.log('cancel');alertInstance.close()}, style: 'default' },
      { text: '确定', onPress: () => {console.log('ok');alertInstance.close()},style: 'primary'},
    ]);

    setTimeout(() => {
      // 可以调用close方法以在外部close
      console.log('auto close');
      alertInstance.close();
    }, 500000);
};

const  show = () => prompt(
    'Login',
    'Please input login information',
    (login, password) => console.log(`login: ${login}, password: ${password}`),
    'login-password',
    null,
    ['Please input name', 'Please input password'],
)

import {connect} from "react-redux";
import { changeTitle, changeData } from "../../actions";

@connect(
    state=>{ return {...state } }
)

export class Wechat extends Component{
    state = { clicked:0 }
    showActionSheet = () => {
        const BUTTONS = ['拍照', '地理定位', '扫一扫','删除', '取消'];
        ActionSheet.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: BUTTONS.length - 1,
          destructiveButtonIndex: BUTTONS.length - 2,
          // title: 'title',
          message: '你想如何操作手机',
          maskClosable: true,
          'data-seed': 'logId',
          wrapProps:{
            onTouchStart: e => e.preventDefault(),
          }
        },
        (buttonIndex) => {
          this.setState({ clicked: BUTTONS[buttonIndex] });
        });
      }

    gotoLogin = () =>{
        const {history} = this.props;
        history.push("/login")
    }

    render(){
        console.log(this.props);
        const {title,dispatch,data,mv} = this.props;
        return (
            <div>
                <Head title="微信" show={false} history={this.props.history}/>
                <WingBlank>
                    <WhiteSpace size="lg"></WhiteSpace>
                    <Button type="primary" icon="ellipsis" size="large">primary</Button>
                    <WhiteSpace size="lg"></WhiteSpace>
                    <Button type="warning" size="large" loading={true}>warning</Button>
                    <WhiteSpace size="lg"></WhiteSpace>
                    <Button type="ghost" size="small" inline={true}>ghost</Button>
                    <WhiteSpace size="lg"  />
                    <Button type="primary" onClick={showAlert} >打开弹框</Button>
                    <WhiteSpace size="lg"  />
                    <Button type="warning" onClick={show} >马上注册</Button>
                    <WhiteSpace size="lg"  />
                    <Button type="ghost" onClick={this.showActionSheet} >打开actionsheet</Button>
                    <WhiteSpace size="lg"  />
                    <Button type="primary" onClick={this.gotoLogin} >前往登录</Button>
                    <h2>{title}----{data}</h2>
                    <Button onClick={()=>dispatch(changeTitle("努力写项目,亲们"))} >修改title</Button>
                    <Button onClick={()=>dispatch( changeData({url:"/getdata/123"}) )} >修改 data</Button>
                </WingBlank>
            </div>
        )
    }
}