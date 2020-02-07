import React, { Component } from 'react';
import { Tabs, Message, Divider,Spin} from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { postService, getService } from '../../../myFetch';
import ServiceApi from '../../../apiprefix';
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
    this.state={
      tabKey:'0',
      updateKeyOne: 0,
      updateKeyTwo: 0,
      updateKeyThree: 0,
      loading: false,
    };
  }
  //处理组织机构中的数据
  dealDepartmentData(data) {
    data.map((item, index) => {
      item.value = item.id + '';
      item.label = item.name;
      item.children = item.subOrganizationList;
      if (item.subOrganizationList) {//不为空，递归
        this.dealDepartmentData(item.subOrganizationList);
      }
    });
  }
  dealColumnData(data) {
    data.map((item, index) => {
      item.value = item.id + '';
      item.label = item.name;
      item.children = item.subCategoryList;
      if (item.subCategoryList) {//不为空，递归
        this.dealDepartmentData(item.subCategoryList);
      }
    });
  }
  componentDidMount() {
    this.setState({ loading: true });

  }
  tabChange=tabKey=>{
    if (tabKey === '0') {
      this.setState({
        tabKey,
        updateKeyOne: this.state.updateKeyOne + 1,
      });
    } else if (tabKey === '1') {
      this.setState({
        tabKey,
        updateKeyTwo: this.state.updateKeyTwo + 1,
      });
    } else if (tabKey === '2') {
      this.setState({
        tabKey,
        updateKeyThree: this.state.updateKeyThree + 1,
      });
    }
  }

  issue = (record) => {
    console.log('发布----', record);
    let body = {
      ids: [record],
    };
    postService(ServiceApi + 'services/activity/examActivity/online', body, data => {
      if (data.retCode === 1) {
        Message.success('发布成功');
        this.setState({ updateKeyOne: this.state.updateKeyOne + 1 });
      }
    });
  }
  render() {
    let powers = this.props.powers;
    let createPowers = powers && powers['20002.22002.001'];
    let updatePowers = powers && powers['20002.22002.002'];
    let readPowers = powers && powers['20002.22002.003'];
    let deletePowers = powers && powers['20002.22002.004'];
    let offLinePowers = powers && powers['20002.22002.002'];
    let onLinePowers = powers && powers['20002.22002.002'];
    let exportPowers = powers && powers['20002.22002.202']; 
    // let exportPowers = true;
    const { tabKey, updateKeyOne, updateKeyTwo, updateKeyThree} = this.state;
    console.log('updateKeyOne=>',updateKeyOne)
    const searchOption = [{key:'',value:'全部'},{key:true,value:'是'},{key:false,value:'否'}];
    const search = [
      {
        key: 'name',
        label: '活动名称',
        qFilter: 'Q=name_S_LK',
        type: 'input',
      },
      {
        key: 'ishomepage', label: '是否上首页', qFilter: 'Q=ishomepage_Z_EQ', type: 'select',
        option: searchOption,
      },
      {
        key: 'ispush', label: '是否推送', type: 'select',
        option: searchOption, qFilter: 'Q=ispush_Z_EQ',
      },
      {
        key: 'categoryId',
        label: '所属栏目',
        qFilter: 'Q=categoryid_S_LK',
        type: 'cascader',
        option: this.state.columnData,
      },
      {
        key: 'treepath', label: '活动归属部门', qFilter: 'Q=treepath_S_ST', type: 'cascader',
        option: this.state.dp,
      },
      {
        key: 'createDate', label: '创建时间', type: 'rangePicker',
      },
    ];
    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
        width: 100, 
        fixed: 'left',
      },
      {
        title: '活动名称',
        dataIndex: 'name',
        key: 'name',
        width: 100, 
        fixed: 'left',
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
        width:150,
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
        width:100,
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
        width: this.state.tabKey == 0 ? 250 : 300,
        render: (text, record, index) => {
          console.log('record==>',record)
          return <div>
            <React.Fragment>
              <a onClick={() => (location.hash = `/EventManagement/Examination/Edit?id=${record.id}`)}
                style={{ display: updatePowers ? 'inline-block' : 'none' }}
              >编辑</a> <Divider type="vertical" />
            </React.Fragment>
            <a onClick={() => (location.hash = `/EventManagement/Examination/Detail?id=${record.id}`)}
              style={{ display: readPowers ? 'inline-block' : 'none' }}>详情</a>
            <Divider type="vertical" />
            {/* /设置是否绑定题库判断/ */}
            {
              record.isRadomExam ?  <a onClick={() => (location.hash = `/EventManagement/Examination/QuestionsSettings?id=${record.id}&isRadomExam=${record.isRadomExam}&examDatabaseId=${record.examDatabaseId}`)}>设置考试题目</a> :
               <a onClick={() => (location.hash = `/EventManagement/Examination/QuestionsSettings?id=${record.id}&isRadomExam=${record.isRadomExam}`)}>设置考试题目</a>
            }
            
            <Divider type="vertical" />
            {
              tabKey === '0' ?
                <a className="operation" onClick={() => this.issue(record.id)}
                  style={{ display: onLinePowers ? 'inline-block' : 'none' }}>发布</a>
                  
                : 
                <a onClick={() => (location.hash = `/EventManagement/Examination/Score?id=${record.id}`)}>查看考试成绩</a>
            }
          </div>;

        },
      },
    ];
    let columnsPublished = [...columns];
    columnsPublished.splice(3, 0, {
      title: '参与人数',
      dataIndex: 'participant',
      key: 'participant',
      width:80,
      render: (text, record) => {
        return <a href={`#/EventManagement/Examination/JoinList?id=${record.id}`}>
          {record.participant}
        </a>;
      },
    },
    {
      title: '浏览人数',
      dataIndex: 'reviewCount',
      key: 'reviewCount',
      width:80,
      render: (text, record) => {
        return <a href={`#/EventManagement/Examination/ViewList?id=${record.id}&pageType=Examination`}>
          {record.reviewCount}
        </a>;
      },
    },
    {
      title: '点赞数',
      dataIndex: 'voteCount',
      key: 'voteCount',
      width:70,
      render: (text, record) => {
        return <a href={`#/EventManagement/Examination/LikesList?id=${record.id}`}>
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
        return <a href={`#/EventManagement/Examination/CommentList?id=${record.id}&targetType=1`}>
          {record.commentCount}
        </a>;
      },
    });
    return <Tabs type="card" defaultActiveKey="0" onChange={this.tabChange} className= "tabCommon">
      <TabPane tab="未发布" key="0">
        <TableAndSearch scroll={{width:1600}} key={updateKeyOne} columns={columns} url={'services/activity/examActivity/list'} //url={'testkao'}
          search={search} addBtn={createPowers ? { order: 2, url: '/EventManagement/Examination/Add', OnEvent: this.add } : null} deleteBtn={deletePowers?{ order: 5, url:'services/activity/examActivity/deleteActivity' }:null} urlfilter={'Q=typeid_S_EQ=6&Q=status_I_EQ=0'} />
      </TabPane>
      <TabPane tab="已上线" key="1">
        <TableAndSearch scroll={{width:2000}} key={updateKeyTwo} columns={columnsPublished} url={'services/activity/examActivity/list'} search={search} offOrOnLineBtn={offLinePowers?{ label: '下线', order: 1, url: 'services/activity/examActivity/offline' }:null} exportBtn={exportPowers?{ order: 3 ,url:'services/activity/examActivity/exportExamActivity',type:'活动列表',label:'导出活动列表' }:null} deleteBtn={deletePowers?{ order: 2,url:'services/activity/examActivity/deleteActivity' }:null} urlfilter={'Q=typeid_S_EQ=6&Q=status_I_EQ=1'}  />
      </TabPane>
      <TabPane tab="已下线" key="2">
        <TableAndSearch scroll={{width:2000}} key={updateKeyThree} columns={columnsPublished} url={'services/activity/examActivity/list'} search={search} offOrOnLineBtn={onLinePowers?{ label: '上线', order: 1, url: 'services/activity/examActivity/online' }:null} exportBtn={exportPowers?{ order: 3 ,url:'services/activity/examActivity/exportExamActivity',type:'活动列表',label:'导出活动列表' }:null} deleteBtn={deletePowers?{ order: 2,url:'services/activity/examActivity/deleteActivity' }:null} urlfilter={'Q=typeid_S_EQ=6&Q=status_I_EQ=2'} />
      </TabPane>
    </Tabs>
  }
}
