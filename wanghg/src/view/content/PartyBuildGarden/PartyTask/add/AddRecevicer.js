import React, { Component } from 'react';
import { Form, Tree , Row, Col,Button,Message} from 'antd';
import API_PREFIX from '../../../apiprefix';
import {PartyTaskList, //党建任务列表
} from '../../URL';
import {postService,GetQueryString,getService } from '../../../myFetch.js';
import {setRecevicer} from '../../../../../redux-root/action/attach/attach';

const TreeNode = Tree.TreeNode;
import {connect} from 'react-redux';
const FormItem = Form.Item;
@connect(
    state => ({
      getTopicId:state.attach.getTopicId,
      getPartyId:state.attach.getPartyId,
      getFormData:state.attach.getFormData,
    }),
    dispatch => ({
      setRecevicer:n=>dispatch(setRecevicer(n)),
    })
)
@Form.create()
export default class AddRecevicer extends  Component {
  constructor(props){
    super(props);
    this.state={
      checkedKeys:[], //选中树节点的key值
      treeData: [],
      checkedKeys2:[],
      isSelect:false,
      isClick:false,
      clickBtn:false
    }
  }
  componentDidMount(){
    //页面相关的数据处理
    this.dealData();
  }
  dealData=()=>{
    //数据回传 做处理   1、获取父组件传入的数据flowData；2、取得里面的receiver 3、若receiver为空，则不回传，否则回传（为checkedKeys设置值）
    console.log('receiver-this.props.flowData',this.props.flowData);
    if(this.props.flowData&&this.props.flowData.receiver){
      let receiver=this.props.flowData.receiver;
      console.log('receiver',receiver);
        this.setState({checkedKeys:receiver},()=>{
          this.props.form.setFieldsValue({receiverList:this.state.checkedKeys});
        });
    }
    //获取 第一步 放入缓存中的 topicId  和partyId
    // let topicId=this.props.getTopicId;
    // let partyId=this.props.getPartyId;
    let topicId=sessionStorage.getItem('topicId')
    let partyId=sessionStorage.getItem('partyId')
    console.log('topicId',topicId,'partyId',partyId);
    //获取接收人的数据
    getService(API_PREFIX+`services/partybuilding/task/get/getReceivers/${topicId}/${partyId}`,data=>{
        if(data.retCode===1){ //接口正常返回
          if(data.root.list.length>0){
            this.setState({treeData:data.root.list});
            let allList=data.root.list
            let checkedKeys=[]
            for(let i=0;i<allList.length;i++){
              checkedKeys.push(allList[i].key)
            }
            this.setState({checkedKeys2:checkedKeys})
          }
        }else{
          Message.error(data.retMsg);
        }
    });
  }
  onLoadData = (treeNode) => {
    console.log('treeNode',treeNode);
    let currentKey=treeNode.props.dataRef.key.split('-')[0];
    console.log('treeNode2',currentKey);
    return new Promise((resolve, reject) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      let topicId=sessionStorage.getItem('topicId')
      getService(API_PREFIX+`services/partybuilding/task/get/getReceivers/${topicId}/${currentKey}`,data=>{
        if(data.retCode===1&&data.root.list.length>0){
          console.log(data.root.list)
          treeNode.props.dataRef.children = data.root.list;
        }
        this.setState({
          treeData: [...this.state.treeData],
        });
        resolve();
      });
    });
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });
  }
  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    if(checkedKeys.length>0){
      this.setState({
        isSelect:true,
        isClick:true
      })
    }else{
      this.setState({
        isSelect:false,
        isClick:false
      })
    }
    this.props.form.setFieldsValue({receiverList:checkedKeys});
    this.setState({ checkedKeys });
    this.props.setRecevicer({
      receiver:checkedKeys
    });
  }
  //表单提交事件
  handleSubmit=(e,publish)=>{ //publish:为空，则是 保存并返回  不为空：保存并发布
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      console.log('fieldsValue', fieldsValue);
      if (err) {
        console.log('err', err)
        return;
      }
      this.setState({clickBtn:true})
      console.log('id',this.props.getFormData.id);
      let values={
          ...fieldsValue,
        'id':this.props.getFormData.id,
        'pushStatus':publish?1:0,
      }
      //保存||保存并发布  调用更新的接口  pushStatus设置为0    pushStatus设置为1
      postService(API_PREFIX+'services/partybuilding/task/update/updateTask',values,data=> {
        if (data.retCode === 1) { //增加成功  返回一系列数据，放入redux中
          Message.success('保存成功');
          if(publish){//保存并发布
            let body={
              ids:[values.id]
            }
            postService(API_PREFIX+`services/partybuilding/task/update/updateTasksOnline`,body,data=>{
              if (data.retCode ===1) {
                Message.success("发布成功!");
              }
              else{
                Message.error(data.retMsg);
              }
            });
          }
          //返回到列表页面
          location.hash = PartyTaskList+`?tabsVale=${publish?1:0}`
        }else{
          Message.error(data.retMsg);
        }
      });

    });
  }  
  selectAll=()=>{
    this.setState({
      isSelect:true,
      isClick:false
    })
    let checkedKeys2=this.state.checkedKeys2
    this.props.form.setFieldsValue({receiverList:checkedKeys2});
    this.props.setRecevicer({
      receiver:checkedKeys2
    });
  }
  selectNo=()=>{
    this.setState({
      isSelect:false
    })
    this.props.form.setFieldsValue({receiverList:[]});
    this.props.setRecevicer({
      receiver:[]
    });
  }
  render(){
    console.log('this.state.treeData',this.state.treeData);

    const {getFieldDecorator}=this.props.form;  //获取表单中的属性
    const {treeData,checkedKeys,isSelect,checkedKeys2,isClick,clickBtn}=this.state

    const {flowData}=this.props;
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
    return (
        <Form  onSubmit={this.handleSubmit}>
          <FormItem
              {...formItemLayout}
              label="接收人"
          >
            {
              getFieldDecorator('receiverList',{
                rules: [
                  {
                    type:'array',
                    required:true ,
                    whitespace: true,
                    message: '接收人为必填项',
                  },
                ],initialValue:''
              })
              ( <Tree
                  // checkedKeys={this.state.checkedKeys}
                  checkedKeys={isSelect&&checkedKeys&&treeData.length>0?checkedKeys.length>0&&isClick?checkedKeys:checkedKeys2:isSelect?checkedKeys2:[]}
                  checkable
                  onCheck={this.onCheck}
                  loadData={this.onLoadData}>
                {this.renderTreeNodes(this.state.treeData)}
              </Tree>)
            }
          </FormItem>

          <Row>
            <Col  span={3}  offset={6}><Button  className="resetBtn" onClick={this.props.prev}>上一步</Button></Col>
            <Col  span={3} ><Button  className="queryBtn" onClick={this.selectAll}>全选</Button></Col>
            <Col  span={3} ><Button  className="queryBtn" onClick={this.selectNo}>不选</Button></Col>
            <Col  span={3}><Button  className="resetBtn" disabled={clickBtn} onClick={this.handleSubmit}>保存并返回</Button></Col>
            <Col  span={3}><Button  className="resetBtn" disabled={clickBtn} onClick={(e)=>this.handleSubmit(e,'publish')}>保存并发布</Button></Col>
          </Row>
        </Form>
    );
  }
}