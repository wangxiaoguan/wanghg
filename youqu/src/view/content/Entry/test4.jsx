import React, { Component } from 'react';
import TreeList from '../../component/tree/TreeList';
import { connect } from 'react-redux';
import { Tree, Input } from 'antd';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;



const treeData = [];

const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children, node.key);
    }
  }
};
generateList(treeData);

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

export default class SearchTree extends React.Component {
  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  };
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  onChange = e => {
    const value = e.target.value;
    const expandedKeys = dataList
      .map(item => {
        if (item.key.indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
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
    console.log('dataList', dataList);
    console.log('expandedKeys', expandedKeys);
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.key} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={title} />;
      });
    return <div>
      <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
      <Tree onExpand={this.onExpand} expandedKeys={expandedKeys} autoExpandParent={autoExpandParent}>
        {loop(treeData)}
      </Tree>
    </div>;
  }
}