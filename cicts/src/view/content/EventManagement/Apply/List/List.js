import React, { Component } from 'react';
import { Tabs, Form, Cascader, Message ,Icon, Divider,Spin,Popconfirm} from 'antd';
import {postService,getService,GetQueryString} from '../../../myFetch';
import API_PREFIX  from '../../../apiprefix';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../../redux-root/action/table/table';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
export default class List extends Component {
  constructor(props) {
    super(props);
    let param = this.props.location.search.replace('?','').split('&');
    let activeKey = Number(decodeURIComponent(param[0].split('=')[1])) || '0';
    this.departList = [];
    this.state = {
      currentTabsKey:String(activeKey),
      updateKeyOne:0,
      updateKeyTwo:0,
      updateKeyThree:0,
      dp:[],
      columnData:[],
      categoryOption: [],
      isHomePageOption: [],
      isPushOption: [],
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

  //处理所属栏目中的数据
  dealColumnData(data) { 
    data&&data.map((item, index) => {
      item.value = item.id + '';
      item.label = item.showType === 2 ? item.name + '(首页标签)' : item.name;
      item.children = item.subCategoryList;
      // item.children = item.name
      if (item.subCategoryList) {//不为空，递归
        this.dealDepartmentData(item.subCategoryList);
      }
    });
  }

  componentWillMount(){
    localStorage.setItem("selectedRowKeys", '');
  }

  
  componentDidMount(){
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
        console.log("organizationDataorganizationData",organizationData);
        let selectData = this.getDpData(organizationData);
        this.dealDepartmentData(organizationData,selectData);
        this.setState({ dp: organizationData ,loading:false});
      }else{
       //message.error(data.retMsg);
        // this.setState({ loading: false });
      }
    });
    //获取栏目的数据
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
        Message.error(data.errorMsg);
  
        // this.setState({ loading: false });
      }
    });
    /*//获取栏目数据
    getService(API_PREFIX+'services/system/cateogry/categoryList/get',data=>{
      if (data.retCode == 1) {
        console.log('栏目数据：',data);
        let categorys=data.root.list;
        if(categorys) {
          //调用接口数据处理函数
          this.getCategoryData(categorys);
          this.setState({
            categoryOption: categorys,
          });
        }
      }
    });*/

    this.setState({
      isHomePageOption : [
        {
          key: 'true', value: '是',
        }, {
          key: 'false', value: '否',
        }],
      isPushOption : [
        {
          key: 'true', value: '是',
        }, {
          key: 'false', value: '否',
        }],
    });

  }
  componentWillReceiveProps(nextProps) {
    // this.child.handleReset()
    let param = nextProps.location.search.replace('?','').split('&');
    let activeKey = Number(decodeURIComponent(param[0].split('=')[1])) || '0';
    activeKey = String(activeKey);
    if(this.state.activeKey !== activeKey){
      this.setState({
        activeKey,
        currentTabsKey:activeKey,
      });
    }
  }

  //操作--发布：点击事件
  issue=(record)=>{
    console.log('发布----',record);
    let body=[record];
    let value={
      dataId:record,
      dataType:2,
    };
    postService(API_PREFIX +'services/web/auth/authdata/addAuthDataToRedis',value,data=>{
      if (data.status==1) {
        postService(API_PREFIX +'services/web/activity/enrolment/publishAndOffline/1',body,data=>{
          if (data.status==1) {
            // if(JSON.stringify(data.root)==='{}'){
              Message.success('发布成功');
              this.setState({ updateKeyOne: this.state.updateKeyOne + 1});
            }else{
              Message.error(data.errorMsg);
            }
          // }
        });
      }
  });
  }

  /*//递归取出接口返回的栏目数据
  getCategoryData(cData){
    cData.map((item,index)=>{
      item.value=item.id;
      item.label=item.name;
      item.children=item.subCategoryList;
      if(item.subCategoryList){//不为空，递归
        this.getCategoryData(item.subCategoryList);
      }
    });
  }*/

  //获取到所属栏目的id
  handleCheckChange=(value)=>{
    console.log('级联中的value：',value);
    this.setState({
      selectedValues:value,
    });

  }

  tabChange=tabKey=>{
    localStorage.setItem("selectedRowKeys", '');
    console.log('tabKey',tabKey);
    this.setState({ tabKey});
    const tabkey = tabKey-1;
    console.log('++++++',tabkey);

    let idsQF=`Q=typeid_I_EQ=2&Q=status_I_EQ=${tabkey}`;

    this.props.getData(API_PREFIX+`services/activity/signUpActivity/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${idsQF}`);
    // getService(API_PREFIX+`services/activity/signUpActivity/list/1/10?${idsQF}`,data=>{
    //   console.log('栏目数据：',data);
    //   let categorys=data.root.list;
    //   if(categorys){
    //     //调用接口数据处理函数
    //     this.getCategoryData(categorys);
    //     this.setState({
    //       categoryOption:categorys,
    //     });
    //
    //   }
    // });
  }

  handleChangeTabs=(activeKey)=>{
    sessionStorage.setItem("TabsKey",activeKey);
    localStorage.setItem("selectedRowKeys", '');
    if (activeKey==='0') {
      this.setState({
        currentTabsKey: activeKey,
        activeKey,
        updateKeyOne: this.state.updateKeyOne + 1,
      },()=>{
        window.location.hash = `/EventManagement/Apply/List?id=${activeKey}`;
      });
    } else if (activeKey==='1') {
      this.setState({
        currentTabsKey: activeKey,
        activeKey,
        updateKeyTwo: this.state.updateKeyTwo + 1,
      },()=>{
        window.location.hash = `/EventManagement/Apply/List?id=${activeKey}`;
      });
    } else if (activeKey==='2') {
      this.setState({
        currentTabsKey: activeKey,
        activeKey,
        updateKeyThree: this.state.updateKeyThree + 1,
      },()=>{
        window.location.hash = `/EventManagement/Apply/List?id=${activeKey}`;
      });
    }
  }

  render() {
    const { isHomePageOption, isPushOption, updateKeyOne, updateKeyTwo, updateKeyThree } = this.state;
    let powers = this.props.powers;
    // console.log('权限码', powers);
    let createPowers = powers && powers['20002.22001.001'];//新建
    let updatePowers = powers && powers['20002.22001.002'];//修改
    let readPowers = powers && powers['20002.22001.003'];//查询
    let deletePowers = powers && powers['20002.22001.004'];//删除
    let offLinePowers = powers && powers['20002.22001.006'];//下线、上线、发布
    let exportPowers = powers && powers['20002.22001.202'];//导出
    let setSignForm=powers && powers['20002.22001.244'];//设置报名表单、查看报名表单
    let signupInformation=powers && powers['20002.22001.245'];//查看报名信息
    let tenantId = window.sessionStorage.getItem("tenantId");
    const isEditid=GetQueryString(location.hash, ['id']).id || ''

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
        //width:300
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
          if(record.isPush == true){
            return <span>是</span>;
          }else {
            return <span>否</span>;
          }
        },
      },
      {
        title: '是否上首页',
        dataIndex: 'isHomePage',
        key: 'isHomePage',
        width:50,
        render: (text, record) => {
          if(record.isHomePage == true){
            return <span>是</span>;
          }else {
            return <span>否</span>;
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
        dataIndex:'operation',
        key:'operation',
        fixed: 'right',
        width: this.state.currentTabsKey == 0 ? 200 : 220,
        render: (text, record) => {
          return <div>
             {
              //  this.state.currentTabsKey==="1"?null:
             <a>
            <a className="operation" onClick={() => (location.hash =isEditid&&(isEditid==1||isEditid==2)?`/EventManagement/Apply/Edit?id=${record.id}&activeKey=${this.state.activeKey}&isEditid=1`:`/EventManagement/Apply/Edit?id=${record.id}&activeKey=${this.state.activeKey}`)}
              style={{ display: updatePowers ? 'inline-block' : 'none' }}
            >编辑 <Divider type="vertical" /></a></a>
             }
            <a className="operation" onClick={() => (location.hash = `/EventManagement/Apply/Detail?id=${record.id}&activeKey=${this.state.activeKey}`)}
              style={{ display: readPowers ? 'inline-block' : 'none' }}> 详情
              <Divider type="vertical" />
              </a>
            <a className="operation" onClick={() => {
              const list = JSON.stringify(record);
              window.sessionStorage.setItem('applyField', list);
              location.hash = `/EventManagement/Apply/ApplyFields?id=${record.id}&activeKey=${this.state.activeKey}`;}}
            style={{ display: setSignForm ? 'inline-block' : 'none' }}> 查看报名表单
            <Divider type="vertical" />
            </a>
            {
              this.state.currentTabsKey==='0'?
                ( <Popconfirm title="确定发布该活动吗?" onConfirm={()=>this.issue(record.id)}><a className="operation" 
                  style={{ display: offLinePowers ? 'inline-block' : 'none' }}>发布</a></Popconfirm>):
                (<a className="operation" onClick={() => {
                  const list = JSON.stringify(record);
                  window.sessionStorage.setItem('applyField', list);
                  location.hash =`/EventManagement/Apply/ApplyInfo?activeKey=${this.state.activeKey}`;
                }}
                style={{ display: signupInformation ? 'inline-block' : 'none' }}>查看报名信息</a>)
            }
          </div>;

        },
      },
    ];
    
    let columnsPublished = [...columns];
    columnsPublished.splice(4, 0, {
      title: '参与人数',
      dataIndex: 'participant',
      width:80,
      key: 'participant',
      render:(text,record)=>{
        return <a href={`#/EventManagement/Apply/JoinList?id=${record.id}&activeKey=${this.state.activeKey}`}>
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
        return <a onClick={() => (location.hash = `#/EventManagement/Apply/ViewList?id=${record.id}&pageType=Apply&activeKey=${this.state.activeKey}`)}>
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
        return <a href={`#/EventManagement/Apply/LikesList?id=${record.id}&pageType=Apply&activeKey=${this.state.activeKey}`}>
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
        return <a href={`#/EventManagement/Apply/CommentList?id=${record.id}&targetType=1&activeKey=${this.state.activeKey}`}>
          {record.commentCount}
        </a>;
      },
    });

    //const cIdsQF=`Q=categoryid_S_ST=${this.state.selectedValues}`;
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
        option: this.state.dp },
      {
        key: 'isPush',
        label: '是否推送',
        qFilter: 'Q=isPush',
        type: 'select',
        option: isPushOption,
      },{
        key: 'isHomePage',
        label: '是否上首页',
        qFilter: 'Q=isHomePage',
        type: 'select',
        option: isHomePageOption,
      },
      { key: 'createDate',
        label: '创建时间',
        type: 'rangePicker',
        startTime:'startTime',
        endTime:'endTime',
      },
    ];
    //未发布页面取消发布时间
    const columns3 = [
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
        //width:300
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
          if(record.isPush == true){
            return <span>是</span>;
          }else {
            return <span>否</span>;
          }
        },
      },
      {
        title: '是否上首页',
        dataIndex: 'isHomePage',
        key: 'isHomePage',
        width:50,
        render: (text, record) => {
          if(record.isHomePage == true){
            return <span>是</span>;
          }else {
            return <span>否</span>;
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
        dataIndex:'operation',
        key:'operation',
        fixed: 'right',
        width: this.state.currentTabsKey == 0 ? 200 : 220,
        render: (text, record) => {
          return <div>
           
            <a className="operation" onClick={() => (location.hash = `/EventManagement/Apply/Edit?id=${record.id}&activeKey=${this.state.activeKey}`)}
              style={{ display: updatePowers ? 'inline-block' : 'none' }}
            >编辑
            <Divider type="vertical" />
            </a>
            <a className="operation" onClick={() => (location.hash = `/EventManagement/Apply/Detail?id=${record.id}&activeKey=${this.state.activeKey}`)}
              style={{ display: readPowers ? 'inline-block' : 'none' }}> 详情
              <Divider type="vertical" />
              </a>
            <a className="operation" onClick={() => {
              const list = JSON.stringify(record);
              window.sessionStorage.setItem('applyField', list);
              location.hash = `/EventManagement/Apply/ApplyFields?id=${record.id}&activeKey=${this.state.activeKey}`;}}
            style={{ display: setSignForm ? 'inline-block' : 'none' }}> 设置报名表单
            <Divider type="vertical" />
            </a>
            
            {
              this.state.currentTabsKey==='0'?
                ( <Popconfirm title="确定发布该活动吗?" onConfirm={()=>this.issue(record.id)}><a className="operation" 
                  style={{ display: offLinePowers ? 'inline-block' : 'none' }}>发布</a></Popconfirm>):
                (<a className="operation" onClick={() => {
                  const list = JSON.stringify(record);
                  window.sessionStorage.setItem('applyField', list);
                  location.hash =`/EventManagement/Apply/ApplyInfo?activeKey=${this.state.activeKey}`;
                }}
                style={{ display: signupInformation ? 'inline-block' : 'none' }}>查看报名信息</a>)
            }
          </div>;
        },
      },
    ];
      //设置formItem的格式
    const formItemLayout = {
      labelCol: {
        xs: { span: 12},
        sm: { span: 2},
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
    };
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
        <Tabs type="card" onChange={this.handleChangeTabs} defaultActiveKey={this.state.activeKey} className="tabCommon">
          <TabPane tab="未发布" key="0">
            <TableAndSearch  scroll={{width:1600}} key={updateKeyOne} columns={columns3} search={search}
              addBtn={createPowers ? { order: 1, url: '/EventManagement/Apply/Add' } : null}
              deleteBtn={deletePowers ? { order: 2, url:'services/web/activity/enrolment/publishAndOffline/3',type:"authentication",authUrl:'services/web/auth/authdata/delAuthData'} : null}
              url={'services/web/activity/enrolment/getList'}
              urlfilter={`Q=typeId=1&Q=status=0&Q=tenantId=${tenantId}`}/>
          </TabPane>
          <TabPane tab="已上线" key="1">
            <TableAndSearch scroll={{width:2000}} key={updateKeyTwo} columns={columnsPublished} search={search}
              // deleteBtn={deletePowers ? { order: 2, url:'services/web/activity/enrolment/batchDelete',type:"authentication",authUrl:'services/web/auth/authdata/delAuthData'} : null}
              exportBtn={exportPowers ? { order: 3 ,url:'services//web/activity/enrolment/exportEnrolmentActivityList',type:'活动列表',label:'导出活动列表' } : null}
              url={'services/web/activity/enrolment/getList'}
              offOrOnLineBtn={offLinePowers ? { label: '下线', order: 1, url: 'services/web/activity/enrolment/publishAndOffline/2' } : null}
              urlfilter={`Q=typeId=1&Q=status=1&Q=tenantId=${tenantId}`}/>
          </TabPane>
          <TabPane tab="已下线" key="2">
            <TableAndSearch scroll={{width:2000}} key={updateKeyThree} columns={columnsPublished} search={search}
              deleteBtn={deletePowers ? { order: 2, url:'services/web/activity/enrolment/publishAndOffline/3',type:"authentication",authUrl:'services/web/auth/authdata/delAuthData'} : null}
              exportBtn={exportPowers ? { order: 3,url:'services//web/activity/enrolment/exportEnrolmentActivityList',type:'活动列表',label:'导出活动列表' } : null}
              url={'services/web/activity/enrolment/getList'}
              offOrOnLineBtn={offLinePowers ? { label: '上线', order: 1, url: 'services/web/activity/enrolment/publishAndOffline/1',typeLine:'上线' } : null}
              urlfilter={`Q=typeId=1&Q=status=2&Q=tenantId=${tenantId}`}/>
          </TabPane>
        </Tabs>
      </Spin>  
    );
  }
}

const option1 = [{ key: 'aa', value: '主任' }, { key: 'bb', value: '主任1' }];
