import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { GetQueryString,postService,getService } from '../../../myFetch';
import { connect } from 'react-redux';
import { Modal,Button,Row,Col,Upload,Table,message,Input,Form} from 'antd';
import  API_PREFIX from '../../../apiprefix';
import FormAndInput from '../../../../component/table/FormAndInput';
import ImportWrapper from '../../../../component/import/import';
import ImportPart1 from '../../ImportPart1';
import Add from '../Field/SetAdd';
const { TextArea } = Input;
const FormItem = Form.Item;
/////import Edit from './Edit';
import { BEGIN,getPageData,getSelectRows } from '../../../../../redux-root/action/table/table';
@connect(state => ({
    powers: state.powers,
    selectRowsData: state.table.selectRowsData,
    dataSource: state.table.tableData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    getPageData:n=>dispatch(getPageData(n)), 
    getSelectRowData: n => dispatch(getSelectRows(n)),
  })

)
@Form.create()
export default class Field extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey:  GetQueryString(location.hash, ["activeKey"]).activeKey || "", 
      activityId: GetQueryString(location.hash, ['id']).id || '',
      back: GetQueryString(location.hash, ['back']).back || '',
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
      topicId:'',//编辑题目id,
      attention:'',////报名须知
      categoryRelevances:[],
      updateKeyOne:0,
      topicDetail:{},
      upperLimit:"",
    };
  }

  componentWillMount(){
    localStorage.setItem("selectedRowKeys", '');
  }
  componentDidMount(){
    this.getData();
  }                             
  getData = () => {
    getService(API_PREFIX +`services/web/activity/enrolment/getActivityTitle/${this.state.activityId}/${this.state.currentPage}/10`,data => {
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

  getService(API_PREFIX +`services/web/activity/enrolment/getById/${this.state.activityId}`,data => {
    if (data.status === 1) {
      console.log(data);
      let upperLimit="";
      if(data.root.object.upperLimit){
        upperLimit=data.root.object.upperLimit;
      }
      this.setState({attention:data.root.object.attention,categoryRelevances:data.root.object.categoryRelevances,upperLimit});
      this.props.form.setFieldsValue({
        attention: data.root.object.attention,
      });
    }
  });
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
      let arr=[];
      let selectedData=[];
      if(window.localStorage.getItem("selectedRowKeys")&&window.localStorage.getItem("selectedRowKeys")!==''){
          arr= window.localStorage.getItem("selectedRowKeys").split(",")
      }
      arr.length>0&&this.props.dataSource.root.list&&this.props.dataSource.root.list.length>0&&this.props.dataSource.root.list.map((item,index)=>{
            arr.map((list,_index)=>{
                  if(item.id==list){
                    selectedData.push(item) 
                  }
            })
      })
    let {topicIds,data} = this.state;
    // let selectedData = this.props.selectRowsData;
    console.log("selectedData===>",selectedData);
    selectedData.map(item => {
      if(topicIds.indexOf(item.id) === -1){
        topicIds.push(item.id);
        data.push(item);
      }else{
        message.info("请勿重复添加报名表单");
      }
    });
    data.map((item,index) => {
      item['sNum'] = index+1;
    });
    this.setState({topicIds,data,addModal: false});
    this.props.getSelectRowData([]);
    localStorage.setItem("selectedRowKeys", '');
  }
  handleInput = (e) => {
    let qfilter = e.target.value == '' ? '' : `Q=titleName=${e.target.value}`;
    let tenantId = window.sessionStorage.getItem("tenantId");
    this.setState({qfilter});
    this.props.getPageData({currentPage: 1, pageSize: 10, query: qfilter});
    this.props.getData(API_PREFIX+`services/web/activity/enrolmenttitle/getEnrolmentLabel/1/10?${qfilter}&Q=tenantId=${tenantId}`);
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
  isEdit=()=>{
    this.setState({isEdit: true});
  }
  getHandAddTopic = topicData => {
    let {data} = this.state;
    data.push(topicData);
    this.setState({data});
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


  // saveData = () =>{
  //  //// let selectIds = this.state.selectIds;
  //   let body ={
  //     activityId:this.state.activityId,
  //     titleInfos:this.state.data,
  //   };
  //   if(selectIds){
  //     postService(API_PREFIX+`services/web/activity/enrolment/setEnrolmentLabel`,body,data=>{
  //       if(data.status === 1){
  //         message.success('保存成功');
  //         this.setState({selectIds:[]});
  //       }
  //     });
  //   }else{
  //     message.warning('请选择数据');
  //   }
  // }


  saveData = () =>{
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("values",values);
        values.id=this.state.activityId;
        values.categoryRelevances=this.state.categoryRelevances;
        if(this.state.upperLimit!=""){
          values.upperLimit=this.state.upperLimit;
        }

        // if(this.state.data.length==0){
        //   message.warning('请添加报名字段数据');
        //   return false;
        // }

        console.log("values",values);
          postService(API_PREFIX+`services/web/activity/enrolment/update`,values,data=>{
            if(data.status === 1){
              message.success('保存成功');
            }else{
              message.error(data.errorMsg);
            }
          });
          this.setState({
            attention:values.attention,
          });
    
      }
    });
    if(this.state.data.length){
      postService(API_PREFIX+`services/web/activity/enrolment/setEnrolmentLabel/${this.state.activityId}`,this.state.data,data=>{
        if(data.status === 1){
          message.success('保存成功');
          this.setState({selectIds:[]});
          ///// history.back();
          location.hash = `EventManagement/Apply/List?id=${this.state.updateKeyOne}`;
        }else{
          message.error(data.errorMsg); 
        }
      });
    }else{
      // debugger;
      // message.warning('请添加报名字段数据');
    }
  }


  /////发布一下：
  publish=()=>{
   let {activityId}=this.state;
    console.log('发布----',activityId);
    this.setState({ updateKeyOne: 1});
    this.saveData();
    let body=[activityId];
    let value={
      dataId:activityId,
      dataType:2,
    };
    postService(API_PREFIX +'services/web/auth/authdata/addAuthDataToRedis',value,data=>{
      if (data.status==1) {
        postService(API_PREFIX +'services/web/activity/enrolment/publishAndOffline/1',body,data=>{
          if (data.status==1) {
              message.success('发布成功');
              location.hash = `EventManagement/Apply/List?id=${this.state.updateKeyOne}`;
            }else{
              message.error(data.errorMsg);
            }
          // }
        });
      }
  });

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
        title: '字段名称',
        dataIndex: 'titleName',
        key: 'titleName',
      },
      {
        title:'字段类型',
        dataIndex:'titleType',
        key:'titleType', 
        render:(text,record)=>{
            if(record.titleType===1){
                return '选项';
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
      {
        title: '操作',
        key: 'x',
        render: (text, record, index) => {
          return (
            <div>
             {this.state.activeKey!=0?
            <a onClick={() => this.setState({topicId:record.titleId?record.titleId:record.id,topicDetail:record,edithandModal:true})}>查看</a>
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
          title:'字段名称',
          dataIndex:'titleName',
          key:'titleName',  
        },
        {
          title:'字段类型',
          dataIndex:'titleType',
          key:'titleType', 
          render:(text,record)=>{
              if(record.titleType===1){
                  return '选项';
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
       this.setState({
        selectIds:[], 
       },()=>{
        this.setState({selectIds:ids});
       });      
      },
      getCheckboxProps: '',
    };
    console.log("this.state.activeKey",this.state.activeKey);
    const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
    const {
      form: { getFieldDecorator },
    } = this.props;
    let {attention}=this.state;
    return (
      <div>
        <div className="custom-table">
        <div style={{ display: this.state.activeKey==0? 'block': 'none'  }}>
        <Row> 
          <Col style={{color:'red',marginTop:"20px",marginLeft:20}}> 
            <Button type='primary'  onClick={()=>location.hash=`/EventManagement/Apply/Field?id=${this.state.activityId}&activeKey=${this.state.activeKey}`}>报名字段管理</Button>
            <span  style={{marginLeft:20}}>提示：</span>您可选择以下字段设置报名表单，也可以自定义添加字段。 
          </Col>
        </Row>
        </div>
          <div className="custom-table-btn">
            <Button type='primary' className="queryBtn" onClick={() => this.setState({addModal: true,qfilter:""})} style={{ display: this.state.activeKey==0? 'block': 'none'  }} >添加报名表单</Button>
            <Button type='danger'  className="deleteBtn" onClick={this.deleteTopic} style={{ display: this.state.activeKey==0? 'block': 'none'  }} disabled={selectedRowKeys.length <= 0}>删除</Button>
            {/* <Button type="primary" className="queryBtn" onClick={() => location.hash = `/EventManagement/Vote/TopicAdd?isEdit=false&activityId=${this.state.activityId}`}  >自定义添加题目</Button> */}
           {/* <Button type="primary" className="queryBtn" onClick={() => this.setState({addhandModal: true})}  style={{ display: this.state.activeKey==0? 'block': 'none'  }}>自定义添加题目</Button> */}
            {/* <Button type='default' className="exportBtn" onClick={() => this.setState({importModal: true})}style={{ display: this.state.activeKey==0? 'block': 'none'  }}>批量导入题目</Button> */}
          </div>
          <Table 
              rowKey={'id'} 
              bordered 
              columns={columns} 
              dataSource={data} 
              rowSelection={rowSelection}
          />
          <Form   style={{paddingTop:'20px'}}>
            <FormItem {...formItemLayout} label="报名须知">
              {
                getFieldDecorator('attention', { initialValue: attention })
                ( <TextArea rows={8} />
                )}
            </FormItem>
          </Form>             
        </div>
        <div style={{marginTop:100}}>
            <Row>
                <Col span={4} offset={4}>
                    <Button type='default' className="resetBtn" onClick={()=>{
                        console.log(history);
                        console.log(this.state);
                        if(this.state.activeKey===0 || this.state.back==1||!this.state.activeKey ){
                          location.hash=`EventManagement/Apply/List?id=0`;
                        }else{
                          history.back();
                        }
                      
                      }} >返回</Button>
                </Col>
                <Col span={4}>
                    <Button type='primary'  className="queryBtn" onClick={this.saveData} style={{ display: this.state.activeKey==0? 'block' : 'none' } } >保存</Button>
                </Col>
                <Col span={4}>
                    <Button type='primary'  className="queryBtn" onClick={this.publish} style={{ display: this.state.activeKey==0? 'block' : 'none' } } >发布</Button>
                </Col>
            </Row>
        </div>    
        
        <Modal
          width={800}
          title="添加报名字段"
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
            url='services/web/activity/enrolmenttitle/getEnrolmentLabel'
            onSearch={this.handleInput}
            qfilter={`${this.state.qfilter}Q=tenantId=${tenantId}`}
          />
        </Modal>
        {/* <Modal
          width={800}
          title="自定义添加题目"
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
        </Modal> */}
        <Modal
          width={1000}
          title="自定义编辑报名字段"
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
            getHandEditTopic = {this.getHandEditTopic}
            isEdit={true}
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
           importUrl={`services/activity/import/activityExamTopics?activityId=${this.state.activityId}`}
           listurl={`${API_PREFIX}services/activity/voteActivity/topic/list`}
           downlodUrl={ `${API_PREFIX}services/activity/examTopic/examTopicTemplate`}
           fileName='导入题目模板'
           hideModel={this.hideModel}
           />
        </Modal>
      </div>
    );
  }
}