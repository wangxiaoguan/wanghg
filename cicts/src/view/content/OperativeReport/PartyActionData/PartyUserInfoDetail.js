import React, { Component } from 'react';
import { Row, Col, Input, Form,Button, Spin, message } from 'antd';
import API_PREFIX from '../../apiprefix';
import{ getService, GetQueryString,postService } from '../../myFetch';
import '../oprativereport.less';
const FormItem = Form.Item;
const { TextArea } = Input;


class PartyUserInfoDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            spinning: false,
            detail: {},
            userId:GetQueryString(location.hash,['userId']).userId,//获取前一个页面传过来的id
        };
 
    }
    componentWillMount(){
        this.setState({spinning: true});

        //----------------------post请求参数接口-----------------------
        // let path=`${API_PREFIX}services/task/business/partyBehavior/getOne`;
        // let query={
        //     id:this.state.userId,
        //     startDate:sessionStorage.getItem('startDate'),
        //     endDate:sessionStorage.getItem('endDate'),
        // };
        // postService(path,query,data=>{
        //     if(data.retCode == '1'){
        //         this.setState({
        //             data:data.root.object[0],
        //         });
        //     }else{
        //         this.setState({spinning: false});
        //         message.error('请求数据失败');
        //     }
        // });

        //---------------------get请求参数接口------------------------
        let path=`${API_PREFIX}services/web/report/business/partyBehavior/getOne?Q=id=${this.state.userId}&Q=startDate=${sessionStorage.getItem('startDate')}%2000:00:00&Q=endDate=${sessionStorage.getItem('endDate')}%2023:59:59`;
        getService(path, data => {
            if(data.status === 1) {
                this.setState({
                data: data.root.object[0],
                spinning: false,
                });
            }else {
                this.setState({spinning: false});
                message.error('请求数据失败');
            }
        });
    }
   
    
    
    render(){
        const formItemLayout = { labelCol: { span: '8' }, wrapperCol: { span: '16' } };
        return(
            // <Spin size='large' spinning={this.state.spinning}>
            <div className='partyUserInfoDetail'>
                <div className='titleDate'><span>{sessionStorage.getItem('startDate')}</span>&nbsp;~&nbsp;<span>{sessionStorage.getItem('endDate')}</span></div>
                <div className='formTop'>
                <Form onSubmit={this.querySubmit} style={{padding: '10px 40px'}}>
                <Row>
                    <Col span={12}>
                    <FormItem {...formItemLayout} label='姓名：'>
                        <Input disabled value={this.state.data&&this.state.data.name} /> 
                    </FormItem>
                    </Col>
                    <Col span={12}>
                    <FormItem {...formItemLayout} label='党员荣誉积分增长：'>
                        <Input disabled value={this.state.data&&this.state.data.addTreasure}/>
                    </FormItem>
                    </Col>   
                </Row>
                <Row>
                    <Col span={12}>
                    <FormItem {...formItemLayout} label='员工号：'>
                        <Input disabled value={this.state.data&&this.state.data.userNo}/>
                    </FormItem>
                    </Col>
                    <Col span={12}>
                    <FormItem {...formItemLayout} label='党员荣誉积分减少：'>
                        <Input disabled value={this.state.data&&this.state.data.subTreasure}/>
                    </FormItem>
                    </Col> 
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label='手机号：'>
                        <Input disabled value={this.state.data&&this.state.data.mobile}/>
                        </FormItem>
                    </Col> 
                    <Col span={12}>
                        <FormItem {...formItemLayout} label='经验增长：'>
                        <Input disabled value={this.state.data&&this.state.data.addPoint}/>
                        </FormItem>
                    </Col>  
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label='邮箱：'>
                            <Input disabled value={this.state.data&&this.state.data.email}/>   
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label='经验减少：'>
                        <Input disabled value={this.state.data&&this.state.data.subPoint}/>
                        </FormItem>
                    </Col> 
                </Row>
                <Row> 
                    <Col span={12}>
                        <FormItem {...formItemLayout} label='所属党组织：'>
                        <TextArea disabled value={this.state.data&&this.state.data.partyName}/>    
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label='资讯浏览数：'>
                        <Input disabled value={this.state.data&&this.state.data.newsViewNum}/>
                        </FormItem>
                    </Col> 
                </Row>
                <Row> 
                    {/* <Col span={12}>
                        <FormItem {...formItemLayout} label='所属党支部：'>
                        <Input disabled value={this.state.data&&this.state.data.branchName}/>   
                        </FormItem>
                    </Col> */}
                    <Col span={12}>
                        <FormItem {...formItemLayout} label='参加活动数：'>
                        <Input disabled value={this.state.data&&this.state.data.activityNum}/>
                        </FormItem>
                    </Col> 
                    <Col span={12}>
                        <FormItem {...formItemLayout} label='圈聊次数：'>
                        <Input disabled value={this.state.data&&this.state.data.chatNum}/>
                        </FormItem>
                    </Col> 
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label='是否活跃：'>
                        <Input disabled value={this.state.data&&this.state.data.isActive===0?'否':this.state.data&&this.state.data.isActive===1?'是':''}/> 
                        </FormItem>
                    </Col> 
                    <Col span={12}>
                    <FormItem {...formItemLayout} label='签到次数：'>
                        <Input disabled value={this.state.data&&this.state.data.signNum}/>
                    </FormItem>
                    </Col> 
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label='党员荣誉积分：'>
                        <Input disabled value={this.state.data&&this.state.data.point}/>  
                        </FormItem>
                        </Col> 
                </Row>
                </Form>
                <div className='back'><Button onClick={() => history.back()}>返回</Button></div>
                </div>
            </div>
            // </Spin>
        );
    }
}
export default PartyUserInfoDetail;