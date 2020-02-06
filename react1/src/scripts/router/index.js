

import React,{Component} from "react";

import ReactDOM,{render} from "react-dom";

import {BrowserRouter  as Router,Link,HashRouter,Route,Switch} from "react-router-dom";

import url from "url";

import Fa from "./fa";

import Nested from "./nested"

class Home extends Component{

    goA=()=>{
        const {history} = this.props;
        history.push("/bb")
    }
    goBack=()=>{
        const {history}=this.props;
        history.go(-1);//history.goBack()
    }
    render(){
        const {match,history,location} =  this.props;
        console.log(match);
        console.log(history);
        console.log(location);
        return(
            <div>
                <h1 style={{fontSize:50}}>首页</h1>
                <button onClick={this.goA}>GO-B</button>
                <button onClick={this.goBack}>返回</button>
            </div>
        )
    }
}
class A extends Component{
    render(){
        const {match,history,location} =  this.props;
        return(
            <div>
                <h1 style={{fontSize:50}}>A-A-A</h1>

                <h1>{match.params.uid}</h1>

                <h2>{location.state&&location.state.price}</h2>

                <h2>{new URLSearchParams(location.search).get("name")}</h2>

                <h2>{url.parse(location.search,true).query.id }</h2>

                <h2>{JSON.stringify(url.parse(location.search,true).query)}</h2>
            </div>
        )
    }
}
class B extends Component{
    render(){
        return(
            <div>
                <h1 style={{fontSize:50}}>B-B-B</h1>
            </div>
        )
    }
}
class C extends Component{
    render(){
        return(
            <div>
                <h1 style={{fontSize:50}}>C-C-C</h1>
            </div>
        )
    }
}
class D extends Component{
    render(){
        return(
            <div>
                <h1 style={{fontSize:50}}>D-D-D</h1>
            </div>
        )
    }
}
class E extends Component{
    render(){
        return(
            <div>
                <h1 style={{fontSize:50}}>E-E-E</h1>
            </div>
        )
    }
}
class Layout extends Component{
    render(){
        return(
            <div>
                <div>
                    <p><Link to="/">Home</Link></p>
                    <p><Link to="/home">Home2</Link></p>
                    <p><Link to="/home/10/wanghg?age=20&msg=hello">Home3</Link></p>
                    {/* <p><Link to="/aa">AAA</Link></p> */}

                    <p><Link to={{pathname:"/aa/wanghg",
                                  search:"?id=11&name=hong",
                                  state:{price:18,num:200}
                                }}>AAA2</Link></p>

                    <p><Link to="/bb">BBB</Link></p>
                    <p><Link to="/cc">CCC</Link></p>
                    <p><Link to="/dd">DDD</Link></p>
                    <p><Link to="/ee">EEE</Link></p>
                    <p><Link to="/fa">FFF</Link></p>
                </div>
                <div>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/home" component={Home}/>
                        <Route path="/home/:id/:name?" component={Home}/>
                        {/* <Route path="/aa" component={A} /> */}
                        <Route path="/aa/:uid" component={A} />
                        <Route path="/bb" component={B} />
                        <Route path="/cc" component={C} />
                        <Route path="/dd" component={D} />
                        <Route path="/ee" component={E} />
                        <Route path="/fa/:arg?" component={Fa} />
                    </Switch>
                </div>
            </div>
        )
    }
}
class App extends Component{
    render(){
        return(
            <div>
                <Layout/>
                <Nested/>
            </div>
        )
    }
}
class Top extends Component{
    render(){
        return(
            <HashRouter basename="/">
                <App></App>
               
            </HashRouter>
        )
    }
}
render(
    <Top/>,
    document.getElementById("app")
)