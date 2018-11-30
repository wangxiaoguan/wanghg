import React, { Component } from 'react';
import { Button, Form, Input, Select, Row, Col, Message, Modal, Radio, Checkbox, InputNumber } from 'antd';
import { GetQueryString, postService, getService } from '../../../myFetch';
import API_PREFIX, { masterUrl } from '../../../apiprefix';
import RichText from '../../../../component/richTexteditor/editor';
import { connect } from 'react-redux';
import UploadPicture from '../../../../component/EventAndInfoAdd/uploadPic';
// const masterUrl = 'http://10.110.200.62:9080/';
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
@connect(state => ({
  uploadSpecial: state.uploadPicture.contentPictureData,
}))
@Form.create()
export default class QuestionsConfiguration extends Component {
  constructor(props) {
    super(props);
    this.isPush = true;
    this.state = {
      createDate: '',
      createUserId: '',
      deleteItem: { key: '' },
      visible: false,
      FieldTypeOption: [],
      questionTypeValue: 1,
      optionTypeValue: 1,
      inputNum: 4,
      inputOption: [
        { key: 0, value: '' },
        { key: 1, value: '' },
        { key: 2, value: '' },
        { key: 3, value: '' },
      ],
      inputValue: [
        { blank: false },
        { blank: false },
        { blank: false },
        { blank: false },
      ],
      isEdit: eval(GetQueryString(location.hash, ['isEdit']).isEdit) || false,
      id: GetQueryString(location.hash, ['isEdit', 'id']).id || '',
      activityId:
        GetQueryString(location.hash, ['activityId']).activityId || '',
      answer: '',
      answerGroup: [],
      optionType: [],
      isUpload: false,
      picValue: [],
      picOption:[],
    };
  }
  componentDidMount() {
    this.setState({
      FieldTypeOption: [
        {
          key: 1,
          value: '单选',
        },
        {
          key: 2,
          value: '多选',
        },
        {
          key: 3,
          value: '问答',
        },
      ],
      optionType: [
        {
          key: 1,
          value: '文字',
        }
      ],
    });
    if (this.state.isEdit) {
      getService(
        API_PREFIX + `services/activity/topic/info/${this.state.id}`,
        data => {
          if (data.retCode === 1) {
            let value = data.root;
            this.props.form.setFieldsValue({
              title: value.title,
              type: value.type,
              showIndex: value.showIndex,
              optionType: value.optionType,
            });
            let inputValue = [];
            let inputOption = [];
            let answerGroup = [];
            value.options &&
              value.options.map((item, index) => {
                inputOption.push({ key: index, value: '' });
                inputValue.push({
                  content: item.content,
                  id: item.id,
                  blank: item.blank,
                });
                if (item.blank === true) {
                  answerGroup.push(index);
                }
              });
            
            let option = value.options&&[...value.options];
            let temp = option && option.map((item,index) => {
              return item = { response: { entity: [{ filePath: item.url,fileName:item.url }] }, describe: item.desp1, id:index };
            });
            this.setState(
              {
                answerGroup,
                typeValue: value.type,
                inputValue,
                inputOption,
                inputNum: value.options ? value.options.length : 0,
                questionTypeValue: value.type,
                optionTypeValue: value.optionType ? value.optionType : 1,
                picValue: temp,
                createDate: value.createDate,
                createUserId: value.createUserId,
              },
              () => {
                if (value.optionType === 1) {
                  value.options &&
                    value.options.map((item, index) => {
                      this.props.form.setFieldsValue({
                        ['option' + `${index}`]: item.content,
                      });
                    });
                // }
                } else if (value.optionType === 2){
                  this.props.form.setFieldsValue({
                    picOption: temp,
                  });
                  this.setState({ picOption:temp});    //todo初始值
                  
                }
                this.props.form.setFieldsValue({
                  minItem: value.minItem,
                  maxItem: value.maxItem,
                  answerNum: value.answerNum,
                });
              }
            );
            // }
          } else {
            Message.error('获取数据失败');
          }
        }
      );
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (props.uploadSpecial !== state.uploadSpecial) {
      return { uploadSpecial: props.uploadSpecial, isUpload: true };
    }
    return null;
  }
  componentDidUpdate() {
    // let isPush = false;
    if (this.state.isUpload) {
      let data = this.props.uploadSpecial;
      let picOption = this.state.picOption;
      if(data.content){
        for (let index = 0; index < picOption.length; index++) {
          if (picOption[index]) {
            if (picOption[index].uid!==undefined) {
              if (data.content.uid === picOption[index].uid) {
                picOption[index] = data.content;
                this.isPush = false;
                break;
              } else {
                this.isPush = true;
              }
            }else if (picOption[index].id!==undefined) {
              if (data.key === picOption[index].id) {
                picOption[index] = data.content;
                this.isPush=false;
                break;
              } else {
                this.isPush=true;
              }
            } else {
              this.isPush = true;
            }
          }
          
        }
        if (this.isPush) {
          picOption.push(data.content);
        }
        this.setState({ isUpload: false,picOption });
        this.props.form.setFieldsValue({ picOption });
      }else{
        console.log('删除',data);
        picOption = picOption.filter(item=>item.id!==data.key);
        this.setState({ isUpload: false, picOption });
        this.props.form.setFieldsValue({ picOption });
      }
      
    }
  }
  delete = item => {
    console.log('item', item);
    const { inputOption, inputNum, inputValue } = this.state;
    if (inputNum === 2) {
      Message.error('请至少保留两个选项');
      return;
    }
    delete inputOption[item.key];
    delete inputValue[item.key];
    this.setState({
      inputOption,
      inputNum: inputNum - 1,
      inputValue,
      visible: false,
    });
  };
  isModal = item => {
    if (this.state.isEdit) {
      this.setState({ visible: true, deleteItem: item });
    } else {
      this.delete(item);
    }
  };
  getOption = option => {
    return option.map((item, index) => {
      return (
        <Option key={item.key} value={item.key}>
          {item.value}
        </Option>
      );
    });
  };
  CheckboxChange = value => {
    const { inputValue } = this.state;
    console.log('多选', value);
    inputValue.map((item, index) => {
      if (value.length === 0) {
        item.blank = false;
      } else {
        for (const iterator of value) {
          if (index === iterator) {
            item.blank = true;
            break;
          } else {
            item.blank = false;
          }
        }
      }
    });
    this.setState({ inputValue, answerGroup: value });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      console.log('提交前', fieldsValue);
      if (!err) {
        const values = {
          ...fieldsValue,
          ...{ options: [] },
        };
        console.log('提交', values);
        if (this.state.optionTypeValue == 1) {
          this.state.inputValue.map(item => {
            values['options'].push(item);
          });
        } else if (this.state.optionTypeValue == 2) {
          values['picOption'].map(item => {
            let isMasterUrl = item.response.entity[0].filePath.indexOf(masterUrl)>-1;
            values['options'].push({
              url: isMasterUrl ? item.response.entity[0].filePath:masterUrl + item.response.entity[0].filePath,
              desp1: item.describe,
            });
            // values['options'].url =
            //   masterUrl + item[0].response.entity[0].filePath;
            // values['options'].desp1 = item[0].describe;
          });
        }
        values['activityId'] = this.state.activityId;
        if (this.state.isEdit) {
          let body = {
            ...{ id: this.state.id },
            ...values,
            createDate: this.state.createDate,
            createUserId: this.state.createUserId,
          };
          postService(
            API_PREFIX + 'services/activity/topic/edit',
            body,
            data => {
              if (data.retCode === 1) {
                Message.success('修改成功');
                history.back();
              }
            }
          );
        } else {
          let body = {
            ...values,
          };
          postService(
            API_PREFIX + 'services/activity/topic/add',
            body,
            data => {
              if (data.retCode === 1) {
                Message.success('新增成功');
                history.back();
              }
            }
          );
        }
      }
    });
  };
  handleChange(e, index) {
    const { inputValue, answer, answerGroup, typeValue } = this.state;
    console.log('aaa', answerGroup);
    let blank =
      typeValue === 1
        ? answer === index
          ? 1
          : 0
        : answerGroup.indexOf(index) > -1
          ? true
          : false;
    inputValue[index] = { content: e.target.value, blank };
    this.setState({ inputValue });
  }
  add = () => {
    let inputOption = [];
    for (let index = 0; index <= this.state.inputNum; index++) {
      inputOption.push({ key: index, value: '' });
    }
    this.setState({ inputOption, inputNum: this.state.inputNum + 1 });
  };
  render() {
    const { inputOption, inputNum, FieldTypeOption, optionType, questionTypeValue, optionTypeValue } = this.state;
    console.log('questionTypeValue', this.state.questionTypeValue);
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 15 } };
    return (
      <div className="configuration-main">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="题目名称">
            {getFieldDecorator('title', {
              initialValue: '',
              rules: [{ required: true, whitespace: true, message: '必填项' }],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="显示顺序">
            {getFieldDecorator('showIndex', {
              initialValue: '',
              rules: [
                {
                  type: 'number',
                  required: true,
                  whitespace: true,
                  message: '必填项',
                },
              ],
            })(<InputNumber min={0} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="题目类型">
            {getFieldDecorator('type', {
              initialValue: 1,
              rules: [
                {
                  type: 'number',
                  required: true,
                  whitespace: true,
                  message: '必填项',
                },
              ],
            })(
              <Select
                getPopupContainer={trigger => trigger.parentNode}
                onChange={value =>
                  this.setState({
                    questionTypeValue: value,
                    answerGroup: [],
                  })
                }
              >
                {this.getOption(FieldTypeOption)}
              </Select>
            )}
          </FormItem>
          {questionTypeValue !== 3 ? (
            <div>
              <FormItem {...formItemLayout} label="选项类型">
                {getFieldDecorator('optionType', {
                  initialValue: 1,
                  rules: [
                    {
                      type: 'number',
                      required: true,
                      whitespace: true,
                      message: '必填项',
                    },
                  ],
                })(
                  <Select
                    getPopupContainer={trigger => trigger.parentNode}
                    onChange={value =>
                      this.setState({
                        optionTypeValue: value,
                        answerGroup: [],
                      })
                    }
                  >
                    {this.getOption(optionType)}
                  </Select>
                )}
              </FormItem>
              {optionTypeValue === 1 ? (
                <div>
                  <Row
                    className="ant-form-item"
                    style={{ marginBottom: '0px' }}
                  >
                    <Col span={4} className="ant-form-item-label">
                      <label>
                        <span className="ant-form-item-required">题目选项</span>
                      </label>
                    </Col>
                    <Col span={15}>
                      <CheckboxGroup
                        onChange={this.CheckboxChange}
                        value={this.state.answerGroup}
                      >
                        {inputOption.map(item => {
                          return (
                            <div
                              key={item.key}
                              style={{ display: 'flex', flexDirection: 'row' }}
                            >
                              <FormItem style={{ width: '100%' }}>
                                {getFieldDecorator('option' + item.key, {
                                  initialValue: item.value,
                                  rules: [
                                    {
                                      required: true,
                                      whitespace: true,
                                      message: '必填项',
                                    },
                                  ],
                                })(
                                  <Input
                                    onChange={e =>
                                      this.handleChange(e, item.key)
                                    }
                                  />
                                )}
                              </FormItem>
                              <Checkbox style={{width:'141px',marginTop:'7px',marginLeft: '20px'}} value={item.key}>可填空</Checkbox>
                              <Button
                                className="deleteBtn"
                                onClick={() => this.isModal(item)}
                                style={{ margin: '1px 0 0 6px' }}
                              >
                                删除
                              </Button>
                            </div>
                          );
                        })}
                      </CheckboxGroup>
                    </Col>
                  </Row>
                  <Button
                    className="resetBtn"
                    onClick={this.add}
                    style={{
                      display: 'block',
                      marginLeft: '207px',
                      marginBottom: '15px',
                    }}
                  >
                    添加选项
                  </Button>
                </div>
              ) : (
                <FormItem {...formItemLayout} label="题目选项">
                  {getFieldDecorator('picOption', {
                    rules: [
                      {
                        type: 'array',
                        required: true,
                        whitespace: true,
                        message: '必填项',
                      },
                    ],
                  })(
                    <UploadPicture
                      isIamge={true}
                      keys={'questionnaire'}
                      type={'uploadPicture_button'}
                      describe={true}
                      initialValue={this.state.picValue}
                    />
                  )}
                </FormItem>
              )}
              {questionTypeValue === 2 ? (
                <Row>
                  <Col span={10}>
                    <FormItem {...formItemLayout} label="最少选项">
                      {getFieldDecorator('minItem', {
                        initialValue: '',
                      })(<InputNumber min={1} max={inputNum}/>)}
                    </FormItem>
                  </Col>
                  <Col span={10}>
                    <FormItem {...formItemLayout} label="最多选项">
                      {getFieldDecorator('maxItem', {
                        initialValue: '',
                      })(<InputNumber min={1} max={inputNum} />)}
                    </FormItem>
                  </Col>
                </Row>
              ) : null}
            </div>
          ) : (
            <div>
              <FormItem {...formItemLayout} label="回答字数限制">
                {getFieldDecorator('answerNum', {
                  initialValue: '',
                  rules: [{ required: true, message:'回答字数限制为必填项' }],
                })(<InputNumber min={1} />)}
              </FormItem>
            </div>
          )}
          <Row style={{textAlign:'center'}}>
            <Button
              type="primary"
              style={{marginLeft:'0px',marginBottom: '30px' }}
              className="resetBtn"
              onClick={() => history.back()}
            >
            返回
            </Button>
            <Button type="primary" className="queryBtn" htmlType="submit">
            保存
            </Button>
          </Row>
        </Form>
        <Modal
          className="modal"
          title="警告"
          maskClosable={false}
          visible={this.state.visible}
          onOk={() => this.delete(this.state.deleteItem)}
          onCancel={() => this.setState({ visible: false })}
          key={'warningModal'}
          destroyOnClose={true}
        >
          确定删除?
        </Modal>
      </div>
    );
  }
}