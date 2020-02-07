import React, { Component } from 'react';
import { Row, Col, Tabs,Input,Select,DatePicker,Button, Form, Table ,Icon, Spin, message } from 'antd';
import API_PREFIX from '../../apiprefix';
import{getService, postService} from '../../myFetch';
import {connect} from 'react-redux';
import moment from 'moment';
import '../oprativereport.less';
const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

//配置导出按钮权限
@connect(
  state => ({
    powers: state.powers,
  })
)
@Form.create()
class ExperienceStatistics extends Component{
    constructor(props){
        super(props);
        this.state={
            spinning: false,
            query: '',
            selectedRowKeys: [],
            data: [],
            reportExcel: false,//导出按钮可点击
        };
 
    }
    componentWillMount(){
        let startDate = moment().subtract( 30, 'days').format('YYYY-MM-DD 00:00:00');
        let endDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD 23:59:59');
        let query = `Q=startDate=${startDate}&Q=endDate=${endDate}`;
        this.setState({
            query,
        }, () => this.requestData());
    }
    requestData = () => { //封装发送查询、分页请求
        this.setState({spinning: true});
        getService(`${API_PREFIX}services/web/report/business/experience/expList/get?${this.state.query}`, data => {
            if(data.status == '1') {
                data.root.object && data.root.object.forEach((item, i) => {
                    item['key'] = i + 1;
                });
                this.setState({
                    data: data.root.object,
                    spinning: false,
                });
            }else {
                this.setState({spinning: false});
                message.error('请求数据失败');
            }  
        });
    }
    querySubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err) {
                console.log('222222222222', values);
                let startDate = moment(values.startDate).format('YYYY-MM-DD 00:00:00');
                let endDate =moment(values.endDate).format('YYYY-MM-DD 23:59:59');
                let query = `Q=startDate=${startDate}&Q=endDate=${endDate}`;
                console.log('111111111111111111', query);
                this.setState({
                    query,
                    reportExcel: false,//导出按钮可点击
                }, () => {
                    this.requestData(); //请求数据
                });
            }
        });
    }
    reset = () => {
        this.props.form.resetFields();
    }
    exportExcel = () => {
        this.setState({reportExcel: true});//点击后置灰
        getService(`${API_PREFIX}services/web/report/business/experience/export?${this.state.query}`, res => {
            if(res.status == 1) {
                
            }else {
                message.error(res.errorMsg);
            }
        });
    }

     //导出excel进入到我的导出页面
     myExport=()=>{
        location.hash='/PersonalWork/MyExport';
    }

    render(){
        const columns=[
            {
            title:'序号',
            dataIndex:'key',
            key:'key',
            width: 100,
            fixed: 'left',
            },
            {
            title:'经验类型',
            dataIndex:'desp',
            key:'desp',
            width: 200,
            fixed: 'left',
            // render: (text, record) => {
            //     switch (Number(record.type)) {
            //         case 1:
            //             return '资讯';
            //         case 2:
            //             return '活动';
            //         case 3:
            //             return '评价';
            //         case 4:
            //             return '分享';
            //         case 5:
            //             return '意见反馈';
            //         case 6:
            //             return '投稿';
            //         case 7:
            //             return '发言';
            //         default:
            //             return ''
            //     }
            // }
            },
            {
            title:'增加总和',
            dataIndex:'sum',
            key:'sum',
            width: 200,
            fixed: 'left',
            },
        ];
        let powers = this.props.powers;
        let exportExcelPower = powers && powers['20009.21902.202'];//导出
        const { getFieldDecorator } = this.props.form;
        return(
            <Spin size='large' spinning={this.state.spinning}>
            <div className='experienceStatistics'>
                <div className='formTop'>
                <Form onSubmit={this.querySubmit}>
                    <Row>
                    <Col>
                        <FormItem>
                            <label>选择时间：</label>
                            {getFieldDecorator('startDate', {
                            initialValue:moment(moment().subtract(30, 'days'), 'YYYY-MM-DD'),
                            })(
                            <DatePicker format={'YYYY-MM-DD'} />
                            )}
                        <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                            {getFieldDecorator('endDate', {
                            initialValue: moment(new Date(), 'YYYY-MM-DD'),
                            })(
                            <DatePicker  format={'YYYY-MM-DD'} />
                            )}
                        </FormItem>
                    </Col>
                    </Row>
                    <Row>
                    <Col>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button onClick={this.reset}>重置</Button>
                        {exportExcelPower?(<Button className='excel' disabled={this.state.reportExcel} onClick={this.exportExcel}>导出Excel</Button>):null} 
                         {this.state.reportExcel?<span><Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>导出文件已加入队列，请在<b style={{color:'#007aff',cursor:'pointer'}} onClick={this.myExport}>我的导出</b>查看</span>:null}       
                    </Col>
                    </Row>
                </Form>
                </div>
                <Table id='experienceTable' columns={columns} dataSource={this.state.data} bordered={true} pagination={false} />
              
            </div>
            </Spin>
        );
    }
}
export default ExperienceStatistics;