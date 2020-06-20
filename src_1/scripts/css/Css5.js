
import React,{Component} from "react";
import './css.scss'
export default class Css5 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }
    componentDidMount(){
      
    }
  
    
    render(){
        return(
            <div id='css5'> 
              <div className="box"></div>
              <div className='app'>
<pre>{`
    width:100px;
    height:100px;
    background: #1eff00;
    position: absolute;
    animation: move 2s infinite; 
        infinite循环
        alternate/forwards停留在动画结束的时刻*/
    @keyframes move{
        0%{left:0;top:0} 
        20%{left:400px;top:0;} 
        50%{left:400px;top:400px;} 
        75%{left:0;top:400px;}
        100%{left: 0;top: 0;}
    }
`}</pre>
              </div>
            </div>
    
        )
    }
}


