
import React,{Component} from "react";
import {Input,Button,Row,Col,Table,Spin,message,Divider} from 'antd'
export default class Detail extends Component{
    constructor(props){
        super(props);
        this.state={
           detailData:{},
           loading:false,
           id:''
        }
    }
    componentDidMount(){
        let params = this.props.match.params
        this.getDetail(params.id)
        this.setState({id:params.id})
    }
    componentDidUpdate() {
        let params = this.props.match.params
        if(params.id!==this.state.id){
            this.getDetail(params.id)
            this.setState({id:params.id})
        }
    }
    getDetail = id => {
        this.setState({loading:true})
        fetch(`http://wanghg.top/php/html/detail.php?id=${id}`).then(res=>{
                res.json().then(data=>{
                    this.setState({detailData:data,loading:false})
                })
            }).catch(error=>{
                message.error('获取详情失败')
                this.setState({loading:false})
            })
    }
    render(){
        const {detailData,loading} = this.state
        return(
            <div id='Detail'>
                <Spin spinning={loading}>
                    <h1 className='title_h1'>{detailData.title}</h1>
                    {
                        detailData.title?<div dangerouslySetInnerHTML={{__html:unescape(detailData.content)}}></div>:null
                    }
                </Spin>
                
                
            </div>
        )
    }
}


