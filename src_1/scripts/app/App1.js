
import React,{Component} from "react";
import {connect} from 'react-redux'
import store from '../redux/store'
import {setTimePushData,getPowers} from '../redux/action'
import './app.scss'

class App1 extends Component{
    constructor(props){
        super(props);
        this.state={
          setTimePushData:n =>store.dispatch(setTimePushData(n)),
          getPowers:n =>store.dispatch(getPowers(n)),
           
        }
    }
    componentDidMount(){
      this.state.setTimePushData('2019-08-18')
      this.state.getPowers('精忠报国')
      console.log(store.getState())
    }
    render(){
        return(
            <div id='app1'> 
                <iframe srcDoc={require('../../assets/html/html.html')}></iframe>
  	        </div>
    
        )
    }
} 
export default App1;


