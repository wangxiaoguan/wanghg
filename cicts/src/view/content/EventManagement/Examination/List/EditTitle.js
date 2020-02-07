import React, { Component } from 'react';
import { Button, Form, Input, Select, Row, Col, Message, Modal, Radio, Checkbox, InputNumber } from 'antd';
import { GetQueryString,postService,getService} from '../../../myFetch';
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
export default class EditTitle extends Component {
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
      isEdit: true,
      id:"",
      anserParse: '',
      answer: '',
      answerGroup: [],
      editorData: this.props.editorData,
      learnTime: 0,
      activeKey:  GetQueryString(location.hash, ["activeKey"]).activeKey || "", 
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

      if(this.props.editTwodetail){
        // getService(API_PREFIX + `services/web/activity/examtitle/getById/${this.props.editTwodetail.id}`, data => {
        //   if (data.status === 1) {
              let value = this.props.editTwodetail;
             this.props.form.setFieldsValue({ titleName: value.titleName, titleType: value.titleType, anserParse: value.anserParse,showIndex:value.showIndex });
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
        //   } else {
        //     Message.error('获取数据失败');
        //   }
        // });
      }
     
    }
 
  componentDidUpdate(){//更新过后获取富文本框的内容xwx2019/1/12
    if (this.props.editorData !== this.state.editorData) {
      // this.setState({ editorData: this.props.editorData, anserParse: this.props.editorData});
      // this.props.form.setFieldsValue({ 'anserParse': this.props.editorData});
      this.setState({editorData: this.props.editorData})
    }
  }


  delete = (item) => {
    console.log('item', item);
    const { inputOption, inputNum, inputValue,answerGroup } = this.state;
    if (inputNum === 2) {
      Message.error('请至少保留两个选项');
      return;
    }

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
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        console.log('fieldsValue222222222=>',fieldsValue);
        const values = {
          ...fieldsValue, ...{ options: [] },
        };
        console.log('提交', values);
        this.state.inputValue.map((item,index) => {
          /////item.number=index+1;
          values['options'].push(item);
        });
        values['anserParse'] = this.props.editorData;
        
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
        if (this.state.isEdit && this.props.editTwodetail) {
          if (values['titleType'] === 1) {
            // if (answerNum > 0) {
              let body = {
                id: this.props.editTwodetail.id,
                titleName: values['titleName'],
                titleType: values['titleType'],
                required: values['required'],
                optionInfos: values['options'],
                anserParse: values['anserParse'],
                showIndex:values['showIndex'],
                dbType:2,
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
              if(this.props.editTwodetail&&this.props.editTwodetail.examDbId){
                body.examDbId=this.props.editTwodetail.examDbId
              }
         
               body.optionInfos&&body.optionInfos.length>0&&body.optionInfos.map((item,index)=>{
                   item.titleId=this.props.editTwodetail.optionInfos&&this.props.editTwodetail.optionInfos.length>0?this.props.editTwodetail.optionInfos[0].titleId:this.props.editTwodetail.id;
              })
      




              postService(API_PREFIX + 'services/web/activity/examtitle/update', body, data => {
                if (data.status === 1) {
                  Message.success('修改成功');
                 //// history.back();
                 this.props.hideEditTwoModal();
                 this.props.getupdata(data.root.object);
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
                id: this.props.editTwodetail.id,
                titleName: values['titleName'],
                titleType: values['titleType'],
                required: values['required'],
                optionInfos: values['options'],
                anserParse: values['anserParse'],
                showIndex:values['showIndex'],
                dbType:2,
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
              if(this.props.editTwodetail&&this.props.editTwodetail.examDbId){
                body.examDbId=this.props.editTwodetail.examDbId
              }
          
               body.optionInfos&&body.optionInfos.length>0&&body.optionInfos.map((item,index)=>{
                     item.titleId=this.props.editTwodetail.optionInfos&&this.props.editTwodetail.optionInfos.length>0?this.props.editTwodetail.optionInfos[0].titleId:this.props.editTwodetail.id;
                })




              postService(API_PREFIX + 'services/web/activity/examtitle/update', body, data => {
                if (data.status === 1) {
                  Message.success('修改成功');
                  // history.back();
                  this.props.hideEditTwoModal();
                  this.props.getupdata(data.root.object);

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
                showIndex:values['showIndex'],
                examDbId: this.state.examDbId,
                dbType:2,
              };
              body.optionInfos.length>0&&body.optionInfos.map((item,index)=>{
                item.showIndex=body.optionInfos.length-index;
              });
              postService(API_PREFIX + 'services/web/activity/examtitle/insert', body, data => {
                if (data.status === 1) {
                  Message.success('新增成功');
                 //// history.back();
                 this.props.hidenewTwoModal();
                 this.props.getnewdata(data.root.object);
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
                showIndex:values['showIndex'],
                examDbId: this.state.examDbId,
                dbType:2,
              };
              body.optionInfos.length>0&&body.optionInfos.map((item,index)=>{
                item.showIndex=body.optionInfos.length-index;
              });
              postService(API_PREFIX + 'services/web/activity/examtitle/insert', body, data => {
                if (data.status === 1) {
                  Message.success('新增成功');
                  // history.back();
                  this.props.hidenewTwoModal();
                  this.props.getnewdata(data.root.object);
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

  getMore=(value)=>{
    const {inputValue}=this.state;
     inputValue&&inputValue.length>0&&inputValue.map((item,index)=>{
        if(item.isAnswer){
          item.isAnswer=0
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

  handleChange(e, index,item) {
    const { inputValue, answer, answerGroup, typeValue,FieldTypeOption } = this.state;
    console.log('aaa', answerGroup);
    let isAnswer = typeValue === 1 ? (answer === index ? 1 : 0) : answerGroup.indexOf(index) > -1 ? 1 : 0;
    /////inputValue[index] = this.state.isEdit ?item.new===1?{content: e.target.value, isanswer} : { content: e.target.value, id: this.state.activityId, isanswer } : { content: e.target.value, isanswer };
    inputValue[index] = this.state.isEdit ? { content: e.target.value, isAnswer } : { content: e.target.value, isAnswer };    
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
      inputOption.push(
        { key: index, id:0 , value: '' });
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

    //做限制
    titlename=e=>{
      // if(e.target.value.length>36){
      //   Message.error("题目名称不能超过36多少字符");
      // }
    }


  render() {
    const { inputOption, inputValue, option ,FieldTypeOption} = this.state;
    console.log('inputValue', inputValue,this.state);

    const {
      form: { getFieldDecorator },
    } = this.props;
    console.log('anser',this.state.anserParse);
    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 15 } };
    const formItemLayout1 = { labelCol: { span: 4 }, wrapperCol: { span: 18 } };
    return <div className="configuration-main">
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="题目名称">
          {getFieldDecorator('titleName', {
            initialValue: '',
            rules: [
              { required: true, whitespace: true, message: '必填项' }, { message: '最大不能超过200个字',max:200 },
            ],
          })(<Input   disabled={this.state.activeKey !=0 ? true:false} onChange={(e)=>this.titlename(e)}/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="题目类型">
          {getFieldDecorator('titleType', {
            initialValue: 1,
            rules: [
              { type: 'number', required: true, whitespace: true, message: '必填项' },
            ],
          })(<Select getPopupContainer={trigger => trigger.parentNode}   disabled={this.state.activeKey !=0 ? true:false} onChange={value => this.getMore(value)}>
            {this.getOption(FieldTypeOption)}
          </Select>)}
        </FormItem>
        <FormItem {...formItemLayout} label="显示顺序">
          {getFieldDecorator('showIndex', {
            initialValue: 0,
            rules: [
              { type: 'number', required: true, whitespace: true, message: '必填项,且必须为数字！' },
            ],
          })(<InputNumber min={0}   disabled={this.state.activeKey !=0 ? true:false} />)}
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
                      })(<Input onChange={e => this.handleChange(e, item.key)}    disabled={this.state.activeKey !=0 ? true:false} />)}
                    </FormItem>
                    <Radio style={{ marginTop: '6px', marginLeft: '10px' }} value={item.key}   disabled={this.state.activeKey !=0 ? true:false}>答案</Radio>
                    <Button className="deleteBtn" onClick={() => this.isModal(item)} style={{ margin: '1px 0 0 6px' }} style={{display:this.state.activeKey !=0 ? "none":"inline-block"}}>
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
                      })(<Input onChange={e => this.handleChange(e, item.key)}   disabled={this.state.activeKey !=0 ? true:false}/>)}
                    </FormItem>
                    <Checkbox value={item.key} style={{marginLeft:'10px',lineHeight:'35px'}}   disabled={this.state.activeKey !=0 ? true:false}>答案</Checkbox>
                    <Button className="deleteBtn" onClick={() => this.isModal(item)} style={{ margin: '6px 0 0 6px' }} style={{display:this.state.activeKey !=0 ? "none":"inline-block"}}>
                      删除
                    </Button>
                  </div>;
                })}
              </CheckboxGroup>
            }
          </Col>
        </Row>

        <Button onClick={this.add} className="resetBtn"
         style={{ display: 'block', marginLeft: '172px', marginBottom: '15px' }}>
          添加选项
        </Button>
        <FormItem {...formItemLayout1} label="答案解析">
          {getFieldDecorator('anserParse', {
            initialValue: '',
          })(<RichText wordCount={this.wordCount.bind(this)} initialValue={this.state.anserParse}    disabled={this.state.activeKey !=0 ? true:false}/>)}
        </FormItem>
        <Row style={{textAlign:'center',marginBottom:'20px'}}>
          <Button type="primary" style={{marginLeft:'0px'}} className="resetBtn" onClick={() => this.props.hidenewTwoModal()}>
          返回
          </Button>
          {
            GetQueryString(location.hash, ['questionOnline']).questionOnline=='questionOnline'?null:
            <Button type="primary" className="queryBtn" htmlType="submit" style={{display:this.state.activeKey !=0 ? "none":"inline-block"}} >
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