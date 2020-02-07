import React, { Component } from 'react';
import {message} from 'antd';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import { getService, GetQueryString, postService } from '../../myFetch';
import {pageJummps} from '../PageJumps';
import API_PREFIX from '../../apiprefix';
const infoOption = [
  { label: '按照企业部门归属', value: 1 },
  { label: '按照党组织归属', value: 2 },
  { label: '按照工会归属', value: 3 },
]
export default class MagazineAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dpRootId: '-1',
      id: GetQueryString(location.hash, ['id']).id || '',
      update:0,
      valueOne:1,
      steps: [
        {
          title: '填写杂志信息',
          content: [
            { key: 'seriesId', label: '杂志系列', type: 'select', option: [], required: true },
            { key: 'nameM', label: '杂志名称', type: 'input', required: true,max:60 },
            { key: 'coverImage', label: '杂志封面', type: 'uploadPicture_drop', required: true, isIamge:true,magazineType:'magazine' },
            { key: 'periods', label: '期数', type: 'inputNumber', required: true},
            { key: 'digest', label: '摘要信息', type: 'txtArea', required: true },
            { key: 'orgType', label: '资讯归属', type: 'infoBelong', required: true,option:infoOption},
            { key: 'organizers', label: '主办', type: 'input',max:20 },
            { key: 'orgPhone', label: '电话', type: 'inputPhone'},
            { key: 'orgAddr', label: '公司地址', type: 'input',max:100 },
            { key: 'orgInter', label: '网址', type: 'inputUrl',max:100},
            { key: 'orgEmail', label: '电子邮箱', type: 'inputEmail',max:100 },
            { key: 'orgId'},
        ],
          data: { 'coverimage': window.sessionStorage.getItem('magazine') ? JSON.parse(window.sessionStorage.getItem('magazine')).coverimage : '' },
          updateUrl: pageJummps.MagazineEdit,
        },
        {
          title: '选择发布范围',
          data: {},
          url: pageJummps.InfoAuthorityAdd,
        },
        
        {
          end:true,
        },
      ],
    };
  }

  componentDidMount(){
    this.dealData();
    Promise.all([this.getData(),this.getAuth()]).then(data=>{
      let temp= [...this.state.steps];
      let allData = {...data[0],...data[1]}
      temp[0].data = allData; 
      temp[1].data = allData; 
      console.log(allData)
      if(!allData['viewTenantId'].length){
        this.setState({valueOne:2});
      }
      this.setState({steps:temp,update:this.state.update+1});
    })
  }

  getData = () =>{
    return new Promise((pass,fail)=>{
      getService(API_PREFIX+`${pageJummps.MagazineDetail}/${this.state.id}`,data=>{
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
      postService(API_PREFIX+`${pageJummps.InfoAuthorityDetail}/${this.state.id}`,{},data=>{
        if(data.status===1){
          pass(data.root.object)
        }else{
          message.error(data.errorMsg);
        }
      })
    })
    
  }
  dealData=()=> {
    //杂志系列
    getService(API_PREFIX + pageJummps.MagazineSeries, data => {
        if (data.status == 1) {
            let Data = data.root.list;
            let List = [];
            let Steps = this.state.steps;
            for (let i = 0; i < Data.length; i++) {
                List.push({key:Data[i].id,value:Data[i].fieldName});
            }
            Steps[0].content[0].option= List;
            this.setState({steps:Steps,update:this.state.update+1});
        }else{
          message.error(data.errorMsg);
        }
    });
  }

  componentWillUnmount() {
    sessionStorage.removeItem('eventAndInfoKey');
  }
  render() {
    console.log(this.state);
      return <EventAndInfoAdd 
          key={this.state.update} 
          type="information" 
          steps={this.state.steps} 
          getUrl={`${pageJummps.MagazineDetail}/${this.state.id}`} 
          datatype="magazine"
          save={'/InformationManagement/Magazine/List'} 
          style="edit" id={{ id: this.state.id }} 
          belonged="magazine" 
          valueOne={this.state.valueOne}
          dpRootId={this.state.dpRootId}
      />;
  }
}


