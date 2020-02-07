import React, { Component } from 'react';
import { Tabs, Form, Cascader, Message ,Icon, Divider,Spin} from 'antd';
import {postService,getService} from '../../../myFetch';
import ServiceApi  from '../../../apiprefix';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../../redux-root/action';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
@connect(
  state => ({
    dataSource: state.tableData,
    pageData:state.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTabsKey:'0',
      updateKeyOne:0,
      updateKeyTwo:0,
      updateKeyThree:0,
      dp:[],
      columnData:[],
      categoryOption: [],
      isHomePageOption: [],
      isPushOption: [],
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

  //处理所属栏目中的数据
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

  componentDidMount(){
    this.setState({ loading: true });
   

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

  //操作--发布：点击事件
  issue=(record)=>{
    console.log('发布----',record);
    let body={
      ids:[record],
    };
    postService(ServiceApi +'services/activity/signUpActivity/online',body,data=>{
      if (data.retCode===1) {
        Message.success('发布成功');
        this.setState({ updateKeyOne: this.state.updateKeyOne + 1});
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
    console.log('tabKey',tabKey);
    this.setState({ tabKey});
    const tabkey = tabKey-1;
    console.log('++++++',tabkey);

    let idsQF=`Q=typeid_I_EQ=2&Q=status_I_EQ=${tabkey}`;

    this.props.getData(ServiceApi+`services/activity/signUpActivity/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${idsQF}`);
    // getService(ServiceApi+`services/activity/signUpActivity/list/1/10?${idsQF}`,data=>{
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
    if (activeKey==='0') {
      this.setState({
        currentTabsKey: activeKey,
        updateKeyOne: this.state.updateKeyOne + 1,
      });
    } else if (activeKey==='1') {
      this.setState({
        currentTabsKey: activeKey,
        updateKeyTwo: this.state.updateKeyTwo + 1,
      });
    } else if (activeKey==='2') {
      this.setState({
        currentTabsKey: activeKey,
        updateKeyThree: this.state.updateKeyThree + 1,
      });
    }
  }

  render() {
    const { isHomePageOption, isPushOption, updateKeyOne, updateKeyTwo, updateKeyThree } = this.state;
    let powers = this.props.powers;
    // console.log('权限码', powers);
    let createPowers = powers && powers['20002.22001.001'];
    let updatePowers = powers && powers['20002.22001.002'];
    let readPowers = powers && powers['20002.22001.003'];
    let deletePowers = powers && powers['20002.22001.004'];
    let offLinePowers = powers && powers['20002.22001.204'];
    let onLinePowers = powers && powers['20002.22001.203'];
    let exportPowers = powers && powers['20002.22001.202'];

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
        //width:300
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
        width:100,
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
        dataIndex:'operation',
        key:'operation',
        fixed: 'right',
        width: this.state.currentTabsKey == 0 ? 250 : 300,
        render: (text, record) => {
          return <div>
            <a className="operation" onClick={() => (location.hash = `/EventManagement/Apply/Edit?id=${record.id}`)}
              style={{ display: updatePowers ? 'inline-block' : 'none' }}
            >编辑 </a><Divider type="vertical" />
            <a className="operation" onClick={() => (location.hash = `/EventManagement/Apply/Detail?id=${record.id}`)}
              style={{ display: readPowers ? 'inline-block' : 'none' }}> 详情</a>
            <Divider type="vertical" />
            <a className="operation" onClick={() => {
              const list = JSON.stringify(record);
              window.sessionStorage.setItem('applyField', list);
              location.hash = `/EventManagement/Apply/ApplyFields?id=${record.id}`;}}
            style={{ display: updatePowers ? 'inline-block' : 'none' }}> 设置报名表单</a>
            <Divider type="vertical" />
            {
              this.state.currentTabsKey==='0'?
                ( <a className="operation" onClick={()=>this.issue(record.id)}
                  style={{ display: onLinePowers ? 'inline-block' : 'none' }}>发布</a>):
                (<a className="operation" onClick={() => {
                  const list = JSON.stringify(record);
                  window.sessionStorage.setItem('applyField', list);
                  location.hash ='/EventManagement/Apply/ApplyInfo';
                }}
                style={{ display: readPowers ? 'inline-block' : 'none' }}>查看报名信息</a>)
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
        return <a href={`#/EventManagement/Apply/JoinList?id=${record.id}`}>
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
        return <a onClick={() => (location.hash = `#/EventManagement/Apply/ViewList?id=${record.id}&pageType=Apply`)}>
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
        return <a href={`#/EventManagement/Apply/LikesList?id=${record.id}&pageType=Apply`}>
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
        return <a href={`#/EventManagement/Apply/CommentList?id=${record.id}&targetType=1`}>
          {record.commentCount}
        </a>;
      },
    });

    //const cIdsQF=`Q=categoryid_S_ST=${this.state.selectedValues}`;
    const search = [
      {
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
        option: this.state.dp },
      {
        key: 'ispush',
        label: '是否推送',
        qFilter: 'Q=ispush_Z_EQ',
        type: 'select',
        option: isPushOption,
      },{
        key: 'isHomePage',
        label: '是否上首页',
        qFilter: 'Q=ishomepage_Z_EQ',
        type: 'select',
        option: isHomePageOption,
      },
      { key: 'createDate',
        label: '创建时间',
        type: 'rangePicker',
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

    return (
      <Spin spinning={this.state.loading}>
        <Tabs type="card" onChange={this.handleChangeTabs} className="tabCommon">
          <TabPane tab="未发布" key="0">
            <TableAndSearch scroll={{width:1600}} key={updateKeyOne} columns={columns} search={search}
              addBtn={createPowers ? { order: 1, url: '/EventManagement/Apply/Add' } : null}
              deleteBtn={deletePowers ? { order: 2, url:'services/activity/signUpActivity/delSignUpActivitys',field:'ids'} : null}
              url={'services/activity/signUpActivity/list'}
              urlfilter={'Q=typeid_I_IN=1,2&Q=status_I_EQ=0'}/>
          </TabPane>
          <TabPane tab="已上线" key="1">
            <TableAndSearch scroll={{width:2000}} key={updateKeyTwo} columns={columnsPublished} search={search}
              deleteBtn={deletePowers ? { order: 2, url:'services/activity/signUpActivity/delSignUpActivitys',field:'ids'} : null}
              exportBtn={exportPowers ? { order: 3 ,url:'services/activity/signUpActivity/export',type:'活动列表',label:'导出活动列表' } : null}
              url={'services/activity/signUpActivity/list'}
              offOrOnLineBtn={offLinePowers ? { label: '下线', order: 1, url: 'services/activity/signUpActivity/offline' } : null}
              urlfilter={'Q=typeid_I_IN=1,2&Q=status_I_EQ=1'}/>
          </TabPane>
          <TabPane tab="已下线" key="2">
            <TableAndSearch scroll={{width:2000}} key={updateKeyThree} columns={columnsPublished} search={search}
              deleteBtn={deletePowers ? { order: 2, url:'services/activity/signUpActivity/delSignUpActivitys',field:'ids'} : null}
              exportBtn={exportPowers ? { order: 3,url:'services/activity/signUpActivity/export',type:'活动列表',label:'导出活动列表' } : null}
              url={'services/activity/questionnaireActivity/list'}
              offOrOnLineBtn={offLinePowers ? { label: '上线', order: 1, url: 'services/activity/signUpActivity/online' } : null}
              urlfilter={'Q=typeid_I_IN=1,2&Q=status_I_EQ=2'}/>
          </TabPane>
        </Tabs>
      </Spin>  
    );
 
    /*return (
      <Tabs defaultActiveKey="1" onChange={this.tabChange}>
        <TabPane tab="未发布" key="1">
          <Form className="Content">
            <FormItem
              {...formItemLayout}
              label="所属栏目"
            >
              <Cascader changeOnSelect options={this.state.categoryOption} placeholder="全部" onChange={this.handleCheckChange} />
            </FormItem>
          </Form>
          <TableAndSearch
            columns={columns}
            url={'services/activity/signUpActivity/list'}
            search={search}
            /!*special={cIdsQF}*!/
            addBtn={{
              order: 2,
              url: '/EventManagement/Apply/Add',
              OnEvent: this.add,
            }}
            deleteBtn={{ order: 5 }}
            urlfilter={'Q=typeid_I_EQ=1&Q=status_I_EQ=0'}
          />
        </TabPane>
        <TabPane tab="已上线" key="2">
          <Form className="Content">
            <FormItem
              {...formItemLayout}
              label="所属栏目"
            >
              <Cascader changeOnSelect options={this.state.categoryOption} placeholder="全部" onChange={this.handleCheckChange} />
            </FormItem>
          </Form>
          <TableAndSearch
            columns={columns2}
            url={'services/activity/signUpActivity/list'}
            search={search}
            special={cIdsQF}
            offOrOnLineBtn={{
              label:'下线',
              order: 2,
              url: 'services/activity/signUpActivity/offline',
            }}
            deleteBtn={{ order: 5 }}
            urlfilter={'Q=typeid_I_EQ=1&Q=status_I_EQ=1'}
            exportBtn={{order:6 ,url:'services/activity/signUpActivity/export',type:'活动列表'}}
          />
        </TabPane>
        <TabPane tab="已下线" key="3">
          <Form className="Content">
            <FormItem
              {...formItemLayout}
              label="所属栏目"
            >
              <Cascader changeOnSelect options={this.state.categoryOption} placeholder="全部" onChange={this.handleCheckChange} />
            </FormItem>
          </Form>
          <TableAndSearch
            columns={columns2}
            url={'services/activity/signUpActivity/list'}
            search={search}
            special={cIdsQF}
            offOrOnLineBtn={{
              label: '上线',
              order: 2,
              url: 'services/activity/signUpActivity/online',
            }}
            deleteBtn={{ order: 5 }}
            urlfilter={'Q=typeid_I_EQ=1&Q=status_I_EQ=2'}
            exportBtn={{order:6 ,url:'services/activity/signUpActivity/export',type:'活动列表'}}
          />
        </TabPane>
      </Tabs>
    );*/
  }
}



const columns2 = [
  {
    title: '序号',
    key: 'sNum',
    dataIndex: 'sNum',
  },
  {
    title: '活动名称',
    dataIndex: 'name',
    key: 'name',
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
  },
  {
    title: '参与人数',
    dataIndex: 'participant',
    key: 'participant',
  },
  {
    title: '浏览人数',
    dataIndex: 'reviewCount',
    key: 'reviewCount',
  },
  {
    title: '点赞数',
    dataIndex: 'voteCount',
    key: 'voteCount',
  },
  {
    title: '评论数',
    dataIndex: 'commentCount',
    key: 'commentCount',
  },
  {
    title: '活动开始时间',
    dataIndex: 'beginTime',
    key: 'beginTime',
  },
  {
    title: '活动结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
  },
  {
    title: '是否推送',
    dataIndex: 'isPush',
    key: 'isPush',
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
    dataIndex: 'pushDate',
    key: 'pushDate',
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    key: 'createDate',
  },
  {
    title: '操作',
    key: 'x',
    render: (text, record, index) => {
      return <div>
        <a onClick={() => (location.hash = `/EventManagement/Apply/Edit?id=${record.id}`)}>编辑 </a>
        <a onClick={() => (location.hash = `/EventManagement/Apply/Detail?id=${record.id}`)}> 详情</a>
        <a onClick={() => {
          const list = JSON.stringify(record);
          window.sessionStorage.setItem('applyField', list);
          location.hash = '/EventManagement/Apply/ApplyFields';
        }}> 设置报名表单</a>
        <a onClick={() => {
          const list = JSON.stringify(record);
          window.sessionStorage.setItem('applyField', list);
          location.hash = '/EventManagement/Apply/ApplyInfo';
        }}> 查看报名信息</a>
      </div>;

    },
  },
];


const option1 = [{ key: 'aa', value: '主任' }, { key: 'bb', value: '主任1' }];
