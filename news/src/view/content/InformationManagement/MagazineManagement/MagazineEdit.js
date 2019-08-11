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
import ServiceApi from '../../apiprefix';
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
          content:[
            { key: 'magazineSeriesId', label: '杂志系列', type: 'select', option:[], required: true },
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
          ],
          data: {},
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
  }
  render() {
    return <EventAndInfoAdd 
        key={this.state.update} 
        type="information"
        steps={this.state.steps}
        save={'/InformationManagement/Magazine'} 
        style="edit" 
        id={{ id: this.state.id }} 
        belonged="magazine" 
        dpRootId={this.state.dpRootId}
    />;
  }
}


