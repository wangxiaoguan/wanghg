
import React,{Component} from "react";
import './css.scss'
import kscreenshot from 'kscreenshot'
import $ from 'jquery'
export default class Css10 extends Component{
    constructor(props){
        super(props);
        this.state={
           img:{}
        }
    }
    componentDidMount(){
        let news=new kscreenshot(65)
        this.setState({img:news})
    }
    componentDidUpdate(){
        // if(this.state.imgBase64){
        //     console.log(this.state.imgBase64)
        // }
        
    }
    screnn=()=>{
        let news=this.state.img
        console.log('-----------------',news,news.imgBase64)
        let Pimg=document.getElementById('img')
        if(news.imgBase64){
            let img=document.createElement('img')
            img.src=news.imgBase64
            // img.style.width='500px'
            Pimg.appendChild(img)
        }
        

    }
    render(){
        // let news=new kscreenshot(65, function (base64) {
        //     return base64
        // })
        // console.log(news)
       
        return(
            <div id='css10'> 
              <div>截屏，请按shift+A</div>
              <button onClick={this.screnn}>获取</button>
              <p id='img'>
              </p>
            </div>
    
        )
    }
}


