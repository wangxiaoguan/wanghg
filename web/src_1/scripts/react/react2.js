
import React,{Component} from "react";
import './react.scss'
export default class React2 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='react2'> 
                {/* <iframe src="http://wanghg.top/html/redux2.html"></iframe> */}
                <iframe srcDoc={require('../../assets/html/redux2.html')}></iframe>
            </div>
    
        )
    }
}


