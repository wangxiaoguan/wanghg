import React, { Component } from 'react';
import TableAndSearch from '../../component/table/TableAndSearch';
import {Button,Modal,Form,Input,Radio,Message,Divider,Spin, Icon} from 'antd';  
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import {  BEGIN,getDataSource,getPageData } from '../../../redux-root/action/table/table';
import {connect} from 'react-redux';
//import './popularWord.less';
import {postService,getService} from '../myFetch';
import ServiceApi, {DefaultLoginUrl} from '../apiprefix';
import './company.less';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
class Company extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      value: true,
      record:{},
      flag:true,
      key:100,
      edition:[],
      isEdit:false,
      validMobile:{retCode:0},
      userId:'',
      subM:false,
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
      flag:false,
      key:this.state.key + 1,
      isEdit:false
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
      key:this.state.key + 1
    });
  }
  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
  editHotWordName =(record) => {
    console.log(record)
    this.setState({
      visible: true,
      record:record,
      flag:true,
      key:this.state.key + 1,
      isEdit:false,
      userId:record.user.userId
    });
  }
  lookHotWordName = (record) => {
  	this.setState({
      visible: true,
      record:record,
      flag:true,
      key:this.state.key + 1,
      isEdit:true
    });
  }
  getData = async(url) => {
    await this.props.getData(ServiceApi + `${url}`);
  }
  getVisible = (visible) => {
    this.setState({
      visible:visible
    })
  }
  disabled = (record) => {
    let status;
    if(record.status == 1){
        status = 2
    }else{
        status = 1
    }
    postService(ServiceApi + `services/system/company/update`,{"id":record.id,"status":status},data => {
      if (data.retCode == 1) {
        Message.success("设置成功!")
        this.getData(`services/system/company/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      }else{     
          
      }
    });
  }
  redirect = (record) => {
    console.log("record",record)
     window.localStorage.acount = record.user.acount;
     window.localStorage.company = "company";
     window.open(DefaultLoginUrl)
  }
  render() {
    console.log("this.props.pageData",this.props.pageData)
    const columns=[
      {
        title:'企业名称',
        dataIndex:'companyName',
        key:'companyName',
      },
      {
        title:'企业简称',
        dataIndex:'shortCompanyName',
        key:'shortCompanyName',
      },
      {
        title:'企业管理员姓名',
        dataIndex:'user.lastname',
        key:'user.lastname',
      },
      {
        title:'企业管理员账号',
        dataIndex:'user.acount',
        key:'user.acount',
      },
      {
        title:'创建时间',
          width:100,
        dataIndex:'createDate',
        key:'createDate',
      },
      {
        title:'更新时间',
          width:100,
        dataIndex:'lastUpdateDate',
        key:'lastUpdateDate',
      },
      {
        title:'是否启用',
        dataIndex:'isEnabled',
        key:'isEnabled',
        render: (text, record) => {
          if(record.status == 1){
            return <span>否</span>;
          }else if(record.status == 2) {
            return <span>是</span>;
          }

        },
      },
      {
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        width:280,
        render:(data,record)=>(
            <div>
            {
            	record.status == 2 ? 
            	<a className='operation' onClick={this.disabled.bind(this,record)}>禁用</a>
            	:<a className='operation' onClick={this.disabled.bind(this,record)}>启用</a>
            }
            <Divider type="vertical" />
            <a className='operation' onClick={this.editHotWordName.bind(this,record)}>编辑</a>
            <Divider type="vertical" />
            <a className='operation' onClick={this.lookHotWordName.bind(this,record)}>查看详情</a>
            {
              record.status == 2 ?
              <span>
                <Divider type="vertical" />
                <a className='operation' onClick={this.redirect.bind(this,record)}>切换角色登录</a>
              </span>
              : null
            }
            </div>
        ),
      }

    ];
    const search=[
      {key:'companyName',label:'企业名称',qFilter:'Q=companyName_S_LK',type:'input'}
    ];
    return (
        <div>
          <TableAndSearch columns={columns} search={search}
           addBtn={{order:1,OnEvent:this.showModal}}  deleteBtn={{order:2}} url={'services/system/company/list'}
           delUrl={'services/system/company/delete'}
          >

          </TableAndSearch>
          <Modal
            title={this.state.flag ? "编辑企业信息" : "新建企业信息"}
            maskClosable={false}//点击蒙层是否关闭
            footer={null}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            key={this.state.key}
            className="company modal"
          >
            <WrappedNormalLoginForm userId={this.state.userId} isEdit={this.state.isEdit} getData={this.getData} handleCancel={this.handleCancel} record={this.state.record} flag={this.state.flag} url={'services/system/company/list'} visible={this.state.visible} getVisible={this.getVisible}
            pageData={this.props.pageData}/>
          </Modal>
        </div>
    );
  }
}


class NormalLoginForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      visible: this.props.visible,
      pageData:this.props.pageData,
      validUserno:{},
      edition:[]
    }
  }

  componentWillMount(){
  	getService(ServiceApi + `services/system/edition/list/noPage`,data => {
      if (data.retCode == 1) {
        console.log(data)
        this.setState({
          edition:data.root.list
        })
      }else{     
          
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      subM:true
    })
    console.log("this.props.pageData",this.state.pageData)
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Message.loading('加载中...,切勿重复提交！以免影响体验!')
      	values.user = {}
      	values.user.lastname = values.lastname
      	values.user.acount = values.acount
        values.user.userId = this.props.userId
      	delete values.lastname;
      	delete values.acount;
        console.log('Received values of form: ', values);
        if(this.props.flag){
          values.id = this.props.record.id;
          postService(ServiceApi + `services/system/company/update`,values, data => {
            if (data.retCode == 1) {
              Message.success("修改成功!");
              console.log("31132")
              this.props.getData(`${this.props.url}/${this.state.pageData.currentPage}/${this.state.pageData.pageSize}?${this.state.pageData.query}`);
              this.setState({
                visible:false,
                subM:false,
              },() => {
                this.props.getVisible(this.state.visible)
              })
            } else {     
              Message.warning("修改失败!");
            }
          });
          
        }else{
          postService(ServiceApi + `services/system/company/add`,values, data => {
            if (data.retCode == 1) {
              Message.success("新增成功!");
              console.log("31132")
              this.props.getData(`${this.props.url}/${this.state.pageData.currentPage}/${this.state.pageData.pageSize}?${this.state.pageData.query}`);
              this.setState({
                visible:false,
                subM:false,
              },() => {
                this.props.getVisible(this.state.visible)
              })
            } else {     
              Message.warning("修改失败!");
            }
          });
        }
      }
    });
  }
  //唯一性校验
  onblur = (e) => {
    postService(ServiceApi + `services/system/hotWord/check/name`,{"hotWordName":e.target.value}, data => {
      if(data.retType==0){
        this.setState({
          validUserno:{
            retCode:data.retType,
            retMsg:data.retMsg,
          }
        });
      }else{
        this.setState({
          validUserno:{
            retCode:data.retType,
            retMsg:data.retMsg,
          }
        });
      }
    })
  }
  onfocus = () => {
     this.setState({
          validUserno:{
            retCode:0,
            retMsg:'',
          }
      });
  }
  checkPhone = (rule, value, callback) => {
      var patrn = /^[0-9]*$/;  
      console.log(value.length)
      if (!patrn.test(value)||value.length!=11&&value.length != 0) {
          callback('企业管理员账号只能为数字且只能为11位');
      }else if(value.length == 0){
          callback();
      }else{
          callback();
      }
  }
  handleValidMobile= (rule, value, callback) => {
    if(value == ''||value==undefined){
      this.setState({
        validMobile:{
          retCode:0,
        }
      });
      callback()
    }else{
      let query=`Q=companyName_S_EQ=${value}&Q=status_I_NE=3`;
      if(this.props.flag){//编辑==》额外传入
        query=query+'&'+`Q=id_S_NE=${this.props.record.id}`
      }
      getService(ServiceApi + `services/system/verify/checkUnique/PlatformAdministrator-company?${query}`, data => {
        if(data.retCode==0){
          console.log("data.retMsg",data.retMsg);
            this.setState({
              validMobile:{
                retCode:data.retCode,
                retMsg:data.retMsg,
              }
            });
          callback([new Error('该企业名称已存在')])
            // message.error(data.retMsg)
          }else{
            this.setState({
              validMobile:{
                retCode:data.retCode,
                retMsg:data.retMsg,
              }
            });
          callback()
        }
      })
    }
  }
  handleValidMobileCopy= (rule, value, callback) => {
    if(value == ''||value==undefined){
      this.setState({
        validMobile:{
          retCode:0,
        }
      });
      callback()
    }else{
      let query=`Q=shortCompanyName_S_EQ=${value}&Q=status_I_NE=3`;
      if(this.props.flag){//编辑==》额外传入
        query=query+'&'+`Q=id_S_NE=${this.props.record.id}`
      }
      getService(ServiceApi + `services/system/verify/checkUnique/PlatformAdministrator-company?${query}`, data => {
        if(data.retCode==0){
          console.log("data.retMsg",data.retMsg);
            this.setState({
              validMobile:{
                retCode:data.retCode,
                retMsg:data.retMsg,
              }
            });
          callback([new Error('该企业简称名称已存在')])
            // message.error(data.retMsg)
          }else{
            this.setState({
              validMobile:{
                retCode:data.retCode,
                retMsg:data.retMsg,
              }
            });
          callback()
        }
      })
    }
  }
  render() {
    console.log("record",this.props.record)
    const { getFieldDecorator } = this.props.form;
    if(this.props.flag){
      var companyName = this.props.record.companyName
      var shortCompanyName = this.props.record.shortCompanyName
      var isShort = this.props.record.isShort
      var lastname = this.props.record.user.lastname
      var acount = this.props.record.user.acount
      var editionId = this.props.record.editionId
    }else{
      var companyName = ''
      var shortCompanyName = ''
      var isShort = true
      var lastname = ''
      var acount = ''
      var editionId = ''
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem 
        label="企业名称" 
        //validateStatus={this.state.validMobile.retCode=='0'?'error':'success'}
        {...formItemLayout}>
          {getFieldDecorator('companyName', {
            rules: [{ required: true, message: '请输入企业名称,且最长为20个字符！',max:20 }, {
              validator: this.handleValidMobile
            }],
            initialValue:companyName
          })(
            <Input placeholder="请输入企业名称" />
          )}
        </FormItem>
         <FormItem 
        label="企业简称" 
        {...formItemLayout}>
          {getFieldDecorator('shortCompanyName', {
            rules: [{ required: true, message: '请输入企业简称,且最长为20个字符！',max:20 }, {
              validator: this.handleValidMobileCopy
            }],
            initialValue:shortCompanyName
          })(
            <Input placeholder="请输入企业简称" />
          )}
        </FormItem>
        <FormItem label="是否启用简称" {...formItemLayout}>
          {getFieldDecorator('isShort', {
            rules: [{ required: true, message: '请选择是否启用简称' }],
            initialValue:isShort
          })(
            <RadioGroup onChange={this.onChange}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </RadioGroup>
          )}
        </FormItem>
         <FormItem 
        label="企业管理员姓名" 
        {...formItemLayout}>
          {getFieldDecorator('lastname', {
            rules: [{ required: true, message: '请输入企业管理员姓名,且最长为20个字符！',max:20 }],
            initialValue:lastname
          })(
            <Input placeholder="请输入企业管理员姓名" />
          )}
        </FormItem>
         <FormItem 
        label="企业管理员账号" 
        {...formItemLayout}>
          {getFieldDecorator('acount', {
            rules: [{ required: true, message: '请输入企业管理员账号只能为数字且只能为11位！'},{validator:this.checkPhone}],
            initialValue:acount
          })(
            <Input placeholder="请输入企业管理员账号" maxLength="11" />
          )}
        </FormItem>
        <FormItem 
        label="选择版本" 
        {...formItemLayout}>
          {getFieldDecorator('editionId', {
            rules: [{ required: true, message: '请选择所需要的版本'}],
            initialValue:editionId
          })(
            
            <RadioGroup>
            	{this.state.edition.map((item,index) => {
									return <Radio key={index} value={item.id}>{item.name}</Radio>
            	})}
            </RadioGroup>
            
          )}
        </FormItem>
        <FormItem>
          <Button style={{marginLeft:"195px"}} type="primary" className='resetBtn' onClick={this.props.handleCancel}>
            返回
          </Button>
          {this.props.isEdit != true ? <Button type="primary" disabled={this.state.subM} htmlType="submit" className='queryBtn'>
            保存
          </Button>:null}
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default Company;
