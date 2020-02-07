import React, { Component } from 'react';
import { Form, message, Steps, Input, Button, Row, Col, Select, Modal, Checkbox, DatePicker, InputNumber, Radio } from 'antd';
import {
  PartyTaskList, //党建任务列表
} from '../../URL';
import API_PREFIX from '../../../apiprefix';
import { postService, GetQueryString, getService } from '../../../myFetch.js';
import { connect } from 'react-redux';
import moment from 'moment';
import { BEGIN, getPageData } from '../../../../../redux-root/action/table/table';// yelu 2019-01-16 取出缓存里面设置分页数据函数getPageData
import TableSearch from '../../../../component/table/TableSearch';
import FormAndInput from '../../../../component/table/FormAndInput';
// import TableAndSearch from '../../../../component/table/TableAndSearch';
// import RichText from '../../../../component/richTexteditor/editor';
import RichText from '../../../../component/richTexteditor/braftEditor';
import { checkInput } from '../../../../../utils/checkForm';
import ArticleAttach from '../attach/ArticleAttach';
import ActivityAttach from '../attach/ActivityAttach';
import FileAttach from '../attach/FileAttach'
const Option = Select.Option;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Step = Steps.Step;
const { TextArea } = Input;
//日期格式
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
import { setFormData, setTopicId, setPartyId, setArticleData, setActivityData, setFileData } from '../../../../../redux-root/action/attach/attach';

@connect(
  state => ({
    pageData: state.table.pageData,
    selectRowsData: state.table.selectRowsData,  //获取选中行的数据
    getArticleData: state.attach.articleData,//获取添加文章的数据
    getActivityData: state.attach.activityData,//获取添加活动的数据
    getFileData: state.attach.fileData,//获取添加文件的数据
    getTopicId: state.attach.getTopicId,
    getPartyId: state.attach.getPartyId,
    getFormData: state.attach.getFormData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    setTableData: n => dispatch(BEGIN(n)),
    setTopicId: n => dispatch(setTopicId(n)),
    setPartyId: n => dispatch(setPartyId(n)),
    setFormData: n => dispatch(setFormData(n)),
    setActivityData: n => dispatch(setActivityData(n)),
    setArticleData: n => dispatch(setArticleData(n)),
    setFileData: n => dispatch(setFileData(n)),
    getPageData: n => dispatch(getPageData(n)), // yelu 2019-01-02 每次查询时初始缓冲里面的页码为默认值
  })
)
@Form.create()
export default class AddBase extends Component {
  constructor(props) {
    super(props);
    console.log("props===>", props)
    this.state = {
      //选择用户
      selectOptions: [],//发起人下拉框选项
      partyOptions: [],//发起人职务所在党组织下拉框选项
      checkBoxOption: [],//关联上级工作部署选项  通过接口获取数据
      topicOption: [],//任务主题下拉框选项
      typeOption: [],//任务类型下拉选项
      showModal: false,//modal的展示
      showModalKey: 0,//modal的展示
      userSelectd: false,//发起人是否已经选择了  默认为未选择    只有选择了发起人，才能选择任务主题
      topictSeclected: false,//任务主题是否选择了，默认为未选择  只有选择了任务主题，才能选择任务类型和是否线下会议纪要
      isOfflineDisabled: true,//是否线下会议记录  若为先关主题对应的是否线下会议记录若为不固定，则 不禁用，否则禁用
      topicId: '',
      isDisalbed: false,//  如果是  回传数据（上一步），则isDisalbed:false  即不禁用，  否则，禁用
      level: '',//发起所在党组织的level
      timePushModal: false,//定时发布的弹窗
      timePushKey: 0,//定时发布弹窗的key
      timePushValue: '',//定时发布的时间
      selectedDate: '',//时间控件选择到的时间
      flowData: this.props.flowData,
      topicName: '',
      typeName: '',
      holdBtn: false,
      promptValue: false,
      restart: true,
      istime: false,
      qfilter: '', // yelu 2019-01-16 添加作者查询条件字段 
      fileAttachFlag: false, //yelu 添加，点击保存后，文件列表数据重复问题
    }
  }
  componentWillMount() {
    this.dealData(this.props.flowData)
  }

  dealData = (flowData) => {
    //回传数据时，根据选中的任务主题id，调用任务类型接口 topicId
    console.log(flowData)
    if (flowData && Object.keys(flowData).length != 0) {
      if (flowData.timedDate && flowData.isTimed) {
        this.setState({ timePushValue: flowData.timedDate });
      }
      // this.setState({ isDisalbed: true });
      if (flowData.topicId) {//不为空
        //根据选中的任务主题id，调用任务类型接口 topicId
        getService(API_PREFIX + `services/web/party/taskType/getList/1/1000?Q=topicId=${flowData.topicId}`, (res) => {
          if (res.status === 1) {
            let typeOption = []
            res.root.list && res.root.list.map(item => {
              typeOption.push({ key: item.id, value: item.typeName });
            });

            this.setState({ typeOption });
          }
        });
      }

      if (flowData.partyLevel) {
        //获取任务主题下拉框数据
        getService(API_PREFIX + `services/web/party/taskTopic/getListByUserLevel/${flowData.partyLevel}`, (data) => {
          if (data.status === 1) {
            let topicOption = [];
            data.root.object && data.root.object.map(item => {
              topicOption.push({ key: item.id, value: item.topicName });
            });
            this.setState({ topicOption, level: flowData.partyLevel });
          }
        });
        //关联上级工作部署
        getService(API_PREFIX + `services/web/party/task/getUntiedTaskList/${flowData.partyId}`, data => {
          if (data.status === 1) {
            //通过接口获取多选框中的数据
            let checkBoxOption = [];
            data.root.object && data.root.object.map(item => {
              checkBoxOption.push({ label: item.taskName, value: item.id });
            });
            this.props.form.setFieldsValue({
              taskId: flowData.taskId ? flowData.taskId.split(',') : []
            })
            this.setState({ checkBoxOption, taskId: flowData.taskId });
          }
        });

        this.setState({
          selectOptions: [{ key: flowData.userId, value: flowData.userName, }],
          partyOptions: [{ key: flowData.partyId, value: flowData.partyName, }],
          userSelectd: true,
          level: flowData.partyLevel,
          typeName: flowData.typeName ? flowData.typeName : '',
          topicName: flowData.topicName ? flowData.topicName : '',
        });
      }
    }
  }

  //按钮点击事件  弹出modal
  handleClick = () => {
    localStorage.setItem("selectedRowKeys", '');
    this.setState({
      showModal: true,
      showModalKey: this.state.showModalKey + 1
    });
  }
  //modal确定     1、将选中数据设置给select  2、关闭弹窗   this.props.form.getFieldValue(key)
  handleOk = () => {
    this.setState({
      showModal: false, restart: false, topicName: '',
    });
    this.props.form.setFieldsValue({ topicId: '' }); //为userId设置值
    this.props.form.setFieldsValue({ typeId: '' }); //为userId设置值
    this.props.form.setFieldsValue({ isOffline: '' }); //为userId设置值
    this.props.form.setFieldsValue({ isNeedReceipt: '' }); //为userId设置值
    this.props.form.setFieldsValue({ taskId: [] }); //为userId设置值
    let flowData = this.state.flowData;
    if (JSON.stringify(flowData) != '{}') {
      this.setState({ restart: false })
    }
    let selectedData = this.props.selectRowsData; //获取勾选的值
    console.log(selectedData)
    if (selectedData[0]) {
      if ((selectedData[0].fullName).indexOf("党小组") != -1) {//存在党小组(将党组织中含有党小组的将党小组截取掉)xwx2019/2/26
        let partyNameSplit = selectedData[0].fullName.split(">")
        partyNameSplit.splice(-1, 1)
        let combinationString = partyNameSplit.join('>')
        selectedData[0].fullName = combinationString
      }
      this.props.setFormData({
        ...this.props.getFormData,
        userId: selectedData[0].userId,
      })
    }
    sessionStorage.partyId = selectedData[0] && selectedData[0].partyId;
    //根据发起人的level确定其能发布的任务主题
    let topicOption = this.state.topicOption;
    if (selectedData[0]) {
      getService(API_PREFIX + `services/web/party/taskTopic/getListByUserLevel/${selectedData[0] && selectedData[0].partyLevel}`, (data) => {
        if (data.status === 1) {
          topicOption = [];
          data.root.object && data.root.object.map(item => {
            topicOption.push({ key: item.id, value: item.topicName });
          });
          this.setState({ topicOption, level: selectedData[0].partyLevel },
            () => { });
        }
      });
    }
    //关联上级工作部署
    if (selectedData[0]) {
      getService(API_PREFIX + `services/web/party/task/getUntiedTaskList/${selectedData[0] && selectedData[0].partyId}`, data => {
        if (data.status === 1) {
          //通过接口获取多选框中的数据
          let checkBoxOption = [];
          data.root.object && data.root.object.map(item => {
            checkBoxOption.push({ label: item.taskName, value: item.id });
          });
          this.setState({ checkBoxOption }, () => {

          });
        }
      });
    }

    this.setState({
      selectOptions: [{ key: selectedData[0] && selectedData[0].userId, value: selectedData[0] && selectedData[0].userName, }],
      partyOptions: [{ key: selectedData[0] && selectedData[0].partyId, value: selectedData[0] && selectedData[0].fullName, }],
      userSelectd: true,
      level: selectedData[0] && selectedData[0].partyLevel
    }, () => {

      this.props.form.setFieldsValue({ userId: selectedData[0] && selectedData[0].userId }); //为userId设置值
      this.props.form.setFieldsValue({ partyId: selectedData[0] && selectedData[0].partyId }); //为userId设置值
      this.props.form.setFieldsValue({ topicId: '' }); //为userId设置值
      this.props.form.setFieldsValue({ typeId: '' }); //为userId设置值
    });

  }
  //modal 取消
  handleCancel = () => {
    this.setState({
      showModal: false,
      qfilter: '',
    });
  }
  handleSubmit = (e, next) => {   //如果next不为空，则为“保存并下一步”
    e.preventDefault();
    let { level } = this.state
    this.props.form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      if (err) {
        return;
      }
      if (this.state.promptValue) {
        message.error('请重新选择定时发布时间')
        return
      }

      let checkBoxOption = this.state.checkBoxOption
      if (checkBoxOption) {
        window.sessionStorage.checkBoxOption = JSON.stringify(checkBoxOption);
      }

      let nowDate = moment(new Date())
      let endData = moment(fieldsValue['endDate'])
      let diffDate = endData - nowDate;
      if (diffDate < 0) {
        message.error('任务截止时间必须大于当前时间！')
        return
      }
      let taskAttachList = []
      if (this.props.getArticleData) {
        this.props.getArticleData.forEach(item => {
          taskAttachList.push({
            "attachType": 1,
            "attachUrl": item.id,
            "fileName": item.name,
            "content": item.content,
          })
        })
      }
      if (this.props.getActivityData) {
        this.props.getActivityData.forEach(item => {
          taskAttachList.push({
            "attachType": 2,
            "attachUrl": item.id,
            "fileName": item.name,
            "content": item.content,
          })
        })
      }
      if (this.props.getFileData) {
        this.props.getFileData.forEach(item => {
          let size = Number(item.size).toFixed(2)
          let fileSize = ''
          if (size < 1024) {
            fileSize = `${size} KB`
          } else {
            fileSize = `${(size / 1024).toFixed(2)} MB`
          }
          taskAttachList.push({
            "attachType": item.type,
            "attachUrl": item.url,
            "fileName": item.name,
            "fileSize": fileSize,
            "content": item.type == 5 ? JSON.stringify({ length: fileSize, name: item.name }) : JSON.stringify({ w: 300, h: 300, width: 300, height: 300 })
          })
        })
      }
      let values = {
        ...this.props.getFormData,
        ...fieldsValue,
        'endDate': fieldsValue['endDate'].format(dateFormat),
        'taskId': this.state.taskId,
        'partyName': this.state.partyOptions.length > 0 ? this.state.partyOptions[0].value : [],
        'userName': this.state.selectOptions.length > 0 ? this.state.selectOptions[0].value : [],
        'topicName': this.state.topicName,
        'typeName': this.state.typeName,
        'pushStatus': 0,
        'taskAttachList': taskAttachList,
        'isOffline': fieldsValue['isOffline'] == 1 ? true : false,
        'isNeedReceipt': fieldsValue['isNeedReceipt'] == 1 ? true : false,
        'isTimed': fieldsValue['isTimed'] == 1 ? true : false,
        'partyLevel': this.state.level,
      }
      if (values.isTimed) {
        values.timedDate = this.state.timePushValue
      }
      if (this.props.getFormData.id) {
        values.id = this.props.getFormData.id
      }
      this.props.setFormData(values)
      sessionStorage.setItem('level', level)
      this.props.next();//跳到下一步
    });
  }
  //  search框，点击回车后条件查询
  handleSearch = (e) => {
    console.log(e)//getData
    let qfilter = e.target.value == '' ? '' : `Q=userName=${e.target.value}` // yelu 2019-01-16 修改选择人员查询后分页后不带查询条件
    this.setState({ qfilter, })
    // yelu 2019-01-16 每次查询的时候要重置页码为1
    this.props.getPageData({ currentPage: 1, pageSize: 10, query: qfilter }); // 每次查询时初始缓冲里面的页码为默认值
    this.props.setTableData(API_PREFIX + `services/web/party/partyUser/getAllPostUserByTenantId/1/10?${qfilter}`);
  }
  //任务主题选择后
  handleSelect = (value) => {
    console.log(value)
    this.setState({ restart: false })
    this.props.form.setFieldsValue({ typeId: '' });
    sessionStorage.topicId = value;
    //根据选中的任务主题获取任务类型数据
    getService(API_PREFIX + `services/web/party/taskType/getList/1/1000?Q=topicId=${value}`, (data) => {
      if (data.status === 1) {
        let typeOption = [];
        data.root.list && data.root.list.map(item => {
          typeOption.push({ key: item.id, value: item.typeName });
        });

        this.setState({ typeOption, topictSeclected: true, }, () => {

        });
      }
    });
    //根据选中的任务主题    获取对应 是否线下会议记录 是否需要回执
    getService(API_PREFIX + `services/web/party/taskTopic/getList/1/10?Q=id=${value}`, (data) => {
      if (data.status === 1) {
        if (data.root.list && data.root.list.length > 0) {
          let info = data.root.list[0];
          if (info.topicName == '重要工作部署') {
            this.props.form.setFieldsValue({ isOffline: 2 });
            this.props.form.setFieldsValue({ isNeedReceipt: 0 });
            this.props.form.setFieldsValue({ specialPoint: 0 });
          } else {
            this.props.form.setFieldsValue({ isOffline: 2 });
            this.props.form.setFieldsValue({ isNeedReceipt: 1 });
            this.props.form.setFieldsValue({ specialPoint: 5 });

          }
          this.setState({ topicName: info.topicName })
          if (info.isOffline == 0) { //对应是否需要线下会议纪要  不固定
            //不做任何处理
            this.setState({ isOfflineDisabled: false });
          } else {
            //禁用，并设置值
            this.setState({ isOfflineDisabled: true });
            this.props.form.setFieldsValue({ isOffline: info.isOffline }); //为userId设置值
          }
        }


      }
    });
  }

  typeSelect = (value) => {
    this.props.form.setFieldsValue({ typeId: value });
    this.state.typeOption.map((item) => {
      if (item.key == value) {
        this.setState({ typeName: item.value })
      }
    })

  }
  //任务截止前  天 提醒
  handleInputChange = (value) => {
    this.props.form.setFieldsValue({ remindDate: value }); //为userId设置值
  }
  //定时发布
  onRadioChange = (e) => {

    if (e.target.value == 1) { //是 出现定时发布的弹窗
      this.setState({
        timePushKey: this.state.timePushKey + 1,
        timePushModal: true,
        istime: true,
      });
    } else {
      this.setState({
        timePushModal: false,  //选择否，关闭弹窗
        // timePushValue:'',//将定时发布的时间置空
        promptValue: false,
        istime: false,
      });
    }
  }
  //定时发布弹窗  取消
  cancleTimePush = () => {
    this.setState({ timePushModal: false });
    this.props.form.setFieldsValue({ isTimed: 0 });
  }
  //定时发布弹窗  确定
  okTimePush = () => {
    let timestamp = new Date().getTime();    // 当前时间戳
    let currentdate = new Date(this.state.selectedDate.replace(/-/g, '/')).getTime();
    let promptValue = currentdate < timestamp;
    console.log(this.state)
    this.setState({ timePushModal: false, timePushValue: this.state.selectedDate, promptValue });
  }
  //禁选的时间
  disabledDate = (current) => {
    return moment(new Date()).subtract(1, 'd').isAfter(current);
  }

  limitWord = (data) => {
    if (data.target.value.length > 500) {
      message.error('内容已超过500字')
      data.target.value.splice(0, 500)
    }
  }
  receiptSelect = (value) => {
    if (value) {
      this.props.form.setFieldsValue({ specialPoint: 5 });
    } else {
      this.props.form.setFieldsValue({ specialPoint: 3 });
    }

  }

  render() {
    const { getFieldDecorator } = this.props.form;  //获取表单中的属性
    let { selectOptions, showModalKey, showModal, partyOptions, checkBoxOption, topicOption, typeOption, topicName, holdBtn, restart } = this.state;
    const { flowData } = this.props;
    let isTopic = topicName == '重要工作部署' || topicName == '党课' || topicName == '支部党员大会' || topicName == '党支部委员会' || topicName == '党小组会'
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    //发起人封装组件的数据
    const userData = {
      operation: '选择用户',//按钮名称
      modalData: {
        title: '选择用户',
        cancelText: '取消',
        okText: '确定',
      },
      tableData: {
        columns: [
          {
            title: '序号',
            key: 'sNum',
            dataIndex: 'sNum',
          },
          {
            title: '用户姓名',
            dataIndex: 'userName',
            key: 'userName',
          },
          {
            title: '党组织',
            dataIndex: 'fullName',
            key: 'fullName',
          },
          {
            title: '职务',
            dataIndex: 'postName',
            key: 'postName',
          },
        ],
        url: 'services/web/party/partyUser/getAllPostUserByTenantId',
      }

    }
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="任务名称"
          >
            {
              getFieldDecorator('taskName', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    validator: (rule, value, callback) => checkInput(rule, value, callback),
                  },
                ], initialValue: flowData ? flowData.taskName : ''
              })
                (<Input disabled={this.state.isDisalbed} />)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="发起人"
          >
            {
              getFieldDecorator('userId', {
                rules: [
                  {
                    type: 'string',
                    required: true,
                    whitespace: true,
                    message: '发起人为必填项',
                  }
                ], initialValue: flowData ? flowData.userId : ''
              })
                (
                  <Select style={{ width: '50%', display: 'inline-block' }}
                  >
                    {
                      selectOptions && selectOptions.map((item, index) =>
                        <Option value={item.key} key={item.key} >
                          {item.value}
                        </Option>)
                    }
                  </Select>


                )
            }
            <Button onClick={this.handleClick} disabled={this.state.isDisalbed}>
              {userData.operation}
            </Button>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="发起人党组织"
          >
            {
              getFieldDecorator('partyId', {
                rules: [
                  {
                    type: 'string',
                    required: true,
                    whitespace: true,
                    message: '发起人党组织为必填项',
                  }
                ],
                initialValue: flowData ? flowData.partyId : ''
              })
                (<Select
                //  disabled={true}
                >
                  {
                    partyOptions && partyOptions.map((item) => {
                      return (
                        <Option value={item.key} key={item.key}>{item.value}</Option>
                      )
                    })
                  }
                </Select>)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="关联上级工作部署"
          >
            {
              getFieldDecorator('taskId', {
                rules: [
                  {
                    type: 'array'
                  }
                ],
                // initialValue:flowData&&flowData.taskId?flowData.taskId.split(','):[]
                initialValue: []
              })
                (
                  <CheckboxGroup onChange={e => {

                    console.log(e)
                    this.setState({
                      taskId: e.join(',')
                    })
                  }} options={checkBoxOption}></CheckboxGroup>

                )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="任务主题"
          >
            {
              getFieldDecorator('topicId', {
                rules: [
                  {
                    type: 'string',
                    required: true,
                    whitespace: true,
                    message: '任务主题为必填项',
                  }
                ], initialValue: flowData ? flowData.topicId : ''
              })
                (
                  <Select
                    // disabled={!this.state.userSelectd}
                    onSelect={(value) => this.handleSelect(value)}
                  >
                    {
                      topicOption && topicOption.map((item) => {
                        return (<Option key={item.key} value={item.key}>{item.value}</Option>)
                      })
                    }
                  </Select>

                )
            }

          </FormItem>
          <FormItem
            {...formItemLayout}
            label="任务类型"
          >
            {
              getFieldDecorator('typeId', {
                rules: [
                  {
                    type: 'string',
                    required: true,
                    whitespace: true,
                    message: '任务类型为必填项',
                  }
                ], initialValue: flowData ? flowData.typeId : ''
              })
                (
                  <Select onSelect={this.typeSelect}
                  // disabled={!this.state.topictSeclected}
                  >
                    {
                      typeOption && typeOption.map((item) => {
                        return (<Option key={item.key} value={item.key}>{item.value}</Option>)
                      })
                    }
                  </Select>

                )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="是否线下会议记录"
          >
            {
              getFieldDecorator('isOffline', {
                rules: [
                  {
                    type: 'number',
                    required: true,
                    whitespace: true,
                    message: '是否线下会议记录为必填项',
                  }
                ], initialValue: JSON.stringify(flowData) !== '{}' ? this.state.restart ? (flowData.isOffline ? 1 : 2) : '' : isTopic ? 2 : ''
              })
                (
                  <Select disabled={topicName == "重要工作部署" || restart && flowData.topicName == "重要工作部署" ? true : false}
                  // disabled={!this.state.topictSeclected||this.state.isOfflineDisabled}
                  >
                    <Option key="1" value={1}>是</Option>
                    <Option key="2" value={2}>否</Option>
                  </Select>

                )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="是否需要回执"
          >
            {
              getFieldDecorator('isNeedReceipt', {
                rules: [
                  {
                    type: 'number',
                    required: true,
                    whitespace: true,
                    message: '是否需要回执为必填项',
                  }
                ], initialValue: JSON.stringify(flowData) !== '{}' ? this.state.restart ? (flowData.isNeedReceipt ? 1 : 0) : '' : topicName == '重要工作部署' ? 0 : (topicName == '党课' || topicName == '支部党员大会' || topicName == '党支部委员会' || topicName == '党小组会') ? 1 : ''
              })
                (
                  <Select onSelect={this.receiptSelect}
                    disabled={topicName == "重要工作部署" || restart && flowData.topicName == "重要工作部署" ? true : false}
                  >
                    <Option key="1" value={1}>是</Option>
                    <Option key="0" value={0}>否</Option>
                  </Select>

                )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="任务截止时间"
          >
            {
              getFieldDecorator('endDate', {
                rules: [
                  {
                    type: 'object',
                    required: true,
                    whitespace: true,
                    message: '任务截止时间为必填项',
                  }
                ], initialValue: moment(flowData && flowData.endDate ? flowData.endDate : new Date((new Date() / 1000 + 86400) * 1000), dateFormat)
              })
                (
                  <DatePicker
                    showTime
                    format={dateFormat}
                  >

                  </DatePicker>

                )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="任务内容"
          >
            {
              getFieldDecorator('content', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '任务内容为必填项',
                  }
                ], initialValue: flowData && flowData.content ? flowData.content : ''
              })
                (
                  <TextArea onChange={(value) => this.limitWord(value)} autosize={{ minRows: 8, maxRows: 10 }} />
                )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="奖励党员荣誉积分"
          >
            {
              getFieldDecorator('specialPoint', {
                rules: [
                  {
                    type: 'number',
                    required: true,
                    whitespace: true,
                    message: '奖励党员荣誉积分为必填项',
                  }
                ], initialValue: JSON.stringify(flowData) != '{}' ? flowData.specialPoint : topicName == '重要工作部署' ? 0 : 5
              })
                (
                  <InputNumber disabled={topicName == '重要工作部署' || restart && flowData.topicName == "重要工作部署" ? true : false} style={{ width: '20%' }} />
                )
            }
          </FormItem>
          <FormItem
            {...formItemLayout} label="任务附件"
          >
            {
              getFieldDecorator('articleAttach', {})
                (
                  <ArticleAttach flowData={flowData ? flowData.taskAttachList : []} />
                  // <ArticleAttach flowData={this.props.getArticleData?this.props.getArticleData:[]}/>
                )
            }
          </FormItem>
          <FormItem colon={false}
            {...formItemLayout} label="　"
          >
            {
              getFieldDecorator('activityAttach', {})
                (
                  <ActivityAttach flowData={flowData ? flowData.taskAttachList : []} />
                  // <ActivityAttach flowData={this.props.getActivityData?this.props.getActivityData:[]}/>
                )
            }
          </FormItem>
          <FormItem colon={false}
            {...formItemLayout} label="　"
          >
            {
              getFieldDecorator('fileAttach', {})
                (
                  <FileAttach fileAttachFlag={this.state.fileAttachFlag} flowData={flowData ? flowData.taskAttachList : []} />
                  // <FileAttach fileAttachFlag={this.state.fileAttachFlag} flowData={this.props.getFileData?this.props.getFileData:[]}/>

                )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="提醒"
          > 截止前
                  {
              getFieldDecorator('remindDate', {
                initialValue: JSON.stringify(flowData) != '{}' ? flowData.remindDate : '1'
              })
                (
                  <InputNumber style={{ width: '10%' }} onChange={this.handleInputChange} />
                )
            }　天
                </FormItem>
          <FormItem
            {...formItemLayout}
            label="是否定时发布"
          >
            {
              getFieldDecorator('isTimed', {
                rules: [
                  {
                    type: 'number',
                    required: true,
                    whitespace: true,
                    message: '是否定时发布为必填项',

                  }
                ],
                initialValue: flowData && flowData.isTimed ? 1 : 0
              })
                (
                  <RadioGroup
                    onChange={this.onRadioChange}
                  >
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </RadioGroup>

                )
            }<span onClick={() => this.setState({ timePushModal: true, timePushKey: this.state.timePushKey + 1 })}>{this.state.timePushValue ? this.state.timePushValue : flowData.timedDate}</span>
            {this.state.promptValue ? <span style={{ color: 'red' }}>定时发布时间不得小于当前时间</span> : null}
          </FormItem>
          <Row style={{ margin: '0 auto 40px', textAlign: 'center' }}>
            <Button className="resetBtn" onClick={() => location.hash = PartyTaskList}>取消</Button>
            <Button className="queryBtn" onClick={this.handleSubmit} >下一步</Button>
            {/* <Button className="queryBtn" disabled={holdBtn} onClick={this.handleSubmit} >保存</Button>
                    <Button className="queryBtn" disabled={holdBtn} onClick={e=>this.handleSubmit(e,'next')}>保存并下一步</Button> */}
          </Row>
        </Form>
        <Modal
          width={1000}
          title={userData.modalData.title}
          cancelText={userData.modalData.cancelText}
          okText={userData.modalData.okText}
          maskClosable={false}//点击蒙层是否关闭
          key={showModalKey}
          visible={showModal}
          destroyOnClose={true}
          onOk={this.handleOk}
          onCancel={this.handleCancel}

        >
          <FormAndInput
            columns={userData.tableData.columns}
            url={userData.tableData.url}
            onSearch={this.handleSearch}
            type="PartyTaskAddBase"
            qfilter={this.state.qfilter} // yelu 2019-01-16 传递过去查询条件，修改分页后不带查询条件的问题
          />
        </Modal>
        <Modal
          title="定时发布"
          key={this.state.timePushKey}
          visible={this.state.timePushModal}
          onCancel={this.cancleTimePush}
          onOk={this.okTimePush}
          destroyOnClose={true}>
          <label style={{ marginRight: '10px' }}>定时发布时间</label>
          <DatePicker format="YYYY-MM-DD HH:mm:ss"
            disabledDate={this.disabledDate}
            onChange={(moment, str) => this.setState({ selectedDate: str })}
            showTime />
        </Modal>
      </div>
    );
  }
}