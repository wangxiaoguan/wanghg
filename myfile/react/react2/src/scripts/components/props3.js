
import React, {Component} from "react";

// ES6 定义类   构造函数
export default class Parent extends Component{

    constructor(props,context){  //优先级3
        super(props,context);  // 继承 得到父类 Component props 和 context
        // 定义 state 
        this.state = {    count:200,    msg:"飞的更高!"   }

        this.countadd  = this.countadd.bind(this);   // bind(this) 强制改变this 执行 
    }

    // 定义props 优先级低   优先级1
    static defaultProps = {    word:"daydayup",   wh:"wh1803"   }

    // 定义state   优先级2
    state = {   txt:"努力最后一个月"    }  

    // 箭头函数 保存this 执行 this 只能指向函数定义所处的this 环境 
    add=()=>{
        // this  react ES6 定义类 this 指向当前的 类 Parent   执行时 this 为 null 
        console.log(this);
        this.refs.one.Change('2222222222222222222222')
        this.setState({
            count:++this.state.count
        })
    }

    countadd(){
        // this  react ES6 定义类 this 指向当前的 类 Parent   执行时 this 为 null 
        console.log(this);
        this.setState({
            count:++this.state.count
        })
    }

    addFamilyName = lastName => {
        return this.props.FirstName + "-" + lastName
    }

    render(){
        console.log(this.props);
        console.log(this.state);
        console.log()
        const {wh,day} = this.props;
        const {msg,count} = this.state;
        return (
            <div style={{border:"solid 2px blue"}}>
                <h2>react+props+state+ES6</h2>
                <h2>{wh}--{day}</h2>
                <h2 onClick={this.add}>{msg}---{count}</h2>
                <h2 onClick={this.countadd}>countadd</h2>
                <Child add={this.add} msg={msg} ref="one" fullName={this.addFamilyName("Jobs")}/>
            </div>
        )
    }
}
// 定义props2 
Parent.defaultProps = { //优先级4
    wh:"武汉1803---1803",
    msg:'大家好',
    day:"0809",
    FirstName:"Stevens"
}

const arr = ["天道酬勤","越挫越勇","激流勇进","无欲无求","花好月圆"];
const list = '中国梦世界梦'
class Child extends Component {

    state = {
        hello:"1803 每天学到晚上2点",
        msg:"沉迷学习无法自拔"
    }

    changeMsg=()=>{
        this.setState({
            msg:"zuozuomu0000888"
        })
    }
    Change=(e)=>{
        console.log('1111111111111111111111111111')
        console.log(e)
    }
    render(){
        const {add,fullName} = this.props;
        const {msg } = this.state;
        console.log(this.state,this.props)
        return (
            <div style={{border:"solid 2px yellow"}}>
                <h2>child-component</h2>
                <h2 onClick={add}>{this.props.msg}</h2>
                <h2 onClick={this.changeMsg}>{fullName}---{msg}</h2>
                <List combinName={fullName}>
                    {arr}{list}
                </List>
            </div>
        )
    }
}
Child.defaultProps = {
    day:"daydayup"
}

// 组件分发  
// vue slot 插槽  
// this.props.children 

class List extends Component{
    render(){
        console.log(this.props);
        return (
            <div style={{border:"solid 2px red"}}>
                <hr/>
                <h2>list-list-list</h2>
                <h2>{this.props.combinName}</h2>
                {
                    this.props.children.map((child,index)=>{
                        return (<p key={index} >{child}--{index}</p>)
                    })
                }
            </div>
        )
    }
}







function Person(name,age){
    // constructor
    this.name = name;
    this.age = age;
}

// prototype
Person.prototype.word = "hello 1803"

Person.prototype.say = function(){
    console.log(this.name +"  说 :"+ this.word);
}
Person.love = "LOL"

var p1 = new Person("胖左",18);
p1.say();
