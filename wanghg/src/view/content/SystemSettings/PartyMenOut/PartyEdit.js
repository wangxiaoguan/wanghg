import React, { Component } from 'react';
import { Form,  Input, Button,Col,Row, Select ,message,Radio,Cascader,TreeSelect} from 'antd';
import {RuleConfig} from  '../../ruleConfig';
import { DatePicker } from 'antd';
import moment from 'moment';
import API_PREFIX from '../../apiprefix';
import {postService,GetQueryString,getService} from '../../myFetch.js';
//用于表单
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
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
    })
)
@Form.create()
class PartyEdit extends Component{
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
      homeType:false,
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
  //员工号的校验
  handleValidUserno=(rule, value, callback) => {
    console.log('员工工号：',value);
    if(this.state.isEdit=="true"){//编辑页面
      callback();
      return;
    }

    //发起请求，判断该手机号是否存在
    if(value == ''||value==undefined){
      this.setState({
        validUserno:{
          retCode:1,
        }
      });
      callback()
    }else{
      getService(API_PREFIX + `services/system/systemAndCompanyUser/verifyPartyUserIsExist/${value}`, data => {
        if(data.retCode==0){//手机号存在
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
  // 员工号输入完成后根据员工号获取对应的name，并赋值给对应的input框中
  handleUsernoInputFinish=(e)=>{
    if(this.state.isEdit=="true"){//编辑页面
      callback();
      return;
    }

    console.log("handleUsernoInputFinish输入框输入的值为：",e.target.value);
    getService(API_PREFIX + `services/system/user/getUserByUserno/${e.target.value}`, data => {
           if(data.retCode==1){
             this.props.form.setFieldsValue({'name':data.root.lastname})
             this.setState({lastname:data.root.lastname});
           }

    })
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
      turninfullnemdateDf=this.state.userInfo.turninfullnemdate?this.state.userInfo.turninfullnemdate:new Date();
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
          <Col span={15} offset={1}>
              <FormItem
                  {...formItemLayout}
                  label="姓名"
              >
                {
                  getFieldDecorator('name',{initialValue:nameDf,...RuleConfig.nameConfig})
                  (
                      <Input
                          disabled={true}
                          />
                  )
                }
              </FormItem>
            </Col>
            <Col span={15} offset={1}>
              <FormItem
                  {...formItemLayout}
                  label="员工工号"
                  validateStatus={this.state.validUserno.retCode=='0'?'error':'success'}
                  // help={this.state.validUserno.retCode=='0'?this.state.validUserno.retMsg:''}
              >
                {
                  getFieldDecorator('userno',{
                    rules: [{required: true, message: '请输入您的员工号'}, {
                      validator: this.handleValidUserno
                    }], initialValue: usernoDf
                  })
                  (
                      <Input disabled={this.state.isEdit=="true"}
                          // onChange={(e) =>this.handleUsernoInput(e)}
                        onBlur={(e) =>this.handleUsernoInputFinish(e)}

                      />
                  )
                }
              </FormItem>
            </Col>
            <Col span={15} offset={1}>
              <FormItem
                  {...formItemLayout}
                  label="职务"
              >
                {
                  getFieldDecorator('name',{initialValue:nameDf,...RuleConfig.nameConfig})
                  (
                      <Input
                          disabled={true}
                          />
                  )
                }
              </FormItem>
            </Col>
            <Col span={15} offset={1}>
            <FormItem
                {...formItemLayout}
                label="政治面貌"
            >

              {
                getFieldDecorator('state',{initialValue:memtypeDf,...RuleConfig.memtypeCofig})
                (<Select  placeholder="请选择" >
                  <Option value="1">党员</Option>
                  <Option value="2">预备党员</Option>
                </Select>)
              }
            </FormItem>
            </Col>
            <Col span={15} offset={1}>
            <FormItem
                {...formItemLayout}
                label="所属党组织"
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
            <Col span={15} offset={1}>
            <FormItem
                {...formItemLayout}
                label="入党时间"
            >
              {
                getFieldDecorator('joindate',{initialValue:moment(joindateDf,dateFormat)})
                (
                  <DatePicker format={dateFormat}>
                </DatePicker>)

              }
            </FormItem>
            </Col>

            <Col span={15} offset={1}>
            <Form.Item {...formItemLayout} label="是否转出" >
                {getFieldDecorator('isHomePage', {
                  initialValue: false,
                  rules: [
                    {
                      type: 'boolean',
                      required: false,
                      whitespace: true,
                    },
                  ],
                })(
                  <RadioGroup
                    options={[
                      { label: '是', value: true },
                      { label: '否', value: false },
                    ]}
                    onChange={e => this.setState({ homeType: e.target.value })
                    }
                  />
                )}
              </Form.Item>
              {
                this.state.homeType ?
                  <React.Fragment>
                    <FormItem {...formItemLayout} label="转出时间">
                      {
                        getFieldDecorator('joindate',{initialValue:moment(joindateDf,dateFormat)})
                        (<DatePicker format={dateFormat}>
                        </DatePicker>)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label="转出地点">
                      {
                        getFieldDecorator('name',{initialValue:nameDf,...RuleConfig.nameConfig})
                        ( <Input disabled={true}/>)
                      }
                    </FormItem>
                  </React.Fragment> : null
              }
            </Col>
            </Row> 
            <Button style={{margin:"100px 0 100px 40%"}} className="resetBtn" onClick={()=>location.hash="/SystemSettings/PartyMembers"}>返回</Button>
            <Button className="queryBtn" type="primary" htmlType="submit" size="large">保存</Button>
          </Form>
        </div>
    );
  }
}
export default PartyEdit;