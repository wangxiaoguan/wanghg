import React, { Component } from 'react';
import { Tabs, Message } from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { postService, getService,GetQueryString } from '../../../myFetch';
import ServiceApi from '../../../apiprefix';
const TabPane = Tabs.TabPane;
export default class Score extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: '0',
      activityId: GetQueryString(location.hash, ['id']).id,
    };
  }
  //处理组织机构中的数据
  dealDepartmentData(data) {
    data.map((item, index) => {
      item.value = item.id + '';
      item.label = item.name;
      item.children = item.subOrganizationList;
      if (item.subOrganizationList) {//不为空，递归
        this.dealDepartmentData(item.subOrganizationList);
      }
    });
  }
  componentDidMount() {

  }
  render() {
    const search = [
      {
        key: 'name',
        label: '用户姓名',
        qFilter: 'Q=name_S_LK',
        type: 'input',
      },
      {
        key: 'mobile',
        label: '手机号',
        qFilter: 'Q=mobile_i_LK',
        type: 'input',
      },
      {
        key: 'organizationId', label: '部门', qFilter: 'Q=organizationId_S_ST', type: 'cascader',
        option: this.state.dp,
      },
    ];
    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '用户姓名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '部门',
        dataIndex: 'orgname',
        key: 'orgname',
      },
      {
        title: '分数',
        dataIndex: 'score',
        key: 'score',
      },
      {
        title: '考试时间',
        dataIndex: 'createDate',   //todo
        key: 'createDate',
      },
    ];
    
    return( 
      <TableAndSearch columns={columns} url={`services/activity/examActivity/examResult/list/${this.state.activityId}`}
        search={search} deleteBtn={{ order: 1, url:'services/activity/examActivity/deleteExamResult' }} exportBtn={{ order: 2, url: 'services/activity/examActivity/exportExamResult', type: '考试成绩', label: '导出考试成绩' }}/>);
  }
}
