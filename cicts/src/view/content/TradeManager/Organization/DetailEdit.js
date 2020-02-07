import React, { Component } from 'react';
import { Button, Select, Form, Input, Row, Col, Spin, message } from 'antd';
import PersonModal from './PersonModal'
import { getService, postService,GetQueryString } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import './index.less';
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
            isBack: GetQueryString(location.hash, ['back']).back || null,
        }
        this.props = props
        this.roleList = []
        this.memberData = {}
    }

    componentWillMount() {
        // this.requestMemberData(this.props.orgInfo.id)
        // console.log(123)
        this.requestRoleList()
        // console.log(666)
    }

    componentDidMount() {
        // console.log(999)
        this.initProps(this.props, true);
        this.requestMemberData(this.props.orgInfo.id)
    }


    componentWillReceiveProps(nextProps) {
        this.initProps(nextProps, true);
        // this.requestMemberData(this.props.orgInfo.id)
        // console.log('init')
        // this.setState({
        //     needReLoad: !this.state.needReLoad
        // })
    }
    initProps(props, inited = true) {
        if (props.wrappedRef) {
            props.wrappedRef(this);
        }
    }

    requestMemberData(id) {
        this.setState({ loadingData: true })
        getService(API_PREFIX + 'services/web/union/org/getPostByOrgId/' + `${id}`, (res) => {
            //console.log(JSON.stringify(res))
            if (res.status === 1) {
                const list = res.root.object
                // var memberData = this.memberData
                var memberData = JSON.parse(JSON.stringify(this.memberData))
                for (var i = 0; i < list.length; i++) {
                    memberData[`${list[i].postId}`].push(list[i])
                }
                this.setState({ memberList: null })
                this.setState({
                    memberData: memberData,
                    memberList: list,
                })
                // console.log(JSON.stringify(memberData))
                // console.log(JSON.stringify(this.state))
            } else {
                message.error(res.errorMsg);
            }
            this.setState({ loadingData: false })
        });
    }

    requestRoleList() {
        getService(API_PREFIX + 'services/web/union/user/getUnionUserPost', (data) => {
            // console.log(JSON.stringify(res))
            // this.roleList = res
            var memberData = {}
            if(data.status === 1) {
                let res = data.root.object
                for (var i = 0; i < res.length; i++) {
                    const role = res[i]
                    memberData[`${role.id}`] = []
                }
                this.setState({
                    roleList: res,
                    memberData: memberData,
                })
                this.memberData = memberData
            }else {
                message.error(data.errorMsg)
            }
            // console.log(JSON.stringify(memberData))
            // if (res.retCode === 1) {
            //     // console.log(JSON.stringify(res))

            // }
        });
    }

    requestDelMember(userId, postid) {
        console.log('111111111111111111111111111111111111', userId, postid)
        console.log('22222222222222222222222222222222', [{
            "unionId": this.props.orgInfo.id,
            "unionUserId": userId,
            "postId": postid
        }])
        postService(
            API_PREFIX + `services/web/union/org/deleteUserPost`,
            [{
                "unionId": this.props.orgInfo.id,
                "unionUserId": userId,
                "postId": postid
            }]);
    }

    handleSave(isNew) {
        if (isNew) {
            this.requestDetailNew()
        } else {
            this.requestDetailSave()
        }
    }

    requestDetailSave() {
        const { form: { validateFields } } = this.props
        validateFields((err, values) => {
            if (err) return
            this.setState({ loadingData: true })
            postService(
                API_PREFIX + `services/web/union/org/update`,
                {
                    "id": this.props.orgInfo.id,
                    "name": values.name,
                    "fullName": this.props.orgInfo.fullname + '>' + values.name,
                    "instruction": values.instruction,
                    "orgState": this.props.orgInfo.enable ? "1" : "0",
                    "parentId": this.props.orgInfo.parentid
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

    requestDetailNew() {
        const { form: { validateFields } } = this.props
        validateFields((err, values) => {
            if (err) return
            this.setState({ loadingData: true });    
            postService(
                API_PREFIX + `services/web/union/org/insertOrgPost`,
                {
                    "parentId": this.props.orgInfo.parentid,
                    "treePath": this.props.orgInfo.treepath,
                    "name": values.name,
                    "fullName": this.props.orgInfo.fullname + '>' + values.name,
                    "instruction": values.instruction,
                    "orgState": "1"
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

    handleDel(value, postid) {
        //console.log(JSON.stringify(value))
        const list = this.state.memberList
        // console.log(JSON.stringify(list))
        // console.log(JSON.stringify())
        var userDelId = []
        list.map((user) => { if (user.userName === value) userDelId.push(user['unionUserId']) })
        this.requestDelMember(userDelId[0], postid)
    }

    render() {
        // console.log('orgInfo', this.props.orgInfo)
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {
            form: { getFieldDecorator },
        } = this.props
        const memberData = this.state.memberData
        const orgState = !this.props.orgInfo.enable
        const tableModalShow = (postid) => {
            this.PersonModal.show(postid)
        }
        const reloadMember = () => {
            this.requestMemberData(this.props.orgInfo.id)
        }
        const roleSelect = [];
console.log("wwww",this.state.roleList);

        for (var i = 0; i < this.state.roleList.length; i++) {
            const role = this.state.roleList[i]
            roleSelect.push(
                <Row key={i + ''}>
                    <Col span={22}>
                        {/* <Form > */}
                        <FormItem label={role.desp} {...formItemLayout}>
                            <Row>
                                <Col span={17}>
                                    {getFieldDecorator(`${role.id}`, {
                                        initialValue: memberData[`${role.id}`].map((user) => { return user.userName }),
                                        rules: [{ required: false, message: '请指定工会主席' }],
                                    })(
                                        <Select
                                            mode="multiple"
                                            notFoundContent="点击选择人员添加"
                                            open={false}
                                            onDeselect={(value) => {
                                                this.handleDel(value, role.id)
                                            }}
                                            disabled={!this.props.orgInfo.modifyEnable || orgState}
                                        >
                                            {memberData[`${role.id}`].map((user) => { return <Option key={user.unionUserId}>{user.userName}</Option> })}
                                        </Select>
                                    )}

                                </Col>
                                <Col span={1} />
                                <Col span={4}>
                                    <Button  className="queryBtn1" style={{backgroundColor:'#fff',color:'rgb(146, 149, 165)',borderRadius:16,border:'1px solid rgb(146, 149, 165)'}}
                                     onClick={() => tableModalShow(`${role.id}`)} disabled={!this.props.orgInfo.modifyEnable || orgState} >选择人员</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Col>
                </Row>
            )
        }
        return (
            <div style={{ width: '100%', marginTop: 20 }}>
                <Spin spinning={this.state.loadingData}>
                    <Form >
                        <Row>
                            <Col span={22}>

                                <FormItem label="工会名称" {...formItemLayout}>
                                    <Row>
                                        <Col span={17}>
                                            {getFieldDecorator('name', {
                                                initialValue: this.props.isNew ? "" : this.props.orgInfo.name,
                                                rules: [{ required: true, message: '请输入工会名称' }],
                                            })(
                                                <Input placeholder="请输入工会名称" disabled={!this.props.orgInfo.modifyEnable || this.props.orgInfo.id === this.props.orgInfo.parentid || orgState} />
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
                                                // rules: [{ required: true, message: '请输入组织说明' }],
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
                                <FormItem label="组织状态" {...formItemLayout}>
                                    <Row>
                                        <Col span={17}>
                                            {getFieldDecorator('selectAble', {
                                                initialValue: this.props.isNew ? "true" : `${this.props.orgInfo.enable}`,
                                                rules: [{ required: false, message: '请选择组织状态' }],
                                            })(
                                                <Select showArrow={false} disabled >
                                                    <Option key="true" value='true'>启用</Option>
                                                    <Option key="false" value='false'>停用</Option>
                                                </Select>
                                            )}
                                        </Col>
                                    </Row>
                                </FormItem>
                            </Col>
                        </Row>
                        {this.state.memberList !== null ? roleSelect : <div />}
                    </Form>
                    <Row>
                        <Col span={24} style={{textAlign: 'center'}} >
                        {this.state.isBack === '1' ? 
                            <Button className="resetBtn" onClick={() => {sessionStorage.setItem('eventAndInfoKey', 1),history.back()}} >返回</Button>:null
                        }
                            <Button className="queryBtn" onClick={() => this.handleSave(this.props.isNew)} disabled={!this.props.orgInfo.modifyEnable || orgState} >保存</Button>
                        </Col>
                    </Row>
                    <PersonModal
                        orgId={this.props.orgInfo.id}
                        wrappedRef={e => {
                            this.PersonModal = e;
                        }}
                        successCallback={reloadMember}
                    />
                </Spin>
            </div >
        )
    }

}


export default DetailEdit

