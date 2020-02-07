import React, { Component } from 'react';
import { Tree, Input, Menu, Modal, Tooltip, message } from 'antd';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
import { connect } from 'react-redux';
import API_PREFIX from '../../content/apiprefix';
import { getService, postService, GetQueryString } from '../../content/myFetch';
let TreeControl = require('../../content/TreeControl');
// import { treeData } from './mockData';
import { setSelectTreeData, setCheckTreeData, setChangeData } from '../../../redux-root/action/tree/tree';
import './TreeList.less';
var treeNum=1
//引用TreeControl函数
const control = new TreeControl('value', 'children');
/**
 * 是否是叶子节点
 * @param {*} selectKey 选择的节点key
 * @param {*} tree 树data
 */
const isleaf = (selectKey, tree, always) => {
  if (always) {
    return true;
  }
  if (selectKey.length <= 0) {
    return;
  }
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    const key = node.key;
    if (key === selectKey[0]) {
      return node.leaf;
    } else if (node.children) {
      if (node.children.some(item => item.key === key)) {
        return node.children.filter(_ => _.key === selectKey)[0].leaf;
      } else if (isleaf(selectKey, node.children)) {
        return isleaf(selectKey, node.children);
      }
    }
  }
  return false;
};
/**
 * 新建节点临时数据,//todo可以把内容当做参数传入
 * @param {*} updateTree 用于区分的index
 */
const newTreeNode = (updateTree, parentId, disabled) => {
  return {
    parentId,
    //id: 'add',
    key: updateTree + 'unsavetreenodekey',
    name: '新建项' + updateTree + '',
    leaf: true,
    value: '',
    disabled,
    organizationState: '1'
  };
};
/**
 * 获取父节点key
 * @param {*} key  当前选择key
 * @param {*} tree 树data
 */
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
/**
 * 包装组件TOOltip
 * @param {*} props 
 */
const WrapperToolTip = (props) => {
  // console.log('props!!!!',props.powers);
  let create = props.powers && props.powers.create;
  let update = props.powers && props.powers.update;
  let deletes = props.powers && props.powers.deletes;
  let deleteList
  if (props.powers && props.powers.deleteList === false) {
    deleteList = props.powers.deleteList;
    // console.log('deleteList', deleteList)
  } else {
    deleteList = true
  }
  //let read = props.powers.read;
  // console.log('-----------', props)
  return <Tooltip
    visible={props.visible}
    title={<Menu mode="inline" onClick={props.onClick}>
      <Menu.Item key="1" style={{ display: create ? (props.disable ? 'none' : 'block') : 'none' }}>增加</Menu.Item>
      <Menu.Item key="2" style={{ display: !create ? 'none' : 'block' }}>增加下级</Menu.Item>
      <Menu.Item key="3" style={{ display: (deleteList === false) ? 'none' : (deletes ? (props.disable ? 'none' : 'block') : 'none') }}>删除</Menu.Item>
      {/* <Menu.Item key="3" >删除</Menu.Item> */}
      <Menu.Item key="4" style={{ display: update ? (props.isContinue ? 'none' : 'block') : 'none' }}>启用</Menu.Item>
      <Menu.Item key="5" style={{ display: update ? (props.isContinue ? 'block' : 'none') : 'none' }}>停用</Menu.Item>
      <Menu.Item key="6" style={{ display: create && update && deletes ? 'none' : 'block' }}>无权操作</Menu.Item>
    </Menu>}
    getPopupContainer={trigger => trigger.parentNode}
    autoAdjustOverflow={true}
    placement="right"
  >
    {props.children}
  </Tooltip>;
};
@connect(
  state => ({
    selectTreeData: state.tree.treeSelectData,
    isCheck: state.tree.treeCheckData.isCheck,
    selectDetail: state.tree.treeSelectData.selectDetail, //yelu 2019-01-15 拉到选择树节点的数据
  }),
  dispatch => ({
    setSelectData: n => dispatch(setSelectTreeData(n)),
    setCheckData: n => dispatch(setCheckTreeData(n)),
    setChangeData: n => dispatch(setChangeData(n)),
  })
)
export default class TreeArr extends Component {
  constructor(props) {
    super(props);
    // console.log('props==>', props)
    this.dataList = [];
    this.state = {
      treeData: this.props.treeData,
      updateTree: 0,
      rightSelectedKeys: '',
      selectedKeys: [],
      checkedKeys: this.props.checkedKeys,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      visible: null,
      InputData: this.props.InputData,
      externalData: this.props.externalData,
      selectDetail: {},
      treeKey: this.props.treeKey,
      change: false,
      deleteNode: this.props.deleteNode,
      /**任务队列 */
      addQueue: [],
      addChildQueue: [],
      deleteQueue: [],
      stopQueue: [],
      startQueue: [],
      updateQueue: [],
      flag:true,
      chooseData:[],
      sortNum:350,
      workData:[],
      treeFlag:true,
      sortNumber:1,
      typeT:0
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log('nextProps==>>', nextProps)
    // console.log('prevState==>>', prevState)

    /**树数据 */
    if (nextProps.treeData !== prevState.treeData) {
      return { treeData: nextProps.treeData };
    }
    if (nextProps.checkedKeys !== prevState.checkedKeys) {
      return { checkedKeys: nextProps.checkedKeys, autoExpandParent: true };
    }
    return null;
  }
  componentDidMount() {
    // console.log(this.props)
  }
  componentWillUnmount() {

    this.props.setSelectData({ [this.props.type]: [] });
    this.props.setCheckData({ [this.props.type]: [] });
  }
  componentDidUpdate() {
    // console.log(this.props)
    
    const { updateQueue,treeFlag } = this.state;
    // if(this.props.wordTreeData.length>0&&treeFlag){
    //   this.setState({workData:this.props.wordTreeData,treeFlag:false})
    // }
    this.dataList = [];
    this.generateList(this.state.treeData);
    if (this.props.type === 'DynamicTree' && this.state.change) {
      this.props.setChangeData({ treeData: this.state.treeData, updateQueue });     //更新树数据之后，更新treeList
      this.setState({ change: false });
    }
  }
  /**
   * 获取所有节点数据加入数组
   */
  generateList = data => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      this.dataList.push(node);
      if (node.children) {
        this.generateList(node.children, node.key);
      }
    }
  };

  /**
   * 获取所选节点详细信息
   */
  getSelectDetail = selectKey => {
    return this.dataList.filter(_ => _.key === selectKey)[0];
  };
  isKeyInTree = (key, tree) => {
    for (let index = 0; index < tree.length; index++) {
      const node = tree[index];
      if (node.key === key) {
        return true;
      } else if (node.children) {
        this.isKeyInTree(key, node.children);
      } else {
        return false;
      }
    }
    return false;
  }


  getDetailByKey = key => {
    this.dataList = [];
    this.generateList(this.state.treeData);
    return this.getSelectDetail(key);
  };
  cancel = e => {
    if (this.state.visible) {
      this.setState({ visible: null });
    }
  };
  onExpand = expandedKeys => {
    let list=this.getArrDifference(expandedKeys,this.state.expandedKeys)
    // console.log(list)
    if(list[0]==='type1'){
      if(expandedKeys.indexOf('type1')>-1){
        this.setState({sortNum:350})
      }else{
        this.setState({sortNum:350,sortNumber:1})
      }
    }
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  getArrDifference=(arr1, arr2)=>{
 
  return arr1.concat(arr2).filter(function(v, i, arr) {

      return arr.indexOf(v) === arr.lastIndexOf(v);

  });
}
  onEvent = () => {
    if (this.props.onSelectEvent) {
      this.props.onSelectEvent();
    } else if (this.props.onCheckEvent) {
      this.props.onCheckEvent();
    }
  };
  onSelect = async (selectedKeys, info) => {
    console.log('选择了！！！！', this.state.treeData);
    //if (this.isKeyInTree(selectedKeys[0], this.state.treeData)){
    this.setState({ selectedKeys, visible: null });
    if (selectedKeys.length > 0) {
      await this.props.setSelectData({
        [this.props.type]: selectedKeys,
        selectDetail: this.getDetailByKey(selectedKeys[0]),
      });
      if (this.props.type === 'DynamicTree') {
        this.props.setCheckData({
          department: this.getDetailByKey(selectedKeys[0]).department,
          partyid: this.getDetailByKey(selectedKeys[0]).partyid,
          virtualgroupid: this.getDetailByKey(selectedKeys[0]).virtualgroupid,
          isCheck: false,
        });
      }
    } else {
      await this.props.setSelectData({
        [this.props.type]: selectedKeys,
        selectDetail: [],
      });
      if (this.props.type === 'DynamicTree') {
        this.props.setCheckData({
          department: [],
          partyid: [],
          virtualgroupid: [],
          isCheck: false,
        });
      }
      //  }
    }
    await this.onEvent();
  };

  onCheck = async (checkedKeys, info) => {
    // console.log('checkedKeys',checkedKeys,info)
    // console.log(this.props)
    
    let {treeData,flag} = this.state;
    if(flag){     //第一次点击时
      //情况一：编辑进入时，禁用的节点中没有选中的状态
      //获取所有禁用的节点的数据，返回一个数组
      let chooseData=this.props.checkedKeys          //进入时默认选中的key 有值时，编辑进入；没有值时，可能是编辑，也可能是新建；
      let node = control.find(treeData, (node) => node.selectAble == false);
      if((chooseData&&chooseData.length>=0)&&(node&&node.length===0)){       //编辑/新建时，没有禁用，没有选中或者有选中的情况；
        this.setState({
          flag:false,
          typeT:1,
          chooseData:checkedKeys
        })
      }else if((chooseData&&chooseData.length>=0)&&(node&&node.length>0)){
        // console.log('node==>',node)
        let nodeIdList='';
        let nodeIdListArray=[]
        node.map(v=>{
          nodeIdList += v.treepath + ',';
        })
        let n = nodeIdList.lastIndexOf(',')
        nodeIdList = nodeIdList.substring(n,1)
        nodeIdListArray=nodeIdList.split(',')
        nodeIdListArray=Array.from(new Set(nodeIdListArray))     //所有禁用的节点以及子节点数组
        //当选中的id中存在禁用的id,在禁用id的数组中删除
        if(chooseData.length>0){
          for(let i = 0;i < chooseData.length; i++) {
            for(let j = 0; j < nodeIdListArray.length; j++) {
                if(nodeIdListArray[j] === chooseData[i]) {
                  nodeIdListArray.splice(j,1);
                    j--;
                }
            }
          }
        }
        // debugger;
        //在循环中将checkedKeys中含有禁用的keys删除
        if(nodeIdListArray.length>0){
          for(let i = 0;i < nodeIdListArray.length; i++) {
            for(let j = 0; j < checkedKeys.length; j++) {
                if(checkedKeys[j] === nodeIdListArray[i]) {
                  checkedKeys.splice(j,1);
                    j--;
                }
            }
          }
        }
        // console.log("nodeIdListArray==>",nodeIdListArray)
        this.setState({
          flag:false,
          typeT:2,
          chooseData:chooseData
        })
      }


    }else{         //第二次点击时   typeT===1时，编辑/新建时，没有禁用，没有选中或者有选中的情况；
      let {chooseData,typeT}=this.state
      if(typeT===1){                                
        let indexC=0
        if(checkedKeys.length>chooseData.length){
          checkedKeys.map(v=>{
            if(chooseData.indexOf(v)<0){
              indexC++
            }
          })
          if(indexC===0){
            checkedKeys=[]
          }
        }

        this.setState({
          flag:true
        })
      }else if(typeT===2){     //typeT===2时，编辑，有禁用，有选中的情况；
        let NochooseData=[]
        let indexC=0
        let node = control.find(treeData, (node) => node.selectAble == false);
        let nodeIdList='';
        let nodeIdListArray=[]
        node.map(v=>{
          nodeIdList += v.treepath + ',';
        })
        let n = nodeIdList.lastIndexOf(',')
        nodeIdList = nodeIdList.substring(n,1)
        nodeIdListArray=nodeIdList.split(',')
        nodeIdListArray=Array.from(new Set(nodeIdListArray))     //所有禁用的节点以及子节点数组


        //将所有未选中但禁用的key收集起来
        nodeIdListArray.map(t=>{
          if(chooseData.indexOf(t)<0){
            NochooseData.push(t)
          }
        })

        //在循环中将checkedKeys中含有禁用的keys删除
        for(let i = 0;i < NochooseData.length; i++) {
          for(let j = 0; j < checkedKeys.length; j++) {
              if(checkedKeys[j] === NochooseData[i]) {
                checkedKeys.splice(j,1);
                  j--;
              }
          }
        }

        if(checkedKeys.length>=chooseData.length){
          checkedKeys.map(v=>{
            if(chooseData.indexOf(v)<0){
              indexC++
            }
          })
          if(indexC===0){
            checkedKeys=[]
          }
        }

        this.setState({
          flag:true
        })
      }
      // if(chooseData.length>0){
        
      //   checkedKeys=chooseData
      // }else{
      //   checkedKeys=[]
      // }
    }

    await this.props.setCheckData({
      [this.props.type]: checkedKeys,
      isCheck: true,
    });
    await this.onEvent();

  };
  
  onChange = (value,e) => {
    e.preventDefault();
    e.stopPropagation();
    // const value = e.target.value;
    const expandedKeys = this.dataList.map(item => {
        if (item.name.indexOf(value) > -1) {
          return getParentKey(item.key, this.state.treeData);
        }
        return null;
      }).filter((item, i, self) => item && self.indexOf(item) === i);

    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };
  handleScroll=(e)=>{
    // console.log('scrolling up')
  }
  loadData=(item,index)=>{
    // console.log(item,index)
    const {sortNumber}=this.state
    if(item.treepath.indexOf('type1,')>-1){
      let e=sortNumber+1
      // console.log(e,350*e)
      if(350*e<this.props.wordTreeData.length){
        message.info(`还有${this.props.wordTreeData.length-350*e}条数据继续加载~`,5);
      }else{
        message.warning('数据已全部加载完!',5);
      }
      this.setState({sortNum:350*e,sortNumber:e})
    }
  }
  render() {
    console.log(this.props,this.state)
    let powers = this.props.powers;
    document.onclick = this.cancel;
    const {searchValue,autoExpandParent,expandedKeys,treeData,sortNum,workData} = this.state;
    // console.log(expandedKeys)
    // if(treeData.length>0){
    //   treeData[0]['children']=workData.slice(0,sortNum)
    // }
    const loop = data =>
      data.map((item,e) => {
        const index = item.name && item.name.indexOf(searchValue);
        const beforeStr = item.name && item.name.substr(0, index);
        const afterStr = item.name && item.name.substr(index + searchValue.length);
        const name =index > -1 ? (<span>{beforeStr}<span style={{ color: '#f50', verticalAlign: 'middle' }}>{searchValue}</span>{afterStr}</span>) : (<span>{item.name}</span>);
        let nodeP
        //取消禁用设置，改为样式控制   20181225  彭元军
        if (!this.props.disabled) {
          nodeP = this.props.enable === true ? false :
            this.props.disabled ? true :
              this.props.style == "detail" ? true :
                this.props.type != 'DynamicTree' && this.props.type != 'column' ? !item.selectAble : false
        }
        if (item.children) {
          return (
            <TreeNode
              className={nodeP?'treeNodeDisable':null}
              id={item.key}
              key={item.key}
              title={<span onClick={()=>this.loadData(item,e)}>{name}</span>}
            >
              {loop(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            className={nodeP?'treeNodeDisable':null}
            id={item.key}
            key={item.key}
            title={<span onClick={()=>this.loadData(item,e)}>{name}</span>} 
          />
        );
      });

      // console.log('this.props.checkedKeys==>',this.props.checkedKeys)
      // console.log(powers)
    return (
      <div className="selectable-tree" onWheel={(e) => this.handleScroll(e)}>
      <Tooltip placement="topLeft" title='输入完成后，请点击回车!'>
        <Search
          style={{ marginBottom: 8 }}
          placeholder="请输入关键字"
          onSearch={(value,event)=>this.onChange(value,event)}
        />
        </Tooltip>
        <Tree
          id='TreeArr'
          showLine
          onCheck={this.onCheck}
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          disabled={this.props.disabled}
          selectedKeys={this.props.selectTreeData[this.props.type]}
          checkedKeys={(this.props.checkable && treeData && treeData.length > 0) ? this.props.checkedKeys : []}
          checkable={this.props.checkable}
          autoExpandParent={autoExpandParent}
          defaultCheckedKeys={this.props.defaultCheckedKeys}
          defaultSelectedKeys={this.props.defaultSelectedKeys}
          onSelect={this.props.selectable ? this.onSelect : null}
        >
          {powers ? (powers.read ?loop(treeData) : null) : loop(treeData)}
        </Tree>
        <Modal
          className="modal"
          title="警告"
          maskClosable={false}
          visible={this.state.deleteModal}
          onOk={() => this.delete()}
          onCancel={() => this.setState({ deleteModal: false })}
          key={'warningModal'}
          destroyOnClose={true}
        >
          <h3>确定删除?</h3>
        </Modal>
      </div>
    );
  }
}



