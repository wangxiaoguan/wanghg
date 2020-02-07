import React, { Component } from 'react';
import { Button, Form, Input, Select, Row, Col, Message, Modal, Radio, Checkbox, InputNumber } from 'antd';
import { GetQueryString, postService, getService } from '../../../myFetch';
import API_PREFIX, { masterUrl } from '../../../apiprefix';
// import RichText from '../../../../component/richTexteditor/editor';
import RichText from '../../../../component/richTexteditor/braftEditor';
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
export default class CustomAdd extends Component {
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
      optionTypeValue: 2,
      inputNum: 4,
      inputOption: [
        { key: 0, value: '' },
        { key: 1, value: '' },
        { key: 2, value: '' },
        { key: 3, value: '' },
      ],
      inputValue: [
        { isBlank: false },
        { isBlank: false },
        { isBlank: false },
        { isBlank: false },
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
          key: 2,
          value: '文字',
        },
      ],
    });
    if (this.state.isEdit) {
      getService(
        API_PREFIX + `services/activity/topic/info/${this.state.id}`,
        data => {
          if (data.status === 1) {
            let value = data.root;
            this.props.form.setFieldsValue({
              title: value.title,
              type: value.type,
              showIndex: value.showIndex,
              // optionType:"",
            });
            let inputValue = [];
            let inputOption = [];
            let answerGroup = [];
            value.options &&
              value.options.map((item, index) => {
                inputOption.push({ key: index, value: '',isBlank:item.isBlank});
                if(item.isBlank){
                  inputValue.push({
                    content: item.content,
                    id: item.id,
                    isBlank: item.isBlank,
                  });
                }else{
                  inputValue.push({
                    content: item.content,
                    id: item.id,
                    isBlank: false,
                  });
                }

                if (item.isBlank === true) {
                  answerGroup.push(index);
                }
              });
            
            let option = value.options&&[...value.options];
            let temp = option && option.map((item,index) => {
              return item = { response: { entity: [{ filePath: item.url,fileName:item.url }] }, describe: item.desp1, id:index };
            });

          console.log("wwwwwwwwwwwwwwwwwwwww",inputValue);

            this.setState(
              {
                answerGroup,
                typeValue: value.type,
                inputValue,
                inputOption,
                inputNum: value.options ? value.options.length : 0,
                questionTypeValue: value.type,
                optionTypeValue: value.optionType ? value.optionType : 2,
                picValue: temp,
                createDate: value.createDate,
                createUserId: value.createUserId,
              },
              () => {
                if (value.optionType === 1) {//1-图片
                    this.props.form.setFieldsValue({
                      picOption: temp,
                    });
                    this.setState({ picOption:temp});
                }else if (value.optionType === 2||!value.optionType){//2-文字
                    value.options &&value.options.map((item, index) => {
                        this.props.form.setFieldsValue({
                            ['option' + `${index}`]: item.content,
                        });
                    });
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
    console.log(item);
    const { inputOption, inputNum, inputValue,answerGroup } = this.state;
    if (inputNum === 2) {
      Message.error('请至少保留两个选项');
      return;
    }
    let indexof;
   inputValue.map(n=>{
     if(n.isBlank==0){
      n.isBlank=false;
     }
   });

    inputOption.map((list,index)=>{
         if(list.key==item.key){
             indexof=item.key;
         } 
    });
    console.log("indexof==>",indexof);
    inputValue.splice(indexof,1);
    
    inputOption.splice(indexof,1);
    inputOption.map((item,index)=>{
      item.key=index;
    });

    let NanswerGroup=[];
    let answerGroupCount=0 ;             //不等数量
    let answerGroupN=0;                 // 相等数量
    if(answerGroup.length==0||answerGroup.length==1){          //当选中项只有一项以及0项时
      answerGroup&&answerGroup.map((h,o)=>{
        if(h==item.key){
          answerGroup.splice(o,1);
        }else if(h>item.key){
          h-=1;
          NanswerGroup.push(h);
        }else{
          NanswerGroup = answerGroup;
        }
      });
    }else{                                      //当选中项有多项时
      answerGroup.map(t=>{
        if(t>item.key){                       //选中的项比当前删除项大
          answerGroupCount++;
        }else if(t==item.key){
          answerGroupN++;
        }
      });
      if(answerGroupN==0){                      //当前选中项不是勾选项
        if(answerGroupCount == 0){              //选中的项比当前删除项小
          NanswerGroup = answerGroup;
        }else {                                 //当前删除项介于选中项之间
          answerGroup.map((h,o)=>{
            if(h<item.key){
              NanswerGroup.push(h);
            }else if(h>item.key){
              h-=1;
              NanswerGroup.push(h);
            }
          });
        }
      }else{                                    //当前选中项是勾选项
        answerGroup.map((h,o)=>{
          if(h==item.key){
            answerGroup.splice(o,1);         //先剔除相等项
          }
        });

        answerGroup.map((h,o)=>{                //待剔除相同项之后，此时依据剩余项的索引值重新比较添加
          if(h<item.key){                 
            NanswerGroup.push(h);
          }else if(h>item.key){
            h-=1;
            NanswerGroup.push(h);
          }
        });
      }
    }

    this.setState({
      inputOption,
      inputNum: inputNum - 1,
      inputValue,
      visible: false,
      answerGroup:NanswerGroup,
    },()=>{
      inputValue && inputValue.map((item, index) => {
        this.props.form.setFieldsValue({
            ['option' + `${index}`]: item.content,
        });
    });
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

  filterData=(a,b)=> {
    return [...a,...b].filter(function(v, i, arr) {
      return arr.indexOf(v) === arr.lastIndexOf(v);

  });
      }

  CheckboxChange = value => {

// console.log("value",value);

    const { inputValue,inputOption } = this.state;
    console.log('多选', value);
    inputValue.map((item, index) => {
      if (value.length === 0) {
        item.isBlank = false;
      } else {
        for (const iterator of value) {
          if (index === iterator) {
            item.isBlank = true;
            break;
          } else {
            item.isBlank = false;
          }
        }
      }
    });

    inputOption.map(v=>{
      value.map(b=>{
        if(b==v.key){
          v.isBlank=true;
        }
      });
    });

    this.setState({ inputValue, answerGroup: value });

    //新增

  //   const { inputOption } = this.state;

  //  value.map((item,index)=>{
  //    inputOption[item].isBlank=true; 
  //  });

  //  let arr=[];
  //  inputOption.map((item,index)=>{
  //   arr.push(index);
  //  });
   
   
  //  let arr1=this.filterData(value,arr);

  //  arr1.map((item,index)=>{
  //   inputOption[item].isBlank=false;
  //  });

  //  console.log("inputOptioninputOption",inputOption);



  //  this.setState({ inputOption, answerGroup: inputOption},()=>{
  // //   inputOption && inputOption.map((item, index) => {
  // //     this.props.form.setFieldsValue({
  // //         ['option' + `${index}`]: item.isBlank,
  // //     });
    
  // //     // this.props.form.setFieldsValue({
  // //     //   ['option' + `${index}`]: item.content,
  // //     //  });

  // // });

  //  });


  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      console.log('提交前', fieldsValue);
      //20181224  彭元军  新增最多选项必须大于最小选项  限制
      if(fieldsValue['type']===2){
        if(fieldsValue['maxItem']<1){
          Message.error('最多选项必须大于等于1！');
          return;
        }
        if(fieldsValue['maxItem']<fieldsValue['minItem']){
          Message.error('最多选项必须大于等于最小选项！');
          return;
        }
      }
      if (!err) {
        const values = {
          ...fieldsValue,
          ...{ optionInfos: [] },
        };
        values.dbType=4;
        console.log('提交', values,this.state);
        if (this.state.optionTypeValue === 2) {
          this.state.inputValue.map(item => {
            values['optionInfos'].push(item);
          });
        } else if (this.state.optionTypeValue === 1) {
          values['optionInfos'].map(item => {
            let isMasterUrl = item.response.entity[0].filePath.indexOf(masterUrl)>-1;
            values['optionInfos'].push({
              url: isMasterUrl ? item.response.entity[0].filePath:masterUrl + item.response.entity[0].filePath,
              desp1: item.describe,
            });
            // values['options'].url =
            //   masterUrl + item[0].response.entity[0].filePath;
            // values['options'].desp1 = item[0].describe;
          });
        }
        console.log('提交', values,this.state);
        if(values.titleType !==3){
          //判断重复选项
          let ops=[];
          values.optionInfos.map(v=>{
            ops.push(v.content);
          });

          let opsN=Array.from(new Set(ops));
          console.log(opsN);
          if(opsN.length<values.optionInfos.length){
            Message.error('题目选项不可重复');
            return;
          }
        }
        values['activityId'] = this.state.activityId;
        // if(values.maxItem<values.minItem){
        //   Message.error('最多选项必须大于等于最少选项！');
        //   return 
        // }
        console.log('盖帽211212', values,this.state);
        if (this.state.isEdit) {
            if(values.options.length<=0){
              Message.error('请添加题目选项');
              return false;
            }

          let body = {
            ...{ id: this.state.id },
            ...values,
            createDate: this.state.createDate,
            createUserId: this.state.createUserId,
          };
          body.optionInfos.length>0&&body.optionInfos.map((item,index)=>{
            item.showIndex=body.optionInfos.length-index
          });
      
          postService(
            API_PREFIX + 'services/web/activity/questiontitle/update',
            body,
            data => {
              if (data.status === 1) {
                Message.success('修改成功');
                history.back();
              }
            }
          );
        } else {
          let body = {
            ...values,
          };
          console.log("body=====",body);
          body.optionInfos.length>0&&body.optionInfos.map((item,index)=>{
            item.showIndex=body.optionInfos.length-index
          });
          postService(
            API_PREFIX + 'services/web/activity/questiontitle/insert',
            body,
            data => {
              if (data.status === 1) {
                Message.success('新增成功');
                let values=[];
                let topic=window.sessionStorage.getItem('topic');
                if(topic !=null && topic!==""){
                  let topicobj=JSON.parse(topic);
                  console.log("values====",topicobj);
                  console.log("values====",topicobj.length);
                  if(topicobj.length===undefined){
                    if (topicobj.activityId === this.state.activityId) {
                      values.push(topicobj);
                      console.log("data1=====",values);
                    }
                  }
                  for(let i=0;i<topicobj.length;i++){
                    values.push(topicobj[i]);
                }
                 ////// values.push(topicobj);
                  console.log("values====",values);
                  values.push(data.root.object);
                  ////values={...JSON.parse(topic),...data.root.object};
                  console.log("values====",values);
                  const list = JSON.stringify(values);
                window.sessionStorage.setItem('topic', list);
                }else{
                  const list = JSON.stringify(data.root.object);
                  console.log("values====",list);
                  window.sessionStorage.setItem('topic', list);
                }
                history.back();

              }else{
                Message.error(data.errorMsg);
              }
            }
          );
        }
      }
    });
  };
  handleChange=(e, index)=> {
    const { inputValue, answer, answerGroup, typeValue } = this.state;
    console.log('aaa', answerGroup);
    let isBlank =
      typeValue === 1
        ? answer === index
          ? 1
          : 0
        : answerGroup.indexOf(index) > -1
          ? true
          : false;
    inputValue[index] = { content: e.target.value, isBlank };
    this.setState({ inputValue });
  }
  add = () => {
    let  inputOption = [...this.state.inputOption];
    let  inputValue=[...this.state.inputValue];
       let len=inputOption.length;
       inputOption.push({key:len,value:'',isBlank:false});


    inputValue.push({ content:'', isBlank:false,id:null});
    if(inputOption.length>6){
      inputOption.splice(this.state.inputNum,1);
      Message.error('题目选项最多只能设置6项');
      console.log(inputOption);
      return;
    }
    console.log("dsjhsjfhsdfjsdhf");
    this.setState({ inputOption, inputNum: this.state.inputNum + 1 ,inputValue:inputValue});
  };
  render() {
    const { inputOption, inputNum, FieldTypeOption, optionType, questionTypeValue, optionTypeValue } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 15 } };
    return (
      <div className="configuration-main">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="题目名称">
            {getFieldDecorator('titleName', {
              initialValue: '',
              rules: [{ required: true, whitespace: true, message: '必填项' },{ message: '最大不能超过200个字',max:200 }],
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
            {getFieldDecorator('titleType', {
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
                  initialValue: 2,
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
              {optionTypeValue === 2 ? (
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
                                    }                                  
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
                      datatype={'votepicture'}
                      disabled={false} 
                    />
                  )}
                </FormItem>
              )}
              {questionTypeValue === 2 ? (
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="最少选项">
                      {getFieldDecorator('minItem', {
                        initialValue: '',
                        rules: [
                          {pattern:new RegExp ('^[1-9]\d*(\.\d*[1-9])?'),message:'输入的最少选项必须大于0'},
                          {
                            type: 'number',
                            required: true,
                            whitespace: true,
                            message: '必填项,至少选择1项',
                          },
                        ],
                      })(<InputNumber  max={inputNum}/>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="最多选项">
                      {getFieldDecorator('maxItem', {
                        initialValue: '',
                        rules: [
                          {pattern:new RegExp ('^[1-9]\d*(\.\d*[1-9])?'),message:'输入的最多选项必须大于0'},
                          {
                            type: 'number',
                            required: true,
                            whitespace: true,
                            // message: '必填项,至少选择1项',
                            validator: (rule, value, callback) => {
                              if(value>inputNum){
                                  callback('必须小于等于总选项个数');
                              }else{
                                  callback();
                              }
                            },
                          },
                        ],
                      })(<InputNumber  max={inputNum} />)}
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
            {GetQueryString(location.hash, ['questionTop']).questionTop=='questionTop'?null:
             <Button type="primary" className="queryBtn" htmlType="submit">
             保存
             </Button>
            }
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
  }}