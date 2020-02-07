import React, { Component } from 'react';
import { Button, Form, Input, Select, Row, Col, Message, Modal, Radio, Checkbox } from 'antd';
import { GetQueryString, postService, getService } from '../../../../myFetch';
import API_PREFIX from '../../../../apiprefix';
// import RichText from '../../../../../component/richTexteditor/editor';
import RichText from '../../../../../component/richTexteditor/braftEditor';
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
      inputValue: [{ isAnswer: 0 }, { isAnswer: 0 }, { isAnswer: 0 }, { isAnswer: 0 }],
      isEdit: eval(GetQueryString(location.hash, ['isEdit', 'id']).isEdit) || false,
      id: GetQueryString(location.hash, ['isEdit', 'id']).id || '',
      anserParse: '',
      answer: '',
      answerGroup: [],
      examDbId: GetQueryString(location.hash, ['examDbId']).examDbId || '',
      learnTime: 0,
      editorData: this.props.editorData,//xwx2019/1/12
      disabled:false,
      titleArr:{}
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
      getService(API_PREFIX + `services/web/activity/examtitle/getById/${this.state.id}`, data => {
        console.log('data12==>', data);
        if (data.status === 1) {
          let value = data.root.object;
          this.setState({titleArr:{}},()=>{
            this.setState({titleArr:value})
          })
  

          this.props.form.setFieldsValue({ titleName: value.titleName, titleType: value.titleType, anserParse: value.anserParse });
          let inputValue = [];
          let inputOption = [];
          let answerGroup = [];
          value.optionInfos && value.optionInfos.map((item, index) => {
            inputOption.push({ key: index, value: '' });
            inputValue.push({
              content: item.content,
              id: item.id,
              isAnswer: item.isAnswer,

            });
            if (value.titleType === 1) {
              if (item.isAnswer === true) {
                this.setState({ answer: index });
              }
            } else {
              if (item.isAnswer === true) {
                answerGroup.push(index);
              }
            }
          });
          this.setState({ answerGroup, typeValue: value.titleType, inputValue, inputOption, inputNum: value.optionInfos.length, anserParse: value.anserParse }, () => {
            value.optionInfos.map((item, index) => {
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

  componentDidUpdate(){//更新过后获取富文本框的内容xwx2019/1/12
    if (this.props.editorData !== this.state.editorData) {
      this.setState({ editorData: this.props.editorData, anserParse: this.props.editorData});
      this.props.form.setFieldsValue({ 'anserParse': this.props.editorData});
    }
  }

  delete = (item) => {
    console.log('item', item);
    const { inputOption, inputNum, inputValue,answerGroup } = this.state;
    if (inputNum === 2) {
      Message.error('请至少保留两个选项');
      return;
    }

    console.log(this.state.answerGroup);

    if(this.state.typeValue==1){
      this.setState({answer:-1})
    }else{   
      answerGroup&&answerGroup.length>0&&answerGroup.map((list,index)=>{
          if(list==item.key){
            answerGroup[index]=-1 
          }
      })
     this.setState({answerGroup})
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
    console.log("this.state==>",this.state);
      const {answerGroup}=this.state;
    if (this.state.isEdit) {
      this.setState({ visible: true, deleteItem: item });
    } else {
      if(this.state.typeValue==1){
        this.setState({answer:-1})
      }else{
        answerGroup&&answerGroup.length>0&&answerGroup.map((list,index)=>{
          if(list==item.key){
            answerGroup[index]=-1 
          }
      })
     this.setState({answerGroup})
      }
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
        item.isAnswer = 1;
      } else {
        item.isAnswer = 0;
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
        item.isAnswer = 0;
      } else {
        for (const iterator of value) {
          if (index === iterator) {
            item.isAnswer = 1;
            break;
          } else {
            item.isAnswer = 0;
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
        console.log('fieldsValue222222222=>',fieldsValue);
        const values = {
          ...fieldsValue, ...{ options: [] },
        };
        console.log('提交', values);
        this.state.inputValue.map(item => {
          values['options'].push(item);
        });


        // values['anserParse'] = this.props.editorData;
        console.log('this.state.isEdit===>', this.state.isEdit);
        console.log('values', values);
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
        // debugger;
        // 判断开始
        let answerNum = 0;
        console.log("values",values);
        values['options'].map(v => {
          if (v.isAnswer === 1) {
            answerNum += 1;
          }
        });

        //判断结束
        if (this.state.isEdit) {
          if (values['titleType'] === 1) {
            // if (answerNum > 0) {
              let body = {
                id: this.state.id,
                titleName: values['titleName'],
                titleType: values['titleType'],
                required: values['required'],
                optionInfos: values['options'],
                anserParse: values['anserParse'],
                dbType:2,
                optionType:1,
                showIndex:0,
              };
              let arr=[];
              body.optionInfos.length>0&&body.optionInfos.map((item,index)=>{
                item.showIndex=body.optionInfos.length-index;
                if(item.isAnswer){
                  arr.push(item.isAnswer);
                }
              });
              if(arr.length<1){
                Message.error("单选题必须有一个选项");
                return false;
              }    
          

            if(this.state.titleArr&&this.state.titleArr.examDbId){
              body.examDbId=this.state.titleArr.examDbId
            }
      
            this.state.titleArr.optionInfos[0].titleId&&body.optionInfos.map((item,index)=>{
              item.titleId=this.state.titleArr.optionInfos[0].titleId
          })

              postService(API_PREFIX + 'services/web/activity/examtitle/update', body, data => {
                if (data.status === 1) {
                  Message.success('修改成功');
                  history.back();
                }else if(data.status === 0){
                  Message.warning(data.errorMsg);
                } 
              });
            // } else {
            //   Message.warning('答案有且只能选择一项！');
            // }
          } else {
            // if (answerNum > 1) {
              let body = {
                id: this.state.id,
                titleName: values['titleName'],
                titleType: values['titleType'],
                required: values['required'],
                optionInfos: values['options'],
                anserParse: values['anserParse'],
                dbType:2,
                optionType:1,
                showIndex:0,
              };
              if(body.optionInfos.length<2){
                Message.error("多选题至少有两个选项，以及两个答案");
                return false;
              }
  
              let arr=[];
              body.optionInfos.length>1&&body.optionInfos.map((item,index)=>{
                 if(item.isAnswer||item.isAnswer==1){
                   arr.push(item);
                 }
              });
              if(arr.length<2){
                Message.error("多选题应至少有两个选项");
                return false;
              }
              body.optionInfos.length>0&&body.optionInfos.map((item,index)=>{
                item.showIndex=body.optionInfos.length-index;
              });
              if(this.props.topicDetail&&this.props.topicDetail.examDbId){
                body.examDbId=this.props.topicDetail.examDbId
              }
    
              postService(API_PREFIX + 'services/web/activity/examtitle/update', body, data => {
                if (data.status === 1) {
                  Message.success('修改成功');
                  history.back();
                }else if(data.status === 0){
                  Message.warning(data.errorMsg);
                } 
              });
            // } else {
            //   Message.warning('答案至少选择二项！');
            // }
          }
        } else {
          if (values['titleType'] === 1) {
            if (answerNum > 0) {
              let body = {
                titleName: values['titleName'],
                titleType: values['titleType'],
                optionInfos: values['options'],
                anserParse: values['anserParse'],
                examDbId: this.state.examDbId,
                dbType:2,
                optionType:1,
                showIndex:0,   
              };
              body.optionInfos.length>0&&body.optionInfos.map((item,index)=>{
                item.showIndex=body.optionInfos.length-index;
              });
                
              this.setState({disabled:true});
              postService(API_PREFIX + 'services/web/activity/examtitle/insert', body, data => {
                if (data.status === 1) {
                  Message.success('新增成功');
                  history.back();
                }else if(data.status === 0){
                  Message.warning(data.errorMsg);
                } 
              });
            } else {
              Message.warning('答案有且只能选择一项！');
            }
          } else {
            if (answerNum > 1) {
              let body = {
                titleName: values['titleName'],
                titleType: values['titleType'],
                optionInfos: values['options'],
                anserParse: values['anserParse'],
                examDbId: this.state.examDbId,
                dbType:2,
                optionType:1,
                showIndex:0,
              };
              body.optionInfos.length>0&&body.optionInfos.map((item,index)=>{
                item.showIndex=body.optionInfos.length-index;
              });
  
              postService(API_PREFIX + 'services/web/activity/examtitle/insert', body, data => {
                if (data.status === 1) {
                  Message.success('新增成功');
                  history.back();
                }else if(data.status === 0){
                  Message.warning(data.errorMsg);
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
    let isAnswer = typeValue === 1 ? (answer === index ? 1 : 0) : answerGroup.indexOf(index) > -1 ? 1 : 0;
    inputValue[index] = this.state.isEdit ? { content: e.target.value, isAnswer } : { content: e.target.value, isAnswer };
    this.setState({ inputValue });
  }

  add = () => {
    let inputOption = [];
    for (let index = 0; index <= this.state.inputNum; index++) {
      inputOption.push(
        { key: index, value: "" }
      );
    }

    //20181224 彭元军 新增选项数量限制
    if(inputOption.length>6){
      inputOption.splice(this.state.inputNum,1);
      Message.error('题目选项最多只能设置6项');
      console.log(inputOption);
      return;
    }
    this.setState({ inputOption, inputNum: this.state.inputNum + 1 });
  };

 getMore=(value)=>{
  const {inputValue}=this.state;
   inputValue&&inputValue.length>0&&inputValue.map((item,index)=>{
      if(item.isAnswer){
        item.isAnswer=false
      }
   })
  this.setState(
    {
      typeValue: value,
      answer: '',
      answerGroup: [],
      inputValue
    }
  )
 }
  //学习内容字数120字为一分钟
  wordCount = (value) => {
    console.log('value', value.length - 7);
    this.setState({ learnTime: Math.ceil((value.length - 7) / 120) });
  }

  render() {
    const { inputOption, inputValue, FieldTypeOption,disabled } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 15 } };
    const formItemLayout1 = { labelCol: { span: 4 }, wrapperCol: { span: 18 } };

console.log("inputOption===>",inputOption,this.state.answer)

    return <div className="configuration-main">
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="题目名称">
          {getFieldDecorator('titleName', {
            initialValue: '',
            rules: [
              { required: true, whitespace: true, message: '必填项' },   { message: '最大不能超过200个字',max:200 },
            ],
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout1} label="题目类型">
          {getFieldDecorator('titleType', {
            initialValue: 1,
            rules: [
              { type: 'number', required: true, whitespace: true, message: '必填项' },
            ],
          })(<Select getPopupContainer={trigger => trigger.parentNode} onChange={value =>this.getMore(value)}>
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
                          { message: '最大不能超过200个字',max:200 },
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
                          { message: '最大不能超过200个字',max:200 },
                        ],
                      })(<Input onChange={e => this.handleChange(e, item.key)} />)}
                    </FormItem>
                    <Checkbox value={item.key} style={{marginLeft:'10px',lineHeight:'35px'}}>答案</Checkbox>
                    <Button className="deleteBtn" onClick={() => this.isModal(item)} style={{ margin: '6px 0 0 6px' }}>
                      删除
                    </Button>
                  </div>;
                })}
              </CheckboxGroup>
            }
          </Col>
        </Row>

        <Button onClick={this.add} className="resetBtn"
         //////disabled={this.state.inputNum>=6?true:false}
          style={{ display: 'block', marginLeft: '172px', marginBottom: '15px' }}>
          添加选项
        </Button>

        {/* 富文本区域 */}
        <FormItem {...formItemLayout1} label="答案解析">
          {getFieldDecorator('anserParse', {
            initialValue: '',
          })(<RichText wordCount={this.wordCount.bind(this)} initialValue={this.state.anserParse} />)}
        </FormItem>


        <Button type="primary" style={{ marginLeft: '275px', marginBottom: '130px' }} className="resetBtn" onClick={() => history.back()}>
          返回
        </Button>
        <Button type="primary" className="queryBtn" htmlType="submit" disabled={disabled}>
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