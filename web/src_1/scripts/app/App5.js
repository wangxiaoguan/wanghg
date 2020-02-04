
import React,{Component} from "react";
import './app.scss'
export default class App5 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='app5'>
                <iframe srcDoc={require('../../assets/html/postion.html')}></iframe>
            </div>
        )
    }
}


