import React, { Component } from 'react';
import {Button,message,Popconfirm,Modal,Spin,Table,Input,Row,Col} from 'antd';
import {postService,getService,GetQueryString} from '../../myFetch';
import FormAndInput from '../../../component/table/FormAndInput';
import { pageJummps } from '../PageJumps';
import API_PREFIX from '../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
@connect(
    state => ({
      dataSource: state.table.tableData,
      pageData:state.table.pageData,
      getPageData:n=>dispatch(getPageData(n)),
      retSetData: n=>dispatch(getDataSource(n)),
      selectRowsData: state.table.selectRowsData,
    }),
    dispatch => ({
      getData: n => dispatch(BEGIN(n)),
    })
)
class ColumnContent extends Component {
  constructor(props){
    super(props);
    this.state={
      loading: false,
      selectedRowKeys:[],
      modal_visible:false,
      newsSpecialId:GetQueryString(location.hash, ['id']).id ||0,
      currentPage:1,
      pageSize:10,
      sortid:'',
      title:'',
      type:1,
      modalVisible:false,
      visible:false,
      typeL:GetQueryString(location.hash, ['type']).type ||0,
      qfilter:'',
    }
  }
  componentDidMount(){
    this.dealData(1,10);
  }
  dealData=(currentPage,pageSize)=>{
    this.setState({ loading: true });
    let {newsSpecialId}=this.state
      getService(API_PREFIX + `${pageJummps.TopicContentList}/${currentPage}/${pageSize}?Q=categoryId=${newsSpecialId}`,data=>{
        if(data.status===1){
          const dataSource = data.root&&data.root.list;
          this.setState({dataSource,totalNum:data.root.totalNum,loading:false});
        }else{
          message.error(data.errorMsg);
          this.setState({ loading: false });
        }      
      });
  }

  onPageChange = (currentPage, pageSize) => {
    this.setState({ currentPage, pageSize });
    this.dealData(currentPage,pageSize);
  };
  onPageSizeChange = (currentPage, pageSize) => {
    this.setState({ currentPage, pageSize });
    this.dealData(currentPage,pageSize);
  };

  add=()=>{
    this.setState({ modal_visible: true,type:'add', title:'',sortid:''})
  }

  deleteData = (url) => {
    let {currentPage,pageSize,newsSpecialId}=this.state;
    let body =  {ids: this.state.selectedRowKeys,categoryId:newsSpecialId}
    postService(API_PREFIX + pageJummps.TopicContentDeleta,body,data => {
        if (data.status === 1) {
          message.success('删除成功!');
          this.setState({selectedRowKeys:[],visible:false,currentPage:1},() => {this.dealData(currentPage,pageSize)});
        } else {
          message.error(data.errorMsg);
          this.setState({visible:false});
        }
      }
    );
  }

  addZixun=(item,url,type,qfilter)=>{
    this.setState({
        showAddModal:true,
        titleName:item,
        url:url,
        type:type,
        qfilter
    })
  }

    //关联类型输入框输入值的变化
    handleInput = (e, url,type, qilter) => {
      if(e.target.value===''){
        this.props.getData(API_PREFIX + `${url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.state.qfilter}`);
      }else{
        this.props.getData(API_PREFIX + `${url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.state.qfilter}&Q=title=${e.target.value}`);
      }
    }

    handleAddModalOK=()=>{
      let {newsSpecialId,type,currentPage,pageSize}=this.state
      let selectRowsData = this.props.selectRowsData;
      let body=[]
      selectRowsData.map(v=>{
        let ListOne={}
        ListOne.categoryId=newsSpecialId
        ListOne.newsId=v.id
        ListOne.type=type
        body.push(ListOne)
      })


      postService(API_PREFIX + pageJummps.TopicContentAdd,body,data=>{
        if(data.status==1){
          message.success('添加成功');
          this.dealData(currentPage,pageSize);
        } else {
          message.error(data.errorMsg);
        }
      });
      this.setState({showAddModal:false});
    }

    setSort=(record)=>{
      this.setState({
        modalVisible:true,
        sortid:record.sortid,
        newsId:record.newsId
      })
    }

    submitSort=()=>{
      let {sortID,currentPage,pageSize,newsId,sortid,newsSpecialId}=this.state;
      if((sortID+'').length>9){
        message.error("排序数值最大不得大于9位")
        return
      }else if(sortID<0){
        message.error('排序数值不能为负数')
        return
      }
      if(sortID===''||sortID===undefined){
        sortID=sortid
        let body={};
        body.sortID=sortID;
        body.newsId=newsId
        body.categoryId=newsSpecialId
        postService(API_PREFIX+pageJummps.TopicContentSort,body,data=>{
          if(data.status==1){
            message.success('设置成功');
            this.dealData(currentPage,pageSize);
            this.setState({ modalVisible: false })
          }else{
            message.error(data.errorMsg);
          }
        });
      }else{
        let body={};
        body.sortID=sortID;
        body.newsId=newsId
        body.categoryId=newsSpecialId
        postService(API_PREFIX+pageJummps.TopicContentSort,body,data=>{
          if(data.status==1){
            message.success('设置成功');
            this.dealData(currentPage,pageSize);
            this.setState({ modalVisible: false })
          }else{
            message.error(data.errorMsg);
          }
        });
      }
  }
  handleVisibleChange = () => {
    let {selectedRowKeys}=this.state;
    if (selectedRowKeys.length===0) {
      this.setState({
        visible:false
      })
    }else{
      this.setState({
        visible:true
      })
    }
  }
  Popcancel=()=>{
    this.setState({ visible: false });
  }
  render() {
    const {totalNum,dataSource,pageSize, currentPage,selectedRowKeys,title,sortid,titleName,url,type,newsSpecialId,typeL,qfilter} = this.state;
    let pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      total: totalNum,
      pageSize: pageSize,
      current: currentPage,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
      pageSizeOptions: ['10', '20', '30', '40'],
    };

    const rowSelection = {
        selectedRowKeys,
      type:this.props.type=='radio'?'radio':'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({selectedRowKeys})
      },
      getCheckboxProps: this.props.getCheckboxProps ? this.props.getCheckboxProps : '',
    };


    // let hasAddPower=powers && powers['20003.23001.001'];
    // let hasDelPower=powers && powers['20003.23001.004'];
    // let hasEditPower=powers && powers['20003.23001.002'];
    // let hasSearchPower=powers && powers['20003.23001.003'];
    // let hasExportPower=powers && powers['20003.23001.202'];

    const columns=[
      {
        title:'标题',
        dataIndex:'title',
        key:'title',
        width:150,
      },
      {
        title:'排序ID',
        dataIndex:'sortId',
        key:'sortId',
        width:100,
      },
      {
        title:'类型',
        dataIndex:'type',
        key:'type',
        width:100,
        render:(data,record)=>(
          <div>
            {record.type===1?<span>文章</span>:null}
            {record.type===2?<span>视频</span>:null}
            {record.type===3?<span>活动</span>:null}
          </div>
        )
      },
      {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate',
        width:150,
      }
      ,{
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        width:150,
        render:(data,record)=>(
          <div>
              <a onClick={()=>this.setSort(record)} className='operation'>设置排序</a>
          </div>
        )
      }
    ];
   //设置按钮的权限
  //  const hasPower={
  //    add:hasAddPower,
  //    export:hasExportPower,
  //    delete:hasDelPower,
  //  }
    let columnS=[]
    if(type===3){
      columnS=[
        {
          title: '标题',
          dataIndex: 'activityName',
          key: 'activityName',
        },
        {
          title: '创建日期',
          dataIndex: 'createDate',
          key: 'createDate',
        },
      ]
    }else{
      columnS=[
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: '创建日期',
          dataIndex: 'createDate',
          key: 'createDate',
        },
      ]
    }


    return (
      <Spin spinning={this.state.loading}>
        <div style={{marginTop:'40px'}}>
            <Button className="queryBtn" type="primary" style={{ order: 1 }} onClick={() => this.addZixun('添加文章',`services/web/news/special/rel/getArticList`,1,`Q=categoryId=${newsSpecialId}&Q=specialType=${typeL=='normal'?'6':'7'}`)}>添加文章</Button>
            <Button className="queryBtn" type="primary" style={{ order: 1 }} onClick={() => this.addZixun('添加视频',`services/web/news/special/rel/getVideoList`,2,`Q=categoryId=${newsSpecialId}&Q=specialType=${typeL=='normal'?'6':'7'}`)}>添加视频</Button>
            <Button className="queryBtn" type="primary" style={{ order: 1 }} onClick={() => this.addZixun('添加活动',`services/web/news/special/rel/getActivityList`,3,`Q=categoryId=${newsSpecialId}&Q=specialType=${typeL=='normal'?'6':'7'}`)}>添加活动</Button>
            <Popconfirm title="确定删除所选项吗？" okText="确定" visible={this.state.visible} onVisibleChange={this.handleVisibleChange} onCancel={this.Popcancel}  onConfirm={()=>this.deleteData()} cancelText="取消">
                <Button type="primary" className="deleteBtn"  style={{ order: 1 }} disabled={selectedRowKeys.length <= 0}>
                    删除
                </Button>
            </Popconfirm>
            <Button className="resetBtn" onClick={() => history.back()}>返回</Button>
            <Table style={{marginTop:'20px'}} rowKey={'newsId'} bordered columns={columns} dataSource={dataSource} pagination={pagination} rowSelection={rowSelection} ></Table>
        </div>
        <Modal
            title={titleName}
            visible={this.state.showAddModal? true : false}
            width={700}
            footer={
              <React.Fragment> 
                <Button onClick={()=>this.handleAddModalOK(type)}
                  disabled={!(this.props.selectRowsData && this.props.selectRowsData.length > 0)}>添加</Button>
                <Button onClick={() => this.setState({ showAddModal: false })
                }>取消</Button>
              </React.Fragment>}
            onCancel={() => this.setState({ showAddModal: false })
            }
            destroyOnClose={true}
          >
            <FormAndInput
              columns={columnS}
              url={url}
              qfilter={qfilter}
              onSearch={e => this.handleInput(e, url,type, "")}
              typeC='checkradio'
            />
        </Modal>

        <Modal
            className="modal"
            title={'设置排序'}
            maskClosable={false}
            footer={null}
            visible={this.state.modalVisible ? true : false}
            onCancel={() => this.setState({ modalVisible: false })}
            key={'examDbModal'}
            destroyOnClose={true}
          > 
            <Row>
                <Col span={8} style={{textAlign:'right',verticalAlign: "middle",marginBottom:'20px'}} pull={2}><span style={{color:'red'}}>*</span>排序ID:</Col><Col style={{textAlign:'right',verticalAlign: "middle",marginBottom:'20px'}} span={12}><Input defaultValue={sortid} type='number' onChange={e => this.setState({ sortID: e.target.value })}/></Col>
            </Row>
            
            <Button className="resetBtn" style={{marginLeft:"166px",marginTop:"10px"}} onClick={() => this.setState({ modalVisible: false })}>
              取消
            </Button>
            <Button className="queryBtn" onClick={()=>this.submitSort()} loading={this.state.loading}>确定</Button>
          </Modal> 

      </Spin>
    );
  }
}

export default ColumnContent;
