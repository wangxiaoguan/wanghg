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
import { call } from 'redux-saga/effects';
import CityOption from '../../../component/city'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

@connect(
  state => ({
    powers: state.powers,
  }),
)
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
      ownAdmindRole:true,//当前登录用户是否拥有最高管理员权限，用于控制 “分配角色”功能是否显示，是，则显示，否则，不显示
      validMobile:{},  //校验手机号的信息
      validEmail:{},//校验邮箱的信息
      validUserno:{},//校验员工号的信息
      validShowIndex:{},//显示顺序的校验
      SelectData:[],//学历下拉框数据
      cascaderOptions:[],//部门级联选择器数据
      employeeTypeData:[],//人员类型数据
      orgIds: window.sessionStorage.getItem('authorityOrgIds')?window.sessionStorage.getItem('authorityOrgIds'):false,
    };
    this.departList=[]
  }
  // 把可以操作的部门的父节点全部找出来
  getDpData(data) {
    let orgIds = window.sessionStorage.getItem('authorityOrgIds')?window.sessionStorage.getItem('authorityOrgIds'):false
    data.map((item, index) => {
      if(orgIds&&orgIds.indexOf(item.id)>-1){
        this.departList.push(item.treePath.split(','))
      }
      if (item.subCompanyOrgList) {
        this.getDpData(item.subCompanyOrgList);
      }
    });
    let List = this.departList.join(',').split(',');
    return [...new Set(List)]
  }
  //递归取出接口返回的部门的数据
  getDepartmentData(dpData,selectIds){
    let orgIds = this.state.orgIds
    dpData.map((item,index)=>{
      item.value=item.id+'';
      item.label=item.name;
      item.children=item.subCompanyOrgList;
      item.disabled = !orgIds ? false : selectIds.toString().indexOf(item.id) > -1 ? false : true;
      if(item.subCompanyOrgList){//不为空，递归
        this.getDepartmentData(item.subCompanyOrgList,selectIds);
      }
    });
  }
  componentWillMount(){
    getService(API_PREFIX+'services/web/company/userInfo/getEduDictData',data=>{//学历接口
      if (data.status === 1){
        console.log(data);
          this.setState({
              SelectData:data.root.object,
          });
      }
  });

  //人员类型接口
  getService(API_PREFIX+'services/web/company/userInfo/getUserTypeDictData',data=>{
    if(data.status === 1){
      this.setState({
        employeeTypeData:data.root.object,
    });
    }
  });


//相关数据获取
    this.getData();
  }
  //获取该页面所需要的数据信息
  getData=()=>{
    //获取系统中的角色信息，并放到state中   注意：新建时，不能将新建立的用户角色等级分配为1
    let userId='';
    if(GetQueryString(location.hash,['isEdit']).isEdit=='false'){
      userId='0';
    }else if(GetQueryString(location.hash,['isEdit']).isEdit=='true'){
      userId=GetQueryString(location.hash,['userid']).userid;
    }
    getService(API_PREFIX + `services/web/role/roleList/get/0`, data => {
      if(data.status===1){
        let roleslastname=[];
        data.root&&data.root.object&&data.root.object.map((item,index) => {
          // if(item.level!=1){//过滤掉级别为1的角色
            roleslastname.push({
              label:item.name,
            value:item.id+'',
            });
            this.setState({
              roles:roleslastname,
            },()=>{
              console.log("roles",this.state.roles);
            });
          // }else{
            // console.log("item.level",item.level);
          // }
        });
      }else{
        message.error(data.errorMsg);
      }
    
    });
    //通过接口获取部门的信息
    getService(API_PREFIX+'services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false',data=>{
      if(data.status===1){
        let orgs=data.root.object;
      if(orgs){
        //直接调用处理部门数据的方法===》处理数据
        let selectIds = this.getDpData(orgs)
        this.getDepartmentData(orgs,selectIds);
        this.setState({
          organizations:orgs,
        });
      }
      }else{
        message.error(data.errorMsg);
      }
      

    });
   //通过接口，获取当前登录用户的角色信息,并将角色信息赋值给admindRole，（根据admindRole来确定分配角色功能是否显示）
    //首先需要知道当前登录用户的id,通过接口获取
    // let currentUserId=window.sessionStorage.getItem('id');
    // let id=JSON.parse(currentUserId);
    // console.log("当前登录用户的id:",id);
    // getService(API_PREFIX+`services/system/systemAndCompanyUser/get/userRole/${id}`,data=>{
    //       if(data.root.list&&data.root.list[0].length&&data.root.list[0].level==1 ){//是最高管理员===》
    //        this.setState({ownAdmindRole:true});//将是否拥有最高管理员权限的标志值为true
    //       }
    // });

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
        getService(API_PREFIX + `services/web/company/userInfo/getOne/${this.state.userId}`, data => {
          if (data.status == 1){
            this.setState(
                {
                  userInfo:data.root.object,
                },()=>{
                //   console.log("编辑时传入的数据：",this.state.userInfo);
                  //获取学历下拉列表元素
                    getService(API_PREFIX+'services/web/company/userInfo/getEduDictData',data=>{
                        if (data.status === 1){
                            this.setState({
                                SelectData:data.root.object,
                            },()=>{
                                let userInfoEdu = this.state.userInfo.edu;
                                let slelctEdu = this.state.SelectData;
                                slelctEdu.forEach(item=>{
                                    if(userInfoEdu == item.code){
                                        this.setState({
                                            userInfo:{
                                                ...this.state.userInfo,
                                                edu:item.fieldName,
                                            },
                                        });
                                    }
                                });
                            });
                        }
                    });
                    getService(API_PREFIX+'services/web/company/userInfo/getUserTypeDictData',data=>{
                      if(data.status === 1){
                        this.setState({
                          employeeTypeData:data.root.object,
                        },()=>{
                          this.state.employeeTypeData.forEach(item=>{
                            if(this.state.userInfo.employeeType==item.code){
                              this.setState({
                                userInfo:{
                                    ...this.state.userInfo,
                                    employeeType:item.desp,
                                },
                            });
                            }
                          });
                        });
                      }else{
                        message.error(data.errorMsg);
                      }
                    });
                }
            );
          }

        });
      }
      else{
          //获取学历下拉列表元素
          getService(API_PREFIX+'services/web/company/userInfo/getEduDictData',data=>{
            if (data.status === 1){
              console.log(data);
                this.setState({
                    SelectData:data.root.object,
                });
            }
        });
      }
    });
  }
  cascaderChange = (values, selectOptions) => { //yelu 获取选中的部门详细数据
    console.log('噢噢噢噢噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦', selectOptions)
      this.setState({cascaderOptions: selectOptions});
  }
  //表单提交事件处理   注意，给后端传入数据时，需要将 表单中的数据 以及 树 中的数据一起传入
  handleSubmit = (e) => {
    e.preventDefault();
    //树中数据的校验    判断是否选择了树
      console.log("*****************");
    this.props.form.validateFields((err, fieldsValue) => {
      // console.log("选中的树中的数据是：",this.props.checkData)
      // if(this.props.checkData.length===0||!this.props.checkData){
      //   this.setState({displayWarn:true})
      //   return;
      // }
      console.log("*************11111111111111111111****");
      if (err) {
        return;
      }
      console.log("*****************", fieldsValue);
      fieldsValue.eduName = fieldsValue.edu
      //表单中学历的数据
      let slelctEdu = this.state.SelectData;
      slelctEdu.forEach(item=>{
          if(fieldsValue.edu === item.fieldName){
            fieldsValue.edu = item.code;
          }
      });
      //表单中人员类型的数据
      let selectEmployee=this.state.employeeTypeData;
      selectEmployee.forEach(item=>{
        if(fieldsValue.employeeType === item.fieldName){
          fieldsValue.employeeType = item.code;
        }
    });

      const values={...fieldsValue,
        'orgId':fieldsValue.orgId?fieldsValue.orgId[fieldsValue.orgId.length-1]:'',
        // 'roleids':fieldsValue.roleids.toString(),
        // 'oldEmail':this.state.isEdit=='true'&&this.state.userInfo?this.state.userInfo.email:'',//编辑时需要传入旧的email
        'acount':fieldsValue.mobile,
      };
      values.address = values.address ? values.address.join('>') : ''
      let cascaderOptions = this.state.cascaderOptions;
      if(cascaderOptions.length) { 
          values.fullName = cascaderOptions[cascaderOptions.length - 1].fullName;
      }
      console.log('表单中的值为：',values);

      if(values.age){
        values.age= Math.floor(values.age);
      }

      //区分编辑和新增，调用不同的接口
      if(this.state.isEdit=='true'){//调用编辑的接口
        let realValues={
          ...values,
          id:this.state.userId,
          tenantId:this.state.userInfo.tenantId,
        };
        console.log('打印出来的值====》',this.state.userInfo.employeeType);
        if(realValues.edu===-1){
          delete realValues.edu;
          delete realValues.eduName
        }
        if(cascaderOptions.length == 0) {
          realValues.fullName = this.state.userInfo.fullName
        }
        console.log('-----realValues',realValues);
        postService(API_PREFIX + 'services/web/company/userInfo/updateUser', realValues, data => {
          if (data.status == 1) {
            message.success('修改成功！');
            location.hash = '/EnterpriseConfig/UserManagement';
          } else {
            message.error(data.retMsg);
          }
        });
      }else{
        if(values.edu===-1){
          delete values.edu;
          delete realValues.eduName
        }
        postService(API_PREFIX + 'services/web/company/userInfo/addUser', values, data => {
          if (data.status == 1) {
            message.success('新增成功！');
            location.hash = '/EnterpriseConfig/UserManagement';
          } else {
            message.error(data.retMsg);
          }
        });
      }

    });
  }
  //手机号的校验  先校验格式是否符合要求，再到数据库校验是否唯一
  handleValidMobile= (rule, value, callback) => {
    console.log('输入的手机号：',value);
    let patrn = /^[0-9]*$/;
    if(value===undefined){//再增加判断为undefined时将值设置为空xwx2018/12/27
      value='';
    }
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
          },
        });
        callback();
      }else{
        //校验手机号是否重复
        getService(API_PREFIX +`services/web/company/userInfo/checkUserDuplicate?Q=mobile=${value}${this.state.isEdit=='true'?`&Q=id=${this.state.userId}`:''}`,data=>{
          if(data.status===1){
              if(data.root.object===false){//存在重复
              this.setState({
               validMobile:{
                 retCode:'0',
                 retMsg:'该手机号码在系统中已经存在，请重新输入',
               },
             });
             callback([new Error('该手机号码在系统中已经存在，请重新输入')]);
              }else if(data.root.object===true){//未重复
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

        // let query=`Q=mobile_S_EQ=${value}`;


        // if(this.state.isEdit=='true'){//编辑==》额外传入
        //   query=query+'&'+`Q=id_S_NE=${this.state.userId}`;
        // }
        // getService(API_PREFIX + `services/system/verify/checkUnique/SystemSettings-NewUser?${query}`, data => {
        //   if(data.status==0){//手机号存在
        //     console.log("data.retMsg",data.retMsg);
        //     this.setState({
        //       validMobile:{
        //         retCode:data.retCode,
        //         retMsg:data.retMsg,
        //       },
        //     });
        //     callback([new Error('该手机号码在系统中已经存在，请重新输入')]);
        //     // message.error(data.retMsg)
        //   }else{
        //     let q=`Q=acount_S_EQ=${value}`;
        //     if(this.state.isEdit=='true'){//编辑==》额外传入
        //       q=q+'&'+`Q=id_S_NE=${this.state.userId}`;
        //     }
        //     getService(API_PREFIX + `services/system/verify/checkUnique/SystemSettings-NewUser?${q}`, data => {
        //       if(data.status==0) {//手机号存在
        //         console.log("data.retMsg", data.retMsg);
        //         this.setState({
        //           validMobile: {
        //             retCode: data.retCode,
        //             retMsg: data.retMsg,
        //           },
        //         });
        //         callback([new Error('该手机号码在系统中已经存在，请重新输入')]);
        //       }else{
        //         this.setState({
        //           validMobile:{
        //             retCode:data.retCode,
        //             retMsg:data.retMsg,
        //           },
        //         });
        //         callback();
        //       }
        //     });

        //   }
        // });
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
        },
      });
      callback();
    }else{
    // let query=`Q=email_S_EQ=${value}`;
    // if(this.state.isEdit=='true'){//编辑==》额外传入
    //   query=query+'&'+`Q=id_S_NE=${this.state.userId}`;
    // }
      getService(API_PREFIX + `services/web/company/userInfo/checkUserDuplicate?Q=email=${value}${this.state.isEdit=='true'?`&Q=id=${this.state.userId}`:''}`, data => {
        if(data.status===1){
          if(data.root.object===false){//存在重复得
            this.setState({
              validEmail:{
                retCode:'0',
                retMsg:'该邮箱在系统中已经存在，请重新输入',
              },
            });
            callback([new Error('该邮箱在系统中已经存在，请重新输入')]);
  
            }else if(data.root.object===true){//未重复
              this.setState({
                validEmail:{
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
  //员工号的校验
  handleValidUserno= (rule, value, callback) => {
    console.log('员工工号：',value);
    if(value == ''||value==undefined){
      callback();
    }else if(/^[0-9a-zA-Z]+$/.test(value)){//前端限制不能输入特殊字符只能输入数字，字母xwx2018/12/27
      // let id='';
      // if(this.state.isEdit=='true'){//编辑，则传入对应的id，否则传入“add”字符串
      //    id=this.state.userId;
      // }else{
      //   id='add';
      // }
      getService(API_PREFIX + `services/web/company/userInfo/checkUserDuplicate?Q=userNo=${value}${this.state.isEdit=='true'?`&Q=id=${this.state.userId}`:''}`, data => {
        if(data.status===1){
          if(data.root.object===false){//存在重复地
            console.log("data.retMsg",data.retMsg);
  
              this.setState({
                validUserno:{
                  retCode:'0',
                  retMsg:'该工号已存在',
                },
              });
            callback([new Error('该工号已存在')]);
              // message.error(data.retMsg)
            }else if(data.root.object===true){//未重复
              this.setState({
                validUserno:{
                  retCode:'1',
                },
              });
            callback();
          }
        }else{
          message.error(data.errorMsg);
        }
      });
    }else{
      callback(new Error('注意:不可输入特殊字符'));
    }

  }
  //select change事件
  selectChange = (value) => {
    console.log('顶顶顶顶顶顶顶顶顶',value);
    this.setState({
        userInfo:{
            ...this.state.userInfo,
            edu:value,
        },
    });
  }

  //人员类型change事件
  employeeTypeChange=(value)=>{
    console.log('大飒飒飒飒',value);
    this.setState({
      userInfo:{
          ...this.state.userInfo,
          employeeType:value,
      },
  });
  }

  //显示顺序验证是否重复接口
  handleNumberChange=(rule, value, callback)=>{
    if(value==null||value === ''||value==undefined){
      this.setState({
        validShowIndex:{
          retCode:'1',
        },
      });
      callback();
    } else if (isNaN(value)) {
      this.setState({
        validShowIndex:{
          retCode:'0',
          retMsg:'请输入数字',
        },
      });
      callback([new Error('请输入数字')]);
    } else if (value < 0) {
      this.setState({
        validShowIndex:{
          retCode:'0',
          retMsg:'显示顺序不能为负数',
        },
      });
      callback([new Error('显示顺序不能为负数')]);
    } else {
      this.setState({
      validShowIndex:{
        retCode:'1',
      },
    });
      callback()
    }
    // else {
    //   getService(API_PREFIX + `services/web/company/userInfo/checkUserDuplicate?Q=showIndex=${value}${this.state.isEdit=='true'?`&Q=id=${this.state.userId}`:''}`, data => {
    //     if(data.status===1){
    //       if(data.root.object===false){//存在重复得
    //         this.setState({
    //           validShowIndex:{
    //             retCode:'0',
    //             retMsg:'该顺序在系统中已经存在，请重新输入',
    //           },
    //         });
    //         callback([new Error('该顺序在系统中已经存在，请重新输入')]);
  
    //         }else if(data.root.object===true){//未重复
    //           this.setState({
    //             validShowIndex:{
    //               retCode:'1',
    //             },
    //           });
    //         callback();
    //       }
    //     }else{
    //       message.error(data.errorMsg);
    //     }
    //   });
    // }
  };

  render(){
    let powers = this.props.powers;
    let hasLevelPower=powers&&powers['20004.21503.000'];//是否有操作分配角色的权限
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
    let employeeType;
    let showIndex='';
    let sexDf=true;
    let isGrayUserDf=0;
    let belongsDepartDf=[];
    let assignRolesDf=[];
    let postDf = ''
    let hobbyDf = ''
    let specialityDf = ''
    let cityDf = []
    if(this.state.isEdit=='true'){//编辑，则默认值是查询到的值
      console.log('this.state.userInfo', this.state.userInfo);
      usernoDf=this.state.userInfo.userNo;
      lastnameDf=this.state.userInfo.name;
      emailDf=this.state.userInfo.email;
      mobileDf=this.state.userInfo.mobile;
      ageDf=this.state.userInfo.age;//年龄
      edu=this.state.userInfo.edu;//学历
      employeeType=this.state.userInfo.employeeType;
      showIndex=this.state.userInfo.showIndex;
      // console.log('*********eduDf',eduDf);
      sexDf=this.state.userInfo.sex==true?true:false;
      isGrayUserDf=this.state.userInfo.isGrayUser;
      belongsDepartDf=this.state.userInfo.treePath?this.state.userInfo.treePath.split(','):[];
      assignRolesDf=this.state.userInfo.roleIds&&this.state.userInfo.roleIds.length!==0?this.state.userInfo.roleIds:[];
      postDf = this.state.userInfo.post;
      hobbyDf = this.state.userInfo.hobby;
      specialityDf = this.state.userInfo.speciality;
      cityDf = this.state.userInfo.address ? this.state.userInfo.address.split('>'):[];
      console.log("assignRolesDf",assignRolesDf);
    }
    //
    let SelectData = this.state.SelectData;
    console.log('SelectData==>',SelectData);
    let selectOption = [];
    let employeeTypeOption =[];
    if(SelectData){
      
      SelectData.forEach(item=>{
        selectOption.push(<Option key={item.fieldName} value={item.code+''}>{item.fieldName}</Option>);
    });
    }

    if(this.state.employeeTypeData){
      this.state.employeeTypeData.forEach(item=>{
        employeeTypeOption.push(<Option key={item.desp} value={item.code+''}>{item.desp}</Option>);
      });
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
                  getFieldDecorator('userNo',{
                    rules: [
                      {validator: this.handleValidUserno},
                      {required:true,message:'请输入您的员工号'}
                  ],initialValue:usernoDf,
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
                  getFieldDecorator('name',
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
                    rules: [ {type:'email',message:'您输入的邮箱格式不正确，请输入正确的邮箱'},
                        {required: true, message: '请输入您的邮箱'}, {
                      validator: this.handleValidEmail,
                    }], initialValue: emailDf,
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
                  validator: this.handleValidMobile,
                }], initialValue:mobileDf})(
                    <Input/>
                  )
                }

              </FormItem>
              <FormItem
              {...formItemLayout}
              label="人员类型"
            >
              {
                getFieldDecorator('employeeType',{
                  initialValue:employeeType?employeeType:'',
                })(
                  <Select onChange={this.employeeTypeChange}>
                    {employeeTypeOption}
                  </Select>
                )
              }
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="显示顺序"
                validateStatus={this.state.validShowIndex.retCode=='0'?'error':'success'}
              >
                {
                  getFieldDecorator('showIndex',
                      {
                        rules:[
                          {validator:this.handleNumberChange},
                        ],
                        initialValue:showIndex?showIndex:'',
                      })(
                    <InputNumber min={0} max={999999} />
                  )
                }
              </FormItem>  
            <FormItem
              {...formItemLayout}
              label="学历"
            >
              {
                getFieldDecorator('edu',{initialValue:edu?edu:'',...RuleConfig.eduCofig})(
                  <Select onChange={this.selectChange}>
                    {selectOption}
                  </Select>
                )
              }
            </FormItem>
           
            <FormItem
              {...formItemLayout}
              label="年龄"
            >
              {
                getFieldDecorator('age',{initialValue:ageDf?ageDf:0,...RuleConfig.ageCofig})(
                  <InputNumber min={0} max={999} />
                )
              }

            </FormItem>
           
            <FormItem
              {...formItemLayout}
              label="性别"
            >
              {
                getFieldDecorator('sex',{initialValue:sexDf})(
                  <RadioGroup>
                    <Radio value={true}>男</Radio>
                    <Radio value={false}>女</Radio>
                  </RadioGroup>
                )
              }
            </FormItem>
          <FormItem
            {...formItemLayout}
            label="所属部门"
          >
            {getFieldDecorator('orgId', {initialValue: belongsDepartDf,...RuleConfig.belongsDepartmentCofig})
            (
                <Cascader  className='ant-cascader-picker-orginfo' options={this.state.organizations} changeOnSelect onChange={this.cascaderChange} placeholder="请选择关键字"/>
            )
            }　　
            {this.state.isEdit=='true'?<a  onClick={() => location.hash = '/EnterpriseConfig/DepartMent?back=1' }>部门管理</a>:null
            }
          </FormItem>
          
          <FormItem
              {...formItemLayout}
              label="职务"
            >
              {
                getFieldDecorator('post',{initialValue: postDf ? postDf : '',})(
                  <Input />
                )
              }

          </FormItem>
          <FormItem
              {...formItemLayout}
              label="特长"
            >
              {
                getFieldDecorator('speciality',{initialValue: specialityDf ? specialityDf : '',})(
                  <Input />
                )
              }
          </FormItem>
          <FormItem
              {...formItemLayout}
              label="现居地"
            >
              {
                getFieldDecorator('address',{initialValue: cityDf ? cityDf : '',})(
                  <Cascader  options={CityOption} changeOnSelect placeholder="请选择" />
                )
              }

          </FormItem>
          <FormItem
              {...formItemLayout}
              label="兴趣爱好"
            >
              {
                getFieldDecorator('hobby',{initialValue: hobbyDf ? hobbyDf : '',})(
                  <Input />
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
            label="分配角色"
            style={{display:hasLevelPower?'block':'none'}}
          >
            {
              getFieldDecorator('roleids',{initialValue:assignRolesDf})(
                <CheckboxGroup options={this.state.roles} />
              )

            }
          </FormItem>
          <FormItem>
            <Row>
                <Col span={2}  offset={8}><Button className="resetBtn" onClick={()=>location.hash = '/EnterpriseConfig/UserManagement'}>返回</Button></Col>
                <Col span={2} ><Button className="queryBtn" type="primary" onClick={this.handleSubmit}>保存</Button></Col> 
            </Row>
          </FormItem>
        </Form>


      </div>


    );
  }
}
export default NewUser;