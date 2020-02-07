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
      pageType:GetQueryString(location.hash,['pageType']).pageType||0,
      // companyData:[],
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
    // this.getCompanyData();
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


  // getCompanyData=()=>{
  //   let {activityId}=this.state;
  //   //获取企业的数据
  //   let companyData = [];
  //   getService(
  //     API_PREFIX +
  //     `services/web/company/enterprise/getCompanyListFromAuth/${activityId}`,
  //     data => {
  //       if (data.status == 1) {
  //         console.log("companyData===",data.root.object);
  //           companyData=data.root.object.map((item, index) => {
  //            item.value = item.id + '';item.label = item.name;
  //            return item;
  //           });
  //           console.log("companyData===",companyData);
  //         this.setState({ companyData });
  //       } else {
  //         message.error(data.errorMsg);
  //         // this.setState({ loading: false });
  //       }
  //     }
  //   );
  // }
  render() {
    const { updateKey,pageType } = this.state;
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
        key: 'userName',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '部门',
        dataIndex: 'orgName',
        key: 'orgName',
      },
      {
        title: '点赞时间',
        dataIndex: 'joinDate',
        key: 'joinDate',
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
        key: 'username',
        label: '用户姓名',
        qFilter: 'Q=userName',
        type: 'input',
      },
      {
        key: 'orgId',
        label: '部门',
        qFilter: 'Q=orgId',
        type: 'cascader',
        option: this.state.dp,
      },
      // {key: 'tenantId', label: '企业', qFilter: 'Q=tenantId', type: 'company',option: this.state.companyData, option2: this.state.dp, qFilter2: 'Q=orgId',key2: 'orgId'},
      // {
      //   key: 'phone',
      //   label: '手机号',
      //   qFilter: 'Q=phone_S_LK',
      //   type: 'input',
      // },
    ];
    let urlName='';
    if(this.props.location.pathname==="/EventManagement/Apply/LikesList"){
      urlName = '#/EventManagement/Apply/List'+`?id=${sessionStorage.getItem('TabsKey')}`;
    }
    return <TableAndSearch 
    key={updateKey} 
    columns={columns} 
    url={'services/web/activity/enrolment/getAllVoteDetail'} 
    search={search} 
    // deleteBtn={{ order: 1, url: 'services/activity/activityStatistic/remove/voteUser' }} 
    exportBtn={{ order: 2, url: 'services/web/activity/enrolment/exportVoteList', type: '点赞列表', label: '导出点赞列表', body }} 
    urlfilter={`Q=activityId=${this.state.id}`}
    goBackBtn={{ order: 1, url: urlName,label:'返回' }}
    />;
  }
}
