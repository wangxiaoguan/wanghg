import React, { Component } from 'react';
import { Form, Input, Button, Col, Row, Select, message, Cascader, TreeSelect, Radio } from 'antd';
import { RuleConfig } from '../../ruleConfig';
import { DatePicker } from 'antd';
import moment from 'moment';
import API_PREFIX from '../../apiprefix';
import { postService, GetQueryString, getService } from '../../myFetch.js';
import { setPost } from '../../../../redux-root/action/post/post';
import Post from './Post';
import { PartyOrganatiaons } from './PartyOrganatiaons'
import './post.less';
import { PO } from './PO';
let returnedItem; 
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
const RadioGroup = Radio.Group;

import { connect } from 'react-redux';

@connect(
  state => ({
    getPostData: state.post.postData,
  }),
  dispatch => ({
    setPostData: n => dispatch(setPost(n)),
  })
)
@Form.create()
class NewPartyMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayWarn: false,  //人为控制  所属部门的的必填属性校验
      userId: GetQueryString(location.hash, ['userid', 'isEdit']).userid,//定义id，用来查询详情信息
      isEdit: GetQueryString(location.hash, ['userid', 'isEdit']).isEdit,  //定义该页面的属性  编辑？新建
      userNo: GetQueryString(location.hash, ['userNo']).userNo, //定义员工号，用来查询详情信息
      userInfo: '',//编辑时，页面传过来的用户的基本信息，通过接口查询获取
      partyOrganizationDatas: [],    //党组织机构数据
      duties: [],//职务
      post: '',//职务
      validUserno: {

      },//校验员工号的信息
      lastname: '',
      postDeleteList: '',
      flag: false,
      authId: '',
      initPost:'', //编辑的初始职务
    }
  }
  componentWillMount() {
    let promiseOrg = new Promise((pass, fail) => {
      getService(API_PREFIX + 'services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1', data => {
        console.log("党组织数据：", data);
        let pOrgs = data.root.object;
        if (pOrgs) {
          //调用接口数据处理函数
          this.getPartyOrganationData(pOrgs);
          this.setState({
            partyOrganizationDatas: pOrgs
          });
          pass(pOrgs)
        }
      }
      );
    })

    //编辑时，需要根据页面传入的userid，取得具体的信息
    console.log("this.state.userId:", this.state.userId);
    if (this.state.isEdit == "true") {
      let promiseData = new Promise((pass, fail) => {
        getService(API_PREFIX + `services/web/party/partyUser/getPartyUserDetailByUserNo/${this.state.userNo}`, data => {
          console.log("编辑时传入的数据：", data.root.object);
          if (data.status === 1) {
            this.setState(
              {
                userInfo: data.root.object,
                post: data.root.object.partyMemPostList,
              }
            );
            pass(data.root.object)
          } else {
            message.error(data.errorMsg)
          }
  
        });
      })
      Promise.all([promiseOrg, promiseData]).then(res => {
        console.log('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', res)
        let partyMemPostList = res[1].partyMemPostList
        let initPost = ''
        if (partyMemPostList && partyMemPostList.length > 0) {
          if (partyMemPostList.length > 1) {
            partyMemPostList.forEach(item => {
              let treePath = this.getTreePath(item.partyId)
              initPost += `${treePath}/${item.postId};`
            })
            initPost = initPost.substr(0, initPost.length - 1)
          } else {
            let treePath = this.getTreePath(partyMemPostList[0].partyId)
            initPost = `${treePath}/${partyMemPostList[0].postId}`
          }
        }
        this.setState({initPost,})
      })
      getService(API_PREFIX + `services/web/company/userInfo/simpleList/1/10?Q=userNo=${this.state.userNo}`, res => {
        if(res.status === 1) {
          this.setState({
            authId: res.root.list&&res.root.list[0] ? res.root.list[0].id : ''
          })
        }
      })
    }
    //获取职务信息
    //  lookup字典中的数据
    postService(API_PREFIX + 'services/web/party/partyMemPost/getAllPostList', null, data => {
      //返回数据处理
      data.root.object.map((item, index) => {
        item.label = item.postName;
        item.key = item.postId + '';
        item.value = item.postId + '';
      });
      this.setState({ duties: data.root.object }, () => {
        console.log("duties", this.state.duties);
      });
    });

  }
  //递归取出接口返回的党组织的数据
  getPartyOrganationData(poData) {
    poData.map((item, index) => {
      item.value = item.id + '';
      item.label = item.partyName;
      item.children = item.partyOrgList;
      if (item.partyOrgList) {//不为空，递归
        this.getPartyOrganationData(item.partyOrgList)
      }
    });
  }
  onChange = (value) => {
    console.log('onChange ', value, arguments);
    this.setState({ post: value ? value.toString() : '' });
  }
  //员工号的校验
  handleValidUserno = (rule, value, callback) => {
    console.log('员工工号：', value);
    if (this.state.isEdit == "true") {//编辑页面
      callback();
      return;
    }

    if (value == '' || value == undefined) {
      callback();
    } else if (/^[0-9a-zA-Z]+$/.test(value)) {//前端限制不能输入特殊字符只能输入数字
      getService(API_PREFIX + `services/web/party/partyUser/verifyByUserNo/${value}`, data => {
        if (data.status === 1) {
          if (data.root.object.status === false) {
            this.setState({
              validUserno: {
                retCode: '0',
                retMsg: data.root.object.msg,
              },
            });
            callback([new Error(data.root.object.msg)]);
          } else if (data.root.object.status === true) {
            this.setState({
              validUserno: {
                retCode: '1',
              },
            });
            callback();
          }
        } else {
          message.error(data.errorMsg);
        }
      });
    } else {
      callback(new Error('注意:不可输入特殊字符'));
    }

  }
  // 员工号输入完成后根据员工号获取对应的name，并赋值给对应的input框中
  handleUsernoInputFinish = (e) => {
    if (this.state.isEdit == "true") {//编辑页面
      callback();
      return;
    }

    console.log("handleUsernoInputFinish输入框输入的值为：", e.target.value);
    if (e.target.value) {
      getService(API_PREFIX + `services/web/company/userInfo/simpleList/1/10?Q=userNo=${e.target.value}`, data => {
        if (data.status == 1) {
          this.props.form.setFieldsValue({ 'name': data.root.list&&data.root.list[0] ? data.root.list[0].name : ' ' })
          this.setState({ lastname: data.root.list&&data.root.list[0] ? data.root.list[0].name : '', authId: data.root.list&&data.root.list[0] ? data.root.list[0].id : '' });
        }
      })
    }
  }
  auchInfoPower = (flag, partyId) => {
    let userId = this.state.authId
    // if (currentItem.editDuties) { //如果是编辑
    //   userId = currentItem.userId
    // }else {
    //   userId = this.state.userId
    // }
    let name = ''
    let forAuth = (orgs) => {
      orgs.map(item => {
        if(item.id == partyId) {
          name = item.partyName
        }
        if(item.partyOrgList && item.partyOrgList.length) {
          forAuth(item.partyOrgList)
        }
      })
    }
    forAuth(this.state.partyOrganizationDatas)
    let body = {type: 2, id: partyId, userId: this.state.authId, name, }
    postService(API_PREFIX + `services/web/auth/authunion/${flag ? 'addAuthUser' : 'updateAuthUser'}`, body, res => {
      if(res.status !== 1) {
        message.error('党员鉴权失败!')
      }
    })
  }
   
  // 找到树结构
   mapTree=(treedata,parentId)=>{
       treedata.forEach(item=>{
                  if(item.id==parentId){
                     returnedItem=item.partyLevel
                     return item.partyLevel
                  }else if(item.partyOrgList&&item.partyOrgList.length>0){
                    this.mapTree(item.partyOrgList,parentId)
                  }
         })
   }

  //表单事件处理
  handleSubmit = (e) => {
    //阻止默认表单事件
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      //获取职务中的data
      let postData = this.props.getPostData;
      console.log('handleSubmitPostData', postData);
      if (postData.length != undefined) {  //是数组时才需要校验
        if (postData.length == 0) {
          message.error('增加的职务不能为空');
          return;
        }
        console.log('handleSubmitPostData', postData);
        let isReturn = false;
        postData && postData.map((item, index) => {
          let t = item.value;
          console.log('handleSubmitPostData-map', item.value, t);//||!t.split('/')[0]||!t.split('/')[1]
          if (item && item.value && (item.value.length == 0 || !t.split('/')[0] || !t.split('/')[1])) {//某个为空
            console.log('handleSubmitPostData-map-if', t);
            message.error('增加的职务不能为空');
            isReturn = true;
          }
        });
        if (isReturn) {
          return;
        }
      }
     this.mapTree(this.state.partyOrganizationDatas,fieldsValue.partyId[fieldsValue.partyId.length - 1]);
      if(returnedItem<3){
        message.error("党员只能归属党支部或者党小组")
        return false;
      }
      let temp = '';
      let tempOne = ''
      if (postData.length > 0) {
        postData.filter((item) => {
          return item != undefined;
        });
        console.log('handleSubmitPostData', postData);
        let post = [];
        postData && postData.map((item) => {
          post.push(item.value);
        })
        tempOne = post.toString().replace(/\,/g, ';');
      }
      let tempTwo = tempOne.indexOf(';') != -1 ? tempOne.replace(/\;{1,1000}/g, ';') : tempOne;
      // console.log(tempTwo.substring(1,tempTwo.length))
      temp = tempTwo[0] == ';' ? tempTwo.substring(1, tempTwo.length) : tempTwo
      let partyMemPostList = []
      if (temp) {
        if (temp.indexOf(';')) {
          temp.split(';').forEach(item => {
            let arr = item.split('/')
            partyMemPostList.push({ partyId: arr[0], postId: arr[1] })
          })
        } else {
          partyMemPostList.push({ partyId: temp.split('/')[0], postId: temp.split('/')[1] })
        }
      }
      const values = {
        ...fieldsValue,
        'joinDate': fieldsValue['joinDate'] ? fieldsValue['joinDate'].format('YYYY-MM-DD') : '',
        'turnInDate': fieldsValue['turnInDate'] ? fieldsValue['turnInDate'].format('YYYY-MM-DD') : '',
        'partyId': fieldsValue.partyId ? fieldsValue.partyId[fieldsValue.partyId.length - 1] : '',
        // 'partyMemPostList':partyMemPostList,
        // "partyNames": this.state.userInfo.partynames,
        // "postName": this.state.userInfo.postName ? this.state.userInfo.postName : ''

      }
      if (values.turnStatus) {
        values.state = parseInt(`1${values.state}`)
      }
      if (partyMemPostList.length) {
        values.partyMemPostList = partyMemPostList
      }
      if (!fieldsValue.turnStatus) {
        values.turnOutDate = fieldsValue['turnOutDate'] ? fieldsValue['turnOutDate'].format('YYYY-MM-DD') : ''
      }
      if (fieldsValue['turnOutDate'] && fieldsValue['turnOutDate'] < fieldsValue['joinDate']) {
        message.error('转出时间不得小于入党时间！')
        return
      }
      console.log("表单中的数据：", values);
      //根据isEdit判断是更新还是新增，从而调用不同的接口
      if (this.state.isEdit == "true") {//编辑
        if (postData.post === undefined) {
          if (postData.zhiwuD === 0) {
            if (values.post === '') {
              values.post = ''
            }
          } else {
            if (values.post === '') {
              values.post = this.state.userInfo.post
            }
          }
        }
        let post = this.state.post;
        if (post) { }
        let realValues = {
          ...values,
          id: this.state.userId,
          // position:this.state.postDeleteList
        }
        console.log("-----realValues", realValues);
        postService(API_PREFIX + 'services/web/party/partyUser/updatePartyMem', realValues, data => {
          if (data.status == 1) {
            message.success('修改成功！');
            this.auchInfoPower(false, values.partyId)
            location.hash = "/PartyBuildGarden/PartyMembers"
          } else {
            message.error(data.errorMsg);
          }
        });
      } else {
        postService(API_PREFIX + 'services/web/party/partyUser/addPartyMem', values, data => {
          if (data.status == 1) {
            message.success('新增成功！');
            this.auchInfoPower(true, values.partyId)
            location.hash = "/PartyBuildGarden/PartyMembers"
          } else {
            message.error(data.errorMsg);
          }
        });
      }

    })

  }
  turnChange = (e) => {
    console.log(e.target.value)
    this.setState({ flag: e.target.value })
  }
  componentWillUnmount() {
    this.props.setPostData({});
  }
  postDelelte = (value) => {
    console.log(value)
    this.setState({ postDeleteList: value });
  }

  selectValue=(value, selectedOptions)=>{
    console.log("22222",value,selectedOptions)
  }



  //获取对应党组织的treePath
  getTreePath = (partyId) => {
    let partyOrganizationDatas = this.state.partyOrganizationDatas
    let treePath = ''
    let orgMap = (org) => {
      org.map(item => {
        if (item.id == partyId) {
          treePath = item.treePath
        } else {
          if (item.partyOrgList) {
            orgMap(item.partyOrgList)
          }
        }
      })
      return treePath
    }
    return orgMap(partyOrganizationDatas)
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
    };
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 16 },
      },
    };

    //获取数据
    const { getFieldDecorator } = this.props.form;
    //模拟编辑时的假数据
    const datas = {
      name: '湖小敏',
      userno: '122',
      partynames: '党组织B',
      postname: '小组组长',
      memtype: '中共党员',
      joindate: '2015/01/01',
      turninplace: '地点1',
      turninfullnemdate: '2016/01/01'
    }
    //模拟编辑时的数据
    var nameDf = this.state.lastname;
    var usernoDf = '';
    var partynamesDf = [];
    var postnameDf = '';
    var memtypeDf = '1';
    var joindateDf = new Date();
    var turninplaceDf = '';
    var turninfullmemdateDf = new Date();
    let post = '';
    if (this.state.isEdit == "true") {
      const num = this.state.userInfo.state;
      nameDf = this.state.userInfo.userName;
      usernoDf = this.state.userInfo.userNo;
      partynamesDf = this.state.userInfo.treePath ? this.state.userInfo.treePath.split(",") : [];
      // postnameDf=this.state.userInfo.post?this.state.userInfo.post.split(","):[];
      memtypeDf = String(num);
      joindateDf = this.state.userInfo.joinDate ? this.state.userInfo.joinDate : '';
      turninfullmemdateDf = this.state.userInfo.turnInDate ? this.state.userInfo.turnInDate : '';
      turninplaceDf = this.state.userInfo.turnInPlace;
      console.log("传入的数据封装后：", post);
    }
    const treeData = this.state.duties;
    console.log("123", this.state.lastname)
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row style={{ marginTop: "30px" }}>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="员工工号"
                validateStatus={this.state.validUserno.retCode == '0' ? 'error' : 'success'}
              // help={this.state.validUserno.retCode=='0'?this.state.validUserno.retMsg:''}
              >
                {
                  getFieldDecorator('userNo', {
                    rules: [{ required: true, message: '请输入您的员工号' }, {
                      validator: this.handleValidUserno
                    }], initialValue: usernoDf
                  })
                    (
                      <Input disabled={this.state.isEdit == "true"}
                        onChange={(e) => this.handleUsernoInputFinish(e)}
                      // onFocus={(e) =>this.handleUsernoInputFinish(e)}
                      // onBlur={(e) =>this.handleUsernoInputFinish(e)}
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
                  getFieldDecorator('userName', { initialValue: nameDf, ...RuleConfig.nameConfig })
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
                  getFieldDecorator('state', { initialValue: memtypeDf, ...RuleConfig.memtypeCofig })
                    (<Select placeholder="请选择" >
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
                  getFieldDecorator('joinDate', { initialValue: joindateDf == '' ? '' : moment(joindateDf, dateFormat) })
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
                  getFieldDecorator('turnInDate', { initialValue: turninfullmemdateDf == '' ? '' : moment(turninfullmemdateDf, dateFormat) })
                    (
                      <DatePicker format={dateFormat}>

                      </DatePicker>)

                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="转正地点"
              >{
                  getFieldDecorator('turnInPlace', { initialValue: turninplaceDf })
                    (
                      <Input />

                    )

                }

              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="所属党组织"
                extra="注:党员只能归属党支部或者党小组"
              >
                {
                  getFieldDecorator('partyId', { initialValue: partynamesDf, ...RuleConfig.partynamesConfig })
                    (
                      <Cascader options={this.state.partyOrganizationDatas} changeOnSelect  onChange={()=>this.selectValue()}>

                      </Cascader>
                    )
                }
              </FormItem>
            </Col>
            
          </Row>
          <Row>
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
                        post={this.state.initPost}
                        postDelelte={this.postDelelte}
                      >
                      </Post>
                    )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="是否转出"
              >
                {
                  getFieldDecorator('turnStatus', {
                    initialValue: false
                  })
                    (
                      <RadioGroup onChange={this.turnChange}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </RadioGroup>
                    )
                }
              </FormItem>
            </Col>
            {
              this.state.flag ?
                (<React.Fragment>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="转出时间">
                      {
                        getFieldDecorator('turnOutDate', {
                          initialValue: this.state.userInfo.turnOutDate ? moment(this.state.userInfo.turnOutDate, dateFormat) : '',
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
                  </Col>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="转出地点">
                      {
                        getFieldDecorator('turnOutPlace', { initialValue: this.state.userInfo.turnOutPlace, ...RuleConfig.addressConfig })
                          (<Input />)
                      }
                    </FormItem>
                  </Col>
                </React.Fragment>) : null
            }
          </Row>
          <Button style={{ margin: "100px 0 100px 40%" }} className="resetBtn" onClick={() => location.hash = "/PartyBuildGarden/PartyMembers"}>返回</Button>
          <Button className="queryBtn" type="primary" htmlType="submit" size="large">保存</Button>
        </Form>
      </div>
    );
  }
}
export default NewPartyMember;