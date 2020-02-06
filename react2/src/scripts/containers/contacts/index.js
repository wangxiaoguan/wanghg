

import React,{Component} from "react";
import "./index.scss";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6

import {Head} from "../../components/head";
import {List,Toast,PullToRefresh} from "antd-mobile";
const Item = List.Item;

import {Link} from "react-router-dom"

import axios from "axios";

export class Contacts extends Component{

    state = {
        mv:[],
        refreshing: false,
    }

    componentWillMount(){
        Toast.loading("努力加载中...",1);
        axios.get("http://47.94.208.182:3000/movie")
        .then(res=>{
            setTimeout(()=>{
                Toast.hide();
                this.setState({
                    mv:res.data
                })
                // Toast.info("数据请求成功!");
            },0)
        })
    }
    

    render(){console.log(this.props);
        return (
            <div>
                <Head title="通讯录" />
                <ul className="my-list clearfix">
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
                            console.log("正在下拉刷新")
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
                               
                                <li key={index} >
                                    <Link to={{
                                        pathname:"/contact/detail/"+m.id+"/"+m.title,
                                        search:"?src="+m.images.large+"&year="+m.year
                                    }}>
                                        <img src={m.images.large} alt=""/>
                                        <p>{m.title}--{m.year}</p>
                                    </Link>
                                </li>
                                
                            )
                        })
                    }
                    </ReactCSSTransitionGroup>
                    </PullToRefresh>
                </ul>
                {/* <List className="my-list">
                    {
                        this.state.mv.map((m,index)=>{
                            return (
                                <Item
                                    key={index}
                                    thumb={m.images.large}
                                    arrow="horizontal"
                                    wrap
                                    extra = {
                                        <Link
                                            to="/"
                                        >
                                            {m.title}--{m.year}
                                        </Link>
                                    }
                                    
                                    multipleLine
                                    activeStyle={{color:'yellowgreen',height:200}}
                                >
                                </Item>
                            )
                        })
                    }
                </List> */}
            </div>
        )
    }
}