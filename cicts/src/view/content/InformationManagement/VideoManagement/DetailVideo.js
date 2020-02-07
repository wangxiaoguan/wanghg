import React, { Component } from 'react';
import {message} from 'antd';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import {GetQueryString,getService,postService} from '../../myFetch';
import {pageJummps} from '../PageJumps';
import API_PREFIX from '../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
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
class DetailVideo extends Component{
  constructor(props){
    super(props);
    this.state={
      newsTypeOptions:[],//文章类型(lookup字典中)
      dp:[],//其他设置积分提供方
      newsId:GetQueryString(location.hash,['newsId']).newsId,//获取前一个页面传过来的id
      newsData:{},//详情中的数据
      releaseRange:[],//发布范围中处理后的数据
      department:[],//发布范围中处理后的部门数据
      partyid:[],//发布范围中处理后的部门数据
      groups:[],//发布范围中处理后的部门数据
      showAddModal:false,//展示作者列表，数据来源于用于管理
      keyAddModal:1,//作者列表的key值
      inputValue:'',//查询时输入框的内容
      selectedRowKeys:[],//当前选中
      currentValue:'',//文章归属  单选按钮选中的值
      set:function(){},
      categoryIdList:[],//编辑时选中的栏目
      partyRootId:'',
      dpRootId:'',
      update:0,
      valueOne:1,
      valueTwo:0,
      //三个步骤对象
      steps:[
        {
          title:'填写视频信息',
          content:[
            { key: 'title', label: '视频标题', type: 'input', required: true,max:60  },
            { key: 'digest', label: '视频摘要', type: 'input' },
            { key: 'auth', label: '作者', type: 'input' },
            // { key: 'orgId', label: '视频归属', type: 'belong', required: true},
            { key: 'orgType', label: '资讯归属', type: 'infoBelong', required: true,option:infoOption},
            // { key: 'layout', label: '布局形式', type: 'radioButton', option:layoutOption ,required: true },
            { key: 'titleImage', label: '标题图片', type: 'uploadPicture_drop',required: true,isIamge:true},
            { key: 'contentImage', label: '内容图片', type: 'filePicture',isIamge:true,datatype:'video',required: true,},
            { key: 'content', label: '视频内容', type: 'richText',required:false}, //rich text
            { key: 'categoryIdList', label: '所属栏目', type: 'infoColumnTree', required: true },
            { key: 'video', label: '视频地址', type: 'video', required:true},
            { key:'url'},
            { key:'desp'},
            { key:'videoLong'},
            { key:'orgType'},//资讯归属
            { key:'orgId'},//归属选择
            { key:'depCategory'},
            { key:'remark'}
          ],
          data:{},
        },
        {
          title:'选择发布范围',
          content:'',
          data:{}
        },
        {
          title:'其他设置',
          content: [
            { key: 'point', label: '奖励经验值数', type: 'inputNumber' },
            // { key: 'treasure', label: '奖励积分数', type: 'inputNumber' },
            // { key: 'treasureProvider', label: '积分提供方', type: 'cascader', options: [] },
            { key: 'isComment', label: '是否可评论', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isNickComment', label: '是否可匿名评论', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isShare', label: '是否可分享', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isInnerShare', label: '是否只能内部转发', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isHomePage', label: '是否上首页', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isPush', label: '是否推送', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isTimePublish', label: '是否定时发送', type: 'isTimePublish', required: true },
            { key: 'isImportant', label: '是否永不清理', type: 'radioButton', option: isOrNotOption , required: true },
          ],
          data:{}
        },
      ],
    }
  }
  componentDidMount(){
    //页面相关的数据处理
    this.dealData();
    Promise.all([this.getData(),this.getAuth()]).then(data=>{
      let temp= [...this.state.steps];
      let allData = {...data[0],...data[1],orgId:data[0]['orgTreePath']}
      allData['desp'] = allData.newsAttachs[0].desp
      allData['videoLong'] = allData.newsAttachs[0].videoLong
      if(allData['departments'].length||allData['partys'].length||allData['groups'].length||allData['unions'].length){
        this.setState({valueOne:2});
      } 
      if(allData['companyList'].length){
        let tenantId = window.sessionStorage.getItem('tenantId');
        if(allData.companyList.indexOf(tenantId)>-1){
          this.setState({valueTwo:1});
        }else{
          this.setState({valueTwo:2});
        }
      }
      temp[0].data = allData; 
      temp[1].data = allData; 
      temp[2].data = allData; 
      this.setState({videoData:allData,steps:temp,update:this.state.update+1});
    })
  }
  componentWillUnmount() {
    sessionStorage.removeItem('eventAndInfoKey') //yelu 移除session中保存的权限设置tab对应的key值
  }
  getData = () =>{
    return new Promise((pass,fail)=>{
      getService(API_PREFIX+`${pageJummps.VideoDetail}/${this.state.newsId}`,data=>{
        if(data.status===1){
          pass(data.root.object)
        }else{
          message.error(data.errorMsg)
        }
      })
    })
  }
  getAuth = () => {
    return new Promise((pass,fail)=>{
      postService(API_PREFIX+`services/web/auth/authdata/getAllByDataId/${this.state.newsId}`,{},data=>{
        if(data.status===1){
          pass(data.root.object)
        }else{
          message.error(data.errorMsg)
        }
      })
    })
    
  }
  getCompany = () => {
    return new Promise((pass,fail)=>{
      getService(API_PREFIX+`${pageJummps.companyUrl}`,data=>{
        if(data.status===1){
          let companyData = data.root.object;
          let unionCheckedKeys = []
            for (let index = 0; index < companyData.length; index++) {
              let node = companyData[index];
              node.key = node.id;
              unionCheckedKeys.push(node.id)
            }
            pass(unionCheckedKeys)
        }else{
            message.error(data.errorMsg)
        }
      })
    })
  }
  dealData=()=>{
    //获取部门(积分提供方)
    // getService(API_PREFIX + pageJummps.DepartmentTree, data => {
    //   if (data.status === 1) {
    //     let organizationData = data.root.list;
    //     this.dealDepartmentData(organizationData);
    //     this.setState({ dp: organizationData }, () => {
    //       let temp = [...this.state.steps];
    //       // temp[2].content[2].option =organizationData;
    //       this.setState({ steps: temp, update: this.state.update + 1 });
    //     });
    //   }
    // });
  }

  //处理部门中的数据
  dealDepartmentData(data){
    data&&data.map((item,index)=>{
      item.value=item.id+'';
      item.label=item.name;
      item.children=item.subOrganizationList;
      if(item.subOrganizationList){
        this.dealDepartmentData(item.subOrganizationList);
      }
    });
  }
 
  render(){
    return(
        <EventAndInfoAdd
            key={this.state.update}
            type="information"
            steps={this.state.steps}
            style="detail"
            datatype={'article'}
            id={{ id:this.state.newsId}}
            save={`/InformationManagement/Video?tabsVale=${sessionStorage.getItem('videoTabsKey')}`}//添加返回到所在页面的tab字段xwx2018/12/21
            belonged="video"
            partyRootId={this.state.partyRootId}
            dpRootId={this.state.dpRootId}
            videoDetail="videoDetail"
            valueOne={this.state.valueOne}
            valueTwo={this.state.valueTwo}
            getUrl={`${pageJummps.VideoDetail}/${this.state.newsId}`}
        >
        </EventAndInfoAdd>
    );
  }
}
//布局形式
const layoutOption = [
  { label: '左右', value: 1 },
  { label: '上下', value: 2 },
];
const isOrNotOption=[
  { label: '是', value: true },
  { label: '否', value: false },
];
const infoOption = [
  { label: '按照企业部门归属', value: 1 },
  { label: '按照党组织归属', value: 2 },
  { label: '按照工会归属', value: 3 },
]
export default DetailVideo;