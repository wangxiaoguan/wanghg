

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

    constructor(){
        super();
        this.state={
            item7:[],
            list:[
                {id:'01',name:'酒',price:1999,des:'非常好的白酒',url:'http://wanghg.top/img/img5.jpg'},
                {id:'02',name:'酒',price:1999,des:'非常好的白酒',url:'http://wanghg.top/img/img5.jpg'},
                {id:'03',name:'酒',price:1999,des:'非常好的白酒',url:'http://wanghg.top/img/img5.jpg'},
                {id:'04',name:'酒',price:1999,des:'非常好的白酒',url:'http://wanghg.top/img/img5.jpg'},
                {id:'05',name:'酒',price:1999,des:'非常好的白酒',url:'http://wanghg.top/img/img5.jpg'},
                {id:'06',name:'酒',price:1999,des:'非常好的白酒',url:'http://wanghg.top/img/img5.jpg'},
                {id:'07',name:'酒',price:1999,des:'非常好的白酒',url:'http://wanghg.top/img/img5.jpg'},
                {id:'08',name:'酒',price:1999,des:'非常好的白酒',url:'http://wanghg.top/img/img5.jpg'},
                {id:'09',name:'酒',price:1999,des:'非常好的白酒',url:'http://wanghg.top/img/img5.jpg'},
                {id:'10',name:'酒',price:1999,des:'非常好的白酒',url:'http://wanghg.top/img/img5.jpg'},
                {id:'11',name:'酒',price:1999,des:'非常好的白酒',url:'http://wanghg.top/img/img5.jpg'},
                {id:'12',name:'酒',price:1999,des:'非常好的白酒',url:'http://wanghg.top/img/img5.jpg'},
            ],
            
            a8:[],
            a9:[],
            a10:[],
            imgHeight:0,
            slideIndex:"",
            mv:[
                {img:homeImg1,id:67007254,name:"五粮液总厂正品五粮液1918"},
                {img:homeImg2,id:2182361716,name:"法国巴拉克城堡干红葡萄酒"},
                {img:homeImg3,id:188045202,name:"法国格兰白兰地酒40度洋酒"},
                {img:homeImg4,id:1838423737,name:"杏花村酒53度玉坊原浆酒"}
            ]
        };
    }
    state = { 
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
        const {list} = this.state;
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
                            list.map((item,index)=>{
                                return(
                                    <li key={index} >
                                            <Link to={{
                                                pathname:"/detail/"+item.id,
                                                search:"?src="+item.name
                                                
                                            }}>
                                                <h2><img src={item.url} alt=""/></h2>                                       
                                                <h3>
                                                    <p>{item.name}</p>
                                                    <b>￥{item.price/10}</b><span>{item.des}</span>
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
                            list.map((item,index)=>{
                                return(
                                    <li key={index} >
                                            <Link to={{
                                                pathname:"/detail/"+item.id,
                                                search:"?src="+item.name
                                            }}>
                                                <h2><img src={item.url} alt=""/></h2>                                       
                                                <h3>
                                                    <p>{item.name}</p>
                                                    <em>清仓价:{item.price/10-88}</em>
                                                    <b className="normal_price">￥{item.price/10}</b>
                                                    <span>{item.des}</span>
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
                            list.map((item,index)=>{
                                return(
                                    <li key={index} >
                                            <Link to={{
                                                pathname:"/detail/"+item.id,
                                                search:"?src="+item.name
                                                
                                            }}>
                                                <h2><img src={item.url} alt=""/></h2>                                       
                                                <h3>
                                                    <p>{item.name}</p>
                                                    <em>折扣价:{parseInt(item.price/10*0.75)}</em>
                                                    <b className="normal_price">￥{item.price/10}</b>
                                                    <span>{item.des}</span>
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
                            list.map((item,index)=>{
                                return(
                                    <li key={index} >
                                            <Link to={{
                                                pathname:"/detail/"+item.id,
                                                search:"?src="+item.name
                                                
                                            }}>
                                                <h2><img src={item.url} alt=""/></h2>                                       
                                                <h3>
                                                    <p>{item.name}</p>
                                                    <em>团购价:{item.price/10-70}</em>
                                                    <b className="normal_price">￥{item.price/10}</b>
                                                    <span>{item.des}</span>
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