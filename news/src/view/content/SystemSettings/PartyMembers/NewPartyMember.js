import React, { Component } from 'react';
import { Form,  Input, Button,Col,Row, Select ,message,Cascader,TreeSelect} from 'antd';
import {RuleConfig} from  '../../ruleConfig';
import { DatePicker } from 'antd';
import moment from 'moment';
import ServiceApi from '../../apiprefix';
import {postService,GetQueryString,getService} from '../../myFetch.js';
import { setPost} from '../../../../redux-root/action/post/post';
import Post from './Post';
import {PartyOrganatiaons} from './PartyOrganatiaons'
import {PO} from './PO'
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
    }
  }
  componentWillMount(){
    getService(ServiceApi+'services/system/partyOrganization/partyOrganizationList/get',data=>{
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
      getService(ServiceApi+`services/system/partyMember/list/1/10?Q=userid_S_EQ=${this.state.userId}`,data=>{
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
    getService(ServiceApi+'services/lookup/init/partyPost',data=>{
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
      getService(ServiceApi + `services/system/systemAndCompanyUser/verifyPartyUserIsExist/${value}`, data => {
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
    getService(ServiceApi + `services/system/user/getUserByUserno/${e.target.value}`, data => {
           if(data.retCode==1){
             this.props.form.setFieldsValue({'name':data.root.lastname})
             this.setState({lastname:data.root.lastname});
           }

    })
  }
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
      console.log('handleSubmitPostData',postData);
      if(postData.length!=undefined){  //是数组时才需要校验
        if(postData.length==0){
          message.error('增加的职务不能为空');
          return;
        }
          console.log('handleSubmitPostData',postData);
        let isReturn=false;
        postData&&postData.map((item,index)=>{
            let t=item.value;
            console.log('handleSubmitPostData-map',item.value,t);//||!t.split('/')[0]||!t.split('/')[1]
            if(item&&item.value&&(item.value.length==0||!t.split('/')[0]||!t.split('/')[1])){//某个为空
              console.log('handleSubmitPostData-map-if',t);
              message.error('增加的职务不能为空');
              isReturn=true;
              }
          });
          if(isReturn){
            return;
          }
      }


      let temp='';
      if(postData.length>0){
        postData.filter((item)=>{
           return item!=undefined;
        });
        console.log('handleSubmitPostData',postData);
        let post=[];
        postData&& postData.map((item)=>{
          post.push(item.value);
        })
        temp=post.toString().replace(/\,/g,';');
        console.log('handleSubmitPostData',temp);
      }

      console.log('postData',postData.toString().replace(',',';'));
      const values = {
        ...fieldsValue,
        'joindate': fieldsValue['joindate'].format('YYYY-MM-DD'),
        'turninfullnemdate':fieldsValue['turninfullnemdate'].format('YYYY-MM-DD'),
        'partyid':fieldsValue.partyid?fieldsValue.partyid[fieldsValue.partyid.length-1]:'',
         'post':temp,

      }
      console.log("表单中的数据：",values);
      //根据isEdit判断是更新还是新增，从而调用不同的接口
      if(this.state.isEdit=="true"){//编辑
        if(postData.post===undefined){
          if(postData.zhiwuD===0){
            if(values.post===''){
              values.post=''
            }
          }else{
            if(values.post===''){
              values.post=this.state.userInfo.post
            }
          }
        }
        let realValues={
            ...values,
          userid:this.state.userId
        }
        console.log("-----realValues",realValues);
        postService(ServiceApi+'services/system/partyMember/update/partyMemberInfo',realValues,data=>{
          if (data.retCode == 1){
            message.success('修改成功！');
            location.hash = "/SystemSettings/PartyMembers"
          }else {
            message.error(data.retMsg);
          }
        });
      }else{
        postService(ServiceApi+'services/system/partyMember/add/partyMemberInfo',values,data=>{
          if (data.retCode == 1){
            message.success('新增成功！');
            location.hash = "/SystemSettings/PartyMembers"
          }else {
            message.error(data.retMsg);
          }
        });
      }

    })

}

componentWillUnmount(){
  this.props.setPostData({});
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
            <Col span={8}>
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
            <Col span={8}>
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
            </Row>
            <Row>
            <Col span={8}>
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
            <Col span={8}>
            <FormItem
                {...formItemLayout}
                label="转正时间"
            >
              {
                getFieldDecorator('turninfullnemdate',{initialValue:moment(turninfullnemdateDf,dateFormat)})
                (
                    <DatePicker  format={dateFormat}>

                    </DatePicker>)

              }
            </FormItem>
            </Col>
            <Col span={8}>
            <FormItem
                {...formItemLayout}
                label="转正地点"
            >{
              getFieldDecorator('turninplace',{initialValue:turninplaceDf})
              (
                  <Input/>

              )

            }

            </FormItem>
            </Col>
            <Col span={8}>
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
            <Col span={16}>
            <FormItem
                {...formItemLayout2}
                label="职务"
            >
              {
                getFieldDecorator('post')
                (
                    <Post
                        cascaderOptions={this.state.partyOrganizationDatas}
                        selectOptions={this.state.duties}
                        post={post}
                    >
                    </Post>
                )
              }
            </FormItem>
            </Col>
            </Row> 
            <Button style={{margin:"100px 0 100px 40%"}} className="resetBtn" onClick={()=>location.hash="/SystemSettings/PartyMembers"}>返回</Button>
            <Button className="queryBtn" type="primary" htmlType="submit" size="large">保存</Button>
          </Form>
        </div>
    );
  }
}
export default NewPartyMember;