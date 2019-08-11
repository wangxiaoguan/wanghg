import React, { Component } from 'react';
import { Form, Select, InputNumber, Input, DatePicker, Popconfirm, Radio, Button, Modal, Cascader, Row, Col, Icon } from 'antd';
import SingleTree from './SingleTree';
import UploadPicture from './uploadPic';
import RichText from '../richTexteditor/editor';
import moment from 'moment';
import { connect } from 'react-redux';
import FormAndInput from '../../component/table/FormAndInput';
import { BEGIN } from '../../../redux-root/action/table/table';
import { setTimePushData } from '../../../redux-root/action/eventAndInfoData/timePushData';
import { postService, getService } from '../../content/myFetch';
import ServiceApi, { masterUrl, PictrueUrl, UploadUrl,ChooseUrl,API_FILE_VIEW_INNER } from '../../content/apiprefix';
import { exportExcelService } from '../.././content/myFetch';
import TableSearch from '../table/TableSearch';
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const FormItem = FormItem;


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
  uploadData: state.uploadPicture.uploadPictureData,          //图片上传数据
  uploadSpecial: state.uploadPicture.contentPictureData,      //描述图片，附件，视频上传
  selectTreeData: state.tree.treeSelectData.column,           //选择树数据
  checkTreeData: state.tree.treeCheckData.column,             //多选树数据
  editorData: state.editor.editorData,                        //富文本数据
  pageData: state.table.pageData,                             //封装表格分页查询条件数据
  selectRowsData: state.table.selectRowsData,                 //封装表格选择数据
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
      partyOrganization: [],//党组织机构的数据
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
      isrequired: '1',
      learnisrequired:1,
      learnTime: 0,
      testModal: false,
      testList:[],//关联考试
    };
  }
  //下载
  onDownLoad(url) {
    exportExcelService(url, null, this.state.fileName);
  }

  // 设置回填数据
  setInitialValue = (data) => {
    const { content } = this.props;
    content.map(item =>{
      this.props.form.setFieldsValue({[item.key]: data[item.key]})
    });
  }
  componentDidMount() {
    if(this.props.initialValue){
      this.setInitialValue(this.props.initialValue);
    }else if(this.props.flowData){
      this.setInitialValue(this.props.flowData);
    }else if(this.props.leaveData){
      this.setInitialValue(this.props.leaveData);
    }
  }
  dealData=(data)=>{
    data.map(item => {
      item.value = item.id ;
      item.label = item.name;
      item.children = item.List;
      if (item.List) {
        this.dealData(item.List);
      }
    })
  }
 
  infoTypeChange = (value) => {
    this.setState({ infoType: value });
  }
  requiredChange = (value) => {
    this.setState({ isrequired: value })
  }
  learnChange = (value) => {
    this.setState({ learnisrequired: value})
  }
  onLiveChange = (e) => {
    this.setState({ liveType: e.target.value });
  }
  onRelationChange = (e) => {
    this.props.form.setFieldsValue({ relationAddress: '' });
    this.setState({ relation: e.target.value });
  }

 
  //输入框输入值的变化
  handleInput = (e, url, type, qilter) => {
    this.props.getData(ServiceApi + `${url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}${qilter}`);
  }
  //根据选择，展示 部门或者党组织
  onBelongChange = (e) => {
    if (e.target.value == '1') {//传入部门数据
      this.setState({ belongsData: this.state.dp });
    } else if (e.target.value == '2') {//传入党组织数据
      this.setState({ belongsData: this.state.partyOrganization });
    }
  }
  timePushCancel = () => {
    this.setState({ pushModal: false });
    this.props.form.setFieldsValue({ isTimePush: false });
  }
  timePush = () => {
    this.props.setTimePushData(this.state.timePushValue);
    this.setState({ pushModal: false });
  }
  removeDuplicatedItem = (arr) => {
    var ret = [];
    for (var i = 0, j = arr.length; i < j; i++) {
      if (arr[i] != undefined) {
        if (ret.indexOf(arr[i]) === -1) {
          ret.push(arr[i]);
        }
      } else {
        ret.push(arr[i])
      }
    }
    return ret;
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
  componentDidUpdate() {
    const { selectTreeData, checkTreeData, uploadData, editorData, uploadSpecial, num } = this.props;
    const { pictureKey, specialStatus, contentKey, enclosureKey, shoppingId, shoppingNum ,testname} = this.state;
    if (this.state.numStatus) {
      const merchants = "merchants" + this.props.num;
      let obj = {}
      if (this.props.selectRowsData.length != 0) {
        if (shoppingId.length == 0) {
          const num2 = num - 1;
          shoppingId[num2] = this.props.selectRowsData[0].id
        } else {

          if (shoppingNum.some(item => item == num)) {
            shoppingId.splice(num - 1, 1, this.props.selectRowsData[0].id)
          } else {
            shoppingId.push(this.props.selectRowsData[0].id)
          }
        }
        const shoppingId1 = this.removeDuplicatedItem(shoppingId)
        this.setState({
          shoppingId: shoppingId1
        }, () => {
        })
        obj[merchants] = this.props.selectRowsData[0].lastname;
      }
      this.props.form.setFieldsValue(obj);
      this.setState({ numStatus: false });
    }

    if (this.state.updateTree) {
      this.props.form.setFieldsValue({
        [this.state.treeKey]: selectTreeData
          ? selectTreeData : [],
      });
      this.setState({ updateTree: false });
    }
    if (this.state.updateCheckTree) {
      this.props.form.setFieldsValue({
        [this.state.checkTreeKey]: checkTreeData
          ? checkTreeData : [],
      });
      this.setState({ updateCheckTree: false });
    }
    if (this.state.updatePicture) {
      let content = '';
      // this.state.pictureKey.map(item=>{
      if (uploadData && JSON.stringify(uploadData) !== '[]') {
        uploadData[pictureKey] && uploadData[pictureKey].map(item => {
          if (item.response && item.response !== '') {
            if (content === '') {
              content = masterUrl + item.response.entity[0].filePath;
            } else {
              content = content + ',' + masterUrl + item.response.entity[0].filePath;
            }
          } else {
            if (content === '') {
              content = item.url;
            } else {
              content = content + ',' + item.url;
            }
          }
        });
        this.props.form.setFieldsValue({
          [pictureKey]: [content],
        });
      }

      // });

      this.setState({ updatePicture: false });
    }
    if (specialStatus) {

      let data = uploadSpecial;
      let picOption = this.state.picOption;
      if (data.type && !picOption[data.type]) {
        picOption[data.type] = [];
      }
      if (data.content) {
        this.isPush = true;
        for (let index = 0; index < picOption[data.type].length; index++) {
          if (picOption[data.type][index]) {
            if (picOption[data.type][index].uid !== undefined) {
              if (data.content.uid === picOption[data.type][index].uid) {
                picOption[data.type][index] = data.content;
                this.isPush = false;
                break;
              } else {
                this.isPush = true;
              }
            } else
              if (picOption[data.type][index].id !== undefined) {
                if (data.key === picOption[data.type][index].id) {
                  picOption[data.type][index] = data.content;
                  this.isPush = false;
                  break;
                } else {
                  this.isPush = true;
                }
              } else {
                this.isPush = true;
              }
          }
        }
        if (this.isPush) {
          picOption[data.type].push(data.content);
        }
        this.setState({ specialStatus: false, picOption });
        this.props.form.setFieldsValue({ [uploadSpecial.type]: picOption[data.type] });
      } else if (data.key !== undefined) {
        picOption[data.type] = picOption[data.type].filter(item => item && (item.id !== data.key));
        this.setState({ specialStatus: false, picOption });
        this.props.form.setFieldsValue({ [uploadSpecial.type]: picOption[data.type] });
      }
    }
    if (this.state.updateEditor) {
      this.props.form.setFieldsValue({
        [this.state.richTextKey]: editorData ? editorData : [],
      });
      this.setState({ updateEditor: false });
    }
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
  getDetailByTypeId = (id) => {
    switch (id) {
      case '1':
        return { url: '', code: '', desp: '文章', qilter: '' };
      case '2':
        return { url: '', code: '', desp: '活动', qilter: '' };
      case '3':
        return { url: '', code: '', desp: '链接', qilter: '' };
      case '4':
        return { url: '', code: '', desp: '杂志', qilter: ''};
      default:
        return { url: '', code: '', desp: '其他', qilter: '' };
    }
  }
  handleAddModalOK = () => {
    let url = '';
    let selectRowsData = this.props.selectRowsData[0];
    switch (this.state.relation) {
      case '1':
        url = `http://www.urlgenerator.com?objectType=1&type=${selectRowsData.type}&isAtlas=${selectRowsData.isatlas}&id=${selectRowsData.id}`;
        break;
      case '2':
        url = `http://www.urlgenerator.com?objectType=2&type=${selectRowsData.typeId}&id=${selectRowsData.id}`;
        break;
      case '4':
        url = `http://www.urlgenerator.com?objectType=5&id=${selectRowsData.id}`;
        break;
      default:
        break;
    }
    this.props.form.setFieldsValue({ relationAddress: url });
    this.setState({ showAddModal: '0' });
  }
  add = () => {
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    this.setState({shopping: nextKeys});
    uuid++;
    this.props.form.setFieldsValue({keys: nextKeys})
  }
 
  render() {
    const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const { getFieldValue } = this.props.form;
    const { form: { getFieldDecorator }, disabled, initialValue} = this.props;
    const { infoType, liveType, relation,testList,learnisrequired} = this.state;
    let content = this.props.content.map((item, index) => {
      return (
        <React.Fragment key={index}>
          {item.hide && item.hide.some(_ => _ === infoType) ? null 
            :item.type === 'select' ? 
            (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {rules: [{type: 'number',required: item.required,whitespace: true,message: `${item.label}必填项`}]})
                  (
                    <Select className="select" getPopupContainer={trigger => trigger.parentNode} disabled={false}>
                      {
                        item.option &&item.option.map(e => {return (<Option key={e.key} value={e.key}> {e.value}</Option>)})
                      }
                    </Select>
                  )
                }
                {
                  item.ButtonList?item.ButtonList.map(i => {return (<Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>)}) : null
                }
              </FormItem>
            ) 
            : item.type === 'rangePicker' ? 
            (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {rules: [{type: 'array',required: item.required,whitespace: true,message: `${item.label}必填项`}]})
                  (<RangePicker className="input" disabled={disabled} />)
                }
                {
                  item.ButtonList?item.ButtonList.map(i => {return (<Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>)}) : null
                }
              </FormItem>
            ) 
            : item.type === 'input' ? 
            (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {rules: [{required: item.required,whitespace: item.required,max: item.max,message: `${item.label}为必填项,且最大长度不能超过${item.max}`}]})
                  (<Input className="input1" placeholder="请输入关键字" disabled={disabled}/>)
                }
                {
                  item.ButtonList?item.ButtonList.map(i => {return (<Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>)}) : null
                }
              </FormItem>
            ) 
            : item.type === 'relation_test' ? 
            (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {
                    rules: [{required: item.required,whitespace: item.required,max: item.max,message: `${item.label}为必填项`}],
                    initialValue:testList.length>0?testList[0].id:''
                  })
                  (
                    <Select style={{width:360}} >
                      {
                        testList&&testList.map((item1,index)=><Option value={item1.id} key={item1.id} >{item1.name}</Option>)
                      }
                    </Select>
                  )
                }　　　
                {
                  <Button onClick={this.testClick}>选择考试</Button>
                }
              </FormItem>
            ) 
            : item.type === 'selectTree' || item.type === 'checkTree' ? 
            (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {
                    initialValue: [],
                    rules: [{type: 'array',required: item.required,whitespace: true, message: `${item.label}必填项`}]
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
              </FormItem>
            ) 
            : item.type === 'datePicker' ? 
            (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {rules: [{type: 'object',required: item.required,whitespace: true,message: `${item.label}必填项`}]})
                  (<DatePicker disabled={disabled} />)
                }
                {
                  item.ButtonList ? item.ButtonList.map(i => {return (<Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>)}) : null
                }
              </FormItem>
            ) 
            : item.type === 'inputNumber' ? 
            (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {
                    rules: [{type: 'integer',required: item.required,whitespace: true,message: `${item.label}为必填项,且必须为整数！`}],
                    initialValue: 0,
                  })
                  (<InputNumber className="input1" min={0} disabled={disabled} onChange={(value) => this.handleTreasureChange(value, item.key)} />)
                }
                {
                  item.ButtonList?item.ButtonList.map(i => {return (<Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>)}) : null
                }
              </FormItem>
            ) 
            : item.type === 'inputNumber1' ? 
            (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {rules: [{type: 'number',required: item.required,whitespace: true,message: `${item.label}为必填项,且必须为整数！` }]})
                  (<InputNumber className="input1"  />)
                }
                分钟
              </FormItem>
            )  
            :item.type === 'inputNumber2'? 
            (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {
                    rules: [{type: 'integer',required: item.required,whitespace: true,message: `${item.label}必须为整数！`}],
                    initialValue: 2,
                  })
                  (<InputNumber className="input1"  />)
              }
              </FormItem>
            )
            : item.type === 'uploadPicture_drop' ||item.type === 'uploadPicture_button' ? 
            (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {
                    initialValue: [],
                    rules: [{type:'array',required: item.required,whitespace: true,message: `${item.label}为必填项`}]
                  })
                  (
                    !disabled ? (
                      <UploadPicture keys={item.key} type={item.type} modal={this.props.type} isRadio={item.isRadio} RadioValue={this.state.RadioValue}
                        isAttach={item.isAttach ? true : false}
                        isRadio={item.isRadio ? true : false}
                        isIamge={item.isIamge ? true : false}
                        initialValue={this.props.initialValue ? this.props.initialValue[item.key] : this.props.flowData[item.key] ? this.props.flowData[item.key] : this.props.leaveData ? this.props.leaveData[this.props.belonged][item.key] : ''} describe={item.describe} mode={item.label} />
                    ) : (
                        <div>
                          <Button onClick={() => this.setState({ img_review: item.isIamge ? true : false, isAttach: item.isAttach ? true : false, isRadio: item.isRadio ? true : false, fileName: item.type === 'uploadPicture_drop' ? initialValue[item.key] : initialValue[item.key][0].response.entity[0].fileName, imgValue: item.type === 'uploadPicture_drop' ? initialValue[item.key] : initialValue[item.key][0].response.entity[0].filePath })}>查看</Button>
                        </div>
                      )
                  )
                }
              </FormItem>
            ) 
            : item.type === 'radioButton'? 
            (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {
                    initialValue: '1',
                    rules: [{type: 'string',required: item.required,whitespace: true, message: `${item.label}为必填项`}]
                  })
                  (<RadioGroup disabled={disabled} options={item.option} onChange={e => this.onRadioChange(e, item.key)}/>)
                }
                {
                  item.ButtonList ?item.ButtonList.map(i => {return (<Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>)}) : null
                }
              </FormItem>
            ):item.type === 'richText' ? 
            (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {rules: [{required: item.required,message: `${item.label}为必填项`,whitespace: true}]})
                  (
                    <RichText 
                      wordCount={this.wordCount.bind(this)} 
                      disabled={disabled} 
                      initialValue={initialValue ? initialValue[item.key] : ''} 
                      flowData={this.props.flowData[item.key]} 
                      leaveData={this.props.leaveData[this.props.belonged][item.key]} 
                    />
                  )
                }
              </FormItem>
            )
            : item.type === 'textArea' ?
            (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {rules: [{required: item.required,whitespace: true,message: `${item.label}必填项`}]})
                  (<TextArea className="textarea" placeholder="请输入关键字" disabled={disabled}/>)
                }
              </FormItem>
            )
            :item.type === 'cascader'?
            (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {rules: [{type: 'array',required:item.required,whitespace: true,message: `${item.label}必填项`}]})
                  (<Cascader className="input" options={this.state.dp} placeholder="请输入关键字" disabled={disabled} changeOnSelect />)
                }
                {
                  item.ButtonList ?item.ButtonList.map(i => {return (<Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>)}) : null
                }
              </FormItem>
            ) : item.type === 'isrequired' ? (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {
                    initialValue: '',
                    rules: [{type:'number',required: item.required,whitespace: true,message: `${item.label}必填项`}]
                  })
                  (
                    <Select disabled={disabled} onChange={this.requiredChange} style={{ width: '300px' }}>
                      {
                        item.option &&item.option.map(_ => {return (<Option key={_.key} value={_.key}>{_.value}</Option>)})
                      }
                    </Select>
                  )
                }
              </FormItem>
            ) :item.type === 'isrequired_learn' ? 
            (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {
                    initialValue: learnisrequired,
                    rules: [{type:'number',required: item.required,whitespace: true,message: `${item.label}必填项`}]
                  })
                  (
                    <Select disabled={disabled} onChange={this.learnChange} style={{ width: '300px' }}>
                      {
                        item.option&&item.option.map(_ => {return (<Option key={_.key} value={_.key}>{_.value}</Option>)})
                      }
                    </Select>
                  )
                }
              </FormItem>
            ): item.type === 'information_type' ? (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {
                    initialValue: '1',
                    rules: [{type:'string',required: item.required,whitespace: true,message: `${item.label}必填项`}]
                  })
                  (
                    <Select placeholder="请输入关键字" disabled={disabled} onChange={this.infoTypeChange} style={{ width: '300px' }}>
                      {
                        item.option &&item.option.map(_ => {return (<Option key={_.key} value={_.key}>{_.value}</Option>)})
                      }
                    </Select>
                  )
                }
              </FormItem>
            ) 
            : item.type === 'live_type' ? 
            (
              <div>
                <FormItem {...formItemLayout} label="直播" >
                  {
                    getFieldDecorator(item.key, {
                      initialValue: true,
                      rules: [{type: 'boolean',required: item.required,whitespace: true,message: '直播为必填项'}]
                    })
                    (
                    <RadioGroup disabled={disabled} options={[{ label: '是', value: true },{ label: '否', value: false }]} onChange={this.onLiveChange} />
                    )
                  }
                </FormItem>
                {
                  liveType == true ?
                    <React.Fragment>
                      <FormItem {...formItemLayout} label="频道">
                        {
                          getFieldDecorator('channel', {
                            initialValue: '',
                            rules: [{required: true,whitespace: true,max: 100,message: '频道为必填项,且最大长度不能超过100'}]
                          })
                          (<Input disabled={disabled} />)
                        }
                      </FormItem>
                      <FormItem {...formItemLayout} label="频道内容">
                        {
                          getFieldDecorator('channelcontent', {
                            initialValue: '',
                            rules: [{required: false,whitespace: true,max: 100,message: '必填项,且最大长度不能超过100',}]
                          })
                          (<Input disabled={disabled} />)
                        }
                      </FormItem>
                    </React.Fragment>
                  : null
                }
              </div>
            ) 
            :item.type === 'relation'? 
            (
              <div>
                <FormItem {...formItemLayout} label="关联类型">
                  {
                    getFieldDecorator('relationType', {
                      initialValue: '1',
                      rules: [{required: false,whitespace: true,message: '关联类型必填项',}]
                    })
                    (
                      <RadioGroup disabled={disabled} options={[{ label: '文章', value: '1' },{ label: '活动', value: '2' },{ label: '链接', value: '3' },{ label: '杂志', value: '4' }]} onChange={this.onRelationChange}/>
                    )
                  }
                </FormItem>
                <FormItem {...formItemLayout} label={'相关' + `${this.getDetailByTypeId(relation).desp}` + '地址'}>
                  {
                    getFieldDecorator('relationAddress', {
                      initialValue: '',
                      rules: [{required: false,whitespace: true,message: '必填项'}]
                    })
                    (<Input className="input1" readOnly={relation !== '3' ? true : false} disabled={disabled} />)
                  }
                  {
                    relation !== '3' ? <Button style={{ marginLeft: '5px' }} onClick={() => this.setState({ showAddModal: relation })}>添加{this.getDetailByTypeId(relation).desp}</Button> : null
                  }
                </FormItem>
              </div>
            ) 
            :item.type === 'belong'?
            (

                <FormItem {...formItemLayout} label="资讯归属">
                  {
                    getFieldDecorator('belongOrgType', {
                      initialValue: '1',
                      rules: [{required: item.required,whitespace: true,message: '资讯归属必填项'}]
                    })
                    (<RadioGroup options={[{ label: '部门', value: '1' },{ label: '组织', value: '2' }]} onChange={this.onBelongChange} disabled={disabled}/>)
                  }
                </FormItem>
            )
            :item.type === 'belongSelect'?
            (
              <FormItem {...formItemLayout} label={<span />}>
                {
                  getFieldDecorator(item.key,{rules: [{type: 'array',required: item.required,whitespace: true,message: '必填项'}]})
                  (<Cascader className="input" options={this.state.belongsData} placeholder="请输入关键字" disabled={disabled} changeOnSelect />)
                }
              </FormItem>
            )
            : item.type === 'isTimePush' ?
            (
                <FormItem  {...formItemLayout} label={item.label}>
                  {
                    getFieldDecorator(item.key, {
                      initialValue: false,
                      rules: [{type: 'boolean',required: item.required,whitespace: true,message: '必填项'}]
                    })
                    (
                      <RadioGroup
                        disabled={disabled}
                        options={[{ label: '是', value: true },{ label: '否', value: false }]}
                        onChange={e => {
                          if (e.target.value) {
                            this.setState({ pushModal: true });
                          } else {
                            this.props.setTimePushData('');
                            this.setState({ timePushValue: '' });
                          }
                        }}
                      />
                    )
                  }
                  {
                    this.props.style === 'detail' ? <span>{this.state.timePushValue}</span> : <span onClick={() => this.setState({ pushModal: true })}>{this.state.timePushValue}</span>
                  }
              </FormItem>
            )
            :item.type === 'video' ?
            (
              <FormItem {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator('videoUrl', {rules: [{required: item.required,whitespace: item.required,max: item.max,message: `视频地址为必填项`}]})
                  (<Input className="input1" placeholder="请输入视频地址" disabled={disabled}/>)
                }
              </FormItem>
            )
            :null
          }
        </React.Fragment>
      )
    })
    return <div>
      {content}
      <Modal
        className="img-review-modal"
        visible={this.state.visible}
        onCancel={() => this.setState({ visible: false })}
        footer={null}
        destroyOnClose
      >
      <img src={API_FILE_VIEW_INNER + this.state.imgValue} style={{ width: '520px', height: '300px' }} />
      <video id="my-player" className="video-js" controls preload="auto" poster="" data-setup="{}"><source src={this.state.imgValue} type="video/mp4" /></video>
      <a className="attach" href={API_FILE_VIEW_INNER+this.state.imgValue} download={API_FILE_VIEW_INNER+this.state.fileName}>{this.state.fileName}</a>

      }
        
      </Modal>
      <Modal
        title="定时发布"
        visible={this.state.pushModal}
        footer={null}
        onCancel={this.timePushCancel}
        destroyOnClose={true}>
        <label style={{ marginRight: '10px' }}>定时发布时间</label>
        <DatePicker format="YYYY-MM-DD HH:mm:ss"
          disabledDate={disabledDate}
          //disabledTime={disabledDateTime}
          onChange={(moment, str) => this.setState({ timePushValue: str })}
          showTime />
        <Button className="resetBtn" onClick={this.timePushCancel}>取消</Button>
        <Button className="queryBtn" onClick={this.timePush}>确定</Button>
      </Modal>
    </div>;
  }
}