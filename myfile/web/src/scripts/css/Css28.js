
import React,{Component} from "react";
import { SketchPicker } from 'react-color';
import './css.scss'
export default class Css28 extends Component{
    constructor(props){
        super(props);
        this.state={
            color:'#f0f'
        }
    }
    handleChange = (e)=>{
        let color = e.hex;
        console.log(e)
        this.setState({color})
      
    }
    render(){
        const {color}=this.state
        return(
            <div id='css28'> 
                <h2>颜色拾取器react-color</h2>
                <SketchPicker color={color}  onChange={this.handleChange} />
                <div style={{width:220,height:220,background:color,marginTop:10}}></div>
            </div>
    
        )
    }
}


