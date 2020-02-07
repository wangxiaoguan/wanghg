import { Form, Select, InputNumber, Input, DatePicker,Popconfirm, Radio, Button, Modal, Cascader, Row, Col,Icon} from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import EventAndInfoAdd from '../../../../component/EventAndInfoAdd/EventAndInfoAdd';
import API_PREFIX from '../../../apiprefix';
import { setMerchantData, setMerchantAdd } from '../../../../../redux-root/action/attach/attach';

@connect(state => ({
  selectRowsData: state.table.selectRowsData,  //封装表格选择数据
}),
dispatch => ({
  setMerchantData: n => dispatch(setMerchantData(n)),
  setMerchantAdd: n => dispatch(setMerchantAdd(n)),
})
)
export default class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: '',
      visible: false,
      num:'',
    };
  }

  componentDidMount(){
    this.props.setMerchantData('');
    this.props.setMerchantAdd('');
  }

  showModal = (item) => {
    this.setState({
      visible: true,
      num:item,
    });
  }

  handleOk = () => {
    this.setState({visible: false });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }
  test = (key, get, set) => {
    this.setState({ test: set });
    set(key, 'a');
    console.log('key', get);
    set(key, 'bbb');
  };
  render() {
    console.log('test', this.state.test); 
    const infoOption = [
      { label: '按照企业部门归属', value: 1 },
       { label: '按照党组织归属', value: 2 },
      { label: '按照工会归属', value: 3 },
    ];
    const eventForm = [
      { key: 'activityName', label: '活动名称', type: 'input', required: true,max:60,word:'' },
      { key: 'titleImage', label: '标题图片', type: 'uploadPicture_drop', required: true,isIamge:true },
      // { key: 'organizationId', label: '活动所属部门', type: 'cascader', required: true },
      { key: 'orgType', label: '活动归属', type: 'infoBelong', required: true,option:infoOption},
      { key:'orgType'},
      { key:'orgId'},
      { key: 'shopTime', label: '订购时间', type: 'rangePicker', required: true, code: 'shopTime'},
      { key: 'pickTime', label: '取货时间', type: 'rangePicker', required: true, code: 'pickTime'},
      { key: 'pickDate', label: '取货提醒时间', type: 'datePicker', required: false, code: 'pickDate'},
      // 新增内容开始
      // { key: 'orderTime', label: '订餐时间', type: 'input', required: true,word:'每周一09：00-每周三16：00' },
      // { key: 'pickUpTime', label: '取货时间', type: 'input', required: true ,word:'每周五（11：30-12：30；17：00-18：00）'},
      { key: 'address', label: '取货地点', type: 'pickupAddress', required: false ,max:50,word:''},
      // 新增内容结束
      { key: 'content', label: '活动内容', type: 'richText', required: true }, //rich text
      // { label: '关联类型', type: 'relation' },
      // {key:'shopping',label:'商家',type:'shopping',required:false},
      // {key:'shoppingT',label:'商家TEST',type:'shoppingT',required:false},
      { key: 'categoryRelevances', label: '所属栏目', type: 'checkTree', required: true },
      { key:'depCategory'}
    ];
    const steps = [
      {
        title: '填写活动信息',
        content: eventForm,
        url: 'services/web/activity/ordering/insert',
        updateUrl: 'services/web/activity/ordering/update',
        typeId: '3',
      },
      {
        title: '权限设置',
        url: 'services/web/activity/enrolment/update',
      },
      {
        title: '其他设置',
        content: otherForm,
        url: 'services/web/activity/enrolment/update',
      },
    ];
    const columns = [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
    },{
        title: '姓名',
        key: 'lastname',
        dataIndex: 'lastname',
    },{
        title: '手机号',
        key: 'acount',
        dataIndex: 'acount',
    },{
        title: '部门',
        key: 'orginfoName',
        dataIndex: 'orginfoName',
    }];
    const search=[
      {key:'lastname',label:'姓名',qFilter:'Q=lastname_S_LK',type:'input'},
    ];
    return(
    <div>
      <Modal
          title="选择用户"
          width={700}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
      >
        <TableAndSearch type="radio" search={search} url={'services/activity/orderActivity/seller'} columns={columns}/>
      </Modal>
      <EventAndInfoAdd   code='orderList' datatype='orderList' selectRowsData={this.props.selectRowsData} num={this.state.num} showModal={this.showModal} type="event" timePush={timePush} steps={steps} submitText="设置订购商品" linkTo="/EventManagement/Order/SetShopping" style="add" belonged="order" save={'/EventManagement/Order/List'}/>
{/*
      <EventAndInfoAdd type="event" steps={steps} submitText="设置问卷题目" style="add" linkTo="/EventManagement/Questionnaire/TopicList" timePush={timePush} belonged="questionnaire" save={'/EventManagement/Questionnaire/List'}/>*/}
    </div>
    ); 
   
  }
}
const radioOption = [
  { label: '是', value: true },
  { label: '否', value: false },
];

const otherForm = [
  { key: 'isHomePage', label: '是否上首页', type: 'radioButton', option: radioOption, required: true },
  { key: 'isShare', label: '是否可分享', type: 'radioButton', option: radioOption, required: true },
  { key: 'isInnerShare', label: '是否只能内部转发', type: 'radioButton', option: radioOption, required: true },
  { key: 'isComment', label: '是否可评论', type: 'radioButton', option: radioOption, required: true },
  { key: 'isNick', label: '是否可匿名评论', type: 'radioButton', option: radioOption, required: true },
  { key: 'isShowPeople', label: '是否显示参与用户', type: 'radioButton', option: radioOption, required: true },
  { key: 'isPush', label: '是否推送', type: 'radioButton', option: radioOption, required: true },
  { key: 'isTimePublish', label: '是否定时发送', type: 'isTimePublish', required: true },
  { key: 'point', label: '奖励参与用户经验值数', type: 'inputNumber'  },
  { key: 'punishPoint', label: '惩罚参与用户经验值数', type: 'inputNumber'  },
];

const timePush = {
  url: 'services/web/system/taskParam/taskParam/add',
  body: {
    'name': '订购活动定时发布任务',
    //'cronDate': '2018-06-19 16:10:00',
    'type': 42,
    'queryType': 'post',
    'queryUrl': API_PREFIX +'services/web/activity/ordering/publishAndOffline/1',
    'queryValue': '[]',
    'queryContentType': 'application/json',
  },
};


