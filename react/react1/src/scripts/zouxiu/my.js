

import React, {Component} from "react";

import {Link} from  'react-router-dom';
export default class My extends Component{
    goLogin=()=>{
       
        const {history} =this.props;
        console.log(history)
        history.push("/login")
    }
    render(){
        // const {goLogin}=this.props;
        // const {match,history,location} =  this.props;
        return (
            <div>
                <h2>mine-mine-mine</h2>
                {/* <Link to={{pathname:"/login"}}>登录</Link> */}
                <button onClick={this.goLogin} >没有登录,马上登录</button>
            </div>
        )
    }
}