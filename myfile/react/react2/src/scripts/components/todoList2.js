/*

1. 留言板组件  LiuYanCom

2. 显示留言组件  ListMsgCom

3. 提交留言组件  PostMsgCom
*/ 


import React, {Component} from "react";

// export a;
export default class LiuYanCom extends Component{
    
    state  = {
        comments:[
            { title:"aaaaaaaaaa", content:"AAAAAAAAAA" },
            { title:"bbbbbbbbbb", content:"BBBBBBBBBB" }            
        ]
    }
    //添加评论
    add=(title,content)=>{
        this.state.comments.push({ title:title, content }); 
        // push 返回数字  表示当前 数组的长度 
        this.setState({ comments:this.state.comments})
    }
    //删除评论
    deleteA = (index)=>{
        this.state.comments.splice(index,1);    
        this.setState({ comments:this.state.comments })
    }
    render(){   
        return (
            <div>
                <h2>todoList - 2 - demo</h2>
                <A comments={this.state.comments} 
                    deleteA={this.deleteA}>
                    {this.state.comments}
                </A>
                <B add = {this.add}/>
            </div>
        )
    }
}

class A extends Component{
    render(){
        const {deleteA} = this.props;
        console.log(this.props.children)
        return (
            <div style={{border:"2px dotted red",width:400}}>
                <h2>显示留言</h2>
                {
                    this.props.comments.map((todo,index)=>{
                        return (
                            <div key={index} style={{borderTop:"2px solid #000"}}>
                                <p style={{color:"#333"}}>序号 : {index+1}</p>
                                <p style={{color:"yellowgreen"}}>标题 : {todo.title}</p>
                                <p style={{color:"deeppink"}}>
                                    内容 : {todo.content}   
                                    <button onClick={()=>{deleteA(index)}}>删除</button>
                                </p>                                    
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

import Button from "./button"
class B extends Component{
    
    adds=()=>{
        const {add} = this.props;
        add(this.refs.title.value,this.refs.content.value);
        this.refs.title.value = "";
        this.refs.content.value = "";
    }

    render(){
        const {add} = this.props;
        return (
            <div style={{border:"2px solid blue",width:400}}>
                <h2>提交留言</h2>
                <div>
                    <p><input type="text" placeholder="请输入标题" ref="title" /></p>
                    <p><input type="text" placeholder="请输入内容" ref="content"   /></p>
                    <p><Button onClick={ this.adds  } text="提交留言"   ></Button></p>
                </div>
            </div>
        )
    }
}

