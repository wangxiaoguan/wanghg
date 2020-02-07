import React, { Component } from 'react';
import { Tabs,message, Message, Divider,Spin,Popconfirm} from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { postService, getService,GetQueryString } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
const TabPane = Tabs.TabPane;
@connect(
  state => ({
    powers: state.powers,
  }),
)
export default class List extends Component {
  constructor(props) {
    super(props);
    // let param = this.props.location.search.replace('?','').split('&');
    // let activeKey = Number(decodeURIComponent(param[0].split('=')[1])) || '0';
    let activeKey = GetQueryString(location.hash, ['id']).id || '0';
    this.departList = [];
    this.state={
      tabKey:String(activeKey),
      updateKeyOne: 0,
      updateKeyTwo: 0,
      updateKeyThree: 0,
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
      if (item.subCategoryList) {//不为空，递归
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
        tabKey:activeKey,
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
    let isAll='Q=isAll=false';
    let haveUsers="Q=haveUsers=false";
    let organizationData = [];
    getService(API_PREFIX + `services/web/company/org/orgList/get?${isAll}&${haveUsers}`, data => {
      if (data.status === 1) {        
        organizationData = data.root.object;
        let selectData = this.getDpData(organizationData);
        this.dealDepartmentData(organizationData,selectData);
        this.setState({ dp: organizationData,loading: false });
      }else{
        message.error(data.errorMsg);
        this.setState({ loading: false });
      }
    });
   
    let columnData = [];
    getService(API_PREFIX + 'services/web/system/tree/category/getList', data => {
      if (data.status === 1) {
        // columnData = data.root.list.filter(item=>item.name==='活动');
        data.root.object.map((item,index)=>{
          if(item.name=='活动' || item.name == '通用'){
            columnData=[...columnData, ...item.subCategoryList]
          }
        });

        this.dealColumnData(columnData);
        this.setState({ columnData,loading:false });
      }else{
        message.error(data.errorMsg);
  
        // this.setState({ loading: false });
      }
    });
  }
  tabChange=tabKey=>{
    localStorage.setItem("selectedRowKeys", '');
    sessionStorage.setItem("TabsKey",tabKey);
    if (tabKey === '0') {
      this.setState({
        tabKey,
        activeKey:tabKey,
        updateKeyOne: this.state.updateKeyOne + 1,
      },()=>{
        window.location.hash = `/EventManagement/Examination/List?id=${tabKey}`;
      });
    } else if (tabKey === '1') {
      this.setState({
        tabKey,
        activeKey:tabKey,
        updateKeyTwo: this.state.updateKeyTwo + 1,
      },()=>{
        window.location.hash = `/EventManagement/Examination/List?id=${tabKey}`;
      });
    } else if (tabKey === '2') {
      this.setState({
        tabKey,
        activeKey:tabKey,
        updateKeyThree: this.state.updateKeyThree + 1,
      },()=>{
        window.location.hash = `/EventManagement/Examination/List?id=${tabKey}`;
      });
    }
  }

  issue = (record) => {
    console.log('发布----', record);
    let body = [record];
    let value = {
      dataId: record,
      dataType: 2,
    };
      postService(API_PREFIX + 'services/web/auth/authdata/addAuthDataToRedis', value, data => {
        if (data.status === 1) {
          postService(API_PREFIX + 'services/web/activity/exam/publishAndOffline/1', body, data => {
            if (data.status === 1) {
              // if(JSON.stringify(data.root)==='{}'){
              Message.success('发布成功');
              this.setState({ updateKeyOne: this.state.updateKeyOne + 1 });
              // }
            } else {
              message.error('请先设置考试题目');
            }
          });
        }
      });
  }
  render() {
    let powers = this.props.powers;
    let createPowers = powers && powers['20002.22003.001'];//新建
    let updatePowers = powers && powers['20002.22003.002'];//修改
    let readPowers = powers && powers['20002.22003.003'];//查询
    let deletePowers = powers && powers['20002.22003.004'];//删除
    let offLinePowers = powers && powers['20002.22003.006'];//上线、下线、发布
    let exportPowers = powers && powers['20002.22003.202'];//导出 
    let examQuestionsPowers= powers && powers['20002.22003.250'];//设置考试题目、查看成绩
    let examResultsPowers=powers && powers['20002.22003.249'];//查看成绩
    // let exportPowers = true;
    const { tabKey, updateKeyOne, updateKeyTwo, updateKeyThree} = this.state;
    console.log('updateKeyOne=>',updateKeyOne);
    const searchOption = [{key:'',value:'全部'},{key:true,value:'是'},{key:false,value:'否'}];
    let tenantId = window.sessionStorage.getItem("tenantId");
    const isEditid=GetQueryString(location.hash, ['id']).id || ''
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
        key: 'orgId', label: '活动归属部门', qFilter: 'Q=orgId', type: 'cascader',
        option: this.state.dp,
      },
      {
        key: 'isPush', label: '是否推送', type: 'select',
        option: searchOption, qFilter: 'Q=isPush',
      },
      {
        key: 'isHomePage', label: '是否上首页', qFilter: 'Q=isHomePage', type: 'select',
        option: searchOption,
      },
      {
        key: 'createDate', label: '创建时间', type: 'rangePicker', startTime:'startTime',
        endTime:'endTime',
      },
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
        render:(text,record)=>{
          if(record.isPush){
            return '是';
          }else if (record.isPush===false) {
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
        key: 'x',
        fixed: 'right',
        width: this.state.tabKey == 0 ? 200 : 220,
        render: (text, record, index) => {
         //// console.log('record==>',record);
          return <div>
            {
              // tabKey==="1"?null:
              <React.Fragment>
              <a onClick={() => (location.hash =isEditid&&(isEditid==1||isEditid==2)?`/EventManagement/Examination/Edit?id=${record.id}&activeKey=${this.state.activeKey}&isEditid=1`:`/EventManagement/Examination/Edit?id=${record.id}&activeKey=${this.state.activeKey}`)}
                style={{ display: updatePowers ? 'inline-block' : 'none' }}
              >编辑</a> <Divider type="vertical" />
            </React.Fragment>
            }
            <a onClick={() => (location.hash = `/EventManagement/Examination/Detail?id=${record.id}&activeKey=${this.state.activeKey}`)}
              style={{ display: readPowers ? 'inline-block' : 'none' }}>详情</a>
            <Divider type="vertical" />
            {/* /设置是否绑定题库判断/ */}
            { tabKey === '0' ?   (record.isRadomExam ? 
            //  <a style={{ display: examQuestionsPowers ? 'inline-block' : 'none' }} onClick={() => (location.hash = `/EventManagement/Examination/QuestionsSettings?id=${record.id}&isRadomExam=${record.isRadomExam}&examDatabaseId=${record.examDatabaseId}&activeKey=${this.state.activeKey}`)}>设置考试题目</a>
            <a style={{ display: examQuestionsPowers ? 'inline-block' : 'none' }} onClick={() => (location.hash = `/EventManagement/Examination/QuestionsSettings?id=${record.id}&isRadomExam=${record.isRadomExam}&activeKey=${this.state.activeKey}&mscore=${record.mscore}&sscore=${record.sscore}&isOptionOrder=${record.isOptionOrder}`)}>设置考试题目</a>
              :
               <a style={{ display: examQuestionsPowers ? 'inline-block' : 'none' }} onClick={() => (location.hash = `/EventManagement/Examination/QuestionsSettings?id=${record.id}&isRadomExam=${record.isRadomExam}&activeKey=${this.state.activeKey}&mscore=${record.mscore}&sscore=${record.sscore}&isOptionOrder=${record.isOptionOrder}`)}>设置考试题目</a>) :
               (record.isRadomExam ?  
              //  <a style={{ display: examQuestionsPowers ? 'inline-block' : 'none' }} onClick={() => (location.hash = `/EventManagement/Examination/QuestionsSettings?id=${record.id}&isRadomExam=${record.isRadomExam}&examDatabaseId=${record.examDatabaseId}&activeKey=${this.state.activeKey}`)}>查看题目</a>
              <a style={{ display: examQuestionsPowers ? 'inline-block' : 'none' }} onClick={() => (location.hash = `/EventManagement/Examination/QuestionsSettings?id=${record.id}&isRadomExam=${record.isRadomExam}&activeKey=${this.state.activeKey}&mscore=${record.mscore}&sscore=${record.sscore}&isOptionOrder=${record.isOptionOrder}`)}>查看题目</a>
                :
               <a style={{ display: examQuestionsPowers ? 'inline-block' : 'none' }} onClick={() => (location.hash = `/EventManagement/Examination/QuestionsSettings?id=${record.id}&isRadomExam=${record.isRadomExam}&activeKey=${this.state.activeKey}&mscore=${record.mscore}&sscore=${record.sscore}&isOptionOrder=${record.isOptionOrder}`)}>查看题目</a>)  }
            
            <Divider type="vertical" />
            {
              tabKey === '0' ?
              <Popconfirm title="确定发布该活动吗?" onConfirm={()=>this.issue(record.id)}><a className="operation" 
                  style={{ display: offLinePowers ? 'inline-block' : 'none' }}>发布</a></Popconfirm>
                  
                : 
                <a style={{ display: examResultsPowers ? 'inline-block' : 'none' }} onClick={() => {
                  const list = JSON.stringify(record.activityName);
                  window.sessionStorage.setItem('activityName', list);
                  (location.hash = `/EventManagement/Examination/Score?id=${record.id}&activeKey=${this.state.activeKey}`);
                }
              }>查看成绩<Divider type="vertical" /></a>
            }
            {
              tabKey === '0' ?
              null: 
                <a onClick={() => (location.hash = `/EventManagement/Examination/StatisticalResults?id=${record.id}&activeKey=${this.state.activeKey}`)}>统计结果<Divider type="vertical" /></a>
            }
          </div>;

        },
      },
    ];

    //未发布页面发布时间不显示
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
        render:(text,record)=>{
          if(record.isPush){
            return '是';
          }else if (record.isPush===false) {
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
        key: 'x',
        fixed: 'right',
        width: this.state.tabKey == 0 ? 200 : 220,
        render: (text, record, index) => {
          // console.log('record==>',record);
          return <div>
            <React.Fragment>
              <a onClick={() => (location.hash = `/EventManagement/Examination/Edit?id=${record.id}&activeKey=${this.state.activeKey}`)}
                style={{ display: updatePowers ? 'inline-block' : 'none' }}
              >编辑<Divider type="vertical" /></a> 
            </React.Fragment>
            <a onClick={() => (location.hash = `/EventManagement/Examination/Detail?id=${record.id}&activeKey=${this.state.activeKey}`)}
              style={{ display: readPowers ? 'inline-block' : 'none' }}>详情<Divider type="vertical" /></a>
            {/* /设置是否绑定题库判断/ */}
            {
              record.isRadomExam ? 
              //  <a style={{ display: examQuestionsPowers ? 'inline-block' : 'none' }} onClick={() => (location.hash = `/EventManagement/Examination/QuestionsSettings?id=${record.id}&isRadomExam=${record.isRadomExam}&examDatabaseId=${record.examDatabaseId}&activeKey=${this.state.activeKey}`)}>设置考试题目<Divider type="vertical" /></a>
              <a style={{ display: examQuestionsPowers ? 'inline-block' : 'none' }} onClick={() => (location.hash = `/EventManagement/Examination/QuestionsSettings?id=${record.id}&isRadomExam=${record.isRadomExam}&activeKey=${this.state.activeKey}&mscore=${record.mscore}&sscore=${record.sscore}&isOptionOrder=${record.isOptionOrder}`)}>设置考试题目<Divider type="vertical" /></a>
               :
               <a style={{ display: examQuestionsPowers ? 'inline-block' : 'none' }} onClick={() => (location.hash = `/EventManagement/Examination/QuestionsSettings?id=${record.id}&isRadomExam=${record.isRadomExam}&activeKey=${this.state.activeKey}&mscore=${record.mscore}&sscore=${record.sscore}&isOptionOrder=${record.isOptionOrder}`)}>设置考试题目<Divider type="vertical" /></a>
            }
            {
              tabKey === '0' ?
              <Popconfirm title="确定发布该活动吗?" onConfirm={()=>this.issue(record.id)}><a className="operation" 
                  style={{ display: offLinePowers ? 'inline-block' : 'none' }}>发布</a></Popconfirm>
                  
                : 
                <a onClick={() => (location.hash = `/EventManagement/Examination/Score?id=${record.id}&activeKey=${this.state.activeKey}`)}>查看考试成绩</a>
            }
             {
              tabKey === '0' ?
              null: 
                <a onClick={() => (location.hash = `/EventManagement/Examination/StatisticalResults?id=${record.id}&activeKey=${this.state.activeKey}`)}>统计结果</a>
            }
          </div>;

        },
      },
    ];
    let columnsPublished = [...columns];
    columnsPublished.splice(3, 0, {
      title: '参与人次',
      dataIndex: 'participant',
      key: 'participant',
      width:80,
      render: (text, record) => {
        return <a href={`#/EventManagement/Examination/JoinList?id=${record.id}&activeKey=${this.state.activeKey}`}>
          {record.participant}
        </a>;
      },
    },
    {
      title: '浏览人数',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width:80,
      render: (text, record) => {
        return <a href={`#/EventManagement/Examination/ViewList?id=${record.id}&pageType=Examination&activeKey=${this.state.activeKey}`}>
          {record.viewCount}
        </a>;
      },
    },
    {
      title: '点赞数',
      dataIndex: 'voteCount',
      key: 'voteCount',
      width:70,
      render: (text, record) => {
        return <a href={`#/EventManagement/Examination/LikesList?id=${record.id}&activeKey=${this.state.activeKey}`}>
          {record.voteCount}
        </a>;
      },
    },
    {
      title: '评论数',
      dataIndex: 'commentCount',
      key: 'commentCount',
      width:70,
      render: (text, record) => {
        return <a href={`#/EventManagement/Examination/CommentList?id=${record.id}&targetType=1&activeKey=${this.state.activeKey}`}>
          {record.commentCount}
        </a>;
      },
    });
     
    console.log("columnsPublished==>",columnsPublished)
    if(this.state.tabKey==2){
      columnsPublished.map((item,index)=>{
        if(item.dataIndex=="publishDate"){
          item.title="下线时间",
          item.dataIndex="lastUpdateDate",
          item.key="lastUpdateDate"
        }
      })
    }

    return <Spin spinning={this.state.loading}>
      <Tabs type="card" defaultActiveKey={this.state.activeKey} onChange={this.tabChange} className="tabCommon">
        <TabPane tab="未发布" key="0">
          <TableAndSearch scroll={{ width: 1600 }} key={updateKeyOne} columns={columns2} url={'services/web/activity/exam/getList'} //url={'testkao'}
            search={search} addBtn={createPowers ? { order: 2, url: '/EventManagement/Examination/Add', OnEvent: this.add } : null} 
            deleteBtn={deletePowers ? { order: 5, url: 'services/web/activity/exam/publishAndOffline/3', type: "authentication", authUrl: 'services/web/auth/authdata/delAuthData' } : null} 
            urlfilter={`Q=typeId=2&Q=status=0&Q=tenantId=${tenantId}`} />
        </TabPane>
        <TabPane tab="已上线" key="1">
          <TableAndSearch scroll={{ width: 2000 }} key={updateKeyTwo} columns={columnsPublished} url={'services/web/activity/exam/getList'} 
          search={search} offOrOnLineBtn={offLinePowers ? { label: '下线', order: 1, url: 'services/web/activity/exam/publishAndOffline/2' } : null} 
          exportBtn={exportPowers ? { order: 3, url: 'services/web/activity/exam/exportExamActivityList', type: '活动列表', label: '导出活动列表' } : null} 
          // deleteBtn={deletePowers ? { order: 2, url: 'services/web/activity/exam/batchDelete', type: "authentication", authUrl: 'services/web/auth/authdata/delAuthData' } : null} 
          urlfilter={`Q=typeId=2&Q=status=1&Q=tenantId=${tenantId}`} />
        </TabPane>
        <TabPane tab="已下线" key="2">
          <TableAndSearch scroll={{ width: 2000 }} key={updateKeyThree} columns={columnsPublished} url={'services/web/activity/exam/getList'} 
          search={search} offOrOnLineBtn={offLinePowers ? { label: '上线', order: 1, url: 'services/web/activity/exam/publishAndOffline/1', typeLine: '上线' } : null}
           exportBtn={exportPowers ? { order: 3, url: 'services/web/activity/exam/exportExamActivityList', type: '活动列表', label: '导出活动列表' } : null} 
           deleteBtn={deletePowers ? { order: 2, url: 'services/web/activity/exam/publishAndOffline/3', type: "authentication", authUrl: 'services/web/auth/authdata/delAuthData' } : null} urlfilter={`Q=typeId=2&Q=status=2&Q=tenantId=${tenantId}`} examinationType="examinationOnline" />
        </TabPane>
      </Tabs>
    </Spin>;
  }
}
