

/*
react 组件的生命周期 
组件的生命周期定义    组件从初始化渲染到被移除或者销毁的过程  就是生命周期

1. 每个组件都有生命周期
2. react 通过 生命周期钩子函数去管理react 组件
3. 系统 某些状态和参数发生改变的时候，系统立马去通知 对应处理的函数 进行处理。这些函数就是钩子函数(hooks)

钩子函数的意义在于  不同的阶段添加自己的逻辑代码 

 react 组件的生命周期分为 三个阶段
 1. mounted 组件初始化  从 虚拟DOM(jsx) 渲染成真实DOM 的过程
 2. update 组件state变化，导致组件更新阶段 二次渲染(render)
 3. unmount   组件移除或者销毁  组件被删除 组件被路由替换  (浏览器垃圾回收机制)

 mounted 组件载入阶段  (钩子函数)
 1.getDefaultProps() 设置组件默认的props    defaultProps
 2.getInitialState() 设置组件默认的state  返回对象类型 state 
 3.componentWillMount()  在jsx被渲染到页面之前被调用
 4.render()渲染函数是react中默认的函数
 5.componentDidMount()   在jsx被渲染到页面后被调用

*/ 

import React, {Component} from "react";
import axios from "axios";
axios.defaults.baseURL = 'http://localhost:7700/react/'
import Button from "./button"
let count = 0;
export default React.createClass({

    getDefaultProps(){return { hello:"daydayup" }},
    getInitialState(){

        return {
            msg:"1803 so good",
            count:1000,
            my:"你们都是最棒的",
            disabled:true
        }
    },

    changeMsg(){this.setState({msg:this.refs.one.value})},

    add(){this.setState({ count:++this.state.count })},

    changeMy(){this.setState({ my:"my-my-my" }) },

    check(){
        var mobile = this.refs.mobile.value ;
        var username = this.refs.username.value; 
        var uReg = /^\w{6,12}$/;
        var mReg = /^1(3|5|7|8|9)\d{9}$/
        if(mReg.test(mobile)&&uReg.test(username)){
            this.setState({disabled:false})
        }else{ this.setState({disabled:true}) }
    },

    submit(){
        axios.post("/login",{ 
            username:this.refs.username.value, 
            mobile:this.refs.mobile.value
        }).then(res=>{
            console.log(res.data);
        })

    },
    render(){
        // jsx 代码渲染成真实 的dom 
  
        const {msg,count,my,disabled} = this.state;
        return (
            <div style={{border:"solid 2px yellow"}}>
                <h2>react 组件生命周期 ---{count} </h2>
                <p ref="op" id="op" onClick={this.add}>我是绑定了ref 的 dom 对象  </p>
                <p><input type="text" ref="one" onChange={this.changeMsg} /></p>
                <h2 onClick={this.changeMy}>{msg}---{my}</h2>
                <div>
                    <p><input type="text" placeholder="请输入用户名" ref="username" onChange={this.check} /></p>
                    <p><input type="text" placeholder="请输入手机号" ref="mobile"  onChange={this.check}  /></p>

                    <p><span>{disabled?'true':'false'}</span>
                    <Button onClick={this.submit} text="提交"
                     className="btn" disabled={disabled}></Button></p>
                </div>
                <Child msg={msg} count={count} logged={this.logged} />
            </div>
        )
    },
    // componentDidMount(){

    //     // 这是表示组件上虚拟DOM 已经成为真实DOM   swiper 进行实例化  插件初始化
    //     this.refs.op.style.color = "red";
    //     document.getElementById("op").innerHTML += "加油,努力的你们"
    // }
})



const Child = React.createClass({

    getInitialState(){return { word:"千锋教育" }  },
    changeWord(){ this.setState({ word:"悬梁刺股" }) },

    render(){
        const {msg,count} = this.props;
        return (
            <div style={{border:"solid 2px red"}}>
                <h2>{msg}--{count}</h2>
                <h2 onClick={this.changeWord}>{this.state.word}</h2>
            </div>
        )
    },

})

