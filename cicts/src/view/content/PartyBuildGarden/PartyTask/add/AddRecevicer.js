import React, { Component } from 'react';
import { Form, Tree , Row, Col,Button,message} from 'antd';
import API_PREFIX from '../../../apiprefix';
import {PartyTaskList, //党建任务列表
} from '../../URL';
import {postService,GetQueryString,getService } from '../../../myFetch.js';
import {setRecevicer,setFormData} from '../../../../../redux-root/action/attach/attach';
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
      setFormData:n=>dispatch(setFormData(n)),
    })
)
@Form.create()
export default class AddRecevicer extends  Component {
  constructor(props){
    super(props);
    console.log('888888888888888888888888888888888888888888888')
    this.state={
      checkedKeys:[], //选中树节点的key值
      treeData: [],
      // checkedAll: [], //树数据所有的key值
      clickBtn:false,
      level:sessionStorage.getItem('level'),                  //党支部的等级
      topicId:sessionStorage.getItem('topicId'),              //三会一课
      receiverJson: '',
    }
    this.checkedAll = [] //树数据所有的key值
    this.receiverJsonAll = []
  }
  componentDidMount(){
    //页面相关的数据处理
    this.dealData();
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
  dealData=()=>{
    let that=this
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
    let {level}=this.state

    //获取接收人的数据
    getService(API_PREFIX+`services/web/party/partyOrganization/getTaskReceiver/${topicId}/${partyId}`,data=>{
        if(data.status===1){ //接口正常返回
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

          // if(data.root.object.length>0){
          //   let treeData=data.root.object
          //   this.handleTreeData(treeData)
          //   this.checkedAllKeys(treeData)
          //   // let checkedAll = this.checkedAllKeys(treeData)
          //   treeData.forEach(item => {
          //     if(!item.userId && !item.userName) {
          //       this.receiverJsonAll.push({partyId:item.partyId,partyName:item.partyName,userId:'-1',userName:''})
          //     }else {
          //       let name = item.userName
          //       if(name && name.indexOf('_') > -1) {
          //         name = name.split('_')[0]
          //       }
          //       this.receiverJsonAll.push({partyId:item.partyId,partyName:item.partyName,userId:item.userId,userName:name,isPartyUser: true})
          //     }
          //   })
          //   this.setState({treeData});
          // }
        }else{
          message.error(data.errorMsg);
        }
    });
  }
  onLoadData = (treeNode) => {
    console.log('treeNode',treeNode);
    let currentKey=treeNode.props.dataRef.key.split('-')[0];
    return new Promise((resolve, reject) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      let topicId=sessionStorage.getItem('topicId')
      getService(API_PREFIX+`services/web/party/partyOrganization/getTaskReceiver/${topicId}/${currentKey}`,data=>{
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
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
        );
      }
      return <TreeNode title={item.title} key={item.key} {...item} dataRef={item} />;
    });
  }
  onCheck = (checkedKeys, info) => {
    console.log('欧文i故饿哦i五哦个文件金额给就欧文机构二级哦', checkedKeys, info);
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
    this.props.setRecevicer({receiver:checkedKeys});
    this.props.setFormData({
      ...this.props.getFormData,
      receiverJson: JSON.stringify(arr),
    })
  }
  //表单提交事件
  handleSubmit=(e,publish,back)=>{ //publish:为空，则是 保存并返回  不为空：保存并发布
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      console.log('fieldsValue', fieldsValue);
      if (err) {
        console.log('err', err)
        return;
      }
      this.setState({clickBtn:true})
      let values={
        ...this.props.getFormData,
        // 'receiverJson': this.state.receiverJson,
        // 'id':this.props.getFormData.id,
        // 'pushStatus':0,
      }
      const backAndPush = (values) => {
        if(back){//保存返回
          location.hash = PartyTaskList
        }
        if(values.isTimed && !publish) {
          this.timePush(values)
        }
        if(publish){//保存并发布
          postService(API_PREFIX+`services/web/party/task/publish/${values.id}`,null,data=>{
            if (data.status ===1) {
              message.success("发布成功!");
                //返回到列表页面
                location.hash = PartyTaskList+`?tabsVale=${publish?1:0}`
            }
            else{
              message.error(data.errorMsg);
            }
          });
        }
      }
      if(this.props.getFormData.id) { //上一步后再下一步点击保存的时候调用更新的接口
        postService(API_PREFIX+'services/web/party/task/update',values,data=> {
          if (data.status === 1) {
            message.success('保存成功');
            this.props.setFormData(values)
            backAndPush(values)
          }else{
            message.error(data.errorMsg);
          }
        });
      }else { //新增任务
        postService(API_PREFIX + 'services/web/party/task/insert',values,data=> {
          if (data.status === 1) {
            message.success('新建成功');
            values.id = data.root.object.id
            this.props.setFormData(values)
            backAndPush(values)
          }else{
            message.error(data.errorMsg);
          }
        });
      }



      

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
    postService(API_PREFIX + `services/web/system/taskParam/add`, body, timeData => {
      if (timeData.status === 1) {
        message.success(`保存成功！将于${values.timedDate}定时发布`)
        let jobId = timeData.root.object.id;
        postService(API_PREFIX + `services/web/party/task/updateTaskJobId`,{id: values.id, jobId}, bindData => {
          if (bindData.status !== 1) {
            message.error(bindData.errorMsg);
          }
        }
        );
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
    this.props.setRecevicer({receiver:this.checkedAll});
    this.props.setFormData({
      ...this.props.getFormData,
      receiverJson: JSON.stringify(this.receiverJsonAll),
    })
  }
  selectNo=()=>{
    this.setState({
      checkedKeys: [],
      receiverJson: '',
    })
    this.props.form.setFieldsValue({receiverList:[]});
    this.props.setRecevicer({receiver:[]});
    this.props.setFormData({
      ...this.props.getFormData,
      receiverJson: '',
    })
  }
  render(){
    console.log('this.state.treeData',this.state.treeData);

    const {getFieldDecorator}=this.props.form;  //获取表单中的属性
    const {treeData,checkedKeys,clickBtn,oncheck}=this.state

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
                  checkedKeys={checkedKeys}
                  checkable
                  onCheck={this.onCheck}
                  loadData={this.onLoadData}
                  >
                {this.renderTreeNodes(this.state.treeData)}
              </Tree>)
            }
          </FormItem>

          <Row>
            <Col  span={3}  offset={6}><Button  className="resetBtn" onClick={this.props.prev}>上一步</Button></Col>
            <Col  span={3} ><Button  className="queryBtn" onClick={this.selectAll}>全选</Button></Col>
            <Col  span={3} ><Button  className="queryBtn" onClick={this.selectNo}>不选</Button></Col>
            <Col  span={3}><Button  className="resetBtn" disabled={clickBtn} onClick={(e)=>this.handleSubmit(e,'','back')}>保存并返回</Button></Col>
            <Col  span={3}><Button  className="resetBtn" disabled={clickBtn} onClick={(e)=>this.handleSubmit(e,'publish')}>保存并发布</Button></Col>
          </Row>
        </Form>
    );
  }
}