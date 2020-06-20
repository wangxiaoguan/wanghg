
import React,{Component} from "react";
import './app.scss'
export default class App10 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='app10'>
                <iframe srcDoc={require('../../assets/html/http.html')}></iframe>
            </div>
        )
    }
}


