import React, { Component } from 'react';
import { Row, Col, Tabs,Input,Select,DatePicker,Button, Form, Table ,Icon, Spin, message } from 'antd';
import API_PREFIX from '../../apiprefix';
import{getService,postService} from '../../myFetch';
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
class PointsStatistics extends Component{
    constructor(props){
        super(props);
        this.state={
            spinning: false,
            total: 0,
            pageSize: 10,
            currentPage: 1,
            query: '',
            selectedRowKeys: [],
            tabKey: 1,
            data: [],
            reportExcel: false,//导出按钮可点击
        };
 
    }
    componentWillMount(){
        let startDate = moment().subtract( 30, 'days').format('YYYY-MM-DD 00:00:00');
        let endDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD 23:59:59');
        let query = `Q=startDate=${startDate}&Q=endDate=${endDate}`;//get请求得参数处理
        // let query={//post请求得参数处理
        //     startDate:startDate,
        //     endDate:endDate,
        // };
        this.setState({
            query,
        }, () => this.requestData());
    }
    requestData = () => { //封装发送查询、分页请求
        this.setState({spinning: true});
        let {currentPage, pageSize, query, tabKey} = this.state;
        console.log('currentPage', currentPage);
        console.log('pageSize', pageSize);
        console.log('query', query);
        console.log('tabKey', tabKey);
        let path = '';
        if(tabKey == 1) {//分类积分统计
            path = `${API_PREFIX}services/web/report/business/point/pointList/get?Q=type=1&${query?`${query}`:''}`;//get请求得参数处理
            // path=`${API_PREFIX}services/task/business/specialAndClassifiedPoint/getList`;//post请求得参数处理
            // query.type='classfiedPoint';
            // query.page=currentPage;
            // query.pageSize=pageSize;
        }else {//专项积分统计
            path = `${API_PREFIX}services/web/report/business/point/pointList/get?Q=type=2&${query?`${query}`:''}`;//get请求得参数处理
            // path = `${API_PREFIX}services/partybuildingreport/task/taskListPagesIndex/${currentPage}/${pageSize}?${query?`${query}`:''}`;//post请求得参数处理
            // query.type='specialPoint';
            // query.page=currentPage;
            // query.pageSize=pageSize;
        }
        
        //接口get请求xwx2019/7/1
        getService(path, data => {
            if(data.status === 1) {
                data.root.object.forEach((item, i) => {
                item['key'] = i + 1;
                });
                this.setState({
                data: data.root.object,
                total: data.root.totalNum,
                spinning: false,
                });
            }else {
                this.setState({spinning: false});
                message.error('请求数据失败');
            }  
        });

        //接口post请求xwx2019/7/1
        // postService(path,query,data=>{
        //     if(data.retCode==1){
        //         data.root.list.forEach((item,i)=>{
        //             item['key']=i+1;
        //         });
        //         this.setState({
        //             data:data.root.list,
        //             total:data.root.totalNum,
        //             spinning: false,
        //         });
        //     }else{
        //         this.setState({spinning: false});
        //         message.error('请求数据失败');
        //     }
        // });
    }
    querySubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err) {
                console.log('222222222222', values);
                console.log('333333333333', moment(values.startDate).format('YYYY-MM-DD 00:00:00'));
                console.log('444444444444', moment(values.endDate).format('YYYY-MM-DD 23:59:59'));
                let startDate = moment(values.startDate).format('YYYY-MM-DD 00:00:00');
                let endDate =moment(values.endDate).format('YYYY-MM-DD 23:59:59');
                let query = `Q=startDate=${startDate}&Q=endDate=${endDate}`;//get请求参数
                // let query={//post请求参数
                //     startDate:startDate,
                //     endDate:endDate,
                // };
                console.log('111111111111111111', query);
                this.setState({
                    currentPage: 1,
                    query,
                    reportExcel:false,
                }, () => {
                    console.log('111111111111');
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
        }, () => {this.requestData();});
    }
    pageSizeChange = (current, size) => {
        this.setState({
          currentPage: 1,
          pageSize: size,
        }, () => {this.requestData();});
        
    }

    //分类积分统计导出
    exportExcel=()=>{
        this.setState({reportExcel: true});//点击后置灰
        let { query,tabKey} = this.state;
        let path='';
        // let fileName='';
        // let queryExport={};
        // fileName=`财富分布情况统计(${query.startDate}-${query.endDate})`;
        if(tabKey == 1){//分类积分统计导出
            path=`${API_PREFIX}services/web/report/business/point/export?Q=type=1&${query}`;
            //post请求得参数
            // queryExport.startDate=query.startDate;
            // queryExport.endDate=query.endDate;
            // queryExport.type='classfiedPoint';
        }else{//专项积分统计导出
            path=`${API_PREFIX}services/web/report/business/point/export?Q=type=2&${query}`;
            //post请求得参数
            // queryExport.startDate=query.startDate;
            // queryExport.endDate=query.endDate;
            // queryExport.type='specialPoint';
        }
        getService(path,data=>{
            if(data.status===1&&data.root.object===true){
            }else{
                message.error(data.errorMsg);
            }
        });
    }

     //导出excel进入到我的导出页面
     myExport=()=>{
        location.hash='/PersonalWork/MyExport';
    }

    keyChange = (key) => {
        let startDate = moment().subtract( 30, 'days').format('YYYY-MM-DD 00:00:00');
        let endDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD 23:59:59');
        let query = `Q=startDate=${startDate}&Q=endDate=${endDate}`;//get请求参数
        // let query={//post请求参数
        //     startDate:startDate,
        //     endDate:endDate,
        // };
        this.props.form.setFieldsValue({
            startDate: moment(moment().subtract( 30, 'days'), 'YYYY-MM-DD'),
            endDate: moment(new Date(), 'YYYY-MM-DD'),
        });
        this.setState({
            tabKey: key,
            query,
            currentPage: 1,
            pageSize: 10,
            reportExcel:false,
        }, () => this.requestData());
    }
    detailData = () => {
        const columns1=[
            {
            title:'序号',
            dataIndex:'key',
            key:'key',
            width:120,
            },
            {
            title:'积分类型',
            dataIndex:'type',
            key:'type',
            },
            {
            title:'增加总和',
            dataIndex:'addPoint',
            key:'addPoint',
            },
            {
            title:'减少总和',
            dataIndex:'desPoint',
            key:'desPoint',
            },
        ];
        const columns2=[
            {
            title:'序号',
            dataIndex:'key',
            key:'key',
            },
            {
            title:'积分类型',
            dataIndex:'type',
            key:'type',
            },
            {
            title:'总额',
            dataIndex:'sumPoint',
            key:'sumPoint',
            },
            {
            title:'数量',
            dataIndex:'num',
            key:'num',
            },
            {
            title:'已消费',
            dataIndex:'consumePoint',
            key:'consumePoint',
            },
        ];
        const { selectedRowKeys, tabKey } = this.state;
        let powers = this.props.powers;
        let exportExcelPower = powers && powers['20009.21904.202'];//导出
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: '6' }, wrapperCol: { span: '18' } };
        // const rowSelection = {
        // selectedRowKeys,
        // onChange: this.onSelectChange,
        // };
        // let pagination = {
        //     showSizeChanger: true,
        //     showQuickJumper: true,
        //     total: this.state.total,
        //     current: this.state.currentPage,
        //     pageSize: this.state.pageSize,
        //     onChange: this.change,
        //     onShowSizeChange: this.pageSizeChange,
        //     showTotal: total => `共 ${total} 条`,
        // };

        return (
            // <Spin size='large' spinning={this.state.spinning}>
            <div className='pointsStatistics'>
                <div className='formTop'>
                <Form onSubmit={this.querySubmit}>
                    <Row>
                    <Col>
                        <FormItem>
                            <label>选择时间：</label>
                            {getFieldDecorator('startDate', {
                            initialValue:moment(moment().subtract(30, 'days'), 'YYYY-MM-DD'),
                            })(
                            <DatePicker format={'YYYY-MM-DD'} allowClear={false} />
                            )}
                        <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                            {getFieldDecorator('endDate', {
                            initialValue: moment(new Date(), 'YYYY-MM-DD'),
                            })(
                            <DatePicker  format={'YYYY-MM-DD'} allowClear={false} />
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
                <Table id='tableExcel'  columns={tabKey == 1 ? columns1 : columns2} dataSource={this.state.data} bordered={true} pagination={false} />
              
            </div>
            //  </Spin>
        );
    }
    render(){
        return(
            <Tabs defaultActiveKey="1" onChange={this.keyChange}>
                <TabPane tab="分类积分统计" key="1">
                    {this.state.tabKey == 1 ? this.detailData() : null}
                </TabPane>
                <TabPane tab="专项积分统计" key="2">
                    {this.state.tabKey == 2 ?this.detailData() : null}
                </TabPane>
            </Tabs>
        );
    }
}
export default PointsStatistics;