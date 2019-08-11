
import React,{Component} from "react";
const imgUrl=require('../../assets/gif/img5.gif')
export default class Gif5 extends Component{
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


