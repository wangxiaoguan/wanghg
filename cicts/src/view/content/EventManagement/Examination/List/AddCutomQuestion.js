import React, { Component } from 'react';
import { Button, Form, Input, Select, Row, Col, Message, Modal, Radio, Checkbox, InputNumber } from 'antd';
import { GetQueryString, postService, getService } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
// import RichText from '../../../../component/richTexteditor/editor';
import RichText from '../../../../component/richTexteditor/braftEditor';
import { connect } from 'react-redux';
import './AddCutomQuestion.less';
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
export default class AddCustomQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteItem: { key: '' },
      visible: false,
      FieldRequriedOption: [],
      FieldTypeOption: [],
      typeValue: 1,
      inputNum: 4,
      inputOption: [{ key: 0, value: ''}, { key: 1, value: ''}, { key: 2, value: ''}, { key: 3, value: ''}],
      inputValue: [{ isanswer: 0 }, { isanswer: 0 }, { isanswer: 0 }, { isanswer: 0 }],
      isEdit: eval(GetQueryString(location.hash, ['isEdit', 'id']).isEdit) || false,
      id: GetQueryString(location.hash, ['isEdit', 'id']).id || '',
      topicId: GetQueryString(location.hash, ['topicId']).topicId || '',
      activityId:GetQueryString(location.hash, ['activityId']).activityId || '',
      isOptionOrder:GetQueryString(location.hash, ['isOptionOrder']).isOptionOrder || '',
      anserParse: '',
      answer: '',
      answerGroup: [],
      editorData: this.props.editorData,
      learnTime: 0,
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
    if (this.state.isEdit) {
      getService(API_PREFIX + `services/activity/examActivity/getActivityET/${this.state.topicId}`, data => {
        if (data.status === 1) {
          let value = data.root;
          this.props.form.setFieldsValue({
            title: value.examTopic.title,
            type: value.examTopic.type,
            anserParse: value.examTopic.anserParse,
            showIndex: value.showIndex,
          });
          let inputValue = [];
          let inputOption = [];
          let answerGroup = [];
          let optionS;
          if(value.examTopic.options){
            optionS=value.examTopic.options;
            if(this.state.isOptionOrder==='true'){
                optionS.sort(function(a, b){
                return a.number - b.number;
              });
            }
          }
          
          optionS.map((item, index) => {
            inputOption.push({ key: index, value: '' });
            inputValue.push({
              content: item.content,
              id: item.id,
              isanswer: item.isanswer,
              number:item.number,
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

          this.setState({ answerGroup, typeValue: value.type, inputValue, inputOption, inputNum: value.examTopic.options.length, anserParse: value.examTopic.anserParse }, () => {
            optionS.map((item, index) => {
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
  componentDidUpdate(){
    if (this.props.editorData !== this.state.editorData) {
      this.setState({ editorData: this.props.editorData, anserParse: this.props.editorData});
      this.props.form.setFieldsValue({ 'anserParse': this.props.editorData});
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
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue, ...{ options: [] },
        };
        console.log('提交', values);
        
        this.state.inputValue.map((item,index) => {
          item.number=index+1;
          values['options'].push(item);
        });
        //values['anserParse'] = this.props.editorData;
        
        //判断重复选项
        let ops=[];
        values.options.map(v=>{
          ops.push(v.content);
        });

        let opsN=Array.from(new Set(ops));
        console.log(opsN);
        if(opsN.length<values.options.length){
          Message.error('题目选项不可重复');
          return;
        }
        if(values['type']===1){
          let danIndex=0;
          values['options'].map(c=>{
            if(c.isanswer===1){
              danIndex+=1;
            }
          });
          if(danIndex===0){
            Message.success('请设置答案！');
            return false;
          }
        }else{
          let danIndex=0;
          values['options'].map(o=>{
            if(o.isanswer===1){
              danIndex+=1;
            }
          });
          if(danIndex<2){
            Message.success('至少包含两项答案！');
            return false;
          }
        }

        if (this.state.isEdit) {
          let body = {
            id: this.state.id,
            showIndex: values['showIndex'],
            examTopic:{
              id: this.state.topicId,
              options: values['options'],
              anserParse: values['anserParse'],
              title: values['title'],
              type: values['type'],
              showIndex: values['showIndex'],
            },
           
          };
          postService(API_PREFIX + 'services/activity/examActivity/updateActivityET', body, data => {
            if (data.status === 1) {
              Message.success('修改成功');
              history.back();
            }
          });

        } else {
          let body = {         
            activityId:this.state.activityId,
            title: values['title'],
            type: values['type'],
            options: values['options'],
            anserParse: values['anserParse'],
            showIndex:values['showIndex'],
          };
          postService(API_PREFIX + 'services/activity/examActivity/insertActivityET', body, data => {
            if (data.status === 1) {
              Message.success('新增成功');
              history.back();
            }else{
              Message.success(data.errorMsg); 
            }
          });
        }
      }
    });
  };
  handleChange(e, index,item) {
    console.log(e,index,item);
    const { inputValue, answer, answerGroup, typeValue } = this.state;
    console.log('aaa', answerGroup);
    let isanswer = typeValue === 1 ? (answer === index ? 1 : 0) : answerGroup.indexOf(index) > -1 ? 1 : 0;
    inputValue[index] = this.state.isEdit ?item.new===1?{content: e.target.value, isanswer} : { content: e.target.value, id: this.state.activityId, isanswer } : { content: e.target.value, isanswer };
    this.setState({ inputValue });
  }
  add = () => {
    // // let inputOption = [];  
    // let { inputOption } =this.state
    // // for (let index = 0; index <= this.state.inputNum; index++) {
    // //   inputOption.push(
    // //     { key: index, value: ''}
    // //   );
    // // }
    // inputOption.push({ key: this.state.inputNum, value: '',new:1})
    // inputOption.map((v,o)=>{
    //   if(v.new===1){
    //     v.new=1
    //   }
    // })
    // console.log(inputOption)
    // this.setState({ inputOption, inputNum: this.state.inputNum + 1 });
    //2018.12.25 王康俊杰 新增选项数量限制
    let inputOption = [];
    for (let index = 0; index <= this.state.inputNum; index++) {
      inputOption.push({ key: index, id:0 , value: '' });
    }
    if(inputOption.length>6){
      inputOption.splice(this.state.inputNum,1);
      Message.error('题目选项最多只能设置6项');
      console.log(inputOption);
      return;
    }
    
    this.setState({ inputOption, inputNum: this.state.inputNum + 1 });
  };
    //学习内容字数120字为一分钟
    wordCount = (value) => {//xwx2019/1/2
      console.log('value', value.length - 7);
      this.setState({ learnTime: Math.ceil((value.length - 7) / 120) });
    }
  render() {
    const { inputOption, inputValue, FieldTypeOption } = this.state;
    console.log('inputValue', inputValue);

    const {
      form: { getFieldDecorator },
    } = this.props;
    console.log('anser',this.state.anserParse);
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
        <FormItem {...formItemLayout} label="题目类型">
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
        <FormItem {...formItemLayout} label="显示顺序">
          {getFieldDecorator('showIndex', {
            initialValue: 0,
            rules: [
              { type: 'number', required: true, whitespace: true, message: '必填项,且必须为数字！' },
            ],
          })(<InputNumber min={0}/>)}
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
                      })(<Input onChange={e => this.handleChange(e, item.key,item)} />)}
                    </FormItem>
                    <Radio style={{marginTop:'6px',marginLeft:'10px'}} value={item.key}>答案</Radio>
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
                      })(<Input onChange={e => this.handleChange(e, item.key,item)} />)}
                    </FormItem>
                    <Checkbox value={item.key} className="questionsCheckbox">答案</Checkbox>
                    <Button className="deleteBtn" onClick={() => this.isModal(item)} style={{ margin: '6px 0 0 6px' }}>
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
        <FormItem {...formItemLayout1} label="答案解析">
          {getFieldDecorator('anserParse', {
            initialValue: '',
          })(<RichText wordCount={this.wordCount.bind(this)} initialValue={this.state.anserParse} />)}
        </FormItem>
        <Row style={{textAlign:'center',marginBottom:'20px'}}>
          <Button type="primary" style={{marginLeft:'0px'}} className="resetBtn" onClick={() => history.back()}>
          返回
          </Button>
          {
            GetQueryString(location.hash, ['questionOnline']).questionOnline=='questionOnline'?null:
            <Button type="primary" className="queryBtn" htmlType="submit">
            保存
            </Button>
          }
        </Row>
      </Form>
      <Modal className="modal" title="警告" maskClosable={false} visible={this.state.visible} onOk={() => this.delete(this.state.deleteItem)} onCancel={() => this.setState(
        { visible: false }
      )} key={'warningModal'} destroyOnClose={true}>
        确定删除?
      </Modal>
    </div>;
  }
}