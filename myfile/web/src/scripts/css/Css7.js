
import React,{Component} from "react";
import './css.scss'
const img1=require('../../assets/img/small1.jpg')
const img2=require('../../assets/img/small2.jpg')
const img3=require('../../assets/img/small3.jpg')
const img4=require('../../assets/img/small4.jpg')
export default class Css7 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }
    componentDidMount(){
        var inner = document.getElementById("inner");
        var ul = inner.getElementsByTagName("ul")[0];
        var left = document.getElementById("left");
        var right = document.getElementById("right");
    
    
        var speed = 2;
        var timer = null;
        timer = setInterval(function () {
            if (ul.offsetLeft > 0) {//往右边的临界条件
                ul.style.left = -ul.offsetWidth / 2 + "px";
            }
            if (ul.offsetLeft < -ul.offsetWidth / 2) {//解决向左的临界条件
                ul.style.left = 0;
            }
            ul.style.left = ul.offsetLeft + speed + "px";
        }, 10);
    
        left.onclick = function () {
            speed = -Math.abs(speed);
        }
        right.onclick = function () {
            speed = Math.abs(speed);
        }
    }
    render(){
        return(
            <div id='css7'> 
                <div id="warp">
                    <span id="left">左</span>
                    <span id="right">右</span>
                    <div id="inner">
                        <ul>
                            <li><img src={img1}/></li>
                            <li><img src={img2}/></li>
                            <li><img src={img3}/></li>
                            <li><img src={img4}/></li>
                            <li><img src={img1}/></li>
                            <li><img src={img2}/></li>
                            <li><img src={img3}/></li>
                            <li><img src={img4}/></li>
                        </ul>
                    </div>
                </div>
            </div>
    
        )
    }
}


