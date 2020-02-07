import React, { Component } from 'react';
import { Tabs, Message, Divider,Spin,Popconfirm} from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { postService, getService,GetQueryString } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
const TabPane=Tabs.TabPane;
@connect(state => ({
  powers: state.powers,
}))
export default class List extends Component {
  constructor(props) {
    super(props);
    let activeKey = GetQueryString(location.hash, ['id']).id || '0';
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
    this.departList = [];
  }
  componentWillMount(){
    localStorage.setItem("selectedRowKeys", '');
  }
  
  setAdmin(){
    let orgIds = window.sessionStorage.getItem('authorityOrgIds')?window.sessionStorage.getItem('authorityOrgIds'):false;
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
        currentTabsKey:activeKey
      },()=>{this.handleChangeTabs(this.state.activeKey)})
      
    }
  }
  componentDidMount() {
    window.sessionStorage.setItem('taskId','');
    this.setAdmin();
    // this.setState({ loading: true });
    //获取部门的数据
    let organizationData = [];
    getService(API_PREFIX + `services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false`, data => {
      if (data.status === 1) {        
        organizationData = data.root.object || [];
        let selectData = this.getDpData(organizationData);
        this.dealDepartmentData(organizationData, selectData);
        console.log('哈哈哈哈哈哈哈哈哈哈哈哈', organizationData)
        this.setState({ dp: organizationData,loading: false });
      }else{
        Message.error(data.errorMsg);
        this.setState({ loading: false });
      }
    });
   
    let columnData = [];
    getService(API_PREFIX + 'services/web/system/tree/category/getList', data => {
      if (data.status === 1) {
        // columnData = data.root.list.filter(item=>item.name==='活动');
        data.root.object && data.root.object.map((item,index)=>{
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
  }

	getData = (title, record, time, type) => {
		//  type=1时表示取货开始时间    2时表示取货结束时间    3表示取货提醒时间
		let promise = new Promise((pass, fail) => {
			let body = {
				name: title,
				type: 45,
				queryType: 'post',
				queryUrl: type==1?API_PREFIX + `services/web/mall/order/setStatusToSend/${record.id}`:(type==2?API_PREFIX + `services/web/mall/order/setOrderBreak/${record.id}`:API_PREFIX + `services/web/activity/ordering/pushOrderingInfo/${record.id}`),
				queryValue: `[${JSON.stringify(record.id)}]`,
				queryContentType: 'application/json',
				runTime: time
			};
			postService(API_PREFIX + `services/web/system/taskParam/add`, body, (data) => {
				if (data.status === 1) {
					console.log('请求结果', data);
					pass(data);
				}
			});
		});
		return promise;
	};

	setTimeTask = (record) => {
		Promise.all([
			this.getData('取货开始时间', record, record.applyBegin, 1),
			this.getData('取货结束时间', record, record.applyEnd, 2),
			this.getData('取货提醒时间', record, record.pickRemindDate, 3)
		]).then((data) => {
			let body = {
				activityId: record.id, //活动id
				applyBegin: record.applyBegin, //取货开始时间
				beginTaskId: data[0].root.object.id, //定时开始时间id
				applyEnd: record.applyEnd, //取货结束时间
				endTaskId: data[1].root.object.id, //定时结束时间id
				pickRemindDate: record.pickRemindDate, //取货提醒时间
				pushTaskId: data[2].root.object.id //取货提醒时间任务id
			};
			postService(API_PREFIX + `services/web/activity/ordering/insertOrderingTask`, body, (data) => {
				if (data.status === 1) {
      
				} else {
					Message.error(data.errorMsg);
				}
			});
		});
	};

	//操作--发布：点击事件
	issue = (id, record) => {
		console.log('发布----', id);
		let body = [ id ];
		postService(
		  API_PREFIX + 'services/web/activity/ordering/publishAndOffline/1',
		  body,
		  data => {
		    if (data.status === 1) {
		        Message.success('发布成功');
            this.setTimeTask(record);
		        this.setState({ updateKeyOne: this.state.updateKeyOne + 1});
		    }else{
		      Message.error(data.errorMsg);
		    }
		  }
		);
	};
	// 已下线的去上线
	Confirmissue = (id, record) => {
		let body = [ id ];
		postService(API_PREFIX + 'services/web/activity/ordering/publishAndOffline/1', body, (data) => {
			if (data.status === 1) {
        Message.success('发布成功');
        this.handleChangeTabs("2")
				// 得到之前设置的定时任务情况
				getService(API_PREFIX + `services/web/activity/ordering/getOrderingTaskById/${id}`, (data) => {
					if (data.status === 1) {
						//去清除定时任务情况
            this.clearTimeTask(id, record, data.root.object);
					} else {
						Message.error(data.errorMsg);
					}
				});
			} else {
				Message.error(data.errorMsg);
			}
		});
  };
  
	//执行清楚任务
	clearTask = (id) => {
		let promise = new Promise((pass, fail) => {
      let params={}
      postService(API_PREFIX + `services/web/system/taskParam/delete/${id}`,params, (data) => {
   			if (data.status == 1) {       
					pass(data);
				}
			});
		});
		return promise;
  };
  
	// 清除定时任务
	clearTimeTask = (id, record, object) => {
		Promise.all([
			this.clearTask(object.beginTaskId),
			this.clearTask(object.endTaskId),
			this.clearTask(object.pushTaskId)
		]).then((data) => {
      console.log("data===>",data)
      // 清除完成后,执行重新请求定时任务接口
			if (data.length==3) {
				// 删除之前后台的定时数据
			  	this.deleteOrderingTaskById(id, record);
			}
		}).catch((error) => {
      console.log("wwwww",error) 
    });
	};

	// 删除订购活动任务信息
	deleteOrderingTaskById = (id, record) => {
    let params={}
		postService(API_PREFIX + `services/web/activity/ordering/deleteOrderingTaskById/${id}`,params,(data) => {
			if (data.status === 1) { 
				//删除完毕后,重新去请求定时任务
				this.setTimeTask(record);
			} else {
				Message.error(data.errorMsg);
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
        activeKey,
        updateKeyOne: this.state.updateKeyOne + 1,
      },()=>{
        window.location.hash = `/EventManagement/Order/List?id=${activeKey}`
      });
    } else if (activeKey === '1') {
      this.setState({
        currentTabsKey: activeKey,
        activeKey,
        updateKeyTwo: this.state.updateKeyTwo + 1,
      },()=>{
        window.location.hash = `/EventManagement/Order/List?id=${activeKey}`
      });
    } else if (activeKey === '2') {
      this.setState({
        currentTabsKey: activeKey,
        activeKey,
        updateKeyThree: this.state.updateKeyThree + 1,
      },()=>{
        window.location.hash = `/EventManagement/Order/List?id=${activeKey}`
      });
    }
  };

  render() {
    // let powers = this.props.powers;
    // let createPowers =true
    // let updatePowers =true
    // let readPowers =true
    // let deletePowers =true
    // let offLinePowers =true
    // let onLinePowers =true
    // let exportPowers =true

    let powers = this.props.powers;
    let createPowers = powers && powers['20002.22010.001'];   //新建
    let updatePowers = powers &&powers['20002.22010.002'];    //修改
    let readPowers = powers && powers['20002.22010.003'];     //查询
    let deletePowers = powers && powers['20002.22010.004'];   //删除
    let offLinePowers = powers && powers['20002.22010.006'];  //上线下线发布
    let exportPowers = powers && powers['20002.22010.202'];     //导出
    const { updateKeyOne, updateKeyTwo, updateKeyThree } = this.state;
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
        fixed: 'left'
      },
      {
        title: '活动名称',
        dataIndex: 'activityName',
        key: 'activityName',
         width: 100, 
        fixed: 'left'
      },
      {
        title: '所属栏目',
        dataIndex: 'categoryName',
        key: 'categoryName',
      },
      {
        title: '活动归属部门',
        dataIndex: 'orgName',
        key: 'orgName',
        width:150
      },
      {
        title: '活动开始时间',
        dataIndex: 'beginTime',
        key: 'beginTime',
        width:145
      },
      {
        title: '活动结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width:145
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
        width:145
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width:145
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: this.state.currentTabsKey == 0 ? 200 : 220,
        render: (data, record) => {
          return (
            <div>
              {/* {this.state.currentTabsKey==="1"?null: */}
                <a><a
                  className="operation"
                  onClick={() =>
                    (location.hash = `/EventManagement/Order/Edit?id=${
                      record.id
                    }&activeKey=${this.state.activeKey}`)
                  }
                  style={{ display: updatePowers?'inline-block':'none'}}
                >
                  编辑<Divider type="vertical" />
                </a></a>
              {/* } */}

              <a
                className="operation"
                onClick={() =>
                  (location.hash = `/EventManagement/Order/Detail?id=${
                    record.id
                  }&activeKey=${this.state.activeKey}`)
                }
                style={{ display: readPowers ? 'inline-block' : 'none' }}
              >
                详情<Divider type="vertical" />
              </a>
              <a
                className="operation"
                onClick={() =>
                  (location.hash = `/EventManagement/Order/SetShopping?id=${record.id}&activeKey=${this.state.activeKey}`)
                }>
                设置订购商品
              </a>
              {this.state.currentTabsKey == 0 ? (
                <span><Divider type="vertical" /><Popconfirm title="确定发布该活动吗?" onConfirm={()=>this.issue(record.id,record)}><a className="operation" 
                  style={{ display: offLinePowers ? 'inline-block' : 'none' }}>
                  发布
                </a></Popconfirm></span> 
              ) : (
                <span><Divider type="vertical" /><a
                  className="operation"
                  onClick={() => location.hash =`/EventManagement/Order/OrderInformation?id=${record.id}&activeKey=${this.state.activeKey}`}
                >
                  查看订购信息
                </a></span>
              )}

           {this.state.currentTabsKey ==2? (
                <span><Divider type="vertical" /><Popconfirm title="确定发布该活动吗?" onConfirm={()=>this.Confirmissue(record.id,record)}><a className="operation"  style={{ display: offLinePowers ? 'inline-block' : 'none' }}>
                  发布
                </a></Popconfirm></span> 
              ):null}
            </div>
          );
        },
      },
    ];
    if(this.state.currentTabsKey == 0){
      columns.splice(8,1)
    }
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
            <a href={`#/EventManagement/Order/JoinList?id=${record.id}&activeKey=${this.state.activeKey}`}>
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
            <a href={`#/EventManagement/Order/ViewList?id=${record.id}&pageType=Order&activeKey=${this.state.activeKey}`}>
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
            <a href={`#/EventManagement/Order/LikesList?id=${record.id}&pageType=Order&activeKey=${this.state.activeKey}`}>
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
              href={`#/EventManagement/Order/CommentList?id=${record.id}&targetType=1&activeKey=${this.state.activeKey}`}
            >
              {record.commentCount}
            </a>
          );
        },
      }
    );
    const search = [
      {
        key: 'activityName',
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
        option: this.state.dp
      },
      {
        key: 'isPush', label: '是否推送', type: 'select',
        option: radioOption, qFilter: 'Q=isPush',
      },
      {
        key: 'isHomePage', label: '是否上首页', qFilter: 'Q=isHomePage', type: 'select',
        option: radioOption },
      {
        key: 'createDate', label: '创建时间', type: 'rangePicker',startTime:'startTime',
        endTime:'endTime',
      },
    ];
    let tenantId = window.sessionStorage.getItem("tenantId");
    return (
      <Spin spinning={this.state.loading}>
        <div>
          <Tabs type="card" defaultActiveKey={this.state.activeKey} onChange={this.handleChangeTabs} className="tabCommon">
            <TabPane tab="未发布" key="0">
              <TableAndSearch
                key={updateKeyOne}
                columns={columns}
                scroll={{width:1600}}
                search={search}
                addBtn={createPowers?{ order: 1, url: '/EventManagement/Order/Add' }:null}
                deleteBtn={deletePowers?{
                  order: 2,
                  url: 'services/web/activity/ordering/batchDelete',
                }:null}
                url={'services/web/activity/ordering/getList'}
                urlfilter={`Q=typeId=3&Q=status=0&Q=tenantId=${tenantId}`}
              />
            </TabPane>
            <TabPane tab="已上线" key="1">
              <TableAndSearch
                key={updateKeyTwo}
                columns={columnsPublished}
                search={search}
                scroll={{width:2000}}
                deleteBtn={deletePowers?{
                  order: 2,
                  url: 'services/web/activity/ordering/batchDelete',
                }:null}
                exportBtn={exportPowers?{
                  order: 3,
                  url: 'services/web/activity/ordering/exportOrderingActivityList',
                  type: '活动列表',
                  label: '导出活动列表',
               }:null}
                url={'services/web/activity/ordering/getList'}
                offOrOnLineBtn={offLinePowers ? {
                  label: '下线',
                  order: 1,
                  url: 'services/web/activity/ordering/publishAndOffline/2',
                }:null}
                urlfilter={`Q=typeId=3&Q=status=1&Q=tenantId=${tenantId}`}
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
                  url: 'services/web/activity/ordering/batchDelete',
                }:null}
                exportBtn={exportPowers?{
                  order: 3,
                  url: 'services/web/activity/ordering/exportOrderingActivityList',
                  type: '活动列表',
                  label: '导出活动列表',
                }:null}
                url={'services/web/activity/ordering/getList'}
                // offOrOnLineBtn={{
                //   label: '上线',
                //   order: 1,
                //   url: 'services/web/activity/ordering/publishAndOffline/1',
                //   typeLine:'上线'
                // }}
                urlfilter={`Q=typeId=3&Q=status=2&Q=tenantId=${tenantId}`}
                orderType="orderOnine"
              />
            </TabPane>
          </Tabs>
        </div>
      </Spin>  
    );
  }
}
