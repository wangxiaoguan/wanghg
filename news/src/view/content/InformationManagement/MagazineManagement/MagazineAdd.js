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
import {postService,getService} from '../../myFetch';
import ServiceApi from '../../apiprefix';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
export default class MagazineAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dp:[], //杂志归属部门
      magazineSeriesOption: [], //杂志系列
    };
  }

  componentDidMount(){
    //页面相关的数据处理
    this.dealData();
  }

  dealData=()=>{

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
    console.log('dp',this.state.dp);
    const { magazineSeriesOption } = this.state;

    const radioOption = [
      { label: '资讯', value: '1' },
      { label: '活动', value: '2' },
      { label: '链接', value: '3' },
      { label: '杂志', value: '4' },
    ];

    const option1 = [{ key: 'true', value: '是' }, { key: 'false', value: '否' }];

    const informationForm = [
      { key: 'magazineSeriesId', label: '杂志系列', type: 'select', option: magazineSeriesOption, required: true },
      { key: 'name', label: '杂志名称', type: 'input', required: true,max:20 },
      { key: 'coverimage', label: '杂志封面', type: 'uploadPicture_drop', required: true, isIamge:true },
      { key: 'periods', label: '期数', type: 'inputNumber', required: true},
      { key: 'digest', label: '摘要信息', type: 'textArea', required: true },
      { key: 'orgid', label: '所属部门', type: 'cascader', required: true },
      { key: 'companyname', label: '主办', type: 'input',max:20 },
      { key: 'companyphone', label: '电话', type: 'input'},
      { key: 'companyaddr', label: '公司地址', type: 'input',max:100 },
      { key: 'companyinter', label: '网址', type: 'input',max:100},
      { key: 'companyemail', label: '电子邮箱', type: 'input',max:100 },
    ];

    const steps = [
      {
        title: '填写杂志信息',
        content: informationForm,
        url: 'services/news/magazine/magazine/add',
        updateUrl: 'services/news/magazine/update',
      },
      {
        title: '选择发布范围',
        url: 'services/news/magazine/update/updateMagazineAutho',
      },
      {
        end:true,
      },
    ];

    return <EventAndInfoAdd type="information" steps={steps} style="add" belonged="magazine" save={"/InformationManagement/Magazine"}/>;
  }
}


