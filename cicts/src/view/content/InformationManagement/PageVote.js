import React, { Component } from 'react';
import {message} from 'antd';
import TableAndSearch from './../../component/table/TableAndSearch';
import {postService,getService,GetQueryString} from '.././myFetch';
import API_PREFIX from '.././apiprefix';
class PageVote extends Component{
  constructor(props){
    super(props);
    this.state={
      id:GetQueryString(location.hash,['id']).id,
      type:GetQueryString(location.hash,['type']).type,
      dp:[],
    }
  }

  componentDidMount(){
    let organizationData = [];
    getService(API_PREFIX + 'services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false', data => {
      if (data.status === 1) {
        organizationData = data.root.object;
        this.dealDepartmentData(organizationData);
        this.setState({ dp: organizationData });
      }else{
        message.error(data.errorMsg);
      }
    });
  }
   //处理组织机构中的数据
   dealDepartmentData(data) {
    data.map((item, index) => {
      item.value = item.id;
      item.label = item.name;
      item.children = item.subCompanyOrgList;
      if (item.subCompanyOrgList) {
        this.dealDepartmentData(item.subCompanyOrgList);
      }
    });
  }
  render(){
    const columns=[
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '用户姓名',
        dataIndex: 'createUserName',
        key: 'createUserName',
      },
      {
        title: '部门',
        dataIndex: 'fullName',
        key: 'fullName',
      },
      {
        title: '点赞时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
    ];
    const search = [
      { key: 'orgName', label: '部门',qFilter:'Q=treePath',type:'cascader',option: this.state.dp},
      { key: 'userName', label: '用户姓名',qFilter:'Q=createUserName',type:'input'},
    ];

    var urlName=''
    if(this.props.location.pathname==="/InformationManagement/Article/PageVote"){
      urlName = '#/InformationManagement/Article'+`?tabsVale=${sessionStorage.getItem('TabsKey')}`
    }else if(this.props.location.pathname==="/InformationManagement/Video/PageVote"){
      urlName = '#/InformationManagement/Video'+`?tabsVale=${sessionStorage.getItem('videoTabsKey')}`
    }
    return(
        <TableAndSearch
            columns={columns}
            search={search}
            type='pageview'
            url={`services/web/news/article/Moments/${this.state.id}`}
            goBackBtn={{order:1,label:'返回',url:urlName}}
        >
        </TableAndSearch>
    );
  }
}
export default PageVote;