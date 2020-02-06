

import React,{Component} from "react";
import {Link} from "react-router-dom"
import axios from "axios";


import "./index.scss";

import {Head} from "../../components/head";
import {WhiteSpace ,Tabs,List,Toast,PullToRefresh,Button} from "antd-mobile";

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6



const Item = List.Item;



const tabs = [
    {title:"白酒"},
    {title:"啤酒"},
    {title:"葡萄酒"},
    {title:"洋酒"},
    {title:"黄酒"},
    {title:"果酒"}
]

export class Sort extends Component{
    state = {a1:[],a2:[],a3:[],a4:[],a5:[],a6:[],refreshing: false,result:[]}
    componentWillMount(){
        Toast.loading("努力加载中...",1);
        axios.get("http://60.205.201.113:8000/sort")
        .then(res=>{
            // setTimeout(()=>{
                Toast.hide();
                this.setState({
                    a1:res.data[0].a1, 
                    a2:res.data[0].a2,
                    a3:res.data[0].a3,
                    a4:res.data[0].a4,
                    a5:res.data[0].a5,
                    a6:res.data[0].a6
                   
                })
                // console.log(this.state.sorts.a1)
                // Toast.info("数据请求成功!");
            // },0)
        })
    }

    gosearch=()=>{
        
        const inpVal = this.input.value;
        this.input.style.backgroundColor="red";
        this.search.style.display="block";
        this.lanmu.style.display="none";
        console.log(inpVal);
        axios.get("http://60.205.201.113:8000/search",{ params:{msg:inpVal}
            }).then(res=>{
            Toast.loading("努力加载中...",1);
            setTimeout(()=>{
                Toast.hide();
                this.setState({
                    result:res.data
                   
                   
                })
                console.log(this.state.result)
                Toast.info("数据请求成功!");
            },1200)
        })
    }

    render(){
        return (
            <div id="sort" style={{marginTop:45}}>
                <Head title="分类" />   
                <div className="search">
                <input type="text" ref={input => this.input = input}  className="input"/>
                <Button onClick={this.gosearch} inline size="samll">搜索</Button>
                </div> 
                <div ref={search => this.search = search} className="search" style={{display:"none"}}>
                <ul className="my-list clearfix" >
                    {
                        this.state.result.map((wine,index)=>{
                            return (
                               
                                <li key={index} >
                                <Link to={{
                                    pathname:"/detail/"+wine.goods_id,
                                    search:"?src="+wine.goods_name
                                    
                                }}>
                                    <img src={wine.thumb_url} alt=""/>
                                    <h2>{wine.goods_name}</h2>
                                    <h3>
                                        <b>{wine.normal_price/10}</b>
                                        <span>{wine.sales_tip}</span>
                                    </h3>
                                </Link>
                            </li>
                                
                            )
                        })
                    }
                    </ul>
                
                
                
                </div>            
                <div ref={lanmu => this.lanmu = lanmu} className="lanmu" style={{ overflow:'hidden' }}>
                <Tabs  tabs={tabs} initalPage={'t2'} >

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',  backgroundColor: '#fff' }}>
                    <ul className="my-list clearfix">
                    {/* <PullToRefresh
                        damping={60}
                        ref={el => this.ptr = el}
                        style={{overflow: 'auto',}}
                        indicator='上拉可以刷新'
                        direction= 'down' 
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                            console.log("正在下拉刷新")
                            this.setState({ refreshing: true });
                            setTimeout(() => {
                                this.setState({ 
                                    refreshing: false ,
                                    a1:this.state.a1.reverse()
                                });
                            }, 1000);
                        }}
                    >
                     <ReactCSSTransitionGroup
                        transitionName={{enter:"enter",leave:'leave',appear:"appear"}}
                        transitionAppear={true}
                        transitionEnter={true}
                        transitionLeave={true}
                        transitionAppearTimeout={500}
                        transitionEnterTimeout={800}
                        transitionLeaveTimeout={800}
                        
                    > */}
                    {
                        this.state.a1.map((wine,index)=>{
                            return (
                               
                                <li key={index} >
                                    <Link to={{
                                        pathname:"/detail/"+wine.goods_id,
                                        search:"?src="+wine.goods_name
                                        
                                    }}>
                                        <img src={wine.thumb_url} alt=""/>
                                        <h2>{wine.goods_name}</h2>
                                        <h3>
                                            <b>{wine.normal_price/10}</b>
                                            <span>{wine.sales_tip}</span>
                                        </h3>
                                    </Link>
                                </li>
                                
                            )
                        })
                    }
                    {/* </ReactCSSTransitionGroup>
                    </PullToRefresh> */}
                </ul>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow:'auto', backgroundColor: '#fff' }}>
                    <ul className="my-list clearfix">
                    {
                        this.state.a2.map((wine,index)=>{
                            return (
                               
                                <li key={index} >
                                <Link to={{
                                    pathname:"/detail/"+wine.goods_id,
                                    search:"?src="+wine.goods_name
                                    
                                }}>
                                    <img src={wine.thumb_url} alt=""/>
                                    <h2>{wine.goods_name}</h2>
                                    <h3>
                                        <b>{wine.normal_price/10}</b>
                                        <span>{wine.sales_tip}</span>
                                    </h3>
                                </Link>
                            </li>
                                
                            )
                        })
                    }
                    </ul>
                   
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow:'auto', backgroundColor: '#fff' }}>
                    <ul className="my-list clearfix">
                    {
                        this.state.a3.map((wine,index)=>{
                            return (
                               
                                <li key={index} >
                                <Link to={{
                                    pathname:"/detail/"+wine.goods_id,
                                    search:"?src="+wine.goods_name
                                    
                                }}>
                                    <img src={wine.thumb_url} alt=""/>
                                    <h2>{wine.goods_name}</h2>
                                    <h3>
                                        <b>{wine.normal_price/10}</b>
                                        <span>{wine.sales_tip}</span>
                                    </h3>
                                </Link>
                            </li>
                                
                            )
                        })
                    }
                    </ul>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow:'auto', backgroundColor: '#fff' }}>
                    <ul className="my-list clearfix">
                    {
                        this.state.a4.map((wine,index)=>{
                            return (
                               
                                <li key={index} >
                                <Link to={{
                                    pathname:"/detail/"+wine.goods_id,
                                    search:"?src="+wine.goods_name
                                    
                                }}>
                                    <img src={wine.thumb_url} alt=""/>
                                    <h2>{wine.goods_name}</h2>
                                    <h3>
                                        <b>{wine.normal_price/10}</b>
                                        <span>{wine.sales_tip}</span>
                                    </h3>
                                </Link>
                            </li>
                                
                            )
                        })
                    }
                    </ul>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow:'auto', backgroundColor: '#fff' }}>
                    <ul className="my-list clearfix">
                    {
                        this.state.a5.map((wine,index)=>{
                            return (
                               
                                <li key={index} >
                                <Link to={{
                                    pathname:"/detail/"+wine.goods_id,
                                    search:"?src="+wine.goods_name
                                    
                                }}>
                                    <img src={wine.thumb_url} alt=""/>
                                    <h2>{wine.goods_name}</h2>
                                    <h3>
                                        <b>{wine.normal_price/10}</b>
                                        <span>{wine.sales_tip}</span>
                                    </h3>
                                </Link>
                            </li>
                                
                            )
                        })
                    }
                    </ul>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow:'auto', backgroundColor: '#fff' }}>
                    <ul className="my-list clearfix">
                    {
                        this.state.a6.map((wine,index)=>{
                            return (
                               
                                <li key={index} >
                                <Link to={{
                                    pathname:"/detail/"+wine.goods_id,
                                    search:"?src="+wine.goods_name
                                    
                                }}>
                                    <img src={wine.thumb_url} alt=""/>
                                    <h2>{wine.goods_name}</h2>
                                    <h3>
                                        <b>{wine.normal_price/10}</b>
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
                
            </div>
        )
    }
}