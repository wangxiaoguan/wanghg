/*
 * @Desc: 单位/部门树
 * @Author: Jackie
 * @Date: 2018-10-26 10:39:38
 * @Last Modified by: Jackie
 * @Last Modified time: 2018-10-26 11:46:19
 */
import React from 'react';
import { Card, Tree } from 'antd';
import styles from './index.less';

const { TreeNode } = Tree;

const TreeDept = ({
  group = [],
  groupMap = {},
  selectedKeys = [],
  onSelect,
  onRightClick,
  topTitle = '',
  loading,
}) => {
  const onRightPress = e => {
    const { eventKey, title } = e.node.props;
    const { pageX, pageY } = e.event;
    const treeNodeItem = {
      pageX,
      pageY,
      eventKey,
      title,
    };
    if (onRightClick) onRightClick(treeNodeItem, groupMap[eventKey]);
  };

  const selectKeys = [];
  group.map(item => {
    const key = item.code;
    selectKeys.push(`${key}`);
    return undefined;
  });

  const renderTree = () => {
    const loop = data =>
      data.map(item => {
        if (item) {
          if (item.children) {
            return (
              <TreeNode key={item.code} title={item.orgName}>
                {loop(item.children)}
              </TreeNode>
            );
          }
          return <TreeNode key={item.code} title={item.orgName} />;
        }
        return undefined;
      });
    return (
      <Tree
        showLine
        autoExpandParent={false}
        defaultExpandedKeys={[selectKeys[0]]}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        onRightClick={onRightPress}
      >
        {loop(group)}
      </Tree>
    );
  };

  return (
    <Card className={styles.cardContent} title={topTitle} loading={loading}>
      {renderTree()}
    </Card>
  );
};

export default TreeDept;
