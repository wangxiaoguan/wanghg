import React, { Component} from 'react';
import NewEventAndInfoAdd from '../../../../component/EventAndInfoAdd/NewEventAndInfoAdd';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../../redux-root/action/table/table';
import {pageJummps} from '../../PageJumps';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    selectRowsData: state.table.selectRowsData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
class NewArticle extends  Component{
  constructor(props){
    super(props);
    this.state={
      update:0,
      steps:[
        {
          title:'填写文章信息',
          content:[
            { key: 'title', label: '专题名称', type: 'input', required: true,max: 60 },
            { key: 'titleImage', label: '专题封面', type: 'uploadPicture_drop',required: true,isIamge:true},
            { key: 'categoryIdList', label: '所属栏目', type: 'columnTree', required: true },
            { key: 'isHomePage', label: '是否上首页',  type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isPush', label: '是否推送',  type: 'radioButton', option: isOrNotOption , required: true},
            { key: 'isTimePublish', label: '是否定时发送', type: 'isTimePublish', required: true },
            { key: 'isShare', label: '是否可分享', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isInnerShare', label: '是否只能内部转发', type: 'radioButton', option: isOrNotOption , required: true},
          ],
          url:pageJummps.TopicCommonAdd,
          updateUrl:pageJummps.TopicCommonEdit,
        },
        {
          title:'选择发布范围',
          content:'',
          url:pageJummps.InfoAuthorityAdd,
          online: pageJummps.TopicCommonPush,
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
          belongedType="General"
          steps={this.state.steps}
          submitText="保存并发布"
          style="add"
          save={`/InformationManagement/project/list?tabsVale=${sessionStorage.getItem("projectGeneralTabsKey")}`}
          belonged="article"
          datatype='special'
        />
      </div>
    );
  }
}

const isOrNotOption=[
  { label: '是', value: true },
  { label: '否', value: false},
];

export default NewArticle;
