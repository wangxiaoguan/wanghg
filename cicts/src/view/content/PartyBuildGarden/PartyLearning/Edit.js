import React, { Component } from 'react';
import NewEventAndInfoAdd from '../../../component/EventAndInfoAdd/NewEventAndInfoAdd';
import FormAndInput from '../../../component/table/FormAndInput';
import { Tabs,Select,Button,message, Table,Input,Modal,Form,Radio,Cascader} from 'antd';
import {GetQueryString,getService,postService} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
import {setSelectTreeData,setCheckTreeData,} from '../../../../redux-root/action/tree/tree';
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
class Edit extends  Component{
  constructor(props){
    super(props);
    let param = this.props.location.search.replace('?','').split('&');
    let activeKey = param[1] && Number(decodeURIComponent(param[1].split('=')[1])) || '0';
    this.state={
      newsId:GetQueryString(location.hash,['Id']).Id,//获取前一个页面传过来的id
      update:0,
      editData:'',
      activeKey:String(activeKey),
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
          updateUrl:'services/web/party/partyStudy/updatePartyStudy',
        },
        {
          title:'设置接收人',  
          content:[{ key: 'partys', label: '接收人', type: 'LearnTree', required: true },],
          url:'services/web/auth/authdata/updAuthData',
        },
      
      ],
    }
  }

  componentDidMount(){
    this.dealData();
  }
  dealData=()=>{
      Promise.all([this.getData(),this.getAuth()]).then(data=>{

        let temp= [...this.state.steps];
        let allData = {...data[0],...data[1]}
        if(allData.contentImage && allData.contentImage.length){
            allData['desp'] = allData.contentImage[0].desp;
            allData['videoLong'] = allData.contentImage[0].videoLong;
        }else{
            allData['desp'] = '';
            allData['videoLong'] = '';
        }
        let newsAttachs = []
        allData.newsAttachs && allData.newsAttachs.forEach(item => {
          if (item.type == 2) {
            allData['desp'] = item.desp
            allData['videoLong'] = item.videoLong
          } else {
            newsAttachs.push(item)
          }
        })
        allData.newsAttachs = newsAttachs
        temp[0].data = allData; 
        temp[1].data = allData; 
        this.setState({steps:temp,update:this.state.update+1});
      })
  }
  getData = () =>{
    return new Promise((pass,fail)=>{
      getService(API_PREFIX+`services/web/party/partyStudy/getPartyStudyDetail/${this.state.newsId}`,data=>{
        if(data.status===1){
          pass(data.root.object)
        }
      })
    })
  }
  getAuth = () => {
    return new Promise((pass,fail)=>{
      postService(API_PREFIX+`services/web/auth/authdata/getAllByDataId/${this.state.newsId}`,{},data=>{
        if(data.status===1){
          pass(data.root.object)
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
              save={`/PartyBuildGarden/PartyLearning?id=${this.state.activeKey}`}
              belonged="article"
              belongedType='partyLearn'
          />
        </div>
    );
  }

}

const isrequired = [
  {key:1,  value:'否' },
  {key:2,  value:'是' },
];
export default   Edit;