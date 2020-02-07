import React, { Component } from 'react';
import { Form, Tree, Row, Col, Button, Message } from 'antd';
import ServiceApi from '../../../apiprefix';
import {
  PartyTaskList, //党建任务列表
} from '../../URL';
import { postService, GetQueryString, getService } from '../../../myFetch.js';
import { setRecevicer } from '../../../../../redux-root/action';

const TreeNode = Tree.TreeNode;
import { connect } from 'react-redux';
const FormItem = Form.Item;
@connect(
  state => ({
    getTopicId: state.getTopicId,
    getPartyId: state.getPartyId,
    getFormData: state.getFormData,
  }),
  dispatch => ({
    setRecevicer: n => dispatch(setRecevicer(n)),
  })
)
@Form.create()
export default class EditRecevicer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      checkedKeys: [], //选中树节点的key值  "352","1","366","367"
      treeData:[],
      editTaskData: this.props.editTaskData,//编辑时传入的数据
      expandedKeys: [],
      autoExpandParent: false,
      selectedKeys: [],
      checkedKeys2:[],
      isSelect:true,
      isClick:true,
      isBack:true,
    }
  }
  componentDidMount() {
    //页面相关的数据处理
    this.dealData();
  }
  dealData = () => {
    const editTaskData = this.state.editTaskData;
    //编辑时获取到的接收人  用receiver 接收
    let receiver = '';
    if (editTaskData && editTaskData.receiver) {
      receiver = editTaskData.receiver.split(',');
      console.log( receiver)
      this.setState({ checkedKeys: editTaskData.receiver.split(',') })
      this.props.form.resetFields();
      this.props.form.setFieldsValue({ receiverList: receiver });
    }else{
      this.props.form.setFieldsValue({ receiverList: this.state.checkedKeys });
    }


    this.setState({ data: receiver}, () => {
      //为表单设置值
      // this.props.form.setFieldsValue({ receiverList: this.state.checkedKeys });
    });
   
    
    //获取接收人的数据
    getService(ServiceApi + `services/partybuilding/task/get/getReceivers/${editTaskData.topicId}/${editTaskData.upPartyId}`, data => {
      if (data.retCode === 1) { //接口正常返回
        if (data.root.list.length > 0) {
          this.setState({ treeData: data.root.list });
          let allList=data.root.list
            let checkedKeys=[]
            for(let i=0;i<allList.length;i++){
              checkedKeys.push(allList[i].key)
            }
            this.setState({checkedKeys2:checkedKeys})
            // this.props.form.resetFields();
        }
      } else {
        Message.error(data.retMsg);
      }
    });
  }
  onLoadData = (treeNode) => {
    return new Promise((resolve, reject) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }

      let currentKey=treeNode.props.eventKey;
      let topicId = this.state.editTaskData.topicId;
      getService(ServiceApi + `services/partybuilding/task/get/getReceivers/${topicId}/${currentKey}`, data => {
        if (data.retCode === 1 && data.root.list.length > 0) {
          console.log(data.root.list)
          treeNode.props.dataRef.children = data.root.list;
        }
          
        this.setState({
          treeData: [...this.state.treeData],
          //去掉父节点到的渲染
          // checkedKeys
        });
        resolve();
      });
    });
  }
  renderTreeNodes = (data) => {
    console.log(data)
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });
  }
  onCheck = (checkedKeys, e) => {
    console.log('onCheck', checkedKeys);
    if(checkedKeys.length>0){
      this.setState({
        isSelect:true,
        isClick:true,
        isBack:false
      })
    }else{
      this.setState({
        isSelect:false,
        isClick:false,
        isBack:false
      })
    }
    let isChecked = e.checked;//判断是  选中  还是  取消选择
    let currentParentKey = e.node.props.eventKey.split('-')[0];;
    let currentKey = e.node.props.eventKey;
    let isleaf = e.node.props.isLeaf;
    let topicId = this.state.editTaskData.topicId;
    let data = this.state.data;
    if (!isChecked) { //取消选中
      if (!isleaf) {//不是叶子节点
        getService(ServiceApi + `services/partybuilding/task/get/getReceivers/${topicId}/${currentParentKey}`, result => {
          console.log('result.root.list', result.root.list);
          if (result.retCode === 1 && result.root.list.length > 0) { //有子节点
            let list = [];
            result.root.list.map((item) => {
              list.push(item.key);
            });
            for (var i = 0; i < list.length; i++) {
              for (var j = 0; j < data.length; j++) {
                if (list[i] == data[j]) {
                  delete data[i];
                }
              }
            }
            this.setState({ data,checkedKeys });
            this.props.form.setFieldsValue({ receiverList: checkedKeys });
          }
        });
      } else {
        //当前节点是叶子节点
        data = data.filter((item) => {
          return item != currentKey;
        });
        this.setState({ data,checkedKeys });
        this.props.form.setFieldsValue({ receiverList: checkedKeys });
      }


    } else { //选中
      if (!isleaf) { //不是叶子节点
        getService(ServiceApi + `services/partybuilding/task/get/getReceivers/${topicId}/${currentParentKey}`, result => {
          if (result.retCode === 1 && result.root.list.length > 0) { //有子节点
            let list2 = [];
            result.root.list.map((item) => {
              list2.push(item.key);
            });
            data = Array.from(new Set([...list2, ...data]));
            this.setState({ data ,checkedKeys});
            this.props.form.setFieldsValue({ receiverList: checkedKeys });
          }
        });

      }
      else {  //当前节点是叶子节点
        data = Array.from(new Set([...checkedKeys, ...data]));
        this.setState({ data,checkedKeys });
        this.props.form.setFieldsValue({ receiverList: checkedKeys });
      }
    }
   
  }
  onSelect=(selectedKeys,info)=>{
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  }
  onExpand = (expandedKeys) => {
    console.log('expandedKeys', expandedKeys);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  //节点加载完毕后调用
  onLoad = (loadedKeys) => {
    console.log('loadedKeys', loadedKeys);

  }
  //表单提交事件
  handleSubmit = (e, back) => { //publish:为空，则是 保存并返回  不为空：保存并发布
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      console.log('fieldsValue', fieldsValue);
      if (err) {
        console.log('err', err)
        return;
      }
      console.log('id', this.props.editTaskData.id);
      let values = {
        ...fieldsValue,
        'id': this.props.editTaskData.id,
        'receiverList': this.state.checkedKeys,
      }
      console.log('values', values);
      //保存||保存并发布  调用更新的接口  pushStatus设置为0    pushStatus设置为1
      postService(ServiceApi + 'services/partybuilding/task/update/updateTask', values, data => {
        if (data.retCode === 1) { //增加成功  返回一系列数据，放入redux中
          Message.success('保存成功');

          if (back) {//不为空
            //返回到列表页面
            // location.hash = PartyTaskList
            let pushStatus=this.state.editTaskData.pushStatus
            location.hash = PartyTaskList+`?tabsVale=${pushStatus}`
          }

        }
      });

    });
  }
  selectAll=()=>{
    this.setState({
      isSelect:true,
      isClick:false,
      isBack:false
    })
    let checkedKeys2=this.state.checkedKeys2
    console.log(checkedKeys2)
    this.props.form.setFieldsValue({receiverList:checkedKeys2});
    this.setState({data:checkedKeys2})
    // this.props.setRecevicer({
    //   receiver:checkedKeys2
    // });
  }
  selectNo=()=>{
    this.setState({
      isSelect:false,
      isBack:false
    })
    this.props.form.setFieldsValue({receiverList:[]});
    // this.props.setRecevicer({
    //   receiver:[]
    // });
  }
  //点击取消返回
  backHtml=()=>{
    let pushStatus=this.state.editTaskData.pushStatus
    location.hash = PartyTaskList+`?tabsVale=${pushStatus}`
    console.log(location)
  }
  render() {
    console.log('this.state.treeData', this.state.treeData);
    console.log('this.state.expandedKeys', this.state.expandedKeys)
    const { getFieldDecorator } = this.props.form;  //获取表单中的属性
    const { disabled } = this.props;
    let { editTaskData, expandedKeys, treeData,checkedKeys,isSelect,checkedKeys2,isClick,isBack } = this.state;
    let checkedKeys3=isSelect&&checkedKeys&&treeData.length>0?checkedKeys.length>0&&isClick?checkedKeys:isBack?checkedKeys:checkedKeys2:isSelect?isBack?checkedKeys:checkedKeys2:[]
    console.log(checkedKeys3)
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      // editTaskData&&checkedKeys&&treeData?(
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="接收人"
        >
          {
            getFieldDecorator('receiverList', {

              rules: [
                {
                  type: 'array',
                  required: true,
                  whitespace: true,
                  message: '接收人为必填项',
                },
              ],
            })
              (<Tree
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                // checkedKeys={checkedKeys&&treeData.length>0?checkedKeys:[]}
                checkedKeys={checkedKeys3&&treeData.length>0?checkedKeys3:[]}
                checkable
                onCheck={this.onCheck}
                onExpand={this.onExpand}
                loadData={this.onLoadData}>
                {this.renderTreeNodes(this.state.treeData)}
              </Tree>)
          }
        </FormItem>

        <Row>
          <Col span={3} offset={6}><Button className="resetBtn" onClick={this.backHtml}>{disabled ? '返回' : '取消'}</Button></Col>
          <Col span={3} ><Button  className="queryBtn" onClick={this.selectAll}>全选</Button></Col>
          <Col span={3} ><Button  className="queryBtn" onClick={this.selectNo}>不选</Button></Col>
          <Col span={3}><Button className="resetBtn" onClick={this.handleSubmit} style={{ display: disabled ? 'none' : 'inline-block' }}>保存</Button></Col>
          <Col span={3}><Button className="resetBtn" onClick={(e) => this.handleSubmit(e, 'back')} style={{ display: disabled ? 'none' : 'inline-block' }}>保存并返回</Button></Col>
        </Row>
      </Form>
      // ):null
    );
  }
}