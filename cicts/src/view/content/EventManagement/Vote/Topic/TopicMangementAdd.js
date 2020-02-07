import React, { Component } from 'react';
import { message,Button,Row,Col,Checkbox, InputNumber,Form, Input, Select, Modal } from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { GetQueryString,postService ,getService} from '../../../myFetch';
import UploadPicture from '../../../../component/EventAndInfoAdd/uploadPic';
import { connect } from 'react-redux';
import  API_PREFIX,{ masterUrl }  from '../../../apiprefix';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

@connect(state => ({
    powers: state.powers,
    uploadSpecial: state.uploadPicture.contentPictureData,
  }))
@Form.create()  
export default class TopicMangementAdd extends Component {
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
              { isBlanks: false },
              { isBlanks: false },
              { isBlanks: false },
              { isBlanks: false },
            ],
            topicId:GetQueryString(location.hash, ["id"]).id || "",
            isEdit:GetQueryString(location.hash, ["isEdit"]).isEdit,
            answer: '',
            answerGroup: [],
            optionType: [],
            isUpload: false,
            picValue: [],
            picOption:[],
            picOptionList:'',
            titleArr:{}
        };
      }

      componentDidMount(){
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
              ],
              optionType: [
                {
                  key: 1,
                  value: '文字',
                },
                {
                  key: 2,
                  value: '图片',
                },
              ],
          });
          let {topicId,isEdit}=this.state;
          console.log("topicId===》",topicId,typeof(topicId),'isEdit===》',isEdit,typeof(isEdit));
          if(isEdit==='true'&&topicId){
            getService(API_PREFIX+`services/web/activity/votingtitle/getById/${topicId}`,data=>{
                if(data.status===1){
                    let value = data.root.object;
                    this.setState({titleArr:{}},()=>{
                      this.setState({titleArr:value})
                    })
                    this.props.form.setFieldsValue({
                        title: value.title,
                        titleType: value.titleType,
                        showIndex: value.showIndex,
                        optionType: value.optionType,
                        titleName:value.titleName,
                      });
                      let inputValue = [];
                      let inputOption = [];
                      let answerGroup = [];
                      value.optionInfos &&
                      value.optionInfos.map((item, index) => {
                        inputOption.push({ key: index, value: '',isBlanks:item.isBlanks});
                        if(item.isBlank){
                        inputValue.push({
                          content: item.content,
                          id: item.id,
                          isBlanks: item.isBlanks,
                        });
                      }else{
                        inputValue.push({
                          content: item.content,
                          id: item.id,
                          isBlanks: false,
                        });
                      }
                        if (item.isBlanks === true) {
                          answerGroup.push(index);
                        }
                      });
                      console.log("value",value);
                      let option = value.optionInfos&&[...value.optionInfos];
                      let temp = [];    //////切换图片时不能拿文字里面的options
                      if(value.optionType == 2) {
                       temp = option && option.map((item,index) => {
                        return item = { response: { object: [{ filePath: item.url,fileName:item.url }] }, describe: item.urlDescribe,id:index };
                      });
                    }
                      this.setState({
                        answerGroup,
                        inputValue,
                        inputOption,
                        inputNum: value.optionInfos ? value.optionInfos.length : 0,
                        questionTypeValue:value.titleType,
                        optionTypeValue: value.optionType ? value.optionType : 1,
                        createDate: value.createDate,
                        createUserId: value.createUserId,
                        picValue: temp,
                      },()=>{
                        if (value.optionType === 2) {//2-图片
                          console.log("picOption",temp);
                          this.props.form.setFieldsValue({
                            picOption: temp,
                          });
                          this.setState({ picOption:temp});
                        }
                          if(value.optionType === 1||!value.optionType){
                            value.optionInfos &&value.optionInfos.map((item, index) => {
                                this.props.form.setFieldsValue({
                                    ['option' + `${index}`]: item.content,
                                });
                            });
                          }
                          this.props.form.setFieldsValue({
                            maxOption: value.maxOption,
                            minOption: value.minOption,
                          });
                      });
                }else{
                    message.error(data.errorMsg);
                }
            });
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
          console.log(data);
          console.log(picOption);
          if(data.content){
            let obj={};
            obj['id']=data.key;
            obj['describe']=data.content.describe?data.content.describe:'';
            obj['response']={
              object:{},
            };

            // if(data.content.response&&data.content.response.object&&data.content.response.object[0]){             
            //  obj['response']['object']=[{fileName:data.content.name?data.content.name:data.content.response.object[0].fileName,filePath:data.content.response.object[0].filePath}];
            // }else{
            //   obj['response']['object']=[{fileName:data.content.name?data.content.name:data.content.response.root.object[0].fileName,filePath:data.content.response.root.object[0].filePath}];
            // }
          
            obj['response']['object']=[{fileName:data.content.response?(data.content.response.root?data.content.response.root.object[0].fileName:data.content.response.object[0].fileName) : '',filePath:data.content.response?(data.content.response.root?data.content.response.root.object[0].filePath:data.content.response.object[0].filePath) :''}];
   
            console.log("obj====",obj);
            for (let index = 0; index < picOption.length; index++) {
              if (picOption[index]) {
                if (picOption[index].id!==undefined) {
                  if (data.key === picOption[index].id) {
                    console.log("data.key",data.key);
                    picOption[index] = obj;
                    this.isPush = false;
                    break;
                  } else {
                    this.isPush = true;
                  }
                }else {
                  this.isPush = true;
                }
              }
              
            }
            if (this.isPush) {
              picOption.push(obj);
              console.log(picOption,obj);
            }
            // picOption.push(obj);
            console.log(picOption);
            this.setState({ isUpload: false,picOption,inputNum: picOption.length });
            this.props.form.setFieldsValue({ picOption });
            console.log(this.props.form.getFieldValue('picOption'));
            this.setState({
              picOptionList:this.props.form.getFieldValue('picOption'),
            });
          }else{
            console.log('删除',data);
            if(picOption){
              picOption = picOption.filter(item=>item.id!==data.key);
            }
            console.log(picOption);
            this.setState({ isUpload: false, picOption ,inputNum: picOption.length});
            this.props.form.setFieldsValue({ picOption });
            this.setState({
              picOptionList:this.props.form.getFieldValue('picOption'),
            });
          }
          
        }

      }


     //题目删除
     delete = item => {
        console.log(item);
        const { inputOption, inputNum, inputValue,answerGroup } = this.state;
        if (inputNum === 2) {
          message.error('请至少保留两个选项');
          return;
        }
        let indexof;
        console.log('inputValue的值====》',inputValue);
        inputValue.map(n=>{
          if(n.isBlanks==0){
           n.isBlanks=false;
          }
        });
        console.log('inputOption的值====》',inputOption);
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
     
      //确认是否删除的弹框
      isModal = item => {
        if (this.state.isEdit==='true') {
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
        const { inputValue,inputOption} = this.state;
        console.log('多选', value);
        console.log('inputValue的值====》',inputValue);
        inputValue.map((item, index) => {
          if (value.length === 0) {
            item.isBlanks = false;
          } else {
            for (const iterator of value) {
              if (index === iterator) {
                item.isBlanks = true;
                break;
              } else {
                item.isBlanks = false;
              }
            }
          }
        });
        inputOption.map((v,index)=>{
            v.isBlanks=inputValue[index].isBlanks;
        });
        console.log('inputValue的值====》',inputValue);
        console.log('inputOption的值====》',inputOption);
        this.setState({ inputValue, answerGroup: value });
      };

      //保存
      handleSubmit = e => {
        e.preventDefault();
        // let List=this.state.picOptionList;
        this.props.form.validateFields((err, fieldsValue) => {
          console.log('提交', fieldsValue);
          // if(Array.isArray(fieldsValue.picOption&&fieldsValue.picOption[0])){
          //   fieldsValue.picOption=List;
          // }
        //20181224  彭元军  新增最多选项必须大于最小选项  限制
          if(fieldsValue['titleType']===2){
            if(fieldsValue['maxOption']<1){
              message.error('最多选项必须大于等于1！');
              return;
            }
            if(fieldsValue['maxOption']<fieldsValue['minOption']){
              message.error('最多选项必须大于等于最小选项！');
              return;
            }
          }
    
          if (!err) {
            const values = {
              ...fieldsValue,
              ...{ optionInfos: [] },
            };
            console.log('提交', values);
            console.log('this.state.optionTypeValue=>',this.state.optionTypeValue);
            console.log('this.state',this.state);
            if(this.state.inputValue.length!==0&&this.state.inputOption.length!==0){//解决删除，导致可填项全部为false的问题
                this.state.inputValue.map((item1,index)=>{
                    item1.isBlanks=this.state.inputOption[index].isBlanks;
                });
            }
            if (this.state.optionTypeValue == 1) {
              this.state.inputValue.map(item => {
                values['optionInfos'].push(item);
              });
            } 
            if (this.state.optionTypeValue === 2) {
              // console.log(this.state.picOptionList);
              // console.log(this.state.picOptionList.length)
              // console.log(typeof this.state.picOptionList.length)
      
            if(this.state.picOptionList==undefined&&this.state.picOption.length==0){
              message.error("请上传图片");
              return;
            }


             if(this.state.picOptionList&&this.state.picOptionList.length>0){
             }else if(this.state.picValue.length<1){
              message.error("请上传图片");
              return;
             }

              values['picOption']=[];
              values['picOption']=this.state.picOption.length>0?this.state.picOption:this.state.picOptionList;
              values['picOption'].map(item=>{
                values['optionInfos'].push({
                  url:item.response.object[0].filePath,
                  urlDescribe: item.describe,
                });
              });
              // values['picOption'].map(item => {
              //   let isMasterUrl = item.response.object[0].filePath.indexOf(masterUrl)>-1;
              //   console.log("isMasterUrl",isMasterUrl);
              //   values['optionInfos'].push({
              //     url: isMasterUrl ? item.response.object[0].filePath:masterUrl + item.response.object[0].filePath,
              //     urlDescribe: item.describe,
              //   });
              // });
            }
            if(this.state.optionTypeValue === 1){
              //判断重复选项
              let ops=[];
              values.optionInfos.map(v=>{
                ops.push(v.content);
              });
    
              let opsN=Array.from(new Set(ops));
              console.log(opsN);
              if(opsN.length<values.optionInfos.length){
                message.error('题目选项不可重复');
                return;
              }
            }
    
            values['activityId'] = this.state.activityId;
            console.log('values=>',values);
            // if(values.maxOption<values.minOption){
            //   message.error('最多选项必须大于等于最少选项！');
            //   return 
            // }
            let {topicId,isEdit}=this.state;
            console.log(values);
            if(fieldsValue['maxOption']<1){
              message.error('最多选项必须大于等于1！');
              return;
            }
            if(fieldsValue['maxOption']<fieldsValue['minOption']){
              message.error('最多选项必须大于等于最小选项！');
              return;
            }
 
            console.log(values);
            console.log(this.state);
            
            // if(fieldsValue['minOption']>this.state.inputValue.length){
            //   message.error('最少选项不可大于题目选项');
            //   return;
            // }
            // if(fieldsValue['maxOption']>this.state.inputValue.length){
            //   message.error('最多选项不可大于题目选项');
            //   return;
            // }

            if (isEdit==='true'&&topicId) {
                values.dbType=5;
              let body = {
                ...{ id: this.state.topicId },
                ...values,
              };
              body.optionInfos.length>0&&body.optionInfos.map((item,index)=>{
                item.showIndex=body.optionInfos.length-index
              });


              if(this.state.titleArr&&this.state.titleArr.examDbId){
                body.examDbId=this.state.titleArr.examDbId
              }
        
              this.state.titleArr.optionInfos[0].titleId&&body.optionInfos.map((item,index)=>{
                item.titleId=this.state.titleArr.optionInfos[0].titleId
            })

              if(body.optionType==2){
                if(body.optionInfos.length==0){
                  message.error("请上传图片");
                  return false
                }
              }    

              postService(
                API_PREFIX + 'services/web/activity/votingtitle/update',
                body,
                data => {
                  if (data.status === 1) {
                    message.success('修改成功');
                    history.back();
                  } else {
                    message.error(data.errorMsg);
                  }
                }
              );
            } else {
              console.log("value=====",values);
              values.dbType=5;
              let body = {
                ...values,
              };
              body.optionInfos.length>0&&body.optionInfos.map((item,index)=>{
                item.showIndex=body.optionInfos.length-index
              });
              if(body.optionType==2){
                if(body.optionInfos.length==0){
                  message.error("请上传图片");
                  return false
                }
              }    
              postService(
                API_PREFIX + 'services/web/activity/votingtitle/insert',
                body,
                data => {
                  if (data.status === 1) {
                    message.success('新增成功');
                    history.back();
                  } else {
                    message.error(data.errorMsg);
                  }
                }
              );
            }
          }
        });
      };

      handleChange(e, index,id) {
       const { inputValue, answer, answerGroup, typeValue } = this.state;
        if(this.state.isEdit){
          console.log('aaa', answerGroup);
          let isBlanks =
            typeValue === 1
              ? answer === index
                ? 1
                : 0
              : answerGroup.indexOf(index) > -1
                ? true
                : false;
    
          if(id===0){
            inputValue[index] = { content: e.target.value , isBlanks };
          }else{
            inputValue[index] = { content: e.target.value, id:inputValue[index].id , isBlanks };
          }
        }else{
          console.log('aaa', answerGroup);
          let isBlanks =
            typeValue === 1
              ? answer === index
                ? 1
                : 0
              : answerGroup.indexOf(index) > -1
                ? true
                : false;
          inputValue[index] = { content: e.target.value,isBlanks };
        }
        this.setState({ inputValue });
      }

      //添加选项
      add = () => {
        let  inputOption = [...this.state.inputOption];
        let  inputValue=[...this.state.inputValue];
           let len=inputOption.length;
           inputOption.push({key:len,value:'',isBlanks:false});
    
    
        inputValue.push({ content:'', isBlanks:false,id:null});
            if(inputOption.length>50){
          inputOption.splice(this.state.inputNum,1);
          message.error('题目选项最多只能设置50项');
          console.log(inputOption);
          return;
        }
        console.log("this.state=====",this.state);
        this.setState({ inputOption, inputNum: this.state.inputNum + 1 ,inputValue:inputValue});
      };

      render() {
        const { inputOption, inputNum, FieldTypeOption, optionType, questionTypeValue, optionTypeValue } = this.state;
        console.log("inputNum==>",inputNum);
        const {
             form: { getFieldDecorator },
            }= this.props;
        const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 12 } };
          return(
    <div style={{marginTop:'30px'}}>
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
              initialValue: questionTypeValue,
              rules: [
                {
                  type: 'number',
                  required: true,
                  whitespace: true,
                  message: '必填项',
                }
               
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
                    <Col span={6} className="ant-form-item-label">
                      <label>
                        <span className="ant-form-item-required">题目选项</span>
                      </label>
                    </Col>
                    <Col span={12}>
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
                                  initialValue: item.value?item.value:'',
                                  rules: [
                                    {
                                      required: optionTypeValue&&optionTypeValue==2?false:true,
                                      whitespace: true,
                                      message: '必填项',
                                    },
                                    // ,{ message: '最大不能超过200个字',max:200 }
                                  ],
                                })(
                                  <Input
                                    onChange={e =>
                                      this.handleChange(e, item.key,item.id)
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
                  <Row>
                    <Col span={7}/>
                    <Col span={3}>
                        <Button
                            className="resetBtn"
                            onClick={this.add}
                            style={{
                            display: 'block',
                            marginBottom: '15px',
                            }}
                        >
                            添加选项
                        </Button>
                        </Col>
                        <span style={{color:'red'}}>添加选项上限为50个。</span>
                  </Row>
                </div>
              ) : (
                <FormItem {...formItemLayout} label="题目选项">
                {getFieldDecorator('picOption')(
                  <UploadPicture
                    isIamge={true}
                    keys={'questionnaire'}
                    type={'uploadPicture_button'}
                    describe={true}
                    initialValue={this.state.picValue}
                    datatype={'votepicture'}
                    disabled={false} 
                    modal={"event"}
                  />
                )}
              </FormItem>
              )}
              {questionTypeValue === 2 ? (
                <Row>
                  <Col span={4}/>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="最少选项">
                      {getFieldDecorator('minOption', {
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
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="最多选项">
                      {getFieldDecorator('maxOption', {
                        initialValue: '',
                        rules: [
                          {pattern:new RegExp ('^[1-9]\d*(\.\d*[1-9])?'),message:'输入的最多选项必须大于0'},
                          {
                            type: 'number',
                            required: true,
                            whitespace: true,
                            message: '必填项,至少选择1项',
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
            {
               GetQueryString(location.hash, ['voteTop']).voteTop=='voteTop'?null:
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
      }
}