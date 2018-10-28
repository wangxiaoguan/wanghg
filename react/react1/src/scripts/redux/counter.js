

import React, {Component} from "react"

import {Button,WingBlank,WhiteSpace} from 'antd-mobile'

import store from "./store";

import {add,number,changemsg} from "./action";

export class Counter extends Component{
    render(){
        const {city,num,msg} = this.props;
        console.log(this.props)
        return (
            <div>
               
                <WingBlank>
                <h1>{city}</h1>
                <h1>{num}</h1>
                <h1>{msg}</h1>
                <Button inline type='primary' onClick={()=>{store.dispatch(add("广东深圳"))} }>更改城市</Button>   
                <WhiteSpace/>
                <Button inline type='primary' onClick={()=>{store.dispatch(number(100))} }>2018+=100</Button>  
                <WhiteSpace/> 
                <Button inline onClick={()=>store.dispatch(changemsg('我爱中华'))}>我爱中华</Button>          
                </WingBlank>  
               
            </div>
        )
    }
}