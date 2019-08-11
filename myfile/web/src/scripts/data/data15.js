
import React,{Component} from "react";
import './data.scss'
import {Button,Input,message} from 'antd'
import axios from 'axios'
import md5 from 'md5'
import $ from 'jquery'
export default class Data15 extends Component{
    constructor(props){
        super(props);
        this.state={
            number:''
        }
    }
    componentWillMount(){
        console.log(axios,md5)
    }
    InputNum=(e)=>{
        let number=e.target.value;
        this.setState({number})
    }
    send=()=>{
        let phone=Number(this.state.number)
        if(!(/^1(3|4|5|6|7|8)\d{9}$/.test(phone))){ 
            message.error("手机号码有误，请重填");  
            return false; 
        }else{
            message.success("发送成功，请注意接收");  
        }
        // fetch('http://wanghg.top/item/shop/sendcode/sendcode_1.php?phone='+phone).then(res=>{
        //     res.json().then(data=>{
        //         console.log(data)
        //     })
        // })
        // $.ajax({
        //     type:"get",
        //     url:"http://wanghg.top/item/shop/sendcode/sendcode_1.php",
        //     data:{phone:phone},
        //     dataType:"json"})
        //     .then(function (data) {
        //         console.log(data)
        //     });
    }
    render(){
        return(
            <div id='data15'>
                <Input  style={{width:200}} onChange={this.InputNum}/>
                <Button onClick={this.send} type='primary'>发送验证码</Button>
            </div>
        )
    }
}


