

import React,{Component} from "react";

import axios from "axios";

import "./index.scss";



import {Toast,NavBar,Icon,Modal,Button } from "antd-mobile";

import getQuery from "../../utils/getQuery"
const prompt = Modal.prompt;
const show = () => prompt(
    '登录','',
    (login, password) =>{
        axios.get("http://60.205.201.113:8000/login",
        {params:{phone:login,pwd:password}})
         .then(res=>{
            
             if(res.data.length){
                 Toast.info("登录成功!",1);
                 sessionStorage.name=res.data[0].name;
                
             }else{Toast.info("用户名不存在或密码错误",1);}
             }) 
    },
    'login-password',
    null,
    ['请输入手机号', '请输入密码'],
)



export class Detail extends Component{
    state={detail:[],goodsid:0,item:null}
    constructor(props) { super(props);    }
    componentDidMount(){
        Toast.loading("努力加载中...",1);
        axios.get("http://60.205.201.113:8000/goodsid?id="+this.props.match.params.id)
        .then(res=>{
            
            Toast.info("数据请求成功!");           
                Toast.hide();
                this.setState({
                    detail:res.data[0],
                    item:res.data[0],
                    goodsid:res.data[0].goods_id
                })
               
        })
    }
          
    goback=()=>{ const {history} = this.props;history.goBack();}
    //加入购物车
    joinCar=()=>{
        // console.log(this.state.goodsid)
        if(sessionStorage.name){
            axios.get("http://60.205.201.113:8000/goodscar",
            {params:{userid:sessionStorage.name,
                     id:this.state.item.goods_id,
                     name:this.state.item.goods_name,
                     img:this.state.item.thumb_url,
                     price:this.state.item.normal_price,
            
                }})
             .then(res=>{  Toast.info("加入购物车成功!",1);  })   
        }else{show()}
        
    }
    //立即购买
    goPay=()=>{
        if(sessionStorage.name){
            const {history} = this.props;
            axios.get("http://60.205.201.113:8000/goodscar",
            {params:{userid:sessionStorage.name,
                     id:this.state.item.goods_id,
                     name:this.state.item.goods_name,
                     img:this.state.item.thumb_url,
                     price:this.state.item.normal_price,
                }})
             .then(res=>{   history.push("/app/car"); })   
        }else{show()}
    }
    //收藏
    goCollect=()=>{
        if(sessionStorage.name){
            axios.get("http://60.205.201.113:8000/collect",
            {params:{userid:sessionStorage.name,
                     id:this.state.item.goods_id,
                     name:this.state.item.goods_name,
                     img:this.state.item.thumb_url,
                     price:this.state.item.normal_price,
            
                }})
             .then(res=>{  Toast.info("收藏成功!",1);  })   
        }else{show()}
    }

    render(){
        const {match,location} =this.props;
        return (
            <div id="detail" style={{marginTop:45}}>
                {/* <Head title={getQuery(location.search).src.slice(0,6)} show={true} history={this.props.history}/> */}
                <NavBar
                        mode="dark"
                        style={{backgroundColor:"red"}}
                        icon={<Icon type="left" />}
                        leftContent={"返回"}
                        onLeftClick={this.goback}
                        >{getQuery(location.search).src.slice(0,6)}</NavBar>
                <img src={this.state.detail.thumb_url} alt=""/>
                <div className="news">
                <h2 className="name">{this.state.detail.goods_name}</h2>
                <ul className="address">
                    <li>快递:免运费</li>
                    <li>月销:206笔</li>
                    <li>云南</li>
                </ul>
                <h3 className="price">
                    <b>￥{this.state.detail.normal_price/10}</b>
                    <span>{this.state.detail.sales_tip}</span>
                </h3>
                <h3 className="join">
                    <Button size="small" inline onClick={this.joinCar} type="primary" >加入购物车</Button>
                    <Button size="small" inline  onClick={this.goPay} type="warning">立即购买</Button>
                    <Button size="small" inline onClick={this.goCollect} style={{background:'yellow'}} >收藏</Button>
                </h3>
                </div>
                <h4>商品详情</h4>
                <p>
                    <img src={this.state.detail.image1} alt=""/>
                    <img src={this.state.detail.image2} alt=""/>
                    <img src={this.state.detail.image3} alt=""/>
                </p>           
            </div>
        )
    }
}