

import React,{Component} from "react";
import {Link} from "react-router-dom"
import axios from "axios";


import "./index.scss";


import {WhiteSpace ,Tabs,List,Toast,PullToRefresh,Button,NavBar,Icon} from "antd-mobile";

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
const page=6;
export class Sort extends Component{
    state = {a1:[],a2:[],a3:[],a4:[],a5:[],a6:[],refreshing: false,result:[]}
    componentWillMount(){
        Toast.loading("努力加载中...",1);
        axios.get("http://60.205.201.113:8000/sort")
        .then(res=>{
                this.setState({
                    a1:res.data[0].a1, 
                    a2:res.data[0].a2,
                    a3:res.data[0].a3,
                    a4:res.data[0].a4,
                    a5:res.data[0].a5,
                    a6:res.data[0].a6
                })
        })
    }
    goblock=()=>{
        this.search.style.display="none";
        this.sort.style.display="block";
    }
    gosearch=()=>{
        
        const inpVal = this.input.value;
        this.search.style.display="block";
        this.sort.style.display="none";
        axios.get("http://60.205.201.113:8000/search",{ params:{msg:inpVal}
            }).then(res=>{
            Toast.loading("努力加载中...",1);
            setTimeout(()=>{
                this.setState({ result:res.data})
            },1000)
        })
    }

    render(){
        return (
            <div id="sort" >
                <NavBar
                    mode="dark"
                    style={{backgroundColor:"red"}}
                    icon={<Icon type="left" />}
                    leftContent={"分类"}
                    onLeftClick={this.goblock}
                    >{"美酒"}</NavBar>
                <div className="search" style={{marginTop:45}}>
                <input type="text" ref={input => this.input = input}  className="input"/>
                <Button onClick={this.gosearch} inline size="samll" style={{color:"red"}}>搜索</Button>
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
                <div style={{height:530}} ref={el=>this.sort=el}>
                    <WhiteSpace />
                    <Tabs tabs={tabs} initalPage={0} tabBarPosition="left" tabDirection="vertical" renderTabBar={props => <Tabs.DefaultTabBar {...props} page={6} />} >

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                    <ul className="my-list clearfix">
                    <PullToRefresh
                        damping={60}
                        ref={el => this.ptr = el}
                        style={{overflow: 'auto',}}
                        indicator='上拉可以刷新'
                        direction= 'down' 
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                            
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
                        
                    >
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
                    </ReactCSSTransitionGroup>
                    </PullToRefresh>
                </ul>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',  backgroundColor: '#fff' }}>
            <ul className="my-list clearfix">
            <PullToRefresh
                        damping={60}
                        ref={el => this.ptr = el}
                        style={{overflow: 'auto',}}
                        indicator='上拉可以刷新'
                        direction= 'down' 
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                            
                            this.setState({ refreshing: true });
                            setTimeout(() => {
                                this.setState({ 
                                    refreshing: false ,
                                    a2:this.state.a2.reverse()
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
                        
                    >
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
                    </ReactCSSTransitionGroup>
                    </PullToRefresh>
                    </ul>
                    
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',  backgroundColor: '#fff' }}>
      <ul className="my-list clearfix">
      <PullToRefresh
                        damping={60}
                        ref={el => this.ptr = el}
                        style={{overflow: 'auto',}}
                        indicator='上拉可以刷新'
                        direction= 'down' 
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                            
                            this.setState({ refreshing: true });
                            setTimeout(() => {
                                this.setState({ 
                                    refreshing: false ,
                                    a3:this.state.a3.reverse()
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
                        
                    >
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
                    </ReactCSSTransitionGroup>
                    </PullToRefresh>
                    </ul>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',  backgroundColor: '#fff' }}>
      <ul className="my-list clearfix">
      <PullToRefresh
                        damping={60}
                        ref={el => this.ptr = el}
                        style={{overflow: 'auto',}}
                        indicator='上拉可以刷新'
                        direction= 'down' 
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                            
                            this.setState({ refreshing: true });
                            setTimeout(() => {
                                this.setState({ 
                                    refreshing: false ,
                                    a4:this.state.a4.reverse()
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
                        
                    >
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
                    </ReactCSSTransitionGroup>
                    </PullToRefresh>
                    </ul>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',  backgroundColor: '#fff' }}>
      <ul className="my-list clearfix">
      <PullToRefresh
                        damping={60}
                        ref={el => this.ptr = el}
                        style={{overflow: 'auto',}}
                        indicator='上拉可以刷新'
                        direction= 'down' 
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                            
                            this.setState({ refreshing: true });
                            setTimeout(() => {
                                this.setState({ 
                                    refreshing: false ,
                                    a5:this.state.a5.reverse()
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
                        
                    >
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
                    </ReactCSSTransitionGroup>
                    </PullToRefresh>
                    </ul>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',  backgroundColor: '#fff' }}>
      <ul className="my-list clearfix">
      <PullToRefresh
                        damping={60}
                        ref={el => this.ptr = el}
                        style={{overflow: 'auto',}}
                        indicator='上拉可以刷新'
                        direction= 'down' 
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                            
                            this.setState({ refreshing: true });
                            setTimeout(() => {
                                this.setState({ 
                                    refreshing: false ,
                                    a6:this.state.a6.reverse()
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
                        
                    >
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
                    </ReactCSSTransitionGroup>
                    </PullToRefresh>
                    </ul>
      </div>
    </Tabs>
    <WhiteSpace />
  </div>
                

               
                
            </div>
        )
    }
}