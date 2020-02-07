import React, { Component } from 'react';
import {Button,message,Form,Popconfirm,Modal,Divider,Spin,Table,Input,InputNumber} from 'antd';
import {postService,getService,GetQueryString} from '../../myFetch';
import {pageJummps} from '../PageJumps';
import API_PREFIX from '../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
import { checkTopic } from '../../../../utils/checkForm';
const FormItem = Form.Item;
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
@Form.create()
class TopicColumn extends Component {
  constructor(props){
    super(props);
    this.state={
      loading: false,
      selectedRowKeys:[],
      modal_visible:false,
      newsId:GetQueryString(location.hash, ['newsId']).newsId ||0,
      type:GetQueryString(location.hash, ['type']).type || 'department',
      currentPage:1,
      pageSize:10,
      sortId:'',
      title:'',
      visible:false,
    }
  }
  componentDidMount(){
    this.dealData(1,10);
  }
  dealData=(currentPage,pageSize)=>{
    this.setState({ loading: true });
    let {type,newsId}=this.state
      getService(API_PREFIX + `${pageJummps.TopicColumnList}/${currentPage}/${pageSize}?Q=specialId=${newsId}`,data=>{
        if(data.status===1){
          const dataSource = data.root&&data.root.list;
          this.setState({dataSource,totalNum:data.root.totalNum,loading:false});
        }else{
          message.error(data.errorMsg);
          this.setState({ loading: false });
        }      
      });
  }

  //编辑
  setcover=(record)=>{
    let {currentPage,pageSize,newsId}=this.state;
    getService(API_PREFIX + `${pageJummps.TopicColumnList}/${currentPage}/${pageSize}?Q=specialId=${newsId}&Q=id=${record.id}`,data=>{
      if(data.status===1){
        const dataSource = data.root&&data.root.list;
        let edData=[]
        dataSource.map(v=>{
          if(v.id===record.id){
            edData.push(v)
          }
        })
        this.setState({programa:edData[0].title,sortId:edData[0].sortId,type:'editor',modal_visible: true,id:record.id});
        this.props.form.setFieldsValue({title:edData[0].title,sortId:edData[0].sortId})
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
    this.setState({ modal_visible: true,type:'add',programa:'', sortId:''})
  }

  handleSubmit=(e)=>{
    e.preventDefault();
    let { programa, sortId,currentPage,pageSize,newsId,type}=this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
     if(err){
       return;
     }
     if(type==='add'){ 
        let body={...fieldsValue,specialId:this.state.newsId}
        postService(API_PREFIX+pageJummps.TopicColumnAdd,body,data=>{
          if(data.status==1){
            message.success('新增成功');
            this.dealData(currentPage,pageSize);
            this.setState({ modal_visible: false })
          }else{
            message.error(data.errorMsg);
          }
        });
      
    }else{
        let body={...fieldsValue,specialId:this.state.newsId,id:this.state.id}
        postService(API_PREFIX+pageJummps.TopicColumnEdit,body,data=>{
          if(data.status==1){
            message.success('编辑成功');
            this.dealData(currentPage,pageSize);
            this.setState({ modal_visible: false })
          }else{
            message.error(data.errorMsg);
          }
        });
     
    }
    })
  }

  deleteData = () => {
    let {currentPage,pageSize}=this.state;
    postService(API_PREFIX + pageJummps.TopicColumnDelete,this.state.selectedRowKeys,data => {
        if (data.status === 1) {
          message.success('删除成功!');
          this.setState({
            selectedRowKeys:[],visible:false
          });
          this.setState({
            currentPage:1,
          },() => {
            this.dealData(currentPage,pageSize);
          });
        } else {
          message.error(data.errorMsg);
          this.setState({
            visible:false
          });
        }
      }
    );
  }
  handleVisibleChange = () => {
    let {selectedRowKeys}=this.state
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
    const {getFieldDecorator}=this.props.form;
    const {totalNum,dataSource,pageSize, currentPage,selectedRowKeys,programa,sortId,type} = this.state;
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

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4},
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const columns=[
      {
        title:'栏目名称',
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
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate',
        width:100,
      }
      ,{
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        width:200,
        render:(data,record)=>(
          <div>
              <a className='operation' onClick={()=>this.setcover(record)}>编辑</a>
              <Divider type="vertical"/>
              <a href={`#/InformationManagement/project/contentmanagement?id=${record.id}&type=${type}`} className='operation'>栏目内容管理</a>
          </div>
        )
      }
    ];

    return (
      <Spin spinning={this.state.loading}>
        <div style={{marginTop:'40px'}}>
            <Button className="queryBtn" type="primary" style={{ order: 1 }} onClick={this.add}>新建</Button>
            <Popconfirm title="确定删除所选项吗？" okText="确定" visible={this.state.visible} onVisibleChange={this.handleVisibleChange} onCancel={this.Popcancel} onConfirm={()=>this.deleteData()} cancelText="取消">
                <Button type="primary" className="deleteBtn"  style={{ order: 1 }} disabled={selectedRowKeys.length <= 0}>
                    删除
                </Button>
            </Popconfirm>
            <Button className="resetBtn" onClick={() => history.back()}>返回</Button>
            <Table style={{marginTop:'20px'}} rowKey={'id'} bordered columns={columns} dataSource={dataSource} pagination={pagination} rowSelection={rowSelection} ></Table>
        </div>
        <Modal
            className="modal"
            title={type==='add'?"新建专题栏目":'编辑专题栏目'}
            maskClosable={false}
            footer={null}
            visible={this.state.modal_visible ? true : false}
            onCancel={() => this.setState({ modal_visible: null })}
            key={'examDbModal'}
            destroyOnClose={true}
          > 
          <Form  onSubmit={this.handleSubmit}>
              <FormItem  label="栏目名称" {...formItemLayout}>
                      {
                        getFieldDecorator('title',{
                          rules: [
                            {
                              required:true ,
                              whitespace: true,
                              validator: (rule, value, callback) => checkTopic(rule, value, callback),
                            },
                          ],
                        })
                        (<Input />)
                      }
                </FormItem>
                <FormItem  label="排序ID" {...formItemLayout} >
                      {
                        getFieldDecorator('sortId',{
                          rules: [
                            {
                              required:true ,
                              whitespace: true,
                              validator: (rule, value, callback) => {
                                if(!value){
                                  callback('排序ID为必填项且不能为0')
                                }else if(value<1){
                                  callback('请勿输入负数')
                                }else if(value>999999999){
                                  callback('数值不得超过999999999')
                                }else if(String(value).indexOf('.')!=-1){
                                  callback('请勿输入小数')
                                }else if(isNaN(value)){
                                  callback('请勿输入非数字')
                                }{
                                  callback()
                                }
                              },
                            },
                          ],
                        })
                        (<InputNumber  style={{width:'100%'}}/>)
                      }
                </FormItem>
                <Button className="resetBtn" style={{marginLeft:"166px",marginTop:"10px"}} onClick={() => this.setState({ modal_visible: null })}>取消</Button>
                <Button className="queryBtn" onClick={this.handleSubmit} loading={this.state.loading}>确定</Button>
          </Form>
          </Modal>   
      </Spin>
    );
  }
}

export default TopicColumn;