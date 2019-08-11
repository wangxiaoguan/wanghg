
import React,{Component} from "react";
import './css.scss'
import  {Input,Button} from 'antd'
// const videoUrl=require('../../assets/video/movie.mp4')
export default class Css11 extends Component{
    constructor(props){
        super(props);
        this.state={
           word:''
        }
    }
    componentDidMount(){
     

    }
    send=()=>{
        let video=document.getElementsByClassName("video")[0];
        // let barrage=document.getElementById("barrage");
        let timer=null;
        let length=0;
        // let text=barrage.value;
        let text=this.state.word
        let span=document.createElement("span");
        span.className="word";
        video.appendChild(span);
        span.innerHTML=text;
        span.style.top=Math.round(Math.random()*244)+"px";
        span.style.color=this.getColor();
        var time=1+Math.round(Math.random()*6);
        timer=setInterval(function () {
            length++;
            span.style.right=length+"px";
            if (length>=640){
                span.innerHTML="";
                clearInterval(timer);
            }
        },time);
        // this.setState({word:''})
    }
    getColor=()=>{
      let list=["1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
      let color="#";
      for (var i=0;i<6;i++){
          let index=Math.round(Math.random()*(list.length-1));
          color+=list[index];
      }
      return color;
    }
    inputTxt=(e)=>{
      console.log(e.target.value)
      this.setState({word:e.target.value})
    }
    render(){
        return(
            <div id='css11'> 
                <div className="video">
                  <video width="636" height="264" src={'http://wanghg.top/data/movie.mp4'} controls autoPlay={false}  loop></video>
                  <Input style={{width:200}} value={this.state.word} onChange={this.inputTxt}/><Button type='primary' onClick={this.send}>发送</Button>
                </div>
                {/* <input type="text" id="barrage" placeholder="请输入弹幕"/><button id="btn"  onClick={this.send}>OK</button> */}
            </div>
    
        )
    }
}


