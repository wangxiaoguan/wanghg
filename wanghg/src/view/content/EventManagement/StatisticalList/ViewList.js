import React, { Component } from 'react';
import { Tabs, Message } from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { postService, getService, GetQueryString } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
export default class ViewList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: '0',
      updateKey:0,
      dp:[],
      id: GetQueryString(location.hash, ['id']).id||0,
      pageType:GetQueryString(location.hash,['pageType']).pageType||0
    };
  }
  componentDidMount(){
    //获取部门的数据
    let organizationData = [];
    getService(API_PREFIX + 'services/system/organization/organizationList/get', data => {
      if (data.retCode === 1) {
        organizationData = data.root.list;
        this.dealDepartmentData(organizationData);
        this.setState({ dp: organizationData });
      }
    });
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
  render() {
    const {  updateKey ,pageType} = this.state;
    let body = { 'activityId': '6' };
    console.log('dp', this.state.dp);
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
        title: '浏览时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      // {
      //   title: '操作',
      //   key: 'operation',
      //   render: (text, record, index) => {
      //     return <div>
      //       <a onClick={() => (location.hash = `/EventManagement/${pageType}/Detail?id=${record.activityId}`)}>详情</a>
      //     </div>;

      //   },
      // },
    ];
    const search = [
      {
        key: 'treepath',
        label: '部门',
        qFilter: 'Q=treepath_S_LK',
        type: 'cascader',
        option: this.state.dp,
      },
      {
        key: 'username',
        label: '用户姓名',
        qFilter: 'Q=username_S_LK',
        type: 'input',
      },
      {
        key: 'phone',
        label: '手机号',
        qFilter: 'Q=phone_S_LK',
        type: 'input',
      },
    ];
    return <TableAndSearch key={updateKey} columns={columns} 
      url={'services/activity/activityStatistic/list/viewUser'} 
      search={search} 
      // deleteBtn={{ order: 1, url: 'services/activity/activityStatistic/remove/viewUser' }} 
      // exportBtn={{ order: 2, url: 'services/activity/activityStatistic/export/viewUser', type: '浏览量列表', label: '导出活动列表',body }} 
      urlfilter={`Q=activityId_S_EQ=${this.state.id}`}
      // customBtn={{order: 3,label: '浏览统计',onClick: n => this.choose(n),className: 'queryBtn',}} 
      />;
  }
}
