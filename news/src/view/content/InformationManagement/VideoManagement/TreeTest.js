import { Tree } from 'antd';
import React, { Component } from 'react';
const TreeNode = Tree.TreeNode;



export default class Demo extends Component{
  constructor(props){
    super(props);
    this.state={
      expandedKeys: [],//展开节点的key值
      checkedKeys: [],//默认选中的节点/

    }
  }
  onCheck=(checkedKeys)=>{
    console.log('checkedKeys',checkedKeys);
    this.setState({checkedKeys});

  }
  onExpand=(expandedKeys)=>{
    this.setState({expandedKeys});
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
      return <TreeNode {...item} />;

    });
  }

  render() {
    console.log('this.state.checkedKeys',this.state.checkedKeys);
    const {treeData,defaultSelected}=this.props;
    return (
        <Tree
            checkable
            onCheck={this.onCheck}
            defaultCheckedKeys= {defaultSelected}
        >
          {this.renderTreeNodes(treeData)}
        </Tree>
    );
  }
}