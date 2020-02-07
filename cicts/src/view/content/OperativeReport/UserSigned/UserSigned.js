import React, { Component } from 'react';
import { Row, Col, Tabs,Input,Select,DatePicker,Button, Form, Table ,Icon, Cascader, Spin, message } from 'antd';
import API_PREFIX from '../../apiprefix';
import{getService, postService} from '../../myFetch';
import {connect} from 'react-redux';
import moment from 'moment';
import '../oprativereport.less';
const FormItem = Form.Item;
const Option = Select.Option;

//配置导出按钮权限
@connect(
  state => ({
    powers: state.powers,
  })
)
@Form.create()
class UserSigned extends Component{
    constructor(props){
        super(props);
        this.state={
            spinning: false,
            total: 0,
            pageSize: 10,
            currentPage: 1,
            query: '',
            selectedRowKeys: [],
            departments:[],//所属部门数据
            dataSource: [],
            reportExcel: false,//导出按钮可点击
            startDate: '',
            endDate: '',
        };
 
    }
    componentDidMount(){
      //级联请求获取所属部门数据
      let organizationData = [];
      getService(
        API_PREFIX + 'services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false',
        data => {
          if (data.status === 1) {
            organizationData = data.root.object;
            if(organizationData){
              this.dealDepartmentData(organizationData);
              this.setState({ departments: organizationData,loading: false });
            }
          }else{
            message.error(data.retMsg);
          }
        }
      );
      
      let startDate = moment().subtract( 1, 'days').format('YYYY-MM-DD 00:00:00');//默认为最近一天
      let endDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD 23:59:59');
      // let query = {//post请求的参数
      //     startDate,
      //     endDate,
      //     page: 1,
      //     pageSize: 10,
      // };
      this.setState({
        startDate,
        endDate,
        currentPage: 1,
        pageSize: 10,
      }, () => {
          this.requestData(); //请求数据
      });
    }

    //处理组织机构中的数据
    dealDepartmentData(data) {
      data.map((item, index) => {
        item.value = item.id + '';
        item.label = item.name;
        item.children = item.subCompanyOrgList;
        if (item.subCompanyOrgList) {
          //不为空，递归
          this.dealDepartmentData(item.subCompanyOrgList);
        }
      });
    }   
    
    requestData = () => { //封装发送查询、分页请求
        this.setState({spinning: true});
        let {currentPage,pageSize,startDate,endDate,query}=this.state;
        let path=`${API_PREFIX}services/web/report/business/sign/signList/get/${currentPage}/${pageSize}?Q=startDate=${startDate}&Q=endDate=${endDate}${query?query:''}`;
        
        getService(path,data=>{
          if(data.status===1){
            if(data.root&&data.root.list&&data.root.list.length!==0){
              data.root.list.forEach((item, i)=>{
                item['key'] = i + 1+(currentPage-1)*pageSize;
              });
              this.setState({
                dataSource:data.root.list,
                total: data.root.totalNum,
                spinning: false,
              });
            }else{
              this.setState({
                dataSource:[],
                total:0,
                spinning: false,
              });
            }
          }else{
            this.setState({spinning: false});
            message.error('请求数据失败');
          }
        });
        // postService(`${API_PREFIX}services/task/business/sign/getList`,  this.state.query,data => {//post请求接口
        //     if(data.retCode == '1') {
        //         data.root.list.forEach((item, i) => {
        //             item['key'] = i + 1;
        //         });
        //         this.setState({
        //             dataSource: data.root.list,
        //             total: data.root.totalNum,
        //             spinning: false,
        //         });
        //     }else {
        //         this.setState({spinning: false});
        //         message.error('请求数据失败');
        //     }  
        // });
    }
    querySubmit = (e) => {
      e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err) {
                let startDate = moment(values.startDate).format('YYYY-MM-DD 00:00:00');
                let endDate =moment(values.endDate).format('YYYY-MM-DD 23:59:59');
                // let query = {...values, startDate, endDate, page: 1, pageSize: this.state.pageSize};//post请求的参数
                let name=((values.name==undefined)||(values.name==''))?'':`&Q=name=${values.name}`;
                let userNo=((values.userNo==undefined)||(values.userNo==''))?'':`&Q=userNo=${values.userNo}`;
                let mobile=((values.mobile==undefined)||(values.mobile==''))?'':`&Q=mobile=${values.mobile}`;
                let email=((values.email==undefined)||(values.email==''))?'':`&Q=email=${values.email}`;
                let orgId=((values.orgId==undefined)||(values.orgId==''))?'':`&Q=orgId=${values.orgId[values.orgId.length-1]}`;
                let position=((values.position==undefined)||(values.position==''))?'':`&Q=position=${values.position}`;
                let query=`${name}${userNo}${mobile}${email}${orgId}${position}`;//get请求的参数
                this.setState({
                    query,
                    startDate,
                    endDate,
                    currentPage: 1,
                    pageSize: 10,
                    reportExcel: false,
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
        // let query = this.state.query;//post请求参数处理
        // query.page = page;//post请求参数处理
        // query.pageSize = pageSize;//post请求参数处理
        this.setState({ 
            currentPage: page,
            pageSize: pageSize,
            // query,//post请求参数处理
        }, () => this.requestData());
      }
      pageSizeChange = (current, size) => {
        // let query = this.state.query;//post请求参数处理
        // query.page = 1;//post请求参数处理
        // query.pageSize = size;//post请求参数处理
        this.setState({
            currentPage: 1,
            pageSize: size,
            // query,//post请求参数处理
        }, () => this.requestData());
      }

      //导出excel
      exportExcel=()=>{
        this.setState({reportExcel: true});//点击后置灰
        let {startDate,endDate,query}=this.state;
        let path=`${API_PREFIX}services/web/report/business/sign/export?Q=startDate=${startDate}&Q=endDate=${endDate}${query}`;
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
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            },
            {
            title:'姓名',
            dataIndex:'name',
            key:'name',
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
            title:'所属部门',
            dataIndex:'fullName',
            key:'fullName',
            },
            {
            title:'签到时间',
            dataIndex:'createDate',
            key:'createDate',
            },
            {
            title:'签到地点',
            dataIndex:'position',
            key:'position',
            },
        ];
        let powers = this.props.powers;
        let exportExcelPower = powers && powers['20009.21905.202'];//导出
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
        const dateLayout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };
        const { selectedRowKeys,departments, dataSource } = this.state;
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
        return(
            // <Spin size='large' spinning={this.state.spinning}>
            <div className='userSigned'>
                <div className='formTop'>
                <Form onSubmit={this.querySubmit}>
                <Row>
                      <Col span={8}>
                        <FormItem {...formItemLayout} label='姓名：'>
                          {getFieldDecorator('name')(<Input placeholder="请输入" />) }    
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem {...formItemLayout} label='员工号：'>
                          {getFieldDecorator('userNo')(<Input placeholder="请输入" />)}
                        </FormItem>
                      </Col>
                    <Col span={8}>
                      <FormItem {...formItemLayout} label='手机号：'>
                        {getFieldDecorator('mobile')(<Input placeholder="请输入" />)}
                      </FormItem>
                    </Col>   
                  </Row>
                  <Row>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='邮箱：'>
                          {getFieldDecorator('email')(<Input placeholder="请输入" />) }    
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label='所属部门：'>
                          {getFieldDecorator('orgId')(
                            <Cascader options={departments} placeholder='请选择' changeOnSelect   />
                          ) }    
                        </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem {...formItemLayout} label='签到地点：'>
                        {
                          getFieldDecorator('position')(
                            <Input placeholder="请输入" />
                          )
                        } 
                      </FormItem>
                    </Col>
                    </Row>
                    <Row>
                    <Col span={16}>
                        <div>
                        <FormItem {...dateLayout} label='选择时间：'>
                            {getFieldDecorator('startDate', {
                            initialValue:moment(moment().subtract(1, 'days'), 'YYYY-MM-DD'),
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
                        </div>
                    </Col>
                    </Row>
                    <Row>
                    <Col>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button onClick={this.reset}>重置</Button>
                    </Col>
                    </Row>
                </Form>
                </div>
                 <div>
                   {exportExcelPower?(<Button className='excel' disabled={this.state.reportExcel} onClick={this.exportExcel}>导出Excel</Button>):null}
                   {this.state.reportExcel?<span><Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>导出文件已加入队列，请在<b style={{color:'#007aff',cursor:'pointer'}} onClick={this.myExport}>我的导出</b>查看</span>:null}           
                 </div>
                <Table id='tableExcel' rowSelection={rowSelection} columns={columns} dataSource={dataSource} bordered={true} pagination={pagination} />
                  
            </div>
            // </Spin>
        );
    }
}
export default UserSigned;