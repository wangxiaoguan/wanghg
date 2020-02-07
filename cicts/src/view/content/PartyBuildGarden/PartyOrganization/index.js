import React, { Component } from 'react';
import { Tree, message, Spin, Input, Button } from 'antd';
import RightMenu from './RightMenu';

import DetailEdit from './DetailEdit';
import { connect } from 'react-redux';
import API_PREFIX from '../../apiprefix';
import { getService, postService, exportExcelService } from '../../myFetch';
import TreeControl from '../../../../utils/TreeControl';
import './index.less';

const Search = Input.Search;
const TreeNode = Tree.TreeNode;
const DirectoryTree = Tree.DirectoryTree;

/**
 * 工会组织管理
 */
@connect(
  state => ({
    powers: state.powers,
    partyId: state.head.headPartyIdData,
  })
)

export default class Organization extends Component {

  constructor(props) {
    super(props);

    this.treeControl = new TreeControl('id', 'partyOrgList');

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
      myCheckedKeys: [],       //导出表格的组织id列表
      partyId: this.props.partyId || -1,          //登陆人员职务切换对应的组织id
      reportExcel: false,
      dutieStatu: false,
      levelData: []
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
          if (node.partyName.indexOf(key) >= 0) {
            result.push(node);
          }

          //如果有子结点，则搜索子结点
          if (node.partyOrgList && node.partyOrgList.length > 0) {
            let children = this.searchTree(node.partyOrgList);
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
    this.setState({ partyId: this.props.partyId })
    console.log('哈行i哈哈哈哈哈哈哈', this.props)
    if (JSON.stringify(this.props.partyId) !== "{}") {
      this.requestAllData(this.props.partyId)
    }
    getService(API_PREFIX + 'services/web/party/partyOrganization/getPartyOrgLevels', res => {
      if(res.status == 1) {
          this.setState({levelData: res.root.object})
      }
    })
    // this.requestAllData(-1)
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.partyId != nextProps.partyId) {
      this.setState({
        partyId: nextProps.partyId,
      })
      this.requestAllData(nextProps.partyId)
    }
  }
  requestAllData(partyId) {
    this.setState({ loadingData: true });
    getService(API_PREFIX + `services/web/party/partyOrganization/getAuthOrg/${partyId}?Q=partyOrgStatus=0,1`, (res) => {
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
          let parentId = this.state.selectedNode.parentId
          this.state.treeExplandKeys = this.state.treeExplandKeys.concat([parentId == '-1' ? this.state.selectedNode.id.toString() : parentId.toString()]);
        }
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
        } else if (node.partyOrgList && node.partyOrgList.length > 0) {
          let childResult = this.searchNodeById(id, node.partyOrgList);
          if (childResult) {
            return childResult;
          }
        }
      }
    }
    return null;
  }

  deletePart(partData) {
    if (partData.memCount > 0 || this.state.dutieStatu) {
      message.error('当前组织下有党员或职务存在，不可删除');
      return;
    }
    postService(API_PREFIX + `services/web/party/partyOrganization/delete`, [partData.id], this.afterChangedData);
  }

  /**
   * 启用部门
   * @param {} partData 
   */
  openPart(partData) {
    postService(
      API_PREFIX + 'services/web/party/partyOrganization/disconnected/1',[partData.id],
      this.afterChangedData);
  }

  /**
   * 停用
   * @param {*} partData 
   */
  stopPart(partData) {
    if (partData.memCount > 0 || this.state.dutieStatu) {
      message.error('当前组织下有党员或职务存在，不可停用');
      return;
    }
    postService(
      API_PREFIX + 'services/web/party/partyOrganization/disconnected/0',[partData.id],
      this.afterChangedData);
  }


  afterChangedData = (res) => {
    if (res.status === 1) {
      this.requestAllData(this.state.partyId);
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
    console.log(partData)
    postService(
      API_PREFIX + `services/web/party/partyOrganization/movePartyOrganization/${partData.parentId}/${partData.sortId}/${direction === 0 ? 0 : 1}`,
      null,
      res => {
        if (res.status == 1) {
          message.success('操作成功')
          this.requestAllData(this.state.partyId)
        } else {
          message.success('移动组织失败')
        }
      });
  }

  onExpand = (e) => {
    this.state.treeExplandKeys = e;
    this.forceUpdate();
  }
  onCheck = (keys) => {
    this.setState({ myCheckedKeys: keys });
  }
  renderTree = () => {
    let data = this.state.treeData;
    if (data) {
      return (
        <Tree
          showLine
          checkable
          // autoExpandParent
          onExpand={this.onExpand}
          expandedKeys={this.state.treeExplandKeys}
          onRightClick={this.onRightClick}
          onSelect={this.onSelect}
          onCheck={this.onCheck}
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

console.log("nodeList===>",nodeList)


    let result = [];
    for (let i = 0; i < nodeList.length; i++) {
      let node = nodeList[i];
      //如果有关键词，把关键词变红
      let title = node.partyName;
      if (this.state.searchKey) {
        let index = title.indexOf(this.state.searchKey);
        if (index >= 0) {
          title = <span>{title.substring(0, index)}<span style={{ color: 'red', fontWeight: 'bold' }}>{this.state.searchKey}</span>{title.substring(index + this.state.searchKey.length)}</span>;
        }
      }
      // className={node.partyOrganizationState === '0' ? 'treeNodeDisable' : ''}   //修改为启用
      let item = (<TreeNode   disabled={node.partyOrgStatus == '0'?true:false}     title={<span>{title}{node.partyOrgStatus == '0' ? '(已停用)' : ''}</span>} key={node.id} data={node} isLeaf={node.leaf}>
        {
          node.partyOrgList && node.partyOrgList.length > 0 &&
          this.renderTreeNodeList(node.partyOrgList)
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
    if (node) {
      this.setState({
        showMenu: true,
        // selectedNode: node.props.data,
        showClient: {
          pageX: event.clientX + 20,
          pageY: Math.min(event.clientY, window.document.body.clientHeight - 330),
        },
        newDetail: false,
        selectedNode: null
      }, () => {
        this.setState({ selectedNode:node.props.data });
      });
      this.DetailEdit.requestMemberData(node.props.data.id);
    }
  }

  /**
   * 增加部门
   * @param {*} parentNode 父部门
   */
  addPart(parentNode) {
    const partyName = '新增组织';
    postService(API_PREFIX + 'services/web/party/partyOrganization/insert',
      {
        partyName,
        parentId: parentNode.id,
        treePath: parentNode.treePath,
        fullName: parentNode.fullName + '>' + partyName,
        instruction: '组织描述',
        partyOrgStatus: 1,
      },
      (res) => {
        this.setState({ selectedNode: null }, () => {
          this.state.selectedNode = { id: res.root.object.id };
        });
        this.requestAllData(this.state.partyId);
      });
  }

  renderRightMenu = () => {
    let node = this.state.selectedNode;
    console.log('-------parentNode-------', this.getSelectedParentNode())
    let parentNode = this.getSelectedParentNode()
    const { powers = {} } = this.props;
    const showCreate = powers['20005.23002.001'];
    const showMove = powers['20005.23002.002'] ;
    const showRemove = powers['20005.23002.004'];
    if (node) {
      let menuDataTemp = [];
      menuDataTemp = menuDataTemp.concat([
        { key: '1', label: '增加', disabled: false },
        { key: '7', label: '增加下级', disabled: false },
        // { key: '2', label: '上移', disabled: false },
        // { key: '3', label: '下移', disabled: false },
        // { key: '4', label: '停用', disabled: false },
        { key: '6', label: '删除', disabled: false },
      ]);
      const accessList = [
        showCreate,
        showCreate,
        showMove,
        showMove,
        showRemove,
      ];
      let menuData = [];
      for (let i = 0; i < menuDataTemp.length; i++) {
        //如果有对应的权限，则添加菜单
        if (accessList[i]) {
          //是第一项，则需要额外判断是否是非根结点
          if (i > 0 || this.getSelectedParentNode()) {
            menuData.push(menuDataTemp[i]);
          }
        }
      }
      //如果选中的节点是第一个节点，不显示上移，如果是最后一个则不显示下移
      if (showMove && parentNode) {
        if(parentNode.partyOrgList && parentNode.partyOrgList.length == 1) {

        } else if (parentNode.partyOrgList[0].id == node.id) {
          menuData.push({ key: '3', label: '下移', disabled: false });
        } else if (parentNode.partyOrgList[parentNode.partyOrgList.length - 1].id == node.id) {
          menuData.push({ key: '2', label: '上移', disabled: false });
        } else {
          menuData.push({ key: '2', label: '上移', disabled: false });
          menuData.push({ key: '3', label: '下移', disabled: false });
        }
      }
      //过滤菜单,如果当前选中的结点已禁用，则显示启用；反之显示禁用
      if (showMove) {
        if (node.partyOrgStatus == '1') {
          menuData.push({ key: '4', label: '停用', disabled: false });
        }
        else if (node.partyOrgStatus == '0') {
          menuData.push({ key: '5', label: '启用', disabled: false });
        }
      }
      // if(showRemove) {
      //   if(node.memCount == '0') {
      //     menuData.push({ key: '6', label: '删除', disabled: false },)
      //   }
      // }
      if (showMove && node.parentId == '-1') {
        menuData = [{ key: '7', label: '增加下级', disabled: false }]
      }
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
  exportEcel = async () => {
    let path = `${API_PREFIX}services/web/party/partyOrganization/exportPartyOrg`
    // let path = `http://10.44.2.99:8080/web/party/partyOrganization/exportPartyOrg`
    if (this.state.myCheckedKeys.length <= 0) {
      message.error('请选择党组织导出')
      return
    }
    this.setState({ reportExcel: true })
    let res = await exportExcelService(path, this.state.myCheckedKeys, '党组织树信息')
    this.setState({ reportExcel: res })
  }
  getDutieStatu = (v) => {
    this.setState({ dutieStatu: v })
  }
  render() {
    // console.log(JSON.stringify(this.state.selectedNode))
    const newSuccess = () => {
      this.setState({
        newDetail: false
      })
      this.requestAllData(this.state.partyId)
    };
    const { powers = {} } = this.props;
    const ModifyEnable = powers['20005.23002.002'];
    const exportExcel = powers && powers['20005.23002.202'] ;
    let parentNode = this.getSelectedParentNode();
    return (
      <div className="partyOrganization" onClick={this.handleCloseMenu}>
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
          {
            exportExcel ? <Button className='exportExcel' disabled={this.state.reportExcel} onClick={this.exportEcel} type='default' >导出EXCEL</Button> : null
          }
        </div>
        {this.state.selectedNode ?
          <DetailEdit
            className="right"
            getDutieStatu={this.getDutieStatu}
            orgInfo={{
              partyName: this.state.selectedNode.partyName,
              id: this.state.selectedNode.id,
              enable: this.state.selectedNode.partyOrgStatus == 1,
              instruction: this.state.selectedNode.instruction,
              fullName: parentNode ? parentNode.fullName : '',
              treePath: this.state.selectedNode.treePath,
              parentId: this.state.selectedNode.parentId,
              memCount: this.state.selectedNode.memCount,
              // sortid: this.state.selectedNode.sortid,
              modifyEnable: ModifyEnable,
              changeDate: this.state.selectedNode.changeDate,
              partyLevel: this.state.selectedNode.partyLevel,
            }}
            parentNode={parentNode ? parentNode : null}
            isNew={false}
            newCallback={newSuccess}
            wrappedRef={e => {
              this.DetailEdit = e;
            }}
            levelData={this.state.levelData}
          /> :
          <div />}
      </div>
    );
  }
}