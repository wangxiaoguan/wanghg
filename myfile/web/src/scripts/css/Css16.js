
import React,{Component} from "react";
import './css.scss'
import {Button} from 'antd'
export default class Css16 extends Component{
    constructor(props){
        super(props);
        this.state={
            isFlag:false,
        }
    }
    componentDidMount() {
        
    }
   
    render(){
        return(
            <div id='css16'> 
                <div className="left"></div>
                <div className="right"></div>
                <div className='buttom'>
                    <Button onClick={()=>this.setState({isFlag:!this.state.isFlag})}>查看代码</Button>
<pre style={{display:this.state.isFlag?'block':'none'}}>{`
    <div className="left"></div>
    <div className="right"></div>
    .left{width: 400px;height: 400px;background: red;float:left;
        -webkit-animation: left 1s forwards;}
    .right{width: 400px;height: 400px;background:yellow;float:right;
        -webkit-animation: right 1s .7s forwards;}
    @keyframes left{
        0%{transform:translatey(-400px);}
        100%{transform:translatey(0);}}
    @keyframes right{
        0%{transform:translatey(400px);}
        100%{transform:translatey(0);}}
`}</pre>
                </div>

            </div>
    
        )
    }
}


