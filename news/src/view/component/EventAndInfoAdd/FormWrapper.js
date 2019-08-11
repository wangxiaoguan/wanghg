import React, { Component } from 'react';
import { Form, Select, InputNumber, Input, DatePicker, Popconfirm, Radio, Button, Modal, Cascader, Row, Col, Icon } from 'antd';
// const masterUrl = 'http://10.110.200.62:9080/';
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
  uploadData: state.uploadPicture.uploadPictureData,      //图片上传数据
  uploadSpecial: state.uploadPicture.contentPictureData,  //描述图片，附件，视频上传
  selectTreeData: state.tree.treeSelectData.column,       //选择树数据
  checkTreeData: state.tree.treeCheckData.column,         //多选树数据
  editorData: state.editor.editorData,                    //富文本数据
  pageData: state.table.pageData,                         //封装表格分页查询条件数据
  selectRowsData: state.table.selectRowsData,             //封装表格选择数据
}),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    setTimePushData: n => dispatch(setTimePushData(n)),
  }))
export default class FormWrapper extends Component {
  constructor(props) {
    super(props);
    console.log('props==>', props)
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
  //下载
  onDownLoad(url) {
    exportExcelService(url, null, this.state.fileName);
  }

  /**
   * 设置回填数据
   */
  setInitialValue = (data) => {
 
    this.setState({learnisrequired:data.isrequired})
    if(data.examid){
      getService(ServiceApi + 'services/activity/examActivity/list/1/10?Q=id_S_LK='+data.examid, data => {
        if (data.retCode === 1) {
          let testList = data.root.list;
          this.setState({testList})
         
        }
      });
    }
    const { content } = this.props;

    content.map((item, index) => {
      if (!Array.isArray(item.key)) {
        if (data[item.key] !== undefined) {
          if (item.key === 'islive') {
            this.setState({ islive: data[item.key] });
          }
          if (item.key === 'picUrl' || item.key === 'fileUrl') {
            this.setState({ picOption: { [item.key]: data[item.key] } });
          }
          if (item.key === 'islive') {
            this.setState({ liveType: data[item.key] });
          }
          this.props.form.setFieldsValue({
            [item.key]: data[item.key],
          });
        }
        if (data['taskDate']) {         // 定时发布初始值
          this.setState({ timePushValue: data['taskDate'] });
        }
      } else {
        item.key && item.key.map((keyItem, index) => {              //杂志文章 是否上首页

          if (data[keyItem] !== undefined) {
            if (keyItem === 'indexImage') {
              this.setState({
                picOption: { [keyItem]: data[keyItem] },
              });
            }
            if (keyItem === 'isHomePage') {
              this.props.form.setFieldsValue({
                isHomePage: data['isHomePage'],
              }, () => {
                if (data['isHomePage']) {
                  if (this.props.indexImage) {
                    this.props.form.setFieldsValue({
                      indexImage: this.props.indexImage['indexImage'],
                      layout: this.props.indexImage['layout'],
                    });
                  }
                }
              });
            }
            if (index === 0) {
              this.setState({
                homeType: data[keyItem] ? true : false,
              });
            }
          }
        });
      }
    });
  }
  componentDidMount() {




    this.props.content.map(item => {
      if (item.type === 'selectTree') {
        this.setState({ selectTreeKey: item.key });
      } else if (item.type === 'checkTree') {
        this.setState({ checkTreeKey: item.key });
      } else if (item.type === 'richText') {
        this.setState({ richTextKey: item.key });
      } else if (
        item.type === 'uploadPicture_drop'
      ) {
        this.setState({ pictureKey: item.key });
      } else if (item.type === 'uploadPicture_button') {
        if (item.describe) {
          this.setState({ contentKey: item.key });
        } else {
          this.setState({ enclosureKey: item.key });
        }
      }
    });


    if (this.props.initialValue) {
      this.setInitialValue(this.props.initialValue);
    } else if (this.props.flowData && JSON.stringify(this.props.flowData) !== '{}') {
      this.setInitialValue(this.props.flowData);
    } else if (this.props.leaveData && JSON.stringify(this.props.leaveData) !== '{}') {
      this.setInitialValue(this.props.leaveData[this.props.belonged]);
    }
    this.getData()
    this.getCountryData()
  }

  getData=()=>{
    let me= this
    axios.get('http://api.yytianqi.com/citylist/id/2')
    .then(function (response) {
        console.log(response.data);
        let Data = response.data
        Data.name = '中国'
        let list = []
        list.push(response.data)
        console.log(list)
        me.dealCityData(list)

        me.setState({dp:list,List:list})
    })
    .catch(function (error) {
        console.log(error);
    });
  }
  getCountryData=()=>{
    let me= this
    axios.get('http://api.yytianqi.com/citylist/id/3')
    .then(function (response) {
        console.log(response.data);
        let Data = response.data
        me.dealCityData(Data)

        me.setState({belongsData:Data})
    })
    .catch(function (error) {
        console.log(error);
    });
  }
  componentWillUnmount() {

  }
  //处理组织机构中的数据
  dealCityData=(data)=>{
    data.map(item => {
      item.value = item.city_id;
      item.label = item.name;
      item.children = item.list;
      if (item.list) {
        this.dealCityData(item.list);
      }
    });
  }
  // 处理党组织关系的函数
  dealPartyOrganaitonData(po) {
    po.map((item, index) => {
      item.value = item.id + '';
      item.label = item.name;
      item.children = item.partyOrganizationList;
      if (item.partyOrganizationList) {
        this.dealPartyOrganaitonData(item.partyOrganizationList);
      }
    });

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
  //学习内容字数120字为一分钟
  wordCount = (value) => {
    this.setState({ learnTime: Math.ceil((value.length - 7) / 120) })
  }
  //  //添加投票类型
  //  onTopictypeChange=(e)=>{
  //   this.setState({ topicType: e.target.value});
  //   if(e.target.value==2){
  //     this.setState({urltypeShow:false,urlType:'0'})
  //   }else{
  //     this.setState({urltypeShow:true,urlType:'0'});

  //   }
  // }

  // //是否大图
  // onUrltypeChange=(e)=>{
  //   this.setState({ urlType: e.target.value});
  // }
  //关联考试
  testClick = () => {
    this.setState({ testModal: true })
  }
  //testmodal 取消
  testCancel = () => {
    this.setState({
      testModal: false,
    });
  }
  //testmodal确定
  testOk = () => {
    this.setState({
      testModal: false,
    });
    let selectedData=this.props.selectRowsData; //获取勾选的值
    this.setState({testList:selectedData})
  }
  //关联类型输入框输入值的变化
  handleInput = (e, url, type, qilter) => {
    this.props.getData(ServiceApi + `${url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=${type}_S_LK=${e.target.value}&&${qilter}`);
  }
  //根据选择，展示 部门或者党组织
  onBelongChange = (e) => {
    if (e.target.value === 1) {//传入部门数据
      this.setState({ List: this.state.dp });
    } else if (e.target.value === 2) {//传入党组织数据
      this.setState({ List: this.state.belongsData });
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
          //shoppingId.push(this.props.selectRowsData[0].id)
          const num2 = num - 1;
          shoppingId[num2] = this.props.selectRowsData[0].id
        } else {
          /* shoppingNum.map((item,index) => {
             if(num == item){
               shoppingId.splice(num-1,1,this.props.selectRowsData[0].id)
             }else{
               shoppingId.push(this.props.selectRowsData[0].id)
             }
           })*/
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
        return { url: 'services/news/artical/newsList/get', code: 'title', desp: '文章', qilter: 'Q=onlineState_S_EQ=1&&Q=type_I_NE=6' };
      case '2':
        return { url: 'services/activity/activity/list', code: 'name', desp: '活动', qilter: 'Q=status_I_EQ=1' };
      case '3':
        return { url: '', code: '', desp: '链接', qilter: '' };
      case '4':
        return {
          url: 'services/news/magazine/article/list', code: 'title', desp: '杂志', qilter: ''
        };
      default:
        return { url: '', code: '', desp: '', qilter: '' };
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
  //选择商家
  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');

    // We need at least one passenger
    if (keys.length < 1) {
      return;
    }
    this.setState({
      shopping: keys.filter(key => key !== k),
    });
    this.setState({
      shoppingId: this.state.shoppingId.filter((item, index) => index == k),
    }, () => {
      this.props.getShoppingId(this.state.shoppingId);
    });
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }
  //奖励积分
  handleTreasureChange = (value, key) => {
    //当key值为  奖励积分时，才需要处理
    if (key == 'treasure') {
      if (value > 0) {
        this.setState({ isValid: true });
      }
    }
  }

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');

    const nextKeys = keys.concat(uuid);
    this.setState({
      shopping: nextKeys,
    });
    uuid++;

    form.setFieldsValue({
      keys: nextKeys,
    });
  }
  addShopping = () => {
    const shoppingNum = this.state.shoppingNum;
    i++;
    shoppingNum.push(i);
    this.setState({
      shoppingNum: shoppingNum
    })
  }
  deleteShopping = (item) => {
    const shoppingNum = this.state.shoppingNum;
    const shoppingId = this.state.shoppingId;
    const index = item - 1;
    shoppingNum.splice(index, 1, "undefined");
    shoppingId.splice(index, 1, "undefined")
    this.setState({
      shoppingNum: shoppingNum,
      shoppingId: shoppingId
    })
  }
  render() {
    const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const specialFormItemLayout = { labelCol: { span: 10 }, wrapperCol: { span: 12 } };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    console.log('this.props==>', this.props)

    const { form: { getFieldDecorator }, disabled, initialValue, flowData, disappear } = this.props;
    const { getFieldValue } = this.props.form;
    const { infoType, liveType, relation, showAddModal, homeType ,testList,learnisrequired} = this.state;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? '商家' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`names${index}`, {
            validateTrigger: ['onChange', 'onBlur'],
            initialValue: this.state['names' + index],
            rules: [{
              required: true,
              whitespace: true,
              message: '请选择商家',
            }],

          })(
            <Input placeholder="请选择商家" style={{ width: '60%', marginRight: 8 }} />
          )}
          {keys.length >= 1 ? (
            <span>
              <Button onClick={this.props.showModal.bind(this, index)}>选择用户</Button>
              <Button onClick={() => this.remove(k)}>删除</Button>
            </span>
          ) : null}
        </FormItem>
      );
    });

    let url = this.getDetailByTypeId(showAddModal).url;
    let qilter = this.getDetailByTypeId(showAddModal).qilter;
    let typeCode = this.getDetailByTypeId(showAddModal).code;
    let content = this.props.content.map((item, index) => {
      return (
        <React.Fragment key={index}>
          {item.hide && item.hide.some(_ => _ === infoType) ? null :
            item.type === 'select' ? 
            (
              <Form.Item {...formItemLayout} label={item.label}>
                {
                  getFieldDecorator(item.key, {rules: [{type:'string',required: item.required,whitespace: true,message: `${item.label}必填项`}]})
                  (<Input className="input" placeholder="请输入关键字" disabled={disabled}/>)
                }
                {
                  item.ButtonList?item.ButtonList.map(i => {return <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>}) : null
                }
              </Form.Item>
            ) : item.type === 'rangePicker' ? (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  rules: [
                    {
                      type: 'array',
                      required: item.required,
                      whitespace: true,
                      message: `${item.label}必填项`,
                    },
                  ],
                })(<RangePicker className="input" disabled={disabled} />)}
                {
                  item.ButtonList ?
                    item.ButtonList.map(i => {
                      return (
                        <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                      );
                    }) : null
                }
              </Form.Item>
            ) : item.type === 'input' ? (
              item.word === '' || item.word === undefined ? (
                <Form.Item {...formItemLayout} label={item.label}>
                  {getFieldDecorator(item.key, {
                    rules: [
                      {
                        required: item.required,
                        whitespace: item.required,
                        max: item.max,
                        message: `${item.label}为必填项,且最大长度不能超过${item.max}`,

                      },
                    ],
                  })
                  (
                    <Input className="input1" placeholder="请输入关键字" disabled={disabled}/>
                  )
                  }
                  {
                    item.ButtonList ?
                      item.ButtonList.map(i => {
                        return (
                          <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                        );
                      }) : null
                  }
                </Form.Item>
              ) : (
                  <Form.Item {...formItemLayout} label={item.label}>
                    {getFieldDecorator(item.key, {
                      initialValue: `${item.word}`,
                      rules: [
                        {
                          required: item.required,
                          whitespace: item.required,
                          message: `${item.label}为必填项`,

                        },
                      ],
                    })(
                      <Input
                        className="input1"
                        disabled={disabled}
                      />
                    )}
                    {
                      item.ButtonList ?
                        item.ButtonList.map(i => {
                          return (
                            <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                          );
                        }) : null
                    }
                  </Form.Item>
                )

            ) : item.type === 'relation_test' ? (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  rules: [
                    {
                      required: item.required,
                      whitespace: item.required,
                      max: item.max,
                      message: `${item.label}为必填项`,

                    },
                  ],initialValue:testList.length>0?testList[0].id:''
                })
                (<Select style={{width:360}} >
                        {
                          testList&&testList.map((item1,index)=>
                              <Option value={item1.id} key={item1.id} >
                                {item1.name}
                              </Option>)
                            }
                      </Select>)
                }　　　
                {
                  <Button onClick={this.testClick}>选择考试</Button>
                }
              </Form.Item>
            ) : item.type === 'selectTree' || item.type === 'checkTree' ? (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  initialValue: [],
                  rules: [
                    {
                      type: 'array',
                      required: item.required,
                      whitespace: true,
                      message: `${item.label}必填项`,
                    },
                  ],
                })(
                  <SingleTree
                    moduleType={this.props.type}
                    type={item.type}
                    disabled={disabled}
                    // treeType={this.state.infoType}
                    style={this.props.style}
                    allData={this.state.allData}
                    leaveData={this.props.leaveData[this.props.belonged][item.key]}
                    flowData={this.props.flowData[item.key]}
                    initialValue={initialValue ? initialValue[item.key] : ''}
                  />
                )}
              </Form.Item>
            ) : item.type === 'datePicker' ? (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  rules: [
                    {
                      type: 'object',
                      required: item.required,
                      whitespace: true,
                      message: `${item.label}必填项`,
                    },
                  ],
                })(<DatePicker disabled={disabled} />)}
                {
                  item.ButtonList ?
                    item.ButtonList.map(i => {
                      return (
                        <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                      );
                    }) : null
                }
              </Form.Item>
            ) : item.type === 'inputNumber' ? (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  rules: [
                    {
                      type: 'integer',
                      required: item.required,
                      whitespace: true,
                      message: `${item.label}为必填项,且必须为整数！`,
                    },
                  ],
                  initialValue: 0,
                })(<InputNumber className="input1" min={0} disabled={disabled} onChange={(value) => this.handleTreasureChange(value, item.key)} />)}
                {
                  item.ButtonList ?
                    item.ButtonList.map(i => {
                      return (
                        <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                      );
                    }) : null
                }
              </Form.Item>
            ) : item.type === 'inputNumber1' ? (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  rules: [
                    {
                      type: 'number',
                      required: item.required,
                      whitespace: true,
                      message: `${item.label}为必填项,且必须为整数！`,
                    },
                  ],
                })(<InputNumber className="input1"  />)}
                分钟
              </Form.Item>
            )  : item.type === 'inputNumber2' ? (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  rules: [
                    {
                      type: 'integer',
                      required: item.required,
                      whitespace: true,
                      message: `${item.label}必须为整数！`,
                    },
                  ],initialValue: 2,
                })(<InputNumber className="input1"  />)}
              </Form.Item>
              ): item.type === 'uploadPicture_drop' ||
              item.type === 'uploadPicture_button' ? (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    initialValue: [],
                                    rules: [
                                      {
                                        //type:'array',
                                        required: item.required,
                                        whitespace: true,
                                        //message: `${item.label}为必填项`,
                                        validator: (rule, value, callback) => {
                                          if (!item.required) {
                                            callback();
                                          }
                                          if (value && value.length > 0) {
                                            if (typeof value === 'string' || 'array') {
                                              callback();
                                            }
                                          } else {
                                            callback(`${item.label}为必填项`);
                                          }
                                        },
                                      },
                                    ],
                                  })(
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
                                  )}
                                </Form.Item>
                              ) : item.type === 'radioButton' ? 
                              (item.label==="是否只能内部转发"?
                              (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    initialValue: item.option[1].value,
                                    rules: [
                                      {
                                        type: typeof item.option[1].value,
                                        required: item.required,
                                        whitespace: true,
                                        message: `${item.label}为必填项`,
                                      },
                                    ],
                                  })(
                                    <RadioGroup
                                      disabled={disabled}
                                      options={item.option}
                                      onChange={e => this.onRadioChange(e, item.key)}
                                    />
                                  )}
                                  {
                                    item.ButtonList ?
                                      item.ButtonList.map(i => {
                                        return (
                                          <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                                        );
                                      }) : null
                                  }
                                </Form.Item>
                              ):
                              (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    initialValue: item.option[0].value,
                                    rules: [
                                      {
                                        type: typeof item.option[0].value,
                                        required: item.required,
                                        whitespace: true,
                                        message: `${item.label}为必填项`,
                                      },
                                    ],
                                  })(
                                    <RadioGroup
                                      disabled={disabled}
                                      options={item.option}
                                      onChange={e => this.onRadioChange(e, item.key)}
                                    />
                                  )}
                                  {
                                    item.ButtonList ?
                                      item.ButtonList.map(i => {
                                        return (
                                          <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                                        );
                                      }) : null
                                  }
                                </Form.Item>
                              ))
                              : item.type === 'richText' ? 
                                (item.label==='视频内容'?(
                                  <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    
                                  })(<RichText wordCount={this.wordCount.bind(this)} disabled={disabled} initialValue={initialValue ? initialValue[item.key] : ''} flowData={this.props.flowData[item.key]} leaveData={this.props.leaveData[this.props.belonged][item.key]} />)}
                                </Form.Item>
                                ):(<Form.Item {...formItemLayout} label={item.label}>
                                {getFieldDecorator(item.key, {
                                  rules: [
                                    {
                                      required: item.required,
                                      message: `${item.label}为必填项`,
                                      whitespace: true,
                                    },
                                  ],
                                })(<RichText wordCount={this.wordCount.bind(this)} disabled={disabled} initialValue={initialValue ? initialValue[item.key] : ''} flowData={this.props.flowData[item.key]} leaveData={this.props.leaveData[this.props.belonged][item.key]} />)}
                              </Form.Item>))
                              : item.type === 'textArea' ? (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    rules: [
                                      {
                                        required: item.required,
                                        whitespace: true,
                                        message: `${item.label}必填项`,
                                      },
                                    ],
                                  })(
                                    <TextArea
                                      className="textarea"
                                      placeholder="请输入关键字"
                                      disabled={disabled}
                                    />
                                  )}
                                </Form.Item>
                              ) : item.type === 'cascader' ? (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    rules: [
                                      {
                                        type: 'array',
                                        required: item.key == 'treasureProvider' && this.state.isValid == true ? true : item.required,
                                        whitespace: true,
                                        message: `${item.label}必填项`,
                                      },
                                    ],
                                  })(
                                    <Cascader
                                      className="input"
                                      options={this.state.dp}
                                      placeholder="请输入关键字"
                                      disabled={disabled}
                                      changeOnSelect
                                    />
                                  )}
                                  {
                                    item.ButtonList ?
                                      item.ButtonList.map(i => {
                                        return (
                                          <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                                        );
                                      }) : null
                                  }
                                </Form.Item>
                              ) : item.type === 'isrequired' ? (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    initialValue: '',
                                    rules: [
                                      {
                                        // type:'number',
                                        required: item.required,
                                        whitespace: true,
                                        message: `${item.label}必填项`,
                                      },
                                    ],
                                  })(
                                    <Select
                                      disabled={disabled}
                                      onChange={this.requiredChange}
                                      style={{ width: '300px' }}
                                    >
                                      {item.option &&
                                        item.option.map(_ => {
                                          return (
                                            <Option key={_.key} value={_.key}>
                                              {_.value}
                                            </Option>
                                          );
                                        })}
                                    </Select>
                                  )}
                                </Form.Item>
                              ) :item.type === 'isrequired_learn' ? (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    initialValue: learnisrequired,
                                    rules: [
                                      {
                                        type:'number',
                                        required: item.required,
                                        whitespace: true,
                                        message: `${item.label}必填项`,
                                      },
                                    ],
                                  })(
                                    <Select
                                      disabled={disabled}
                                      onChange={this.learnChange}
                                      style={{ width: '300px' }}
                                    >
                                      {item.option&&item.option.map(_ => {
                                          return (
                                            <Option key={_.key} value={_.key}>
                                              {_.value}
                                            </Option>
                                          );
                                        })}
                                    </Select>
                                  )}
                                </Form.Item>
                                ): item.type === 'information_type' ? (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    initialValue: 1,
                                    rules: [
                                      {
                                        type:'number',
                                        required: item.required,
                                        whitespace: true,
                                        message: `${item.label}必填项`,
                                      },
                                    ],
                                  })(
                                    <Select placeholder="请输入关键字" disabled={disabled} onChange={this.infoTypeChange} style={{ width: '300px' }} >
                                      {
                                        item.option &&item.option.map(_ => {return <Option key={_.key} value={_.key}>{_.value}</Option>})
                                      }
                                    </Select>
                                  )}
                                </Form.Item>
                              ) : item.type === 'live_type' ? (
                                <div>
                                  <Form.Item {...formItemLayout} label="直播" >
                                    {getFieldDecorator(item.key, {
                                      initialValue: true,
                                      rules: [
                                        {
                                          type: 'boolean',
                                          required: item.required,
                                          whitespace: true,
                                          message: '直播为必填项',
                                        },
                                      ],
                                    })(
                                      <RadioGroup
                                        disabled={disabled}
                                        options={[
                                          { label: '是', value: true },
                                          { label: '否', value: false },
                                        ]}
                                        onChange={this.onLiveChange} />
                                    )}
                                  </Form.Item>
                                  {liveType == true ?
                                    <React.Fragment>
                                      <Form.Item {...formItemLayout} label="频道">
                                        {getFieldDecorator('channel', {
                                          initialValue: '',
                                          rules: [
                                            {
                                              required: true,
                                              whitespace: true,
                                              max: 100,
                                              message: '频道为必填项,且最大长度不能超过100',
                                            },
                                          ],
                                        })(
                                          <Input disabled={disabled} />
                                        )}
                                      </Form.Item>

                                      <Form.Item {...formItemLayout} label="频道内容">
                                        {getFieldDecorator('channelcontent', {
                                          initialValue: '',
                                          rules: [
                                            {
                                              required: false,
                                              whitespace: true,
                                              max: 100,
                                              message: '必填项,且最大长度不能超过100',
                                            },
                                          ],
                                        })(
                                          <Input disabled={disabled} />
                                        )}
                                      </Form.Item>
                                    </React.Fragment>
                                    : null
                                  }
                                </div>
                              ) : item.type === 'relation' ? (
                                <div>
                                  <Form.Item {...formItemLayout} label="关联类型">
                                    {getFieldDecorator('relationType', {
                                      initialValue: '1',
                                      rules: [
                                        {
                                          required: false,
                                          whitespace: true,
                                          message: '关联类型必填项',
                                        },
                                      ],
                                    })(
                                      <RadioGroup
                                        disabled={disabled}
                                        options={[
                                          { label: '文章', value: '1' },
                                          { label: '活动', value: '2' },
                                          { label: '链接', value: '3' },
                                          { label: '杂志', value: '4' },
                                        ]}
                                        onChange={this.onRelationChange}
                                      />
                                    )}
                                  </Form.Item>
                                  <Form.Item {...formItemLayout} label={'相关' + `${this.getDetailByTypeId(relation).desp}` + '地址'}>
                                    {getFieldDecorator('relationAddress', {
                                      initialValue: '',
                                      rules: [
                                        {
                                          required: false,
                                          whitespace: true,
                                          message: '必填项',
                                        },
                                      ],
                                    })(
                                      <Input className="input1" readOnly={relation !== '3' ? true : false} disabled={disabled} />
                                    )}
                                    {relation !== '3' ? <Button style={{ marginLeft: '5px' }} onClick={() => this.setState({ showAddModal: relation })
                                    }>添加{this.getDetailByTypeId(relation).desp}</Button> : null}
                                  </Form.Item>

                                </div>

                              ) 
                              : item.type === 'belong' ? 
                              (

                                  <Form.Item {...formItemLayout} label={item.label}>
                                    {getFieldDecorator(item.key, {
                                      initialValue: 1,
                                      rules: [
                                        {
                                          type:'number',
                                          required: item.required,
                                          whitespace: true,
                                          message: '资讯归属必填项',
                                        },
                                      ],
                                    })(
                                      <RadioGroup
                                        options={item.option}
                                        onChange={this.onBelongChange}
                                        disabled={disabled}
                                      />)
                                    }
                                  </Form.Item>
                              )
                                : item.type === 'belongSelect' ? 
                              (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    rules: [
                                      {
                                        type: 'array',
                                        required: item.required,
                                        whitespace: true,
                                        message: '必填项',
                                      },
                                    ],
                                  })(
                                    <Cascader
                                      className="input"
                                      options={this.state.List}
                                      placeholder="请输入关键字"
                                      disabled={disabled}
                                      changeOnSelect
                                    />
                                  )
                                  }
                                </Form.Item>

                              ) : item.type === 'shopping' ? (//商家选择
                                <div>
                                  {
                                    this.state.shoppingNum && this.state.shoppingNum.map((item, index) => {
                                      if (item != "undefined") {
                                        return <Form.Item {...formItemLayout} label="商家" >
                                          {getFieldDecorator(`merchants${item}`, {
                                            initialValue: '',
                                            rules: [
                                              {
                                                required: false,
                                                whitespace: true,
                                                message: '必填项',
                                              },
                                            ],
                                          })(
                                            <Input className="input1" />
                                          )}
                                          <Button style={{ marginLeft: '5px' }} onClick={this.props.showModal.bind(this, item)}>选择用户</Button>
                                          {index != 0 ? <Button style={{ marginLeft: '5px' }} onClick={this.deleteShopping.bind(this, item)}>删除</Button> : null}
                                        </Form.Item>
                                      }

                                    })
                                  }
                                  <Form.Item {...formItemLayoutWithOutLabel}>
                                    <Button style={{ marginLeft: '20%' }} onClick={this.addShopping}>
                                      添加商家
                    </Button>
                                  </Form.Item>
                                </div>) : item.type === 'onHomePage' ? (
                                  <div>
                                    <Form.Item {...formItemLayout} label="是否上首页" >
                                      {getFieldDecorator(item.key[0], {
                                        initialValue: false,
                                        rules: [
                                          {
                                            type: 'boolean',
                                            required: false,
                                            whitespace: true,
                                            message: '必填项',
                                          },
                                        ],
                                      })(
                                        <RadioGroup
                                          disabled={disabled}
                                          options={[
                                            { label: '是', value: true },
                                            { label: '否', value: false },
                                          ]}
                                          onChange={e => this.setState({ homeType: e.target.value })
                                          }
                                        />
                                      )}
                                    </Form.Item>
                                    {
                                      homeType ?
                                        <React.Fragment>
                                          <Form.Item {...formItemLayout} label="首页图片" >
                                            {getFieldDecorator(item.key[1], {
                                              rules: [
                                                {
                                                  type: 'array',
                                                  required: true,
                                                  whitespace: true,
                                                  message: '必填项',
                                                },
                                              ],
                                            })
                                              (
                                              !disabled ? (
                                                <UploadPicture keys={item.key[1]} type={'uploadPicture_button'}
                                                  isAttach={item.isAttach ? true : false}
                                                  isRadio={item.isRadio ? true : false}
                                                  isIamge={'true'}
                                                  modal={this.props.type}
                                                  initialValue={this.props.flowData[item.key[1]] ? this.props.flowData[item.key[1]] : this.props.initialValue ? this.props.initialValue[item.key[1]] : ''} describe={item.describe} />
                                              ) : (
                                                  <div>
                                                    <Button onClick={() => this.setState({ img_review: true, imgValue: initialValue[item.key[1]][0].response.entity[0].filePath })}>查看</Button>
                                                  </div>
                                                )
                                              )}
                                          </Form.Item>
                                          <Form.Item {...formItemLayout} label="布局形式"  >
                                            {getFieldDecorator(item.key[2], {
                                              initialValue: 0,
                                              rules: [
                                                {
                                                  type: 'number',
                                                  required: false,
                                                  whitespace: true,
                                                  message: '必填项',
                                                },
                                              ],
                                            })(
                                              <RadioGroup
                                                disabled={disabled}
                                                options={[
                                                  { label: '左右', value: 0 },
                                                  { label: '上下', value: 1 },
                                                ]}
                                              />
                                            )}
                                          </Form.Item>
                                        </React.Fragment> : null
                                    }

                                  </div>) : item.type === 'isTimePush' ?
                                                      <Row>
                                                        <div>
                                                          <Form.Item style={{ width: '100%' }} {...formItemLayout} label="是否定时发送">
                                                            {getFieldDecorator(item.key ? item.key : isTimePush, {
                                                              initialValue: false,
                                                              rules: [
                                                                {
                                                                  type: 'boolean',
                                                                  required: item.required,
                                                                  whitespace: true,
                                                                  message: '必填项',
                                                                },
                                                              ],
                                                            })(
                                                              <RadioGroup
                                                                disabled={disabled}
                                                                options={[
                                                                  { label: '是', value: true },
                                                                  { label: '否', value: false },
                                                                ]}
                                                                onChange={e => {
                                                                  if (e.target.value) {
                                                                    this.setState({ pushModal: true });
                                                                  } else {
                                                                    this.props.setTimePushData('');
                                                                    this.setState({ timePushValue: '' });
                                                                  }
                                                                }}
                                                              />
                                                            )}
                                                            {this.props.style === 'detail' ? <span>{this.state.timePushValue}</span> : <span onClick={() => this.setState({ pushModal: true })}>{this.state.timePushValue}</span>

                                                            }

                                                          </Form.Item>

                                                          {/* <Form.Item {...formItemLayout} label="">
                    {getFieldDecorator('TimePushData', {
                    })(
                      <div onClick={()=>this.setState({pushModal:true})}>{this.state.timePushValue}</div>
                    )}
                  </Form.Item> */}
                                                        </div>
                                                      </Row>
                                                      : item.type === 'isTimePush' ?
                                                        <Row>
                                                          <div>
                                                            <Form.Item style={{ width: '100%' }} {...formItemLayout} label="是否定时发送">
                                                              {getFieldDecorator('isTimePush', {
                                                                initialValue: false,
                                                                rules: [
                                                                  {
                                                                    type: 'boolean',
                                                                    required: item.required,
                                                                    whitespace: true,
                                                                    message: '必填项',
                                                                  },
                                                                ],
                                                              })(
                                                                <RadioGroup
                                                                  disabled={disabled}
                                                                  options={[
                                                                    { label: '是', value: true },
                                                                    { label: '否', value: false },
                                                                  ]}
                                                                  onChange={e => {
                                                                    if (e.target.value) {
                                                                      this.setState({ pushModal: true });
                                                                    } else {
                                                                      this.props.setTimePushData('');
                                                                      this.setState({ timePushValue: '' });
                                                                    }
                                                                  }}
                                                                />
                                                              )}<span onClick={() => this.setState({ pushModal: true })}>{this.state.timePushValue}</span>
                                                            </Form.Item>

                                                          </div>
                                                        </Row> :
                                                        item.type === 'video' ?

                                                          <Row>
                                                            <Col >
                                                              <Form.Item {...formItemLayout} label={item.label}>
                                                                {getFieldDecorator('videoUrl', {
                                                                  rules: [
                                                                    {
                                                                      required: item.required,
                                                                      whitespace: item.required,
                                                                      max: item.max,
                                                                      message: `视频地址为必填项`,

                                                                    },
                                                                  ],
                                                                })(
                                                                  <Input
                                                                    className="input1"
                                                                    placeholder="请输入视频地址"
                                                                    disabled={disabled}
                                                                  />
                                                                )}
                                                              </Form.Item>
                                                            </Col>
                                                            <Col >
                                                              <Form.Item {...formItemLayout} label={'视频时长(s)'}>
                                                                {getFieldDecorator('videoTime', {
                                                                })(
                                                                  <InputNumber
                                                                    className="input1"
                                                                    placeholder="请输入视频时长"
                                                                    disabled={disabled}
                                                                    min={0}
                                                                  />
                                                                )}
                                                              </Form.Item>
                                                            </Col>
                                                            <Col >
                                                              <Form.Item {...formItemLayout} label={'描述'}>
                                                                {getFieldDecorator('videoDesp', {
                                                                })(
                                                                  <Input
                                                                    className="input1"
                                                                    placeholder="请输入视频描述"
                                                                    disabled={disabled}
                                                                  />
                                                                )}
                                                              </Form.Item>
                                                            </Col>
                                                            <Col style={{ display: disappear ? 'none' : 'block' }}>
                                                              <Form.Item {...formItemLayout} label={<span />}>
                                                                <a href={this.props.form.getFieldValue('videoUrl')}
                                                                  target="_blank">查看</a>
                                                              </Form.Item>

                                                            </Col>
                                                          </Row>
                                                          : null}
        </React.Fragment>
      );
    });
    return <div>{content}
      <Modal
        className="img-review-modal"
        visible={this.state.img_review}
        onCancel={() => this.setState({ img_review: false })}
        footer={null}
        destroyOnClose
      >
      {ChooseUrl==1?<img src={PictrueUrl + this.state.imgValue} style={{ width: '520px', height: '300px' }} />:
      <img src={API_FILE_VIEW_INNER + this.state.imgValue} style={{ width: '520px', height: '300px' }} />
      }
        
      </Modal>
      <Modal
        className="img-review-modal"
        visible={this.state.isRadio}
        onCancel={() => this.setState({ isRadio: false })}
        footer={null}
        destroyOnClose
      >
        <video id="my-player" className="video-js" controls preload="auto" poster="" data-setup="{}">
          <source src={this.state.imgValue} type="video/mp4" />
        </video>
      </Modal>
      <Modal

        className="img-review-modal"
        visible={this.state.isAttach}
        onCancel={() => this.setState({ isAttach: false })}
        footer={null}
        destroyOnClose
      >
        {/*<Popconfirm title="确定下载该附件吗?" onConfirm={()=>this.onDownLoad(this.state.imgValue)}>*/}
        <a className="attach" href={API_FILE_VIEW_INNER+this.state.imgValue} download={API_FILE_VIEW_INNER+this.state.fileName}>{this.state.fileName}</a>
        {/*</Popconfirm>*/}
      </Modal>
      <Modal
        title={`添加${this.getDetailByTypeId(relation).desp}`}
        visible={this.state.showAddModal !== '0' ? true : false}
        footer={
          <React.Fragment>
            <Button onClick={this.handleAddModalOK}
              disabled={!(this.props.selectRowsData && this.props.selectRowsData.length > 0)}>添加</Button>
            <Button onClick={() => this.setState({ showAddModal: '0' })
            }>取消</Button>
          </React.Fragment>}
        onCancel={() => this.setState({ showAddModal: '0' })
        }
        destroyOnClose={true}
      >
        <FormAndInput
          columns={relation === '4' ? [
            {
              title: '所属系列',
              dataIndex: 'series',
              key: 'series',
            },
            {
              title: '期刊名称',
              dataIndex: 'magazineName',
              key: 'magazineName',
            },
            {
              title: '期数',
              dataIndex: 'periods',
              key: 'periods',
            },
            {
              title: '标题',
              dataIndex: 'title',
              key: 'title',
            },
          ] : [
              {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
              },
              {
                title: '标题',
                dataIndex: relation === '1' ? 'title' : 'name',
                key: relation === '1' ? 'title' : 'name',
              },
              {
                title: '创建时间',
                dataIndex: relation === '2' ? 'createDate' : 'createdate',
                key: relation === '2' ? 'createDate' : 'createdate',
              },
            ]}
          url={url}
          qfilter={qilter}
          onSearch={e => this.handleInput(e, url, typeCode, qilter)}
        />
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
      <Modal
        title="选择考试"
        visible={this.state.testModal}
        maskClosable={false}
        destroyOnClose={true}
        onOk={this.testOk}
        onCancel={this.testCancel}
      >
        <TableSearch
          columns={[
            {
              title: '序号',
              key: 'sNum',
              dataIndex: 'sNum',
            },
            {
              title: '考试活动名称',
              dataIndex: 'name',
              key: 'categoryName',
            },
            {
              title: '活动开始时间',
              dataIndex: 'beginTime',
              key: 'beginTime',
            },
            {
              title: '活动结束时间',
              dataIndex: 'endTime',
              key: 'endTime',
            },
          ]}
          url={'services/activity/examActivity/list'}
          qfilter={'Q=typeid_S_EQ=6&Q=status_I_EQ=1'}
        />
      </Modal>
    </div>;
  }
}