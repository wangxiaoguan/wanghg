import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { GetQueryString,postService,getService } from '../../../myFetch';
import { connect } from 'react-redux';
import { Modal,Button,Row,Col,Upload,Table,message} from 'antd';
import  API_PREFIX from '../../../apiprefix';
import FormAndInput from '../../../../component/table/FormAndInput';
import ImportWrapper from '../../../../component/import/import';
import ImportPart1 from '../../ImportPart1';
import Add from './CustomAdd';
/////import Edit from './Edit';
import { BEGIN,getPageData,getSelectRows } from '../../../../../redux-root/action/table/table';
@connect(state => ({
    powers: state.powers,
    selectRowsData: state.table.selectRowsData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    getPageData:n=>dispatch(getPageData(n)), 
    getSelectRowData: n => dispatch(getSelectRows(n)),
  })

)
export default class Field extends Component {
  constructor(props) {
    super(props);
    this.state = {
     activeKey:  GetQueryString(location.hash, ["activeKey"]).activeKey || "", 
      activityId: GetQueryString(location.hash, ['id']).id || '',
      importModal:false,
      addModal:false,
      addhandModal:false,
      edithandModal:false,
      qfilter:'',
      data:[],
      currentPage:1,
      topicIds:[],
      selectIds:[],
      selectedRowKeys:[],
      getIds:[],
      topicId:'',//编辑题目id
      topicDetail:{},
    };
  }

  componentWillMount(){
    localStorage.setItem("selectedRowKeys", '');
  }
  componentDidMount(){
    this.getData();
  }                             
  getData = () => {
    getService(API_PREFIX +`services/web/activity/question/getActivityTitle/${this.state.activityId}/${this.state.currentPage}/10000`,data => {
      if (data.status === 1) {
        console.log(data);
        let list = [];
        if(data.root.list){
          data.root.list.map((item,index)=>{
            item['sNum'] = (this.state.currentPage-1)*10+index+1;
            list.push(item.id);
          });
        }
        this.setState({data: data.root.list||[],getIds:list,topicIds:list});
        
      }
    }
  );
  }
  deleteTopic = () => {
    let {data,topicIds,selectIds} = this.state;
    selectIds.map(item => {
      let index = topicIds.indexOf(item);
      topicIds.splice(index,1);
      data.splice(index,1);
    });
    data.map((item,index) => {
      item.sNum = index+1;
    });
    this.setState({data,topicIds,selectIds:[],selectedRowKeys:[]});
  }
  showTopic = () => {
    this.setState({addModal:true});
  }
  AddModalOK = () =>{
    let {topicIds,data} = this.state;
    let selectedData = this.props.selectRowsData;
    selectedData.map(item => {
      if(topicIds.indexOf(item.id) === -1){
        topicIds.push(item.id);
        data.push(item);
      }else{
        message.info("请勿重复添加表单");
      }
    });
    data.map((item,index) => {
      item['sNum'] = index+1;
    });
    this.setState({topicIds,data,addModal: false});
    this.props.getSelectRowData([]);
    localStorage.setItem("selectedRowKeys", '');
  }

  ////导入题目的
  getSuccessResult = (selectedData) =>{
    let {topicIds,data} = this.state;
    selectedData.map(item => {
      if(topicIds.indexOf(item.id) === -1){
        topicIds.push(item.id);
        data.push(item);
      }else{
        message.info("请勿重复添加表单");
      }
    });
    data.map((item,index) => {
      item['sNum'] = index+1;
    });
    this.setState({topicIds,data,addModal: false});
    // this.props.getSelectRowData([]);
    // localStorage.setItem("selectedRowKeys", '');
  }
  handleInput = (e) => {
    let qfilter = e.target.value == '' ? '' : `Q=titleName=${e.target.value}`;
    let tenantId = window.sessionStorage.getItem("tenantId");
    this.setState({qfilter});
    this.props.getPageData({currentPage: 1, pageSize: 10, query: qfilter});
    this.props.getData(API_PREFIX+`services/web/activity/questiontitle/getQuestionTopic/1/10?${qfilter}&Q=tenantId=${tenantId}`);
}
  hideModel = () => {
    this.setState({importModal: false});
  }
  hidehandModel = () => {
    this.setState({addhandModal: false});
  }
  hideEditModel = () => {
    this.setState({edithandModal: false, addhandModal: false});
  }
  isEdit=()=>{
    this.setState({isEdit: true});
  }
  getHandAddTopic = topicData => {
    let {topicIds,data} = this.state;
    data.push(topicData);
    topicIds.push(topicData.id);
    this.setState({data,topicIds});
  }
  hideedithandModal=()=>{
    this.setState({edithandModal: false});
  }
 // 父组件调用子组件的方法
 onRef = (ref) => {
  this.child = ref
}
  //确定用户导入
  handleImportModalOk = () => {
    this.child.UploadChange();
    this.setState({
      importModal: false,
    });
  }
  //取消用户导入
  handleImportModalCancel = () => {
    this.setState({
      importModal: false,
    });
  }

/////编辑保存的
getHandEditTopic = topicData => {
  let {data} = this.state;
 console.log("data",data);
 console.log("topicData",topicData);
 data.map((item,index)=>{
  if(item.id==topicData.id){
    console.log("item",item);
    data.splice(index,1,topicData);
  }
});
  // data.push(topicData);
console.log("data",data);
 this.setState({data});
}

  saveData = () =>{
    if(this.state.data.length){
      postService(API_PREFIX+`services/web/activity/question/setQuestionTopic/${this.state.activityId}`,this.state.data,data=>{
        if(data.status === 1){
          message.success('保存成功');
          this.setState({selectIds:[]});
          location.hash = `EventManagement/Questionnaire/List?id=0`; 
        }
      });
    }else{
      message.warning('请选择数据');
    }
  }
  render() {
    console.log(this.state);
    let powers = this.props.powers;
    const selectedRowKeys = this.state.selectIds;
    let tenantId = window.sessionStorage.getItem("tenantId");
    let data = this.state.data;
    data.map((item,index)=>{
      item.sNum = (this.state.currentPage-1)*10+index+1;
    });
    const columns = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '题目名称',
        dataIndex: 'titleName',
        key: 'titleName',
      },
      {
        title:'题目类型',
        dataIndex:'titleType',
        key:'titleType', 
        render:(text,record)=>{
            if(record.titleType===1){
                return '单选';
            }else if(record.titleType===2){
                return '多选';
            }else if(record.titleType===3){
                return '问答';
            }else if(record.titleType===4){
                return '数字';
            }
        }, 
      },
      {
        title:'显示顺序',
        dataIndex:'showIndex',
        key:'showIndex',  
      },
      {
        title: '操作',
        key: 'x',
        render: (text, record, index) => {
          return (
            <div>
               {this.state.activeKey!=0?
            <a onClick={() => this.setState({topicId:record.titleId?record.titleId:record.id,topicDetail:record,edithandModal:true})}>查看</a>
            :<a onClick={() => this.setState({ topicId:record.titleId?record.titleId:record.id,topicDetail:record,edithandModal:true})}>编辑</a>}
              {/* <a
                className="operation"
                href={
                  GetQueryString(location.hash, ['activeKey']).activeKey==1?
                  `#/EventManagement/Vote/TopicEdit?isEdit=true&id=${record.titleId?record.titleId:
                    record.id
                  }&activityId=${this.state.activityId}&voteTop=voteTop`
                  :
                  `#/EventManagement/Vote/TopicEdit?isEdit=true&id=${record.titleId?record.titleId:
                  record.id
                }&activityId=${this.state.activityId}`
              }
                style={{ display: updatePowers ? 'inline-block' : 'none' }}
              >
                编辑
              </a> */}
            </div>
          );
        },
      },
    ];
    const columnsTopic = [
        {
          title:'序号',
          dataIndex:'sNum',
          key:'sNum',  
        },
        {
          title:'题目名称',
          dataIndex:'titleName',
          key:'titleName',  
        },
        {
          title:'题目类型',
          dataIndex:'titleType',
          key:'titleType', 
          render:(text,record)=>{
              if(record.titleType===1){
                  return '单选';
              }else if(record.titleType===2){
                  return '多选';
              }else if(record.titleType===3){
                  return '问答';
              }else if(record.titleType===4){
                  return '数字';
              }
          }, 
        },
        {
          title:'显示顺序',
          dataIndex:'showIndex',
          key:'showIndex',  
        },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: (ids, data) => {
        this.setState({selectIds:ids});
      },
      getCheckboxProps: '',
    };
   ////// console.log("this.state.activeKey",this.state.activeKey);
    return (
      <div>
        <div className="custom-table">
          <div className="custom-table-btn">
            <Button type='primary' className="queryBtn" onClick={() => this.setState({addModal: true,qfilter:""})} style={{ display: this.state.activeKey==0? 'block' : 'none' }} >添加题目</Button>
            <Button type='danger'  className="deleteBtn" onClick={this.deleteTopic}  style={{ display: this.state.activeKey==0? 'block' : 'none' }} disabled={selectedRowKeys.length <= 0}>删除</Button>
            {/* <Button type="primary" className="queryBtn" onClick={() => location.hash = `/EventManagement/Vote/TopicAdd?isEdit=false&activityId=${this.state.activityId}`}  >自定义添加题目</Button> */}
            <Button type="primary" className="queryBtn" onClick={() => this.setState({addhandModal: true})}  style={{ display: this.state.activeKey==0? 'block' : 'none' }}>新建题目</Button>
            <Button type='default' className="exportBtn" onClick={() => this.setState({importModal: true})}  style={{ display: this.state.activeKey==0? 'block' : 'none' }}>批量导入题目</Button>
          </div>
          <Table 
              rowKey={'id'} 
              bordered 
              columns={columns} 
              dataSource={data} 
              rowSelection={rowSelection}
          />
               
        </div>
        <div style={{marginTop:100}}>
            <Row>
                <Col span={6} offset={8}>
                    <Button type='default' className="resetBtn" onClick={()=>{history.back();}} >取消</Button>
                </Col>
                <Col span={6}>
                    <Button type='primary'  className="queryBtn" onClick={this.saveData} style={{ display: this.state.activeKey==0? 'block' : 'none' }} >保存</Button>
                </Col>
            </Row>
        </div>    
        
        <Modal
          width={800}
          title="添加题目"
          visible={this.state.addModal}
          cancelText="取消"
          okText="添加"
          onOk={this.AddModalOK}
          onCancel={()=>{this.setState({addModal:false});this.props.getSelectRowData([]);localStorage.setItem("selectedRowKeys", '');}}
          destroyOnClose={true}
        >
          <FormAndInput
            columns={columnsTopic}
            typeC={'checkradio'}
            url='services/web/activity/questiontitle/getQuestionTopic'
            onSearch={this.handleInput}
            qfilter={`${this.state.qfilter}Q=tenantId=${tenantId}`}
          />
        </Modal>
        <Modal
          width={1000}
          title="新建题目"
          visible={this.state.addhandModal}
          footer={null}
          destroyOnClose={true}
          onCancel={()=>this.setState({addhandModal:false})}
        >
          <Add 
            activityId={this.state.activityId}
            hidehandModel={this.hidehandModel}
            getHandAddTopic = {this.getHandAddTopic}
            hideEditModel={this.hideEditModel}
            
          />
        </Modal>
        <Modal
          width={1000}
          title="编辑自定义题目"
          visible={this.state.edithandModal}
          footer={null}
          destroyOnClose={true}
          onCancel={()=>this.setState({edithandModal:false})}
        >
          <Add
            id={this.state.topicId}
            activityId={this.state.activityId}
            topicDetail={this.state.topicDetail}
            hideEditModel={this.hideEditModel}
            getHandEditTopic={this.getHandEditTopic}
            isEdit={true}
          />
        </Modal>
        <Modal
          title="批量导入题目"
          visible={this.state.importModal}
          // footer={<Button onClick={() => this.setState({ importModal: false })}>返回</Button>}
          onOk={this.handleImportModalOk}
          // onCancel={this.handleImportModalCancel}
          onCancel={this.handleImportModalCancel}
          destroyOnClose={true}
        >
        <ImportPart1
           onRef={this.onRef}
           importUrl={`services/web/activity/questiontitle/importQuestionTitle`}
          //  listurl={`${API_PREFIX}services/activity/voteActivity/topic/list`}
           downlodUrl={ `${API_PREFIX}services/web/activity/questiontitle/titletemplate`}
           getSuccessResult={this.getSuccessResult}
           fileName='导入题目模板'
           hideModel={this.hideModel}
           />
        </Modal>
      </div>
    );
  }
}
