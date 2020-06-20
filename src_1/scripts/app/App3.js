
import React,{Component} from "react";
import './app.scss'
export default class App3 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='app3'>
                <iframe srcDoc={require('../../assets/html/css2.html')}></iframe>
            </div>
            
        )
    }
}


