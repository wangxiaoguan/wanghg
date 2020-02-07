import React, { Component } from 'react';
import {message} from 'antd';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import {GetQueryString,getService,postService} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import { pageJummps } from '../../InformationManagement/PageJumps';
class Detail extends  Component{
  constructor(props){
    super(props);
    this.state={
      newsTypeOptions:[],
      dp:[],
      newsId:GetQueryString(location.hash,['newsId']).newsId,
      newsData:{},
      releaseRange:[],
      department:[],
      partyid:[],
      groups:[],
      showAddModal:false,
      keyAddModal:1,
      inputValue:'',
      selectedRowKeys:[],
      currentValue:'',
      set:function(){},
      categoryIdList:[],
      partyRootId:'',
      dpRootId:'',
      update:0,
      newsType:'',
      valueOne:1,
      valueTwo:0,
      //三个步骤对象
      steps:[
        {
          title:'填写文章信息',
          content:[
            { key: 'newsType', label: '文章类型', type: 'information_type', option:[], required: true},
            { key: 'title', label: '文章标题', type: 'input', required: true, max:20},
            { key: 'digest', label: '文章摘要', type: 'input' },
            { key: 'auth', label: '作者', type: 'input' },
            { key: 'orgType', label: '资讯归属', type: 'infoBelong', required: true,option:infoOption},
            { key: 'layout', label: '布局形式', type: 'radioButton', option:PicLayoutOption ,required: true ,hide:[1,4]},
            { key: 'layout', label: '布局形式', type: 'radioButton', option:layoutOption ,required: true ,hide:[2]},
            { key: 'titleImage', label: '标题图片', type: 'uploadPicture_drop',required:true,isIamge:true},
            { key: 'contentImage', label: '内容图片', type: 'filePicture',describe:true,hide:[4],isIamge:true},
            { key: 'isAtlas', label: '是否设置为图集', type: 'radioButton', option:atlasOption ,required: true,hide:[4] },
            { key: 'imageType', label: '图片类型', type: 'radioButton', option:imageTypeOp,hide:[4] },
            { key: 'url', label: '网页地址', type: 'input', describe:false,hide:[1,2],required:true},
            { key: 'content', label: '文章内容', type: 'richText',hide:[2,4],required:true},
            { label: '关联类型测试', type: 'relation',hide:[2,4]},
            { key: 'categoryIdList', label: '所属栏目', type: 'infoColumnTree', required: true,},
            { key: 'newsAttachs', label: '上传附件', type: 'filePicture', describe:false,hide:[4],isAttach:true},
            { key:'orgType'},
            { key:'orgId'},
            { key:'relationType'},
            { key:'url'},
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
          content:[
              { key: 'exp', label: '奖励经验值数', type: 'inputNumber' },
              // { key: 'point', label: '奖励积分数', type: 'inputNumber' },
              { key: 'isComment', label: '是否可评论', type: 'radioButton', option: isOrNotOption, required: true },
              { key: 'isNickComment', label: '是否可匿名评论', type: 'radioButton', option: isOrNotOption, required: true },
              { key: 'isShare', label: '是否可分享',  type: 'radioButton', option: isOrNotOption , required: true},
              { key: 'isInnerShare', label: '是否只能内部转发', type: 'radioButton', option: isOrNotOption , required: true},
              { key: 'isHomePage', label: '是否上首页',  type: 'radioButton', option: isOrNotOption, required: true },
              { key: 'isPush', label: '是否推送',  type: 'radioButton', option: isOrNotOption , required: true},
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
      console.log(data)
      let temp= [...this.state.steps];
      let allData = {...data[0],...data[1],orgId:data[0]['orgTreePath']}
      temp[0].data = allData; 
      temp[1].data = allData; 
      temp[2].data = allData; 
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
      this.setState({steps:temp,update:this.state.update+1,newsType:allData.newsType});
    })
  }
  componentWillUnmount() {
    sessionStorage.removeItem('eventAndInfoKey') //yelu 移除session中保存的权限设置tab对应的key值
  }
  getData = () =>{
    return new Promise((pass,fail)=>{
      getService(API_PREFIX+`${pageJummps.ArticleDetail}/${this.state.newsId}`,data=>{
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
      postService(API_PREFIX+`${pageJummps.InfoAuthorityDetail}/${this.state.newsId}`,{},data=>{
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
      //获取部门的数据
      getService(API_PREFIX + pageJummps.DepartmentTree,data=>{
          if (data.status === 1) {
              this.setState({department:data.root.object})
          }else{
            message.error(data.errorMsg)
          }
      });
      //文章类型
      getService(API_PREFIX+pageJummps.ArticleType,data=>{
          if(data.status === 1){
              let steps = this.state.steps;
              this.dealLookup(data.root.object);
              steps[0].content[0].option = data.root.object
              this.setState({steps});
          }else{
            message.error(data.errorMsg)
          }
      });
  }

  //处理文章类型的数据
  dealLookup(data) {
    data.map(item => {
      item.key = Number(item.code);
      item.value = item.fieldName;
    });
  }

  render(){
    console.log(this.state)
    return(
        <div>
          <EventAndInfoAdd
              key={this.state.update}
              type="information"
              steps={this.state.steps}
              style="detail"
              datatype={'article'}
              id={{ id:this.state.newsId}}
              save={`/PersonalWork/Examine`}//返回到当前页面xwx2018/12/19
              belonged="article"
              partyRootId={this.state.partyRootId}
              dpRootId={this.state.dpRootId}
              articleDetail="articleDetail"
              newsType={this.state.newsType}
              valueOne={this.state.valueOne}
              valueTwo={this.state.valueTwo}
              getUrl={`${pageJummps.ArticleDetail}/${this.state.newsId}`}
          >
          </EventAndInfoAdd>
        </div>
    );
  }

}
//布局形式——图片
const PicLayoutOption = [
  { label: '左右', value: 1 },
  { label: '上下', value: 2 },
  { label: '三张图片一次排开', value: 3 },
];
//布局形式——非图片
const layoutOption = [
  { label: '纯文本', value: 0 },
  { label: '左右', value: 1 },
  { label: '上下', value: 2 },

];
//图片类型
const imageTypeOp=[
  { label: '大横幅', value: 1 },
  { label: '小横幅', value: 2},
];
//是否设置为图集
const atlasOption=[
  { label: '是', value: true },
  { label: '否', value: false },
]
const isOrNotOption=[
  { label: '是', value: true },
  { label: '否', value: false },
];
const infoOption = [
  { label: '按照企业部门归属', value: 1 },
  { label: '按照党组织归属', value: 2 },
  { label: '按照工会归属', value: 3 },
]
export default Detail;