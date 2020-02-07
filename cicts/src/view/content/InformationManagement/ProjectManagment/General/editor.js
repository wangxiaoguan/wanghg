import React, { Component } from 'react';
import NewEventAndInfoAdd from '../../../../component/EventAndInfoAdd/NewEventAndInfoAdd';
import {message} from 'antd';
import {GetQueryString,getService,postService} from '../../../myFetch';
import {pageJummps} from '../../PageJumps';
import API_PREFIX from '../../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../../redux-root/action/table/table';
import { setTimePushData } from '../../../../../redux-root/action/eventAndInfoData/timePushData';
@connect(
    state => ({
      dataSource: state.table.tableData,
      pageData:state.table.pageData,
      selectRowsData: state.table.selectRowsData,
    }),
    dispatch => ({
      getData: n => dispatch(BEGIN(n)),
      setTimePushData: n => dispatch(setTimePushData(n)),
    })
)
class EditArticle extends  Component{
  constructor(props){
    super(props);
    this.state={
      newsId:GetQueryString(location.hash,['newsId']).newsId,
      partyRootId:'',
      dpRootId:'',
      update:0,
      steps:[
        {
          title:'填写文章信息',
          content:[
            { key: 'title', label: '专题名称', type: 'input', required: true ,max:60},
            { key: 'titleImage', label: '专题封面', type: 'uploadPicture_drop',required: true,isIamge:true},
            { key: 'categoryIdList', label: '所属栏目', type: 'columnTree', required: true },
            { key: 'isHomePage', label: '是否上首页',  type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isPush', label: '是否推送',  type: 'radioButton', option: isOrNotOption , required: true},
            { key: 'isTimePublish', label: '是否定时发送', type: 'isTimePublish', required: true },
            { key: 'isShare', label: '是否可分享', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isInnerShare', label: '是否只能内部转发', type: 'radioButton', option: isOrNotOption , required: true},
          ],
          updateUrl:pageJummps.TopicCommonEdit,
          data:{},
        },
        {
          title:'选择发布范围',
          content:'',
          url:pageJummps.InfoAuthorityAdd,
          data:{}
        }
      ],
    }
  }
  componentDidMount(){
    Promise.all([this.getData(),this.getAuth()]).then(data=>{
      let temp= [...this.state.steps];
      let allData = {...data[0],...data[1]}
      temp[0].data = allData; 
      temp[1].data = allData; 
      this.setState({steps:temp,update:this.state.update+1});
    })
  }
  componentWillUnmount() {
    sessionStorage.removeItem('eventAndInfoKey')
  }
  getData = () =>{
    return new Promise((pass,fail)=>{
      getService(API_PREFIX+`${pageJummps.TopicCommonDetail}/${this.state.newsId}`,data=>{
        if(data.status===1){
          pass(data.root.object)
        }else{
          message.error(data.errorMsg);
        }
      })
    })
  }
  getAuth = () => {
    return new Promise((pass,fail)=>{
      postService(API_PREFIX+`${pageJummps.InfoAuthorityDetail}/${this.state.newsId}`,{},data=>{
        if(data.status===1){
          pass(data.root.object)
        }else{
          message.error(data.errorMsg);
        }
      })
    })
    
  }

  render(){
    return(
        <div>
          <NewEventAndInfoAdd
              key={this.state.update}
              type="information"
              steps={this.state.steps}
              style="edit"
              id={{ id:this.state.newsId}}
              save={`/InformationManagement/project/list?tabsVale=${sessionStorage.getItem("projectGeneralTabsKey")}`}
              belongedType="General"
              belonged="article"
              partyRootId={this.state.partyRootId}
              dpRootId={this.state.dpRootId}
              datatype='special'
              getUrl={`${pageJummps.TopicCommonDetail}/${this.state.newsId}`}
          >
          </NewEventAndInfoAdd>
        </div>
    );
  }

}

const isOrNotOption=[
    { label: '是', value: true },
    { label: '否', value: false},
  ];

export default EditArticle;