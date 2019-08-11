
import React,{Component} from "react";
import $ from 'jquery'
const homeImg=require('../assets/img/home.jpg')
import { Router,Link,HashRouter,Route,Switch} from "react-router-dom";
export default class Root extends Component{
    constructor(props){
        super(props);
        this.state={
            isFlag:true,
        }
    }
    componentDidMount(){
        console.log('你好，欢迎来到我的网站')
        this.getPage()
    }
    getPage=()=>{
        setTimeout(()=>{
            if(this.state.isFlag){
                let url=window.location.href
                window.location.href=url+'app1'
            }
            
        },5000)
    }
    changePage=()=>{
        let url=window.location.href
        window.location.href=url+'app1'
        this.setState({isFlag:false})
    }
    render(){
        return(
            <div id='root'>
                <img id='rootImg' src={homeImg}/>
                <div id='rootlogin'>
                    <Link to="/app1"><p onClick={this.changePage}>欢迎来到我的网站</p></Link>
                </div>
                
            </div>
        )
    }
}


