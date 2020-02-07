import React, { Component } from 'react';
import { connect } from 'react-redux';
import { message, Select, Form, Input, InputNumber, Row, Col, Button, Modal } from 'antd';
import API_PREFIX from '../../apiprefix';
import { getService, postService, GetQueryString } from '../../myFetch';
import './addstyle.less';
const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;
@connect(
    state => ({ powers: state.powers })
)
@Form.create()
export default class CommonBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: GetQueryString(location.hash, ['id']).id || '',
            isEdit: GetQueryString(location.hash, ['isEdit']).isEdit || '',
            editData: {},//编辑数据回显
        };
    }

    componentDidMount() {
        if (this.state.isEdit === 'true') {//编辑
            getService(API_PREFIX + `services/web/bbs/topic/getList/1/1?Q=id=${this.state.id}`, data => {
                if (data.status === 1) {
                    this.setState({ editData: data.root.list[0] });
                } else {
                    message.error(data.errorMsg);
                }
            });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let body = { ...values };
                if (body.isShow === 'true') {
                    body.isShow = true;
                } else {
                    body.isShow = false;
                }
                if (this.state.isEdit === 'true') {//编辑
                    body.id = this.state.editData.id;
                }
                postService(API_PREFIX + `services/web/bbs/topic/${this.state.isEdit === 'true' ? 'update' : 'insert'}`, body, res => {
                    if (res.status === 1) {
                        if (this.state.isEdit === 'true') {
                            message.success('修改成功');
                        } else {
                            message.success('保存成功');
                        }
                        location.hash = '/TradeManager/ForumManagation/ThemeManagation';
                    } else {
                        message.error(res.errorMsg);
                    }
                });
            }
        });
    }

    //删除主题
    showConfirm = () => {
        confirm({
            title: '你确定要删除该主题吗？',
            content: '点击‘确定’将直接删除，点击‘取消’则停留在当前页面',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            className: 'showConfirm',
            onOk() {//点击确定
                let body = [GetQueryString(location.hash, ['id']).id];
                postService(API_PREFIX + `services/web/bbs/topic/delete`, body, data => {
                    if (data.status === 1 && data.root && data.root.object !== '') {
                        message.success('删除成功');
                        location.hash = '/TradeManager/ForumManagation/ThemeManagation';
                    } else {
                        message.error(data.errorMsg);
                    }
                });
            },
        });
    }
    render() {
        const { powers = {} } = this.props;
        let detelePowers = powers && powers['20007.21702.004'];//删除
        const formItemLayout = {
            labelCol: {
                xs: { span: 14 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 14 },
                sm: { span: 8 },
            },
        };
        const { editData } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} style={{ marginTop: 50 }} className="editTheme">
                <FormItem {...formItemLayout} label="主题名称">
                    {
                        getFieldDecorator('name', {
                            rules: [{ 
                                required: true, 
                                whitespace: true,
                                validator: (rule, value, callback) => {
                                    if(value == '' || value == undefined) {
                                        callback('主题名称不能为空!')
                                    }else if(/^[\s]*$/.test(value)) {
                                        callback('主题名称不能全为空格!')
                                    }else {
                                        callback()
                                    }
                                }
                            }],
                            initialValue: editData.name ? editData.name : '',
                        })(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem {...formItemLayout} label="显示顺序">
                    {
                        getFieldDecorator('showIndex', {
                            rules: [
                                {
                                    required: true,
                                    //  message:'请输入显示顺序',
                                    validator: (rule, value, callback) => {
                                        if (value < 0) {
                                            callback('请勿输入负数');
                                        } else if (String(value).indexOf('.') != -1) {
                                            callback('请勿输入小数');
                                        } else if (isNaN(value) && value != undefined) {
                                            callback('请勿输入非数字');
                                        } else {
                                            callback();
                                        }
                                    }
                                }
                            ],
                            initialValue: editData.showIndex || editData.showIndex === 0 ? editData.showIndex : '',
                        })(
                            <InputNumber />
                        )
                    }
                </FormItem>
                <FormItem {...formItemLayout} label="是否显示">
                    {
                        getFieldDecorator('isShow', {
                            rules: [{ required: true, message: '请选择是否显示' }],
                            initialValue: editData.isShow !== undefined ? editData.isShow.toString() : 'true',
                        })(
                            <Select>
                                <Option value='true' >是</Option>
                                <Option value='false' >否</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem>
                    <Row style={{ textAlign: 'center' }}>
                        <Button className="resetBtn" onClick={() => location.hash = '/TradeManager/ForumManagation/ThemeManagation'}>返回</Button>
                        <Button className="queryBtn" type="primary" onClick={this.handleSubmit}>保存</Button>
                    </Row>
                    {
                        detelePowers ? (
                            this.state.isEdit === 'true' ? (
                                <Row>
                                    <Col className="dangerBtn">
                                        <Button className='deleteBtn' type='danger' onClick={this.showConfirm} >删除主题</Button>
                                    </Col>
                                </Row>
                            ) : null
                        ) : null
                    }
                </FormItem>
            </Form>
        );
    }
}
