

import React , {Component} from "react";

import {Link,Route,Redirect} from "react-router-dom"

export default class List extends Component{

    state = {
        todos:["item1","item2","item3","item4","item5","item6"]
    }

    render(){
        return (
            <div>
                <h2>list - 列表 </h2>
                <div>
                    {
                        this.state.todos.map((todo,index)=>{
                            return (
                                <p key={index}>
                                    <Link to={"/list/"+todo+"?id="+index}    >{todo}--{index}</Link>
                                </p>
                            )
                        })
                    }
                </div>
                <div>
                    <Route path="/list/:item?" render={Detail}>

                    </Route>
                </div>
            </div>
        )
    }
}

import url from "url";

const Detail = ({match,location,history})=>{
    if(!match.params.item){
        return (<Redirect to="/list/item1?id=0"/>)
    }
    return (
        <div>
            <h2>页面详情----detail</h2>
            <h2>item  === {match.params.item}</h2>
            <h2>id   ===  {new URLSearchParams(location.search).get("id")}</h2>
            <h2>id   ===  {url.parse(location.search,true).query.id}</h2>
        </div>
    )
}