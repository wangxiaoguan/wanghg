import React, { Component } from 'react';
import { Tabs, Message } from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { postService, getService, GetQueryString } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
export default class LikesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: '0',
      updateKey: 0,
      dp: [],
      id: GetQueryString(location.hash, ['id']).id||0,
    };
  }
  componentDidMount() {
    //获取部门的数据
    let organizationData = [];
    let isAll='Q=isAll=false';
    let haveUsers="Q=haveUsers=false";
    getService(API_PREFIX + `services/web/company/org/orgList/get?${isAll}&${haveUsers}`, data => {
      if (data.status === 1) {
        organizationData = data.root.object;
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
      item.children = item.subCompanyOrgList;
      if (item.subCompanyOrgList) {//不为空，递归
        this.dealDepartmentData(item.subCompanyOrgList);
      }
    });
  }
  render() {
    const { updateKey } = this.state;
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
        dataIndex: 'userName',
        key: 'username',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'phone',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '部门',
        dataIndex: 'orgName',
        key: 'orgname',
      },
      {
        title: '参与时间',
        dataIndex: 'joinDate',
        key: 'createDate', 
      },
    ];
    const search = [
      {
        key: 'username',
        label: '用户姓名',
        qFilter: 'Q=userName',
        type: 'input',
      },
      // {
      //   key: 'phone',
      //   label: '手机号',
      //   qFilter: 'Q=mobile',
      //   type: 'input',
      // },
      {
        key: 'orgId',
        label: '部门',
        qFilter: 'Q=orgId',
        type: 'cascader',
        option: this.state.dp,
      },
      // {key: 'tenantId', label: '企业', qFilter: 'Q=tenantId', type: 'company',option: this.state.companyData, option2: this.state.dp, qFilter2: 'Q=orgId',key2: 'orgId'},
    ];
    let urlName='';
    if(this.props.location.pathname==="/EventManagement/Apply/JoinList"){
      urlName = '#/EventManagement/Apply/List'+`?id=${sessionStorage.getItem('TabsKey')}`;
    }
    return <TableAndSearch 
            key={updateKey} 
            columns={columns} 
            url={`services/web/activity/enrolment/getAllJoinDetail`} 
            search={search} 
            // deleteBtn={{ order: 1, url: 'services/activity/activityStatistic/remove/attendUser' }} 
            exportBtn={{ order: 2, url: 'services/web/activity/enrolment/reportAllJoinDetail', type: '参与列表', label: '导出参与列表'}} 
            urlfilter={`Q=activityId=${this.state.id}`}
            goBackBtn={{ order: 1, url: urlName,label:'返回' }}
    />;
  }
}
