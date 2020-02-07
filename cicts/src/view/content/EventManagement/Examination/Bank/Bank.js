import React, { Component } from 'react';
import { Popconfirm, Modal, Input, Button, Message, Divider,Spin} from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { postService,getService  } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN ,getPageData} from '../../../../../redux-root/action/table/table';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData: state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    getPageData: n => dispatch(getPageData(n)),
  })
)
export default class Bank extends Component {
  constructor(props) {
    super(props);
    this.state = { modal_visible: false, newExamDB: '', loading:false,isEdit:false };
  }


  componentWillMount(){
    localStorage.setItem("selectedRowKeys", '');
  }


  refresh = () => {
    this.props.getData(
      API_PREFIX +
        // `services/web/activity/examtitle/getDatabaseList/${this.props.pageData.currentPage}/${
        `services/web/activity/examdatabase/getDatabaseList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize }?${this.props.pageData.query?this.props.pageData.query:''}`
    );
  };

  updateStatus = (id, status,dbName) => {
    console.log('获取id', id);
    let body = {
      id,
      status,
      dbName,
    };
    // postService(API_PREFIX + 'services/web/activity/examtitle/updateDatabase', body, data => {
    postService(API_PREFIX + 'services/web/activity/examdatabase/updateDatabase', body, data => {

      if (data.status === 1) {
        Message.success(status === 1 ? '启用成功!' : '停用成功!');
        this.refresh();
      } else {
        Message.error(data.errorMsg);
      }
    });
  };
  deleteBank= (id) => {
    console.log('获取id', id);
    console.log('pageData', this.props);
    let body={};
    // postService(API_PREFIX + `services/web/activity/examtitle/deleteDatabase/${id}`,body,data => {
     postService(API_PREFIX + `services/web/activity/examdatabase/deleteDatabase/${id}`,body,data => {

      if (data.status === 1) {
       Message.success("删除成功");
       let currentPage=this.props.dataSource.root.totalNum%10;
      // this.refresh();
      if(currentPage==1){
        this.props.getPageData({ currentPage: this.props.pageData.currentPage-1?this.props.pageData.currentPage-1:1, pageSize: 10 });
      }
      
      // this.props.getData(API_PREFIX + `services/web/activity/examtitle/getDatabaseList/1/10?${qfilter}`);
      setTimeout(()=>{
        this.props.getData(API_PREFIX + `services/web/activity/examdatabase/getDatabaseList/1/${this.props.pageData.pageSize}?${this.props.pageData.query?this.props.pageData.query:'Q=tenantId='+window.sessionStorage.getItem("tenantId")}`);
      },1000);
      // this.props.getData(
      //   API_PREFIX +
      //     // `services/web/activity/examtitle/getDatabaseList/${this.props.pageData.currentPage}/${
      //     `services/web/activity/examdatabase/getDatabaseList/${this.props.pageData.currentPage-1}/${
      //       this.props.pageData.pageSize
      //     }?${this.props.pageData.query}`
      // );
     
      } else {
        Message.error(data.errorMsg);
      }
    });
  };

 tiKu=(e)=>{
    if(e.target.value.length>200){
      Message.error("题目名称不能超过200个字");
      this.setState({ newExamDB: e.target.value.substring(0,200)});
    }else{
      this.setState({ newExamDB: e.target.value});
    }
 }


  exam = () => {
   
    const { modal_visible, newExamDB } = this.state;
    let url = modal_visible === 'add' ? 'insertDatabase' : 'updateDatabase';
    let body =
      modal_visible !== 'add'
        ? { dbName: newExamDB, id: modal_visible }
        : { dbName: newExamDB,dbType:2 };   
        if(newExamDB.length>200){
          Message.error("题库名称最长不能超过200个字");
        return false;
        }  
        this.setState({loading:true});    
    // postService(API_PREFIX + `services/web/activity/examtitle/${url}`, body, data => {
      if(newExamDB!=''){
        postService(API_PREFIX + `services/web/activity/examdatabase/${url}`, body, data => {
    
          if (data.status === 1) {
            Message.success(modal_visible === 'add' ? '新建成功!' : '更新成功!');
            this.setState({ modal_visible: null,loading:false,newExamDB:'' });
            this.refresh();
          } else {
            Message.error(data.errorMsg);
            this.setState({ modal_visible: null,newExamDB:'',loading:false });
          }
        });
      }else{
        Message.error("题库名称不能为空");
        this.setState({ modal_visible: null,newExamDB:'',loading:false });
      }
  };
  render() {
    let {isEdit}=this.state;
    let powers = this.props.powers;
    let createPowers = powers && powers['20002.22009.001'];//新建
    let updatePowers = powers && powers['20002.22009.002'];//修改、停用、启用
    let readPowers = powers && powers['20002.22009.003'];//查询
    let deletePowers = powers && powers['20002.22009.004'];//删除（单个题目删除）
    let exportPowers = powers && powers['20002.22009.202']; //导出
    let topicManagementPowers=powers && powers['20002.22003.246'];//题目管理
    let tenantId = window.sessionStorage.getItem("tenantId");
    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
        width:60,
      },
      {
        title: '题库名称',
        dataIndex: 'dbName',
        key: 'name',
        // width:300,
      },
      {
        title: '题目数量',
        dataIndex: 'titleNumber',
        key: 'titleNumber',
        width:80,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width:160,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width:160,
        render: (text, record) => {
          return record.status === 1 ? '已启用' : '已停用';
        },
      },
      {
        title: '操作',
        key: 'x',
        width:300,
        render: (text, record, index) => {
          //////console.log("record00==>",record);
          return (
            <div>
              <a className="operation" onClick={() => this.setState({ modal_visible: record.id,newExamDB:record.dbName,isEdit:true })}
                style={{ display: updatePowers ? 'inline-block' : 'none' }}>
                编辑
              </a><Divider type="vertical" />
              {record.status === 1 ? (
                <Popconfirm
                  title="确定停用该题库吗？"
                  onConfirm={this.updateStatus.bind(null, record.id, 0,record.dbName)}
                  okText="确定"
                  cancelText="取消"
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <a className="operation" 
                    style={{ display: updatePowers ? 'inline-block' : 'none' }}>停用</a>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title="确定启用该题库吗？"
                  onConfirm={this.updateStatus.bind(null, record.id, 1,record.dbName)}
                  okText="确定"
                  cancelText="取消"
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  <a
                    style={{ display: updatePowers ? 'inline-block' : 'none' }}>启用</a>
                </Popconfirm>
              )}
              <Divider type="vertical" />
              <a
                style={{ display: topicManagementPowers ? 'inline-block' : 'none' }}
                className="operation" 
                href={`#/EventManagement/Examination/QuestionsManagement?id=${
                  record.id
                }`}
              >
                题目管理
              </a><Divider type="vertical" />
              <a className="operation" onClick={this.deleteBank.bind(null, record.id)}
                style={{ display: deletePowers ? 'inline-block' : 'none' }}>
                删除
              </a><Divider type="vertical" />
            </div>
          );
        },
      },
    ];
    const search = [
      {
        key: 'name',
        label: '题库名称',
        qFilter: 'Q=dbName',
        type: 'input',
      },
      {
        key: 'status',
        label: '状态',
        qFilter: 'Q=status',
        type: 'select',
        option: [
          { key: '', value: '全部' },
          { key: '1', value: '已启用' },
          { key: '0', value: '已停用' },
        ],
      },
    ];
    return (
      <div>
        <Spin spinning={this.state.loading}>
          <TableAndSearch
            columns={columns}
            type="ExaminationBank"
            // url={'services/web/activity/examtitle/getDatabaseList'}
            url={'services/web/activity/examdatabase/getDatabaseList'}
            search={search}
            urlfilter={`Q=tenantId=${tenantId}`}
            width={1200}
            addBtn={createPowers?{
              order: 2,
              OnEvent: () => {
                this.setState({ modal_visible: 'add',isEdit:false });
              },
            }:null}
          //  deleteBtn={deletePowers ? { order: 5, url:'services/web/activity/examtitle/deleteDatabase' }:null}
          />
          <Modal
            className="modal"
            title={isEdit? "编辑题库":"新建题库"}
            maskClosable={false}
            footer={null}
            visible={this.state.modal_visible ? true : false}
            onCancel={() => this.setState({ modal_visible: null })}
            key={'examDbModal'}
            destroyOnClose={true}
          >
            <span>题库名称:</span>
            <Input onChange={e =>this.tiKu(e)} value={this.state.newExamDB } />
            {/* <span style={{color:"red"}}>题库名称不能超过200个字</span> */}
            <Button className="resetBtn" style={{marginLeft:"166px",marginTop:"10px"}} onClick={() => this.setState({ modal_visible: null,newExamDB:'' })}>
              取消
            </Button>
            <Button className="queryBtn" onClick={this.exam} loading={this.state.loading}>确定</Button>
          </Modal>
        </Spin> 
      </div>
    );
  }
}