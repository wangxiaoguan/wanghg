import React, { Component } from 'react';
import { Form, Row, Col, InputNumber, Radio, Button, Table, Modal, Input, Message, Upload, Popconfirm, Checkbox} from 'antd';
import './QuestionsSettings.less';
import QuestionModal from './add_modal.js';
import { getService, GetQueryString, postService } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
const RadioGroup = Radio.Group;
const options = [{ label: '是', value: true }, { label: '否', value: false }];
let selectedNum=0;
@Form.create()
export default class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      singleSize:0,
      multipleSize:0,
      singleSizeEDB: 2,
      multipleSizeEDB: 2,
      singleSizeET: 2,
      multipleSizeET: 2,
      totalScore:0,
      detail:{},
      ETSource:[],
      EDBSource:[],
      selectedRowKeys: [],
      modal_visible:false,
      edit_modal:false,
      selectedDBKeys:[],
      selectedETKeys:[],
      examDatabaseId:GetQueryString(location.hash, ['examDatabaseId']).examDatabaseId || '',
      isRadomExam:GetQueryString(location.hash, ['isRadomExam']).isRadomExam,
      edit_detail:{},
      edit_submit_data:[],
      activityId: GetQueryString(location.hash, ['id']).id || '',
      random:0,
      custom:0,
      examDbIds:[],
      deleteT:0,
      selectedETs:[]
    };
  }

  componentDidMount(){
    this.getAllData();
    let examDbIds = this.state.examDbIds;
    let isRadomExam=this.state.isRadomExam;
    if(isRadomExam === "true" && this.state.deleteT===0){
      examDbIds.push(this.state.examDatabaseId);
      this.setState({
        custom:1,
        examDbIds:[],
      });
    }
  }

  getAllData=()=>{
    getService(API_PREFIX + `services/activity/examActivity/activityInfo/${this.state.activityId}`,data=>{
      
      console.log('data1',data)
      if (data.retCode===1) {
        if(data.root.activity){
          let activity = data.root.activity;
          this.props.form.setFieldsValue({
            sscore: activity.sscore,
            mscore: activity.mscore,
            isOptionOrder: activity.isOptionOrder,
            isTopicOrder: activity.isTopicOrder,
            //score: activity.score,
          });
  
          this.setState({ sScore: activity.sscore, mScore: activity.mscore},()=>{
            this.getEDB();
            this.getET();
          });
        }else{
          this.setState({ sScore: 1, mScore: 1},()=>{
            this.getEDB();
            this.getET();
          });
        }
      }
    });
  }

  getEDB=()=>{
    getService(API_PREFIX +`services/activity/examActivity/activityEDB/list/${this.state.activityId}`,data=>{
      console.log('suijidata=>',data)
      if (data.retCode===1) {
        //隐藏自定义
        if (data.root.list.length > 0) {
          this.state.examDbIds.push(data.root.list[0].examDbId)
          this.setState({
            custom:1,
            isRadomExam:true,
          });
          if(this.state.selectedDBKeys.indexOf(data.root.list[0].id) < 0 ){
            this.state.examDatabaseId=data.root.list[0].examDbId;
          }
        }

        console.log('examDatabaseId==>',this.state.examDatabaseId)
        //todo计算单多选
        let source = data.root.list;
        let singleSizeEDB = 0;
        let multipleSizeEDB = 0;
        source&&source.map(item=>{
          singleSizeEDB += item.singleSize;
          multipleSizeEDB += item.multipleSize;
        });
        data.root.list && data.root.list.map((item,index)=>{
          item.sNum = index+1;
        });

        console.log('list==>',data.root.list)
        this.setState({ EDBSource: data.root.list, singleSizeEDB, multipleSizeEDB}, () => {
          this.setForm();
        });
      }else{
        Message.error(data.retMsg);
      }
    });
  }
  getET=()=>{
    getService(API_PREFIX + `services/activity/examActivity/activityET/list/${this.state.activityId}`, data => {
      console.log('data=>',data)
      if (data.retCode === 1) {
        //隐藏随机
        if (data.root.list.length > 0) {
          data.root.list.map((item,index)=>{
            if(this.state.selectedETKeys.indexOf(item.examDbTopicId) < 0 ){
              let selectedETKeys=this.state.selectedETKeys;
              selectedETKeys.push(item.examDbTopicId)
              console.log("sssssssssssss=>",selectedETKeys)
              this.setState({
                selectedETKeys:selectedETKeys,
                random:1,
                custom:0,
                examDatabaseId:'',
                isRadomExam:false,
              })
            }
          })
        }else{
          //自定义删除完判断是否显示随机
          this.setState({
            random:0,
          });
        }
        let source = data.root.list;
        let singleSizeET = 0;
        let multipleSizeET = 0;
        source && source.map(item => {
          if (item.type === 1) {
            singleSizeET = singleSizeET+1;
          } else if (item.type === 2){
            multipleSizeET = multipleSizeET+1;
          }
        });
        data.root.list && data.root.list.map((item,index)=>{
          item.sNum = index+1;
        });
        // this.props.form.setFieldsValue({ singleNum: singleSizeET, multiNum: multipleSizeET });
        this.setState({ ETSource: data.root.list, singleSizeET, multipleSizeET },()=>{
          this.setForm();
        });
      } else {
        Message.error(data.retMsg);
      }
    });
  }
  setForm=()=>{
    let singleSize = this.state.singleSizeEDB + this.state.singleSizeET;
    let multipleSize = this.state.multipleSizeEDB + this.state.multipleSizeET;
    let sScore = this.state.sScore;
    let mScore = this.state.mScore;
    let totalScore = singleSize * sScore + multipleSize*mScore;

    this.props.form.setFieldsValue({
      singleNum: singleSize,
      multiNum: multipleSize,
      score: totalScore,
    });
    this.setState({ singleSize, multipleSize});
    console.log('aaa', singleSize, sScore, multipleSize, mScore, totalScore);
  }

  handleSubmit=e=>{
    const { activityId,examDatabaseId , selectedETKeys,isRadomExam}=this.state;
    this.props.form.validateFields(['sscore', 'singleNum', 'mscore', 'multiNum', 'score', 'isTopicOrder','isOptionOrder'],(err, fieldsValue) => {
      if (!err) {
        let values = { ...fieldsValue};
        // this.state.edit_submit_data    题库信息
        values['id'] = activityId;
        values['isRadomExam'] = isRadomExam;
        
        console.log("examDatabaseId",examDatabaseId)
        if(examDatabaseId.length>0){
          values['examDatabaseId'] = examDatabaseId;
          values['selectedETKeys'] = [];
        }else if(selectedETKeys.length>0){
          values['selectedETKeys'] = selectedETKeys;
          values['examDatabaseId'] = '';
        }else{
          values['examDatabaseId'] = '';
          values['selectedETKeys'] = [];
        }

        console.log('提交结果test', values);

        postService(API_PREFIX + 'services/activity/examActivity/updateExamActivity', values,data=>{
          console.log('data==>',data)
          if (data.retCode===1) {
            Message.success('保存成功!');
            location.hash ='/EventManagement/Examination/List';
            console.log('data1==>',data)
          }else{
            Message.error(data.retMsg);
          }
        });
      }
    });
  }
  editSubmit=e=>{
    const {  edit_detail} = this.state;
    this.props.form.validateFields({},(err, fieldsValue) => {
      if (!err) {
        const values = { ...fieldsValue};
        values['id'] = edit_detail.id;
        values['examDbId'] = edit_detail.examDbId;
        values['activityId'] = this.state.activityId;
        console.log('修改提交结果', values);
        postService(API_PREFIX + 'services/activity/examActivity/updateActivityEDB', values, data => {
          if (data.retCode === 1) {
            Message.success('保存成功!');
            this.modalCancel();
            this.getEDB();
          } else {
            Message.error(data.retMsg);
          }
        });
      }
    });
  }
  modalCancel=()=>{
    this.setState({ modal_visible: false, edit_modal:false });
    //this.getAllData();
    this.getEDB();
    this.getET();
  }
  
  deleteBank=()=>{
    console.log('6666666666')
    let body={
      ids: this.state.selectedDBKeys,
      activityId:this.state.activityId,
    };
    console.log('body=>',body)
    postService(API_PREFIX +'services/activity/examActivity/deleteActivityEDB',body,data=>{
      if (data.retCode===1) {
        Message.success('删除成功!');
        this.getEDB();
      }
    });
    this.setState({
      examDbIds:[],
      deleteT:1,
      custom:0,
      selectedDBKeys:[],
    })
  }

  deleteTopic=()=>{
    let body = {
      ids: this.state.selectedETs,
    };
    postService(API_PREFIX + 'services/activity/examActivity/deleteActivityET', body, data => {
      console.log('shangchudata=>',data)
      console.log('data.root=>',typeof(data.root))
      if (data.retCode === 1) {
        Message.success('删除成功!');
        this.setState({
          selectedETs:[]  
        })
        this.getET();
      }
    });

    console.log('')
  }
  handleChange=(value,key)=>{
    if (key==='sscore') {
      console.log('value',value);
      this.setState({ sScore:value},()=>{
        this.setForm();
      });
    }else if (key==='mscore') {
      console.log('value', value);
      this.setState({ mScore: value }, () => {
        this.setForm();
      });
    }
  }

  getInputValue = (value,key) => {
    console.log(value)
    const { edit_detail} = this.state;
    if(key==='singleSize'){
      edit_detail.singleSize=value;
    }else{
      edit_detail.multipleSize=value;
    }

    this.setState({ edit_detail});
    
  };
  
  render() {
    const formItemLayout = { labelCol: { span: 12 }, wrapperCol: { span: 12 } };
    const editModal = { labelCol: { span: 6 }, wrapperCol: { span: 12 } };
    const { form: { getFieldDecorator }} = this.props;
    const { selectedDBKeys, selectedETKeys, edit_detail, EDBSource, ETSource , examDbIds} = this.state;

    // console.log('edit_detail==>',edit_detail)
    // if(edit_detail.activityId!==undefined){
    //   edit_detail.maxsingleSize=edit_detail.maxsingleSize;
    //   edit_detail.maxmultipleSize=edit_detail.maxmultipleSize;
    // }
    const rowSelectionET = {
      selectedETKeys,
      onChange: (selectedETKeys, selectedRows) => {
        console.log('selectedETKeys',selectedETKeys)
        this.setState({ selectedETs:selectedETKeys,isRadomExam:false });
        // this.state.examEtIds = [record.examDbId];
      },
      onSelect:(record, selected ) => {
        console.log('record=>',record)
        if(selected){
          // this.setState({random:1});
          selectedNum+=1
        }
        else{
          selectedNum-=1

          console.log("selectedNum-",selectedNum)
          if(selectedNum===0){
            // this.setState({random:0});
          }else{
            this.setState({random:1});
          }
        }
      },
      onSelectAll:( selected, selectedRows, changeRows ) => {
        if(selected){
          this.setState({random:1});
        }
      },
    };
    const uploadProps = {
      name: 'file',
      action: API_PREFIX + `services/activity/import/activityExamTopics?activityId=${this.state.activityId}`,
      accept: 'application/vnd.ms-excel',
      multiple: false,
      data: null,
      showUploadList: false,
      onChange:(info)=> {
        if (info.file.status === 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          if (info.file.response.retCode===1) {
            Message.success('导入题目成功！');
            this.getET();
          }else{
            Message.error('导入题目失败！');
          }
        } if (info.file.status === 'error') {
          Message.error('导入题目失败！');
        }
      },
    };
    console.log('examDatabaseId=>',this.state.examDatabaseId)
    const columns = [
      {
        dateIndex:'',
        key:'radio',
        render:(text, record)=>{
          return (
            <Radio
              onClick={(event)=>{
                console.log('event=>',event)
                //如果已选的key包含当前record,则取消
                let index = this.state.selectedDBKeys.indexOf(record.id);
                if(this.state.selectedDBKeys && index >= 0){
                  this.state.selectedDBKeys = [];
                  // this.state.examDbIds = [];
                  // this.state.examDatabaseId = '';
                  this.setState({custom:1,isRadomExam:true});
                }
                else{
                  this.state.selectedDBKeys = [record.id];
                  this.state.examDatabaseId = record.examDbId;
                  this.state.examDbIds = [record.examDbId];
                  this.setState({custom:1,isRadomExam:true});
                }
                
                this.forceUpdate();
              }}
              checked={this.state.selectedDBKeys && this.state.selectedDBKeys.indexOf(record.id)>=0} 
            />
          );
        },
      },
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '题库名称',
        dataIndex: 'examDbName',
        key: 'examDbName',
      },
      {
        title: '单选题个数',
        dataIndex: 'singleSize',
        key: 'singleSize',
      },
      {
        title: '多选题个数',
        dataIndex: 'multipleSize',
        key: 'multipleSize',
      },
      {
        title: '显示顺序',
        dataIndex: 'showIndex',
        key: 'showIndex',
      },
      {
        title: '操作',
        key: 'x',
        render: (text, record, index) => (
          <a onClick={() => this.setState({ edit_modal: true, edit_detail: record })}>编辑</a>
        ),
      },
    ];

    const questionColumn = [
      {
        title: '序号',
        key: 'sNum',
        dataIndex: 'sNum',
      },
      {
        title: '题目名称',
        dataIndex: 'examDbTopicName',
        key: 'examDbTopicName',
      },
      {
        title: '题目类型',
        dataIndex: 'type',
        key: 'type',
        render:(text,record)=>{
          if (record.type===1) {
            return '单选';
          }else if (record.type===2) {
            return '多选';
          }
        },
      },
      {
        title: '显示顺序',
        dataIndex: 'showIndex',
        key: 'showIndex',
      },
      {
        title: '操作',
        key: 'x',
        render: (text, record, index) => {
          return <div>
            <a onClick={() => (location.hash = `/EventManagement/Examination/EditCustomQuestion?isEdit=true&id=${record.id}&activityId=${this.state.activityId}&topicId=${record.examDbTopicId}`)}>编辑</a>
          </div>;
        },
      },
    ];
    return <div className="question-main">
      <div className="question-top">
        <div className="question-top-container">
          <span className="question-title" style={{ marginLeft: '18px' }}>
              基本设置
          </span>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={6}>
                <Form.Item {...formItemLayout} label="每个单选题分数">
                  {getFieldDecorator('sscore', {
                    initialValue: 0,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<InputNumber min={0} onChange={value => this.handleChange(value, 'sscore')} />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item {...formItemLayout} label="单选题总个数">
                  {getFieldDecorator('singleNum', {
                    initialValue: 0,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<InputNumber min={0} disabled />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item {...formItemLayout} label="题目顺序是否固定">
                  {getFieldDecorator('isTopicOrder', {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                    initialValue: true,
                  })(<RadioGroup options={options} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item {...formItemLayout} label="每个多选题分数">
                  {getFieldDecorator('mscore', {
                    initialValue: 0,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<InputNumber min={0} onChange={value => this.handleChange(value, 'mscore')} />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item {...formItemLayout} label="多选题总个数">
                  {getFieldDecorator('multiNum', {
                    initialValue: 0,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<InputNumber min={0} disabled />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item {...formItemLayout} label="选项顺序是否固定">
                  {getFieldDecorator('isOptionOrder', {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                    initialValue: true,
                  })(<RadioGroup options={options} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item {...formItemLayout} label="总分数">
                  {getFieldDecorator('score', {
                    initialValue: 0,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<InputNumber min={0} disabled />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      
      {this.state.random===0? 
        <div className="question-middle">
          <div className="random-question">
            <span className="question-title" style={{ marginLeft: '18px' }}>
                随机题库设置
            </span>
            <br />
            <span>
              <Button disabled={ EDBSource.length > 0} style={{ marginBottom: '10px', marginLeft: '16px' }} className="queryBtn" onClick={() => this.setState(
                { modal_visible: true }
              )}>
                  添加题库
              </Button>
              <Popconfirm title="确定删除?" onConfirm={this.deleteBank}>
                <Button className="deleteBtn" disabled={selectedDBKeys.length === 0}>
                    删除
                </Button>
              </Popconfirm>
            </span>
            <Table rowKey="id" bordered columns={columns} dataSource={EDBSource} pagination={false}/>
          </div>
        </div>:null}

      
      
      <div className="question-bottom">
        {this.state.custom===0?
          <div className="random-question">
            <span className="question-title" style={{ marginLeft: '18px' }}>
                自定义题目设置
            </span>
            <br />
            <Button className="queryBtn" style={{ marginBottom: '10px', marginLeft: '16px' }} onClick={() => (location.hash = `/EventManagement/Examination/AddCustomQuestion?isEdit=false&activityId=${this.state.activityId}`)}>
                添加题目
            </Button>
            <Popconfirm title="确定删除?" onConfirm={this.deleteTopic}>
              <Button className="deleteBtn" disabled={this.state.selectedETs.length === 0}>
                  删除
              </Button>
            </Popconfirm>
            <Upload {...uploadProps}>
              <Button className="resetBtn">批量导入题目</Button>
            </Upload>
            <Table rowKey="examDbTopicId" bordered columns={questionColumn} dataSource={ETSource} pagination={false} rowSelection={rowSelectionET} />
          </div>:null}
        

        <Row style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button className="resetBtn" onClick={() => history.back()}>
              取消
          </Button>
          <Button className="resetBtn">预览</Button>
          <Button className="queryBtn" onClick={this.handleSubmit}>
              保存
          </Button>
        </Row>
      </div>
      
      <Modal className="modal" title="添加题库" width={950} maskClosable={false} visible={this.state.modal_visible} footer={null} onCancel={this.modalCancel} key={'questionBank'} destroyOnClose={true}>
        <QuestionModal activityId={this.state.activityId} onCancel={this.modalCancel} />
      </Modal>
      <Modal className="modal" title="编辑题库" width={800} maskClosable={false} visible={this.state.edit_modal} footer={null} onCancel={this.modalCancel} key={'editQuestionBank'} destroyOnClose={true}>
        <Form onSubmit={this.editSubmit}>
          <Form.Item {...editModal} label="题库名称">
            {getFieldDecorator('examDbName', {
              initialValue: edit_detail.examDbName,
              rules: [
                {
                  required: true,
                  message: '必填项',
                },
              ],
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item {...editModal} label="单选题个数">
            {getFieldDecorator('singleSize', {
              initialValue: edit_detail.singleSize,
              rules: [
                {
                  required: true,
                  message: '必填项',
                },
              ],
            })(<InputNumber min={0} max={edit_detail.singleSelectCount} onChange={e => { this.getInputValue(e,'singleSize'); }}/>)}
          </Form.Item>
          <Form.Item {...editModal} label="多选题个数">
            {getFieldDecorator('multipleSize', {
              initialValue: edit_detail.multipleSize,
              rules: [
                {
                  required: true,
                  message: '必填项',
                },
              ],
            })(<InputNumber min={0} max={edit_detail.multiSelectCount} onChange={e => { this.getInputValue(e,'multipleSize'); }}/>)}
          </Form.Item>
          <Form.Item {...editModal} label="显示顺序">
            {getFieldDecorator('showIndex', {
              initialValue: edit_detail.showIndex,
              rules: [
                {
                  required: true,
                  message: '必填项',
                },
              ],
            })(<InputNumber min={0} />)}
          </Form.Item>
          <Button style={{marginLeft:"320px"}} className="resetBtn" onClick={() => this.setState({ edit_modal: false })}>
              取消
          </Button>
          <Button className="queryBtn" onClick={this.editSubmit}>确定</Button>
        </Form>
      </Modal>
    </div>;
  }
}