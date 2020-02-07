import React, { Component } from 'react';
import { Row, Col, Input, Form,Button, Spin, message } from 'antd'
import API_PREFIX from '../../apiprefix';
import{getService,GetQueryString, postService} from '../../myFetch';
import '../oprativereport.less'
const FormItem = Form.Item


class UserActionDataDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            spinning: false,
            detail: {},
            userId:GetQueryString(location.hash,['userId']).userId,//获取前一个页面传过来的id
        }
 
    }
    componentDidMount(){
        this.setState({spinning: true})
        let startDate = `${sessionStorage.getItem('startDate')} 00:00:00`
        let endDate = `${sessionStorage.getItem('endDate')} 23:59:59`
        let query = `Q=startDate=${startDate}&Q=endDate=${endDate}&Q=userId=${this.state.userId}`
        getService(`${API_PREFIX}services/web/report/business/userBehavior/getOne?${query}`, data => {
            if(data.status == '1') {
                this.setState({
                    detail: data.root.object && data.root.object[0],
                    spinning: false
                })
            }else {
                this.setState({spinning: false})
                message.error('请求数据失败')
            }  
        })
    }
   
    
    
    render(){
        const formItemLayout = { labelCol: { span: '8' }, wrapperCol: { span: '16' } };
        const detail = this.state.detail
        return(
            <Spin size='large' spinning={this.state.spinning}>
            <div className='userActionDataDetail'>
                <div className='titleDate'><span>{sessionStorage.getItem('startDate')}</span>&nbsp;~&nbsp;<span>{sessionStorage.getItem('endDate')}</span></div>
                <div className='formTop'>
                <Form style={{padding: '10px 40px'}}>
                <Row>
                    <Col span={8}>
                    <FormItem {...formItemLayout} label='姓名：'>
                        <Input disabled value={detail && detail.name} /> 
                    </FormItem>
                    </Col>
                    <Col span={8}>
                    <FormItem {...formItemLayout} label='员工号：'>
                        <Input disabled value={detail && detail.userNo}/>
                    </FormItem>
                    </Col>  
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='手机号：'>
                        <Input disabled value={detail && detail.mobile}/>
                        </FormItem>
                    </Col>  
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='邮箱：'>
                            <Input disabled value={detail && detail.email}/>   
                        </FormItem>
                    </Col>  
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='所属部门：'>
                        <Input disabled value={detail && detail.displayName}/>    
                        </FormItem>
                    </Col> 
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='是否活跃：'>
                        <Input disabled value={detail && detail.isActive}/>   
                        </FormItem>
                    </Col> 
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='账号状态：'>
                        <Input disabled value={detail && detail.status == 1 ? '正常' : '冻结'}/> 
                        </FormItem>
                    </Col> 
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='个人经验：'>
                        <Input disabled value={detail && detail.exp}/>  
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='个人积分：'>
                        <Input disabled value={detail && detail.point}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row> 
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='设备类型：'>
                        <Input disabled value={detail && detail.device}/>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='版本号：'>
                        <Input disabled value={detail && detail.version}/>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                    <FormItem {...formItemLayout} label='最后登录时间：'>
                        <Input disabled value={detail && detail.lastLoginTime}/>
                    </FormItem>
                    </Col> 
                </Row>
                <Row> 
                    <Col span={8}>
                    <FormItem {...formItemLayout} label='创建时间：'>
                        <Input disabled value={detail && detail.createDate}/>
                    </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='积分增长：'>
                        <Input disabled value={detail && detail.cpoint}/>
                        </FormItem>
                    </Col> 
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='积分减少：'>
                        <Input disabled value={detail && detail.dpoint}/>
                        </FormItem>
                    </Col> 
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='经验增长：'>
                        <Input disabled value={detail && detail.apoint}/>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='经验减少：'>
                        <Input disabled value={detail && detail.bpoint}/>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                    <FormItem {...formItemLayout} label='签到次数：'>
                        <Input disabled value={detail && detail.countSigns}/>
                    </FormItem>
                    </Col> 
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='圈聊次数：'>
                        <Input disabled value={detail && detail.countChats}/>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='资讯浏览数：'>
                        <Input disabled value={detail && detail.countNewViews}/>
                        </FormItem>
                    </Col> 
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='参加活动数：'>
                        <Input disabled value={detail && detail.countActivities}/>
                        </FormItem>
                    </Col> 
                </Row>
                </Form>
                <div className='back'><Button onClick={() => history.back()}>返回</Button></div>
                </div>
            </div>
            </Spin>
        )
    }
}
export default UserActionDataDetail;