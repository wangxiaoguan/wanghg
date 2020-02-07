import React, { Component } from 'react';
import { Tree, message, Spin, Input, Icon } from 'antd';
import RightMenu from './RightMenu';

import DetailEdit from './DetailEdit';
import { connect } from 'react-redux';
import API_PREFIX from '../../apiprefix';
import { getService, postService } from '../../myFetch';
import TreeControl from '../../../../utils/TreeControl';
import './index.less';
const moment = require('moment');

const Search = Input.Search;
const TreeNode = Tree.TreeNode;
const DirectoryTree = Tree.DirectoryTree;

/**
 * 工会组织管理
 */
@connect(
  state => ({ powers: state.powers })
)

export default class Organization extends Component {

  constructor(props) {
    super(props);

    this.treeControl = new TreeControl('id', 'unionOrgList');

    this.state = {
      showMenu: false,
      showClient: {

      },
      treeExplandKeys: [],    //展开的节点
      selectedNode: null,     //当前选中的部门数据
      treeData: null,         //部门的树形结构数据
      loadingData: false,     //是否正在加载部门列表中
      searchKey: null,        //搜索词
      searchNode: null,       //当前搜索出的部门列表
      orgIdsAll: window.sessionStorage.getItem('authorityUnionIds')?window.sessionStorage.getItem('authorityUnionIds'):false,
      orgIds: window.sessionStorage.getItem('authorityUnionIds')?window.sessionStorage.getItem('authorityUnionIds'):'',
    };
  }

  /**
   * 获取根据搜索条件，需要展开的节点
   */
  getExpandKeysBySearched() {
    let result = [];
    let searchNode = this.state.searchNode;
    if (searchNode && searchNode.length > 0) {
      for (let item of searchNode) {
        let id = item.parentId.toString();
        if (result.indexOf(id) < 0) {
          result.push(id);
        }
      }
    }
    return result;
  }

  searchTree(treeNodeList = null) {
    //通过关键字搜索所有结点的title，并返回一个一维数组，数组包含所有“title包含关键字"的结点 
    let key = this.state.searchKey;
    if (key && key.length > 0) {
      let result = [];
      if (treeNodeList === null) {
        treeNodeList = this.state.treeData;
      }
      if (treeNodeList && treeNodeList.length > 0) {
        for (let i = 0; i < treeNodeList.length; i++) {
          //循环结点，依次搜索title，如果包含，添加到结果中
          let node = treeNodeList[i];
          if (node.name.indexOf(key) >= 0) {
            result.push(node);
          }

          //如果有子结点，则搜索子结点
          if (node.unionOrgList && node.unionOrgList.length > 0) {
            let children = this.searchTree(node.unionOrgList);
            if (children.length > 0) {
              result.push.apply(result, children);
            }
          }
        }
      }
      return result;
    }
    return null;
  }

  componentDidMount() {
    this.requestAllData();
  }

  requestAllData() {
    this.setState({ loadingData: true });
    getService(API_PREFIX + 'services/web/union/org/getUnionOrgList/1', (res) => {
      if (res.status === 1) {
        //如果是当前无选中的节点，则设置为第一个节点
        this.state.treeData = res.root.object;
        if (this.state.selectedNode) {
          this.state.selectedNode = this.searchNodeById(this.state.selectedNode.id);
        }
        if (!this.state.selectedNode) {
          this.state.selectedNode = res.root.object[0];
          // this.DetailEdit.requestMemberData(res.root.object[0].id)
        }
        //展开选中结点的父结点 
        if (this.state.selectedNode) {
          this.state.treeExplandKeys = this.state.treeExplandKeys.concat([this.state.selectedNode.parentId.toString()]);
        }
        this.setState({ loadingData: false });
      }else {
          message.error(res.errorMsg);
          this.setState({ loadingData: false });
      }
    });
  }

  searchNodeById(id, treeData = null) {
    if (!treeData) {
      treeData = this.state.treeData;
    }
    if (treeData) {
      for (let i = 0; i < treeData.length; i++) {
        let node = treeData[i];
        if (node.id === id) {
          return node;
        } else if (node.unionOrgList && node.unionOrgList.length > 0) {
          let childResult = this.searchNodeById(id, node.unionOrgList);
          if (childResult) {
            return childResult;
          }
        }
      }
    }
    return null;
  }
  //删除工会组织
  deletePart(partData) {
    postService(API_PREFIX + `services/web/union/org/delete/${partData.id}`, null, this.afterChangedData);
  }

  /**
   * 启用部门
   * @param {} partData 
   */
  openPart(partData) {
    postService(
      API_PREFIX + `services/web/union/org/changeUnionOrgState/start`,
      [partData.id],
      this.afterChangedData);
  }

  /**
   * 停用
   * @param {*} partData 
   */
  stopPart(partData) {
    postService(
      API_PREFIX + `services/web/union/org/changeUnionOrgState/stop`,
      [partData.id],
      this.afterChangedData);
  }


  afterChangedData = (res) => {
    if (res.status === 1) {
      this.requestAllData();
    }
    else {
      message.error(res.errorMsg);
    }
  }
  /**
   * 移动组织位置
   * @param {*} partData 
   * @param {*} direction 0上移，1下移
   */
  movePart(partData, direction) {
    postService(
      API_PREFIX + `services/web/union/org/moveUnionOrg/${partData.parentId}/${partData.sortId}/${direction === 0 ? 0 : 1}`,
      null,
      this.afterChangedData);
  }

  onExpand = (e) => {
    this.state.treeExplandKeys = e;
    this.forceUpdate();
  }

  renderTree = () => {
    let data = this.state.treeData;
    if (data) {
      return (
        <Tree
          showLine
          autoExpandParent
          onExpand={this.onExpand}
          expandedKeys={this.state.treeExplandKeys}
          onRightClick={this.onRightClick}
          onSelect={this.onSelect}
          selectedKeys={this.state.selectedNode ? [this.state.selectedNode.id.toString()] : null}
          defaultExpandedKeys={this.state.treeExplandKeys}
        >
          {
            this.renderTreeNodeList(data)
          }
        </Tree>
      );
    }
    else {
      return <div>...</div>;
    }
  }

  renderTreeNodeList = (nodeList) => {
    let {orgIds, orgIdsAll} = this.state
    let result = [];
    for (let i = 0; i < nodeList.length; i++) {
      let disabled = !orgIdsAll ? false : orgIds && orgIds.indexOf(nodeList[i].id) == -1 ? true : false;
      let node = nodeList[i];
      //如果有关键词，把关键词变红
      let title = node.name;
      if (this.state.searchKey) {
        let index = title.indexOf(this.state.searchKey);
        if (index >= 0) {
          title = <span>{title.substring(0, index)}<span style={{ color: 'red', fontWeight: 'bold' }}>{this.state.searchKey}</span>{title.substring(index + this.state.searchKey.length)}</span>;
        }
      }
      // icon={<Icon type="smile-o" />}
      let item = (<TreeNode 
            // className={node.orgState === '0' ? 'treeNodeDisable' : ''} 
            disabled={disabled ? true :node.orgState === '0'?true:false}
            title={<span>{title}{node.orgState === '0' ? '(已停用)' : ''}</span>} key={node.id} data={node} isLeaf={node.leaf}>
        {
          node.unionOrgList && node.unionOrgList.length > 0 &&
          this.renderTreeNodeList(node.unionOrgList)
        }
      </TreeNode>);
      result.push(item);
    }
    return result;
  }


  onSelect = (keys, info) => {
    //console.log('info---', info)

    //变相销毁元素 不是很科学 
    this.setState({ selectedNode: null }, () => {
      this.setState({ selectedNode: info.node.props.data });
    });
    // console.log(this.state.selectedNode)
    this.DetailEdit.requestMemberData(info.node.props.data.id);
  }

  /**
   * 获取当前选中节点的父节点，如果未选中结点，返回null
   */
  getSelectedParentNode() {
    if (this.state.selectedNode) {
      return this.treeControl.searchParent(this.state.treeData, (node) => node.id === this.state.selectedNode.id);
    }
    return null;
  }

  onRightClick = ({ event, node }) => {
    let {orgIds, orgIdsAll} = this.state
    if (node) {
      this.setState({
        showMenu: !orgIdsAll ? true : orgIds && orgIds.indexOf(node.props.data.id) > -1 ? true : false,
        selectedNode: node.props.data,
        showClient: {
          pageX: event.clientX + 20,
          pageY: Math.min(event.clientY, window.document.body.clientHeight - 330),
        },
        newDetail: false,
      });
    }
  }

  /**
   * 判断指定结点是否有指定名称的子结点
   * @param {*} node 
   * @param {*} name 
   */
  hasSameChild(node, name) {
    let children = node.unionOrgList;
    if (children) {
      for (let item of children) {
        if (item.name === name) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 增加部门
   * @param {*} parentNode 父部门
   */
  addPart(parentNode) {
    console.log('parentNode', parentNode);
    let index = 1;
    let name = '新增组织' + index;

    //获取一个子级不存在的名称
    while (this.hasSameChild(parentNode, name)) {
      index++;
      name = '新增组织' + index;
    }

    postService(API_PREFIX + 'services/web/union/org/insert',
      {
        name,
        parentId: parentNode.id,
        treePath: parentNode.treePath,
        fullName: parentNode.fullName + '>' + name,
        instruction: '组织描述',
        orgState: 1,
      },
      (res) => {
        if (res.status == 1) {
          let orgIds = this.state.orgIds
          orgIds = orgIds ? orgIds + `,${res.root.object}` : res.root.object
          this.setState({ selectedNode: null, orgIds}, () => {
            this.state.selectedNode = { id: res.root.object };
          });
          this.requestAllData();
        }
        else {
          message.error(res.errorMsg);
        }
      });
  }

  renderRightMenu = () => {
    let node = this.state.selectedNode;
    const { powers = {} } = this.props;
    const showCreate = powers['20007.21704.001'];//新建
    const showMove = powers['20007.21704.002'];//修改
    const showRemove = powers['20007.21704.004'];//删除
    if (node) {
      const parentNode = this.getSelectedParentNode();
      const isRoot = parentNode === null;
      const index = this.treeControl.getIndex(this.state.treeData, (item) => item.id === node.id);
      const count = parentNode ? this.treeControl.getChildren(parentNode).length : 0;

      let menuData = [
        //无权限或根结点，禁用此菜单
        { key: '1', label: '增加', disabled: !showCreate || isRoot },
        //无权限或已禁用，禁用此菜单 
        { key: '7', label: '增加下级', disabled: !showCreate || node.orgState !== '1' },
        //无权限或根结点或是第一个子结点，禁用此菜单
        { key: '2', label: '上移', disabled: !showMove || isRoot || index === 0 },
        //无权限或根结点或是最后一个子结点，禁用此菜单  
        { key: '3', label: '下移', disabled: !showMove || isRoot || (index >= 0 && index === count - 1) },
        //无权限或根结点，禁用此菜单 
        { key: '6', label: '删除', disabled: !showRemove || isRoot },
        //根结点或已停用的，禁用此菜单
        { key: '4', label: '停用', disabled: isRoot || node.orgState !== '1' },
        //根结点或已启用的，禁用此菜单
        { key: '5', label: '启用', disabled: isRoot || node.orgState === '1' },
      ];

      //过滤掉禁用的菜单，只显示可用的菜单
      menuData = menuData.filter((item => !item.disabled));
      const { showMenu, showClient } = this.state;
      const props = {
        rightClickTreeItem: { ...showClient },
        menus: menuData,
        onMenuSelect: this.onRightMenuItemClick,
      };
      const menu = showMenu && <RightMenu {...props} />;
      return menu;
    }
    else {
      return null;
    }
  }

  onRightMenuItemClick = ({ key }) => {
    let node = this.state.selectedNode;
    switch (key) {
      case '1':
        {
          // this.setState({
          //   newDetail: true,
          // });
          let parentNode = this.getSelectedParentNode();
          this.addPart(parentNode ? parentNode : node);
          break;
        }
      case '2':
        this.movePart(node, 0);
        break;
      case '3':
        this.movePart(node, 1);
        break;
      case '4':
        this.stopPart(node);
        break;
      case '5':
        this.openPart(node);
        break;
      case '6':
        this.deletePart(node);
        break;
      case '7':
        // this.setState({
        //   newDetail: true,
        // });
        this.addPart(node);
        break;
    }
  }

  handleCloseMenu = () => {
    this.setState({ showMenu: false });
  }

  render() {
    // console.log(JSON.stringify(this.state.selectedNode))
    const newSuccess = () => {
      this.setState({
        newDetail: false,
      });
      this.requestAllData();
    };
    const { powers = {} } = this.props;
    let {orgIds, orgIdsAll} = this.state
    let disabled = !orgIdsAll ? true : this.state.selectedNode && orgIds.indexOf(this.state.selectedNode.id) > -1 ? true : false;
    const ModifyEnable = powers['20007.21704.002'] && disabled;
    let parentNode = this.getSelectedParentNode();
    return (
      <div className="Organization" onClick={this.handleCloseMenu}>
        <div className="left">
          <Spin spinning={this.state.loadingData} >
            <Search style={{ marginBottom: 8 }} placeholder="搜索" onChange={(event) => {
              this.setState({ searchKey: event.target.value }, () => {
                this.state.searchNode = this.searchTree();
                this.state.treeExplandKeys = this.getExpandKeysBySearched();
                this.forceUpdate();
              });
            }} />
            {this.renderTree()}
            {this.renderRightMenu()}
          </Spin>
        </div>
        {this.state.selectedNode !== null ?
          <DetailEdit
            className="right"
            orgInfo={{
              name: this.state.selectedNode.name,
              id: this.state.selectedNode.id,
              enable: this.state.selectedNode.orgState === "1",
              instruction: this.state.selectedNode.instruction,
              fullname: parentNode ? parentNode.fullName : '',
              treepath: this.state.selectedNode.treePath,
              parentid: this.state.selectedNode.parentId,
              modifyEnable: ModifyEnable,
            }}
            isNew={false}
            newCallback={newSuccess}
            wrappedRef={e => {
              this.DetailEdit = e;
            }}
          /> :
          <div />}
      </div>
    );
  }
}