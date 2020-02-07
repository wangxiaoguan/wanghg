import React, { Component } from 'react';
import { Tree, Input, Menu, Modal, Tooltip, Message } from 'antd';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
import { connect } from 'react-redux';
import API_PREFIX from '../../content/apiprefix';
import { getService, postService, GetQueryString } from '../../content/myFetch';
let TreeControl = require('../../content/TreeControl');
// import { treeData } from './mockData';
import { setSelectTreeData, setCheckTreeData, setChangeData } from '../../../redux-root/action/tree/tree';
import './TreeList.less';

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
    organizationState: '1',
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
  let deleteList;
  if (props.powers && props.powers.deleteList === false) {
    deleteList = props.powers.deleteList;
    // console.log('deleteList', deleteList)
  } else {
    deleteList = true;
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
      <Menu.Item key="4" style={{ display: update ? (props.disable ? 'none' : props.isContinue ? 'none' : 'block') : 'none' }}>启用</Menu.Item>
      <Menu.Item key="5" style={{ display: update ? (props.disable ? 'none' : props.isContinue ? 'block' : 'none') : 'none' }}>停用</Menu.Item>
      <Menu.Item key="6" style={{ display: create && update && deletes ? 'none' : (props.disable ? 'none' : 'block') }}>无权操作</Menu.Item>
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
    AllTreeData: state.tree.treeCheckData,    
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
export default class TreeList extends Component {
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
      typeT:0,
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log('nextProps==>>', nextProps)
    // console.log('prevState==>>', prevState)
    /**右侧列表数据 */
    if (nextProps.InputData !== prevState.InputData) {
        const searchData = (selectKey, tree) => {
        for (let index = 0; index < tree.length; index++) {
          const node = tree[index];
          if (node.key === selectKey) {
            node[nextProps.treeKey] = nextProps.InputData[nextProps.treeKey];
            break;
          } else if (node.children) {
            if (node.children.some(item => item.key === selectKey)) {
              let count = node.children.indexOf(
                node.children.filter(item => item.key === selectKey)[0]
              );
              node.children[count][nextProps.treeKey] =
                nextProps.InputData[nextProps.treeKey];
              break;
            } else {
              searchData(selectKey, node.children);
            }
          }
        }
        return { treeData: tree };
      };
      searchData(prevState.selectedKeys[0], nextProps.treeData);
      /**如果是已存在节点则加入更新队列,需要在didUpdate中更新treelist*/
      if (prevState.selectedKeys[0] && prevState.selectedKeys[0].indexOf('unsavetreenodekey') === -1) {
        prevState.updateQueue.push(prevState.selectedKeys[0]);
        let updateQueue = Array.from(new Set(prevState.updateQueue));
        return { updateQueue, InputData: nextProps.InputData, change: true };
        /**如果是新增未保存的节点则在didUpdate中更新treelist*/
      } else if (prevState.selectedKeys[0] && prevState.selectedKeys[0].indexOf('unsavetreenodekey') > -1) {
        return { InputData: nextProps.InputData, change: true };
      }
    }
    /**树数据 */
    if (nextProps.treeData !== prevState.treeData) {
      return { treeData: nextProps.treeData };
    }
    /**外部其他数据 */
    if (
      nextProps.externalData !== prevState.externalData &&
      (nextProps.type === 'DynamicTree' || nextProps.type == 'column')) {
      //处理externalData
      const searchData = (selectKey, tree) => {
        for (let index = 0; index < tree.length; index++) {
          let node = tree[index];
          if (node.key === selectKey) {
            node = Object.assign(node, nextProps.externalData);
            break;
          } else if (node.children) {
            if (node.children.some(item => item.key === selectKey)) {
              let count = node.children.indexOf(
                node.children.filter(item => item.key === selectKey)[0]
              );
              node.children[count] = Object.assign(
                node.children[count],
                nextProps.externalData
              );
              break;
            } else {
              searchData(selectKey, node.children);
            }
          }
        }
        return { treeData: tree };
      };
      searchData(prevState.selectedKeys[0], nextProps.treeData);
      /**如果是已存在节点则加入更新队列,需要在didUpdate中更新treelist*/
      if (nextProps.isCheck && prevState.selectedKeys[0] && prevState.selectedKeys[0].indexOf('unsavetreenodekey') === -1) {
        prevState.updateQueue.push(prevState.selectedKeys[0]);
        let updateQueue = Array.from(new Set(prevState.updateQueue));
        return { externalData: nextProps.externalData, updateQueue, change: true };
        /**如果是新增未保存的节点则在didUpdate中更新treelist*/
      } else if (nextProps.isCheck && prevState.selectedKeys[0] && prevState.selectedKeys[0].indexOf('unsavetreenodekey') > -1) {
        return { externalData: nextProps.externalData, change: true };
      }
      return { externalData: nextProps.externalData };
    }
    if (nextProps.checkedKeys !== prevState.checkedKeys) {
      return { checkedKeys: nextProps.checkedKeys, autoExpandParent: true };
    }
    return null;
  }
  componentDidMount() {
  }
  componentWillUnmount() {
    this.props.setSelectData({ [this.props.type]: [] });
    this.props.setCheckData({ [this.props.type]: [] });
  }
  componentDidUpdate() {
    const { updateQueue } = this.state;
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
    if(data&&data[0]!==''){
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        this.dataList.push(node);
        if (node.children) {
          this.generateList(node.children, node.key);
        }
      }
    }
  
  };
  /**
   * 右键事件不同的操作
   */
  menuOption = item => {
    switch (item.key) {
      case '1':
        this.add();
        break;
      case '2':
        this.addChild();
        break;
      case '3':
        this.setState({ deleteModal: true });
        break;
      case '4':
        this.isContinue('is');
        break;
      case '5':
        this.isContinue('dis');
        break;
      default:
        break;
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
  /**
   * 右键增加
   */
  add = async () => {
    const { updateTree, treeData, addQueue } = this.state;
    // let treeData = this.state.treeData;
    if (this.state.rightSelectedKeys.indexOf('unsavetreenodekey') !== -1) {
      Message.error('当前节点未保存！');
      return;
    }
    const searchData = (selectKey, tree) => {
      for (let index = 0; index < tree.length; index++) {
        let node = tree[index];
        if (node.key === selectKey) {
          tree.push(newTreeNode(updateTree, selectKey, false));
        } else if (node.children) {
          if (node.children.some(item => item.key === selectKey)) {
            node.children.push(newTreeNode(updateTree, selectKey, false));
          } else {
            searchData(selectKey, node.children);
          }
        }
      }

      // let addQueues = Array.from(new Set(addQueue));
      this.setState({
        treeData: tree,
        updateTree: updateTree + 1,
        visible: null,
      });
    };
    await searchData(this.state.rightSelectedKeys, treeData);
    addQueue.push(updateTree + 'unsavetreenodekey');
    await this.props.setChangeData({ treeData: this.state.treeData, addQueue });        //更新树数据之后，更新treeList
    let expandedKeys = this.state.expandedKeys;
    expandedKeys.push(getParentKey(updateTree + 'unsavetreenodekey', this.state.treeData));
    await this.setState({
      addQueue,
      expandedKeys,
    });
    this.props.setSelectData({ DynamicTree: [updateTree + 'unsavetreenodekey'], selectDetail: this.getDetailByKey(updateTree + 'unsavetreenodekey') });
    this.onSelect([updateTree + 'unsavetreenodekey']);
  };
  /**
   * 增加下一级
   */
  addChild = async () => {
    if (this.state.rightSelectedKeys.indexOf('unsavetreenodekey') !== -1) {
      Message.error('当前节点未保存！');
      return;
    }
    const { updateTree, treeData, addChildQueue } = this.state;
    // let treeData = this.state.treeData;
    const searchData = (selectKey, tree) => {
      for (let index = 0; index < tree.length; index++) {
        let node = tree[index];
        const key = tree[index].key;
        if (key === selectKey) {
          //选中第一级
          if (node.children) {
            //如果有children,直接塞进children
            node.children.push(newTreeNode(updateTree, selectKey, node.disabled));
          } else {
            let children = { children: [newTreeNode(updateTree, selectKey, node.disabled)] };
            //没有children则包裹一层children在塞
            node = { ...node, ...children };
            tree[index] = node;
          }
        } else if (node.children) {
          //如果数据不在这一级并且当前有下一级
          if (node.children.some(item => item.key === selectKey)) {
            //如果选中的数据在这一级
            if (
              node.children.filter(item => item.key === selectKey)[0].children
            ) {
              //如果有children,直接塞进children
              let count = node.children.indexOf(
                node.children.filter(item => item.key === selectKey)[0]
              );
              node.children[count].children.push(
                newTreeNode(updateTree, selectKey, node.children[count].disabled)
              );
            } else {
              //没有children则包裹一层children在塞
              let count = node.children.indexOf(
                node.children.filter(item => item.key === selectKey)[0]
              );
              let children = { children: [newTreeNode(updateTree, selectKey, node.children[count].disabled)] };
              node.children[count] = { ...node.children[count], ...children };
            }
          } else {
            //不在这一级再找下一级
            searchData(selectKey, node.children);
          }
        }
      }
      this.setState({
        treeData: tree,
        updateTree: updateTree + 1,
        visible: null,
      });
    };
    this.props.NewAddNode(true);
// 我已设置了新增一个节点
console.log("我已设置了新增一个节点");

    await searchData(this.state.rightSelectedKeys, treeData);
    addChildQueue.push(updateTree + 'unsavetreenodekey');
    await this.props.setChangeData({ treeData: this.state.treeData, addChildQueue });       //更新树数据之后，更新treeList
    console.log('当前', [getParentKey(updateTree + 'unsavetreenodekey', this.state.treeData)]);
    let expandedKeys = this.state.expandedKeys;
    expandedKeys.push(getParentKey(updateTree + 'unsavetreenodekey', this.state.treeData));
    await this.setState({ addChildQueue, expandedKeys });
    this.onSelect([updateTree + 'unsavetreenodekey']);
  };
  /**
   * 右键删除
   */
  delete = async () => {
    const {
      treeData,
      deleteQueue,
      updateQueue,
      addQueue,
      addChildQueue,
    } = this.state;
    // this.state.deleteNode();
    if (this.state.rightSelectedKeys.indexOf('unsavetreenodekey') !== -1) { //yelu 修改新增节点未保存右键删除bug
      Message.error('当前节点未保存');
      this.setState({ deleteModal: false });
      return;
    }
    const searchData = (selectKey, tree) => {
      postService(API_PREFIX + this.props.deleteUrl + '/' + selectKey, '', data => {
        if (data.status === 1) {
          console.log('删除成功');
          for (let index = 0; index < tree.length; index++) {
            let node = tree[index];
            const key = node.key;
            if (key === selectKey) {
              tree.splice(index, 1);
            } else if (node.children) {
              if (node.children.some(item => item.key === selectKey)) {
                let count = node.children.indexOf(
                  node.children.filter(item => item.key === selectKey)[0]
                );
                node.children.splice(count, 1);
              } else {
                searchData(selectKey, node.children);
              }
            }
          }
          let trees = [...tree];
          this.setState({
            deleteModal: false,
            treeData: trees,
            visible: null,
          });

        } else {
          this.state.deleteNode();

          Message.error(data.errorMsg);
          this.setState({
            deleteModal: false,
            // treeData: trees,
            visible: null,
            queue: {},
          });
          return false;
        }
      }

      );
      // for (let index = 0; index < tree.length; index++) {
      //   let node = tree[index];
      //   const key = node.key;
      //   if (key === selectKey) {
      //     tree.splice(index, 1);
      //   } else if (node.children) {
      //     if (node.children.some(item => item.key === selectKey)) {
      //       let count = node.children.indexOf(
      //         node.children.filter(item => item.key === selectKey)[0]
      //       );
      //       node.children.splice(count, 1);
      //     } else {
      //       searchData(selectKey, node.children);
      //     }
      //   }
      // }
      // let trees = [...tree];
      // this.setState({
      //   deleteModal:false,
      //   treeData: trees,
      //   visible: null,
      // });
    };

    await searchData(this.state.rightSelectedKeys, treeData);
    /**如果删除了还未保存的节点,如果在新增队列中，则直接把新增队列中当前任务删除*/
    if (addQueue.indexOf(this.state.rightSelectedKeys) > -1) {
      addQueue.splice(addQueue.indexOf(this.state.rightSelectedKeys), 1);
      await this.props.setChangeData({ treeData: this.state.treeData, addQueue });       //更新树数据之后，更新treeList
      this.setState({ addQueue });
      /**如果删除了还未保存的节点,如果在新增下级队列中，则直接把新增下级队列中当前任务删除*/
    } else if (addChildQueue.indexOf(this.state.rightSelectedKeys) > -1) {
      addChildQueue.splice(addChildQueue.indexOf(this.state.rightSelectedKeys), 1);
      await this.props.setChangeData({ treeData: this.state.treeData, addChildQueue });    //更新树数据之后，更新treeList
      this.setState({ addChildQueue });
      /**如果删除了已存在的节点*/
    } else {
      /**如果当前节点在更新队列中,则把更新队列中当前节点删除，再加入删除队列 */
      if (updateQueue.indexOf(this.state.rightSelectedKeys) > -1) {
        updateQueue.splice(updateQueue.indexOf(this.state.rightSelectedKeys), 1);
        deleteQueue.push(this.state.rightSelectedKeys);
        await this.props.setChangeData({ treeData: this.state.treeData, updateQueue, deleteQueue });    //更新树数据之后，更新treeList
        this.setState({ updateQueue, deleteQueue });
        /**如果当前节点不在更新队列中,直接加入删除队列 */
      } else {
        deleteQueue.push(this.state.rightSelectedKeys);
        await this.props.setChangeData({ treeData: this.state.treeData, deleteQueue });    //更新树数据之后，更新treeList
        this.setState({ deleteQueue });
      }
    }
    // this.state.deleteNode();
    // console.log(this.state.deleteNode)
  };
  /**
   * 右键停用/启用
   */
  isContinue = async (value) => {
    let disabled = value === 'dis';
    let parentKey = getParentKey(this.state.rightSelectedKeys, this.state.treeData);
    let parentState = this.getDetailByKey(parentKey);
    if (this.state.rightSelectedKeys.indexOf('unsavetreenodekey') !== -1) {
      Message.error('当前节点未保存！');
      return;
    }
    if (!disabled && parentKey) {
      if (parentState.disabled) {
        Message.error('上级节点已被停用！');
        return;
      }
    }

    const { treeData, updateQueue, stopQueue, startQueue } = this.state;
    const searchData = (selectKey, tree) => {
      const searchChildren = (tree) => {
        for (let index = 0; index < tree.length; index++) {
          let node = tree[index];
          node.disabled = disabled;
          if (node.children) {
            searchChildren(node.children);
          }
        }
      };
      for (let index = 0; index < tree.length; index++) {
        let node = tree[index];
        const key = node.key;
        if (key === selectKey) {
          node.disabled = disabled;
          if (node.children) {
            searchChildren(node.children);
          }
        } else if (node.children) {
          if (node.children.some(item => item.key === selectKey)) {
            let count = node.children.indexOf(
              node.children.filter(item => item.key === selectKey)[0]
            );
            node.children[count].disabled = disabled;
            if (node.children[count].children) {
              searchChildren(node.children[count].children);
            }
          } else {
            searchData(selectKey, node.children);
          }
        }
      }
      let trees = [...tree];
      this.setState({ treeData: trees, visible: null });
    };
    await searchData(this.state.rightSelectedKeys, treeData);
    /**如果要停用/启用的节点不是新增的节点 */
    if (this.state.rightSelectedKeys.indexOf('unsavetreenodekey') === -1) {
      if (disabled) {   //停用
        if (startQueue.indexOf(this.state.rightSelectedKeys) > -1) { //如果之前在启用队列中
          startQueue.splice(startQueue.indexOf(this.state.rightSelectedKeys), 1);
          stopQueue.push(this.state.rightSelectedKeys);
          await this.props.setChangeData({ treeData: this.state.treeData, stopQueue, startQueue });    //更新树数据之后，更新treeList
          this.setState({ startQueue, stopQueue });
        } else {
          stopQueue.push(this.state.rightSelectedKeys);
          await this.props.setChangeData({ treeData: this.state.treeData, stopQueue });    //更新树数据之后，更新treeList
          this.setState({ stopQueue });
        }
      } else { //启用
        if (stopQueue.indexOf(this.state.rightSelectedKeys) > -1) { //如果之前在停用队列中
          stopQueue.splice(stopQueue.indexOf(this.state.rightSelectedKeys), 1);
          startQueue.push(this.state.rightSelectedKeys);
          await this.props.setChangeData({ treeData: this.state.treeData, stopQueue, startQueue });    //更新树数据之后，更新treeList
          this.setState({ startQueue, stopQueue });
        } else {
          startQueue.push(this.state.rightSelectedKeys);
          await this.props.setChangeData({ treeData: this.state.treeData, startQueue });    //更新树数据之后，更新treeList
          this.setState({ startQueue });
        }
      }
    }
  };

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
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  onEvent = () => {
    if (this.props.onSelectEvent) {
      this.props.onSelectEvent();
    } else if (this.props.onCheckEvent) {
      this.props.onCheckEvent();
    }
  };
  onSelect = async (selectedKeys, info) => {
    if(this.props.columnonCLick){
      const {columnonCLick}=this.props;
      setTimeout(()=>{
        columnonCLick(selectedKeys, info);
      },500);
    }
    console.log('选择了！！！！', this.state.treeData);
    //if (this.isKeyInTree(selectedKeys[0], this.state.treeData)){
    this.setState({ selectedKeys, visible: null });
    if (selectedKeys.length > 0) {
      await this.props.setSelectData({
        [this.props.type]: selectedKeys,
        selectDetail: this.getDetailByKey(selectedKeys[0]),
      });
      if (this.props.type === 'DynamicTree') {
        if(this.props.checkTree==='columnTreeType'&&this.props.AllTreeData.name){
          this.props.setCheckData({});
          this.props.setCheckData({
            department: this.getDetailByKey(selectedKeys[0]).department,
            partyid: this.getDetailByKey(selectedKeys[0]).partyid,
            virtualgroupid: this.getDetailByKey(selectedKeys[0]).virtualgroupid,
            unionId:this.getDetailByKey(selectedKeys[0]).unionId,
            isCheck: false,
          });
        }else{
          this.props.setCheckData({
            department: this.getDetailByKey(selectedKeys[0]).department,
            partyid: this.getDetailByKey(selectedKeys[0]).partyid,
            virtualgroupid: this.getDetailByKey(selectedKeys[0]).virtualgroupid,
            unionId:this.getDetailByKey(selectedKeys[0]).unionId,
            isCheck: false,
          });
        }
      }
    } else {
      await this.props.setSelectData({
        [this.props.type]: selectedKeys,
        selectDetail: [],
      });
      if (this.props.type === 'DynamicTree') {
        if(this.props.checkTree==='columnTreeType'&&this.props.AllTreeData.name){
          this.props.setCheckData({});
          this.props.setCheckData({
            department: this.getDetailByKey(selectedKeys[0]).department,
            partyid: this.getDetailByKey(selectedKeys[0]).partyid,
            virtualgroupid: this.getDetailByKey(selectedKeys[0]).virtualgroupid,
            unionId:this.getDetailByKey(selectedKeys[0]).unionId,
            isCheck: false,
          });
        }else{
          this.props.setCheckData({
            department: [],
            partyid: [],
            unionId:[],
            virtualgroupid: [],
            isCheck: false,
          });
        }
      }
      //  }
    }
    await this.onEvent();
  };

  onCheck = async (checkedKeys, info) => {
    // console.log('checkedKeys',checkedKeys,info)
    // console.log(this.props)
    if(this.props.dataType=='specialpoint'){
      this.props.getCheckedKeys(checkedKeys,this.props.type);
    }
    
    let {treeData,flag} = this.state;
    if(flag){     //第一次点击时
      //情况一：编辑进入时，禁用的节点中没有选中的状态
      //获取所有禁用的节点的数据，返回一个数组
      let chooseData=this.props.checkedKeys;          //进入时默认选中的key 有值时，编辑进入；没有值时，可能是编辑，也可能是新建；
      let node = control.find(treeData, (node) => node.selectAble == false);
      if((chooseData&&chooseData.length>=0)&&(node&&node.length===0)){       //编辑/新建时，没有禁用，没有选中或者有选中的情况；
        this.setState({
          flag:false,
          typeT:1,
          chooseData:checkedKeys,
        });
      }else if((chooseData&&chooseData.length>=0)&&(node&&node.length>0)){
        // console.log('node==>',node)
        let nodeIdList='';
        let nodeIdListArray=[];
        node.map(v=>{
          nodeIdList += v.treepath + ',';
        });
        let n = nodeIdList.lastIndexOf(',');
        nodeIdList = nodeIdList.substring(n,1);
        nodeIdListArray=nodeIdList.split(',');
        nodeIdListArray=Array.from(new Set(nodeIdListArray));     //所有禁用的节点以及子节点数组
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
          chooseData:chooseData,
        });
      }


    }else{         //第二次点击时   typeT===1时，编辑/新建时，没有禁用，没有选中或者有选中的情况；
      let {chooseData,typeT}=this.state;
      if(typeT===1){                                
        let indexC=0;
        if(checkedKeys.length>chooseData.length){
          checkedKeys.map(v=>{
            if(chooseData.indexOf(v)<0){
              indexC++;
            }
          });
          if(indexC===0){
            checkedKeys=[];
          }
        }

        this.setState({
          flag:true,
        });
      }else if(typeT===2){     //typeT===2时，编辑，有禁用，有选中的情况；
        let NochooseData=[];
        let indexC=0;
        let node = control.find(treeData, (node) => node.selectAble == false);
        let nodeIdList='';
        let nodeIdListArray=[];
        node.map(v=>{
          nodeIdList += v.treepath + ',';
        });
        let n = nodeIdList.lastIndexOf(',');
        nodeIdList = nodeIdList.substring(n,1);
        nodeIdListArray=nodeIdList.split(',');
        nodeIdListArray=Array.from(new Set(nodeIdListArray));     //所有禁用的节点以及子节点数组


        //将所有未选中但禁用的key收集起来
        nodeIdListArray.map(t=>{
          if(chooseData.indexOf(t)<0){
            NochooseData.push(t);
          }
        });

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
              indexC++;
            }
          });
          if(indexC===0){
            checkedKeys=[];
          }
        }

        this.setState({
          flag:true,
        });
      }
      // if(chooseData.length>0){
        
      //   checkedKeys=chooseData
      // }else{
      //   checkedKeys=[]
      // }
    }
if(this.props.checkTree === 'columnTreeType'&&this.props.AllTreeData.name){

  await this.props.setCheckData({});

  await this.props.setCheckData({
    [this.props.type]: checkedKeys,
    isCheck: true,
  });
  await this.onEvent();
}else{
  await this.props.setCheckData({
    [this.props.type]: checkedKeys,
    isCheck: true,

  });
  await this.onEvent();
}
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
  render() {
    
    let powers = this.props.powers;
    // let disabledAll=this.props.style == "detail" ? true : this.props.type != 'DynamicTree' && this.props.type != 'column' ? !item.selectAble : false
    // let disabledAll=this.props.style == "detail" ? true : this.props.type != 'DynamicTree' && this.props.type != 'column' 
    document.onclick = this.cancel;
    const {
      searchValue,
      autoExpandParent,
      expandedKeys,
      treeData,
    } = this.state;
    let isforbed=this.props.isforbed;
    let InfoColumn = this.props.InfoColumn;
    const loop = data =>
    data&&data.map(item => {
        const index = item.name && item.name.indexOf(searchValue);
        const beforeStr = item.name && item.name.substr(0, index);
        const afterStr = item.name && item.name.substr(index + searchValue.length);
        const categoryState=item.categoryState;
        const name =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50', verticalAlign: 'middle' }}>
                {searchValue}
              </span>
              {afterStr}
            </span>
          ) : (
              <span>{item.name}</span>
            );
        let orgIds = window.sessionStorage.getItem('authorityOrgIds')?window.sessionStorage.getItem('authorityOrgIds'):false
        let partyIds = window.sessionStorage.getItem('authorityPartyIds')?window.sessionStorage.getItem('authorityPartyIds'):false
        let GroupIds = window.sessionStorage.getItem('authorityGroupIds')?window.sessionStorage.getItem('authorityGroupIds'):false
        let UnionIds = window.sessionStorage.getItem('authorityUnionIds') ? window.sessionStorage.getItem('authorityUnionIds') : false
        let disabled = false
        let type = this.props.type
        if(this.props.style === 'detail') { //详情页面禁用树
          disabled = true
        }else if(type === 'DynamicTree' && item.showType === 2) { //栏目管理树禁用首页标签
          disabled = true
        }else if((type ==='department_join' || type ==='department_view' || type === 'department') && orgIds ) { //根据登陆账号权限控制可操作的部门
          disabled = orgIds.split(',').indexOf(item.id)>-1?false:true
        }else if((type === 'partyid_join' || type ==='partyid_view' || type === 'partyid') && partyIds) {
          disabled = partyIds.split(',').indexOf(item.id)>-1?false:true
        }else if((type ==='virtualgroupid_join' || type ==='virtualgroupid_view' || type ==='virtualgroupid' || type === 'virtual') && GroupIds) { //根据登陆账号权限控制可操作的虚礼组
          disabled = GroupIds.split(',').indexOf(item.id)>-1?false:true
        }else if((type ==='union_join' || type ==='union_view' || type ==='unionId' || type === 'unionsId') && UnionIds) { //根据登陆账号权限控制可操作的工会组织
          disabled = UnionIds.split(',').indexOf(item.id)>-1?false:true
        }
        // else if(type === 'DynamicTree' && item.id && item.id.indexOf('-') > -1) { //通过id为负值判断是根级栏目
        //   disabled = true
        // }
        if(type === 'column') {
          disabled = false
        }
        // nodeP = (categoryState==undefined?false:(categoryState==1 ?false:true));
        if (item.children) {
          return (
            <TreeNode
              id={item.key}
              key={item.key}
              disabled={this.props.disabled ? true : disabled}
              title={
                <WrapperToolTip
                  powers={this.props.powers}
                  isContinue={!item.disabled}
                  visible={this.state.visible === item.key}
                  onClick={this.menuOption}
                  disable={!this.state.isLeaf}
                  {...this.props}
                >
                  {<span style={item.organizationState === '0' || categoryState == 0 ? {backgroundColor: '#ccc'} : {}}>{name}{item.showType === 2 ? '(首页标签)' : ''}{item.organizationState === '0' || categoryState == 0 ? '(已停用)' : ''}</span>}
                </WrapperToolTip>
              }
            >
              {loop(item.children)}
            </TreeNode>
          );
        }
       
        return (
          <TreeNode
            id={item.key}
            key={item.key}
            disabled={item.noLower?true:this.props.disabled ? true : disabled}
            title={
              <WrapperToolTip
                powers={this.props.powers}
                isContinue={!item.disabled}
                visible={this.state.visible === item.key}
                onClick={this.menuOption}
                disable={!this.state.isLeaf}
                {...this.props}
              >
                {<span style={item.organizationState === '0' || categoryState == 0 ?{backgroundColor: '#ccc'} : {}}>{name}{item.showType === 2 ? '(首页标签)' : ''}{item.organizationState === '0' || categoryState == 0 ? '(已停用)' : ''}</span>}
              </WrapperToolTip>
            }
          />
        );
      });

   console.log("wwww==>",this.props.disabled)

    return (
      <div className="selectable-tree">
        <Tooltip placement="topLeft" title='输入完成后，请点击回车!'>
          <Search
            style={{ marginBottom: 8 }}
            placeholder="请输入关键字"
            onSearch={(value,event)=>this.onChange(value,event)}
          />
        </Tooltip>
        <Tree
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
          onRightClick={
            this.props.rightClickable
              ? e => {
                let rightSelectedKeys = e.node.props.eventKey;
                console.log('----eeeee----', e.node);
                /* let isLeaf = isleaf(
                  [rightSelectedKeys],
                  this.state.treeData,
                  !this.props.rootDisable
                ); */
                let isLeaf = getParentKey(rightSelectedKeys, this.state.treeData) ? true : false;
                console.log('是否是非根叶子节点', isLeaf);
                this.setState({
                  visible: e.node.props.id,
                  rightSelectedKeys,
                  isLeaf,
                });
              }
              : null
          }
        >
          {powers ? (powers.read ?
            loop(treeData) : null) : loop(treeData)}
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



