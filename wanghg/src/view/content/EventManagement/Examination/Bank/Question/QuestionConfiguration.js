import React, { Component } from 'react';
import { Button, Form, Input, Select, Row, Col, Message, Modal, Radio, Checkbox } from 'antd';
import { GetQueryString, postService, getService } from '../../../../myFetch';
import API_PREFIX from '../../../../apiprefix';
import RichText from '../../../../../component/richTexteditor/editor';
import { connect } from 'react-redux';
import './Configuration.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
@connect(
  state => ({
    editorData: state.editor.editorData,
  }),
)
@Form.create()
export default class QuestionsConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteItem: { key: '' },
      visible: false,
      FieldRequriedOption: [],
      FieldTypeOption: [],
      typeValue: 1,
      inputNum: 4,
      inputOption: [{ key: 0, value: '' }, { key: 1, value: '' }, { key: 2, value: '' }, { key: 3, value: '' }],
      inputValue: [{ isanswer: 0 }, { isanswer: 0 }, { isanswer: 0 }, { isanswer: 0 }],
      isEdit: eval(GetQueryString(location.hash, ['isEdit', 'id']).isEdit) || false,
      id: GetQueryString(location.hash, ['isEdit', 'id']).id || '',
      anserParse: '',
      answer: '',
      answerGroup: [],
      examDbId: GetQueryString(location.hash, ['examDbId']).examDbId || '',
    };
  }

  componentDidMount() {
    this.setState({
      FieldTypeOption: [{
        key: 1, value: '单选',
      }, {
        key: 2, value: '多选',
      }],
    });

    // console.log('isEdit==>',this.state.isEdit)
    // console.log('examDbId==>',this.state.examDbId)

    if (this.state.isEdit) {
      getService(API_PREFIX + `services/activity/examTopic/info/${this.state.id}`, data => {
        console.log('data12==>', data)
        if (data.retCode === 1) {
          let value = data.root;
          this.props.form.setFieldsValue({ title: value.title, type: value.type, anserParse: value.anserParse });
          let inputValue = [];
          let inputOption = [];
          let answerGroup = [];
          value.options && value.options.map((item, index) => {
            inputOption.push({ key: index, value: '' });
            inputValue.push({
              content: item.content,
              id: item.id,
              isanswer: item.isanswer,
            });
            if (value.type === 1) {
              if (item.isanswer === 1) {
                this.setState({ answer: index });
              }
            } else {
              if (item.isanswer === 1) {
                answerGroup.push(index);
              }
            }
          });
          this.setState({ answerGroup, typeValue: value.type, inputValue, inputOption, inputNum: value.options.length, anserParse: value.anserParse }, () => {
            value.options.map((item, index) => {
              this.props.form.setFieldsValue({
                ['option' + `${index}`]: item.content,
              });
            });
          });
          // }
        } else {
          Message.error('获取数据失败');
        }
      });
    }
  }

  delete = (item) => {
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
  }

  isModal = (item) => {
    if (this.state.isEdit) {
      this.setState({ visible: true, deleteItem: item });
    } else {
      this.delete(item);
    }
  }
  getOption = (option) => {
    return option.map((item, index) => {
      return <Option key={index} value={item.key}>
        {item.value}
      </Option>;
    });
  }
  RadioChange = (e) => {
    const { inputValue } = this.state;
    inputValue.map((item, index) => {
      if (index === e.target.value) {
        item.isanswer = 1;
      } else {
        item.isanswer = 0;
      }
    });
    console.log('value', e.target.value);
    this.setState({ inputValue, answer: e.target.value });
  }
  CheckboxChange = (value) => {
    const { inputValue } = this.state;
    console.log('多选', value);
    inputValue.map((item, index) => {
      if (value.length === 0) {
        item.isanswer = 0;
      } else {
        for (const iterator of value) {
          if (index === iterator) {
            item.isanswer = 1;
            break;
          } else {
            item.isanswer = 0;
          }
        }
      }
    });
    this.setState({ inputValue, answerGroup: value });
  }

  //保存事件
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue, ...{ options: [] },
        };
        console.log('提交', values);
        this.state.inputValue.map(item => {
          values['options'].push(item);
        });
        values['anserParse'] = this.props.editorData;

        console.log('this.state.isEdit===>', this.state.isEdit)
        console.log('values', values)

        // 判断开始
        var answerNum = 0
        values['options'].map(v => {
          if (v.isanswer === 1) {
            answerNum += 1
          }
        })

        //判断结束
        if (this.state.isEdit) {
          if (values['type'] === 1) {
            if (answerNum > 0) {
              let body = {
                id: this.state.id,
                title: values['title'],
                type: values['type'],
                required: values['required'],
                options: values['options'],
                anserParse: values['anserParse'],
              };
              postService(API_PREFIX + 'services/activity/examTopic/update', body, data => {
                if (data.retCode === 1) {
                  Message.success('修改成功');
                  history.back();
                }
              });
            } else {
              Message.warning('答案有且只能选择一项！');
            }
          } else {
            if (answerNum > 1) {
              let body = {
                id: this.state.id,
                title: values['title'],
                type: values['type'],
                required: values['required'],
                options: values['options'],
                anserParse: values['anserParse'],
              };
              postService(API_PREFIX + 'services/activity/examTopic/update', body, data => {
                if (data.retCode === 1) {
                  Message.success('修改成功');
                  history.back();
                }
              });
            } else {
              Message.warning('答案至少选择二项！');
            }
          }
        } else {
          if (values['type'] === 1) {
            if (answerNum > 0) {
              let body = {
                title: values['title'],
                type: values['type'],
                options: values['options'],
                anserParse: values['anserParse'],
                examDbId: this.state.examDbId,
              };
              postService(API_PREFIX + 'services/activity/examTopic/insert', body, data => {
                if (data.retCode === 1) {
                  Message.success('新增成功');
                  history.back();
                }
              });
            } else {
              Message.warning('答案有且只能选择一项！');
            }
          } else {
            if (answerNum > 1) {
              let body = {
                title: values['title'],
                type: values['type'],
                options: values['options'],
                anserParse: values['anserParse'],
                examDbId: this.state.examDbId,
              };
              postService(API_PREFIX + 'services/activity/examTopic/insert', body, data => {
                if (data.retCode === 1) {
                  Message.success('新增成功');
                  history.back();
                }
              });
            } else {
              Message.warning('答案至少选择二项！');
            }
          }
        }
      }
    });
  };

  handleChange(e, index) {
    const { inputValue, answer, answerGroup, typeValue } = this.state;
    console.log('aaa', answerGroup);
    let isanswer = typeValue === 1 ? (answer === index ? 1 : 0) : answerGroup.indexOf(index) > -1 ? 1 : 0;
    inputValue[index] = this.state.isEdit ? { content: e.target.value, isanswer } : { content: e.target.value, isanswer };
    this.setState({ inputValue });
  }

  add = () => {
    let inputOption = [];
    for (let index = 0; index <= this.state.inputNum; index++) {
      inputOption.push(
        { key: index, value: '' }
      );
    }
    this.setState({ inputOption, inputNum: this.state.inputNum + 1 });
  };

  render() {
    const { inputOption, inputValue, FieldTypeOption } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 15 } };
    const formItemLayout1 = { labelCol: { span: 4 }, wrapperCol: { span: 18 } };
    return <div className="configuration-main">
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="题目名称">
          {getFieldDecorator('title', {
            initialValue: '',
            rules: [
              { required: true, whitespace: true, message: '必填项' },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout1} label="题目类型">
          {getFieldDecorator('type', {
            initialValue: 1,
            rules: [
              { type: 'number', required: true, whitespace: true, message: '必填项' },
            ],
          })(<Select getPopupContainer={trigger => trigger.parentNode} onChange={value => this.setState(
            {
              typeValue: value,
              answer: '',
              answerGroup: [],
            }
          )}>
            {this.getOption(FieldTypeOption)}
          </Select>)}
        </FormItem>

        <Row className="ant-form-item" style={{ marginBottom: '0px' }}>
          <Col span={4} className="ant-form-item-label">
            <label>
              <span className="ant-form-item-required">题目选项</span>
            </label>
          </Col>
          <Col span={15}>
            {this.state.typeValue === 1 ?
              <RadioGroup onChange={this.RadioChange} value={this.state.answer}>
                {inputOption.map(item => {
                  return <div key={item.key} style={{ display: 'flex', flexDirection: 'row' }}>
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
                      })(<Input onChange={e => this.handleChange(e, item.key)} />)}
                    </FormItem>
                    <Radio style={{ marginTop: '6px', marginLeft: '10px' }} value={item.key}>答案</Radio>
                    <Button className="deleteBtn" onClick={() => this.isModal(item)} style={{ margin: '1px 0 0 6px' }}>
                      删除
                    </Button>
                  </div>;
                })}
              </RadioGroup>
              :
              <CheckboxGroup onChange={this.CheckboxChange} value={this.state.answerGroup}>
                {inputOption.map(item => {
                  return <div key={item.key} style={{ display: 'flex', flexDirection: 'row' }}>
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
                      })(<Input onChange={e => this.handleChange(e, item.key)} />)}
                    </FormItem>
                    <Checkbox value={item.key}>答案</Checkbox>
                    <Button onClick={() => this.isModal(item)} style={{ margin: '6px 0 0 6px' }}>
                      删除
                    </Button>
                  </div>;
                })}
              </CheckboxGroup>
            }
          </Col>
        </Row>

        <Button onClick={this.add} className="resetBtn" style={{ display: 'block', marginLeft: '172px', marginBottom: '15px' }}>
          添加选项
        </Button>

        {/* 富文本区域 */}
        <FormItem {...formItemLayout1} label="答案解析">
          {getFieldDecorator('anserParse', {
            initialValue: '',
          })(<RichText initialValue={this.state.anserParse} />)}
        </FormItem>


        <Button type="primary" style={{ marginLeft: '275px', marginBottom: '130px' }} className="resetBtn" onClick={() => history.back()}>
          返回
        </Button>
        <Button type="primary" className="queryBtn" htmlType="submit">
          保存
        </Button>
      </Form>

      {/* 弹窗提示 */}
      <Modal className="modal" title="警告" maskClosable={false} visible={this.state.visible} onOk={() => this.delete(this.state.deleteItem)} onCancel={() => this.setState(
        { visible: false }
      )} key={'warningModal'} destroyOnClose={true}>
        确定删除?
      </Modal>
    </div>;
  }
}