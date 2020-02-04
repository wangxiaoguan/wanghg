
import React,{Component} from "react";
import './app.scss'
export default class App6 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='app6'>
				<iframe srcDoc={require('../../assets/html/box.html')}></iframe>
            </div>
        )
    }
}


