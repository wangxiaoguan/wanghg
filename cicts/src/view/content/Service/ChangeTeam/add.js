import React, { Component } from 'react';
import { Form,  Input, Button,Col,Row, Select ,message,Cascader,TreeSelect,Checkbox,Radio,InputNumber,Message} from 'antd';
import {RuleConfig} from  '../../ruleConfig';
import { DatePicker } from 'antd';
import moment from 'moment';
import API_PREFIX from '../../apiprefix';
import {postService,GetQueryString,getService} from '../../myFetch.js';
import { setPost} from '../../../../redux-root/action/post/post';
import Post from '../.././PartyBuildGarden/PartyMembers/Post';
import {PartyOrganatiaons} from '../.././PartyBuildGarden/PartyMembers/PartyOrganatiaons'
import {PO} from '../.././PartyBuildGarden/PartyMembers/PO'
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
//用于表单
const FormItem = Form.Item;
//用于下拉框
const Option = Select.Option;
//日期格式
const dateFormat = 'YYYY-MM-DD';
//用于文本录用
const { TextArea } = Input;
//树选择
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

import { connect } from 'react-redux';

@connect(
    state => ({
      getPostData:state.post.postData,
    }),
    dispatch => ({
      setPostData: n => dispatch(setPost(n)),
    })
)
@Form.create()
class NewPartyMember extends Component{
  constructor(props){
    super(props);
    this.state={
      displayWarn:false,  //人为控制  所属部门的的必填属性校验
      userId:GetQueryString(location.hash,['userid','isEdit']).userid,//定义id，用来查询详情信息
      isEdit:GetQueryString(location.hash,['userid','isEdit']).isEdit,  //定义该页面的属性  编辑？新建
      userInfo:'',//编辑时，页面传过来的用户的基本信息，通过接口查询获取
      partyOrganizationDatas:[],    //党组织机构数据
      duties:[],//职务
      post:'',//职务
      validUserno:{

      },//校验员工号的信息
      lastname:'',
      hidden:false,
    }
  }
  componentWillMount(){
    getService(API_PREFIX+'services/system/partyOrganization/partyOrganizationList/get',data=>{
          console.log("党组织数据：",data);
          let pOrgs=data.root.list;
          if(pOrgs){
            //调用接口数据处理函数
            this.getPartyOrganationData(pOrgs);
            this.setState({
              partyOrganizationDatas:pOrgs
            });

          }
        }
    );

    //编辑时，需要根据页面传入的userid，取得具体的信息
    console.log("this.state.userId:",this.state.userId);
    if(this.state.isEdit=="true"){
      getService(API_PREFIX+`services/system/partyMember/list/1/10?Q=userid_S_EQ=${this.state.userId}`,data=>{
        console.log("编辑时传入的数据：",data.root.list[0]);
        this.setState(
            {
              userInfo:data.root.list[0],
            }
        );
      });
    }
    //获取职务信息
    //  lookup字典中的数据
    getService(API_PREFIX+'services/lookup/init/partyPost',data=>{
      //返回数据处理
      data.map((item,index)=>{
        item.label=item.desp;
        item.key=item.id+'';
        item.value=item.id+'';
      });
      this.setState({duties:data},()=>{
        console.log("duties",this.state.duties);
      });
    });

  }
  //递归取出接口返回的党组织的数据
  getPartyOrganationData(poData){
    poData.map((item,index)=>{
      item.value=item.id+'';
      item.label=item.name;
      item.children=item.partyOrganizationList;
      if(item.partyOrganizationList){//不为空，递归
        this.getPartyOrganationData(item.partyOrganizationList)
      }
    });
  }
  onChange=(value)=>{
    console.log('onChange ', value, arguments);
    this.setState({ post:value?value.toString():'' });
}


onChangeUserName=(e)=>{
  if(e.target.value > 12){
    message.error('请输入正确的月份');
    this.setState({
      hidden:true,
    })
  }else{
    this.setState({
      hidden:false,
    })
  }
}
  //员工号的校验
  // handleValidUserno=(rule, value, callback) => {
  //   console.log('员工工号：',value);
  //   // if(this.state.isEdit=="true"){//编辑页面
  //   //   callback();
  //   //   return;
  //   // }

  //   //发起请求，判断该手机号是否存在
  //   // if(value == ''||value==undefined){
  //   //   this.setState({
  //   //     validUserno:{
  //   //       retCode:1,
  //   //     }
  //   //   });
  //   //   callback()
  //   // }else{
  //   //   getService(API_PREFIX + `services/system/systemAndCompanyUser/verifyPartyUserIsExist/${value}`, data => {
  //   //     if(data.retCode==0){//手机号存在
  //   //       console.log("data.retMsg",data.retMsg);
  //   //         this.setState({
  //   //           validUserno:{
  //   //             retCode:data.retCode,
  //   //             retMsg:data.retMsg,
  //   //           }
  //   //         });
  //   //       callback([new Error(data.retMsg)])
  //   //         // message.error(data.retMsg)
  //   //       }else{
  //   //         this.setState({
  //   //           validUserno:{
  //   //             retCode:data.retCode,
  //   //             retMsg:data.retMsg,
  //   //           }
  //   //         });
  //   //       callback()
  //   //     }
  //   //   })
  //   // }

  // }
  // 员工号输入完成后根据员工号获取对应的name，并赋值给对应的input框中
  // handleUsernoInputFinish=(e)=>{
  //   // if(this.state.isEdit=="true"){//编辑页面
  //   //   callback();
  //   //   return;
  //   // }

  //   // console.log("handleUsernoInputFinish输入框输入的值为：",e.target.value);
  //   // getService(API_PREFIX + `services/system/user/getUserByUserno/${e.target.value}`, data => {
  //   //        if(data.retCode==1){
  //   //          this.props.form.setFieldsValue({'name':data.root.lastname})
  //   //          this.setState({lastname:data.root.lastname});
  //   //        }

  //   // })
  // }
  //表单事件处理
  handleSubmit=(e)=>{
    //阻止默认表单事件
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      //获取职务中的data
     let postData= this.props.getPostData;
      console.log('handleSubmitPostData',fieldsValue);
      const values = {
        ...fieldsValue,
        'partyid':fieldsValue.partyid?fieldsValue.partyid[fieldsValue.partyid.length-1]:'',
      }
      console.log("表单中的数据：",values);
      values['lastElectionTime']= values['lastElectionTime'].format('YYYY-MM-DD HH:mm:ss');
      if(values['push']=== true ){
        values['push']= 1;
      }else{
        values['push']= 0;
      }
      let intervals=parseInt(values.intervals);     //年份
      let lastElectionTime=values.lastElectionTime;
      let reminderTime=parseInt(values.reminderTime); //月份
      lastElectionTime=lastElectionTime.split(' ')
      let y=''
      let m=''
      let ym=lastElectionTime[0]
      let hms=lastElectionTime[1]
      ym=ym.split('-')
      y=parseInt(ym[0])
      m=parseInt(ym[1])
      let Year
      let d=parseInt(ym[2])
      if(m>reminderTime){
        m=m-reminderTime;
        y=y+intervals
      }else if(m===reminderTime){
        m=12
        y=y+intervals-1
      }else{
        m=m-reminderTime+12
        y=y+intervals-1
      }
      if(m>=10){
        if(d>=10){
          y=y.toString();
          m=m.toString();
          d=d.toString()
          Year=y+'-'+m+'-'+d
        }else{
          y=y.toString();
          m=m.toString();
          d=d.toString()
          Year=y+'-'+m+'-'+'0'+d
        }
        
      }else{
        if(d>=10){
          y=y.toString();
          m=m.toString();
          d=d.toString()
          Year=y+'-'+'0'+m+'-'+'0'+d
        }else{
          y=y.toString();
        m=m.toString();
        d=d.toString()
        Year=y+'-'+'0'+m+'-'+'0'+d
        }
      }

      let NewY=Year+' '+hms
      const valueList = {
        ...values,
        nextElectionTime:NewY,
      }
      //根据isEdit判断是更新还是新增，从而调用不同的接口
      postService(API_PREFIX+'services/servicemanager/PartyElectionInfo/addPartyElectionIfon',valueList,data=>{
        console.log('data222222222222',data);
        if (data.retCode == 1){
          let id = data.root.id;
          // location.hash = "/SystemSettings/PartyMembers"
          let body = {
            'cronDate':NewY,
            'taskName': '新建党支部换届提醒',
            'operateType': 1,
            'queryType': 'get',
            'queryUrl': API_PREFIX+`services/news/artical/newsInfo/publish/${id}`,
            'queryValue': {},
            'queryContentType': 'application/json',
          }
          console.log('body.cronDate',body.cronDate);
          postService(API_PREFIX + 'services/automation/job/add',
                            body,
                            timeData => {
                              console.log('timeData',timeData);
                              if (timeData.retCode === 1) {
                                getService(API_PREFIX + `services/servicemanager/PartyElectionInfo/addJobId/${id}/${timeData.root.id}`,Data => {
                                  if (Data.retCode === 1) {
                                    Message.success(
                                      `保存成功！将于${NewY}定时发布`
                                    );
                                    location.hash='Service/ChangeTeamList';
                                  }
                                })
                              }else{
                                Message.success(
                                  '保存成功'
                                );
                                location.hash='Service/ChangeTeamList';
                              }
                            }
                          )
        }else {
          message.error(data.retMsg);
        }
      });



      // debugger;

      // if(this.state.isEdit=="true"){//编辑
      //   if(postData.post===undefined){
      //     if(postData.zhiwuD===0){
      //       if(values.post===''){
      //         values.post=''
      //       }
      //     }else{
      //       if(values.post===''){
      //         values.post=this.state.userInfo.post
      //       }
      //     }
      //   }
      //   let realValues={
      //       ...values,

      //   }
      //   console.log("-----realValues",realValues);
      //   postService(API_PREFIX+'services/system/partyMember/update/partyMemberInfo',realValues,data=>{
      //     if (data.retCode == 1){
      //       message.success('修改成功！');
      //       location.hash = "/SystemSettings/PartyMembers"
      //     }else {
      //       message.error(data.retMsg);
      //     }
      //   });
      // }else{
      //   postService(API_PREFIX+'services/system/partyMember/add/partyMemberInfo',values,data=>{
      //     if (data.retCode == 1){
      //       message.success('新增成功！');
      //       location.hash = "/SystemSettings/PartyMembers"
      //     }else {
      //       message.error(data.retMsg);
      //     }
      //   });
      // }

    })

}

componentWillUnmount(){
  // this.props.setPostData({});
}

  render(){
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 12},
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
    };
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 6},
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 16 },
      },
    };

    //获取数据
    const { getFieldDecorator } = this.props.form; 
    //模拟编辑时的假数据
    const datas={
      name:'湖小敏',
      userno:'122',
      partynames:'党组织B',
      postname:'小组组长',
      memtype:'中共党员',
      joindate:'2015/01/01',
      turninplace:'地点1',
      turninfullnemdate:'2016/01/01'
    }
    //模拟编辑时的数据
    var nameDf=this.state.lastname;
    var usernoDf='';
    var partynamesDf=[];
    var postnameDf='';
    var memtypeDf='1';
    var joindateDf=new Date();
    var turninplaceDf='';
    var turninfullnemdateDf=new Date();
    let post='';
    if(this.state.isEdit=="true"){
      const num = this.state.userInfo.state;
      nameDf=this.state.userInfo.name;
      usernoDf=this.state.userInfo.userno;
      partynamesDf=this.state.userInfo.partyids?this.state.userInfo.partyids.split(","):[];
      postnameDf=this.state.userInfo.post?this.state.userInfo.post.split(","):[];
      memtypeDf=String(num);
      joindateDf=this.state.userInfo.joindate?this.state.userInfo.joindate:new Date();
      turninfullnemdateDf=this.state.userInfo.turnindate?this.state.userInfo.turnindate:new Date();
      turninplaceDf=this.state.userInfo.turninplace;
      post=this.state.userInfo.post;
      console.log("传入的数据封装后：",post);
    }
    const treeData = this.state.duties;
    console.log("123",this.state.lastname)
    
    return (
        <div>
          <Form onSubmit={this.handleSubmit}>
          <Row style={{marginTop:"30px"}}>
            <Col span={8}>
              <FormItem
                  {...formItemLayout}
                  label="提醒次数"
                  // validateStatus={this.state.validUserno.retCode=='0'?'error':'success'}
                  // help={this.state.validUserno.retCode=='0'?this.state.validUserno.retMsg:''}
              >
                {
                  getFieldDecorator('reminderCount',{
                    rules: [{required: true, message: '请输入提醒次数'}, {
                      // validator: this.handleValidUserno
                    }]
                  })
                  (
                      <Input 
                          // onChange={(e) =>this.handleUsernoInput(e)}
                        // onBlur={(e) =>this.handleUsernoInputFinish(e)}

                      />
                  )
                }
              </FormItem>

            </Col>
            <Col span={8}>
            <FormItem
                {...formItemLayout}
                label="选举预提醒时间(单位：月)"
            >
              {
                getFieldDecorator('reminderTime',{
                  rules: [{required: true,pattern: new RegExp(/^[1-9]\d*$/, "g"), message: '请输入正确的选举预提醒时间，只能为正整数'}, {
                  }],
                  initialValue:'1',
                })
                (
                  <Input
                    min={1} 
                    max={12}
                    onChange={this.onChangeUserName}
                    disabled={true}
                  />
                )

              }
            </FormItem>
            </Col>
            <Col span={8}>
            <FormItem
                {...formItemLayout}
                label="选举时间间隔(单位：年)"
            >

              {
                getFieldDecorator('intervals',{
                  rules: [{required: true, message: '请输入选举时间间隔'}, {
                  }]
                })
                (<Select  placeholder="请选择" >
                  <Option value="2">2</Option>
                  <Option value="4">4</Option>
                </Select>)
              }
            </FormItem>
            </Col>
            </Row>
            <Row>
            <Col span={8}>
            <FormItem
                {...formItemLayout}
                label="上次换届时间"
            >
              {
                getFieldDecorator('lastElectionTime',{
                  rules: [{ type: 'object', required: true, message: '请选择上次换届时间' }]
                })
                (
                  <DatePicker 
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} 
                  />
                )

              }
            </FormItem>
            </Col>
            <Col span={8}>
            <FormItem
                {...formItemLayout}
                label="党组织"
            >
              {
                getFieldDecorator('partyid',{initialValue:partynamesDf,...RuleConfig.partynamesConfig})
                (
                    <Cascader options={this.state.partyOrganizationDatas} changeOnSelect >

                    </Cascader>
                )
              }
            </FormItem>
            </Col>
            <Col span={8}>
            <FormItem
                {...formItemLayout}
                label="提醒职务"
            >{
              getFieldDecorator('remindeDuty',{initialValue:"1"})
              (
                <RadioGroup>
                  <Radio value="1">党组织委员</Radio>
                  <Radio value="2">上级党组织委员</Radio>
                </RadioGroup>
              )
            }
            </FormItem>
            </Col>
            <Col span={8}>
            <FormItem
                {...formItemLayout}
                label="提醒对象"
            >{
              getFieldDecorator('remindeObject',{initialValue:"1"})
              (
                // <Checkbox.Group options={['党组织委员','上级党组织委员']} 
                //   <Option value="1">党组织委员</Option>
                //   <Option value="2">上级党组织委员</Option> 
                // />
                <RadioGroup>
                  <Radio value="1">党组织委员</Radio>
                  <Radio value="2">上级党组织委员</Radio>
                </RadioGroup>
              )
            }
            </FormItem>
            </Col>
            <Col span={8}>
            <FormItem
                {...formItemLayout}
                label="提醒方式"
            >{
              getFieldDecorator('push',{initialValue:turninplaceDf})
              (
                <Checkbox >信科视界推送</Checkbox>

              )
            }
            </FormItem>
            </Col>
            </Row> 
            <Button style={{margin:"100px 0 100px 40%"}} className="resetBtn" onClick={()=>location.hash="/Service/ChangeTeamList"}>返回</Button>
            <Button className="queryBtn" type="primary" htmlType="submit" size="large" disabled={this.state.hidden}>保存</Button>
          </Form>
        </div>
    );
  }
}
export default NewPartyMember;