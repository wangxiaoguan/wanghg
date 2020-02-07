import React, { Component} from 'react';
import { Tabs,Select,Button,message, Table,Input,Modal,Form,Radio,Cascader} from 'antd';
import NewEventAndInfoAdd from '../../../component/EventAndInfoAdd/NewEventAndInfoAdd';
import FormAndInput from '../../../component/table/FormAndInput';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {postService,getService} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
import {setSelectTreeData,setCheckTreeData,} from '../../../../redux-root/action/tree/tree';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Search = Input.Search;
@connect(
  state => ({
    
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    selectRowsData: state.table.selectRowsData,
    checkTreeData: state.tree.treeCheckData,
    selectDetail: state.tree.treeSelectData.selectDetail,
    selectTreeData: state.tree.treeSelectData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    setSelectData: n => dispatch(setSelectTreeData(n)),
    setCheckData: n => dispatch(setCheckTreeData(n)),
  })
)
class Add extends  Component{
  constructor(props){
    super(props);
    this.state={
     
      partyData:[],
      set:function(){},
      authorOption:[],
      update:0,
      steps:[
        {
          title:'填写学习信息',
          content:[
            { key: 'title', label: '学习名称', type: 'input', required: true,max:20 },
            { key: 'titleImage', label: '标题图片', type: 'uploadPicture_drop',required: true,isIamge:true},
            { key: 'isRequired', label: '是否必修', type: 'isrequired_learn', option: [{key:2,  value:'是' },{key:1,  value:'否' }], required: true},
            { key: 'content', label: '学习内容', type: 'richText',required: true},
            { key: 'video', label: '视频地址', type: 'videoLearn'},
            { key: 'url' },
            { key: 'desp' },
            { key: 'videoLong' },
            { key: 'studyTime', label: '学习时长',type: 'inputNumber1'},
            { key: 'examId', label: '关联考试', type: 'relation_test' },
            { key: 'point', label: '奖励党员荣誉积分', type: 'inputNumber2' },
            { key: 'newsAttachs', label: '学习附件', type: 'filePicture', describe:false,isAttach:true},
            { key: 'isTimePublish', label: '是否定时发送', type: 'isTimePublish', required: false},
            { key: 'categoryIdList', label: '所属栏目', type: 'columnTree', required: true},
          ],
          url:'services/web/party/partyStudy/addPartyStudy',
          updateUrl:'services/web/party/partyStudy/updatePartyStudy',
        },
        {
          title:'设置接收人',  
          content:[{ key: 'partys', label: '接收人', type: 'LearnTree', required: true },],
          url:'services/web/auth/authdata/updAuthData',
          online: 'services/web/party/partyStudy/publishPartyStudy',
        },
      
      ],
    };
  }

  render(){

    return(
      <div>
        <NewEventAndInfoAdd
          update={this.state.update}
          type="information"
          steps={this.state.steps}
          submitText="保存并返回"
          style="add"
          save="/PartyBuildGarden/PartyLearning"
          belonged="article"
          belongedType='partyLearn'
          partyReturn='back'
          addlearnType="addlearnTimePush"
        />
      </div>
    );
  }
}
//是否必修
const isrequired = [
  {key:1,  value:'否' },
  {key:2,  value:'是' },
];

export default Add;
