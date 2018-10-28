

import React,{Component} from "react";
import {Link} from "react-router-dom"
import "./index.scss";
import {Head} from "../../components/head";

import homeImg1 from "../../../assets/images/a1.jpg";
import homeImg2 from "../../../assets/images/a2.jpg";
import homeImg3 from "../../../assets/images/a3.jpg";
import homeImg4 from "../../../assets/images/a4.jpg";
import axios from "axios";
import { Toast,Carousel,Tabs } from 'antd-mobile';

const tabs = [{title:"最新推荐"},{title:"每日清仓"},{title:"名牌折扣"},{title:"团购低价"}]
   

export class Home extends Component{


    state = { wine7:[],a7:[],a8:[],a9:[],a10:[],imgHeight:0,slideIndex:"",
                mv:[{img:homeImg1,id:67007254,name:"五粮液总厂正品五粮液1918"},
                    {img:homeImg2,id:2182361716,name:"法国巴拉克城堡干红葡萄酒"},
                    {img:homeImg3,id:188045202,name:"法国格兰白兰地酒40度洋酒"},
                    {img:homeImg4,id:1838423737,name:"杏花村酒53度玉坊原浆酒"}]
                    }  
    componentWillMount(){
        Toast.loading("努力加载中...",1);
        axios.get("http://60.205.201.113:8000/home"
    ).then(res=>{
                this.setState({
                    a7:res.data[0].a7, 
                    a8:res.data[1].a8,
                    a9:res.data[2].a9,
                    a10:res.data[3].a10                  
                })
        })
    }

    render(){
        return (
            <div id="head" style={{marginTop:45}}>
                <Head title="首页" />
              
                <Carousel className="my-carousel" dots={true} autoplay  infinite resetAutoplay={false}
                    afterChange={index => this.setState({ slideIndex: index })}>
                    {
                        this.state.mv.map((item,index)=>{
                            return (
                                  <Link key={index} to={{pathname:"/detail/"+item.id, search:"?src="+item.name }} 
                                  style={{display:"inline-block",width:"100%", height:150}} >
                                    <img style={{width:'100%',overflow:'hidden',verticalAlign: 'top'}}  src={item.img} alt=""/>
                                  </Link>
                            )
                        })
                    }
                    </Carousel> 

          <Tabs  tabs={tabs} initalPage={'t2'} >

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',  backgroundColor: '#fff' }}>
                     <ul className="head_new">
                        {
                            this.state.a7.map((wine,index)=>{
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
                    </ul>         
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',  backgroundColor: '#fff' }}>
                     <ul className="head_new">
                        {
                            this.state.a8.map((wine,index)=>{
                                return(
                                    <li key={index} >
                                            <Link to={{
                                                pathname:"/detail/"+wine.goods_id,
                                                search:"?src="+wine.goods_name
                                            }}>
                                                <h2><img src={wine.thumb_url} alt=""/></h2>                                       
                                                <h3>
                                                    <p>{wine.goods_name}</p>
                                                    <em>清仓价:{wine.normal_price/10-88}</em>
                                                    <b className="normal_price">￥{wine.normal_price/10}</b>
                                                    <span>{wine.sales_tip}</span>
                                                </h3>
                                            </Link>
                                        </li>
                                )
                            })
                        }
                    </ul>         
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',  backgroundColor: '#fff' }}>
                     <ul className="head_new">
                        {
                            this.state.a9.map((wine,index)=>{
                                return(
                                    <li key={index} >
                                            <Link to={{
                                                pathname:"/detail/"+wine.goods_id,
                                                search:"?src="+wine.goods_name
                                                
                                            }}>
                                                <h2><img src={wine.thumb_url} alt=""/></h2>                                       
                                                <h3>
                                                    <p>{wine.goods_name}</p>
                                                    <em>折扣价:{parseInt(wine.normal_price/10*0.75)}</em>
                                                    <b className="normal_price">￥{wine.normal_price/10}</b>
                                                    <span>{wine.sales_tip}</span>
                                                </h3>
                                            </Link>
                                        </li>
                                )
                            })
                        }
                    </ul>         
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',  backgroundColor: '#fff' }}>
                     <ul className="head_new">
                        {
                            this.state.a10.map((wine,index)=>{
                                return(
                                    <li key={index} >
                                            <Link to={{
                                                pathname:"/detail/"+wine.goods_id,
                                                search:"?src="+wine.goods_name
                                                
                                            }}>
                                                <h2><img src={wine.thumb_url} alt=""/></h2>                                       
                                                <h3>
                                                    <p>{wine.goods_name}</p>
                                                    <em>团购价:{wine.normal_price/10-70}</em>
                                                    <b className="normal_price">￥{wine.normal_price/10}</b>
                                                    <span>{wine.sales_tip}</span>
                                                </h3>
                                            </Link>
                                        </li>
                                )
                            })
                        }
                    </ul>         
                </div>
                </Tabs>
                   

            </div>
        )
    }
}