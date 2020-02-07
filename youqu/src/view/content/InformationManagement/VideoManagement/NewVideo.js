import React, { Component } from 'react';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import { Tabs,Select,Button,message, Table,Input,Modal,Form,Radio,Cascader} from 'antd';
import {postService,getService} from '../../myFetch';
import FormAndInput from '../../../component/table/FormAndInput';
import ServiceApi from '../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action';
@connect(
  state => ({
    dataSource: state.tableData,
    pageData:state.pageData,
    selectRowsData: state.selectRowsData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
class NewVideo extends Component{
  constructor(props){
    super(props);
    this.state={
      dp:[],
      showAddModal:false,
      keyAddModal:1,
      set:function(){},
      authorOption:[],
      update:0,
      steps:[
        {
          title:'填写视频信息',
          content:[ { key: 'title', label: '视频标题', type: 'input'},
            { key: 'digest', label: '视频摘要', type: 'input' },
            {
              key: 'adminid', label: '作者', type: 'select', option:[{ label: '是', value: 2 },{ label: '否', value: 1 }], disabled: true, ButtonList: [
                { key: 'adminid', label: '添加作者', type: 'Button', onClick: this.addAuthor },
                { key: 'adminid', label: '删除作者', type: 'Button', onClick: this.deleteAuthor },
              ]},
            { key: 'orgId', label: '视频归属', type: 'belong'},
            { key: 'layout', label: '布局形式', type: 'radioButton', option:[{ label: '是', value: 2 },{ label: '否', value: 1 }]  },
            { key: 'titleimage', label: '标题图片', type: 'uploadPicture_drop',isIamge:true},
            { key: 'picUrl', label: '内容图片', type: 'uploadPicture_button', describe:true,isIamge:true},
            { key: 'content', label: '视频内容', type: 'richText'}, 
            { key: 'video', label: '视频地址', type: 'video'},
            {key:'videoUrl'},
            {key:'videoDesp'},
            {key:'videoTime'},
            { key: 'islive', label: '直播', type: 'live_type'},

            {key:'channel'},
            {key:'channelcontent'},
            { key: 'barrage', label: '弹幕', type: 'radioButton',option:[{ label: '是', value: 2 },{ label: '否', value: 1 }] },
            { key: 'categoryIdList', label: '所属栏目', type: 'checkTree',  },
            {key:'belongOrgType'},
            {key:'orgid'},
          ],
          url:'services/news/video/addNews',
          updateUrl:'services/news/video/update',
        },
        {
          title:'选择发布范围',
          content:'',
          url:'services/news/video/update/updateNewsAutho',
        },
        {
          title:'其他设置',
          content:[
            { key: 'point', label: '奖励经验值数', type: 'inputNumber' },
            { key: 'treasure', label: '奖励积分数', type: 'inputNumber' },
            { key: 'treasureProvider', label: '积分提供方',type: 'cascader',options:[]},
            { key: 'isrequired', label: '是否必修',  type: 'radioButton', option: [{ label: '是', value: 2 },{ label: '否', value: 1 }]},
            { key: 'istimepush', label: '是否定时发送', type: 'isTimePush',  },
          ],
          url:'services/news/video/update/updateNewsOtherSettings',
          onlineUrl: 'services/news/video/newsInfo/publish',
        },
      ],

    };
  }
  componentDidMount(){}
  addAuthor= (key,get,set) =>{
    this.setState({showAddModal:true,keyAddModal:this.state.keyAddModal+1,set});
  }
  deleteAuthor=(key,get,set) =>{
    set(key,'');
  }
  handleAddModalOK=()=>{
    this.setState({showAddModal:false});
    let selectedData=this.props.selectRowsData;
    this.state.set('adminid',selectedData[0].userId)
  }
  handleAddModalCancel=()=>{
    this.setState({showAddModal:false});
  }
  handleInput=(e)=>{
    this.props.getData(ServiceApi+`services/system/systemAndCompanyUser/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=lastname_S_LK=${e.target.value}`);
  }
  render(){
    const columns=[
      {title:'ID',dataIndex: 'userId',key: 'userId'},
      {title:'姓名',dataIndex: 'lastname',key: 'lastname'},
      {title:'手机号',dataIndex:'mobile',key:'mobile'},
      {title:'部门',dataIndex:'orginfoName',key:'orginfoName'},
    ];
    return(
      <div>
        <EventAndInfoAdd
          update={this.state.update}
          type="information"
          steps={this.state.steps}
          submitText="保存并发布"
          style="add"
          save="/InformationManagement/Video"
          belonged="video"
        />
        <Modal
          title="添加用户"
          visible={this.state.showAddModal}
          cancelText="取消"
          okText="添加"
          onOk={this.handleAddModalOK}
          onCancel={this.handleAddModalCancel}
          destroyOnClose={true}
        >
          <FormAndInput
            columns={columns}
            url={'services/system/systemAndCompanyUser/list'}
            onSearch={this.handleInput}
          />
        </Modal>
      </div>
    );
  }

}


export default NewVideo;