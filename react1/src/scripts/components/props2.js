
/*
    父子组件通信    
    <A> 
        <B></B>
    </A>

    props 传递数据 
    state 修改数据  

    父组件修改子组件某个属性  
    父组件把组件的state 当着  子组件 props 传递子组件  
    父组件 修改 state  子组件接收到变化的 props  从而修改子组件本身  

    子组件去修改父组件 
    父组件把修改自身某个状态的方法 当着 props 传递给子组件 
    子组件触发 该方法 实现 子组件修改父组件 



    ref  this.refs 对象获取  
    1.ref 如果作用于 dom 元素 ,  指向这个真实的DOM 元素  
    2.ref 如果作用于 组件  , 指向是这个组件对象 

*/ 
import React from "react";

import Button from "./button";

export default React.createClass({
    getDefaultProps(){ return {messsge:"武汉千锋教育"}  },
    getInitialState(){ return {msg:'武汉1803班',show:"true" }  },

    changeMsg(msg){   this.setState({msg}) },
    changeShow(){   this.setState({  show:!this.state.show   })    },
    render(){
        console.log(this.props);
        const {show,msg}=this.state;
      
        
        const op = {
            width:200,height:150,background:'yellowgreen',display:show?'block':'none' };
        return(
            <div style={{border:"10px solid #a0a"}}>
                <h1>{this.props.person.word}</h1>
                <h1>{msg}</h1>
                <p><input type="text" ref="one" /></p>
                <p style={op}>{this.props.message}</p>
                <Child changeMsg={this.changeMsg}
                       changeShow={this.changeShow}
                       show={show}
                       change={(v)=>{this.setState({ msg:v }) } }
                />
            </div>
        )
    }
   
})


const Child= React.createClass({
        changeParent(){
            const {change} = this.props;
            console.log(this.refs.msg.value)
            change(this.refs.msg.value)
        },
        render(){
            const {changeMsg,changeShow,show}=this.props;
            return(
                <div style={{border:'3px solid yellow'}}>
                    <h2>child-component</h2>
                    <p><input type="text" ref="msg" onChange={this.changeParent}/></p>
                    <button onClick={()=>{changeMsg("马上毕业了;要好好学习")}}>修改父组件的msg</button>
                    <button onClick={changeShow} >{show?"显示":"隐藏"}</button>
                </div>
            )
        }
})