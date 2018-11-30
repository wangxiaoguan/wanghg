import React, { Component } from 'react';
import { Tree, Input, Menu, Modal, Tooltip, Message } from 'antd';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
import { connect } from 'react-redux';
import API_PREFIX  from '../../content/apiprefix';
import { getService, postService, GetQueryString} from '../../content/myFetch';
// import { treeData } from './mockData';
import { setSelectTreeData, setCheckTreeData, setChangeData} from '../../../redux-root/action/tree/tree';
import './TreeList.less';
/**
 * 是否是叶子节点
 * @param {*} selectKey 选择的节点key
 * @param {*} tree 树data
 */
const isleaf = (selectKey, tree,always) => {
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
const newTreeNode = (updateTree,parentId,disabled) => {
  return {
    parentId,
    //id: 'add',
    key: updateTree+'unsavetreenodekey',
    name: '新建项' + updateTree+'',
    leaf: true,
    value: '',
    disabled,
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
const WrapperToolTip = (props)=>{
  console.log('props!!!!',props.powers);
  let create = props.powers&&props.powers.create;
  let update = props.powers&&props.powers.update;
  let deletes = props.powers&&props.powers.deletes;
  let deleteList
  if(props.powers&&props.powers.deleteList===false){
    deleteList = props.powers.deleteList;
    console.log('deleteList',deleteList)
  }else{
    deleteList=true
  }
  //let read = props.powers.read;
  return <Tooltip 
    visible={props.visible} 
    title={<Menu mode="inline" onClick={props.onClick}>
      <Menu.Item key="1" style={{ display: create? (props.disable  ?'none':'block'):'none'}}>增加</Menu.Item>
      <Menu.Item key="2" style={{ display: !create ? 'none' : 'block' }}>增加下级</Menu.Item>
      <Menu.Item key="3" style={{ display: (deleteList === false) ? 'none' : (deletes ?( props.disable ? 'none' : 'block' ):'none')}}>删除</Menu.Item>
      <Menu.Item key="4" style={{ display: update ?(props.isContinue  ?'none': 'block'):'none'}}>启用</Menu.Item>
      <Menu.Item key="5" style={{ display: update?(props.isContinue  ?'block':'none'):'none' }}>停用</Menu.Item>
      <Menu.Item key="6" style={{ display: create && update && deletes? 'none' : 'block' }}>无权操作</Menu.Item>
    </Menu>}
    getPopupContainer={trigger=>trigger.parentNode}
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
      change:false,
      deleteNode:this.props.deleteNode,
      /**任务队列 */
      addQueue: [],
      addChildQueue: [],
      deleteQueue: [],
      stopQueue: [],
      startQueue:[],
      updateQueue: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
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
        return {treeData: tree};
      };
      searchData(prevState.selectedKeys[0], nextProps.treeData);
      /**如果是已存在节点则加入更新队列,需要在didUpdate中更新treelist*/
      if (prevState.selectedKeys[0].indexOf('unsavetreenodekey') === -1) {    
        prevState.updateQueue.push(prevState.selectedKeys[0]);
        let updateQueue = Array.from(new Set(prevState.updateQueue));
        return {updateQueue,InputData: nextProps.InputData,change: true};
        /**如果是新增未保存的节点则在didUpdate中更新treelist*/
      } else if (prevState.selectedKeys[0].indexOf('unsavetreenodekey') > -1) {
        return {InputData: nextProps.InputData, change: true };
      }
    }
    /**树数据 */
    if (nextProps.treeData !== prevState.treeData) {
      return { treeData: nextProps.treeData };
    }
    /**外部其他数据 */
    if (
      nextProps.externalData !== prevState.externalData &&
      nextProps.type === 'DynamicTree') {
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
        return {treeData:tree};
      };
      searchData(prevState.selectedKeys[0], nextProps.treeData);
      /**如果是已存在节点则加入更新队列,需要在didUpdate中更新treelist*/
      if (nextProps.isCheck && prevState.selectedKeys[0] && prevState.selectedKeys[0].indexOf('unsavetreenodekey') === -1) {
        prevState.updateQueue.push(prevState.selectedKeys[0]);
        let updateQueue = Array.from(new Set(prevState.updateQueue));
        return { externalData: nextProps.externalData,updateQueue, change: true };
        /**如果是新增未保存的节点则在didUpdate中更新treelist*/
      } else if (nextProps.isCheck && prevState.selectedKeys[0] && prevState.selectedKeys[0].indexOf('unsavetreenodekey') > -1) {
        return { externalData: nextProps.externalData, change: true };
      }
      return { externalData: nextProps.externalData };
    }
    if (nextProps.checkedKeys !== prevState.checkedKeys){
      return { checkedKeys: nextProps.checkedKeys,  autoExpandParent: true };
    } 
    return null;
  }
  componentDidMount() {
  }
  componentWillUnmount() {

    this.props.setSelectData({ [this.props.type]: [] });
    this.props.setCheckData({ [this.props.type]: []});
  }
  componentDidUpdate(){
    const {updateQueue} = this.state;
    this.dataList=[];
    this.generateList(this.state.treeData);
    if (this.props.type==='DynamicTree'&&this.state.change) {
      this.props.setChangeData({ treeData:this.state.treeData , updateQueue });     //更新树数据之后，更新treeList
      this.setState({change:false});
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
      this.setState({deleteModal:true});
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
  isKeyInTree=(key,tree)=>{
    for (let index = 0; index < tree.length; index++) {
      const node = tree[index];
      if (node.key===key) {
        return  true;
      } else if (node.children) {
        this.isKeyInTree(key,node.children);
      }else{
        return false;
      }
    }
    return false;
  }
  /**
   * 右键增加
   */
  add = async() => {
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
          tree.push(newTreeNode(updateTree, selectKey,false));
        } else if (node.children) {
          if (node.children.some(item => item.key === selectKey)) {
            node.children.push(newTreeNode(updateTree, selectKey,false));
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
    await this.props.setChangeData({ treeData:this.state.treeData , addQueue});        //更新树数据之后，更新treeList
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
  addChild = async() => {
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
            node.children.push(newTreeNode(updateTree, selectKey ,node.disabled));
          } else {
            let children = {children: [newTreeNode(updateTree, selectKey, node.disabled)]};
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
    await searchData(this.state.rightSelectedKeys, treeData);
    addChildQueue.push(updateTree + 'unsavetreenodekey');
    await this.props.setChangeData({ treeData:this.state.treeData, addChildQueue });       //更新树数据之后，更新treeList
    console.log('当前', [getParentKey(updateTree + 'unsavetreenodekey', this.state.treeData)]);
    let expandedKeys = this.state.expandedKeys;
    expandedKeys.push(getParentKey(updateTree + 'unsavetreenodekey', this.state.treeData));
    await this.setState({ addChildQueue, expandedKeys});
    this.onSelect([updateTree + 'unsavetreenodekey']);
  };
  /**
   * 右键删除
   */
  delete = async() => {
    const {
      treeData,
      deleteQueue,
      updateQueue,
      addQueue,
      addChildQueue,
    } = this.state;
    // this.state.deleteNode();
    const searchData = (selectKey, tree) => {
      console.log(selectKey)
      postService(API_PREFIX + this.props.deleteUrl +'/'+ selectKey, '',data =>
      {
        if (data.retCode===1) {
         console.log('删除成功')
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
          deleteModal:false,
          treeData: trees,
          visible: null,
        });

        }else{
         this.state.deleteNode();
       
          Message.error(data.retMsg)
          this.setState({
            deleteModal:false,
            // treeData: trees,
            visible: null,
            queue:{}
          });
          return  false;
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
      await this.props.setChangeData({ treeData:this.state.treeData, addQueue });       //更新树数据之后，更新treeList
      this.setState({ addQueue });
      /**如果删除了还未保存的节点,如果在新增下级队列中，则直接把新增下级队列中当前任务删除*/
    } else if (addChildQueue.indexOf(this.state.rightSelectedKeys) > -1) {
      addChildQueue.splice(addChildQueue.indexOf(this.state.rightSelectedKeys),1);
      await this.props.setChangeData({ treeData:this.state.treeData, addChildQueue });    //更新树数据之后，更新treeList
      this.setState({ addChildQueue });
      /**如果删除了已存在的节点*/
    } else {
      /**如果当前节点在更新队列中,则把更新队列中当前节点删除，再加入删除队列 */
      if (updateQueue.indexOf(this.state.rightSelectedKeys) > -1) {
        updateQueue.splice(updateQueue.indexOf(this.state.rightSelectedKeys),1);
        deleteQueue.push(this.state.rightSelectedKeys);
        await this.props.setChangeData({ treeData: this.state.treeData, updateQueue, deleteQueue });    //更新树数据之后，更新treeList
        this.setState({ updateQueue, deleteQueue });
        /**如果当前节点不在更新队列中,直接加入删除队列 */
      } else {
        deleteQueue.push(this.state.rightSelectedKeys);
        await this.props.setChangeData({ treeData:this.state.treeData, deleteQueue });    //更新树数据之后，更新treeList
        this.setState({ deleteQueue });
      }
    }
    // this.state.deleteNode();
    // console.log(this.state.deleteNode)
  };
  /**
   * 右键停用/启用
   */
  isContinue = async(value) => {
    let disabled = value==='dis';
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
        if (startQueue.indexOf(this.state.rightSelectedKeys)>-1) { //如果之前在启用队列中
          startQueue.splice(startQueue.indexOf(this.state.rightSelectedKeys),1);
          stopQueue.push(this.state.rightSelectedKeys);
          await this.props.setChangeData({ treeData: this.state.treeData, stopQueue, startQueue });    //更新树数据之后，更新treeList
          this.setState({ startQueue,stopQueue });
        }else{
          stopQueue.push(this.state.rightSelectedKeys);
          await this.props.setChangeData({ treeData: this.state.treeData, stopQueue });    //更新树数据之后，更新treeList
          this.setState({  stopQueue });
        }
      } else { //启用
        if (stopQueue.indexOf(this.state.rightSelectedKeys) > -1) { //如果之前在停用队列中
          stopQueue.splice(stopQueue.indexOf(this.state.rightSelectedKeys), 1);
          startQueue.push(this.state.rightSelectedKeys);
          await this.props.setChangeData({ treeData: this.state.treeData, stopQueue, startQueue });    //更新树数据之后，更新treeList
          this.setState({ startQueue, stopQueue });
        } else{
          startQueue.push(this.state.rightSelectedKeys);
          await this.props.setChangeData({ treeData:this.state.treeData, startQueue });    //更新树数据之后，更新treeList
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
    console.log('1111111111111111',expandedKeys)
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
  onSelect =  async(selectedKeys, info) => {
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
    }else{
      await this.props.setSelectData({
        [this.props.type]: selectedKeys,
        selectDetail: [],
      });
      if (this.props.type ==='DynamicTree') {
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
    await this.props.setCheckData({
      [this.props.type]: checkedKeys,
      isCheck: true,
    });
    await this.onEvent();
  };
  onChange = e => {
    const value = e.target.value;
    const expandedKeys = this.dataList
      .map(item => {
        if (item.name.indexOf(value) > -1) {
          return getParentKey(item.key, this.state.treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
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
    const loop = data =>
      data.map(item => {
        const index = item.name&&item.name.indexOf(searchValue);
        const beforeStr = item.name &&item.name.substr(0, index);
        const afterStr = item.name&&item.name.substr(index + searchValue.length);
        const name =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50', verticalAlign: 'top' }}>
                {searchValue}
              </span>
              {afterStr}
            </span>
          ) : (
            <span>{item.name}</span>
          );
        if (item.children) {
          return (
            <TreeNode
              id={item.key}
              key={item.key}
              // disabled={disabledAll?true:false}
              disabled={this.props.disabled?true:this.props.style == "detail" ? true : this.props.type != 'DynamicTree' && this.props.type != 'column' ? !item.selectAble : false}
              title={
                <WrapperToolTip
                  powers={this.props.powers}
                  isContinue={!item.disabled}
                  visible={this.state.visible === item.key}
                  onClick={this.menuOption}
                  disable={!this.state.isLeaf}
                >
                  {name}
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
            // disabled={disabledAll?true:false}
            disabled={this.props.disabled?true:this.props.style == "detail" ? true : this.props.type != 'DynamicTree' && this.props.type != 'column' ? !item.selectAble : false}
            title={
              <WrapperToolTip
                powers={this.props.powers}
                isContinue={!item.disabled}
                visible={this.state.visible === item.key}
                onClick={this.menuOption}
                disable={!this.state.isLeaf}
              >
                {name}
              </WrapperToolTip>
            }
          />
        );
      });
    return (
      <div className="selectable-tree">
        <Search
          style={{ marginBottom: 8 }}
          placeholder="请输入关键字"
          onChange={this.onChange}
        />
        <Tree
          showLine
          onCheck={this.onCheck}
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          disabled={this.props.disabled}
          selectedKeys={this.props.selectTreeData[this.props.type]}
          checkedKeys={(this.props.checkable&&treeData&&treeData.length>0) ? this.props.checkedKeys : []}
          checkable={this.props.checkable}
          autoExpandParent={autoExpandParent}
          defaultCheckedKeys={this.props.defaultCheckedKeys}
          defaultSelectedKeys={this.props.defaultSelectedKeys}
          onSelect={this.props.selectable ? this.onSelect : null}
          onRightClick={
            this.props.rightClickable
              ? e => {
                let rightSelectedKeys = e.node.props.eventKey;
                /* let isLeaf = isleaf(
                  [rightSelectedKeys],
                  this.state.treeData,
                  !this.props.rootDisable
                ); */
                let isLeaf = getParentKey(rightSelectedKeys,this.state.treeData)?true:false;
                console.log('是否是非根叶子节点',isLeaf);
                this.setState({
                  visible: e.node.props.id,
                  rightSelectedKeys,
                  isLeaf,
                });
              }
              : null
          }
        >
          {powers ? (powers.read?
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



