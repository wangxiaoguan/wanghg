import React, { Component } from 'react';
import { Tabs, Message, Divider,Spin,Popconfirm} from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { postService, getService,GetQueryString } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import { connect } from 'react-redux';
const TabPane=Tabs.TabPane;
@connect(state => ({
  powers: state.powers,
}))
export default class Querstionnaire extends Component {
  constructor(props) {
    super(props);
    // let param = this.props.location.search.replace('?','').split('&');
    // let activeKey = Number(decodeURIComponent(param[0].split('=')[1])) || '0';
    let activeKey = GetQueryString(location.hash, ['id']).id || '0';
    this.departList = [];
    this.state = {
      currentTabsKey: activeKey,
      updateKeyOne: 0,
      updateKeyTwo: 0,
      updateKeyThree: 0,
      dp: [],
      columnData: [],
      loading: false,
      activeKey:String(activeKey),
      isAdmin:true,//超级管理员
    };
  }
  
  setAdmin(){
    let orgIds = window.sessionStorage.getItem('authorityOrgIds')?window.sessionStorage.getItem('authorityOrgIds'):false;
    // let partyIds = window.sessionStorage.getItem('authorityPartyIds')?window.sessionStorage.getItem('authorityPartyIds'):false;
    // let UnionIds = window.sessionStorage.getItem('authorityUnionIds')?window.sessionStorage.getItem('authorityUnionIds'):false;
    // let GroupIds = window.sessionStorage.getItem('authorityGroupIds')?window.sessionStorage.getItem('authorityGroupIds'):false;
    // if(orgIds||partyIds||UnionIds||GroupIds){
   if(orgIds){
      this.setState({isAdmin:false});
    }else{
      this.setState({isAdmin:true});
    }

  }
  getDpData(data) {
    let orgIds = window.sessionStorage.getItem('authorityOrgIds')?window.sessionStorage.getItem('authorityOrgIds'):false;
    data.map((item, index) => {
      if(orgIds&&orgIds.indexOf(item.id)>-1){
        this.departList.push(item.treePath.split(','));
      }
      if (item.subCompanyOrgList) {
        this.getDpData(item.subCompanyOrgList);
      }
    });
    let List = this.departList.join(',').split(',');
    return [...new Set(List)];
  }
  //处理组织机构中的数据
  dealDepartmentData(data,e) {
    let isAdmin = this.state.isAdmin;
    data.map((item, index) => {
      item.value = item.id + '';
      item.label = item.name;
      item.disabled =isAdmin?false:e.indexOf(item.id)>-1?false:true;
      item.children = item.subCompanyOrgList;
      if (item.subCompanyOrgList) {//不为空，递归
        this.dealDepartmentData(item.subCompanyOrgList,e);
      }
    });
  }
  dealColumnData(data) {
    data.map((item, index) => {
      item.value = item.id + '';
      item.label = item.showType === 2 ? item.name + '(首页标签)' : item.name;
      item.children = item.subCategoryList;
      if (item.subCategoryList) {
        //不为空，递归
        this.dealColumnData(item.subCategoryList);
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    // this.child.handleReset()
    let activeKey = GetQueryString(location.hash, ['id']).id || '0';
    activeKey = String(activeKey);
    if(this.state.activeKey !== activeKey){
      this.setState({
        activeKey,
        currentTabsKey:activeKey,
      });
    }
  }

  componentWillMount(){
    localStorage.setItem("selectedRowKeys", '');
  }


  componentDidMount() {
    window.sessionStorage.setItem('taskId','');
    this.setAdmin();
    // this.setState({ loading: true });
    //获取部门的数据
    let organizationData = [];
    let isAll='Q=isAll=false';
    let haveUsers="Q=haveUsers=false";
    getService(
      API_PREFIX + `services/web/company/org/orgList/get?${isAll}&${haveUsers}`,
      data => {
        if (data.status === 1) {
          organizationData = data.root.object;
          let selectData = this.getDpData(organizationData);
          this.dealDepartmentData(organizationData,selectData);
          this.setState({ dp: organizationData ,loading: false});
        }else{
          Message.error(data.errorMsg);
          this.setState({ loading: false });
        }
      }
    );
    //获取栏目的数据
    let columnData = [];
    getService(
      API_PREFIX +
      'services/web/system/tree/category/getList',
      data => {
        if (data.status === 1) {
          // columnData = data.root.list.filter(item => item.name === '活动');
          data.root.object.map((item,index)=>{
            if(item.name=='活动' || item.name == '通用'){
              columnData=[...columnData, ...item.subCategoryList]
            }
          });
          this.dealColumnData(columnData);
          this.setState({ columnData ,loading: false});
        }else{
          Message.error(data.errorMsg);
          this.setState({ loading: false });
        }
      }
    );
  }
  //操作--发布：点击事件
  issue = record => {
    console.log('发布----', record);
    let body = [record];
    let value={
      dataId:record,
      dataType:2,
    };
    postService(API_PREFIX +'services/web/auth/authdata/addAuthDataToRedis',value,data=>{
      if (data.status===1) {
    postService(
      API_PREFIX + 'services/web/activity/question/publishAndOffline/1',
      body,
      data => {
        if (data.status === 1) {
          // if(JSON.stringify(data.root)==='{}'){
            Message.success('发布成功');
            this.setState({ updateKeyOne: this.state.updateKeyOne + 1});
          // }
        }else{
          Message.error('发布失败，问卷题目未设置');
        }
      }
    );
  }
});
  };

  //Tabs标签切换的事件处理
  handleChangeTabs = activeKey => {
    localStorage.setItem("selectedRowKeys", '');
    sessionStorage.setItem("TabsKey",activeKey);
    if (activeKey === '0') {
      this.setState({
        currentTabsKey: activeKey,
        activeKey:activeKey,
        updateKeyOne: this.state.updateKeyOne + 1,
      },()=>{
        window.location.hash = `/EventManagement/Questionnaire/List?id=${activeKey}`;
      });
    } else if (activeKey === '1') {
      this.setState({
        currentTabsKey: activeKey,
        activeKey:activeKey,
        updateKeyTwo: this.state.updateKeyTwo + 1,
      },()=>{
        window.location.hash = `/EventManagement/Questionnaire/List?id=${activeKey}`;
      });
    } else if (activeKey === '2') {
      this.setState({
        currentTabsKey: activeKey,
        activeKey:activeKey,
        updateKeyThree: this.state.updateKeyThree + 1,
      },()=>{
        window.location.hash = `/EventManagement/Questionnaire/List?id=${activeKey}`;
      });
    }
  };

  render() {
    let powers = this.props.powers;
    let createPowers = powers && powers['20002.22005.001'];//新建
    let updatePowers = powers &&powers['20002.22005.002'];//修改
    let readPowers = powers && powers['20002.22005.003'];//查询
    let deletePowers = powers && powers['20002.22005.004'];//删除
    let offLinePowers = powers && powers['20002.22005.006'];//下线、上线、发布
    let exportPowers = powers && powers['20002.22005.202'];//导出 
    let questionSubjectPowers= powers && powers['20002.22005.247'];//设置问卷题目、问卷题目
    let resultsPowers=powers && powers['20002.22005.248'];//查看结果
    const isEditid=GetQueryString(location.hash, ['id']).id || ''
    const { updateKeyOne, updateKeyTwo, updateKeyThree } = this.state;
    let tenantId = window.sessionStorage.getItem("tenantId");
    const radioOption = [
      { value: '全部', key: '' },
      { value: '是', key: true },
      { value: '否', key: false },
    ];
    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
        width: 50, 
        fixed: 'left',
      },
      {
        title: '活动名称',
        dataIndex: 'activityName',
        key: 'activityName',
        width: 100, 
        fixed: 'left',
      },
      {
        title: '所属栏目',
        dataIndex: 'categoryName',
        key: 'categoryName',
      },
      {
        title: '活动归属',
        dataIndex: 'orgName',
        key: 'orgName',
        width:150,
        // render: (text, record) => {
        //   if(record.orgType==1  && record.orgName ){
        //     return <span>{record.orgName}</span>;
        //   }else if(record.orgType==3 && record.unionName ){
        //     return <span>{record.unionName}</span>;
        //   }else if(record.orgName){
        //     return <span>{record.orgName}</span>;
        //   } 
        // },
      },
      {
        title: '活动开始时间',
        dataIndex: 'beginTime',
        key: 'beginTime',
        width:145,
      },
      {
        title: '活动结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width:145,
      },
      {
        title: '是否推送',
        dataIndex: 'isPush',
        key: 'isPush',
        width:50,
        render: (text, record) => {
          if (record.isPush) {
            return '是';
          } else if (record.isPush === false) {
            return '否';
          }
        },
      },
      {
        title: '是否上首页',
        dataIndex: 'isHomePage',
        key: 'isHomePage',
        width:50,
        render: (text, record) => {
          if (record.isHomePage) {
            return '是';
          } else if (record.isHomePage === false) {
            return '否';
          }
        },
      },
      {
        title: '发布时间',
        dataIndex: 'publishDate',
        key: 'publishDate',
        width:145,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width:145,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: this.state.currentTabsKey == 0 ? 160 : 180,
        render: (data, record) => {
          return (
            <div>
              {
                // this.state.currentTabsKey==="1"?null:
              <React.Fragment>
                <a
                  className="operation"
                  onClick={() =>
                    (location.hash =isEditid&&(isEditid==1||isEditid==2)?`/EventManagement/Questionnaire/Edit?id=${record.id}&activeKey=${this.state.activeKey}&isEditid=1`:`/EventManagement/Questionnaire/Edit?id=${record.id}&activeKey=${this.state.activeKey}`)
                  }
                  style={{ display: updatePowers ? 'inline-block' : 'none' }}
                >
                      编辑<Divider type="vertical" />
                </a>
              </React.Fragment>
              }
              <a
                className="operation"
                onClick={() =>
                  (location.hash = `/EventManagement/Questionnaire/Detail?id=${record.id}&activeKey=${this.state.activeKey}`)
                }
                style={{ display: readPowers ? 'inline-block' : 'none' }}
              >
                详情<Divider type="vertical" />
              </a>
              <a
                style={{ display: questionSubjectPowers ? 'inline-block' : 'none' }}
                className="operation"
                onClick={() =>
                  (location.hash = `/EventManagement/Questionnaire/TopicList?id=${record.id}&activeKey=${this.state.activeKey}`)
                }
              >
                问卷题目<Divider type="vertical" />
              </a>
              <a
                style={{ display: resultsPowers ? 'inline-block' : 'none' }}
                className="operation"
                onClick={() =>{
                  const list = JSON.stringify(record.activityName);
                  window.sessionStorage.setItem('activityName', list);
                  (location.hash = `/EventManagement/Questionnaire/QuestionnaireInfo?id=${record.id}&activeKey=${this.state.activeKey}`);
                }}
              >
                查看结果<Divider type="vertical" />
              </a>
              {this.state.currentTabsKey == '0' ? (
                <Popconfirm title="确定发布该活动吗?" onConfirm={()=>this.issue(record.id)}>
                <Divider type="vertical" />
                <a className="operation" 
                  style={{ display: offLinePowers ? 'inline-block' : 'none' }}>
                  发布
                </a>
                </Popconfirm>
              ) : null
              // (
              //   <a
              //     className="operation"
              //   >
              //     查看问卷结果
              //   </a>
              // )
              }
               {
              this.state.currentTabsKey === '0' ?
              null: 
                <a onClick={() => (location.hash = `/EventManagement/Questionnaire/StatisticalResults?id=${record.id}&activeKey=${this.state.activeKey}`)}>统计结果<Divider type="vertical" /></a>
            }

            </div>
          );
        },
      },
    ];

    //未发布页面取消发布时间
    const columns2 = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
        width: 50, 
        fixed: 'left',
      },
      {
        title: '活动名称',
        dataIndex: 'activityName',
        key: 'activityName',
        width: 100, 
        fixed: 'left',
      },
      {
        title: '所属栏目',
        dataIndex: 'categoryName',
        key: 'categoryName',
      },
      {
        title: '活动归属',
        dataIndex: 'orgName',
        key: 'orgName',
        width:150,
        // render: (text, record) => {
        //   if(record.orgType==1  && record.orgName ){
        //     return <span>{record.orgName}</span>;
        //   }else if(record.orgType==3 && record.unionName ){
        //     return <span>{record.unionName}</span>;
        //   }else if(record.orgName){
        //     return <span>{record.orgName}</span>;
        //   } 
        // },
      },
      {
        title: '活动开始时间',
        dataIndex: 'beginTime',
        key: 'beginTime',
        width:145,
      },
      {
        title: '活动结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width:145,
      },
      {
        title: '是否推送',
        dataIndex: 'isPush',
        key: 'isPush',
        width:50,
        render: (text, record) => {
          if (record.isPush) {
            return '是';
          } else if (record.isPush === false) {
            return '否';
          }
        },
      },
      {
        title: '是否上首页',
        dataIndex: 'isHomePage',
        key: 'isHomePage',
        width:50,
        render: (text, record) => {
          if (record.isHomePage) {
            return '是';
          } else if (record.isHomePage === false) {
            return '否';
          }
        },
      },
      // {
      //   title: '发布时间',
      //   dataIndex: 'pushDate',
      //   key: 'pushDate',
      //   width:145,
      // },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width:145,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: this.state.currentTabsKey == 0 ? 160 : 180,
        render: (data, record) => {
          return (
            <div>
                <React.Fragment>
                <a
                  className="operation"
                  onClick={() =>
                    (location.hash = `/EventManagement/Questionnaire/Edit?id=${
                      record.id
                    }&activeKey=${this.state.activeKey}`)
                  }
                  style={{ display: updatePowers ? 'inline-block' : 'none' }}
                >
                      编辑<Divider type="vertical" />
                </a>
              </React.Fragment>
              
              <a
                className="operation"
                onClick={() =>
                  (location.hash = `/EventManagement/Questionnaire/Detail?id=${
                    record.id
                  }&activeKey=${this.state.activeKey}`)
                }
                style={{ display: readPowers ? 'inline-block' : 'none' }}
              >
                详情<Divider type="vertical" />
              </a>
              <a
                style={{ display: questionSubjectPowers ? 'inline-block' : 'none' }}
                className="operation"
                onClick={() =>
                  (location.hash = `/EventManagement/Questionnaire/TopicList?id=${record.id}&activeKey=${this.state.activeKey}`)
                }
              >
                设置问卷题目
              </a>
              {this.state.currentTabsKey == '0' ? (
                <Popconfirm title="确定发布该活动吗?" onConfirm={()=>this.issue(record.id)}>
                <Divider type="vertical" />
                <a className="operation" 
                  style={{ display: offLinePowers ? 'inline-block' : 'none' }}>
                  发布
                </a>
                </Popconfirm>
              ) :null
              //  (
              //   <a
              //     className="operation"
              //   >
              //     查看问卷结果
              //   </a>
              // )
              }
               {
              this.state.currentTabsKey === '0' ?
              null: 
                <a onClick={() => (location.hash = `/EventManagement/Questionnaire/StatisticalResults?id=${record.id}&activeKey=${this.state.activeKey}`)}>统计结果<Divider type="vertical" /></a>
            }
            </div>
          );
        },
      },
    ];
    
    let columnsPublished = [...columns];
    columnsPublished.splice(
      3,
      0,
      {
        title: '参与人数',
        dataIndex: 'participant',
        key: 'participant',
        width:80,
        render: (text, record) => {
          return (
            <a href={`#/EventManagement/Questionnaire/JoinList?id=${record.id}&activeKey=${this.state.activeKey}`}>
              {record.participant}
            </a>
          );
        },
      },
      {
        title: '浏览人数',
        dataIndex: 'viewCount',
        key: 'viewCount',
        width:80,
        render: (text, record) => {
          return (
            <a href={`#/EventManagement/Questionnaire/ViewList?id=${record.id}&pageType=Questionnaire&activeKey=${this.state.activeKey}`}>
              {record.viewCount}
            </a>
          );
        },
      },
      {
        title: '点赞数',
        dataIndex: 'voteCount',
        key: 'voteCount',
        width:70,
        render: (text, record) => {
          return (
            <a href={`#/EventManagement/Questionnaire/LikesList?id=${record.id}&pageType=Questionnaire&activeKey=${this.state.activeKey}`}>
              {record.voteCount}
            </a>
          );
        },
      },
      {
        title: '评论数',
        dataIndex: 'commentCount',
        key: 'commentCount',
        width:70,
        render: (text, record) => {
          return (
            <a
              href={`#/EventManagement/Questionnaire/CommentList?id=${record.id}&targetType=1&activeKey=${this.state.activeKey}`}
            >
              {record.commentCount}
            </a>
          );
        },
      }
    );
    const search = [
      {
        key: 'name',
        label: '活动名称',
        qFilter: 'Q=activityName',
        type: 'input',
      },
      {
        key: 'categoryId',
        label: '所属栏目',
        qFilter: 'Q=categoryId',
        type: 'cascader',
        option: this.state.columnData,
      },
      {
        key: 'orgId',
        label: '活动归属部门',
        qFilter: 'Q=orgId',
        type: 'cascader',
        option: this.state.dp,
      },
      {
        key: 'isPush',
        label: '是否推送',
        type: 'select',
        option: radioOption,
        qFilter: 'Q=isPush',
      },
      {
        key: 'isHomePage',
        label: '是否上首页',
        qFilter: 'Q=isHomePage',
        type: 'select',
        option: radioOption,
      },
      {
        key: 'createDate',
        label: '创建时间',
        type: 'rangePicker',
        startTime:'startTime',
        endTime:'endTime',
      },
    ];

    if(this.state.currentTabsKey==2){
      columnsPublished.map((item,index)=>{
        if(item.dataIndex=="publishDate"){
          item.title="下线时间",
          item.dataIndex="lastUpdateDate",
          item.key="lastUpdateDate"
        }
      })
    }


    return (
      <Spin spinning={this.state.loading}>
        <div>
          <Tabs type="card" defaultActiveKey={this.state.activeKey} onChange={this.handleChangeTabs} className="tabCommon">
            <TabPane tab="未发布" key="0">
              <TableAndSearch
                key={updateKeyOne}
                scroll={{width:1600}}
                columns={columns2}
                search={search}
                addBtn={createPowers?{ order: 1, url: '/EventManagement/Questionnaire/Add' }:null}
                deleteBtn={deletePowers?{
                  order: 2,
                  url: 'services/web/activity/question/publishAndOffline/3',
                  type:"authentication",authUrl:'services/web/auth/authdata/delAuthData',
                }:null}
                url={'services/web/activity/question/getList'}
                urlfilter={`Q=typeId=4&Q=status=0&Q=tenantId=${tenantId}`}
              />
            </TabPane>
            <TabPane tab="已上线" key="1">
              <TableAndSearch
                key={updateKeyTwo}
                columns={columnsPublished}
                search={search}
                scroll={{width:2000}}
                // deleteBtn={deletePowers?{
                //   order: 2,
                //   url: 'services/web/activity/question/batchDelete',
                //   type:"authentication",authUrl:'services/web/auth/authdata/delAuthData',
                // }:null}
                exportBtn={exportPowers?{
                  order: 3,
                  url: 'services/web/activity/question/exportQuestionActivityList',
                  type: '活动列表',
                  label: '导出活动列表',
                }:null}
                url={'services/web/activity/question/getList'}
                offOrOnLineBtn={offLinePowers?{
                  label: '下线',
                  order: 1,
                  url: 'services/web/activity/question/publishAndOffline/2',
                }:null}
                urlfilter={`Q=typeId=4&Q=status=1&Q=tenantId=${tenantId}`}
              />
            </TabPane>
            <TabPane tab="已下线" key="2">
              <TableAndSearch
                key={updateKeyThree}
                columns={columnsPublished}
                search={search}
                scroll={{width:2000}}
                deleteBtn={deletePowers?{
                  order: 2,
                  url: 'services/web/activity/question/publishAndOffline/3',
                  type:"authentication",authUrl:'services/web/auth/authdata/delAuthData',
                }:null}
                exportBtn={exportPowers?{
                  order: 3,
                  url: 'services/web/activity/question/exportQuestionActivityList',
                  type: '活动列表',
                  label: '导出活动列表',
                }:null}
                url={'services/web/activity/question/getList'}
                offOrOnLineBtn={offLinePowers?{
                  label: '上线',
                  order: 1,
                  url: 'services/web/activity/question/publishAndOffline/1',
                  typeLine:'上线',
                }:null}
                urlfilter={`Q=typeId=4&Q=status=2&Q=tenantId=${tenantId}`}
                questionType="questionOnline"
              />
            </TabPane>
          </Tabs>
        </div>
      </Spin>  
    );
  }
}
