
import React,{Component} from "react";
import './css.scss'
export default class Css27 extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    componentDidMount(){
      
    }

    render(){
        return(
            <div id='css27'> 
                <div style={{fontSize:16,color:'#fff'}}>
                    <div style={{width:700,height:100,background: 'linear-gradient(to left,yellow,blue,red)'}}>
                        线性渐变(水平方向)background: linear-gradient(to left,yellow,blue,red)
                    </div>
                    <div style={{width:700,height:100,background: 'linear-gradient(to top,yellow,blue,red)'}}>
                        线性渐变(垂直方向)background: linear-gradient(to top,yellow,blue,red)
                    </div>
                    <div style={{width:700,height:100,background: 'linear-gradient(to left top,yellow,blue,red)'}}>
                        线性渐变(斜向方向)background: 'linear-gradient(to left top,yellow,blue,red)'
                    </div>
                    <div style={{width:700,height:100,background:'repeating-linear-gradient( yellow 10%, green 20%,blue 30%)'}}>
                        重复的线性渐变background: repeating-linear-gradient( yellow 20%, green 40%,blue 60%);
                    </div>
                    <div style={{width:700,height:100,background:'radial-gradient(circle, red, yellow, green)'}}>
                        径向渐变:background: radial-gradient(circle, red, yellow, green);
                    </div>
                    <div style={{width:700,height:100,background:'repeating-radial-gradient(circle, red, yellow 10%, green 20%)'}}>
                        重复的径向渐变background: repeating-radial-gradient(circle, red, yellow 10%, green 20%);
                    </div>
                </div>
            </div>
    
        )
    }
}


