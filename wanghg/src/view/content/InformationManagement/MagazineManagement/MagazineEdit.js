/**
 * type:1、event活动页面 2、information资讯页面
 * steps:步骤条以及Tabs内容,新建是步骤条,编辑和详情是tabs
 * steps title:每一步的说明。
 * steps content:表单的内容，第二步权限设置不需要传content。
 * submitText:最后一步提交按钮的label,每个页面都不一样
 * style:1、add 新增 2、edit 编辑 3、detail详情
 * eventForm:第一页 表单的格式 type:1、Button按钮 2、redioButton单选 3、input输入框 4、uploadPicture_drop拖拽类型上传图片，uploadPicture_button按钮类型上传图片5、select下拉选择 6、datePicker日期选择 7、inputNumber数字输入 8、富文本框 9、所属栏目selectTree单选树 checkTree勾选树 10、rangePicker时间段选择
 * otherForm:第三页表单数据 如果没有则把steps第三个对象直接写{end:true}
 */
import React, { Component } from 'react';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import { getService, GetQueryString, postService } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
export default class MagazineAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dpRootId: '-1',
      magazineSeriesOption: [], //杂志系列
      id: GetQueryString(location.hash, ['id']).id || '', //获取前一个页面传过来的id
      department:[],//发布范围中处理后的部门数据
      party:[],//发布范围中处理后的部门数据
      group:[],//发布范围中处理后的部门数据
      update:0,
      steps: [
        {
          title: '填写杂志信息',
          content: '',
          data: { 'coverimage': window.sessionStorage.getItem('magazine') ? JSON.parse(window.sessionStorage.getItem('magazine')).coverimage : '' },
          updateUrl: 'services/news/magazine/update',
        },
        {
          title: '选择发布范围',
          data: {},
          url: 'services/news/magazine/update/updateMagazineAutho',
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

  dealData=()=> {
    let mSeriesOption=[];
    let informationForm = [];
    //杂志系列
    getService(API_PREFIX + 'services/system/dictionary/magazineSeries/getAllList', data => {
      if (data.retCode == 1) {
        let result = [];
        for (let index = 0; index < data.root.list.length; index++) {
          let node = data.root.list[index];
          let tmp = {};
          tmp.key = node.id + '';
          tmp.value = node.fieldName + '';
          result.push(tmp);
        }
        this.setState({magazineSeriesOption: result}, () => {
          console.log('前：magazineSeriesOption', this.state.magazineSeriesOption);
          informationForm = [
            { key: 'magazineSeriesId', label: '杂志系列', type: 'select', option: this.state.magazineSeriesOption, required: true },
            { key: 'name', label: '杂志名称', type: 'input', required: true,max:20  },
            { key: 'coverimage', label: '杂志封面', type: 'uploadPicture_drop', required: true, isIamge:true },
            { key: 'periods', label: '期数', type: 'inputNumber', required: true},
            { key: 'digest', label: '摘要信息', type: 'textArea', required: true },
            { key: 'orgid', label: '所属部门', type: 'cascader', required: true },
            { key: 'companyname', label: '主办', type: 'input' },
            { key: 'companyphone', label: '电话', type: 'input' },
            { key: 'companyaddr', label: '公司地址', type: 'input' },
            { key: 'companyinter', label: '网址', type: 'input' },
            { key: 'companyemail', label: '电子邮箱', type: 'input' },
          ];
          getService(API_PREFIX +`services/news/magazine/magazineInfo/get/${this.state.id}`,data=>{
            if (data.retCode ===1) {
              console.log('请求结果',data);
              this.state.steps.map((item, index)=>{
                if(index == 0){
                  item.content = informationForm;
                }
                item.data = data.root.object;
              });
              this.setState({ steps: this.state.steps, update:this.state.update+1});

            }
          });
        });
      }
    });

    //获取详情中发布范围中的数据
    getService(API_PREFIX+`services/system/cateogry/news/orgListByAutho/get/${this.state.id}`,data=>{
      if(data.retCode==1){
        console.log('this.state',data.root.object);

        //党组织的数据处理
        this.dealPartyData( data.root.object.partyOrganizationsList);

        //部门中的数据处理
        this.dealDepartmentData(data.root.object.organizationList);

        //虚拟群组中的数据处理
        this.dealGroupData(data.root.object.virtualGroupList);

        let finallyData={
          id:this.state.id,
          department:'',
          partyid:'',
          groups:'',
        };
        console.log('this.state',this.state.department);
        console.log('this.state',this.state.party);
        console.log('this.state',this.state.group);

        if(this.state.department){
          finallyData.department=this.state.department.toString();
        }
        if(this.state.party){
          finallyData.partyid=this.state.party.toString();
        }
        if(this.state.group){
          finallyData.groups=this.state.group.toString();
        }
        console.log('发布权限中的数据：',finallyData);
        let temp= [...this.state.steps];
        temp[1].data=finallyData,
        this.setState({steps:temp,update:this.state.update+1});
      }
    });
    
    //获取部门的数据
    getService(API_PREFIX + 'services/system/organization/organizationList/get', data => {
      if (data.retCode === 1) {
        this.setState({
          dpRootId: data.root.list && data.root.list[0].id,
        });

      }
    });
  }

  //处理党组织中的数据
  dealPartyData(data){
    data.map((item,index)=>{
      if(item.authSelected){//为true则
        this.state.party.push(item.id);
      }
      if(item.partyOrganizationList){
        this.dealPartyData(item.partyOrganizationList);
      }
    });
  }
  //处理部门中的数据
  dealDepartmentData(data){
    data.map((item,index)=>{
      if(item.authSelected){//为true则
        this.state.department.push(item.id);
      }
      if(item.subOrganizationList){
        this.dealDepartmentData(item.subOrganizationList);
      }
    });
  }
  //处理虚拟群组中的数据
  dealGroupData(data){
    data.map((item,index)=>{
      if(item.authSelected){//为true则
        this.state.group.push(item.id);
      }
      if(item.children){
        this.dealGroupData(item.children);
      }
    });
  }

  render() {
    // console.log('aaa',JSON.parse(window.sessionStorage.getItem('magazine')));
    // const { magazineSeriesOption } = this.state;
    //
    // const radioOption = [
    //   { label: '资讯', value: '1' },
    //   { label: '活动', value: '2' },
    //   { label: '链接', value: '3' },
    //   { label: '杂志', value: '4' },
    // ];
    //
    // const departmentOption = [{ key: '1', value: '部门1' }, { key: '2', value: '部门2' }];
    // const option1 = [{ key: 'true', value: '是' }, { key: 'false', value: '否' }];

    /* const informationForm = [
      { key: 'magazineSeriesId', label: '杂志系列', type: 'select', option: magazineSeriesOption, required: true },
      { key: 'name', label: '杂志名称', type: 'input', required: true },
      { key: 'coverimage', label: '杂志封面', type: 'uploadPicture_drop', required: true },
      { key: 'periods', label: '期数', type: 'input', required: true},
      { key: 'digest', label: '摘要信息', type: 'textArea', required: true },
      { key: 'orgid', label: '所属部门', type: 'cascader', required: true },
      { key: 'companyname', label: '主办', type: 'input' },
      { key: 'companyphone', label: '电话', type: 'input' },
      { key: 'companyaddr', label: '公司地址', type: 'input' },
      { key: 'companyinter', label: '网址', type: 'input' },
      { key: 'companyemail', label: '电子邮箱', type: 'input' },
    ];*/

    /*const steps = [
      {
        title: '填写杂志信息',
        content: informationForm,
        data: { 'coverimage': window.sessionStorage.getItem('magazine') ? JSON.parse(window.sessionStorage.getItem('magazine')).coverimage : '' },
        url: 'services/news/magazine/update',
      },
      {
        title: '选择发布范围',
        data: {},
        url: 'services/news/magazine/update/updateMagazineAutho',
      },
      {
        end:true,
      },
    ];*/
    return <EventAndInfoAdd key={this.state.update} type="information" steps={this.state.steps}
      save={'/InformationManagement/Magazine'} style="edit" id={{ id: this.state.id }} belonged="magazine" dpRootId={this.state.dpRootId}/>;
  }
}


