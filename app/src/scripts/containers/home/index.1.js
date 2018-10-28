

import React,{Component} from "react";
import {Link} from "react-router-dom"
import "./index.scss";
import {Head} from "../../components/head";

import homeImg from "./a1.jpeg";
import homeImg1 from "./hm1.png";
import homeImg2 from "./hm2.png";
import homeImg3 from "./hm3.png";
import homeImg4 from "./hm4.gif";
import axios from "axios";
import { Toast, WhiteSpace, WingBlank, Button,Carousel } from 'antd-mobile';



export class Home extends Component{


    state = { wine7:[],mv:[ require("../../../assets/images/a1.jpg"),
                    require("../../../assets/images/a2.jpg"),
                    require("../../../assets/images/a3.jpg"),
                    require("../../../assets/images/a4.jpg")],imgHeight:0}

    componentWillMount(){
        Toast.loading('努力加载...', 1);
        axios.get("http://60.205.201.113:8000/wine7").then(res=>{
            setTimeout(()=>{
                this.setState({wine7:res.data})
                Toast.hide();
                Toast.info('数据请求成功');
            },1500)
        })
    }

    render(){
        return (
            <div id="head" style={{marginTop:45}}>
                <Head title="首页" />
              
                <Carousel className="my-carousel"
                    dots={true}
                    autoplay
                    infinite
                    resetAutoplay={false}
                    beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                    afterChange={index => this.setState({ slideIndex: index })}
                    >
                    {
                        this.state.mv.map((item,index)=>{
                            return (
                                <a href="" key={index}
                                    style={{display:"inline-block",width:"100%", height:150}}
                                >
                                    <img style={{width:'100%',overflow:'hidden',verticalAlign: 'top'}}  src={item} 
                                    //  onLoad={() => {
                                    //     // fire window resize event to change height
                                    //     window.dispatchEvent(new Event('resize'));
                                    //     this.setState({ imgHeight: 'auto' });
                                    //   }}
                                    alt=""/>
                                </a>
                            )
                        })
                    }
                    </Carousel> 
                <ul className="head_mid">
                    <a href=""><li><img src={homeImg1} alt=""/><span>限时秒杀</span></li></a>
                    <a href=""><li><img src={homeImg2} alt=""/><span>每日清仓</span></li></a>
                    <a href=""><li><img src={homeImg3} alt=""/><span>名牌折扣</span></li></a>
                    <a href=""><li><img src={homeImg4} alt=""/><span>团购低价</span></li></a>
                </ul>  
                <h1>最新推荐</h1> 
                <ul className="head_new">
                {
                    this.state.wine7.map((wine,index)=>{
                        return(
                            <li key={index} >
                                    <Link to={{
                                        pathname:"/detail/"+wine.goods_id,
                                        search:"?src="+wine.goods_name
                                        
                                    }}>
                                        <h2><img src={wine.thumb_url} alt=""/></h2>                                       
                                        <h3>
                                            <p>{wine.goods_name}</p>
                                            <b>￥{wine.normal_price/10}</b><span>{wine.sales_tip}</span>
                                        </h3>
                                    </Link>
                                </li>
                        )
                    })
                }
                    {/* <li>
                        <h2><img src={} alt=""/></h2>
                        <h3>
                            <p>七分九分长裤春夏薄款打底裤显瘦小脚裤铅笔裤高腰弹力大码女裤子</p>
                            <b>99</b><span>已售1298件</span>
                        </h3>
                    </li> */}
                   
                </ul>         
            </div>
        )
    }
}