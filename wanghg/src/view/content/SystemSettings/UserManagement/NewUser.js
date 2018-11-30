import React, { Component } from 'react';
import { Form,  Input, Button, Checkbox,Select,Radio,InputNumber,message,Cascader,Row,Col} from 'antd';
import {postService,GetQueryString,getService } from '../../myFetch.js';
import { connect } from 'react-redux';
import TreeList from '../../../component/tree/TreeList';
import API_PREFIX from '../../apiprefix';
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
//相关数据获取
    this.getData();
  }
  //获取该页面所需要的数据信息
  getData=()=>{
    //获取系统中的角色信息，并放到state中   注意：新建时，不能将新建立的用户角色等级分配为1
    getService(API_PREFIX + 'services/system/role/getList/1/1000', data => {
      let roleslastname=[];
      data.root.list&&data.root.list.map((item,index) => {
        if(item.level!=1){//过滤掉级别为1的角色
          roleslastname.push({
            label:item.name,
          value:item.id+'',
          });
        }else{
          console.log("item.level",item.level);
        }
      });
      console.log('-------roleslastname', roleslastname);
      this.setState({
        roles:roleslastname,
      },()=>{
        console.log("roles",this.state.roles);
      });
    });
    //通过接口获取部门的信息
    getService(API_PREFIX+'services/system/organization/organizationList/get',data=>{
      let orgs=data.root.list;
      if(orgs){
        //直接调用处理部门数据的方法===》处理数据
        this.getDepartmentData(orgs);
        this.setState({
          organizations:orgs,
        });
      }

    });
   //通过接口，获取当前登录用户的角色信息,并将角色信息赋值给admindRole，（根据admindRole来确定分配角色功能是否显示）
    //首先需要知道当前登录用户的id,通过接口获取
    let currentUserId=window.sessionStorage.getItem('id');
    let id=JSON.parse(currentUserId);
    console.log("当前登录用户的id:",id);
    getService(API_PREFIX+`services/system/systemAndCompanyUser/get/userRole/${id}`,data=>{
          console.log("获取当前用户角色信息的返回数据：",data.root.list[0]);
          if(data.root.list[0].level==1 ){//是最高管理员===》
           this.setState({ownAdmindRole:true});//将是否拥有最高管理员权限的标志值为true
          }
    });

    //从url中获取传递的参数
    let param = GetQueryString(location.hash,['userid','isEdit']);
    this.setState({

      userId:param.userid,
      isEdit:param.isEdit,
    },() => {
      console.log('param',this.state.userId);
      //根据传入的userid，获取对应的详情信息
      console.log('this.state.isEdit----------',this.state.isEdit);
      if(this.state.isEdit=='true'){
        console.log('进入编辑-------：');
        getService(API_PREFIX + `services/system/systemAndCompanyUser/list/1/10?Q=userid_S_EQ=${this.state.userId}`, data => {
          console.log('编辑时传入的数据：',data.root.list);
          if (data.retCode == 1){
            this.setState(
                {
                  userInfo:data.root.list[0],
                },()=>{
                  console.log("编辑时传入的数据：",this.state.userInfo);
                }
            );
          }

        });
      }
    });
  }

  //表单提交事件处理   注意，给后端传入数据时，需要将 表单中的数据 以及 树 中的数据一起传入
  handleSubmit = (e) => {
    e.preventDefault();
    //树中数据的校验    判断是否选择了树
    console.log("*****************")
    this.props.form.validateFields((err, fieldsValue) => {
      // console.log("选中的树中的数据是：",this.props.checkData)
      // if(this.props.checkData.length===0||!this.props.checkData){
      //   this.setState({displayWarn:true})
      //   return;
      // }
      console.log('err',err)
      if (err) {
        console.log('err',err)
        return;
      }
      //表单中的数据
      const values={...fieldsValue,
        'orginfo':fieldsValue.orginfo?fieldsValue.orginfo[fieldsValue.orginfo.length-1]:'',
        'roleids':fieldsValue.roleids.toString(),
        'oldEmail':this.state.isEdit=='true'&&this.state.userInfo?this.state.userInfo.email:'',//编辑时需要传入旧的email
      };
      console.log('表单中的值为：',values);
      //区分编辑和新增，调用不同的接口
      if(this.state.isEdit=='true'){//调用编辑的接口
        let realValues={
          ...values,
          userid:this.state.userId,
        };
        console.log('-----realValues',realValues);
        postService(API_PREFIX + 'services/system/systemAndCompanyUser/update/userInfo', realValues, data => {
          if (data.retCode == 1) {
            message.success('修改成功！');
            location.hash = '/SystemSettings/UserManagement';
          } else {
            message.error(data.retMsg);
          }
        });
      }else{
        postService(API_PREFIX + 'services/system/systemAndCompanyUser/add/userInfo', values, data => {
          if (data.retCode == 1) {
            message.success('新增成功！');
            location.hash = '/SystemSettings/UserManagement';
          } else {
            message.error(data.retMsg);
          }
        });
      }

    });
  }
  //递归取出接口返回的部门的数据
  getDepartmentData(dpData){
    dpData.map((item,index)=>{
      item.value=item.id+'';
      item.label=item.name;
      item.children=item.subOrganizationList;
      if(item.subOrganizationList){//不为空，递归
        this.getDepartmentData(item.subOrganizationList);
      }
    });
  }
  //手机号的校验  先校验格式是否符合要求，再到数据库校验是否唯一
  handleValidMobile= (rule, value, callback) => {
    console.log('输入的手机号：',value);
    var patrn = /^[0-9]*$/;
    console.log(value.length);
    if (!patrn.test(value)||value.length!=11&&value.length != 0) {
      callback('手机号只能为数字且只能为11位');
    }else if(value.length == 0){
      callback();
    }else{   //通过校验
      // 发起请求，判断该手机号是否存在
      if(value == ''||value==undefined){
        this.setState({
          validMobile:{
            retCode:0,
          }
        });
        callback()
      }else{
        let query=`Q=mobile_S_EQ=${value}`;


        if(this.state.isEdit=='true'){//编辑==》额外传入
          query=query+'&'+`Q=id_S_NE=${this.state.userId}`
        }
        getService(API_PREFIX + `services/system/verify/checkUnique/SystemSettings-NewUser?${query}`, data => {
          if(data.retCode==0){//手机号存在
            console.log("data.retMsg",data.retMsg);
            this.setState({
              validMobile:{
                retCode:data.retCode,
                retMsg:data.retMsg,
              }
            });
            callback([new Error('该手机号码在系统中已经存在，请重新输入')])
            // message.error(data.retMsg)
          }else{
            let q=`Q=acount_S_EQ=${value}`;
            if(this.state.isEdit=='true'){//编辑==》额外传入
              q=q+'&'+`Q=id_S_NE=${this.state.userId}`
            }
            getService(API_PREFIX + `services/system/verify/checkUnique/SystemSettings-NewUser?${q}`, data => {
              if(data.retCode==0) {//手机号存在
                console.log("data.retMsg", data.retMsg);
                this.setState({
                  validMobile: {
                    retCode: data.retCode,
                    retMsg: data.retMsg,
                  }
                });
                callback([new Error('该手机号码在系统中已经存在，请重新输入')])
              }else{
                this.setState({
                  validMobile:{
                    retCode:data.retCode,
                    retMsg:data.retMsg,
                  }
                });
                callback()
              }
            });

          }
        })
      }
    }


}
//邮箱的校验
  handleValidEmail= (rule, value, callback) => {
    console.log('邮箱：',value);
    if(value == ''||value==undefined){
      this.setState({
        validEmail:{
          retCode:0,
        }
      });
      callback()
    }else{
    let query=`Q=email_S_EQ=${value}`;
    if(this.state.isEdit=='true'){//编辑==》额外传入
      query=query+'&'+`Q=id_S_NE=${this.state.userId}`
    }
      getService(API_PREFIX + `services/system/verify/checkUnique/SystemSettings-EmailVerify?${query}`, data => {
        if(data.retCode==0){
          console.log("data.retMsg",data.retMsg);
          this.setState({
            validEmail:{
              retCode:data.retCode,
              retMsg:'该邮箱在系统中已经存在，请重新输入',
            }
          });
          callback([new Error('该邮箱在系统中已经存在，请重新输入')])

          // message.error(data.retMsg)
          }else{
            this.setState({
              validEmail:{
                retCode:data.retCode,
                retMsg:data.retMsg,
              }
            });
          callback()
        }
      })
    }

  }
  //员工号的校验
  handleValidUserno= (rule, value, callback) => {
    console.log('员工工号：',value);
    if(value == ''||value==undefined){
      callback()
    }else{
      let id='';
      if(this.state.isEdit=='true'){//编辑，则传入对应的id，否则传入“add”字符串
         id=this.state.userId;
      }else{
        id='add'
      }
      getService(API_PREFIX + `services/system/systemAndCompanyUser/verifyUserNoIsUnique/${value}/${id}`, data => {
        if(data.retCode==0){
          console.log("data.retMsg",data.retMsg);

            this.setState({
              validUserno:{
                retCode:data.retCode,
                retMsg:data.retMsg,
              }
            });
          callback([new Error(data.retMsg)])
            // message.error(data.retMsg)
          }else{
            this.setState({
              validUserno:{
                retCode:data.retCode,
                retMsg:data.retMsg,
              }
            });
          callback()
        }
      })
    }

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