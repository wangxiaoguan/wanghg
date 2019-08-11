

import React,{component} from "react";


import Button from "./button";
export default React.createClass({

    getDefaultProps(){
        return {
            msg:"好好学习,努力赚钱" 
        }
    },
    changeMsg(){
        this.props.msg="李阳疯狂英语"
    },
    get(){
        alert("Hello World!!!")
    },
    render(){
        const {age, msg,person,func,users}=this.props;
        return(
            <div>
                <h1>好好学习,努力赚钱</h1>
                <h2>{msg}</h2>
                <h1 onClick={func}>{users[0]}==={person.age}</h1>
                <h3 onClick={this.changeMsg}>{users[2]}</h3>
                <h3>{age}</h3>
                <Button className="btn" disabled=""text="登录" onClick={this.get} />

            </div>
        )
    }
})
