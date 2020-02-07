




import React, { Component } from 'react';
import { Tabs ,Divider,Popconfirm,message,Spin,Button,Modal,Table} from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import API_PREFIX, {API_FILE_VIEW,API_FILE_VIEW_INNER,API_CHOOSE_SERVICE} from '../../apiprefix';
import {postService,GetQueryString,getService,exportExcelService } from '../../myFetch.js';
import {BEGIN} from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
import $ from 'jquery'
@connect(
  state => ({
    pageData:state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
export default class Note extends  Component {

  constructor(props){
    super(props);
    this.state={
      updateKeyOne:0,
      loading: false,
      noteId:GetQueryString(location.hash, ['id']).id || '',
      activeKey: GetQueryString(location.hash, ['activeKey']).activeKey || '2',
      fileModal:false,
      currentPage:1,
      pageSize:10,
      dataSource:[],
      selectedRowKeys:[],
      totalNum:12,
      downUrl: '', //不同环境下载地址的前缀
      partyTreeData: [],
    }
  }
  componentWillMount() {
    if(API_CHOOSE_SERVICE == 1) {
      this.setState({downUrl: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW})
    }else {
      this.setState({downUrl: API_FILE_VIEW_INNER})
    }
    getService(API_PREFIX + `services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1`, res => {
      if(res.status === 1) {
        let treeData = res.root.object
        this.handleTreeData(treeData)
        this.setState({partyTreeData: treeData})
      }
    })
  }
  handleTreeData = (data) => {
    data.map(item => {
      item.value = item.id
      item.label = item.partyName
      item.children = item.partyOrgList
      if (item.partyOrgList) {//不为空，递归
        this.handleTreeData(item.partyOrgList);
      }
    })
  }
  showFile = (record) => {
      this.setState({fileModal:true, dataSource: record.noteAttaches ? record.noteAttaches : []})
      // getService(API_PREFIX + `services/news/learningNotes/getById/${record.id}`, res => {
      //   if(res.status === 1) {

      //   }
      // })

  }
  downloadAllFile = () => {
    // let files = this.state.dataSource
    // files.forEach((item,index) => {
    //   console.log(item)
    //     let a = document.createElement('a') // 创建a标签
    //     let e = document.createEvent('MouseEvents') // 创建鼠标事件对象
    //     e.initEvent('click', false, false) // 初始化事件对象
    //     a.href = item.url // 设置下载地址
    //     a.download = item.name // 设置下载文件名
    //     a.target = '_blank';
    //     a.dispatchEvent(e)
    // })
    exportExcelService(API_PREFIX + `services/web/news/learningNotes/batchDownload`, this.state.selectedRowKeys, '学习笔记附件.zip')
  }
   render(){
    const columns=[
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
        width: 100,
        fixed: 'left'
      },
      {
        title: '姓名',
        dataIndex: 'createUserName',
        key: 'createUserName',
      },
      {
        title: '工会名称',
        dataIndex: 'fullName',
        key: 'fullName',
      },
      {
        title: '学习笔记',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: '附件',
        dataIndex: 'file',
        key: 'file',
        width:250,
        render:(_,record)=>(
            <div><Button onClick={()=>this.showFile(record)}>显示附件</Button></div>
        )
      },
      {
        title: '提交时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      
    ];
    const columns2=[

      {
        title: '附件名称',
        dataIndex: 'fileName',
        key: 'fileName',
      },
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        width:250,
        render:(_,record)=>(
            <div><a target='_blank' 
              href={`${record.url && record.url.indexOf('http') > -1 ? record.url : this.state.downUrl + record.url}`}
              download={`${record.url && record.url.indexOf('http') > -1 ? record.url : this.state.downUrl + record.url}`}>下载</a></div>
        )
      },
    ];
    const search = [
      { key: 'userName', label: '姓名', qFilter:'Q=userName', type:'input'},
      { key: 'orgId', label: '党组织', qFilter:'Q=orgId', type:'cascader', option: this.state.partyTreeData},
    ];
    const {updateKeyOne,totalNum,dataSource,pageSize, currentPage,selectedRowKeys}=this.state;

    let hasDeleteBtn = true;
    let pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      total: totalNum,
      pageSize: pageSize,
      current: currentPage,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
      pageSizeOptions: ['10', '20', '30','40'],
    };

    const rowSelection = {
      selectedRowKeys,
      type:'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
        });
      },
      getCheckboxProps: this.props.getCheckboxProps ? this.props.getCheckboxProps : '',
    };
    console.log(this.state)
     return(
      <Spin spinning={this.state.loading}>
          <div>
              <TableAndSearch
                  key={updateKeyOne}
                  columns={columns}
                  search={search}
                  url={'services/web/news/learningNotes/getListOfUnion'}
                  deleteBtn={hasDeleteBtn?{order:2,url:'services/web/news/learningNotes/delete'}:null}
                  urlfilter={`Q=newsId=${this.state.noteId}`}
                  goBackBtn={{order: 2, label: '返回', url: `/TradeManager/LearnManagation/List?tabsVale=${this.state.activeKey}`}}
              />
              <Modal
                width={600}
                title=""
                visible={this.state.fileModal}
                footer={null}
                afterClose={()=>this.setState({fileModal:false})}
                onCancel={()=>this.setState({fileModal:false})}
                destroyOnClose={true}
              >
                <Button disabled={selectedRowKeys.length<=0} className="queryBtn" onClick={this.downloadAllFile}>批量下载</Button>
                <Table style={{marginTop:'20px'}} rowKey={'id'} bordered columns={columns2} dataSource={dataSource} pagination={pagination} rowSelection={rowSelection}  />
              </Modal>
          </div>
      </Spin>  
     );
   }
}
