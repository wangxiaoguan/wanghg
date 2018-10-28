

import React,{Component} from "react";
import {Link} from "react-router-dom"
import axios from "axios";


import "./index.scss";

import {Head} from "../../components/head";
import {WhiteSpace ,Tabs,List,Toast,PullToRefresh} from "antd-mobile";

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6



const Item = List.Item;



const tabs = [
    {title:"白酒"},
    {title:"啤酒"},
    {title:"葡萄酒"},
    {title:"洋酒"},
    {title:"黄酒"},
    {title:"保健酒"}
]

export class Sort extends Component{
    state = {sorts:[],refreshing: false}
    
    // getData(data){
    //     console.log(data.title)
    //     console.log(tabs[1])
    //     if(data.title==tabs[0].title){sortid="a1"}
    //     else if(data.title==tabs[1].title){sortid="a2"}
    //     else if(data.title==tabs[2].title){sortid="a3"}
    //     else if(data.title==tabs[3].title){sortid="a4"}
    //     else if(data.title==tabs[4].title){sortid="a5"}
    //     else if(data.title==tabs[5].title){sortid="a6"}
        

    // }
    // componentWillUpdate(){
    //     axios.get("http://60.205.201.113:8000/sort?sortid="+sortid)
    //     .then(res=>{
    //         setTimeout(()=>{
    //             Toast.hide();
    //             this.setState({
    //                 a1:res.data
    //             })
    //             // Toast.info("数据请求成功!");
    //         },0)
    //     })
    // }
    componentWillMount(){
        Toast.loading("努力加载中...",1);
        axios.get("http://60.205.201.113:8000/sort")
        .then(res=>{
            // setTimeout(()=>{
                Toast.hide();
                this.setState({
                    sorts:res.data[0]
                   
                })
                // console.log(this.state.sorts.a1)
                // Toast.info("数据请求成功!");
            // },0)
        })
    }
    // componentDidMount() {
    //     //调用CustomTextInput实例的focus方法
    //     this.ptr.click(
    //         console.log("aaaaaaa")
    //     );
    //   }


    render(){
        console.log(this.state.sorts)
        var abc=this.state.sorts.a1;
        console.log(abc)
    // var aaaa={...abc}
        return (
            <div id="sort">
                <Head title="分类" />
                <WhiteSpace />
                <div style={{ overflow:'hidden' }}>
                <Tabs tabs={tabs} initalPage={'t2'} onChange={(page)=>this.getData(page)}>

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
                        abc.map((wine,index)=>{
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
                    {/* <ul className="my-list clearfix">
                    {
                        this.state.sorts.a2.map((wine,index)=>{
                            return (
                               
                                <li key={index} >
                                    <Link to={{
                                        pathname:"/sort/detail/"+wine.goods_id
                                        
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
                    </ul> */}
                   
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow:'auto', backgroundColor: '#fff' }}>
                    {/* <ul className="my-list clearfix">
                    {
                        this.state.sorts.a2.map((wine,index)=>{
                            return (
                               
                                <li key={index} >
                                    <Link to={{
                                        pathname:"/sort/detail/"+wine.goods_id
                                        
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
                    </ul> */}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow:'auto', backgroundColor: '#fff' }}>
                    {/* <ul className="my-list clearfix">
                    {
                        this.state.sorts.a3.map((wine,index)=>{
                            return (
                               
                                <li key={index} >
                                    <Link to={{
                                        pathname:"/sort/detail/"+wine.goods_id
                                        
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
                    </ul> */}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow:'auto', backgroundColor: '#fff' }}>
                    {/* <ul className="my-list clearfix">
                    {
                        this.state.sorts.a4.map((wine,index)=>{
                            return (
                               
                                <li key={index} >
                                    <Link to={{
                                        pathname:"/sort/detail/"+wine.goods_id
                                        
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
                        this.state.sorts.a5.map((wine,index)=>{
                            return (
                               
                                <li key={index} >
                                    <Link to={{
                                        pathname:"/sort/detail/"+wine.goods_id
                                        
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
                    </ul> */}
                    </div>
                </Tabs>
                </div>
                
            </div>
        )
    }
}