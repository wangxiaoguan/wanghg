import React, { Component } from 'react';
import { Button, Select, Form, Input, Row, Col, Spin, message, DatePicker, InputNumber, Radio } from 'antd';
// import PersonModal from './PersonModal'
import { getService, postService, GetQueryString } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import './index.less';
import moment from 'moment'
const { TextArea } = Input;
const RadioGroup = Radio.Group

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
            // memberData: {},
            // memberList: [],
            // needReLoad: true,
            // roleList: [],
            // changeDate: null,
            isback:GetQueryString(location.hash, ['back']).back || '',
            // dutieCounts: {},
            nickName: this.props.orgInfo.nickName
        }
        this.props = props
        // this.roleList = []
        // this.memberData = {}
    }
    
    componentWillMount() {
        // this.requestMemberData(this.props.orgInfo.id)
        // console.log(123)
        // this.requestRoleList()
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
    }
    initProps(props, inited = true) {
        if (props.wrappedRef) {
            props.wrappedRef(this);
        }
    }
    handleSave(isNew) {
        this.props.form.validateFields((err,values) => {
            if(err) {
                // message.error('组织名称不能为空')
                return
            } 
            if (isNew) {
                this.requestDetailNew()
            } else {
                this.requestDetailSave()
            }
        })
    }

    requestDetailSave() {
        const { form: { validateFields } } = this.props
        validateFields((err, values) => {
            if (err) return
            this.setState({ loadingData: true })
            postService(
                API_PREFIX + `services/web/company/org/updateCompanyOrg`,
                {
                    "id": this.props.orgInfo.id,
                    ...values,
                    // "name": values.name,
                    "fullName": this.props.orgInfo.fullname + '>' + values.name,
                    // "instruction": values.instruction,
                    // "partyOrganizationState": this.props.orgInfo.enable ? "1" : "0",
                    // "sortid": this.props.orgInfo.sortid
                }, (res) => {
                    if (res.status === 1) {
                        message.success('保存成功')
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
                API_PREFIX + `servicesservices/web/company/org/addSubCompanyOrg`,
                {
                    "parent": this.props.orgInfo.id,
                    // "treepath": this.props.orgInfo.treepath,
                    "name": values.name,
                    // "fullname": this.props.orgInfo.fullname + '>' + values.name,
                    "instruction": values.instruction,
                    "organizationState": "1"
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
    nickNameChange = (e) => {
        this.setState({nickName: e.target.value})
    }
    validatorNickName = (rule, value, callback) => {
        let orgList = this.props.parentNode && this.props.parentNode.subCompanyOrgList
        let id = this.props.orgInfo.id
        let flag = false
        for(var i = 0; i < orgList.length; i++) {
            if(value && value == orgList[i].nickName && id != orgList[i].id) {
                flag = true
                break
            }
        }
        if(value && /^[\s]*$/.test(value)) {
            callback('部门别名不能全部为空格!')
        }else if(flag) {
            callback('同级下存在相同的部门别名!')
        }else {
            callback()
        }
    }
    render() {
        // console.log('orgInfo', this.props.orgInfo)
        console.log('名字改变了11111111111111111111111111', this.state.nickName)
        const FormItem = Form.Item;
        const Option = Select.Option;
        const {
            form: { getFieldDecorator },
        } = this.props
        const orgState = !this.props.orgInfo.enable
        return (
            <div style={{ width: '100%', marginTop: 20 }}>
                <Spin spinning={false}>
                    <Form >
                        <Row>
                            <Col span={22}>

                                <FormItem label="部门名称" {...formItemLayout}>
                                    <Row>
                                        <Col span={17}>
                                            {getFieldDecorator('name', {
                                                initialValue: this.props.isNew ? "" : this.props.orgInfo.name,
                                                rules: [{ required: true, whitespace: true, message: '请输入部门名称' }],
                                            })(
                                                <Input placeholder="请输入部门名称" disabled={!this.props.orgInfo.modifyEnable || this.props.orgInfo.parentid == -1 || orgState} />
                                            )}
                                        </Col>
                                    </Row>
                                </FormItem>

                            </Col>
                        </Row>
                        {/* <Row>
                            <Col span={22}>
                                <FormItem label="显示顺序" {...formItemLayout}>
                                    <Row>
                                        <Col span={17}>
                                            {getFieldDecorator('showIndex', {
                                                initialValue: this.props.isNew ? "" : this.props.orgInfo.showIndex,
                                            })(
                                                <InputNumber disabled={!this.props.orgInfo.modifyEnable || orgState} />
                                            )}
                                        </Col>
                                    </Row>
                                </FormItem>

                            </Col>
                        </Row> */}
                        <Row>
                            <Col span={22}>
                                <FormItem label="部门别名" {...formItemLayout}>
                                    <Row>
                                        <Col span={17}>
                                            {getFieldDecorator('nickName', {
                                                initialValue: this.props.isNew ? "" : this.props.orgInfo.nickName,
                                                rules: [{ 
                                                    required: false,
                                                    whitespace: true, 
                                                    // message: '部门别名不能为空格', 
                                                    validator: (rule, value, callback) =>this.validatorNickName(rule, value, callback), }],
                                            })(
                                                <Input onChange={this.nickNameChange} disabled={!this.props.orgInfo.modifyEnable || orgState} />
                                            )}
                                        </Col>
                                    </Row>
                                </FormItem>

                            </Col>
                        </Row>
                        <Row>
                            <Col span={22}>
                                <FormItem label="是否启用别名" {...formItemLayout}>
                                    <Row>
                                        <Col span={17}>
                                            {getFieldDecorator('isEnable', {
                                                initialValue: !this.state.nickName ? false : this.props.isNew ? "" : this.props.orgInfo.isEnable,
                                            })(
                                                <RadioGroup
                                                disabled={!this.state.nickName || !this.props.orgInfo.modifyEnable || orgState}
                                                options={[{ label: '是', value: true },{ label: '否', value: false },]}
                                              />
                                            )}
                                        </Col>
                                    </Row>
                                </FormItem>

                            </Col>
                        </Row>
                        <Row>
                            <Col span={22}>
                                <FormItem label="部门说明" {...formItemLayout}>
                                    <Row>
                                        <Col span={17}>
                                            {getFieldDecorator('instruction', {
                                                initialValue: this.props.isNew ? "" : this.props.orgInfo.instruction,
                                                rules: [{ required: false, message: '请输入部门说明' }],
                                            })(
                                                <TextArea disabled={!this.props.orgInfo.modifyEnable || orgState} />
                                            )}
                                        </Col>
                                    </Row>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={22}>
                                <FormItem label="部门状态" {...formItemLayout}>
                                    <Row>
                                        <Col span={17}>
                                            {getFieldDecorator('organizationState', {
                                                initialValue: this.props.isNew ? "true" : `${this.props.orgInfo.organizationState}`,
                                                rules: [{ required: false, message: '请选择部门状态' }],
                                            })(
                                                <Select showArrow={false} disabled >
                                                    <Option value='1'>启用</Option>
                                                    <Option value='0'>停用</Option>
                                                </Select>
                                            )}
                                        </Col>
                                    </Row>
                                </FormItem>
                            </Col>
                        </Row>
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
                </Spin>
            </div >
        )
    }

}
export default DetailEdit;

