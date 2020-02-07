import React, { Component } from 'react';
import { Tree, Input, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { setSelectTreeData, setCheckTreeData, setChangeData } from '../../../redux-root/action/tree/tree';
import './TreeList.less';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

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

@connect(
  state => ({
    AllTreeData: state.tree.treeCheckData,    
    selectTreeData: state.tree.treeSelectData,
    isCheck: state.tree.treeCheckData.isCheck,
    selectDetail: state.tree.treeSelectData.selectDetail,
    authInfo:state.authInfo
  }),
  dispatch => ({
    setSelectData: n => dispatch(setSelectTreeData(n)),
    setCheckData: n => dispatch(setCheckTreeData(n)),
    setChangeData: n => dispatch(setChangeData(n)),
  })
)
export default class InfoTreeList extends Component {
  constructor(props) {
    super(props);
    this.dataList = [];
    this.state = {
      treeData: this.props.treeData,
      checkedKeys: this.props.checkedKeys,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.treeData !== prevState.treeData) {
      return { treeData: nextProps.treeData };
    }
    if (nextProps.checkedKeys !== prevState.checkedKeys) {
      return { checkedKeys: nextProps.checkedKeys, autoExpandParent: true };
    }
    return null;
  }
 
  componentWillUnmount() {

    this.props.setSelectData({ [this.props.type]: [] });
    this.props.setCheckData({ [this.props.type]: [] });
  }

  componentDidUpdate() {
    this.dataList = [];
    this.generateList(this.state.treeData);
  }

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

  onCheck = async (checkedKeys, info) => {
    // if(this.props.type === 'column'){
    //     await this.props.setCheckData({
    //         [this.props.type]:checkedKeys,
    //         isCheck: true,
    //     });
    // }else if(this.props.type === 'partys'){
    //     await this.props.setCheckData({
    //         [this.props.type]:checkedKeys,
    //         isCheck: true,
    //     });
    // }else{
    //     let selectKeys = []
    //     info.checkedNodes.map(item=>{
    //         if(!item.props.children){
    //             selectKeys.push(item.key)
    //         }
    //     })
    //     await this.props.setCheckData({
    //         [this.props.type]:selectKeys,
    //         isCheck: true,
    //     });
    // }
    await this.props.setCheckData({
      [this.props.type]:checkedKeys,
      isCheck: true,
  });
    await this.onEvent();
  };

  onChange = (value,e) => {
    e.preventDefault();
    e.stopPropagation();
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
    let orgIds = window.sessionStorage.getItem('authorityOrgIds')?window.sessionStorage.getItem('authorityOrgIds'):false
    let partyIds = window.sessionStorage.getItem('authorityPartyIds')?window.sessionStorage.getItem('authorityPartyIds'):false
    let GroupIds = window.sessionStorage.getItem('authorityGroupIds')?window.sessionStorage.getItem('authorityGroupIds'):false
    let UnionIds = window.sessionStorage.getItem('authorityUnionIds')?window.sessionStorage.getItem('authorityUnionIds'):false

    if(orgIds !== 'no'&&orgIds){
      orgIds = orgIds.split(',')
    }
    if(partyIds !== 'no'&&partyIds){
      partyIds = partyIds.split(',')
    }
    if(GroupIds !== 'no'&&GroupIds){
      GroupIds = GroupIds.split(',')
    }
    if(UnionIds !== 'no'&&UnionIds){
      UnionIds = UnionIds.split(',')
    }
    let powers = this.props.powers;
    let disabled = this.props.disabled;
    let InfoColumn = this.props.InfoColumn;
    const { searchValue, autoExpandParent, expandedKeys, treeData, } = this.state;
    const loop = data =>
    data&&data.map(item => {
        const index = item.name && item.name.indexOf(searchValue);
        const beforeStr = item.name && item.name.substr(0, index);
        const afterStr = item.name && item.name.substr(index + searchValue.length);
        const name = index > -1 ? (<span>{beforeStr}<span style={{ color: '#f50', verticalAlign: 'middle' }}>{searchValue}</span>{afterStr}</span>) : (<span>{item.name}</span>);
        
        let isFalse = false
        if(this.props.type ==='department_join'&&orgIds){
          isFalse = orgIds==='no'?true:orgIds.indexOf(item.id)>-1?false:true
        }
        if(this.props.type ==='partyid_join'&&partyIds){
          isFalse = partyIds==='no'?true:partyIds.indexOf(item.id)>-1?false:true
        }
        if(this.props.type ==='virtualgroupid_join'&&GroupIds){
          isFalse = GroupIds === 'no'?true:GroupIds.indexOf(item.id)>-1?false:true
        }
        if(this.props.type ==='union_join'&&UnionIds){
          isFalse = UnionIds==='no'?true: UnionIds.indexOf(item.id)>-1?false:true
        }
        // if(this.props.type ==='company_join'){
        //   isFalse = UnionIds.indexOf(item.id)>-1?false:true
        // }
        
        if (item.children) {
          return (
            disabled?<TreeNode id={item.key} key={item.key} title={name}>{loop(item.children)}</TreeNode>:
                    <TreeNode id={item.key} key={item.key} title={name} disabled={isFalse}>{loop(item.children)}</TreeNode>
          );
        }
       
        return (
          disabled?<TreeNode id={item.key} key={item.key} title={name}/>:item.noLower?<TreeNode id={item.key} key={item.key} title={name} disabled />:
                  <TreeNode id={item.key} key={item.key} title={name} disabled={isFalse}/>
        );
      });
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
          checkedKeys={(this.props.checkable && treeData && treeData.length > 0) ? this.props.checkedKeys : []}
          checkable={this.props.checkable}
          autoExpandParent={autoExpandParent}
        >
          {powers ? (powers.read ? loop(treeData) : null) : loop(treeData)}
        </Tree>
      </div>
    );
  }
}



