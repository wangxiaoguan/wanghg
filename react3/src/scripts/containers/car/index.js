

import React,{Component} from "react";
import "./index.scss";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6
import {Head} from "../../components/head";
import {Toast,PullToRefresh, Modal, Button} from "antd-mobile";
const alert = Modal.alert;
const prompt = Modal.prompt;
import axios from "axios";

export class Car extends Component{

    state = {mv:[],refreshing: false,totalprice:null}

    componentWillMount(){
        if(sessionStorage.name){
            Toast.loading("努力加载中...",1);
                axios.get("http://60.205.201.113:8000/getdata",{params:{userid:sessionStorage.name}})
                .then(res=>{this.setState({mv:res.data })  })
        }else{this.show();}
    }
    componentDidMount(){
        if(sessionStorage.name){
            this.carpay.style.display="block"
        }
    }
     showAlert = (shopId,index) => {
       
        const alertInstance = alert('您确定删除该商品吗?','', [
          { text: '取消',style: 'default' , onPress: () => {} },
          { text: '删除', onPress: () =>{             
              document.getElementsByClassName("goods")[index].setAttribute("id","deleteone");
              axios.get("http://60.205.201.113:8000/detele",{params:{shopid:shopId,userid:sessionStorage.name}})
              .then(res=>{
                this.state.mv.splice(index,1);
                this.setState({mv:this.state.mv})
                document.getElementsByClassName("goods")[index].setAttribute("id","");
              })
          } },
        ]);
        setTimeout(() => {
          // 可以调用close方法以在外部close
          alertInstance.close();
        }, 500000);
      };
    reduce=(id,index)=>{
        this.state.mv[index].num>1?this.state.mv[index].num--:1;
        this.setState({mv:this.state.mv});
        axios.get("http://60.205.201.113:8000/updatenum",{params:{userid:sessionStorage.name,shopId:id,num:this.state.mv[index].num}})
        .then(res=>{})
        }
    add=(id,index)=>{
        this.state.mv[index].num++;
        this.setState({mv:this.state.mv});
        axios.get("http://60.205.201.113:8000/updatenum",{params:{userid:sessionStorage.name,shopId:id,num:this.state.mv[index].num}})
        .then(res=>{})
        }
    checkone=(index)=>{var sum=this.state.mv.length;var total=0;       
       if(document.getElementsByClassName("checkone")[index].checked){
        this.i.innerHTML=this.i.innerHTML*1+this.state.mv[index].num* this.state.mv[index].shopprice*1;
        this.setState({totalprice:this.i.innerHTML})
        Array.prototype.slice.call(document.getElementsByName("checkone")).forEach((item)=>{
            if(item.checked){total+=1}
            if(total==sum){document.getElementById("checkall").checked=true}
            
         }) 
       }else{
        this.i.innerHTML=this.i.innerHTML*1-this.state.mv[index].num* this.state.mv[index].shopprice*1;
        this.setState({totalprice:this.i.innerHTML*1})
        document.getElementById("checkall").checked=false;
       }

    }
    checkall=()=>{
        if(document.getElementById("checkall").checked){
            this.state.mv.forEach((item)=>{
                this.i.innerHTML=this.i.innerHTML*1+item.num* item.shopprice*1;
            })
            this.setState({totalprice:this.i.innerHTML})
            Array.prototype.slice.call(document.getElementsByName("checkone")).forEach((item)=>{
                    item.checked=true;
            }) 
        }else{
            this.i.innerHTML="0"; this.setState({totalprice:this.i.innerHTML*1})
            Array.prototype.slice.call(document.getElementsByName("checkone")).forEach((item)=>{
                item.checked=false;
        }) 
        }
    }
    //登录
    show = () => prompt(
        '登录','',
        (login, password) =>{
            axios.get("http://60.205.201.113:8000/login",
            {params:{phone:login,pwd:password}})
             .then(res=>{
                 if(res.data.length){
                     Toast.info("登录成功!",1);
                     axios.get("http://60.205.201.113:8000/getdata")
                    .then(res=>{this.setState({mv:res.data })  })
                     sessionStorage.name=res.data[0].name;
                 }else{Toast.info("用户名不存在或密码错误",1);}
                 }) 
        },
        'login-password',
        null,
        ['请输入手机号', '请输入密码'],
    )
    //立即支付
    goPay=()=>{
       
        if(this.state.totalprice){
            const {history} = this.props;
            history.push("/pay/?price="+this.state.totalprice)

        }else{Toast.info("请选择商品",1);}
        
    }
    render(){
        return (
            <div id="car" >
                <Head title="购物车" />
                <ul className="my-list clearfix" style={{marginTop:45}}>
                    <PullToRefresh
                        damping={60}
                        ref={el => this.ptr = el}
                        style={{
                            overflow: 'auto',
                        }}
                        indicator='上拉可以刷新'
                        direction= 'down' 
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                           
                            this.setState({ refreshing: true });
                            setTimeout(() => {
                                this.setState({ 
                                    refreshing: false ,
                                    mv:this.state.mv.reverse()
                                });
                            }, 1000);
                        }}
                    >
                     <ReactCSSTransitionGroup
                        transitionName={
                            {
                                enter:"enter",
                                leave:'leave',
                                appear:"appear"
                            }
                        }
                        transitionAppear={true}
                        transitionEnter={true}
                        transitionLeave={true}
                        transitionAppearTimeout={500}
                        transitionEnterTimeout={800}
                        transitionLeaveTimeout={800}
                        
                    >
                    {
                        this.state.mv.map((m,index)=>{
                            return (
                               
                                <li key={index} className="goods">
                                   <input onClick={()=>this.checkone(index)} className="checkone" type="checkbox" name="checkone" id=""/>
                                   <img src={m.shopimg} alt=""/>
                                   <div className="title">
                                        <p>{m.shopname}</p>
                                        <div className="title_h">
                                            <h4>￥{m.shopprice}</h4>
                                            <h5>
                                                <button className="red" onClick={()=>this.reduce(m.shopid,index)} >-</button>
                                                <button  className="num">{m.num}</button>
                                                <button className="add" onClick={()=>this.add(m.shopid,index)}>+</button>
                                            </h5>
                                            <span >{m.shopprice*m.num}</span>
                                            {/* <h6><button onClick={()=>this.delete(index)}>删除</button></h6> */}
                                            <Button size="small" onClick={()=>this.showAlert(m.shopid,index)}>删除</Button>
                                        </div>
                                   
                                   
                                   </div>
                                    
                                </li>
                                
                            )
                        })
                    }
                    </ReactCSSTransitionGroup>
                    </PullToRefresh>
                </ul>
                <div className="car_pay" style={{display:sessionStorage.name?"block":"none"}} ref={el=>this.carpay=el}>
                    <h3>
                        <input  type="checkbox" onClick={this.checkall}  id="checkall"/>
                        <label htmlFor="checkall">全选</label>                       
                    </h3>
                    <h4>
                        <b>合计:￥<i ref={el=>this.i=el}>0</i></b>
                        <Button onClick={this.goPay} style={{ verticalAlign:"middle"}} size="small" inline type="warning">立即结算</Button>
                    </h4>                   
                </div>
            </div>
        )
    }
}