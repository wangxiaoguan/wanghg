import React, { Component } from 'react';
import TableAndSearch from '../../component/table/TableAndSearch';
import {Button,Modal,Form,Input,Radio,Message,Divider,Spin, Icon,message,Select} from 'antd';  
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import {  BEGIN,getDataSource,getPageData } from '../../../redux-root/action/table/table';
import {connect} from 'react-redux';
import {postService,getService} from '../myFetch';
import API_PREFIX, {DEFAULT_LOGIN_URL} from '../apiprefix';
import './company.less';

const { Option } = Select;

@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    powers: state.powers,
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
      isAdd:false,
      validMobile:{retCode:0},
      userId:'',
      subM:false,
      parentId:'',
    };
  }
  showModal = () => {
    this.setState({
      visible: true,
      flag:false,
      key:this.state.key + 1,
      isAdd:true,
      isEdit:false,
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
      key:this.state.key + 1,
    });
  }
  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
  editHotWordName =(record) => {    ////编辑的
    if(record.user){
     this.setState({
      userId:record.user.userId,
     });
    }
    console.log(record);
    this.setState({
      visible: true,  /////是否弹出
      record:record,
      flag:true,      ////是否显示
      key:this.state.key + 1,
      isEdit:false,
      isAdd:false,  
    });
  }
  lookHotWordName = (record) => {    ////详情的
  	this.setState({
      visible: true,
      record:record,
      flag:true,
      key:this.state.key + 1,
      isEdit:true,
    });
  }
  getData = async(url) => {
    await this.props.getData(API_PREFIX + `${url}`);
  }
  getVisible = (visible) => {
    this.setState({
      visible:visible,
    });
  }
  disabled = (record) => {
    let status;
    if(record.status == 1){
        status = 2;
    }else{
        status = 1;
    }
    postService(API_PREFIX + `services/web/company/enterprise/changeStateCompany`,{"id":record.id,"status":status},data => {
      if (data.status=== 1&&JSON.stringify(data.root)!=='{}'){
        Message.success("设置成功!");
        this.getData(`services/web/company/enterprise/companyList/get/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      }else{     
          message.error(data.errorMsg);
      }
    });
  }
  redirect = (record) => {
    console.log("record",record);
    if(record&&record.companyManagerNo){
      window.localStorage.acount = record.companyManagerNo;
      window.localStorage.company = "company";
      window.open(DEFAULT_LOGIN_URL);
    }else{
      message.error('管理员账号不存在');
    }
  }
  render() {
    console.log("this.props.pageData",this.props.pageData);
    let powers=this.props.powers;
    let hasAddPower=powers&&powers['20004.21502.001'];//新建
    let hasDelPower=powers&&powers['20004.21502.004'];//删除
    let hasEditPower=powers&&powers['20004.21502.002'];//编辑
    let hasDisableEnablation=powers&&powers['20004.21502.006'];//禁用启用
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
        title:'上级企业名称',
        dataIndex:'parentName',
        key:'parentName',
      },
      {
        title:'平台企业管理员姓名',
        dataIndex:'companyManagerName',
        key:'companyManagerName',
      },
      {
        title:'平台企业管理员账号',
        dataIndex:'companyManagerNo',
        key:'companyManagerNo',
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
            	hasDisableEnablation?(record.status == 1 ? 
            	<a className='operation' onClick={this.disabled.bind(this,record)}>启用</a>
            	:<a className='operation' onClick={this.disabled.bind(this,record)}>禁用</a>):null
            }
            {
              hasEditPower?(
                <span>
                    <Divider type="vertical" />
                    <a className='operation' onClick={
                    this.editHotWordName.bind(this,record)}>编辑</a>
                </span>
              ):null
            }
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
      },

    ];
    const search=[
      {key:'companyName',label:'企业名称',qFilter:'Q=companyName',type:'input'},
    ];
    return (
        <div>
          <TableAndSearch columns={columns} search={search}
           addBtn={hasAddPower?{order:1,OnEvent:this.showModal}:null}  deleteBtn={hasDelPower?{order:2}:null} url={'services/web/company/enterprise/companyList/get'}
           delUrl={'services/web/company/enterprise/deleteCompanys'}
           />
          <Modal
            title={this.state.isEdit ? "企业详情信息" :this.state.isAdd===true? "新建企业信息":this.state.isEdit===false?'编辑企业信息':'' }
            maskClosable={false}//点击蒙层是否关闭
            footer={null}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            key={this.state.key}
            className="company modal"
          >
            <WrappedNormalLoginForm userId={this.state.userId} isEdit={this.state.isEdit} getData={this.getData} handleCancel={this.handleCancel} record={this.state.record} flag={this.state.flag} url={'services/web/company/enterprise/companyList/get'} visible={this.state.visible} getVisible={this.getVisible}
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
      edition:[],
      isEdit:false,
      parentNameData:[],//上级企业名称
      levelData: [],
    };
  }

  componentWillMount(){
    //企业版本接口
  	getService(API_PREFIX + `services/web/system/edition/editionList/get/1/1000`,data => {
      if (data.status == 1) {
        console.log(data);
        this.setState({
          edition:data.root.list,
        });
      }else{     
          message.error(data.errorMsg);
      }
    });
     //上级企业名称接口
     getService(API_PREFIX+`services/web/company/enterprise/companyList/get/1/1000`,data=>{
      if (data.status === 1) {
        let parentNameList=[];
        parentNameList=data.root.list;
        this.parentNameType(parentNameList);
        this.setState({parentNameData:parentNameList});
      }else{
        message.error(data.errorMsg);
      }
     });
     
    getService(API_PREFIX + 'services/web/party/partyOrganization/getPartyOrgLevels', res => {
      if(res.status == 1) {
          this.setState({levelData: res.root.object})
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      subM:false,
    });
    console.log("this.props.pageData",this.state.pageData);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Message.loading('加载中...,切勿重复提交！以免影响体验!');
      	values.user = {};
      	values.user.lastname = values.lastname;
      	values.user.acount = values.acount;
        values.user.userId = this.props.userId;
      	delete values.lastname;
        delete values.acount;
        delete values.user;
        console.log('Received values of form: ', values);
        if(this.props.flag){//编辑
          values.id = this.props.record.id;
          values.parentId=this.state.parentId?this.state.parentId:this.props.record.parentId;
          // if(this.state.parentNameData){
          //   this.state.parentNameData.map(item=>{
          //     if(values.parentId==item.parentName){
          //       values.parentId=item.id;
          //     }
          //   });
          // }
          console.log('修改后得值: ', values);
          if(values.parentId==='无'||values.parentId===undefined||values.parentId==='undefined'){
            values.parentId='-1';
          }
          postService(API_PREFIX + `services/web/company/enterprise/updateCompany`,values, data => {
            if (data.status == 1) {
              Message.success("修改成功!");
              console.log("31132");
              this.props.getData(`${this.props.url}/${this.state.pageData.currentPage}/${this.state.pageData.pageSize}?${this.state.pageData.query}`);
              this.setState({
                visible:false,
                subM:false,
              },() => {
                this.props.getVisible(this.state.visible);
              });
            } else {     
              Message.warning("修改失败!");
            }
          });
          
        }else{//新建
          if(values.parentId==='无'||values.parentId===undefined||values.parentId==='undefined'){
            values.parentId='-1';
          }
          postService(API_PREFIX + `services/web/company/enterprise/addCompany`,values, data => {
            if (data.status == 1) {
              Message.success("新增成功!");
              console.log("31132");
              this.props.getData(`${this.props.url}/${this.state.pageData.currentPage}/${this.state.pageData.pageSize}?${this.state.pageData.query}`);
              this.setState({
                visible:false,
                subM:false,
              },() => {
                this.props.getVisible(this.state.visible);
              });
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
    postService(API_PREFIX + `services/system/hotWord/check/name`,{"hotWordName":e.target.value}, data => {
      if(data.retType==0){
        this.setState({
          validUserno:{
            retCode:data.retType,
            retMsg:data.retMsg,
          },
        });
      }else{
        this.setState({
          validUserno:{
            retCode:data.retType,
            retMsg:data.retMsg,
          },
        });
      }
    });
  }
  onfocus = () => {
     this.setState({
          validUserno:{
            retCode:0,
            retMsg:'',
          },
      });
  }
  checkPhone = (rule, value, callback) => {
      let patrn = /^[0-9]*$/;  
      console.log(value.length);
      if (!patrn.test(value)||value.length!=11&&value.length != 0) {
          callback('企业管理员账号只能为数字且只能为11位');
      }else if(value.length == 0){
          callback();
      }else{
        getService(API_PREFIX +`services/web/company/userInfo/checkUserDuplicate?Q=mobile=${value}${this.props.flag?`&Q=id=${this.props.record.companyManagerId}`:''}`,data=>{
          if(data.status===1){
              if(data.root.object===false){//存在重复
                callback([new Error('该手机号码在系统中已经存在，请重新输入')]);
              }else if(data.root.object===true){//未重复
                 callback();
              }
          }
        });
          // callback();
      }
  }
  handleValidMobile= (rule, value, callback) => {
    if(value == ''||value==undefined){
      this.setState({
        validMobile:{
          retCode:0,
        },
      });
      callback();
    }else if(/^\s/.test(value)) {
      this.setState({
        validMobile:{
          retCode:'0',
          retMsg:'请勿输入空格',
        },
      });
      callback([new Error('请勿输入空格')]);
    }else{
      let query=`Q=companyName=${value}`;
      if(this.props.flag){//编辑==》额外传入
        query=query+'&'+`Q=id=${this.props.record.id}`;
      }
      getService(API_PREFIX + `services/web/company/enterprise/checkCompanyDuplicate?${query}`, data => {
        if(data.status===1){
          if(data.root.object==false){//有重复
              this.setState({
                validMobile:{
                  retCode:'0',
                  retMsg:'该企业名称已存在',
                },
              });
            callback([new Error('该企业名称已存在')]);
              // message.error(data.retMsg)
            }else{
              this.setState({
                validMobile:{
                  retCode:'1',
                },
              });
            callback();
          }
        }else{
          message.error(data.errorMsg);
        }
      });
    }
  }
  handleValidMobileCopy= (rule, value, callback) => {
    if(value == ''||value==undefined){
      this.setState({
        validMobile:{
          retCode:0,
        },
      });
      callback();
    }else if(/^\s/.test(value)) {
      this.setState({
        validMobile:{
          retCode:'0',
          retMsg:'请勿输入空格',
        },
      });
      callback([new Error('请勿输入空格')]);
    }else{
      let query=`Q=shortCompanyName=${value}`;
      if(this.props.flag){//编辑==》额外传入
        query=query+'&'+`Q=id=${this.props.record.id}`;
      }
      getService(API_PREFIX + `services/web/company/enterprise/checkCompanyDuplicate?${query}`, data => {
        if(data.status===1){
          if(data.root.object===false){//有重复
            this.setState({
              validMobile:{
                retCode:'0',
                retMsg:'该企业简称名称已存在',
              },
            });
          callback([new Error('该企业简称名称已存在')]);
            // message.error(data.retMsg)
          }else if(data.root.object==true){//未重复
            this.setState({
              validMobile:{
                retCode:'1',
              },
            });
          callback();
        }
        }else{
          message.error(data.errorMsg);
        }
      });
    }
  }

 //处理上级企业的数据
 parentNameType(data){
  let parentNameTypeAll={code:'',companyName:'无'};//前端新增一个全部字段
  data.unshift(parentNameTypeAll);
 }

  //上级企业名称change
  parentNameChange=(value)=>{
    this.setState({parentId:value});
  }

  render() {
    console.log("record",this.props.record);
    console.log("props",this.props);
    const { getFieldDecorator } = this.props.form;
    if(this.props.flag){
      if(this.props.record){
       var lastname = this.props.record.companyManagerName;
       var  acount = this.props.record.companyManagerNo;
      }
      var companyName = this.props.record.companyName;
      var shortCompanyName = this.props.record.shortCompanyName;
      var isShort = this.props.record.isShort;  
      var editionId = this.props.record.editionId;
      var party = this.props.record.partyName;
      var parentName=this.props.record.parentName;
      var partyLevel = this.props.record.partyLevel
    }else{
      var companyName = '';
      var shortCompanyName = '';
      var isShort = true;
      var lastname = '';
      var acount = '';
      var editionId = '';
      var party = '';
      var parentName='';
      var partyLevel='1'
    }
    //上级企业名称
    let parentNameOption=[];
    if(this.state.parentNameData){
      this.state.parentNameData.forEach(item=>{
        parentNameOption.push(<Option key={item.companyName} value={item.id+''}>{item.companyName}</Option>);
      });
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
              validator: this.handleValidMobile,
            }],
            initialValue:companyName,
          })(
            <Input placeholder="请输入企业名称"  disabled={this.props.isEdit ? true:false}/>
          )}
        </FormItem>
         <FormItem 
        label="企业简称" 
        {...formItemLayout}>
          {getFieldDecorator('shortCompanyName', {
            rules: [{ required: true, message: '请输入企业简称,且最长为20个字符！',max:20 }, {
              validator: this.handleValidMobileCopy,
            }],
            initialValue:shortCompanyName,
          })(
            <Input placeholder="请输入企业简称" disabled={this.props.isEdit ? true:false}/>
          )}
        </FormItem>
        <FormItem label="是否启用简称" {...formItemLayout}>
          {getFieldDecorator('isShort', {
            rules: [{ required: true, message: '请选择是否启用简称' }],
            initialValue:isShort,
          })(
            <RadioGroup onChange={this.onChange} disabled={this.props.isEdit ? true:false}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem 
        label="上级企业名称" 
        {...formItemLayout}>
          {getFieldDecorator('parentId', {
            initialValue:parentName?parentName:'无',
          })(
            <Select placeholder="请输入企业管理员姓名" onChange={this.parentNameChange}  disabled={this.props.isEdit ? true:false}>
              {parentNameOption}
            </Select>  
          )}
        </FormItem>
         <FormItem 
        label="平台企业管理员姓名" 
        {...formItemLayout}>
          {getFieldDecorator('companyManagerName', {
            rules: [{ required: true, message: '请输入企业管理员姓名,且最长为20个字符！',max:20 }],
            initialValue:lastname,
          })(
            <Input placeholder="请输入企业管理员姓名" disabled={this.props.isEdit ? true:false}/>
          )}
        </FormItem>
         <FormItem 
        label="平台企业管理员账号" 
        {...formItemLayout}>
          {getFieldDecorator('companyManagerNo', {
            rules: [{ required: true, message: '请输入企业管理员账号只能为数字且只能为11位！'},{validator:this.checkPhone}],
            initialValue:acount,
          })(
            <Input placeholder="请输入企业管理员账号" maxLength="11" disabled={this.props.isEdit ? true:false} />
          )}
        </FormItem>
         <FormItem 
        label="所属党组织" 
        {...formItemLayout}>
          {getFieldDecorator('partyName', {
            rules: [{ required: true, message: '请输入党组织名称！'}],
            initialValue:party,
          })(
            <Input placeholder="请输入所属党组织" disabled={this.props.isEdit ? true:false} />
          )}
        </FormItem>
         <FormItem 
        label="党组织级别" 
        {...formItemLayout}>
          {getFieldDecorator('partyLevel', {
            rules: [{ required: true, message: '请选择党组织级别！'}],
            initialValue: String(partyLevel),
          })(
            <Select disabled={this.props.isEdit ? true:false}>
                {this.state.levelData.map(item => {
                    return (<Option key={item.code} value={item.code}>{item.desp}</Option>)
                })}
            </Select>
          )}
        </FormItem>
        <FormItem
        label="选择版本" 
        {...formItemLayout}>
          {getFieldDecorator('editionId', {
            rules: [{ required: true, message: '请选择所需要的版本'}],
            initialValue:editionId,
          })(
            
            <RadioGroup>
            	{this.state.edition.map((item,index) => {
									return <Radio key={index} value={item.id} disabled={this.props.isEdit ? true:false}>{item.name}</Radio>;
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
