import React, { Component } from 'react';
import { Row, Col, Tabs,Input,Select,DatePicker,Button, Form, Table ,Icon, Spin, message } from 'antd';
import API_PREFIX from '../../apiprefix';
import{getService, postService} from '../../myFetch';
import {connect} from 'react-redux';
import moment from 'moment';
import '../oprativereport.less';
const FormItem = Form.Item;
const Option = Select.Option;
const { WeekPicker } = DatePicker;

//配置导出按钮权限
@connect(
  state => ({
    powers: state.powers,
  })
)
@Form.create()
class DetailEdit extends Component{
    constructor(props){
        super(props);
        this.state={
            spinning: false,
            total: 0,
            pageSize: 10,
            currentPage: 1,
            query: '',
            selectedRowKeys: [],
            startDate: '',
            endDate: '',
            id: null,
            tabkey: 1,
            dataSource: [],
            depData: {},
            reportExcel: false,//导出按钮可点击
            year:'',//年
            weeks:'',//周
        };
 
    }
    componentWillMount(){
        console.log('我们是一家人', this.props);
        let dd = new Date();
        dd.setDate(dd.getDate() - 7);
        this.handleDate(dd); //调用函数获取上一周周一和周日对应的日期
        // this.handleDate(false, 2)
        this.setState({id: this.props.id, tabkey: this.props.tabkey}, () => {
            console.log('哈哈哈哈哈哈哈哈哈');
            this.requestData();
        });
    }  
    componentWillReceiveProps(nextProps) {
    }
    requestData = () => { //封装发送查询、分页请求
        this.setState({spinning: true});
        let {id,tabkey, startDate, endDate,pageSize,currentPage} = this.state;

        let week = moment(endDate).week();
        let year = moment(endDate).format('YYYY');
        let query = `Q=year=${year}&&Q=week=${week}&&Q=startDate=${startDate}&Q=endDate=${endDate}&Q=orgId=${id}`;
        let path = '';
        if(tabkey == 1) {
            path = `${API_PREFIX}services/web/report/business/departmentBehavior/getDepartmentBehavior?${query}`;
        }else if(tabkey == 2) {
            path = `${API_PREFIX}services/web/report/business/departmentBehavior/getPostMemBehaviorList/${currentPage}/${pageSize}?${query}`;
        }else if(tabkey == 3) {
            path = `${API_PREFIX}services/web/report/business/departmentBehavior/getNotActiveUserList/${currentPage}/${pageSize}?${query}`;
        }
        console.log('55555555555555555', query);
        this.setState({query});
        getService(path, data => {
            if(data.status == 1) {
                console.log('data的值====》',data);
                if(tabkey !== 1){
                    data.root.list&&data.root.list.forEach((item, i) => {
                        item['key'] = i + 1;
                    });
                }
                this.setState({
                    total: data.root.totalNum,
                    spinning: false,
                });
                if(tabkey == 1) {
                    this.setState({depData: data.root.object});
                }else {
                    this.setState({dataSource: data.root.list});
                }
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
                console.log('333333333333', moment(values.startDate).format('YYYY-MM-DD 00:00:00'));
                this.handleDate(values.startDate);
                // this.handleDate(values.startDate, 2)
                this.setState({
                    currentPage: 1,
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
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    change = (page,pageSize) => { //页码改变，发送请求获取数据
        this.setState({ 
          currentPage: page,
          pageSize: pageSize,
        }, () => this.requestData());
      }
    pageSizeChange = (current, size) => {
        this.setState({
          currentPage: 1,
          pageSize: size,
        }, () => this.requestData());
      }
    dateChange = (date, dateStr) => {
        console.log('111111111111111111', date);
        console.log('22222222222222222222222', dateStr);
        console.log('3333333333333333333333',  moment(date).format('YYYY-MM-DD'));
        // this.handleDate(date, 1)
        // this.handleDate(date, 2)
    }
    disabledDate = (current) => {
        let dd =new Date();
        let week = dd.getDay();
        let minus = week ? week : 7; // 获取当前日期上一周的周日日期
        dd.setDate(dd.getDate() - minus);
        return current && current > dd //禁用当前周和以后的日期
    }
    handleDate = (date) => {
        let yearWeeks=date?moment(new Date(date)).format('YYYY-wo'):moment(new Date()).format('YYYY-wo');
        let year=yearWeeks.substr(0,4);
        let weeks=yearWeeks.substr(5,2);
        let dd = date ? new Date(date) : new Date();
        let week = dd.getDay();
        let minus = week ? week - 1 : 6; // 获取当前日期所在周的周一日期
        dd.setDate(dd.getDate() - minus);
        let startDate = moment(dd).format('YYYY-MM-DD 00:00:00');
        console.log('898989999999999', startDate);
        dd.setDate(dd.getDate() + 6);// 获取当前日期所在周的周日日期
        let endDate = moment(dd).format('YYYY-MM-DD 23:59:59');
        console.log('7777777777777777', endDate);
        this.setState({startDate,endDate,year,weeks});
    }
    exportExcel = () => {
        this.setState({reportExcel: true});//点击后置灰
        let path = '';
        let {tabkey, query,year,weeks} = this.state;
        let newQuery=query?`&${query}`:'';
        if(tabkey == 1) {
            path = `${API_PREFIX}services/web/report/business/departmentBehavior/exportDepartmentBehavior?${newQuery}`;
        }else if(tabkey == 2) {
            path = `${API_PREFIX}services/web/report/business/departmentBehavior/exportPostMemBehaviorList?${newQuery}`;
        }else if(tabkey == 3) {
            path = `${API_PREFIX}services/web/report/business/departmentBehavior/exportNotActiveUserList?${newQuery}`;
        }
        getService(path, res => {

        });
    }

     //导出excel进入到我的导出页面
     myExport=()=>{
        location.hash='/PersonalWork/MyExport';
    }

    render(){
        const columns1=[
            {
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            // width:300,
            // fixed: 'left',
            },
            {
            title:'总人数',
            dataIndex:'userName',
            key:'userName',
            // width:100,
            // fixed: 'left',
            },
            {
            title:'考核人数',
            dataIndex:'userNum',
            key:'userNum',
            },
            {
            title:'活跃人数',
            dataIndex:'phone',
            key:'phone',
            },
            {
            title:'阅读人数',
            dataIndex:'emial',
            key:'emial',
            },
            {
            title:'圈聊人数',
            dataIndex:'department',
            key:'department',
            },
            {
            title:'签到人数',
            dataIndex:'isActive',
            key:'isActive',
            },
            {
            title:'总阅读数',
            dataIndex:'statu',
            key:'statu',
            },
            {
            title:'总圈聊数',
            dataIndex:'isActive',
            key:'isActive',
            },
            {
            title:'总签到数',
            dataIndex:'statu',
            key:'statu',
            },
            {
            title:'活跃率',
            dataIndex:'isActive',
            key:'isActive',
            },
            {
            title:'阅读率',
            dataIndex:'statu',
            key:'statu',
            },
            {
            title:'圈聊率',
            dataIndex:'isActive',
            key:'isActive',
            },
            {
            title:'人均阅读次数',
            dataIndex:'statu',
            key:'statu',
            },
            {
            title:'人均圈聊次数',
            dataIndex:'isActive',
            key:'isActive',
            },
            {
            title:'人均签到次数',
            dataIndex:'statu',
            key:'statu',
            },
        ];
        const columns2=[
            {
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            width:80,
            // fixed: 'left',
            },
            {
            title:'姓名',
            dataIndex:'name',
            key:'name',
            // width:100,
            // fixed: 'left',
            },
            {
            title:'阅读数',
            dataIndex:'newsViewCount',
            key:'newsViewCount',
            },
            {
            title:'签到数',
            dataIndex:'signCount',
            key:'signCount',
            },
            {
            title:'圈聊数',
            dataIndex:'chatCount',
            key:'chatCount',
            },
            {
            title:'活动数',
            dataIndex:'activityCount ',
            key:'activityCount ',
            },
            {
            title:'是否活跃',
            dataIndex:'isActive',
            key:'isActive',
            },
        ];
        const columns3=[
            {
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            width:80,
            // fixed: 'left',
            },
            {
            title:'姓名',
            dataIndex:'name',
            key:'name',
            // width:100,
            // fixed: 'left',
            },
            {
            title:'员工号',
            dataIndex:'userNo',
            key:'userNo',
            },
            {
            title:'手机号',
            dataIndex:'mobile',
            key:'mobile',
            },
            {
            title:'邮箱',
            dataIndex:'email',
            key:'email',
            },
            {
            title:'最后使用时间',
            dataIndex:'lastLoginTime',
            key:'lastLoginTime',
            },
        ];
        const { selectedRowKeys, tabkey, depData,dataSource } = this.state;
        let columns = [];
        if(tabkey == 2) {
            columns = columns2;
        }else if(tabkey == 3) {
            columns = columns3;
        }
        let powers = this.props.powers;
        let exportExcelPower = powers && powers['20009.21901.202'];//导出
        let findPower = powers && powers['20009.21901.003'];//查询
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: '6' }, wrapperCol: { span: '18' } };
        const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
        };
        let pagination = {
            showSizeChanger: true,
            showQuickJumper: true,
            total: this.state.total,
            current: this.state.currentPage,
            pageSize: this.state.pageSize,
            onChange: this.change,
            onShowSizeChange: this.pageSizeChange,
            showTotal: total => `共 ${total} 条`,
        };
        let DateTime = new Date()
        DateTime.setDate(DateTime.getDate() - 7)
        return(
            <Spin size='large' spinning={this.state.spinning}>
            <div className='right'>
                <div className='formTop'>
                <Form onSubmit={this.querySubmit}>
                    <Row>
                    <Col>
                        <FormItem  label='选择时间：'>
                            {getFieldDecorator('startDate', {
                            initialValue:moment(DateTime, 'YYYY-MM-DD'),
                            })(
                            <WeekPicker
                            // onChange={this.dateChange}
                                disabledDate={this.disabledDate}
                             />
                            )}
                        </FormItem>
                    </Col>
                    </Row>
                    <Row>
                    <Col>
                       {findPower?<Button type="primary" htmlType="submit">查询</Button>:null} 
                       {findPower?  <Button onClick={this.reset}>重置</Button>:null}                   
                        {exportExcelPower ? <Button className='excel' disabled={this.state.reportExcel} onClick={this.exportExcel}>导出Excel</Button> : null}
                        {this.state.reportExcel?<span><Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>导出文件已加入队列，请在<b style={{color:'#007aff',cursor:'pointer'}} onClick={this.myExport}>我的导出</b>查看</span>:null}
                        {/* <Button onClick={() => this.setState({visible: true})}>设置定时任务</Button> */}
                    </Col>
                    </Row>
                </Form>
                </div>
                {
                    tabkey == 1 ? (
                        <table className='departmentTable'  cellSpacing='0' border='1'>
                            <thead>
                            <tr>
                                <th>总人数</th>
                                <th>考核人数</th>
                                <th>活跃人数</th>
                                <th>阅读人数</th>
                                <th>圈聊人数</th>
                                <th>签到人数</th>
                                <th>总阅读数</th>
                                <th>总圈聊数</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{depData && depData.totalNum}</td>
                                <td>{depData && depData.registerNum}</td>
                                <td>{depData && depData.activeNum}</td>
                                <td>{depData && depData.newsViewNum}</td>
                                <td>{depData && depData.chatNum}</td>
                                <td>{depData && depData.signNum}</td>
                                <td>{depData && depData.newsViewCount}</td>
                                <td>{depData && depData.chatCount}</td>
                            </tr>
                            <tr>
                                <th>总签到数</th>
                                <th>活跃率</th>
                                <th>阅读率</th>
                                <th>圈聊率</th>
                                <th>签到率</th>
                                <th>人均阅读次数</th>
                                <th>人均圈聊次数</th>
                                <th>人均签到次数</th>
                            </tr>
                            <tr>
                                <td>{depData && depData.signCount}</td>
                                <td>{depData && depData.activePer}</td>
                                <td>{depData && depData.newsViewNumsPer}</td>
                                <td>{depData && depData.chatNumsPer}</td>
                                <td>{depData && depData.signNumsPer}</td>
                                <td>{depData && depData.newsViewCountsPer}</td>
                                <td>{depData && depData.chatCountsPer}</td>
                                <td>{depData && depData.signCountsPer}</td>
                            </tr>
                            </tbody>
                        </table>
                    ) : (
                        <Table id='tableExcel' rowSelection={rowSelection} columns={columns} dataSource={dataSource} bordered={true} pagination={pagination} />
                    )
                }
            </div>
            </Spin>
        );
    }
}
export default DetailEdit;