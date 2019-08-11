
import React,{Component} from "react";
import './data.scss'
export default class Data2 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }
    componentDidMount(){
        var hour = document.getElementById('hour');
        var minute = document.getElementById('minute');
        var second = document.getElementById('second');
        function showTime(){
            var oDate = new Date();
            var iHours=oDate.getHours();
            var iMinute=oDate.getMinutes();
            var iSecond=oDate.getSeconds();
            hour.innerHTML = AddZero(iHours);
            minute.innerHTML = AddZero(iMinute);
            second.innerHTML = AddZero(iSecond);
        }
        showTime();
        setInterval(showTime,1000);
        function AddZero(n){
            if(n < 10){
                return '0'+n;
            }
            return ''+n;
        }
    }
    render(){
        return(
            <div id='data2'> 
            <div id="snowzone" ></div>
            <div className="box">
                <ul>
                    <li><span id="hour"></span><span>时</span></li>
                    <li><span id="minute"></span><span>分</span></li>
                    <li><span id="second"></span><span>秒</span></li>
                </ul>
            </div>
            </div>
    
        )
    }
}


