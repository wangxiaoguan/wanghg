import React, { Component } from 'react';
import {message} from 'antd';
import TableAndSearch from './../../component/table/TableAndSearch';
import {postService,getService,GetQueryString} from '.././myFetch';
import API_PREFIX from '.././apiprefix';
class PageView extends Component{
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
    let columns=[
      {
        title:'用户姓名',
        dataIndex:'createUserName',
        key:'createUserName'
      },
      {
        title:'部门',
        dataIndex:'fullName',
        key:'fullName',
      },{
        title:'浏览时间',
        dataIndex:'createDate',
        key:'createDate'
      },
    ];
    let search = [
      { key: 'lastname', label: '用户',qFilter:'Q=createUserName',type:'input'},
      { key: 'orginfoName', label: '部门',qFilter:'Q=treePath',type:'cascader',option: this.state.dp},
      { key: 'createDate', label: '起止时间', type: 'rangePicker' },
    ];
  
    let urlName='',url='';
    if(this.props.location.pathname==="/InformationManagement/Article/PageView"){
      urlName = '#/InformationManagement/Article'+`?tabsVale=${sessionStorage.getItem('TabsKey')}`//文章管理浏览数点击返回返回到对应所在页xwx2018/12/19
    }else if(this.props.location.pathname==="/InformationManagement/Video/PageView"){
      urlName = '#/InformationManagement/Video'+`?tabsVale=${sessionStorage.getItem('videoTabsKey')}`
    }
    if(this.state.type == 4||this.state.type == 5){
      url = `services/web/news/special/getViewList/${this.state.id}`
      columns=[{title:'用户姓名',dataIndex:'name',key:'name'},{title:'部门',dataIndex:'orgName',key:'orgName',},{title:'浏览时间',dataIndex:'viewDate',key:'viewDate'}];
      search = [
        { key: 'lastname', label: '用户',qFilter:'Q=name',type:'input'},
        { key: 'orginfoName', label: '部门',qFilter:'Q=treePath',type:'cascader',option: this.state.dp},
        { key: 'createDate', label: '起止时间', type: 'rangePicker' },
      ];
    }else{
      url = `services/web/news/article/pageviews/${this.state.id}`
    }
    return(
        <TableAndSearch
            columns={columns}
            search={search}
            type='pageview'
            url={url}
            urlfilter={"Q=objectType=1"}
            goBackBtn={{order:1,label:'返回',url:urlName}}
        >
        </TableAndSearch>
    );
  }
}
export default PageView;