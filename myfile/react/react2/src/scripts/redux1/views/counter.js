

import React, {Component} from "react"
import store from "../store";

import {Button} from "antd-mobile"
import { changeCity, changeMsg ,ChangeMsgByInp} from "../actions";
export class Counter extends Component{

    componentWillMount(){
        console.log(store);
    }

    change=()=>{
        var value = this.refs.one.value;
        store.dispatch(ChangeMsgByInp(value));
    }

    render(){
        console.log(this.props);
        const {value,count,number,increment,decrement,city,msg } = this.props;
        return (
            <div>
                <h2>redux-demo ---计数器 </h2>
                <h2>count=={value.count}==={count}   </h2>
                <h2>你喜欢的城市   {city}  </h2>
                <p><Button inline size="small" type="primary" >倒计时 {number} 秒</Button></p>
                <p>
                    <Button onClick={()=>store.dispatch( {type:"ADD",payload:100} ) } inline size="small" type="primary"> count ADD </Button>
                    <Button onClick={increment}   inline size="small" type="primary"> increment </Button>
                    <Button onClick={()=>{decrement(20)}}   inline size="small" type="primary"> decrement 20 </Button>
                    <Button onClick={()=>{store.dispatch(changeCity("活泼深圳"))} }   inline size="small" type="primary"> change city 活泼深圳 </Button>
                </p>
                <h1>msg=={msg}</h1>
                <p> 
                    <Button onClick={()=>{store.dispatch(changeMsg("1803 2周 全部就业"))}}   inline size="small" type="primary"> change msg </Button>
                    <input type="text" ref="one" onChange={this.change} />
                </p>
            </div>
        )
    }
}