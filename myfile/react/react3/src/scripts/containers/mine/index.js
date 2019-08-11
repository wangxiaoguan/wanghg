

import React,{Component} from "react";
import "./index.scss";
import {Head} from "../../components/head";

import axios from "axios";
import { Toast, WhiteSpace, WingBlank, Button,Carousel } from 'antd-mobile';

import {connect} from "react-redux";
import { ajaxSend, getmovie } from "../../actions";
@connect(
    state=>(
        {
            ...state
        }
    )
)
export class Mine extends Component{

    state = {
        mvi:[],
        imgHeight:0
    }

    componentWillMount(){
        Toast.loading('努力加载...', 1);
        const {dispatch} = this.props;
        dispatch(ajaxSend({
            config:{
                url:"/movie",
                method:"get",
                params:{
                    limit:4
                }
            },
            success(data){
                
                console.log("ajaxSend")
                console.log(data);
                setTimeout(()=>{
                    Toast.hide();
                    Toast.info('数据请求成功!!!',1);
                    dispatch(getmovie(data))
                },1000)
            }
        }))


        // axios.get("http://47.94.208.182:3000/movie",{
        //     params:{
        //         limit:6
        //     }
        // }).then(res=>{

        //     setTimeout(()=>{
        //         this.setState({
        //             mv:res.data,
        //             imgHeight:300
        //         })
        //         Toast.hide();
        //         Toast.info('数据请求成功');
        //     },1500)
        // })
    }

    render(){
        return (
            <div>
                <Head title="我" />
                <WingBlank>
                <Carousel className="my-carousel"
                    dots={true}
                    autoplay
                    infinite
                    resetAutoplay={false}
                    beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                    afterChange={index => this.setState({ slideIndex: index })}
                    >
                    {
                        this.props.mv.map((item,index)=>{
                            return (
                                <a href="" key={index}
                                    style={{display:"inline-block",width:"100%", height: this.state.imgHeight}}
                                >
                                    <img style={{width:'100%',height:300,verticalAlign: 'top'}}  src={item.images.large} 
                                     onLoad={() => {
                                        // fire window resize event to change height
                                        window.dispatchEvent(new Event('resize'));
                                        this.setState({ imgHeight: 'auto' });
                                      }}
                                    alt=""/>
                                </a>
                            )
                        })
                    }
                    </Carousel>
                </WingBlank>
                

            </div>
        )
    }
}