import React, { Component } from 'react';
import { Tabs,message, Message, Divider,Spin,Popconfirm} from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { postService, getService,GetQueryString } from '../../../myFetch';
import API_PREFIX,{API_FILE_VIEW_INNER,API_FILE_VIEW} from '../../../apiprefix';
import { connect } from 'react-redux';
const TabPane = Tabs.TabPane;
@connect(
  state => ({
    powers: state.powers,
  }),
)
export default class Commodity  extends Component {
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
      loading: false,
      activeKey:String(activeKey),
      isAdmin:true,//超级管理员
      ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW,
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
          if(item.name=='活动'){
            columnData=item.subCategoryList;
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
      });
    } else if (tabKey === '1') {
      this.setState({
        tabKey,
        activeKey:tabKey,
        updateKeyTwo: this.state.updateKeyTwo + 1,
      });
    }
  }

	stop = (id) => {
    console.log('id==>',id)
    getService(API_PREFIX + `services/activity/goods/enable/` + id,data => {
      console.log("data==>",data)
      if(data.retCode==1){
        this.getData(`services/activity/goods/list/`+ `${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      }else{
        Message.error(data.retMsg)
      }
       
    });
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
    let createPowers = powers && powers['20002.22007.001'];//新建
    let updatePowers = powers && powers['20002.22007.002'];//修改
    let readPowers = powers && powers['20002.22007.003'];//查询
    let deletePowers = powers && powers['20002.22007.004'];//删除
    let offLinePowers = powers && powers['20002.22007.002'];//上线、下线、发布
    let onLinePowers = powers && powers['20002.22007.002'];
    let exportPowers = powers && powers['20002.22011.206'];//导出 
    let examQuestionsPowers= powers && powers['20002.22003.250'];//设置考试题目、查看成绩
    let examResultsPowers=powers && powers['20002.22003.249'];//查看成绩
    let importPowers = powers && powers['20002.22011.206'];  
    // let exportPowers = true;
    const { tabKey, updateKeyOne, updateKeyTwo} = this.state;
    console.log('updateKeyOne=>',updateKeyOne);
    let tenantId = window.sessionStorage.getItem("tenantId");
    const isEditid=GetQueryString(location.hash, ['id']).id || ''
    const search = [
      {key:'name',label:'商品名称',qFilter:'Q=name_S_LK',type:'input'}
    ];
    const columns = [
      {
        title:'商品图片',
        dataIndex:'images',
        key:'images',
        render:(data,record)=>{
          return  <img src={`${this.state.ossViewPath}${record.images}`} style={{width:'140px'}}/>
        }
      },
      {
        title:'商品名称',
        dataIndex:'name',
        key:'name'
      },
      {
        title:'所属分类',
        dataIndex:'categoryName',
        key:'categoryName'
      },
      {
        title:'价格',
        dataIndex:'price',
        key:'price'
      },
      {
        title:'销量',
        dataIndex:'sales',
        key:'sales'
      },
      {
        title:'库存',
        dataIndex:'productStock',
        key:'productStock'
      },
      {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate'
      },
      {
        title:'显示顺序',
        dataIndex:'showIndex',
        key:'showIndex'
      },
      {
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        render:(data,record)=>(
            <div>
              <a style={{ display: updatePowers ? 'inline-block' : 'none' }} className='operation' onClick={() => {
              	location.hash = `EventManagement/Order/CommodityEdit?isEdit=true&&isFlag=false&id=${record.id}`}}>
                编辑
              </a>
              <Divider type="vertical" />
              <a style={{ display: readPowers ? 'inline-block' : 'none' }} onClick={() => {
              	console.log("record",record)
              	location.hash =`EventManagement/Order/CommodityAdd?isEdit=true&&isFlag=true&id=${record.id}`}} className='operation' >
                详情
              </a>
              <Divider type="vertical" />
              {
              	record.status == 1 ?
              	  	<a style={{ display: onLinePowers ? 'inline-block' : 'none' }} onClick={this.stop.bind(this,record.id)} className='operation'>
						          下架
						        </a> : <a style={{ display: onLinePowers ? 'inline-block' : 'none' }}  onClick={this.stop.bind(this,record.id)} className='operation'>
						          上架
						        </a>
              }
            </div>
        ),
      }
    ];

    //未发布页面发布时间不显示
    const columns2 = [
      {
        title:'商品图片',
        dataIndex:'images',
        key:'images',
        render:(data,record)=>{
          return  <img src={`${this.state.ossViewPath}${record.images}`} style={{width:'140px'}}/>
        }
      },
      {
        title:'商品名称',
        dataIndex:'name',
        key:'name'
      },
      {
        title:'所属分类',
        dataIndex:'categoryName',
        key:'categoryName'
      },
      {
        title:'价格',
        dataIndex:'price',
        key:'price'
      },
      {
        title:'销量',
        dataIndex:'sales',
        key:'sales'
      },
      {
        title:'库存',
        dataIndex:'productStock',
        key:'productStock'
      },
      {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate'
      },
      {
        title:'显示顺序',
        dataIndex:'showIndex',
        key:'showIndex'
      },
      {
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        render:(data,record)=>(
            <div>
              <a style={{ display: updatePowers ? 'inline-block' : 'none' }} className='operation' onClick={() => {
              	location.hash = `EventManagement/Order/CommodityEdit?isEdit=true&&isFlag=false&id=${record.id}`}}>
                编辑
              </a>
              <Divider type="vertical" />
              <a style={{ display: readPowers ? 'inline-block' : 'none' }} onClick={() => {
              	console.log("record",record)
              	location.hash =`EventManagement/Order/CommodityAdd?isEdit=true&&isFlag=true&id=${record.id}`}} className='operation' >
                详情
              </a>
              <Divider type="vertical" />
              {
              	record.status == 1 ?
              	  	<a style={{ display: onLinePowers ? 'inline-block' : 'none' }} onClick={this.stop.bind(this,record.id)} className='operation'>
						          下架
						        </a> : <a style={{ display: onLinePowers ? 'inline-block' : 'none' }}  onClick={this.stop.bind(this,record.id)} className='operation'>
						          上架
						        </a>
              }
            </div>
        ),
      }
    ];
    let columnsPublished = [...columns];
    // columnsPublished.splice(3, 0, {
    //   title: '参与人次',
    //   dataIndex: 'participant',
    //   key: 'participant',
    //   width:80,
    //   render: (text, record) => {
    //     return <a href={`#/EventManagement/Examination/JoinList?id=${record.id}&activeKey=${this.state.activeKey}`}>
    //       {record.participant}
    //     </a>;
    //   },
    // },
    // {
    //   title: '浏览人数',
    //   dataIndex: 'viewCount',
    //   key: 'viewCount',
    //   width:80,
    //   render: (text, record) => {
    //     return <a href={`#/EventManagement/Examination/ViewList?id=${record.id}&pageType=Examination&activeKey=${this.state.activeKey}`}>
    //       {record.viewCount}
    //     </a>;
    //   },
    // },
    // {
    //   title: '点赞数',
    //   dataIndex: 'voteCount',
    //   key: 'voteCount',
    //   width:70,
    //   render: (text, record) => {
    //     return <a href={`#/EventManagement/Examination/LikesList?id=${record.id}&activeKey=${this.state.activeKey}`}>
    //       {record.voteCount}
    //     </a>;
    //   },
    // },
    // {
    //   title: '评论数',
    //   dataIndex: 'commentCount',
    //   key: 'commentCount',
    //   width:70,
    //   render: (text, record) => {
    //     return <a href={`#/EventManagement/Examination/CommentList?id=${record.id}&targetType=1&activeKey=${this.state.activeKey}`}>
    //       {record.commentCount}
    //     </a>;
    //   },
    // });
     
    console.log("columnsPublished==>",columnsPublished)
    // if(this.state.tabKey==2){
    //   columnsPublished.map((item,index)=>{
    //     if(item.dataIndex=="publishDate"){
    //       item.title="下线时间",
    //       item.dataIndex="lastUpdateDate",
    //       item.key="lastUpdateDate"
    //     }
    //   })
    // }

    return <Spin spinning={this.state.loading}>
      <Tabs type="card" defaultActiveKey={this.state.activeKey} onChange={this.tabChange} className="tabCommon">
        <TabPane tab="未上架" key="0">
          <TableAndSearch scroll={{ width: 1600 }} key={updateKeyOne} columns={columns2} url={'services/web/mall/product/info/getList/'} //url={'testkao'}
            search={search} addBtn={createPowers ? { order: 2, url: 'EventManagement/Order/CommodityAdd?isEdit=false&&isFlag=false', OnEvent: this.add } : null} 
            deleteBtn={deletePowers ? { order: 5, url: 'services/web/activity/exam/publishAndOffline/3', type: "authentication", authUrl: 'services/web/auth/authdata/delAuthData' } : null} 
            urlfilter={`Q=typeId=2&Q=status=0&Q=tenantId=${tenantId}`} />
        </TabPane>
        <TabPane tab="已上架" key="1">
          <TableAndSearch scroll={{ width: 2000 }} key={updateKeyTwo} columns={columnsPublished} url={'services/web/mall/product/info/getList/'} 
          search={search} offOrOnLineBtn={offLinePowers ? { label: '下架', order: 1, url: 'services/web/activity/exam/publishAndOffline/2' } : null} 
          exportBtn={exportPowers ? { order: 3, url: 'services/web/activity/exam/exportExamActivityList', type: '活动列表', label: '导出活动列表' } : null} 
          // deleteBtn={deletePowers ? { order: 2, url: 'services/web/activity/exam/batchDelete', type: "authentication", authUrl: 'services/web/auth/authdata/delAuthData' } : null} 
          urlfilter={`Q=typeId=2&Q=status=1&Q=tenantId=${tenantId}`} />
        </TabPane>
      </Tabs>
    </Spin>;
  }
}
