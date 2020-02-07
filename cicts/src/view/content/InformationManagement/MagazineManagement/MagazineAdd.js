import React, { Component } from 'react';
import {postService,getService} from '../../myFetch';
import {pageJummps} from '../PageJumps';
import API_PREFIX from '../../apiprefix';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
const infoOption = [
  { label: '按照企业部门归属', value: 1 },
  { label: '按照党组织归属', value: 2 },
  { label: '按照工会归属', value: 3 },
]
export default class MagazineAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dp:[], //杂志归属部门
      magazineSeriesOption: [], //杂志系列
      newsType:1,
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
          url: pageJummps.MagazineAdd,
          updateUrl: pageJummps.MagazineEdit,
        },
        {
          title: '选择发布范围',
          url: pageJummps.InfoAuthorityAdd,
        },
        {
          end:true,
        },
      ],
    };
  }

  componentDidMount(){
    //页面相关的数据处理
    this.dealData();
  }

  dealData=()=>{
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
            this.setState({steps:Steps});
        }
    });

      let localPowers = window.sessionStorage.getItem('powers')
      let powers = JSON.parse(localPowers)
      let departPower=powers && powers['20004.21502.000'];//部门权限
      let partyPower=powers && powers['20005.23001.003'];//党组织权限
      let unionPower=powers && powers['20007.21704.000'];//工会权限
      let type = 1;
      if(departPower&&partyPower&&!unionPower){//110
          type = 1;
      }else if(departPower&&!partyPower&&unionPower){//101
          type = 1;
      }else if(!departPower&&partyPower&&unionPower){//011
          type = 2;
      }else if(departPower&&!partyPower&&!unionPower){//100
          type = 1;
      }else if(!departPower&&!partyPower&&unionPower){//001
          type = 3;
      }else if(!departPower&&partyPower&&!unionPower){//010
          type = 2;
      }else if(departPower&&partyPower&&unionPower){//111
          type = 1;
      }
      this.setState({newsType:type})
  }

  //处理组织机构中的数据
  dealDepartmentData(data){
    data.map((item,index)=>{
      item.value=item.id+'';
      item.label=item.name;
      item.children=item.subOrganizationList;
      if(item.subOrganizationList){//不为空，递归
        this.dealDepartmentData(item.subOrganizationList);
      }
    });
  }

  render() {
    return <EventAndInfoAdd 
        type="information" 
        dataType="informationmagazineAdd" 
        steps={this.state.steps} style="add" 
        belonged="magazine" 
        newsType={this.state.newsType}
        save={"/InformationManagement/Magazine/List"}
    />;
  }
}


