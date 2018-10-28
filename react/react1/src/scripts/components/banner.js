
// banner 

import React,{Component} from "react";
import SwiperDemo from "./swiperdemo";

import axios from "axios";

export default class Banner extends Component{

    state = {
        imgs:[
            require("../../assets/images/slide1.jpg"),
            require("../../assets/images/slide2.jpg"),
            require("../../assets/images/slide3.jpg"),
            require("../../assets/images/slide4.jpg")
        ],
        arr : ["天道酬勤","越挫越勇","激流勇进","无欲无求","花好月圆"],
        mv:[1,2,3,4,5,6,7,8,9]
    }

    // componentWillMount(){
    //     axios.get("http://47.94.208.182:3000/movie",{
    //         params:{
    //             limit:12
    //         }
    //     }).then(res=>{
    //         this.setState({
    //             mv:res.data
    //         })
    //     })
    // }

    render(){
        const {imgs,mv} = this.state;
        const items = imgs.map((img,index)=>{
            return (
                <img style={{width:700,height:450}} src={img} alt="" key={index} />
            )
        })
        // const mvs = mv.map((m,index)=>{
        //     return (
        //         <img style={{width:300,height:200}} src={m.images.large} alt="" key={index} />
        //     )
        // })
        return (
            <div>
                <SwiperDemo id="banner" swiperOptions={ {loop:true,autoplay:1200,speed:1200} }>
                    {items}

                    {/* {this.state.arr} */}
                        {/* {this.state.mv} */}
                    {/* {mvs} */}
                </SwiperDemo>
            </div>
        )
    }
}