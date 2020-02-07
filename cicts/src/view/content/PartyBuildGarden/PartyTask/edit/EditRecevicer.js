import React, { Component } from 'react';
import { Form, Tree, Row, Col, Button, message,Spin } from 'antd';
import API_PREFIX from '../../../apiprefix';
import {
  PartyTaskList, //党建任务列表
} from '../../URL';
import { postService, GetQueryString, getService } from '../../../myFetch.js';
import { setRecevicer } from '../../../../../redux-root/action/attach/attach';

const TreeNode = Tree.TreeNode;
import { connect } from 'react-redux';
const FormItem = Form.Item;
let checkedKeySD=[]
@connect(
  state => ({
    getTopicId: state.attach.getTopicId,
    getPartyId: state.attach.getPartyId,
    getFormData: state.attach.getFormData,
  }),
  dispatch => ({
    setRecevicer: n => dispatch(setRecevicer(n)),
  })
)
@Form.create()
export default class EditRecevicer extends Component {
  constructor(props) {
    super(props);
    let activeKey = GetQueryString(location.hash, ['activeKey']).activeKey || '0';
    this.state = {
      data: [],
      checkedKeys: [], //选中树节点的key值
      treeData:[], //数结构数据
      editTaskData: this.props.editTaskData,//编辑时传入的数据
      expandedKeys: [],
      autoExpandParent: false,
      selectedKeys: [],
      partyId:this.props.editTaskData.partyId,
      loading: false,
      activeKey:String(activeKey),
      level:sessionStorage.getItem('level'),                  //党支部的等级
      topicId:sessionStorage.getItem('topicId'),              //三会一课
      receiverJson: this.props.editTaskData && this.props.editTaskData.receiverJson ? this.props.editTaskData.receiverJson : '',
      jobId: this.props.editTaskData && this.props.editTaskData.jobId ? this.props.editTaskData.jobId : '',
    }
    this.checkedAll = [] //树数据所有的key值
    this.receiverJsonAll = []
  }
  checkedAllKeys(allList){
    let that=this;
    allList.map(v=>{
      if(v.children && v.children.length){
        that.checkedAllKeys(v.children)
      }else{
        this.checkedAll.push(v.key)
      }
    })
    // return this.checkedAll
  }

  handleTreeData = (data, flag) => {
    data.map(item => {
      item.key = item.isPartyUser ? `${item.partyId}-${item.userId}` : `${item.partyId}`
      item.title = item.isPartyUser ? (item.postName ? `${item.userName}-${item.postName}` : item.userName) : item.partyName
      item.isLeaf = flag ? true : item.isPartyUser ? true : false
      if(item.children) {
        this.handleTreeData(item.children)
      }
    })
  }
  // componentDidUpdate(){
  //   let partyId = sessionStorage.getItem('partyId');
  //   let oldUpPartyId = sessionStorage.getItem('oldUpPartyId')
  //   if(partyId!=oldUpPartyId){
  //     sessionStorage.setItem('oldUpPartyId',partyId)
  //     let topicId=sessionStorage.getItem('topicId')
  //     // this.setState({ loading: true });
  //     getService(API_PREFIX + `services/web/party/partyOrganization/getTaskReceiver/${topicId}/${partyId}`, data => {
  //       if (data.status === 1) { //接口正常返回
  //         console.log(data)
  //         this.setState({partyId:partyId})
  //         if (data.root.list.length > 0) {

  //             let treeData=data.root.object
  //             this.handleTreeData(treeData)
  //             this.checkedAllKeys(treeData)
  //             // let checkedAll = this.checkedAllKeys(treeData)
  //             this.setState({treeData});
  //             return false
  //         }
  //         return false
  //         // this.setState({ loading: false });
  //       } else {
  //         message.error(data.errorMsg);
  //         sessionStorage.setItem('oldUpPartyId',partyId)
  //         this.setState({partyId:data.root.list.partyId})
  //         // this.setState({ loading: false });
  //       }
  //     });
  //   }
  // }
  componentDidMount() {
    //页面相关的数据处理
    this.dealData();
    this.props.onRef(this)
    //编辑时获取到的群组，用visualGroup接收
    // const editTaskData = this.state.editTaskData;
  }
  dealData = () => {
    let that=this
    this.setState({ loading: true, });
    console.log('我故为哦给我拍个Joe就跟我讲铺盖卷儿我i据我估计哦二jog', this.props.getFormData)
    const editTaskData = this.state.editTaskData;
    let topicId = this.props.getTopicId
    let partyId = this.props.getPartyId
    this.receiverJsonAll = []
    this.checkedAll = []
    //获取接收人的数据  GET /partybuilding/task/get/getReceiversSame/{topicId}/{partyId}
    getService(API_PREFIX + `services/web/party/partyOrganization/getTaskReceiver/${topicId}/${partyId}`, data => {
      if (data.status === 1) { //接口正常返回
        this.setState({ loading: false, });
        let treeData = []
        if(data.root.object && Array.isArray(data.root.object)) {
          treeData = data.root.object
          this.handleTreeData(treeData, true)
        }else if(data.root.object && data.root.object.root) {
          let rootNode = data.root.object.root
          if(data.root.object.obj) {
            rootNode.children = data.root.object.obj
          }
          treeData.push(rootNode)
          this.handleTreeData(treeData, false)
        }
        this.checkedAllKeys(treeData)
        // let checkedAll = this.checkedAllKeys(treeData)
        treeData.forEach(item => {
          if(!item.isPartyUser) {
            this.receiverJsonAll.push({partyId:item.partyId,partyName:item.partyName,userId:'-1',userName:'',isPartyUser: false})
          }else {
            let name = item.userName
            if(name && name.indexOf('_') > -1) {
              name = name.split('_')[0]
            }
            this.receiverJsonAll.push({partyId:item.partyId,partyName:item.partyName,userId:item.userId,userName:name,isPartyUser: true})
          }
        })
        this.setState({treeData});
        let receiverList = []
        if(editTaskData && editTaskData.receiverJson) {
          let receiverJson = JSON.parse(editTaskData.receiverJson)
          receiverList = receiverJson.map(item => {
              if(item.userId != -1 && item.userName) {
                  return `${item.partyId}-${item.userId}`
              }else {
                  return `${item.partyId}`
              }
          })  
        }
        if(receiverList.length >0) {
          this.setState({checkedKeys: receiverList, receiverJson: editTaskData.receiverJson})
          this.props.form.setFieldsValue({ receiverList: receiverList });
        }else {
            this.props.form.setFieldsValue({ receiverList: this.state.checkedKeys });
        }

        // if (data.root.object.length > 0) {
        //     let treeData=data.root.object
        //     this.handleTreeData(treeData)
        //     this.checkedAllKeys(treeData)
        //     treeData.forEach(item => {
        //       if(!item.userId && !item.userName) {
        //         this.receiverJsonAll.push({partyId:item.partyId,partyName:item.partyName,userId:'-1',userName:''})
        //       }else {
        //         let name = item.userName
        //         if(name && name.indexOf('_') > -1) {
        //           name = name.split('_')[0]
        //         }
        //         this.receiverJsonAll.push({partyId:item.partyId,partyName:item.partyName,userId:item.userId,userName:name,isPartyUser: true})
        //       }
        //     })
        //     // let checkedAll = this.checkedAllKeys(treeData)
        //     this.setState({treeData});
        //     let receiverList = []
        //     if(editTaskData && editTaskData.receiverJson) {
        //       let receiverJson = JSON.parse(editTaskData.receiverJson)
        //       receiverList = receiverJson.map(item => {
        //           if(item.userId != -1 && item.userName) {
        //               return `${item.partyId}-${item.userId}`
        //           }else {
        //               return `${item.partyId}`
        //           }
        //       })  
        //     }
        //     if(receiverList.length >0) {
        //       this.setState({checkedKeys: receiverList, receiverJson: editTaskData.receiverJson})
        //       this.props.form.setFieldsValue({ receiverList: receiverList });
        //     }else {
        //         this.props.form.setFieldsValue({ receiverList: this.state.checkedKeys });
        //     }
        // }
      } else {
        Message.error(data.errorMsg);
        this.setState({loading:false})
      }
    });
  }

  onLoadData = (treeNode) => {
    return new Promise((resolve, reject) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      let topicId = this.props.getTopicId
      let currentKey=treeNode.props.dataRef.key.split('-')[0];
      getService(API_PREFIX + `services/web/party/partyOrganization/getTaskReceiver/${topicId}/${currentKey}`, data => {
        if(data.status===1&&data.root.object&&data.root.object.obj.length>0){
          console.log(data.root.object.obj)
          this.handleTreeData(data.root.object.obj, false)
          treeNode.props.dataRef.children = data.root.object.obj;
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
          <TreeNode title={item.title} key={item.key} dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.title} key={item.key} {...item} dataRef={item} />;
    });
  }
  onCheck = (checkedKeys, info) => {
    console.log('给就欧文机构我就哦感觉我就哦', info);
    let arr = []
    let userNodes = [], partyNodes = [], result = [], repeatParty = [],repeatUser = [];
    info.checkedNodes.forEach(v => {
      if(v.key && v.key.indexOf('-') > -1) {
        userNodes.push(v)
      }else {
        partyNodes.push(v)
      }
    })
    partyNodes.forEach(val => {
      if(val.props.children) {
        val.props.children.forEach(_v => {
          if(_v.key.indexOf('-') == -1) {
            repeatParty.push(_v.key)
          }else {
            repeatUser.push(_v.key)
          }
        })
      }
    })
    partyNodes.forEach(value => {
      let num = 0
      repeatParty.forEach(z => {
        if(value.key == z) {
          num++
        }
      })
      if(!num) {
        result.push(value)
      }
    })
    userNodes.forEach(value => {
      let num = 0
      repeatUser.forEach(z => {
        if(value.key == z) {
          num++
        }
      })
      if(!num) {
        result.push(value)
      }
    })
    console.log('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', result)
    result.forEach(item => {
      let res = item.props.dataRef
      if(!res.isPartyUser) {
          arr.push({partyId:res.partyId,partyName:res.partyName,userId:'-1',userName:'',isPartyUser: false})
      }else {
        let name = res.userName
        if(name && name.indexOf('_') > -1) {
          name = name.split('_')[0]
        }
        arr.push({partyId:res.partyId,partyName:res.partyName,userId:res.userId,userName:name,isPartyUser: true})
      }
    })
    this.props.form.setFieldsValue({receiverList:checkedKeys});
    this.setState({ checkedKeys, receiverJson: JSON.stringify(arr) });
    this.props.setRecevicer({
      receiver:checkedKeys
    });
  }
  onExpand = (expandedKeys) => {
    console.log('expandedKeys', expandedKeys);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  //表单提交事件
  handleSubmit = (e, back) => { //publish:为空，则是 保存并返回  不为空：保存并发布
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      console.log(this.state.checkedKeys)
      if (err) {
        console.log('err', err)
        return;
      }

      let values = {
        ...this.props.getFormData,
        'id': this.props.editTaskData.id,
        'receiverJson': this.state.receiverJson,
        'pushStatus': this.state.activeKey,
        // 'receiverList': this.getUniq(this.getArrEqual(fieldsValue.receiverList,receiverListCheckedKeys))
      }
      console.log('values', values);
      let jobId = this.state.jobId
      //保存||保存并发布  调用更新的接口  pushStatus设置为0    pushStatus设置为1
      postService(API_PREFIX + 'services/web/party/task/update', values, data => {
        if (data.status === 1) { //增加成功  返回一系列数据，放入redux中
          message.success('保存成功');
          if(values.isTimed) {
            this.timePush(values)
          }
          if(jobId && !values.isTimed) {
            postService(API_PREFIX + `services/web/system/taskParam/delete/${jobId}`,{},data=>{
              if(data.status === 1){
                console.log('取消定时发布成功');
                postService(API_PREFIX + `services/web/party/task/updateTaskJobId`,{id: values.id, jobId: '',}, bindData => {
                  if (bindData.status !== 1) {
                    message.error(bindData.errorMsg);
                  }
                });
              }
            });
          }
          if (back) {//不为空
            //返回到列表页面
            // location.hash = PartyTaskList
            let pushStatus=this.props.editTaskData.pushStatus
            location.hash = PartyTaskList+`?id=${this.state.activeKey}`
          }

        }else {
          message.error(data.errorMsg)
        }
      });

    });
  }
  //定时发布相关
  timePush = (values) => {
    let body = {
      name: '党建任务定时发布任务',
      type: 43,
      queryType: 'post',
      queryUrl: API_PREFIX + `services/web/party/task/publish/${values.id}`,
      queryValue: JSON.stringify({}),
      runTime: values.timedDate,
      queryContentType: 'application/json',
    };
    if(this.state.jobId) {
      body.id = this.state.jobId
    }
    postService(API_PREFIX + `services/web/system/taskParam/${this.state.jobId ? 'update' : 'add'}`, body, timeData => {
      if (timeData.status === 1) {
        message.success(`保存成功！将于${values.timedDate}定时发布`)
        let jobId = timeData.root.object.id;
        this.setState({jobId,})
        postService(API_PREFIX + `services/web/party/task/updateTaskJobId`,{id: values.id, jobId,}, bindData => {
          if (bindData.status !== 1) {
            message.error(bindData.errorMsg);
          }
        });
      } else {
        message.error(timeData.errorMsg);
      }
    });

  }
  selectAll=()=>{
    console.log('和你们两个泡泡共就哦时间哦给就偶是就哦加哦撒娇', this.receiverJsonAll)
    this.setState({
      checkedKeys: this.checkedAll, 
      receiverJson: JSON.stringify(this.receiverJsonAll)
    })
    this.props.form.setFieldsValue({receiverList: this.checkedAll});
    this.props.setRecevicer({
      receiver:this.checkedAll
    });
  }
  selectNo=()=>{
    this.setState({
      checkedKeys: [],
      receiverJson: '',
    })
    this.props.form.setFieldsValue({receiverList:[]});
    this.props.setRecevicer({
      receiver:[]
    });
  }
  //点击取消返回
  backHtml=(flag)=>{
    if(flag) {
      location.hash = PartyTaskList+`?id=${this.state.activeKey}`
    }else {
      this.props.prev()
    }
  }
  render() {
    console.log(this.props,this.state);
    const { getFieldDecorator } = this.props.form;  //获取表单中的属性
    const { disabled } = this.props;
    let { expandedKeys, treeData,checkedKeys} = this.state;
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
      <Form onSubmit={this.handleSubmit}>
        <Spin spinning={this.state.loading}>
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
                  expandedKeys={expandedKeys}
                  autoExpandParent={this.state.autoExpandParent}
                  disabled={disabled}
                  checkedKeys={checkedKeys}
                  checkable
                  onCheck={this.onCheck}
                  onExpand={this.onExpand}
                  loadData={this.onLoadData}
                  >
                  {this.renderTreeNodes(treeData)}
                </Tree>)
            }
          </FormItem>

          <Row>
            <Col span={3} offset={6}><Button className="resetBtn" onClick={() => this.backHtml(disabled)}>{disabled ? '返回' : '上一步'}</Button></Col>
            <Col span={3} ><Button  className="queryBtn" disabled={disabled} onClick={this.selectAll}>全选</Button></Col>
            <Col span={3} ><Button  className="queryBtn" disabled={disabled} onClick={this.selectNo}>不选</Button></Col>
            <Col span={3}><Button className="resetBtn" onClick={this.handleSubmit} style={{ display: disabled ? 'none' : 'inline-block' }}>保存</Button></Col>
            <Col span={3}><Button className="resetBtn" onClick={(e) => this.handleSubmit(e, 'back')} style={{ display: disabled ? 'none' : 'inline-block' }}>保存并返回</Button></Col>
          </Row>
        </Spin>
      </Form>
      // ):null
    );
  }
}