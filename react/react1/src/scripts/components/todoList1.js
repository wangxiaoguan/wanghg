

// todoList 留言板  


import React, {Component} from "react";
import Button from "./button"
export default class TodoLists extends Component{

    state  = {
        todos:[{
            title:"今天很开心",
            content:"今天满满的学了一大堆react的鬼东西"
        }]
    }

    addComments=()=>{
        var title = this.refs.title.value;
        var content = this.refs.content.value;

        this.state.todos.push({
            title:title,
            content
        });
        this.setState({
            todos:this.state.todos
        })

        this.refs.title.value = "";
        this.refs.content.value = "";
    }

    render(){
        return (
            <div>
                <h2>todoList -1 - demo</h2>
                <div>
                    <h2>显示留言</h2>
                    {
                        this.state.todos.map((todo,index)=>{
                            return (
                                <div key={index} >
                                    {todo.title}--{todo.content}
                                </div>
                            )
                        })
                    }
                </div>
                <div>
                    <h2>提交留言</h2>
                    <div>
                        <p><input type="text" placeholder="请输入标题" ref="title" /></p>
                        <p><input type="text" placeholder="请输入内容" ref="content"   /></p>
                        <p><Button onClick={this.addComments} text="提交留言"   ></Button></p>
                    </div>
                </div>
            </div>
        )
    }
}

