
import React,{Component} from "react";
const imgUrl=require('../../assets/gif/img8.gif')
export default class Gif8 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div> 
                 <img style={{width:'100%'}} src={imgUrl}/>
  	        </div>
    
        )
    }
}


