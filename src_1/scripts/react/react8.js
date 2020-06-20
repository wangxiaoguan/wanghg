
import React,{Component} from "react";
import { SketchPicker } from 'react-color';
import './react.scss'
export default class React8 extends Component{
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
                <div id='react8'> 
                    <h1>颜色react-color</h1>
                    <div className='content'>
                        <SketchPicker color={color}  onChange={this.handleChange} />
                        <div style={{width:220,height:220,background:color,marginTop:10}}></div>
                    </div>
                </div>
        
            )
        }
    }
    


