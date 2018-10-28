/*

1. 留言板组件  LiuYanCom

2. 显示留言组件  ListMsgCom

3. 提交留言组件  PostMsgCom
*/ 


import React, {Component} from "react";
import axios from "axios";
axios.defaults.baseURL = "http://192.168.55.40:7700/react";

// export a;
export default class LiuYanCom extends Component{
    
    state  = {
        comments:[]
    }

    componentWillMount(){
        axios.get("/getcomments",{
            params:{
                id:1234
            }
        }).then(res=>{
            console.log(res.data);
            this.setState({
                comments:res.data
            })
        })
    }

    addComments=(comments)=>{

        // push 返回数字  表示当前 数组的长度 
        this.setState({
            comments:comments
        })
    }

    deleteComment = _id =>{
        // this.state.comments.splice(index,1);    
        axios.get("/deletecomment",{
            params:{
                _id:_id
            }
        }).then(res=>{
            console.log(res.data);
            this.setState({
                comments:res.data.result
            })
        })
        
    }


    render(){   
        return (
            <div>
                <h2>todoList - 3 - demo</h2>
                <ListMsgCom comments={this.state.comments} deleteComment={this.deleteComment}>{this.state.comments}</ListMsgCom>
                <PostMsgCom addComments = {this.addComments}/>
            </div>
        )
    }
}

class ListMsgCom extends Component{
    render(){
        const {deleteComment} = this.props;
        return (
            <div style={{border:"2px dotted red",width:400}}>
                <h2>显示留言</h2>
                {
                    this.props.comments.map((todo,index)=>{
                        return (
                            <div key={index} style={{borderTop:"2px solid #000"}}>
                                <p style={{color:"#333"}}>序号 : {index+1}</p>
                                <p style={{color:"yellowgreen"}}>标题 : {todo.title}</p>
                                <p style={{color:"deeppink"}}>内容 : {todo.content}   <button onClick={()=>{deleteComment(todo._id)}}>删除</button></p>                                    
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

import Button from "./button"
class PostMsgCom extends Component{
    
    adds=()=>{
        const {addComments} = this.props;

        axios.post("/insertcomment",{
            title:this.refs.title.value,
            content:this.refs.content.value
        }).then(res=>{
            console.log(res.data);
            addComments(res.data);
            this.refs.title.value = "";
            this.refs.content.value = "";
        })
    }

    render(){
        const {addComments} = this.props;
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

