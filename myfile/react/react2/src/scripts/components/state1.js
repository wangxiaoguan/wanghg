
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

    ref  this.refs 对象获取  
    1.ref 如果作用于 dom 元素 ,  指向这个真实的DOM 元素  
    2.ref 如果作用于 组件  , 指向是这个组件对象 



*/ 
import React,{component} from "react";
import Button from "./button";

export default React.createClass({

    getDefaultProps(){
        return{
            my:"大家好"
        }          
        
    },
    getInitialState(){
        return{
            type:'paswword',
            text:"密文",
            inp:'',
            msg:"好好学习,努力赚钱",
            show:true
        }
    },
    change(){
        if(this.state.type=='password'){
            this.setState({
                type:"text",text:"明文"
            })
        }else{
            this.setState({
                type:"password",text:"密文"
            })
        }
    },
    getOne(){  console.log(this.refs.one);   this.setState({  inp:this.refs.one.value   })   },

    changeShow(){  this.setState({ show:!this.state.show})  },

    getChild(){ this.refs.child.init() },


    render(){
        const {type,text,inp,msg}=this.state;
        return(
            <div>
                <h1>废寝忘食</h1>
                <h2>
                    <input type={type}/>
                    <h2 onClick={this.getChild}  >父组件component</h2>
                    <h3>{inp}</h3>  
                    <p><input type="text" ref="one" onChange={this.getOne}/></p>
                    <Button onClick={this.change} className="btn" text={text}/>
                    <button onClick={this.changeShow}>{this.state.show?"显示":"隐藏"}</button>
                    <Child  ref="child" msg={msg} inp={inp} show={this.state.show}/>
                </h2>
            </div>
        )
    }
})

const Child=React.createClass({
    getInitialState(){
        return {
            data:"天道酬勤"
        }
    },
    init(){
        this.setState({
            data:"我是被父组件给修改的通过 ref"
        })
    },
    render(){
        const {msg,inp,show} = this.props;
        const op = {
            width:200,
            height:150,
            background:'yellowgreen',
            display:show?'block':'none'
        };
        return(
            <div>
                <h2>子组件component</h2>
                <h2>msg==={msg}---{inp}</h2>
                <h1>{this.state.data}</h1>
                <p style={op}>父组件控制其显示和隐藏</p>
            </div>
           
        )
    }
})

