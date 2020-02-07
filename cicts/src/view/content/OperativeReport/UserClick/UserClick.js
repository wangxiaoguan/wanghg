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
class UserClick extends Component{
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
            columnData: [],//所属栏目数据
            reportExcel: false,//导出按钮可点击
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
            this.dealDepartmentData(organizationData);
            this.setState({ departments: organizationData});
          }else{
            message.error(data.errorMsg);
          }
        }
      );
      // 请求所属栏目下拉框数据
      getService(
        API_PREFIX + 'services/web/report/business/userClick/getMidInfo',
        data => {
          if (data.status === 1) {
            this.setState({ columnData: data.root.object});
          }else{
            message.error(data.errorMsg);
          }
        }
      );
      let startDate = moment().subtract( 30, 'days').format('YYYY-MM-DD 00:00:00');
      let endDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD 23:59:59');
      let query = `Q=startDate=${startDate}&Q=endDate=${endDate}`;
      console.log('111111111111111111', query);
      this.setState({
          query,
      }, () => {
          this.requestData(); //请求数据
      });
    }

    //处理组织机构中的数据
    dealDepartmentData(data) {
      data&&data.map((item, index) => {
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
        let {query, currentPage, pageSize} = this.state;
        getService(`${API_PREFIX}services/web/report/business/userClick/userClickList/get/${currentPage}/${pageSize}?${query}`, data => {
            if(data.status == '1') {
                data.root.list && data.root.list.forEach((item, i) => {
                    item['key'] = i + 1+(currentPage-1)*pageSize;
                });
                this.setState({
                    dataSource: data.root.list,
                    total: data.root.totalNum,
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
                values.startDate = moment(values.startDate).format('YYYY-MM-DD 00:00:00');
                values.endDate =moment(values.endDate).format('YYYY-MM-DD 23:59:59');
                let query = '';
                for(let key in values) {
                    if(values[key]) {
                        query += `Q=${key}=${values[key]}&`;
                    }
                }
                query = query.substr(0, query.length - 1);
                console.log('111111111111111111', query);
                this.setState({
                    query,
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
    exportExcel = () => {
      this.setState({reportExcel: true});//点击后置灰
        getService(`${API_PREFIX}services/web/report/business/userClick/export?${this.state.query}`, res => {
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
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            // width:300,
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
            title:'所属部门',
            dataIndex:'fullName',
            key:'fullName',
            },
            {
            title:'点击栏目',
            dataIndex:'midName',
            key:'midName',
            },
            {
            title:'点击次数',
            dataIndex:'sumcount',
            key:'sumcount',
            },
        ];
        let powers = this.props.powers;
        let exportExcelPower = powers && powers['20009.21908.202'];//导出
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
        const dateLayout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };
        const { selectedRowKeys,departments,columnData } = this.state;
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
            <Spin size='large' spinning={this.state.spinning}>
            <div className='userClick'>
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
                      <FormItem {...formItemLayout} label='所属栏目：'>
                        {
                          getFieldDecorator('midId',{
                        })(
                            <Select placeholder='请选择' >
                                {columnData.map(item => {
                                    return <Option key={item.midId} value={item.midId}>{item.midName}</Option>;
                                })}
                            </Select>
                          )
                        } 
                      </FormItem>
                    </Col>
                    </Row>
                    <Row>
                    <Col span={14}>
                        <div>
                        <FormItem {...dateLayout} label='选择时间：'>
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
                <Table id='tableExcel' rowSelection={rowSelection} columns={columns} dataSource={this.state.dataSource} bordered={true} pagination={pagination} />
                  
            </div>
            </Spin>
        );
    }
}
export default UserClick;