import React, { Component } from 'react';
import { Button, Select, Form, Input, Row, Col, Spin, message, DatePicker } from 'antd';
import PersonModal from './PersonModal'
import { getService, postService, GetQueryString } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import './index.less';
import moment from 'moment'
const { TextArea } = Input;

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
};

@Form.create()
class DetailEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loadingData: true,
            memberData: {},
            memberList: [],
            needReLoad: true,
            roleList: [],
            changeDate: props.orgInfo.changeDate ? props.orgInfo.changeDate : null,
            isback:GetQueryString(location.hash, ['back']).back || '',
            dutieCounts: {},
            initMemPostData: [],
            levelData: this.props.levelData,
        }
        this.props = props
        this.roleList = []
        this.memberData = {}
    }
    
    componentWillMount() {
        // this.requestMemberData(this.props.orgInfo.id)
        // console.log(123)
        this.requestRoleList()
        // this.requestMemberData(this.props.orgInfo.id)
        // console.log(666)
    }
    componentDidMount() {
        // console.log(999)
        this.initProps(this.props, true);
        // this.requestMemberData(this.props.orgInfo.id)
    }


    componentWillReceiveProps(nextProps) {
        this.initProps(nextProps, true);
        // this.requestMemberData(this.props.orgInfo.id)
        // console.log('init')
        // this.setState({
        //     needReLoad: !this.state.needReLoad
        // })
        this.setState({levelData: nextProps.levelData})
    }
    initProps(props, inited = true) {
        if (props.wrappedRef) {
            props.wrappedRef(this);
        }
    }

    requestMemberData(id) {
        this.setState({ loadingData: true })
        postService(API_PREFIX + 'services/web/party/partyMemPost/getAllMemPostByPartyId/' + `${id}`, null, (res) => {
            //console.log(JSON.stringify(res))
            if (res.status === 1) {
                const list = res.root.object
                const dutieStatu = res.root.object.length > 0 ? true : false
                this.props.getDutieStatu(dutieStatu)
                // var memberData = this.memberData
                var memberData = JSON.parse(JSON.stringify(this.memberData))
                console.log('--------------', memberData)
                let initMemPostData = []
                for (var i = 0; i < list.length; i++) {
                  memberData[`${list[i].postId}`] ? memberData[`${list[i].postId}`].push(list[i]) : null
                  initMemPostData.push(list[i])
                }
                this.setState({
                    memberData: memberData,
                    memberList: list,
                    initMemPostData,
                })
                // console.log(JSON.stringify(memberData))
                // console.log(JSON.stringify(this.state))
            } else {
                message.error(res.retMsg);
            }
            this.setState({ loadingData: false })



        });
    }

    requestRoleList() {
        postService(API_PREFIX + 'services/web/party/partyMemPost/getAllPostList', '', (res) => {
            // console.log(JSON.stringify(res))
            // this.roleList = res
            let arr = res.root.object
            var memberData = {}
            for (var i = 0; i < arr.length; i++) {
                const role = arr[i]
                memberData[`${role.postId}`] = []
            }
            this.setState({
                roleList: arr,
                memberData: memberData,
            })
            this.memberData = memberData
            this.requestMemberData(this.props.orgInfo.id)
            // console.log(JSON.stringify(memberData))
            // if (res.retCode === 1) {
            //     // console.log(JSON.stringify(res))

            // }
        });
    }

    // requestDelMember(userId, postid) {
    //   let body = [{
    //     userId: userId,
    //     dutieId: postid,
    //     partyId: this.props.orgInfo.id
    //   }]
    //     postService(API_PREFIX + `services/system/partyOrganization/deleteMemPost`, body, data => {console.log('----------------',data)});
    // }

    handleSave(isNew) {
        console.log('333333333333333333333333333333333333333',this.props.form.getFieldValue())
        
        this.props.form.validateFields((err,values) => {
            console.log('4444444444444444444444444444444444444',err)
            console.log('5555555555555555555555555555555555555',values)
            if(err) {
                message.error('组织名称不能为空')
                return
            } 
            if (isNew) {
                this.requestDetailNew()
            } else {
                this.requestDetailSave()
            }
            this.requestDutieInfo()
        })
    }

    requestDetailSave() {
        const { form: { validateFields } } = this.props
        validateFields((err, values) => {
            console.log('6666666666666666666666666666666666',err)
            console.log('7777777777777777777777777777777777',values)
            if (err) return
            this.setState({ loadingData: true })
            let body = {
                "id": this.props.orgInfo.id,
                "partyName": values.partyName,
                "fullName": this.props.orgInfo.fullName ? this.props.orgInfo.fullName + '>' + values.partyName : values.partyName,
                "instruction": values.instruction,
                "partyOrgStatus": this.props.orgInfo.enable ? 1 : 0,
                'partyLevel': values.partyLevel,
            }
            if(this.state.changeDate) {
                body.changeDate = this.state.changeDate
            }
            postService(
                API_PREFIX + `services/web/party/partyOrganization/update`,body, (res) => {
                    if (res.status === 1) {
                        this.props.newCallback()
                    } else {
                        message.error(res.errorMsg);
                    }
                    this.setState({ loadingData: false })
                });
        });
    }

    requestDetailNew() {
        const { form: { validateFields } } = this.props
        validateFields((err, values) => {
            if (err) return
            this.setState({ loadingData: true })
            postService(
                API_PREFIX + `services/web/party/partyOrganization/insert`,
                {
                    "parentId": this.props.orgInfo.parentId,
                    "treePath": this.props.orgInfo.treePath,
                    "partyName": values.partyName,
                    "fullName": this.props.orgInfo.fullName + '>' + values.partyName,
                    "instruction": values.instruction,
                    "partyOrgStatus": 1
                }, (res) => {
                    if (res.status === 1) {
                        this.props.newCallback()
                    } else {
                        message.error(res.errorMsg);
                    }
                    this.setState({ loadingData: false })
                });
        });
    }
    requestDutieInfo() {
      let obj = this.state.memberData
    //   let changeDate = this.state.changeDate
      let initMemPostData = this.state.initMemPostData
      let addMum = []
      Object.keys(obj).forEach(key => {
        obj[`${key}`].forEach(val => {
            addMum.push({postId: key, memId: val.id, partyId: this.props.orgInfo.id})
        })
      })
      let deletePost = []
      let addPost = []
      console.log('你你你你你你你你你你你你你你你你你你你你你你你你你你你你你你你你你你你', initMemPostData, addMum)
      initMemPostData.forEach(item => {
        let count = 0
        addMum.forEach(res => {
            if(item.id == res.memId && item.postId == res.postId) {
                count++
            }
        })
        if(!count) {
            deletePost.push({id: item.memPostId})
        }
      })
      addMum.forEach(item => {
          if(initMemPostData.length == 0) {
            addPost.push(item)
          }else {
            let flag = 0
            initMemPostData.forEach(res => {
                if(item.memId == res.id && item.postId == res.postId) {
                    // addPost.push(item)
                    flag++
                }
            })
            if(!flag) {
                addPost.push(item)
            }
          } 
      })
      postService(
        API_PREFIX + `services/web/party/partyMemPost/updatePartyMemPost`, {deletePost, addPost}, (res) => {
            if (res.status == 1) {
                this.props.newCallback()
                message.success('保存成功')
                this.requestMemberData(this.props.orgInfo.id)
            } else {
                message.error(res.errorMsg);
            }
            this.setState({ loadingData: false })
        });
    }

    handleDel(value, postid) {
        const list = this.state.memberList
        let userDelId = null
        for(var i = 0; i < list.length; i++) {
          let item = list[i]
          if (item.userName == value && item.postId == postid) {
            userDelId = item.id
            list.splice(i, 1)
            break
          }
        }
        console.log(userDelId)
        // this.requestDelMember(userDelId, postid)
        let memberData = this.state.memberData
        memberData[`${postid}`].forEach((user, index) => {
          if(user.userName == value){
            memberData[`${postid}`].splice(index,1)
          }
        })
        let dutieCounts = this.state.dutieCounts
        if(dutieCounts[userDelId]) {
            dutieCounts[userDelId] -= 1
        }
        this.setState({
          memberData,
          memberList: list
        })
    }

    getDutieInfo = (postId, userinfo, uid) => {
      let addMember = []
      let member = this.state.memberList
      console.log('草草草草草草草草草草草草草草草草踩踩踩踩踩踩踩踩踩踩踩踩踩踩踩踩踩', userinfo, uid)
      userinfo.forEach(item => {
        let count = 0
        member.forEach(v => {
          if(v.id == item.id && v.postId == postId) {
            count++
          }
        })
        if(!count) {
          addMember.push({postId: parseInt(postId), userName: item.userName, id: item.id})
        }
      })
      let memberList = [ ...member, ...addMember]
      console.log('1111111111111111111111111111', memberList)
    //   var memberData = JSON.parse(JSON.stringify(this.memberData))
      var memberData = this.state.memberData
      memberData[postId] = []
    //   for (var i = 0; i < memberList.length; i++) {
    //     memberData[`${memberList[i].postId}`] ? memberData[`${memberList[i].postId}`].push(memberList[i]) : null
    //   }
        uid.forEach(item => {
            for (var i = 0; i < memberList.length; i++) {
                if(item == memberList[i].id && memberList[i].postId == postId) {
                    memberData[postId].push({id: item, userName: memberList[i].userName, postId: memberList[i].postId})
                }
            }
      })
      console.log('3333333', memberData)
      this.setState({
        memberList,
        memberData,
      })
    }
    dateChange = (data, dataStr) => {
      this.setState({
        changeDate: moment(data, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD hh:mm:ss')
      })
    }
    validatorPartyName = (rule, value, callback) => {
        if(!this.props.parentNode) {
            callback();
            return
        }
        let orgList = this.props.parentNode && this.props.parentNode.partyOrgList
        let id = this.props.orgInfo.id
        let flag = false
        for(var i = 0; i < orgList.length; i++) {
            if(value && value == orgList[i].partyName && id != orgList[i].id) {
                flag = true
                break
            }
        }
        if(!value) {
            callback('党组织名称不能为空!')
        }else if(value && /^[\s]*$/.test(value)) {
            callback('党组织名称不能全部为空格!')
        }else if(flag) {
            callback('同级下存在相同的党组织名称!')
        }else {
            callback()
        }
    }
    render() {
        // console.log('orgInfo', this.props.orgInfo)
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {
            form: { getFieldDecorator },
        } = this.props
        const memberData = this.state.memberData
        const tableModalShow = (postid, userDate) => {
            this.PersonModal.show(postid, userDate)
        }
        const orgState = !this.props.orgInfo.enable
        const roleSelect = []
        console.log('我们冬菇哦果儿u共轭欧健儿欧股哦额u哦古o', this.state.roleList)
        for (var i = 0; i < this.state.roleList.length; i++) {
            const role = this.state.roleList[i]
            roleSelect.push(
                <Row key={i + ''}>
                    <Col span={22}>
                        {/* <Form > */}
                        <FormItem label={role.postName} {...formItemLayout}>
                            <Row>
                                <Col span={17}>
                                    {/* {getFieldDecorator(`${role.dutieId}`, {
                                        // initialValue: memberData[`${role.dutieId}`].map((user) => { return user.memName }),
                                        initialValue: memberData[`${role.dutieId}`].map((user) => { return user.userId }),
                                        rules: [{ required: false, message: '请指定工会主席' }],
                                    })( */}
                                        <Select
                                            className='partyOrgSel'
                                            mode="multiple"
                                            notFoundContent="点击选择人员添加"
                                            open={false}
                                            onDeselect={(value) => { this.handleDel(value, role.postId) }}
                                            disabled={!this.props.orgInfo.modifyEnable || orgState}
                                            value={memberData[`${role.postId}`].map((user) => { return user.userName })}
                                        >
                                            {memberData[`${role.postId}`].map((user) => { <Option key={user.id}>{user.userName}</Option> })}
                                        </Select>
                                    {/* )} */}

                                </Col>
                                <Col span={1} />
                                <Col span={4}>
                                    <Button className="queryBtn1" style={{backgroundColor:'#fff',color:'rgb(146, 149, 165)',borderRadius:16,border:'1px solid rgb(146, 149, 165)'}}
                                     onClick={() => tableModalShow(`${role.postId}`, memberData[`${role.postId}`])} disabled={!this.props.orgInfo.modifyEnable || orgState} >选择人员</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Col>
                </Row>
            )
        }
        let obj = this.state.memberData
        let flag = 0
        Object.keys(obj).forEach(key => {
          if(obj[`${key}`].length > 0) {
            flag++
          }
        })
        if(roleSelect.length > 0 && flag > 0) {
          roleSelect.push(
            <Row>
              <Col span={22}>
                  <FormItem label="换届时间" {...formItemLayout}>
                      <Row>
                          <Col span={17}>
                              {getFieldDecorator('getDate', {     
                                  initialValue: this.state.changeDate ? moment(moment(this.state.changeDate, 'YYYY-MM-DD')) : ''
                              })(
                                  <DatePicker onChange={this.dateChange} disabled={!this.props.orgInfo.modifyEnable || orgState} />
                              )}
                          </Col>
                      </Row>
                  </FormItem>
              </Col>
          </Row>
          )
        }
        return (
            <div style={{ width: '100%', marginTop: 20 }}>
                <Spin spinning={false}>
                    <Form >
                        <Row>
                            <Col span={22}>

                                <FormItem label="组织名称" {...formItemLayout}>
                                    <Row>
                                        <Col span={17}>
                                            {getFieldDecorator('partyName', {
                                                initialValue: this.props.isNew ? "" : this.props.orgInfo.partyName,
                                                rules: [{ 
                                                    required: true, 
                                                    // message: '请输入组织名称',
                                                    validator: (rule, value, callback) =>this.validatorPartyName(rule, value, callback) 
                                                    }
                                                ],
                                            })(
                                                <Input placeholder="请输入组织名称" disabled={!this.props.orgInfo.modifyEnable || this.props.orgInfo.parentId == '-1' || orgState} />
                                            )}
                                        </Col>
                                    </Row>
                                </FormItem>

                            </Col>
                        </Row>
                        <Row>
                            <Col span={22}>
                                <FormItem label="组织说明" {...formItemLayout}>
                                    <Row>
                                        <Col span={17}>
                                            {getFieldDecorator('instruction', {
                                                initialValue: this.props.isNew ? "" : this.props.orgInfo.instruction,
                                                rules: [{ required: false, message: '请输入组织说明' }],
                                            })(
                                                <TextArea placeholder="请输入组织说明" disabled={!this.props.orgInfo.modifyEnable || orgState} />
                                            )}
                                        </Col>
                                    </Row>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={22}>

                                <FormItem label="组织级别" {...formItemLayout}>
                                    <Row>
                                        <Col span={17}>
                                            {getFieldDecorator('partyLevel', {
                                                initialValue: this.props.isNew ? "5" : this.props.orgInfo.partyLevel ? this.props.orgInfo.partyLevel.toString() : '5',
                                                rules: [{ required: true, message: '请选择组织级别' }],
                                            })(
                                                <Select disabled={!this.props.orgInfo.modifyEnable || orgState}>
                                                    {this.state.levelData.map(item => {
                                                        return (<Option key={item.code} value={item.code}>{item.desp}</Option>)
                                                    })}
                                                </Select>
                                            )}
                                        </Col>
                                    </Row>
                                </FormItem>

                            </Col>
                        </Row>
                        <Row>
                            <Col span={22}>
                                <FormItem label="组织状态" {...formItemLayout}>
                                    <Row>
                                        <Col span={17}>
                                            {getFieldDecorator('selectAble', {
                                                initialValue: this.props.isNew ? "true" : `${this.props.orgInfo.enable}`,
                                                rules: [{ required: false, message: '请选择组织状态' }],
                                            })(
                                                <Select showArrow={false} disabled >
                                                    <Option value='true'>启用</Option>
                                                    <Option value='false'>停用</Option>
                                                </Select>
                                            )}
                                        </Col>
                                    </Row>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={22}>
                                <FormItem label="组织人数" {...formItemLayout}>
                                    <Row>
                                        <Col span={17}>
                                            {getFieldDecorator('memCount', {
                                                initialValue: this.props.orgInfo.memCount,
                                            })(
                                                <Input disabled />
                                            )}
                                        </Col>
                                    </Row>
                                </FormItem>
                            </Col>
                        </Row>
                        {roleSelect}
                        {/* <Row>
                            <Col span={22}>
                                <FormItem label="换届时间" {...formItemLayout}>
                                    <Row>
                                        <Col span={17}>
                                            {getFieldDecorator('getDate', {
                                                initialValue: this.state.changeDate ? moment(moment(this.state.changeDate, 'YYYY-MM-DD')) : ''
                                            })(
                                                <DatePicker onChange={this.dateChange} disabled={!this.props.orgInfo.modifyEnable} />
                                            )}
                                        </Col>
                                    </Row>
                                </FormItem>
                            </Col>
                        </Row> */}
                    </Form>
                    <Row>
                        <Col span={9} />
                        {/* <Col span={6}> */}
                        {this.state.isback === '1' ?
                            <Button className="resetBtn" type="primary" onClick={() => {
                                sessionStorage.setItem('eventAndInfoKey', 1) // yelu 设置从查看权限设置点击进来时，返回后保存tab对应的key值
                                history.back()}}>
                            返回
                            </Button> : null}
                            <Button className="queryBtn" onClick={() => this.handleSave(this.props.isNew)} disabled={!this.props.orgInfo.modifyEnable || orgState} >保存</Button>
                        {/* </Col> */}
                        <Col span={9}/>
                      </Row>
                    <PersonModal
                        getDutieInfo={this.getDutieInfo}
                        dutieCounts={this.state.dutieCounts}
                        orgId={this.props.orgInfo.id}
                        memberData={this.state.memberData}
                        wrappedRef={e => {
                            this.PersonModal = e;
                        }}
                    />  
                </Spin>
            </div >
        )
    }

}
export default DetailEdit;

