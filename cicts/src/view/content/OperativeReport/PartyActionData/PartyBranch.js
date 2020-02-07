import React, { Component } from 'react';
import { Row, Col, Tabs,Input,Select,DatePicker,Button, Form, Table ,Icon, Spin, message } from 'antd';
import API_PREFIX from '../../apiprefix';
import{getService,postService} from '../../myFetch';
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
class PartyBranch extends Component{
    constructor(props){
        super(props);
        this.state={
            spinning: false,
            total: 0,
            pageSize: 10,
            currentPage: 1,
            query: {},
            selectedRowKeys: [],
            startDate: '',
            endDate: '',
            id: null,
            tableData: [],
            tabkey: 1,
            visible: false,
            initPbulishData: [],
            publishDate: '',
            reportExcel: false,//导出按钮可点击
        };
 
    }
    componentWillMount(){
        console.log('我们是一家人', this.props);
        this.handleDate(false, 1);
        this.handleDate(false, 2);
        this.setState({id: this.props.id, tabkey: this.props.tabkey}, () => {
            this.requestData();
        });
    }  
    // componentWillReceiveProps(nextProps) {
        // console.log('nextProps============送就送进宫建瓯市jog', nextProps.id);
        // if(nextProps.id != this.state.id) {
        //     console.log('nextProps============', nextProps.id)
        //     this.handleDate(false, 1)
        //     this.handleDate(false, 2)
        //     this.setState({id: nextProps.id})
        //     this.requestData(nextProps.id)
        // }
    // }
    requestData = () => { //封装发送查询、分页请求
        let {currentPage, pageSize,id,startDate,endDate}=this.state;
        this.setState({spinning: true});
        let newQuery=`Q=partyId=${id}&Q=startDate=${startDate}&Q=endDate=${endDate}`;

        console.log("startDate===>",startDate);
         let week = moment(endDate).week();
         let year = moment(endDate).format('YYYY');
         let path = `${API_PREFIX}services/web/report/business/partyBehavior/getList/${currentPage}/${pageSize}?Q=year=${year}&&Q=week=${week}&&Q=type=partyBranch&${newQuery?`${newQuery}`:''}`;
        //get请求的参数
        getService(path,data=>{
            if(data.status===1){
                this.setState({
                    data:data.root.list,
                });
            }else{
                this.setState({spinning: false});
                message.error('请求数据失败');
            }
        });

        //post请求的参数
        //  query.type='partyBranch';
        //  query.page=currentPage;
        //  query.pageSize=pageSize;
        //  query.partyId=id;
        //  query.startDate=startDate;
        //  query.endDate=endDate;
        // let path=`${API_PREFIX}services/task/business/partyBehavior/getList`;
        // postService(path,query,data=>{
        //     if(data.retCode == '1'){
        //         data.root.list.forEach((item,i)=>{
        //             item['key'] = i + 1;
        //             this.setState({
        //                 data: data.root.list,
        //                 total: data.root.totalNum,
        //                 spinning: false,
        //             });
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


console.log("values===>",values);


                // console.log('333333333333', moment(values.startDate).format('YYYY-MM-DD 00:00:00'));
                // console.log('444444444444', moment(values.endDate).format('YYYY-MM-DD 23:59:59'));
                // let startDate = moment(values.startDate).format('YYYY-MM-DD 00:00:00');
                // let endDate =moment(values.endDate).format('YYYY-MM-DD 23:59:59');
                // sessionStorage.setItem('startDate', moment(values.startDate).format('YYYY-MM-DD'));
                // sessionStorage.setItem('endDate', moment(values.endDate).format('YYYY-MM-DD'));
                // let query={//post请求的参数
                //     startDate: this.state.startDate,
                //     endDate:this.state.endDate,
                // };
                this.handleDate(values.startDate, 1);
                this.handleDate(values.startDate, 2);
                this.setState({
                    startDate: this.state.startDate,
                    endDate:this.state.endDate,
                    reportExcel: false,
                }, () => {
                    this.requestData(); //请求数据
                });
            }
        });
    }
    reset = () => {
        this.props.form.resetFields();
        this.handleDate(false, 1);
        this.handleDate(false, 2);
    }
    // onSelectChange = (selectedRowKeys) => {
    //     this.setState({ selectedRowKeys });
    // }
    // change = (page,pageSize) => { //页码改变，发送请求获取数据
    //     this.setState({ 
    //       currentPage: page,
    //       pageSize: pageSize,
    //     });
    //     this.requestData(page, pageSize,this.state.query);
    //   }
    // pageSizeChange = (current, size) => {
    //     this.setState({
    //       currentPage: 1,
    //       pageSize: size,
    //     });
    //     this.requestData(1, size, this.state.query);
    //   }
    dateChange = (date, dateStr) => {
        this.handleDate(date, 1);
        this.handleDate(date, 2);
    }
    handleDate = (date, flag) => {
        let dd = date ? new Date(date) : new Date();
        let week = dd.getDay();
        if(flag == 1) { // 获取当前日期所在周的周一日期
            let minus = week ? week - 1 : 6;
            dd.setDate(dd.getDate() - minus);
            let startDate = moment(dd).format('YYYY-MM-DD 00:00:00');
            this.setState({startDate});
        }else if(flag == 2) {// 获取当前日期所在周的周日日期
            let minus = week ? 7 - week : 0;
            dd.setDate(dd.getDate() + minus); 
            let endDate = moment(dd).format('YYYY-MM-DD 23:59:59');
            this.setState({endDate});
        }
    }

    //党支部excel导出
    exportExcel=()=>{
        this.setState({reportExcel: true});//点击后置灰
        let { id,startDate,endDate} = this.state;
        let week = moment(endDate).week();
        let year = moment(endDate).format('YYYY');
        let path=`${API_PREFIX}services/web/report/business/partyBehavior/export?Q=year=${year}&&Q=week=${week}&&Q=type=partyBranch&Q=partyId=${id}&Q=startDate=${startDate}&Q=endDate=${endDate}`;
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

    render(){
        const columns=[
            {
            title:'总人数',
            dataIndex:'registerNum',
            key:'registerNum',
            width:120,
            },
            {
            title:'活跃人数',
            dataIndex:'activeNum',
            key:'activeNum',
            width:120,
            },
            {
            title:'活跃率',
            dataIndex:'activePer',
            key:'activePer',
            width:120,
            },
            {
            title:'总荣誉积分增长',
            dataIndex:'addTreasure',
            key:'addTreasure',
            width:120,
            },
            {
            title:'总荣誉积分减少',
            dataIndex:'subTreasure',
            key:'subTreasure',
            width:120,
            },
            {
            title:'总经验增长',
            dataIndex:'addExp',
            key:'addExp',
            width:120,
            },
            {
            title:'总经验减少',
            dataIndex:'subExp',
            key:'subExp',
            width:120,
            },
            {
            title:'总阅读数',
            dataIndex:'viewCount',
            key:'viewCount',
            width:120,
            },
        ];
        const columns1=[
            {
                title:'总圈聊数',
                dataIndex:'chatCount',
                key:'chatCount',
                width:120,
                },
                {
                title:'总签到数',
                dataIndex:'signCount',
                key:'signCount',
                width:120,
                },
                {
                title:'阅读人数',
                dataIndex:'viewNum',
                key:'viewNum',
                width:120,
                },
                {
                title:'圈聊人数',
                dataIndex:'chatNum',
                key:'chatNum',
                width:120,
                },
                {
                title:'签到人数',
                dataIndex:'signNum',
                key:'signNum',
                width:120,
                },
                {
                title:'阅读率',
                dataIndex:'viewNumsPer',
                key:'viewNumsPer',
                width:120,
                },
                {
                title:'圈聊率',
                dataIndex:'chatNumsPer',
                key:'chatNumsPer',
                width:120,
                },
                {
                title:'签到率',
                dataIndex:'signNumsPer',
                key:'signNumsPer',
                width:120,
                },
        ];
     
        const { selectedRowKeys, tabkey } = this.state;
        let powers = this.props.powers;
        let exportExcelPower = powers && powers['20009.21903.202'];//导出
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: '6' }, wrapperCol: { span: '18' } };
        const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
        };
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
        return(
            // <Spin size='large' spinning={this.state.spinning}>
            <div className='right'>
                <div className='formTop'>
                <Form onSubmit={this.querySubmit}>
                    <Row>
                    <Col>
                        <FormItem  label='选择时间：'>
                            {/* {getFieldDecorator('startDate', {
                            initialValue:moment(moment().subtract(30, 'days'), 'YYYY-MM-DD')
                            })(
                            <DatePicker format={'YYYY-MM-DD'} />
                            )}
                        <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                            {getFieldDecorator('endDate', {
                            initialValue: moment(new Date(), 'YYYY-MM-DD')
                            })(
                            <DatePicker  format={'YYYY-MM-DD'} />
                            )} */}
                            {getFieldDecorator('startDate', {
                            initialValue:moment(new Date(), 'YYYY-MM-DD'),
                            })(
                            <WeekPicker onChange={this.dateChange} allowClear={false} />
                            )}
                        </FormItem>
                    </Col>
                    </Row>
                    <Row>
                    <Col>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button onClick={this.reset}>重置</Button>
                        {exportExcelPower ? <Button className='excel' disabled={this.state.reportExcel} onClick={this.exportExcel}>导出Excel</Button> : null}
                        {this.state.reportExcel?<span><Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>导出文件已加入队列，请在<b style={{color:'#007aff',cursor:'pointer'}} onClick={this.myExport}>我的导出</b>查看</span>:null}
                    </Col>
                    </Row>
                </Form>
                </div>
                <Table id='tableExcel'  columns={columns} dataSource={this.state.data} bordered={true} pagination={false} />
                <Table  columns={columns1} dataSource={this.state.data} bordered={true} pagination={false} />
              
            </div>
            // </Spin>
        );
    }
}
export default PartyBranch;