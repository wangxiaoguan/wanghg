






import React,{Component} from "react";



import axios from "axios";


import "./index.scss";

import {Button,  Modal,NavBar,Icon,Toast  } from 'antd-mobile';

const alert = Modal.alert;
const prompt = Modal.prompt;








export class My1 extends Component{

    state = {mv:[]}

    componentWillMount(){
            Toast.loading("努力加载中...",1);
                axios.get("http://60.205.201.113:8000/getcollect",{params:{userid:sessionStorage.name}})
                .then(res=>{this.setState({mv:res.data })  })
       
    }

     showAlert = (shopId,index) => {
       
        const alertInstance = alert('您确定删除该商品吗?','', [
          { text: '取消',style: 'default' , onPress: () => {} },
          { text: '确定', onPress: () =>{             
              document.getElementsByClassName("goods")[index].setAttribute("id","deleteone");
              axios.get("http://60.205.201.113:8000/detcol",{params:{shopid:shopId,userid:sessionStorage.name}})
              .then(res=>{
                this.state.mv.splice(index,1);
                this.setState({mv:this.state.mv})
                document.getElementsByClassName("goods")[index].setAttribute("id","");
              })
          } },
        ]);
        setTimeout(() => {
          alertInstance.close();
        }, 500000);
      };
      goPay=(item)=>{
        if(sessionStorage.name){
            const {history} = this.props;
            axios.get("http://60.205.201.113:8000/goodscar",
            {params:{userid:sessionStorage.name,
                     id:item.shopid,
                     name:item.shopname,
                     img:item.shopimg,
                     price:item.shopprice,
                }})
             .then(res=>{   history.push("/app/car"); })   
        }else{show()}
    }




    goback=()=>{ const {history} = this.props;history.goBack();}

    render(){
        return (
            <div id="my1"  className="common">
                <NavBar
                        mode="dark"
                        style={{backgroundColor:"red"}}
                        icon={<Icon type="left" />}
                        leftContent={"返回"}
                        onLeftClick={this.goback}
                >{"我的收藏"}</NavBar>
                <ul className="my-list clearfix" style={{marginTop:45}}>
                    {
                        this.state.mv.map((m,index)=>{
                            return (
                               
                                <li key={index} className="goods">
                                   <img src={m.shopimg} alt=""/>
                                   <div className="title">
                                        <p>{m.shopname}</p>
                                        <div className="title_h">
                                            <b>价格:￥{m.shopprice}</b>
                                            <Button size="small" inline  onClick={()=>this.goPay(m)} type="primary">购买</Button>
                                            <Button inline size="small"type="warning" onClick={()=>this.showAlert(m.shopid,index)}>删除</Button>
                                        </div>                                   
                                   </div>
                                </li>
                            )
                        })
                    }
                   
                </ul>
            </div>
        )
    }
}

//WingBlank 左右留白 <WingBlank><p></p></WingBlank>
//WhiteSpace 上下留白 <WhiteSpace size="lg"></WhiteSpace>或者<WhiteSpace size="lg" />