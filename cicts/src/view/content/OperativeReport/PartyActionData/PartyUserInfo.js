import React, { Component } from 'react';
import { Row, Col, Tabs,Input,Select,DatePicker,Button, Form, Table ,Icon, Cascader, Spin, message } from 'antd';
import API_PREFIX from '../../apiprefix';
import{getService,postService} from '../../myFetch';
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
class UserActionData extends Component{
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
            // isOrNotOptions:[],//变更类型
            reportExcel: false,//导出按钮可点击
        };
 
    }
    componentDidMount(){
      //获取部门的数据
      // let organizationData = [];
      getService(`${API_PREFIX}services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1`, data => {
        console.log('ttttttttttttttttttt', data)
        let arr = []
        if(data.status == 1) {
          this.partyDataTree(data.root.object, arr)
          this.setState({
            departments: arr
          })
        }
      })
      
      let startDate = moment().subtract( 30, 'days').format('YYYY-MM-DD 00:00:00');
      let endDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD 23:59:59');
      sessionStorage.setItem('startDate',moment().subtract( 30, 'days').format('YYYY-MM-DD 00:00:00'));
      sessionStorage.setItem('endDate',moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD 23:59:59'));
      let query = `Q=startDate=${startDate}&Q=endDate=${endDate}`;//get请求参数
      // let query={//post请求参数
      //   startDate:startDate,
      //   endDate:endDate,
      // };
      console.log('111111111111111111', query);
      this.setState({
          query,
      }, () => {
          this.requestData(); //请求数据
      });
    }

     //处理组织机构中的数据
     partyDataTree = (partyList, arr) => {
      partyList.forEach(item => {
        if(item.partyOrgList && item.partyOrgList.length>0) {
          arr.push({
            label: item.partyName,
            value: item.id,
            key: item.id,
            children: []
          })
          this.partyDataTree(item.partyOrgList, arr[arr.length - 1].children)
        }else {
          arr.push({
            label: item.partyName,
            value: item.id,
            key: item.id
          })
        }
        
      })
      return arr
    }
    
    requestData = () => { //封装发送查询、分页请求
        this.setState({spinning: true});
        let {currentPage, pageSize, query}=this.state;
        let path = `${API_PREFIX}services/web/report/business/partyBehavior/getList/${currentPage}/${pageSize}?Q=type=partyMember&${query?`${query}`:''}`;//get请求参数
        console.log('query===>',query);
        // query.type='partyMember';//post请求参数
        // query.page=currentPage;//post请求参数
        // query.pageSize=pageSize;//post请求参数
        // let path=`${API_PREFIX}services/task/business/partyBehavior/getList`;//post请求参数
        // postService(path,query,data=>{//post请求参数
        //   if(data.retCode==1){
        //     data.root.list.forEach((item,i)=>{
        //       item['key'] = i + 1;
        //     });
        //     this.setState({
        //       data: data.root.list,
        //       total: data.root.totalNum,
        //       spinning: false,
        //     });
        //   }else{
        //     this.setState({spinning: false});
        //     message.error(data.message);
        //   }
        // });
        getService(path, data => {//get请求
            if(data.status === 1) {
              if(data.root&&data.root.list&&data.root.list.length!==0){
                data.root.list.forEach((item, i) => {
                  item['key'] = i + 1;
                  });
                  this.setState({
                  data: data.root.list,
                  total: data.root.totalNum,
                  spinning: false,
                  });
              }else{
                this.setState({
                  data: [],
                  total: 0,
                  spinning: false,
                  });
              }
            }else if(data.status === 0){
              this.setState({
                data: [],
                total: 0,
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
                console.log('333333333333', moment(values.startDate).format('YYYY-MM-DD 00:00:00'));
                console.log('444444444444', moment(values.endDate).format('YYYY-MM-DD 23:59:59'));
                let startDate = moment(values.startDate).format('YYYY-MM-DD 00:00:00');
                let endDate =moment(values.endDate).format('YYYY-MM-DD 23:59:59');
                sessionStorage.setItem('startDate', moment(values.startDate).format('YYYY-MM-DD'));
                sessionStorage.setItem('endDate', moment(values.endDate).format('YYYY-MM-DD'));
              
                let name=((values.userName==undefined)||(values.userName==''))?'':`&Q=name=${values.userName}`;//姓名
                let userNo=((values.userNum==undefined)||(values.userNum==''))?'':`&Q=userNo=${values.userNum}`;//员工号
                let mobile=((values.phone==undefined)||(values.phone==''))?'':`&Q=mobile=${values.phone}`;//手机号
                let email=((values.email==undefined)||(values.email==''))?'':`&Q=email=${values.email}`;//邮箱
                let partyNameId=((values.partyTotal==undefined)||(values.partyTotal==''))?'':`&Q=partyNameId=${values.partyTotal[values.partyTotal.length-1]}`;//所属党总支
                // let branchNameId=((values.partyBrach==undefined)||(values.partyBrach==''))?'':`&Q=branchNameId=${values.partyBrach[values.partyBrach.length-1]}`;//所属党支部
                let isActive=values.isActive==''&&values.isActive!==0?'':`&Q=isActive=${values.isActive}`;//是否活跃
                let query = `Q=startDate=${startDate}&Q=endDate=${endDate}${name}${userNo}${mobile}${email}${partyNameId}${isActive}`;//get请求的参数
                // let query={//post请求的参数
                //   startDate:startDate,
                //   endDate:endDate,
                // };
                // if(values.userName!==undefined){//姓名//post请求的参数
                //   query.name=values.userName;
                // }
                // if(values.userNum!==undefined){//员工号//post请求的参数
                //   query.userNo=values.userNum;
                // }
                // if(values.phone!==undefined){//手机号//post请求的参数
                //   query.mobile=values.phone;
                // }
                // if(values.email!==undefined){//邮箱//post请求的参数
                //   query.email=values.email;
                // }
                // if(values.partyTotal!==undefined){//所属党总支//post请求的参数
                //   query.partyName=values.partyTotal;
                // }
                // if(values.partyBrach!==undefined){//所属党支部//post请求的参数
                //   query.branchName=values.partyBrach;
                // }
                // if(values.isActive!==undefined&&values.isActive!==''){//是否活跃//post请求的参数
                //   query.isActive=values.isActive;
                // }
            
                console.log('111111111111111111', query);
                this.setState({
                    currentPage:1,
                    query,
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
        this.setState({ 
          currentPage: page,
          pageSize: pageSize,
        },()=>{
          this.requestData();
        });
      }
      pageSizeChange = (current, size) => {
        this.setState({
          currentPage: 1,
          pageSize: size,
        },()=>{
          this.requestData();
        });
      } 

      //党员信息导出excel
      exportExcel=()=>{
        this.setState({reportExcel: true});//点击后置灰
        let {query}=this.state;
        let path=`${API_PREFIX}services/web/report/business/partyBehavior/export?Q=type=partyMember&${query}`;
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
            title:'所属党组织',
            dataIndex:'partyName',
            key:'partyName',
            },
            // {
            //   title:'所属党支部',
            //   dataIndex:'branchName',
            //   key:'branchName',
            //   },
            {
            title:'是否活跃',
            dataIndex:'isActive',
            key:'isActive',
            render:(text,record)=>{
              if(record.isActive===0){
                return(
                  <span>否</span>
                  );
              }else if(record.isActive===1){
                return(
                  <span>是</span>
                  );
              }
            },
            },
            {
            title:'操作',
            dataIndex:'handel',
            key:'handel',
            render: (text, record) => {
              return (
                <span>
                  <a href='javascript:;' style={{color: '#007AFF'}} onClick={() => {
                      let path = `/OperativeReport/PartyActionData/Detail?userId=${record.id}`;
                      location.hash = path;
                  }}>详情</a>
                </span>
              );
              
            },
            },
        ];
        let powers = this.props.powers;
        let exportExcelPower = powers && powers['20009.21903.202'];//导出
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
        const dateLayout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };
        const { selectedRowKeys,departments } = this.state;
      
       console.log("222",departments)

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
            <div className='userActionData'>
                <div className='formTop'>
                <Form onSubmit={this.querySubmit}>
                <Row>
                      <Col span={8}>
                        <FormItem {...formItemLayout} label='姓名：'>
                          {getFieldDecorator('userName')(<Input placeholder="请输入" />) }    
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem {...formItemLayout} label='员工号：'>
                          {getFieldDecorator('userNum')(<Input placeholder="请输入" />)}
                        </FormItem>
                      </Col>
                    <Col span={8}>
                      <FormItem {...formItemLayout} label='手机号：'>
                        {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
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
                        <FormItem {...formItemLayout} label='所属党组织：'>
                          {getFieldDecorator('partyTotal')(
                            <Cascader options={departments} placeholder='请选择' changeOnSelect   />
                          ) }    
                        </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem {...formItemLayout} label='是否活跃：'>
                        {
                          getFieldDecorator('isActive',{
                            initialValue: '',
                        })(
                            <Select >
                                <Option key={''} value={''}>全部</Option>
                                <Option key={1} value={1}>是</Option>
                                <Option key={0} value={0}>否</Option>
                            </Select>
                          )
                        } 
                      </FormItem>
                    </Col>
                    {/* <Col span={8}>
                        <FormItem {...formItemLayout} label='所属党支部：'>
                          {getFieldDecorator('partyBrach')(
                            <Cascader options={departments} placeholder='请选择' changeOnSelect   />
                          ) }    
                        </FormItem>
                    </Col> */}
                    </Row>
                    <Row>
                  
                    <Col span={16}>
                        <div>
                        <FormItem {...dateLayout} label='选择时间：'>
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
                
                {
                exportExcelPower ? <Button className='excel' disabled={this.state.reportExcel} onClick={this.exportExcel}>导出Excel</Button> : null
                }
                {this.state.reportExcel?<span><Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>导出文件已加入队列，请在<b style={{color:'#007aff',cursor:'pointer'}} onClick={this.myExport}>我的导出</b>查看</span>:null}
                </div>
                <Table id='tableExcel' rowSelection={rowSelection} columns={columns} dataSource={this.state.data} bordered={true} pagination={pagination} />
                  
            </div>
            // </Spin>
        );
    }
}
export default UserActionData;