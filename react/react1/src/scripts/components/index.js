
import  React,{Component} from "react";
import  ReactDOM,{render} from 'react-dom'

import Head from "./head.jsx";
import Foot from "./foot.jsx";
import Props1 from "./props1";
import Props2 from "./props2";
import Props3 from "./props3";
import State1 from "./state1";
import State2 from "./state2";
import TodoList1 from "./todoList1";
import TodoList2 from "./todoList2";
import Banner from "./banner";
import Context  from "./context";
import Life from "./life";


var users = ["大雷雷","小红英","小露纯","胖左"];

var func = ()=> { console.log("学会react,北上广都不怕!")};

var age=27;

var person = {nickname:"徐指导", age:27,salary:300000, word:"活出人生的魅力"};

export default class App extends Component{
    render(){
        return(
            <div>
                <h1>我爱学习</h1>
                <Head/>
                <Foot/>
                <Props1 person={person} func={func} users={users} age={age} />
                <Props2 person={person} func={func} users={users} age={age} />
                <State1/>
                <State2/>
                <Props3/>
                <TodoList2 {...person} day="0808" person={person} func={func} users={users} username="zuozuomu"msg="fighting" />
                <Banner/>
                <Context/>
                <Life/>
            </div>
            
        )
    }
}

render(
    <App/>,
    document.getElementById("app")
)