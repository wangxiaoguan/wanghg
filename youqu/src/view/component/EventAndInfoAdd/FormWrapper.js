import React, { Component } from 'react';
import { Form, Select, InputNumber, Input, DatePicker, Popconfirm, Radio, Button, Modal, Cascader, Row, Col, Icon } from 'antd';
// const masterUrl = 'http://10.110.200.62:9080/';
import SingleTree from './SingleTree';
import UploadPicture from './uploadPic';
import RichText from '../richTexteditor/editor';
import moment from 'moment';
import { connect } from 'react-redux';
import FormAndInput from '../../component/table/FormAndInput';
import { BEGIN,setTimePushData } from '../../../redux-root/action';
import { postService, getService } from '../../content/myFetch';
import ServiceApi, { masterUrl, PictrueUrl, UploadUrl,ChooseUrl,API_FILE_VIEW_INNER } from '../../content/apiprefix';
import { exportExcelService } from '../.././content/myFetch';
import TableSearch from '../table/TableSearch';
import axios from "axios";
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const FormItem = Form.Item;


let uuid = 0;
let i = 1;
let sum = [];
function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}
function disabledDate(current) {
  return moment(new Date()).subtract(1, 'd').isAfter(current);
}


@connect(state => ({
  uploadData: state.uploadPictureData,      //图片上传数据
  uploadSpecial: state.contentPictureData,  //描述图片，附件，视频上传
  selectTreeData: state.column,       //选择树数据
  checkTreeData: state.column,         //多选树数据
  editorData: state.editorData,                    //富文本数据
  pageData: state.pageData,                         //封装表格分页查询条件数据
  selectRowsData: state.selectRowsData,             //封装表格选择数据
}),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    setTimePushData: n => dispatch(setTimePushData(n)),
  }))
export default class FormWrapper extends Component {
  constructor(props) {
    super(props);
    this.isPush = true;
    this.state = {
      homeType: false,
      relation: '1',
      // topicType:'1',
      // urlType:'0',
      liveType: true,
      infoType: '1',
      RadioValue: '',
      selectTreeData: this.props.selectTreeData,
      updateTree: false,
      updateCheckTree: false,
      uploadData: this.props.uploadData,
      updatePicture: false,
      selectTreeKey: '',
      checkTreeKey: '',
      pictureKey: '',
      contentKey: '',
      richTextKey: '',
      editorData: this.props.editorData,
      updateEditor: false,
      img_review: false,
      imgValue: '',
      uploadSpecial: this.props.uploadSpecial,
      specialStatus: false,
      showAddModal: '0',
      dp: [],//部门的数据
      List: [],//党组织机构的数据
      belongsData: [],//归属的数据
      shopping: [],
      pushModal: false,
      timePushValue: '',
      picOption: [],
      allData: [],
      isAttach: false,//是否是附件
      isRadio: false,//是否是视频
      fileName: '',//下载时的文件名
      isValid: false,//当奖励积分数大于0时，积分提供方必填
      shoppingNum: [1],
      shoppingId: [],
      // urltypeShow:true,//是否显示大图和小图
      isrequired: '1',
      learnisrequired:1,
      learnTime: 0,
      testModal: false,
      testList:[],//关联考试
    };
  }
  componentDidMount() {
    // this.setInitialValue(this.props.initialValue);
    this.getData()
    this.getCountryData()
  }
  componentDidUpdate() {

  }
  componentWillUnmount() {
  }
  onDownLoad(url) {
    exportExcelService(url, null, this.state.fileName);
  }
  setInitialValue = (data) => {
    const { content } = this.props;
    content.map(item=> {
      this.props.form.setFieldsValue({[item.key]: data[item.key]})
    });
  }
  getData=()=>{
    let me= this
    axios.get('http://api.yytianqi.com/citylist/id/2')
    .then(function (response) {
        let Data = response.data
        Data.name = '中国'
        let list = []
        list.push(response.data)
        me.dealCityData(list)
        me.setState({dp:list,List:list})
    })
    .catch(function (error) {
    });
  }
  getCountryData=()=>{
    let me= this
    axios.get('http://api.yytianqi.com/citylist/id/3')
    .then(function (response) {
        let Data = response.data
        me.dealCityData(Data)

        me.setState({belongsData:Data})
    })
    .catch(function (error) {
    });
  }
  onChangSelect = (value) => {
    this.setState({ type:value});
  }
  wordCount = (value) => {
    this.props.form.setFieldsValue({content:value})
  }
  handleInput = (url,qilter) => {
    this.props.getData(url);
  }
  timePushCancel = () => {
    this.setState({ pushModal: false });
    this.props.form.setFieldsValue({ isTimePush: false });
  }
  timePush = () => {
    this.props.setTimePushData(this.state.timePushValue);
    this.setState({ pushModal: false });
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.checkTreeData !== prevState.checkTreeData) {
      return { checkTreeData: nextProps.checkTreeData, updateCheckTree: true };
    }
    if (nextProps.selectTreeData !== prevState.selectTreeData) {
      return { selectTreeData: nextProps.selectTreeData, updateTree: true };
    }
    if (nextProps.uploadData !== prevState.uploadData) {
      return { uploadData: nextProps.uploadData, updatePicture: true };
    }
    if (nextProps.editorData !== prevState.editorData) {
      return { editorData: nextProps.editorData, updateEditor: true };
    } if (nextProps.uploadSpecial !== prevState.uploadSpecial) {
      return { uploadSpecial: nextProps.uploadSpecial, specialStatus: true };
    }
    if (nextProps.selectRowsData !== prevState.selectRowsData) {
      return { selectRowsData: nextProps.selectRowsData, numStatus: true };
    }
    return null;
  }

  onRadioChange = (e, key) => {
    this.setState({ RadioValue: e.target.value });
    this.props.form.setFieldsValue({ [key]: e.target.value });
  };
  get = (key) => {
    return this.props.form.getFieldValue(key);
  }
  set = (key, value) => {
    this.props.form.setFieldsValue({ [key]: value });
  }
  handleBtn = (item, get, set) => {
    item.onClick(item.key, get(item.key), set);
  }


  render() {
    const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const { disabled, initialValue} = this.props;
    const getFieldDecorator = this.props.form.getFieldDecorator;
    const { testList } = this.state;
    console.log('----------------FormWrapper--------------->',this.props)
    console.log('================FormWrapper===============>',this.state)
    let content = this.props.content.map((item, index) => {
      return (
        <React.Fragment key={index}>
            {
                item.type === 'Input' ? 
                (
                    <Form.Item {...formItemLayout} label={item.label}>
                        {
                            getFieldDecorator(item.key, {rules: [{type:'string',required: item.required,whitespace: true,message: `${item.label}必填项`}]})
                            (<Input className="input" placeholder="请输入关键字" disabled={disabled}/>)
                        }
                    </Form.Item>
                ) 
                : item.type === 'InputButton' ? 
                (
                    <Form.Item {...formItemLayout} label={item.label}>
                        {
                            getFieldDecorator(item.key, {
                                rules: [
                                  {
                                    required: item.required,
                                    whitespace: item.required,
                                    max: item.max,
                                    message: `${item.label}为必填项`,
                                  }
                                ]
                            })
                            (<Input className="input" placeholder="请输入关键字" disabled={disabled}/>)
                        }
                        {
                            item.ButtonList ? item.ButtonList.map(i => {
                                return (
                                    <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                                )
                            }) : null
                        }
                    </Form.Item>
                ) 
                : item.type === 'inputNumber' ? 
                (
                    <Form.Item {...formItemLayout} label={item.label}>
                        {
                            getFieldDecorator(item.key, {
                                initialValue: 1000,
                                rules: [
                                  {
                                    type: 'integer',
                                    required: item.required,
                                    whitespace: true,
                                    message: `${item.label}为必填项`,
                                  }
                                ]
                            })
                            (<InputNumber className="input" min={0} disabled={disabled} onChange={value => { } } />)
                        }
                    </Form.Item>
                )
                : item.type === 'radioButton' ? 
                (
                    <Form.Item {...formItemLayout} label={item.label}>
                        {
                            getFieldDecorator(item.key, {
                                initialValue: item.option[0].value,
                                rules: [
                                  {
                                    type: typeof item.option[0].value,
                                    required: item.required,
                                    whitespace: true,
                                    message: `${item.label}为必填项`,
                                  }
                                ]
                            })
                            (<RadioGroup disabled={disabled} options={item.option} onChange={e => {}}/>)
                        }
                    </Form.Item>
                )
                : item.type === 'Select' ? 
                (
                    <Form.Item {...formItemLayout} label={item.label}>
                        {
                            getFieldDecorator(item.key, {
                                initialValue: '1',
                                rules: [
                                  {
                                    type:'string',
                                    required: item.required,
                                    whitespace: true,
                                    message: `${item.label}必填项`,
                                  }
                                ]
                            })
                            (
                                <Select placeholder="请输入关键字" disabled={disabled} onChange={this.onChangSelect} style={{ width: '300px' }} >
                                    {
                                        item.option &&item.option.map(_ => {return <Option key={_.key} value={_.key}>{_.value}</Option>})
                                    }
                                </Select>
                            )
                        }
                    </Form.Item>
                ) 
                : item.type === 'SelectButton' ? 
                (
                    <Form.Item {...formItemLayout} label={item.label}>
                        {
                            getFieldDecorator(item.key, {
                                initialValue:'1',
                                rules: [
                                  {
                                    required: item.required,
                                    whitespace: item.required,
                                    max: item.max,
                                    message: `${item.label}为必填项`,
                                  }
                                ]
                            })
                            (
                                <Select style={{width:360}} >
                                    {
                                        testList&&testList.map((e,index)=><Option value={e.id} key={e.id} >{e.name}</Option>)
                                    }
                                </Select>
                            )
                        }　　　
                        {
                            item.ButtonList ? item.ButtonList.map(i => {
                                return (
                                    <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                                )
                            }) : null
                        }
                    </Form.Item>
                ) 
                : item.type === 'textArea' ? 
                (
                    <Form.Item {...formItemLayout} label={item.label}>
                        {
                            getFieldDecorator(item.key, {
                                initialValue:'内容',
                                rules: [
                                  {
                                    required: item.required,
                                    whitespace: true,
                                    message: `${item.label}必填项`,
                                  }
                                ]
                            })
                            (<TextArea className="textarea" placeholder="请输入关键字" disabled={disabled}/>)
                        }
                    </Form.Item>
                ) 
                : item.type === 'cascader' ? 
                (
                    <Form.Item {...formItemLayout} label={item.label}>
                        {
                            getFieldDecorator(item.key, {
                                initialValue:[],
                                rules: [
                                  {
                                    type: 'array',
                                    required: item.required,
                                    whitespace: true,
                                    message: `${item.label}必填项`,
                                  }
                                ]
                            })
                            (<Cascader className='input' className="input" options={this.state.dp} placeholder="请输入关键字" disabled={disabled} changeOnSelect />)
                        }
                    </Form.Item>
                )
                : item.type === 'datePicker' ? 
                (
                    <Form.Item {...formItemLayout} label={item.label}>
                        {
                            getFieldDecorator(item.key, {
                                rules: [
                                  {
                                    type: 'object',
                                    required: item.required,
                                    whitespace: true,
                                    message: `${item.label}必填项`,
                                  }
                                ]
                            })
                            (<DatePicker disabled={disabled} />)
                        }
                    </Form.Item>
                ) 
                : item.type === 'rangePicker' ? 
                (
                    <Form.Item {...formItemLayout} label={item.label}>
                        {
                            getFieldDecorator(item.key, {
                              rules: [
                                {
                                  type: 'array',
                                  required: item.required,
                                  whitespace: true,
                                  message: `${item.label}必填项`,
                                }
                              ]
                            })
                            (<RangePicker className="input" disabled={disabled} />)
                        }
                    </Form.Item>
                ) 
                : item.type === 'checkTree' ? 
                (
                    <Form.Item {...formItemLayout} label={item.label}>
                        {
                            getFieldDecorator(item.key, {
                                initialValue: [],
                                rules: [
                                  {
                                    type: 'array',
                                    required: item.required,
                                    whitespace: true,
                                    message: `${item.label}必填项`,
                                  }
                                ]
                            })
                            (
                                <SingleTree
                                    moduleType={this.props.type}
                                    type={item.type}
                                    disabled={disabled}
                                    style={this.props.style}
                                    allData={this.state.allData}
                                    leaveData={this.props.leaveData[this.props.belonged][item.key]}
                                    flowData={this.props.flowData[item.key]}
                                    initialValue={initialValue ? initialValue[item.key] : ''}
                                />
                            )
                        }
                    </Form.Item>
                ) 
                : item.type === 'uploadPicture' ? 
                (
                    <Form.Item {...formItemLayout} label={item.label}>
                        {
                            getFieldDecorator(item.key, {
                                initialValue: [],
                                rules: [
                                  {
                                    type:'array',
                                    required: item.required,
                                    whitespace: true,
                                    validator: (rule, value, callback) => {
                                        callback()
                                    }
                                  }
                                ]
                            })
                            (
                                <UploadPicture 
                                  keys={item.key} 
                                  type={item.type} 
                                  modal={this.props.type} 
                                  isRadio={item.isRadio} 
                                  RadioValue={this.state.RadioValue}
                                  isAttach={item.isAttach ? true : false}
                                  isRadio={item.isRadio ? true : false}
                                  isIamge={item.isIamge ? true : false}
                                  initialValue={this.props.initialValue ? this.props.initialValue[item.key] : this.props.flowData[item.key] ? this.props.flowData[item.key] : this.props.leaveData ? this.props.leaveData[this.props.belonged][item.key] : ''} describe={item.describe} mode={item.label} />
                            )
                        }
                    </Form.Item>
                ) 

                : item.type === 'richText' ? 
                (
                    <Form.Item {...formItemLayout} label={item.label}>
                        {
                            getFieldDecorator(item.key, {
                              rules: [
                                {
                                  required: item.required,
                                  message: `${item.label}为必填项`,
                                  whitespace: true,
                                }
                              ]
                            })
                            (
                                <RichText 
                                    wordCount={this.wordCount} 
                                    disabled={disabled} 
                                    initialValue={initialValue ? initialValue[item.key] : ''} 
                                    flowData={this.props.flowData[item.key]} 
                                    leaveData={this.props.leaveData[this.props.belonged][item.key]} 
                                />
                            )
                        }
                    </Form.Item>
                )
                : item.type === 'relation' ? 
                (
                    <div>
                        <Form.Item {...formItemLayout} label="关联类型">
                            {
                                getFieldDecorator('relationType', {
                                  initialValue: 1,
                                  rules: [
                                    {
                                      type:'number',
                                      required: false,
                                      whitespace: true,
                                      message: '关联类型必填项',
                                    }
                                  ]
                                })
                                (<RadioGroup disabled={disabled} options={item.option} onChange={value=>{}}/>)
                            }
                        </Form.Item>
                        <Form.Item {...formItemLayout} label={'相关地址'}>
                            {
                                getFieldDecorator('relationAddress', {
                                    initialValue: '',
                                    rules: [
                                      {
                                        required: false,
                                        whitespace: true,
                                        message: '必填项',
                                      }
                                    ]
                                })
                                (<Input className="input" readOnly={false} disabled={disabled} />)
                            }
                        </Form.Item>
                    </div>
                ) 
                : item.type === 'isTimePush' ?
                <Row>
                    <div>
                        <Form.Item style={{ width: '100%' }} {...formItemLayout} label="是否定时发送">
                            {
                                getFieldDecorator(item.key, {
                                    initialValue: false,
                                    rules: [
                                      {
                                        type: 'boolean',
                                        required: item.required,
                                        whitespace: true,
                                        message: '必填项',
                                      }
                                    ]
                                })
                                (<RadioGroup disabled={disabled} options={item.option} onChange={e => { }} />)
                            }
                            {
                              <span onClick={() => this.setState({ pushModal: true })}>{this.state.pushTime}</span>
                            }
                        </Form.Item>
                    </div>
                </Row>
                : item.type === 'video' ?
                    <Row>
                        <Col >
                            <Form.Item {...formItemLayout} label={item.label}>
                                {
                                    getFieldDecorator('videoUrl', {
                                        rules: [
                                          {
                                            required: item.required,
                                            whitespace: item.required,
                                            max: item.max,
                                            message: `视频地址为必填项`,

                                          }
                                        ]
                                    })
                                    (<Input className="input" placeholder="请输入视频地址" disabled={disabled}/>)
                                }
                            </Form.Item>
                        </Col>
                        <Col >
                            <Form.Item {...formItemLayout} label={'视频时长'}>
                                {
                                    getFieldDecorator('videoTime', {
                                        initialValue:1000,
                                        rules: [
                                          {
                                            type:'number',
                                            required: item.required,
                                            whitespace: item.required,
                                            message: `视频地址为必填项`,
                                          }
                                        ]
                                    })
                                    (<InputNumber className="input" placeholder="请输入视频时长" disabled={disabled} min={0} max={10000}/>)
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                : null
            }
        </React.Fragment>
      );
    });
    return <div>
      {content}
      <Modal
          visible={this.state.imgModal}
          onCancel={() => this.setState({ imgModal: false })}
          footer={null}
          destroyOnClose
      >
          <img src={this.state.imgValue} style={{ width: '520px', height: '300px' }}/>
      </Modal>
      <Modal
          title="定时发布"
          visible={this.state.timeModal}
          footer={null}
          onCancel={() => this.setState({ timeModal: false })}
          destroyOnClose
      >
          <DatePicker 
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={disabledDate}
              onChange={str => this.setState({ timePushValue: str })}
              showTime 
          />
          <Button className="resetBtn" onClick={() => this.setState({ timeModal: false })}>取消</Button>
          <Button className="queryBtn" onClick={this.timePush}>确定</Button>
      </Modal>

    </div>;
  }
}