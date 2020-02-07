import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { GetQueryString,postService,getService } from '../../../myFetch';
import { connect } from 'react-redux';
import { Modal,Button,Row,Col,Upload,Table,message} from 'antd';
import  API_PREFIX from '../../../apiprefix';
import FormAndInput from '../../../../component/table/FormAndInput';
import ImportWrapper from '../../../../component/import/import';
import ImportPart1 from '../../ImportPart1';
import Add from './Add';
import Edit from './Edit';
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
export default class Topic extends Component {
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
      totalNum:0,
      topicIds:[],
      selectIds:[],
      selectedRowKeys:[],
      getIds:[],
      topicId:'',//编辑题目id
      topicDetail:{},
      lookDetail:false,
    };
  }

  componentWillMount(){
    localStorage.setItem("selectedRowKeys", '');
  }
  componentDidMount(){
    this.getData();
  }
  getData = () => {
    getService(API_PREFIX +`services/web/activity/voting/getActivityTitle/${this.state.activityId}/${this.state.currentPage}/1000`,data => {
      if (data.status === 1) {
        console.log(data);
        let list = [];
        if(data.root.list){
          data.root.list.map((item,index)=>{
            item['sNum'] = (this.state.currentPage-1)*10+index+1;
            list.push(item.id);
          });
        }
        

        this.setState({data: data.root.list||[],getIds:list,topicIds:list,totalNum:data.root.totalNum});      
      }
    }
  );
  }

  onPageChange = (currentPage) => {
    this.setState({ 
      currentPage, 
    },() => {
      getService(API_PREFIX +`services/web/activity/voting/getActivityTitle/${this.state.activityId}/${this.state.currentPage}/100`,data => {
        if (data.status === 1) {
          console.log(data);
          let list = [];
          if(data.root.list){
            data.root.list.map((item,index)=>{
              item['sNum'] = (this.state.currentPage-1)*10+index+1;
              list.push(item.id);
            });
          }
          this.setState({data: data.root.list||[],getIds:list,topicIds:list,totalNum:data.root.totalNum});      
        }
    });
  });}



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
    console.log("topicIds===>",topicIds)  //已经被添加的id
    let selectedData = this.props.selectRowsData;   //选中的数据
    selectedData.map(item => {
      if(topicIds.indexOf(item.id) == -1){
        topicIds.push(item.id);
        data.push(item);
      }else{
        message.info("请勿重复添加表单");
      }
    });

   console.log("data===>",topicIds,data)
    if(data.length>20){
      message.info("投票题目最多只能设置20项");
      data.splice(20,data.length);
      topicIds.splice(20,topicIds.length);
      // return;
    }
    // console.log("data6666",data,topicIds)
    data.map((item,index) => {
      item['sNum'] = index+1;
    });
    this.setState({topicIds,data,addModal: false});
    this.props.getSelectRowData([]);
    localStorage.setItem("selectedRowKeys", '');
  }


  ////导入成功的数据
  getSuccessResult= (selectedData) =>{
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
    this.props.getData(API_PREFIX+`services/web/activity/votingtitle/getVoteTopic/1/10?${qfilter}&Q=tenantId=${tenantId}`);
}
  hideModel = () => {
    this.setState({importModal: false});
  }
  hidehandModel = () => {
    this.setState({addhandModal: false});
  }
  hideEditModel = () => {
    this.setState({edithandModal: false});
  }
  getHandAddTopic = topicData => {
    let {topicIds,data} = this.state;
    data.push(topicData);
    topicIds.push(topicData.id);
    this.setState({data,topicIds});
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
      postService(API_PREFIX+`services/web/activity/voting/setVoteTopic/${this.state.activityId}`,this.state.data,data=>{
        if(data.status === 1){
          message.success('保存成功');
          this.setState({selectIds:[]});
          location.hash = `EventManagement/Vote/List?id=0`; 
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
    let createPowers = powers && powers['20002.22005.211'];                  // 20190316   pyj  徐浩权限码有调整
    let updatePowers = powers && powers['20002.22005.212'];               // 20190316   pyj  徐浩权限码有调整
    let deletePowers = powers && powers['20002.22005.213'];                 // 20190316   pyj  徐浩权限码有调整
    // let importPowers = powers && powers['20002.22003.201'];       
    let importPowers = powers && powers['20002.22011.207'];
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
                return '字符串';
            }else if(record.titleType===4){
                return '数字';
            }
        }, 
      },
      // {
      //   title: '创建时间',
      //   dataIndex: 'createDate',
      //   key: 'createDate',
      // },
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
            <a onClick={() => this.setState({lookDetail:true,topicId:record.titleId?record.titleId:record.id,topicDetail:record,edithandModal:true})}>查看</a>
            :<a onClick={() => this.setState({topicId:record.titleId?record.titleId:record.id,topicDetail:record,edithandModal:true})}>编辑</a>}
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
                  return '字符串';
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

    // let pagination = {
    //   total: this.state.totalNum,
    //   current: this.state.currentPage,
    //   onChange: this.onPageChange,
    // };

    return (
      <div>
        <div className="custom-table">
          <div className="custom-table-btn">
            <Button type='primary' className="queryBtn" onClick={() => this.setState({addModal: true,qfilter:""})} style={{ display: this.state.activeKey==0? 'block' : 'none' }} >添加题目</Button>
            <Button type='danger'  className="deleteBtn" onClick={this.deleteTopic} style={{ display: this.state.activeKey==0? 'block' : 'none' }} disabled={selectedRowKeys.length <= 0}>删除</Button>
            {/* <Button type="primary" className="queryBtn" onClick={() => location.hash = `/EventManagement/Vote/TopicAdd?isEdit=false&activityId=${this.state.activityId}`}  >自定义添加题目</Button> */}
            <Button type="primary" className="queryBtn" onClick={() => this.setState({addhandModal: true})} style={{ display: this.state.activeKey==0? 'block' : 'none' }} >新建题目</Button>
            {/* <Button type='default' className="exportBtn" onClick={() => this.setState({importModal: true})}  style={{ display: this.state.activeKey==0? 'block' : 'none' }}>批量导入题目</Button> */}
          </div>
          <Table 
              rowKey={'id'} 
              bordered 
              columns={columns} 
              dataSource={data} 
              // pagination={pagination}
              rowSelection={rowSelection}
          />
               
        </div>
        <div style={{marginTop:100}}>
            <Row>
                <Col span={6} offset={8}>
                    <Button type='default' className="resetBtn" onClick={()=>{history.back();}} >取消</Button>
                </Col>
                <Col span={6}>
                    <Button type='primary'  className="queryBtn" onClick={this.saveData}  style={{ display: this.state.activeKey==0? 'block' : 'none' }}>保存</Button>
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
            url='services/web/activity/votingtitle/getVoteTopic'
            onSearch={this.handleInput}
            qfilter={`${this.state.qfilter}Q=tenantId=${tenantId}`}
          />
        </Modal>
        <Modal
          width={800}
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
          />
        </Modal>
        <Modal
          width={1000}
          title="编辑题目"
          visible={this.state.edithandModal}
          footer={null}
          destroyOnClose={true}
          onCancel={()=>this.setState({edithandModal:false})}
        >
          <Edit 
            id={this.state.topicId}
            topicDetail={this.state.topicDetail}
            activityId={this.state.activityId}
            hideEditModel={this.hideEditModel}
            getHandEditTopic={this.getHandEditTopic}
            isEdit='true'
            activeKey={this.state.activeKey}
            lookDetail={this.state.lookDetail}
          />
        </Modal>
        <Modal
          title="批量导入题目"
          visible={this.state.importModal}
          footer={<Button onClick={() => this.setState({ importModal: false })}>返回</Button>}
          onCancel={()=>this.setState({ importModal: false })}
          destroyOnClose={true}
        >
        <ImportPart1
           importUrl={`services/activity/import/activityExamTopics`}
          //  listurl={`${API_PREFIX}services/activity/voteActivity/topic/list`}
           downlodUrl={ `${API_PREFIX}services/activity/examTopic/examTopicTemplate`}
           getSuccessResult={this.getSuccessResult}
           fileName='导入题目模板'
           hideModel={this.hideModel}
           />
        </Modal>
      </div>
    );
  }
}
