
console.log("route v4");


import React,{Component} from "react";
import ReactDOM,{render} from "react-dom";

import {BrowserRouter  as Router , HashRouter,Route,Switch,Link,NavLink,Redirect,Prompt } from "react-router-dom"

import url from "url";
import getQuery from "../utils/getQuery"

import Nested from "./nested"
import List from "./list";

class Home extends Component{

    goBack = ()=>{
        const {history} = this.props;
        // history.go(-1);
        history.goBack();
    }

    gotoFind = ()=>{
        const {history} = this.props;
        history.push("/find/周末努力精通react!");
    }

    
    render(){
        console.log(this.props);
        const {match,history,location} =  this.props;
        if(!this.props.loggin){
            // 判断是否已经登录
            return (<Redirect to="/login" />)
        }
        return (
            <div>
                <h2>home-home-home 首页</h2>
                <h2>uid: {match.params.uid}</h2>
                <h2>username : {match.params.username}</h2>
                <h2>{JSON.stringify(url.parse(location.search,true).query)}</h2>
                <h2>age :  {url.parse(location.search,true).query.age }</h2>
                <h2>word :  { new URLSearchParams(location.search).get("word") }</h2>
                <h2>age : {getQuery(location.search).age}</h2>
                <button onClick={this.goBack}>返回</button>
                <button onClick={this.gotoFind}>进入find </button>
            </div>
        )
    }
}


class Login extends Component{

    constructor(props){
        super(props);   // 表示继承父类的 props  
        this.state = {  
            dirty:false
        }
        this.change = this.change.bind(this);
    }

    change(e){
        this.setState({
            dirty:!!e.target.value,
        })
    }

    render(){
        if(!this.props.isLogin){
            return ( <Redirect to="/find/happy" ></Redirect> )
        }
        return (
            <div>
                <h2>login 登录</h2>
                <p><input type="text" placeholder="请输入" onChange={this.change} /></p>
                <Prompt
                    when={this.state.dirty}
                    message = "数据尚未保存,你真的要离开吗???"
                />
            </div>
        )
    }
}


class Find extends Component{
    gotoAbout = () =>{
        const {history} = this.props;
        history.push("/about/wh1803")
    }

    render(){
        console.log(this.props);
        const {match,location,history} = this.props;
        return (
            <div>
                <h2>Find-Find-Find 发现人生的美</h2>
                <h2>title :  {match.params.title}</h2>
                <h2>ikey :  {  getQuery(location.search).ikey}  </h2>
                <h2>msg :  {new URLSearchParams(location.search).get("msg")}</h2>
                <h2>state :  { location.state&&location.state.price }</h2>
                <button onClick={this.gotoAbout}>进入url=== /about/wh1803  </button>
                
            </div>
        )
    }
}

const My = () =>{
    return (
        <div>
            <h1>my-my-my 1803 的 窝 </h1>
        </div>
    )
}

const NotFound = ()=>{
    return (
        <div>
            <h2> 404-404-404 not Found</h2>
        </div>
    )
}

const About = ()=>{
    return (
        <div>
            <h2>about-about-about</h2>
        </div>
    )
}

class Layout extends Component{
    render(){
        return (
            <div style={{border:"2px solid red",width:'80%'}}>
                <div style={{border:"2px solid yellow",width:'80%'}}>
                    <p> <Link to="/" >首页-1</Link></p>
                    <p> <Link to="/home/1803/zuozuomu?age=28&word=daydayup" >首页-zuozuomu</Link></p>
                    <p> <Link to="/home/1803?age=20&word=happydays" >首页-dengzeyuyu</Link></p>
                    <p> <Link to={{
                        pathname:"/find/天道酬勤",
                        search:"?ikey=happy&msg=千锋教育",
                        state:{
                            price:18
                        }
                    }} >发现</Link></p>
                    <p> <NavLink to="/my"  >我的</NavLink></p>
                    <p> <Link to="/nested" >Nested</Link></p>
                    <p> <Link to="/list" >List</Link></p>
                </div>
                <div style={{border:"2px solid blue",width:'80%'}}>
                   <Switch>
                        <Route exact  path="/" component={Home}  />
                        <Route  path="/home/:uid/:username?" component={Home}  />
                        <Route  path="/find/:title" component={Find} />
                        <Route  path="/my/" render={My} strict={true} />
                        <Route  path="/nested/:min?" component={Nested} />
                        <Route  path="/login" component={Login}/>
                        <Route  path="/list/:item?" component={List}/>
                        <Redirect from="/about/wh1803" to="/my/" />
                        <Route component={NotFound} />
                   </Switch>
                </div>
            </div>
        )
    }
}

class App extends Component {
    render(){
        return (
            <div>
                <h3>react-router-dom v4 rr4</h3>
                <hr/>
                <Layout/>
            </div>
        )
    }
}

class RootComponent  extends Component{
    render(){
        return (
            <HashRouter 
                basename="/"        // 上线修改  basename="/app"
            >
                {/* <h2>react-router-dom</h2> */}
                <App></App>
            </HashRouter>     
        )
    }
}


render(
    <RootComponent/>,
    document.getElementById("app")
)