
import React,{Component} from "react";
import './react.scss'
export default class React1 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='react1'> 
                <iframe srcDoc={require('../../assets/html/redux1.html')}></iframe>
            </div>
    
        )
    }
}


