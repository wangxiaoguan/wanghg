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
      userNo: GetQueryString(location.hash,['userNo']).userNo,
      userInfo:'',//编辑时，页面传过来的用户的基本信息，通过接口查询获取
      partyOrganizationDatas:[],    //党组织机构数据
      duties:[],//职务
      post:'',//职务
      validUserno:{

      },//校验员工号的信息
      lastname:'',
      homeType:true,
    }
  }
  componentWillMount(){
    getService(API_PREFIX+'services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1',data=>{
          console.log("党组织数据：",data);
          let pOrgs=data.root.object;
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
      getService(API_PREFIX+`services/web/party/partyUser/getPartyUserDetailByUserNo/${this.state.userNo}`,data=>{
        if(data.status === 1) {
          this.setState({userInfo: data.root.object,}
          );
        }else {
          message.error(data.errorMsg)
        }
      });
    }
    //获取职务信息
    //  lookup字典中的数据
    postService(API_PREFIX+'services/web/party/partyMemPost/getAllPostList', null, data=>{
      //返回数据处理
      data.root.object.map((item,index)=>{
        item.label=item.postName;
        item.key=item.postId+'';
        item.value=item.postId+'';
      });
      this.setState({duties:data.root.object},()=>{
        console.log("duties",this.state.duties);
      });
    });

  }
  //递归取出接口返回的党组织的数据
  getPartyOrganationData(poData){
    poData.map((item,index)=>{
      item.value=item.id+'';
      item.label=item.partyName;
      item.children=item.partyOrgList;
      if(item.partyOrgList){//不为空，递归
        this.getPartyOrganationData(item.partyOrgList)
      }
    });
  }
  onChange=(value)=>{
    console.log('onChange ', value, arguments);
    this.setState({ post:value?value.toString():'' });
  }
    //表单事件处理
    handleSubmit=(e)=>{
      //阻止默认表单事件
      e.preventDefault();
      this.props.form.validateFields((err, fieldsValue) => {
        console.log(fieldsValue)
        if (err) {
          return;
        }
        if(fieldsValue.turnOutDate < new Date(fieldsValue.joinDate)) {
            message.error('转出时间不得小于入党时间')
            return
        }
        const values = {
          ...fieldsValue,
          'turnOutDate': fieldsValue.turnOutDate ? fieldsValue.turnOutDate.format('YYYY-MM-DD') : '',
          'id':this.state.userId,
          'partyId': this.state.userInfo.partyId,
          'state': this.state.userInfo.state,
        }
        if(this.state.userInfo.partyMemPostList) {
          values.partyMemPostList = this.state.userInfo.partyMemPostList
        }
        console.log("表单中的数据：",values);
        //根据isEdit判断是更新还是新增，从而调用不同的接口
        if(this.state.isEdit=="true"){//编辑 
          postService(API_PREFIX+'services/web/party/partyUser/updatePartyMem',values,data=>{
            if (data.status == 1){
              message.success('修改成功！');
              location.hash = "/PartyBuildGarden/PartyMenOut"
            }else {
              message.error(data.errorMsg);
            }
          });
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
    var userName=this.state.lastname;
    var usernoDf='';
    var partynamesDf=[];
    var postnameDf='';
    var joindateDf=new Date();
    var turninplaceDf='';
    let post='';
    let turnOutDateDf=new Date();
    if(this.state.isEdit=="true"){
      console.log('this.state.userInfo5555=>',this.state.userInfo)
      // let partysName = this.state.userInfo.partyFullName?this.state.userInfo.partyFullName.split(">"):[];
      // const num = this.state.userInfo.state;
      userName=this.state.userInfo.userName;  //姓名
      usernoDf=this.state.userInfo.userNo; //员工号
      partynamesDf=this.state.userInfo.fullName?this.state.userInfo.fullName:'';   //所属党组织
      postnameDf=this.state.userInfo.postName?this.state.userInfo.postName:'';   //职务
      joindateDf=this.state.userInfo.joinDate?this.state.userInfo.joinDate:'';   //入党时间
      turninplaceDf=this.state.userInfo.turnOutPlace;    //转出地点
      turnOutDateDf = this.state.userInfo.turnOutDate ? this.state.userInfo.turnOutDate : '' //转出时间
    }
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
                  getFieldDecorator('userName',{initialValue:userName,...RuleConfig.nameConfig})
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
                  getFieldDecorator('userNo',{
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
                  getFieldDecorator('postName',{initialValue:postnameDf,})
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
                getFieldDecorator('state',{initialValue:parseInt(this.state.userInfo.state) - 10 == 1 ? '党员' : '预备党员',...RuleConfig.memtypeCofig})
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
                label="所属党组织"
            >
              {
                getFieldDecorator('fullName',{initialValue:partynamesDf,...RuleConfig.partynamesConfig})
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
                label="入党时间"
            >
              {
                getFieldDecorator('joinDate',{initialValue:joindateDf})
                (
                  <Input
                  disabled={true}
                  />
                )

              }
            </FormItem>
            </Col>

            <Col span={15} offset={1}>
            {/* <Form.Item {...formItemLayout} label="是否转出" >
                {getFieldDecorator('isHomePage', {
                  initialValue: true,
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
              </Form.Item> */}
              {
                this.state.homeType ?
                  <React.Fragment>
                    <FormItem {...formItemLayout} label="转出时间">
                      {
                        getFieldDecorator('turnOutDate', {
                          initialValue: turnOutDateDf == '' ? '' : moment(turnOutDateDf, dateFormat),
                          rules: [
                            {
                              required: true,
                              message: '转出时间为必填项'
                            }
                          ]
                        })
                        (<DatePicker format={dateFormat}>
                        </DatePicker>)
                      }
                    </FormItem>
                    <FormItem {...formItemLayout} label="转出地点">
                      {
                        getFieldDecorator('turnOutPlace',{initialValue: turninplaceDf,...RuleConfig.addressConfig})
                        ( <Input />)
                      }
                    </FormItem>
                  </React.Fragment> : null
              }
            </Col>
            </Row> 
            {/* <Button style={{margin:"100px 0 100px 40%"}} className="resetBtn" onClick={()=>location.hash="/PartyBuildGarden/PartyMembers"}>返回</Button> */}
            <Button style={{margin:"100px 0 100px 40%"}} className="resetBtn" onClick={()=>history.back()}>返回</Button>
            <Button className="queryBtn" type="primary" htmlType="submit" size="large">保存</Button>
          </Form>
        </div>
    );
  }
}
export default PartyEdit;