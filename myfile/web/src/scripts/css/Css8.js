
import React,{Component} from "react";
import $ from 'jquery'
import './css.scss'
const con1=require('../../assets/images/con1.png')
const con2=require('../../assets/images/con2.png')
const con3=require('../../assets/images/con3.png')
const con4=require('../../assets/images/con4.png')
const con5=require('../../assets/images/con5.png')

const text1=require('../../assets/images/text1.png')
const text2=require('../../assets/images/text2.png')
const text3=require('../../assets/images/text3.png')
const text4=require('../../assets/images/text4.png')
const text5=require('../../assets/images/text5.png')

const bg1=require('../../assets/images/bg1.jpg')
const bg2=require('../../assets/images/bg2.jpg')
const bg3=require('../../assets/images/bg3.jpg')
const bg4=require('../../assets/images/bg4.jpg')
const bg5=require('../../assets/images/bg5.jpg')
var index = 0;
var timer = null;
var length =5;
export default class Css8 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }



    start=()=> {
        let that=this
        clearInterval(timer);
        timer = setInterval( ()=> {
            index++;
            if (index == length) {
                index = 0;
            }
            that.show(index)

        }, 2000);
    }
    show=(index)=> {
        $("#nav li").eq(index).addClass("select").siblings().removeClass("select");

        $("#content3 li").eq(index).fadeIn(500, function () {
            $(this).find("img").eq(0).animate({"left": 0}, function () {
                $(this).next().animate({"left": 0});
            });
        }).siblings().fadeOut(function () {
            $(this).find("img").css("left", -760);
        });
    }
    render(){
        this.show(index);
        let that=this
        $("#nav li").mouseover( ()=> {
            index = $(this).index();
            that.show(index);
            clearInterval(timer);
    
        }).mouseout(()=> {
            that.start();
        });
    
    
        this.start();
        return(
            <div id='css8'> 
                <div id="wrap3">
                    <ul id="content3">
                        <li style={{background: `url('${bg1}')`}}>
                            <img src={con1}/>
                            <img src={text1}/>
                        </li>
                        <li style={{background: `url('${bg2}')`}}>
                            <img src={con2}/>
                            <img src={text2}/>
                        </li>
                        <li style={{background: `url('${bg3}')`}}>
                            <img src={con3}/>
                            <img src={text3}/>
                        </li>
                        <li style={{background: `url('${bg4}')`}}>
                            <img src={con4}/>
                            <img src={text4}/>
                        </li>
                        <li style={{background: `url('${bg5}')`}}>
                            <img src={con5}/>
                            <img src={text5}/>
                        </li>
                    </ul>
                    <ul id="nav">
                        <li className="select">1</li>
                        <li>2</li>
                        <li>3</li>
                        <li>4</li>
                        <li>5</li>
                    </ul>
                </div>
            </div>
    
        )
    }
}


