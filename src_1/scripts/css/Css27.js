
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
                <div className='parent'>
                    <h3>线性渐变(水平方向)<br/>background: linear-gradient(<span className='col'>to left,yellow,blue,red</span>)</h3>
                    <div className='gredient1 commom' ></div>
                </div>
                
                <div className='parent'>
                    <h3>线性渐变(垂直方向)<br/>background: linear-gradient(<span className='col'>to top,yellow,blue,red</span>)</h3>
                    <div className='gredient2 commom' ></div>
                </div>
                
                <div className='parent'>
                    <h3>线性渐变(斜向方向)<br/>background: linear-gradient(<span className='col'>to left top,yellow,blue,red</span>)</h3>
                    <div className='gredient3 commom' ></div>
                </div>
                
                <div className='parent'>
                    <h3>重复的线性渐变<br/>background: repeating-linear-gradient(<span className='col'>yellow 20%, green 40%,blue 60%</span>);</h3>
                    <div className='gredient4 commom' ></div>
                </div>
                
                <div className='parent'>
                    <h3>径向渐变<br/>background: radial-gradient(<span className='col'>circle, red, yellow, green</span>);</h3>
                    <div className='gredient5 commom' ></div>
                </div>
                
                <div className='parent'>
                    <h3>重复的径向渐变<br/>background: repeating-radial-gradient(<span className='col'>circle, red, yellow 10%, green 20%</span>);</h3>
                    <div className='gredient6 commom' ></div>
                </div>
                
            </div>
    
        )
    }
}


