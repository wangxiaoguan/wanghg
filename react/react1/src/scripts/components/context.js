

/*
props 传递数据
context 传递数据  隔空传递  



propsType props 检验 

数组:optionalArray: React.PropTypes.array.isRequired, 
布尔:optionalBool: React.PropTypes.bool,
函数:optionalFunc: React.PropTypes.func,
数字:optionalNumber: React.PropTypes.number,
对象:optionalObject: React.PropTypes.object,
字符串:optionalString: React.PropTypes.string,
符号:optionalSymbol: React.PropTypes.symbol,

*/ 


import React,{Component} from "react";

export default class Context extends Component{

    getChildContext(){ return { msg:"wh1803daydayup", number:13148888 } }//设置context数据

    render(){
        const {username,msg,words,word} = this.props;
        return (
            <div>
                <h2>propsType props 检验 </h2>
                <h1>{username}--{msg}--{words}</h1>
                <A username={username} word={word} />
            </div>
        )
    }
}

Context.childContextTypes = {//检测的数据类型，传递给下一级
    msg:React.PropTypes.string.isRequired,
    number:React.PropTypes.number.isRequired,
}

Context.defaultProps = {username:"wanghg",msg:"17371301830",words:1803}

Context.propTypes = {
    username:React.PropTypes.string.isRequired,
    msg:React.PropTypes.number.isRequired,
    words:React.PropTypes.number.isRequired
}


class A extends Component {
    render(){
        const {word} = this.props;
        return (
            <div>
                <h2>AAAAAA</h2>
                <h2>=============================</h2>
                <B word={word} />
            </div>
        )
    }
}

class B extends Component {
    render(){
        return (
            <div>
                <h2>BBBBBB</h2>
                <h2>{this.props.word}</h2>
                <h2>=============================</h2>
                <C word={this.props.word} />
            </div>
        )
    }
}

class C extends Component {
    render(){
        return (
            <div>
                <h2>CCCCCC</h2>
                <h2>{this.context.msg}</h2>
                <h2>=============================</h2>
                <D word={this.props.word}/>
            </div>
        )
    }
}
C.contextTypes = {
    msg:React.PropTypes.string.isRequired
}

class D extends Component {
    render(){
        return (
            <div>
                <h2>DDDDDD</h2>
                <h2>=============================</h2>
                <h2>{this.props.word}</h2>
                <h2>{this.context.msg}---{this.context.number}</h2>
            </div>
        )
    }
}

D.contextTypes = {
    msg:React.PropTypes.string.isRequired,
    number:React.PropTypes.number.isRequired,
}
