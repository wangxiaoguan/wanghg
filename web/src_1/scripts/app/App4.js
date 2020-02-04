
import React,{Component} from "react";
import './app.scss'
export default class App4 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='app4'>
               	<iframe srcDoc={require('../../assets/html/css3.html')}></iframe>
            </div>
        )
    }
}


