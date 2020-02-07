import React, { Component } from 'react';
import { Form, Row, Col, InputNumber, Radio, Button, Table, Modal, Input, Message, Upload } from 'antd';
const { confirm } = Modal;
import './QuestionsSettings.less';
// import QuestionModal from './add_modal.js';
import { getService, GetQueryString, postService } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
import FormAndInput from '../../../../component/table/FormAndInput';
import { BEGIN, getPageData, getSelectRows } from '../../../../../redux-root/action/table/table';
import { formData } from '../../../../../redux-root/action/action-type';
import ImportPart1 from "../../ImportPart1";
import EditTitle from './EditTitle';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const options = [{ label: '是', value: true }, { label: '否', value: false }];
let selectedNum = 0;
@connect(
  state => ({
    powers: state.powers,
    selectRowsData: state.table.selectRowsData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    getPageData: n => dispatch(getPageData(n)),
    getSelectRowData: n => dispatch(getSelectRows(n)),
  })
)

@Form.create()
export default class Questions extends Component {
  constructor(props) {
    super(props);
    // let param = this.props.location.search.replace('?','').split('&');
    // let activeKey = param[2] && Number(decodeURIComponent(param[2].split('=')[1])) || '0';
    let activeKey = GetQueryString(location.hash, ['activeKey']).activeKey || '';
    this.state = {
      isdisabled: false,
      activityEDB: false,//题库无值
      activityET: false,//题目无值
      singleSelectCount: 0,
      multiSelectCount: 0,
      singleSize: '',
      multipleSize: '',
      singleSelectCountEDB: 2,
      multiSelectCountEDB: 2,
      singleSelectCountET: 2,
      multiSelectCountET: 2,
      totalScore: 0,
      detail: {},
      ETSource: [],
      EDBSource: [],
      selectedRowKeys: [],
      modal_visible: false,
      edit_modal: false,
      selectekeysOne: [],///////
      selectekeysTwo: [],///////
      examDatabaseId: GetQueryString(location.hash, ['examDatabaseId']).examDatabaseId || '',
      isRadomExam: GetQueryString(location.hash, ['isRadomExam']).isRadomExam,
      edit_detail: {},
      edit_submit_data: [],
      activityId: GetQueryString(location.hash, ['id']).id || '',
      random: 0,
      custom: 0,
      examDbIds: [],
      deleteT: 0,
      selectedETs: [],
      addOneModal: false,////
      addTwoModal: false,////
      editOneModal: false,////
      editOnedetail: {},/////
      editTwodetail: {},/////   编辑题目
      newTwoModal: false,////  新建题目
      showImportModal: false,
      visible: false,
      visible1: false,
      comparArr:[],
      comparArrCopy:[],
      activeKey: String(activeKey),
      qfilter: '',//////////
      dataOne: [],///////
      dataTwo: [],//////
      dataOneIds: [],//////
      dataTwoIds: [],//////
      oneKeys: [],//////
      twoKeys: [],//////
      formData: { singleNum: 0, multiNum: 0,
         dNum: Number(GetQueryString(location.hash, ['mscore']).mscore) || 1,     /////多选分数
         sNum: Number(GetQueryString(location.hash, ['sscore']).sscore) || 1,    /////单选分数
          total: 0 },//////
      isOptionOrder:GetQueryString(location.hash, ['isOptionOrder']).isOptionOrder || true,
      upperLimit:"",///人数上限
      
      
    };
  }

  componentDidMount() {
    ////this.getAllData();
    this.getTopic();
    this.getTitle();
    let isOptionOrder=this.state.isOptionOrder;
     if(typeof(isOptionOrder)==="string"){
      if(isOptionOrder==='false'){
        isOptionOrder=false;
      }else{
        isOptionOrder=true;
      }
    }
    this.props.form.setFieldsValue({isOptionOrder});

    getService(API_PREFIX +`services/web/activity/exam/getById/${this.state.activityId}`,data => {
      if (data.status === 1) {
         let upperLimit="";
        if(data.root.object.upperLimit){
          upperLimit=data.root.object.upperLimit;
        }
        this.setState({upperLimit});
      }
    });
  }
  //请求获取基本设置数据
  // getAllData=()=>{
  //     let {formData} = this.state;
  //     getService(API_PREFIX + ``,data=>{    
  //         if (data.status===1) {
  //             formData = data.root.object;
  //             this.setState({formData});
  //         }else{
  //           Message.error(data.errorMsg);
  //         }
  //     });
  // }
  //请求获取题库数据
  getTopic = () => {
    let { formData } = this.state;
    getService(API_PREFIX + `services/web/activity/exam/getDatabaseByActivity/${this.state.activityId}/1/100`, data => {
      if (data.status === 1) {
        if (data.root.list && data.root.list.length) {
          let list = [], ids = [], singleNum = 0, multiNum = 0;
          data.root.list.map(item => {
            list.push(item);
            ids.push(item.id);
            singleNum = singleNum + item.singleNum;
            multiNum = multiNum + item.multiNum;
          });
          formData.singleNum = singleNum;
          formData.multiNum = multiNum;
          this.setState({ dataOne: list, dataOneIds: ids, formData,comparArr:data.root.list,comparArrCopy:JSON.parse(JSON.stringify(data.root.list))}, () => this.setCount());
        }
      } else {
        Message.error(data.errorMsg);
      }
    });
  }
  //请求获取题目数据
  getTitle = () => {
    let { formData } = this.state;
    getService(API_PREFIX + `services/web/activity/exam/getCustomTitltByActivity/${this.state.activityId}/1/100`, data => {
      if (data.status === 1) {
        if (data.root.list && data.root.list.length) {
          let list = [], ids = [], singleNum = 0, multiNum = 0;
          data.root.list.map(item => {
            list.push(item);
            ids.push(item.id);
            if (item.optionType === 1) {
              singleNum = singleNum + 1;
            } else if (item.optionType === 2) {
              multiNum = multiNum + 1;
            }
          });
          formData.singleNum = singleNum;
          formData.multiNum = multiNum;
          this.setState({ dataTwo: list, dataTwoIds: ids, formData }, () => this.setCount());
        }

      } else {
        Message.error(data.errorMsg);    
      }
    });
  }
  //总保存
  handleSubmit = e => {
    const { activityId, dataOne, dataTwo } = this.state;
    e.preventDefault();
    let sscore=JSON.stringify(this.props.form.getFieldValue("sscore"));
    let mscore=JSON.stringify(this.props.form.getFieldValue("mscore"));
      if(sscore.indexOf(".")!=-1){
        Message.error("单选题分数不能为小数");
        return false;
      }
      if(mscore.indexOf(".")!=-1){
        Message.error("多选题分数不能为小数");
        return false;
      }
     
    this.props.form.validateFields(['sscore', 'singleNum', 'mscore', 'multiNum', 'score', 'isTopicOrder', 'isOptionOrder'], (err, fieldsValue) => {
      if (!err) {
        fieldsValue.id = this.state.activityId;
        delete fieldsValue.score;
       
        let body = {
          activity: fieldsValue,//基本设置
          databases: dataOne,//题库对象集合
          titleInfos: dataTwo,//自定义题目集合
        };
        if(this.state.upperLimit!=""){
          body.activity.upperLimit=this.state.upperLimit;
        }
         let  that=this;
        if(body.databases.length>0  || body.titleInfos.length>0){
          postService(API_PREFIX + 'services/web/activity/exam/setExamDatabase', body, data => {
          ////postService(API_PREFIX + 'services/webtest1/activity/exam/setExamDatabase', body,data=>{
   
   
             if (data.status === 1) {
               Message.success('保存成功!');
               that.getTopic();
               // location.hash = '/EventManagement/Examination/List';
             } else {
               Message.error(data.errorMsg);
             }
           });
        }else{
          Message.error("请添加题库或者题目");
        }

      }
    });
  }
  //添加题库
  saveAddTopic = () => {
    let { dataOneIds, dataOne,comparArr } = this.state;
  let selectedData = this.props.selectRowsData;
    selectedData.map(item => {
      if (dataOneIds.indexOf(item.id) === -1) {
        dataOneIds.push(item.id);
        dataOne.push(item);
      } else {
        let index = dataOneIds.indexOf(item.id);
        dataOne.splice(index, 1, item);
      }
    });

    dataOne&&dataOne.length>0&&dataOne.map((item,index)=>{
      comparArr.push(item)
    })
  //   let result = [];
  //   let obj = {};
  //   for(let i =0; i<comparArr.length; i++){
  //     if(!obj[comparArr[i].id]){
  //         result.push(comparArr[i]);
  //         obj[comparArr[i].id] = true;
  //     }
  //  }
    // console.log("comparArr====>",result)
    this.setState({ dataOneIds,comparArr, dataOne, addOneModal: false }, () => { this.setCount(); });
    this.props.getSelectRowData([]);
    localStorage.setItem("selectedRowKeys", '');
  }
  //添加题目
  saveAddTitle = () => {
    let { dataTwoIds, dataTwo } = this.state;
    let selectedData = this.props.selectRowsData;
      selectedData.map(item => {
      if (dataTwoIds.indexOf(item.id) === -1) {
        dataTwoIds.push(item.id);
        item.activityId = this.state.activityId;
        dataTwo.push(item);
      } else {
        let index = dataTwoIds.indexOf(item.id);
        item.activityId = this.state.activityId;
        dataTwo.splice(index, 1, item);
      }
    });
    this.setState({ dataTwoIds, dataTwo, addTwoModal: false }, () => { this.setCount(); });
    this.props.getSelectRowData([]);
    localStorage.setItem("selectedRowKeys", '');
  }



   //导入题目的
   getSuccessResult=selectedData => {
    let { dataTwoIds, dataTwo } = this.state;
    // let selectedData = this.props.selectRowsData;
      selectedData.map(item => {
      if (dataTwoIds.indexOf(item.id) === -1) {
        dataTwoIds.push(item.id);
        item.activityId = this.state.activityId;
        dataTwo.push(item);
      } else {
        let index = dataTwoIds.indexOf(item.id);
        item.activityId = this.state.activityId;
        dataTwo.splice(index, 1, item);
      }
    });
    this.setState({ dataTwoIds, dataTwo, addTwoModal: false }, () => { this.setCount(); });
    this.props.getSelectRowData([]);
    localStorage.setItem("selectedRowKeys", '');
  }

// 父组件调用子组件的方法
  onRef = (ref) => {
    this.child = ref
  }

  //搜索题库
  handleInput = (e) => {
    let tenantId = window.sessionStorage.getItem("tenantId");
    let qfilter = e.target.value == '' ? '' : `Q=dbName=${e.target.value}`;
    this.setState({ qfilter });
    this.props.getPageData({ currentPage: 1, pageSize: 10, query: qfilter });
    // this.props.getData(API_PREFIX + `services/web/activity/examtitle/getDatabaseList/1/10?${qfilter}`);
    this.props.getData(API_PREFIX + `services/web/activity/exam/getDatabaseListForExam/1/10?${qfilter}&Q=tenantId=${tenantId}`);

  }
  //搜索题目
  handleTitle = (e) => {
    let tenantId = window.sessionStorage.getItem("tenantId");
    let qfilter = e.target.value == '' ? `Q=tenantId=${tenantId}` : `Q=titleName=${e.target.value}&Q=tenantId=${tenantId}`;
    this.setState({ qfilter });
    localStorage.setItem("selectedRowKeys", '');
    this.props.getPageData({ currentPage: 1, pageSize: 10, query: qfilter });
    // this.props.getData(API_PREFIX + `services/web/activity/votingtitle/getVoteTopic/1/10?${qfilter}`);
     this.props.getData(API_PREFIX + `services/web/activity/examdatabase/getCustomTitltList/1/10?${qfilter}`);
  }
  //题库删除
  deleteOne = () => {
    let { dataOne, dataOneIds, oneKeys } = this.state;
    oneKeys.map(item => {
      let index = dataOneIds.indexOf(item);
      dataOneIds.splice(index, 1);
      dataOne.splice(index, 1);
    });
    this.setState({ dataOne, dataOneIds, oneKeys: [], selectekeysOne: [] }, () => { this.setCount(); });
  }
  //题目删除
  deleteTwo = () => {
    let { dataTwo, dataTwoIds, twoKeys } = this.state;
    twoKeys.map(item => {
      let index = dataTwoIds.indexOf(item);
      dataTwoIds.splice(index, 1);
      dataTwo.splice(index, 1);
    });
    this.setState({ dataTwo, dataTwoIds, twoKeys: [], selectekeysTwo: [] }, () => { this.setCount(); });
  }
  //获取编辑题库的数据
  getEditTopicData = data => {
    let { dataOne, dataOneIds } = this.state;
    let index = dataOneIds.indexOf(data.id);
    dataOne.splice(index, 1, data);
    this.setState({ dataOne },() => { this.setCount();});
  }



  ////获取编辑题目的数据
  getupdata=data=>{
    let { dataTwo} = this.state;
    dataTwo.map((item,index)=>{
      if(item.id==data.id){
         dataTwo.splice(index,1,data);
      }
    });
     this.setState({dataTwo},() => { this.setCount();});
  }


  ////导入成功的
  hideModel = () => {
    this.setState({showImportModal: false});
  }

/////新增题目的数据
  getnewdata=data=>{
    let { dataTwo, dataTwoIds} = this.state;
    // dataTwo.map((item,index)=>{
    //   if(item.id==data.id){
    //     console.log("item",item);
    //     dataTwo.splice(index,1,data);
    //   }
    // });
    dataTwo.push(data);
    dataTwoIds.push(data.id);
      this.setState({dataTwo,dataTwoIds},() => { this.setCount();});
  }
  //计算分数
  setCount = () => {
    let { formData, dataOne, dataTwo, dataOneIds, dataTwoIds } = this.state;
    // console.log('呵呵呵呵呵呵呵呵呵呵呵呵呵呵', dataTwo)
    let singleNum = 0, multiNum = 0;
    dataOne.map(item => {
      singleNum = singleNum + item.singleSize;//单选个数
      multiNum = multiNum + item.multipleSize;//多选个数
    });
    dataTwo.map(item => {
      if (item.titleType === 1) {//单选
        singleNum = singleNum + 1;//单选个数
      } else if (item.titleType === 2) {//多选
        multiNum = multiNum + 1;//多选个数
      }
    });
    formData.singleNum = singleNum;
    formData.multiNum = multiNum;
    formData.total = singleNum * formData.sNum + multiNum * formData.dNum;
    this.setState({ formData }, () => {
      this.props.form.setFieldsValue({
        singleNum: formData.singleNum,
        multiNum: formData.multiNum,
        score: formData.total,
      });
    });
  }
  //修改分数
  handleChange = (value, key) => {
    if (key === 'sscore') {
      let { formData } = this.state;
      formData.sNum = value;
      this.setState({ formData }, () => { this.setCount(); });
    } else if (key === 'mscore') {
      let { formData } = this.state;
      formData.dNum = value;
      this.setState({ formData }, () => { this.setCount(); });
    }
  }
  //控制用户导入的modal的显示或者隐藏
  showImportModal = () => {
    this.setState({
      showImportModal: true,
    });
  }
  //确定用户导入
  handleImportModalOk = () => {
    this.child.UploadChange();
    this.setState({
      showImportModal: false,
    });
  }
  //取消用户导入
  handleImportModalCancel = () => {
    this.setState({
      showImportModal: false,
    });
  }
  handleVisibleChange = () => {
    let { selectedETs } = this.state;
    if (selectedETs.length === 0) {
      this.setState({
        visible: false,
      });
    } else {
      this.setState({
        visible: true,
      });
    }
  }
  Popcancel = () => {
    this.setState({ visible: false });
  }
  handleVisibleChange1 = () => {
    let { selectedDBKeys } = this.state;
    if (selectedDBKeys.length === 0) {
      this.setState({
        visible1: false,
      });
    } else {
      this.setState({
        visible1: true,
      });
    }
  }

  refresh=(id)=>{
   let that=this;
    confirm({
      title: '刷新前请保存当前编辑,确定刷新吗?',
      content: '',
      onOk() { 
        that.surerefresh(id);
      },
      onCancel() {},
    })
  }

  surerefresh=(id)=>{
  let {comparArrCopy} = this.state;
        comparArrCopy.map((item,index)=>{
      if(item.id==id){
        let body={};
        postService(API_PREFIX + `services/web/activity/exam/updateExamDatabase/${this.state.activityId}/${id}`, body, data => {
           if (data.status === 1) {
               Message.success('刷新成功!');
               this.getTopic();
             } else {
               Message.error(data.errorMsg);
             }
           });
      }
        });
}


  Popcancel1 = () => {
    this.setState({ visible1: false });
  }
  // hideModal = () => { // 题目导入成功后隐藏弹框
  //   this.setState({ showImportModal: false });
  // }
  hideEditOneModal = () => {
    this.setState({ editOneModal: false });
  }
  ////编辑题目
  hideEditTwoModal = () => {
    this.setState({ editTwoModal: false });
  }
 ////新建题目
  hidenewTwoModal = () => {
    this.setState({ newTwoModal: false,editTwoModal: false });
  }
  render() {
    const { dataOne, dataTwo } = this.state;
    const formItemLayout = { labelCol: { span: 12 }, wrapperCol: { span: 12 } };
    const editModal = { labelCol: { span: 6 }, wrapperCol: { span: 12 } };
    const { form: { getFieldDecorator } } = this.props;
    const { selectekeysOne, selectekeysTwo, oneKeys, twoKeys, formData, editOnedetail, editTwodetail, EDBSource, ETSource, examDbIds } = this.state;
    let powers = this.props.powers;
    let tenantId = window.sessionStorage.getItem("tenantId");
    // let importPowers = powers && powers['20002.22011.209'];
    dataOne.map((item, index) => {
      item.sNum = index + 1;
    });
    dataTwo.map((item, index) => {
      item.sNum = index + 1;
    });
    const rowSelectionOne = {
      selectedRowKeys: oneKeys,
      onChange: (ids, data) => {
        this.setState({ oneKeys: ids });
      },
    };
    const rowSelectionTwo = {
      selectedRowKeys: twoKeys,
      onChange: (ids, data) => {
        this.setState({ twoKeys: ids });
      },
    };
    ////这是添加题库
    const columnsOne = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '题库名称',
        dataIndex: 'dbName',
        key: 'dbName',
      },
      {
        title: '单选题个数',
        dataIndex: 'singleSize',
        key: 'singleSize',
      },
      {
        title: '多选题个数',
        dataIndex: 'multipleSize',
        key: 'multipleSize',
      },
      // {
      //   title: '显示顺序',
      //   dataIndex: 'showIndex',
      //   key: 'showIndex',
      // },
      {
        title: '操作',
        key: 'x',
        render: (text, record) => {
           return <div> 
          {this.state.activeKey ==0 ? (<a onClick={() => this.setState({ editOneModal: true, editOnedetail: record })}>编辑</a>):
           (<a onClick={() => this.setState({ editOneModal: true, editOnedetail: record })}>查看</a>)
        }
        {this.state.comparArrCopy&&this.state.comparArrCopy.length>0?this.state.comparArrCopy.map((item,index)=>{
          if(item.id==record.id&&this.state.activeKey!=="1"&&this.state.activeKey!=="2"){
            return <a onClick={() => this.refresh(record.id)} style={{marginLeft:"5px"}}>刷新</a>;
          }

        }):null}
        </div>;
        
      },
      },
    ];
    /////这是自定义题目设置
    const columnsTwo = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '题目名称',
        dataIndex: 'titleName',
        key: 'titleName',
      },
      {
        title: '题目类型',
        dataIndex: 'titleType',
        key: 'titleType',
        render: (text, record) => {
          if (record.titleType === 1) {
            return '单选';
          } else if (record.titleType === 2) {
            return '多选';
          }else if (record.titleType === 3) {
            return '问答';
          }
        },
      },
      {
        title: '显示顺序',
        dataIndex: 'showIndex',
        key: 'showIndex',
      },
      {
        title: '操作',
        key: 'x',
        render: (text, record) => {
          return <div>
            {this.state.activeKey!=0?
            <a onClick={() => this.setState({ editTwoModal: true, editTwodetail: record })}>查看</a>
            :<a onClick={() => this.setState({ editTwoModal: true, editTwodetail: record })}>编辑</a>}
            
            {/* <a onClick={() =>
               (location.hash =GetQueryString(location.hash, ['activeKey']).activeKey==1?
               `/EventManagement/Examination/EditCustomQuestion?isEdit=true&id=${record.id}&activityId=${this.state.activityId}&topicId=${record.examDbTopicId}&isOptionOrder=${this.state.isOptionOrder}&questionOnline=questionOnline`
               :
                `/EventManagement/Examination/EditCustomQuestion?isEdit=true&id=${record.id}&activityId=${this.state.activityId}&topicId=${record.examDbTopicId}&isOptionOrder=${this.state.isOptionOrder}`)
              }
                >编辑</a> */}
          </div>;
        },
      },
    ];

    /////这是点击按钮加载的列表
    const columnsThr = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '题库名称',
        dataIndex: 'dbName',
        key: 'dbName',
      },
      {
        title: '题库数量',
        dataIndex: 'titleNumber',
        key: 'titleNumber',
      },
      {
        title: '单选题个数',
        dataIndex: 'singleSize',
        key: 'singleSize',
      },
      {
        title: '多选题个数',
        dataIndex: 'multipleSize',
        key: 'multipleSize',
      },
      // {
      //   title: '显示顺序',
      //   dataIndex: 'showIndex',
      //   key: 'showIndex',
      // },

    ];


  ////这是点击添加题目时加载的列表
    const columnsFou = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '题目名称',
        dataIndex: 'titleName',
        key: 'titleName',
      },
      {
        title: '题目类型',
        dataIndex: 'titleType',
        key: 'titleType',
        render: (text, record) => {
          if (record.titleType === 1) {
            return '单选';
          } else if (record.titleType === 2) {
            return '多选';
          }else if (record.titleType === 3) {
            return '问答';
          }
        },
      },
      {
        title: '显示顺序',
        dataIndex: 'showIndex',
        key: 'showIndex',
      },

    ];
    return <div className="question-main">
      <div className="question-top">
        <div className="question-top-container">
          <span className="question-title" style={{ marginLeft: '18px' }}>基本设置</span>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={6}>
                <Form.Item {...formItemLayout} label="每个单选题分数">
                  {getFieldDecorator('sscore', {
                    initialValue: formData.sNum || 1,
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        validator: (rule, value, callback) => {
                          if (value < 0) {
                            callback('请勿输入负数');
                          } else if (value > 100) {
                            callback('数字不得超过100');
                          } else if (isNaN(value) && value != undefined) {
                            callback('请勿输入非数字');
                          } else if (!value) {
                            callback('请输入非0数字');
                          } else {
                            callback();
                          }
                        },
                      },
                    ],
                  })(<InputNumber min={0} onChange={value => this.handleChange(value, 'sscore')}  disabled={this.state.activeKey !=0 ? true:false}/>)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item {...formItemLayout} label="单选题总个数">
                  {getFieldDecorator('singleNum', {
                    initialValue: formData.singleNum || 0,
                    rules: [
                      {
                        required: true, whitespace: true, type: 'number',
                      },
                    ],
                  })(<InputNumber min={0} disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item {...formItemLayout} label="每个多选题分数">
                  {getFieldDecorator('mscore', {
                    initialValue: formData.dNum || 1,
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        validator: (rule, value, callback) => {
                          if (value < 0) {
                            callback('请勿输入负数');
                          } else if (value > 100) {
                            callback('数字不得超过100');
                          } else if (isNaN(value) && value != undefined) {
                            callback('请勿输入非数字');
                          } else if (!value) {
                            callback('请输入非0数字');
                          }else {
                            callback();
                          }
                        },
                      },
                    ],
                  })(<InputNumber min={0} onChange={value => this.handleChange(value, 'mscore')}  disabled={this.state.activeKey !=0 ? true:false}/>)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item {...formItemLayout} label="多选题总个数">
                  {getFieldDecorator('multiNum', {
                    initialValue: formData.multiNum || 0,
                    rules: [
                      {
                        required: true, whitespace: true, type: 'number',
                      },
                    ],
                  })(<InputNumber min={0} disabled />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item {...formItemLayout} label="选项顺序是否固定">
                  {getFieldDecorator('isOptionOrder', {
                    rules: [
                      {
                        required: true, whitespace: true, type: 'boolean',
                      },
                    ],
                    initialValue: true,
                  })(<RadioGroup options={options} disabled={this.state.activeKey !=0 ? true:false}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item {...formItemLayout} label="总分数">
                  {getFieldDecorator('score', {
                    initialValue: formData.total || 0,
                    rules: [
                      {
                        required: true, whitespace: true, type: 'number',
                      },
                    ],
                  })(<InputNumber min={0} disabled />)}
                </Form.Item>
              </Col>
              {/* <Col span={6} offset={6}>
                <Form.Item {...formItemLayout} label=" 选项顺序是否固定">
                  {getFieldDecorator('isTopicOrder', {
                    initialValue: true,
                    rules: [
                      {
                        required: true,whitespace: true,type:'boolean'
                      },
                    ],
                  })(<RadioGroup options={options} />)}
                </Form.Item>
              </Col> */}
            </Row>
          </Form>
        </div>
      </div>
      {
      //   this.state.activeKey!=0?     
      <div>
      <div className="question-middle">
        <div className="random-question">
          <span className="question-title" style={{ marginLeft: '18px' }}>随机题库设置</span><br />
          <span>
           { this.state.activeKey ==0? <Button style={{ marginBottom: '10px', marginLeft: '16px' }} className="queryBtn" onClick={() => this.setState({ addOneModal: true,qfilter:''  })}>添加题库</Button> :null}
           { this.state.activeKey ==0? <Button className="deleteBtn" onClick={this.deleteOne} disabled={oneKeys.length <= 0}>删除</Button>:null}
          </span>
          <Table
            rowKey="id"
            bordered
            columns={columnsOne}
            dataSource={dataOne}
            pagination={false}
            rowSelection={rowSelectionOne}
          />
        </div>
      </div>
      <div className="question-bottom">
        <div className="random-question">
          <span className="question-title" style={{ marginLeft: '18px' }}>自定义题目设置</span><br />
          { this.state.activeKey ==0? <Button className="queryBtn" style={{ marginBottom: '10px', marginLeft: '16px' }} onClick={() => this.setState({ newTwoModal: true })}>新建题目</Button>:null}
          { this.state.activeKey ==0? <Button className="queryBtn" style={{ marginBottom: '10px', marginLeft: '16px' }} onClick={() => this.setState({ addTwoModal: true,qfilter:'' })}>添加题目</Button>:null}
          { this.state.activeKey ==0? <Button className="deleteBtn" onClick={this.deleteTwo} disabled={twoKeys.length <= 0}>删除</Button>:null}
          {/* {importPowers ? <Button className="resetBtn" onClick={this.showImportModal}>批量导入题目</Button> : null} */}
          { (this.state.activeKey =="" || this.state.activeKey ==0) ? (<Button className="resetBtn" onClick={this.showImportModal}>批量导入题目</Button>):null }

          <Table
            rowKey="id"
            bordered
            columns={columnsTwo}
            dataSource={dataTwo}
            pagination={false}
            rowSelection={rowSelectionTwo}
          />
        </div>
        <Row style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button className="resetBtn" onClick={() => location.hash = `/EventManagement/Examination/List?id=${this.state.activeKey}`}>返回</Button>
          { this.state.activeKey ==0? <Button className="queryBtn" onClick={this.handleSubmit}>保存</Button>:null}
        </Row>
      </div>
      </div>
    }
      <Modal
        title="添加题库"
        cancelText="返回"
        okText="添加"
        width={1000}
        visible={this.state.addOneModal}
        onOk={this.saveAddTopic}
        onCancel={() => {this.setState({ addOneModal: false });this.props.getSelectRowData([]);localStorage.setItem("selectedRowKeys", '');}}
        destroyOnClose={true}
      >
        <FormAndInput
          columns={columnsThr}
          typeC={'checkradio'}
          url={`services/web/activity/exam/getDatabaseListForExam`}
          onSearch={this.handleInput}
          qfilter={`${this.state.qfilter}Q=tenantId=${tenantId}`}
        />
      </Modal>
      <Modal
        title="添加题目"
        cancelText="返回"
        okText="添加"
        width={800}
        visible={this.state.addTwoModal}
        onOk={this.saveAddTitle}
        onCancel={() => {this.setState({ addTwoModal: false });this.props.getSelectRowData([]);localStorage.setItem("selectedRowKeys", '');}}
        destroyOnClose={true}
      >
        <FormAndInput
          columns={columnsFou}
          typeC={'checkradio'}
          // url='services/web/activity/examtitle/getCustomTitltList'
         url='services/web/activity/examdatabase/getCustomTitltList' 
          onSearch={this.handleTitle}
          qfilter={`${this.state.qfilter}Q=tenantId=${tenantId}`}
        />
      </Modal>
      <Modal
        title="编辑题库"
        width={800}
        visible={this.state.editOneModal}
        footer={null}
        onCancel={() => this.setState({ editOneModal: false })}
        destroyOnClose={true}
      >
        <EditTopic
          editOnedetail={editOnedetail}
          hideEditModal={this.hideEditOneModal}
          getEditData={this.getEditTopicData}
          comparArr={this.state.comparArr}
        />
      </Modal>
      <Modal
        title="编辑题目"
        width={1000}
        visible={this.state.editTwoModal}
        footer={null}
        onCancel={() => this.setState({ editTwoModal: false })}
        destroyOnClose={true}
      >
        <EditTitle
          editTwodetail={editTwodetail}
          hideEditTwoModal={this.hideEditTwoModal}
          hidenewTwoModal={this.hidenewTwoModal}
          getupdata={this.getupdata}
        />
      </Modal>
      <Modal
        title="新建题目"
        width={1000}
        visible={this.state.newTwoModal}
        footer={null}
        onCancel={() => this.setState({ newTwoModal: false })}
        destroyOnClose={true}
      >
        <EditTitle
          // editTwodetail={editTwodetail}
          hidenewTwoModal={this.hidenewTwoModal}
          getnewdata={this.getnewdata}
        />
        
      </Modal>
      <Modal
        title="导入题目"
        cancelText="返回"
        okText="确定"
        visible={this.state.showImportModal}
        onOk={this.handleImportModalOk}
        onCancel={this.handleImportModalCancel}
        destroyOnClose={true}
      >
        <ImportPart1
         onRef={this.onRef}
         importUrl={`services/web/activity/examtitle/importExamTitle`}
        //  listurl={`${API_PREFIX}services/activity/examTopic/list`}
         downlodUrl={API_PREFIX + 'services/web/activity/examtitle/titletemplate'}
         hideModel={this.hideModel}
         getSuccessResult={this.getSuccessResult}
         fileName='导入题目模板'
        />
      </Modal>
    </div>;
  }
}

@Form.create()
class EditTopic extends Component {
  constructor(props) {
    super(props);
    this.state={
      activeKey:  GetQueryString(location.hash, ["activeKey"]).activeKey || "", 
    };
  }
  handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields(['dbName', 'singleSize', 'multipleSize', 'showIndex'], (err, fieldsValue) => {
      if (!err) {
        let values = { ...fieldsValue };
        values['id'] = this.props.editOnedetail.id;
        values['dbType'] = 2;
        values['factSingle'] = this.props.editOnedetail.factSingle;
        values['factMultiple'] = this.props.editOnedetail.factMultiple;
        // postService(API_PREFIX + 'services/web/activity/examtitle/updateDatabase', values, data => {
        //   if (data.status === 1) {
        //     Message.success('修改成功!');
            this.props.hideEditModal();
            this.props.getEditData(values);
          // } else {
          //   Message.error(data.retMsg);
          //   this.props.hideEditModal();
          // }
        // });
      }
    });

  }
  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator;
    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 15 } };
    const editOnedetail = this.props.editOnedetail;
    const comparArr = this.props.comparArr;
        return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="题库名称">
            {getFieldDecorator('dbName', {
              initialValue: editOnedetail.dbName,
              rules: [{ required: true, whitespace: true, message: '必填项' }],
            })(<Input  disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label="单选题个数">
            {getFieldDecorator('singleSize', {
              initialValue: editOnedetail.singleSize,
              rules: [{ type: 'number', required: true, whitespace: true,
              validator: (rule, value, callback) => {
                let  SinNum;
                let arr=[];             
                comparArr&&comparArr.length>0&&comparArr.map((item,index)=>{
                    if(item.id==editOnedetail.id){
                        arr.push(item)
                    }
                })
                console.log("comparArr====>",comparArr,arr);
                if(comparArr.length==0){
                   arr=[];
                }
                if(arr.length==0){
                  SinNum=editOnedetail.singleSize
                }else{
                   if(arr[0].status){
                    SinNum=arr[0].singleSize
                   }else{
                    SinNum=arr[0].factSingle 
                   }
                }

                if (value >SinNum) {
                  callback(`请勿超过题库中原有题目数量${arr[0].status?arr[0].singleSize:arr[0].factSingle}`);
                } else if (value < 0) {
                  callback('请勿设置为负数');
                } else if (isNaN(value) && value != undefined) {
                  callback('请勿输入非数字');
                } else {
                  callback();
                }
              }}],
            })(<InputNumber style={{ width: '100%' }} min={0} disabled={this.state.activeKey !=0 ? true:false} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="多选题个数">
            {getFieldDecorator('multipleSize', {
              initialValue: editOnedetail.multipleSize,
              rules: [{ type: 'number', required: true, whitespace: true,
              validator: (rule, value, callback) => {
              //  let mulNum=editOnedetail.factMultiple?editOnedetail.factMultiple:editOnedetail.multipleSize;
              let  mulNum;
              let arr=[];           
               comparArr&&comparArr.length>0&&comparArr.map((item,index)=>{
                   if(item.id==editOnedetail.id){
                       arr.push(item)
                   }
               })
               if(comparArr.length==0){
                  arr=[];
               }
               if(arr.length==0){
                mulNum=editOnedetail.multipleSize
               }else{
                // mulNum=arr[0].multipleSize;

                if(arr[0].status){
                  mulNum=arr[0].multipleSize
                 }else{
                  mulNum=arr[0].factMultiple 
                 }
               }

                if (value >mulNum) {
                  callback(`请勿超过题库中原有题目数量${arr[0].status?arr[0].multipleSize:arr[0].factMultiple}`);
                } else if (value < 0) {
                  callback('请勿设置为负数');
                } else if (isNaN(value) && value != undefined) {
                  callback('请勿输入非数字');
                } else {
                  callback();
                }
              }}],
            })(<InputNumber style={{ width: '100%' }} min={0} disabled={this.state.activeKey !=0 ? true:false}/>)}
          </FormItem>
          {/* <FormItem {...formItemLayout} label="显示顺序">
            {getFieldDecorator('showIndex', {
              initialValue: editOnedetail.showIndex,
              rules: [{ type: 'number', required: true, whitespace: true, message: '必填项' }],
            })(<InputNumber style={{ width: '100%' }} min={0} disabled={this.state.activeKey !=0 ? true:false}/>)}
          </FormItem> */}
          <Row style={{ textAlign: 'center' }}>
            <Button type="primary" style={{ marginLeft: '0px', marginBottom: '30px' }} className="resetBtn" onClick={() => this.props.hideEditModal()} >取消</Button>
            <Button type="primary" className="queryBtn" htmlType="submit" style={{display:this.state.activeKey !=0 ? "none":"inline-block"}} >保存</Button>
          </Row>
        </Form>
      </div>
    );
  }
}