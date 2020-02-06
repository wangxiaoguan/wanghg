


// state 状态   react 组件数据交互的载体   状态用来修改数据的 

// 1. state 不能在组件外部定义  不能在组件外部修改  只能在组件内部定义生命  只能在组件内部被修改  
// 2. state 用来被修改的  this.state  来获取组件的状态  this.setState() 来修改组件的state 
// 3. state 在组件内部 getInitialState来初始化定义state ,必须返回一个对象   ES6--> this.state = {}
// 4. state 在组件内部 触发setState 会修改state , 修改state 会触发页面的二次渲染 ,组件内部的render方法
//    就会重新执行,虚拟DOM会根据DIFF 算法 得到新的虚拟DOM ,最后批量的更新 ;

import React,{Component} from "react";

import Button from "./button";

var timer=null;

export default React.createClass({

    getDefaultProps(){
        return{
            count:1803
        }
    },

    getInitialState(){
        return{
            number:707,
            txt:"daydayup",
            time:0,
            timer:null,
        }
    },
    changeNumber(){
        this.setState({
            number:++this.state.number
        })
    },
    change(e){
        this.setState({
            txt:e.target.value
        })
    },
    start(){
        if(!timer){
            timer=setInterval(()=>{
                this.state.time++;
                this.setState({
                    time:this.state.time
                })
            },10)
        }
    },
    stop(){
        clearInterval(timer);
        timer=null

    },
    render(){
        const {txt,time}=this.state;
        return(
            <div>
                <h1>计时器===={time}</h1>
                <Button text='开始计时' onClick={this.start}></Button>
                <Button text='暂停计时' onClick={this.stop}></Button>

            </div>
        )
    }

})