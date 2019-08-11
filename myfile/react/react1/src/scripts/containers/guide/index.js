

import React,{Component} from "react";
import "./index.scss";

import ReactSwipe from "../../components/react-swipe"

export class Guide extends Component{

    state = {
        imgs:[
            require("../../../assets/images/slide1.png"),
            require("../../../assets/images/slide2.png"),
            require("../../../assets/images/slide3.png"),
            require("../../../assets/images/slide4.png"),
        ]
    }

    componentWillMount(){
        const {history} = this.props;
        if(localStorage.visitcount){
            localStorage.visitcount++;
            history.push("/app/")
        }else{
            localStorage.visitcount = 1;
        }
    }

    gotoApp = (index) =>{
        const {history} = this.props;
        if(index==this.state.imgs.length-1){
            history.push("/app/")
        }
    }

    render(){
        const images = this.state.imgs.map((img,index)=>{
            return (<img  onClick={()=>this.gotoApp(index)}  style={{width:"100%",height:"100%"}} src={img} key={index} alt=""/>)
        })
        return (
            <ReactSwipe id="banner" swiperOptions={{resistanceRatio:0,loop:false,autoPlay:1200,speed:1200}}>
                {/* <p>item01</p>
                <p>item02</p>
                <p>item03</p> */}
                {images}
            </ReactSwipe>
        )
    }
}