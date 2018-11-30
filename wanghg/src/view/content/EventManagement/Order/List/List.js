import React, { Component } from 'react';
import { Tabs, Message, Divider,Spin} from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { postService, getService } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
const TabPane=Tabs.TabPane;
@connect(state => ({
  powers: state.powers,
}))
export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTabsKey: '0',
      updateKeyOne: 0,
      updateKeyTwo: 0,
      updateKeyThree: 0,
      dp: [],
      columnData: [],
      loading: false,
    };
  }
  //处理组织机构中的数据
  dealDepartmentData(data) {
    data.map((item, index) => {
      item.value = item.id + '';
      item.label = item.name;
      item.children = item.subOrganizationList;
      if (item.subOrganizationList) {
        //不为空，递归
        this.dealDepartmentData(item.subOrganizationList);
      }
    });
  }
  dealColumnData(data) {
    data.map((item, index) => {
      item.value = item.id + '';
      item.label = item.name;
      item.children = item.subCategoryList;
      if (item.subCategoryList) {
        //不为空，递归
        this.dealDepartmentData(item.subCategoryList);
      }
    });
  }
  componentDidMount() {
    //获取部门的数据
    this.setState({ loading: true });
    let organizationData = [];
    getService(
      API_PREFIX + 'services/system/organization/organizationList/get',
      data => {
        if (data.retCode === 1) {
          organizationData = data.root.list;
          this.dealDepartmentData(organizationData);
          this.setState({ dp: organizationData,loading: false });
        }else{
          message.error(data.retMsg);
          this.setState({ loading: false });
        }
      }
    );
    //获取栏目的数据
    let columnData = [];
    getService(
      API_PREFIX +
        'services/system/cateogry/news/artical/addNews/authCategoryTree/get',
      data => {
        if (data.retCode === 1) {
          columnData = data.root.list.filter(item => item.name === '活动');
          this.dealColumnData(columnData);
          this.setState({ columnData,loading: false });
        }else{
          message.error(data.retMsg);
          this.setState({ loading: false });
        }
      }
    );
  }
  //操作--发布：点击事件
  issue = record => {
    console.log('发布----', record);
    let body = {
      ids: [record],
    };
    postService(
      API_PREFIX + 'services/activity/orderActivity/online',
      body,
      data => {
        if (data.retCode === 1) {
          Message.success('发布成功');
          this.setState({ updateKeyOne: this.state.updateKeyOne + 1 });
        }
      }
    );
  };

  //Tabs标签切换的事件处理
  handleChangeTabs = activeKey => {
    if (activeKey === '0') {
      this.setState({
        currentTabsKey: activeKey,
        updateKeyOne: this.state.updateKeyOne + 1,
      });
    } else if (activeKey === '1') {
      this.setState({
        currentTabsKey: activeKey,
        updateKeyTwo: this.state.updateKeyTwo + 1,
      });
    } else if (activeKey === '2') {
      this.setState({
        currentTabsKey: activeKey,
        updateKeyThree: this.state.updateKeyThree + 1,
      });
    }
  };

  render() {
    let powers = this.props.powers;
    let createPowers = powers && powers['20002.22006.001'];
    let updatePowers = powers &&powers['20002.22006.002'];
    let readPowers = powers && powers['20002.22006.003'];
    let deletePowers = powers && powers['20002.22006.004'];
    let offLinePowers = powers && powers['20002.22006.204'];
    let onLinePowers = powers && powers['20002.22006.203'];
    let exportPowers = powers && powers['20002.22006.202'];  
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
         width: 100, 
        fixed: 'left'
      },
      {
        title: '活动名称',
        dataIndex: 'name',
        key: 'name',
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
        dataIndex: 'organizationName',
        key: 'organizationName',
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
        width:100,
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
        width:100,
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
        dataIndex: 'pushDate',
        key: 'pushDate',
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
        width: this.state.currentTabsKey == 0 ? 250 : 300,
        render: (data, record) => {
          return (
            <div>
            <a><a
                className="operation"
                onClick={() =>
                  (location.hash = `/EventManagement/Order/Edit?id=${
                    record.id
                  }`)
                }
                style={{ display: updatePowers?'inline-block':'none'}}
              >
                编辑
              </a><Divider type="vertical" /></a>
              <a
                className="operation"
                onClick={() =>
                  (location.hash = `/EventManagement/Order/Detail?id=${
                    record.id
                  }`)
                }
                style={{ display: readPowers ? 'inline-block' : 'none' }}
              >
                详情
              </a><Divider type="vertical" />
              <a
                className="operation"
                onClick={() =>
                  (location.hash = `/EventManagement/Order/SetShopping?id=${record.id}`)
                }
              >
                设置订购商品
              </a>
              {this.state.currentTabsKey == '0' ? (
                (record.canRelease == 1 ?  <span><Divider type="vertical" /><a className="operation" onClick={() => this.issue(record.id)}
                  style={{ display: onLinePowers ? 'inline-block' : 'none' }}>
                  发布
                </a></span> : null)
              ) : (
                <span><Divider type="vertical" /><a
                  className="operation"
                  onClick={() => location.hash =`/EventManagement/Order/OrderInformation?id=${record.id}`}
                >
                  查看订购信息
                </a></span>
              )}
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
            <a href={`#/EventManagement/Order/JoinList?id=${record.id}`}>
              {record.participant}
            </a>
          );
        },
      },
      {
        title: '浏览人数',
        dataIndex: 'reviewCount',
        key: 'reviewCount',
        width:80,
        render: (text, record) => {
          return (
            <a href={`#/EventManagement/Order/ViewList?id=${record.id}&pageType=Order`}>
              {record.reviewCount}
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
            <a href={`#/EventManagement/Order/LikesList?id=${record.id}&pageType=Order`}>
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
              href={`#/EventManagement/Order/CommentList?id=${record.id}&targetType=1`}
            >
              {record.commentCount}
            </a>
          );
        },
      }
    );
    const search = [
 /*     {
        key: 'name',
        label: '活动名称',
        qFilter: 'Q=name_S_LK',
        type: 'input',
      },
      {
        key: 'categoryId',
        label: '所属栏目',
        qFilter: 'Q=categoryid_S_LK',
        type: 'cascader',
        option: this.state.columnData,
      },
      {
        key: 'treepath',
        label: '活动归属部门',
        qFilter: 'Q=treepath_S_ST',
        type: 'cascader',
        option: this.state.dp,
      },
      {
        key: 'ishomepage',
        label: '是否上首页',
        qFilter: 'Q=ishomepage_Z_EQ',
        type: 'select',
        option: radioOption,
      },
      {
        key: 'ispush',
        label: '是否推送',
        type: 'select',
        option: radioOption,
        qFilter: 'Q=ispush_Z_EQ',
      },
      {
        key: 'createDate',
        label: '创建时间',
        type: 'rangePicker',
      },*/
       {
        key: 'categoryId',
        label: '所属栏目',
        qFilter: 'Q=categoryid_S_LK',
        type: 'cascader',
        option: this.state.columnData,
      },
      {
        key: 'ishomepage', label: '是否上首页', qFilter: 'Q=ishomepage_Z_EQ', type: 'select',
        option: radioOption },
      {
        key: 'treepath', label: '活动归属部门', qFilter: 'Q=treepath_S_ST', type: 'cascader',
        option: this.state.dp
      }, {
        key: 'name',
        label: '活动名称',
        qFilter: 'Q=name_S_LK',
        type: 'input',
      },
      {
        key: 'createDate', label: '创建时间', type: 'rangePicker',
      },
      {
        key: 'ispush', label: '是否推送', type: 'select',
        option: radioOption, qFilter: 'Q=ispush_Z_EQ',
      },
    ];
    return (
      <Spin spinning={this.state.loading}>
        <div>
          <Tabs type="card" onChange={this.handleChangeTabs} className="tabCommon">
            <TabPane tab="未发布" key="0">
              <TableAndSearch
                key={updateKeyOne}
                columns={columns}
                scroll={{width:1600}}
                search={search}
                addBtn={createPowers?{ order: 1, url: '/EventManagement/Order/Add' }:null}
                deleteBtn={deletePowers?{
                  order: 2,
                  url: 'services/activity/orderActivity/delete',
                }:null}
                url={'services/activity/orderActivity/list'}
                urlfilter={'Q=typeid_S_EQ=7&Q=status_I_EQ=0'}
              />
            </TabPane>
            <TabPane tab="已发布" key="1">
              <TableAndSearch
                key={updateKeyTwo}
                columns={columnsPublished}
                search={search}
                scroll={{width:2000}}
                deleteBtn={deletePowers?{
                  order: 2,
                  url: 'services/activity/orderActivity/delete',
                }:null}
                exportBtn={exportPowers?{
                  order: 3,
                  url: 'services/activity/orderActivity/export',
                  type: '活动列表',
                  label: '导出活动列表',
                }:null}
                url={'services/activity/orderActivity/list'}
                offOrOnLineBtn={offLinePowers?{
                  label: '下线',
                  order: 1,
                  url: 'services/activity/orderActivity/offline',
                }:null}
                urlfilter={'Q=typeid_S_EQ=7&Q=status_I_EQ=1'}
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
                  url: 'services/activity/orderActivity/delete',
                }:null}
                exportBtn={exportPowers?{
                  order: 3,
                  url: 'services/activity/orderActivity/export',
                  type: '活动列表',
                  label: '导出活动列表',
                }:null}
                url={'services/activity/orderActivity/list'}
                offOrOnLineBtn={onLinePowers?{
                  label: '上线',
                  order: 1,
                  url: 'services/activity/orderActivity/online',
                }:null}
                urlfilter={'Q=typeid_S_EQ=7&Q=status_I_EQ=2'}
              />
            </TabPane>
          </Tabs>
        </div>
      </Spin>  
    );
  }
}
