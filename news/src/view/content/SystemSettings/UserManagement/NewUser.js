import React, { Component } from 'react';
import { Form,  Input, Button, Checkbox,Select,Radio,InputNumber,message,Cascader,Row,Col} from 'antd';
import {postService,GetQueryString,getService } from '../../myFetch.js';
import { connect } from 'react-redux';
import TreeList from '../../../component/tree/TreeList';
import ServiceApi from '../../apiprefix';
import {RuleConfig} from  '../../ruleConfig';
import {departments } from './departments';
import {dp } from './dp';
import './NewUser.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

// @connect(state => ({
//   checkData: state.tree.treeSelectData.department,
// }))

@Form.create()
class NewUser extends Component{
  constructor(props){
    super(props);
    this.state= {
      // checkData:this.props.checkData,//数选择的数据
      displayWarn: false,  //人为控制  所属部门的的必填属性校验
      userId: '',//定义id，用来查询详情信息
      isEdit: false,  //定义该页面的属性  编辑？新建
      roles: '',// 该用户拥有的所有角色，通过查询接口获取
      userInfo: '',//编辑时，页面传过来的用户的基本信息，通过接口查询获取
      organizations: [],//部门中的数据，通过接口获取
      ownAdmindRole:false,//当前登录用户是否拥有最高管理员权限，用于控制 “分配角色”功能是否显示，是，则显示，否则，不显示
      validMobile:{},  //校验手机号的信息
      validEmail:{},//校验邮箱的信息
      validUserno:{},//校验员工号的信息
    }
  }

  componentWillMount(){
  }
  //表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
    });
  }
  //手机号的校验
  handleValidMobile= (rule, value, callback) => {
  }
  //邮箱的校验
  handleValidEmail= (rule, value, callback) => {
  }
  //员工号的校验
  handleValidUserno= (rule, value, callback) => {
  }
  render(){
    //设置formItem的格式
    const formItemLayout ={ 
      labelCol: {
        xs: { span: 14 },
        sm: { span: 8},
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 8 },
      },
     };
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12},
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    //获取数据
    const { getFieldDecorator } = this.props.form;
    //树型控件选中的数据
    // const treeCheckData= this.props.checkData;
    // console.log("选中的数据为---",treeCheckData);
    //角色数据   假数据   已废掉
    const roleids=[
      {
        value:'角色1',
        label:'角色1',
      },{
        value:'角色2',
        label:'角色2',
      },{
        value:'角色3',
        label:'角色3',
      },{
        value:'角色4',
        label:'角色4',
      },{
        value:'角色5',
        label:'角色5',
      },{
        value:'角色6',
        label:'角色6',
      },{
        value:'角色7',
        label:'角色7',
      },{
        value:'角色8',
        label:'角色8',
      },
    ];
    //模拟查询到的数据
    const datas={
      userno:'2017012879',
      lastname:'玉林雨',
      email:'277999@qq.com',
      mobile:'15987865678',
      age:25,
      edu:'',
      sex:'女',
      isGrayUser:'是',
      belongsDepart:['B级部门1'],
      assignRoles:['角色7','角色8'],



    };
    //临时变量，存放每个字段的默认值
    let usernoDf='';
    let lastnameDf='';
    let emailDf='';
    let mobileDf='';
    let ageDf=0;
    let  edu;
    let sexDf=true;
    let isGrayUserDf=0;
    let belongsDepartDf=[];
    let assignRolesDf=[];
    if(this.state.isEdit=='true'){//编辑，则默认值是查询到的值
      console.log('this.state.userInfo', this.state.userInfo);
      usernoDf=this.state.userInfo.userno;
      lastnameDf=this.state.userInfo.lastname;
      emailDf=this.state.userInfo.email;
      mobileDf=this.state.userInfo.mobile;
      ageDf=this.state.userInfo.age;
      edu=this.state.userInfo.edu;

      // console.log('*********eduDf',eduDf);
      sexDf=this.state.userInfo.sex=='男'?true:false;
      isGrayUserDf=this.state.userInfo.isGrayUser;
      belongsDepartDf=this.state.userInfo.orginfo?this.state.userInfo.orginfo.split(','):[];
      assignRolesDf=this.state.userInfo.roleIds?this.state.userInfo.roleIds.split(','):[];
      console.log("assignRolesDf",assignRolesDf);
    }


    return(
      <div className="new-user-main">
        <Form onSubmit={this.handleSubmit}>
         
              <FormItem
                {...formItemLayout}
                label="员工工号"
              validateStatus={this.state.validUserno.retCode=='0'?'error':'success'}
                // help={this.state.validUserno.retCode=='0'?this.state.validUserno.retMsg:''}
              >
                {
                  getFieldDecorator('userno',{
                    rules: [{
                      validator: this.handleValidUserno
                    }],initialValue:usernoDf
                  })(
                    <Input/>
                  )
                }
              </FormItem>
           
              <FormItem
                {...formItemLayout}
                label="姓名"
              >
                {
                  getFieldDecorator('lastname',
                      {initialValue:lastnameDf,...RuleConfig.lastnameConfig})(
                    <Input/>
                  )
                }
              </FormItem>
          
              <FormItem
                {...formItemLayout}
                label="邮箱"
                validateStatus={this.state.validEmail.retCode=='0'?'error':'success'}
                // help={this.state.validEmail.retCode=='0'?this.state.validEmail.retMsg:''}
              >
                {
                  getFieldDecorator('email', {
                    rules: [ {type:'email',message:'您输入的邮箱格式不正确，请输入正确的邮箱'},,
                        {required: true, message: '请输入您的邮箱'}, {
                      validator: this.handleValidEmail
                    }], initialValue: emailDf
                  })(
                    <Input/>
                  )
                }
              </FormItem>
            
              <FormItem
                {...formItemLayout}
                label="手机号"
               validateStatus={this.state.validMobile.retCode=='0'?'error':'success'}
                // help={this.state.validMobile.retCode=='0'?this.state.validMobile.retMsg:''}
              >
                {
                  getFieldDecorator('mobile',{
                      rules: [{required: true, message: '请输入您的手机号',max:11}, {
                  validator: this.handleValidMobile
                }], initialValue:mobileDf})(
                    <Input/>
                  )
                }

              </FormItem>
           
            <FormItem
              {...formItemLayout}
              label="学历"
            >
              {
                getFieldDecorator('edu',{initialValue:edu,...RuleConfig.eduCofig})(
                  <Select >
                    <Option value="1">博士</Option>
                    <Option value="2">研究生</Option>
                    <Option value="3"> 双学位</Option>
                    <Option value="4">本科</Option>
                    <Option value="5">专科</Option>
                    <Option value="6"> 中专</Option>
                    <Option value="7">技校</Option>
                    <Option value="8">高中</Option>
                    <Option value="9">初中</Option>
                  </Select>
                )
              }
            </FormItem>
           
            <FormItem
              {...formItemLayout}
              label="年龄"
            >
              {
                getFieldDecorator('age',{initialValue:ageDf,...RuleConfig.ageCofig})(
                  <InputNumber />
                )
              }

            </FormItem>
           
            <FormItem
              {...formItemLayout}
              label="性别"
            >
              {
                getFieldDecorator('sexType',{initialValue:sexDf})(
                  <RadioGroup>
                    <Radio value={true}>男</Radio>
                    <Radio value={false}>女</Radio>
                  </RadioGroup>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="是否为灰度用户"
            >
              {
                getFieldDecorator('isGrayUser',{initialValue:isGrayUserDf,...RuleConfig.isGrayUserConfig}
                )(
                  <RadioGroup  >
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </RadioGroup>
                )
              }

            </FormItem>
          <FormItem
            {...formItemLayout}
            label="所属部门"
          >
            {getFieldDecorator('orginfo', {initialValue: belongsDepartDf,...RuleConfig.belongsDepartmentCofig})
            (
                <Cascader  className='ant-cascader-picker-orginfo' options={this.state.organizations} changeOnSelect />
            )
            }　　
            {
              <a  onClick={() => location.hash = '/SystemSettings/DepartMent?back=1' }>部门管理</a>
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="分配角色"
            style={{display:this.state.ownAdmindRole?'block':'none'}}
          >
            {
              getFieldDecorator('roleids',{initialValue:assignRolesDf})(
                <CheckboxGroup options={this.state.roles} />
              )

            }
          </FormItem>
          <FormItem>
            <Row>
                <Col span={2}  offset={8}><Button className="resetBtn" onClick={()=>location.hash = '/SystemSettings/UserManagement'}>返回</Button></Col>
                <Col span={2} ><Button className="queryBtn" type="primary" onClick={this.handleSubmit}>保存</Button></Col> 
            </Row>
          </FormItem>
        </Form>


      </div>


    );
  }
}
export default NewUser;