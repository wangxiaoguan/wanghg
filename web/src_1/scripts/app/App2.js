
import React,{Component} from "react";
import './app.scss'
export default class App2 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='app2'>
                <iframe srcDoc={require('../../assets/html/css1.html')}></iframe>               
            </div>
        )
    }
}