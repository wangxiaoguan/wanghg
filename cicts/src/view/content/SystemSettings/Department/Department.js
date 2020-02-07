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
  })
)

export default class Department extends Component {

  constructor(props) {
    super(props);

    this.treeControl = new TreeControl('id', 'subCompanyOrgList');

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
      partyId: null,          //登陆人员职务切换对应的组织id
      reportExcel: false,
      dutieStatu: false,
      orgIdsAll: window.sessionStorage.getItem('authorityOrgIds')?window.sessionStorage.getItem('authorityOrgIds'):false,
      orgIds: window.sessionStorage.getItem('authorityOrgIds')?window.sessionStorage.getItem('authorityOrgIds'):'',
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
        let id = item.parent.toString();
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
          if (node.subCompanyOrgList && node.subCompanyOrgList.length > 0) {
            let children = this.searchTree(node.subCompanyOrgList);
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
    getService(API_PREFIX + `services/web/company/org/orgList/get?Q=isAll=${true}&Q=haveUsers=${false}`, (res) => {
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
            let node = this.state.selectedNode
            if(node.parent == '-1') {
                this.state.treeExplandKeys = this.state.treeExplandKeys.concat([node.id.toString()]);
            }else {
                this.state.treeExplandKeys = this.state.treeExplandKeys.concat([node.parent.toString()]);
            }
        }
        this.setState({ loadingData: false });
      }else {
          message.error(res.errorMsg);
          this.setState({loadingData: false});
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
        } else if (node.subCompanyOrgList && node.subCompanyOrgList.length > 0) {
          let childResult = this.searchNodeById(id, node.subCompanyOrgList);
          if (childResult) {
            return childResult;
          }
        }
      }
    }
    return null;
  }
  //删除部门
  deletePart(partData) {
    getService(API_PREFIX + `services/web/company/org/deleteCompanyOrg/${partData.id}`,  this.afterChangedData);
  }

  /**
   * 启用/停用 部门
   * @param {} partData 
   */
  updatePartState(partData, state) {
    postService(
      API_PREFIX + 'services/web/company/org/updateCompanyOrgState',
      {
        id: partData.id,
        organizationState: state,
      },
      this.afterChangedData);
  }

  /**
   * 停用
   * @param {*} partData 
   */
//   stopPart(partData) {
//     postService(
//       API_PREFIX + 'services/web/company/org/updateCompanyOrgState',
//       {
//         id: partData.id,
//         organizationState: '0',
//       },
//       this.afterChangedData);
//   }


  afterChangedData = (res) => {
    if (res.status == 1) {
        message.success('操作成功！')
      this.requestAllData();
    }
    else {
      message.error(res.errorMsg);
    }
  }
  /**
   * 移动组织位置
   * @param {*} partData 
   * @param {*} direction 1上移，2下移
   */
  movePart(partData, direction) {
    console.log(partData);
    postService(
      API_PREFIX + `services/web/company/org/moveIndexCompanyOrg/${direction === 0 ? 1 : 2}/${partData.id}`,
      null,
      res => {
        if (res.status != 1) {
          message.error('移动组织失败');
        } else {
          message.success('操作成功');
          this.requestAllData(this.state.partyId);
        }
      });
  }

  onExpand = (e) => {
    this.state.treeExplandKeys = e;
    this.forceUpdate();
  }
  onCheck = (keys) => {
    let arr = [];
    keys.forEach(item => {
      arr.push(parseInt(item));
    });
    this.setState({ myCheckedKeys: arr });
  }
  renderTree = () => {
    let data = this.state.treeData;
    if (data && data.length > 0) {
      return (
        <Tree
          showLine
          // checkable
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
      // className={node.organizationState === '0' ? 'treeNodeDisable' : ''}   //修改为启用
      let item = (<TreeNode   disabled={disabled ? true : node.organizationState === '0'?true:false}     title={<span>{title}{node.organizationState === '0' ? '(已停用)' : ''}</span>} key={node.id} data={node} isLeaf={node.leaf}>
        {
          node.subCompanyOrgList && node.subCompanyOrgList.length > 0 &&
          this.renderTreeNodeList(node.subCompanyOrgList)
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
    // this.DetailEdit.requestMemberData(info.node.props.data.id);
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
    console.log('11111111111111111111111111',orgIds,node.props.data.id,)
    if (node) {
      this.setState({
        showMenu: !orgIdsAll ? true : orgIds && orgIds.indexOf(node.props.data.id) > -1 ? true : false,
        // selectedNode: node.props.data,
        showClient: {
          pageX: event.clientX + 20,
          pageY: Math.min(event.clientY, window.document.body.clientHeight - 330),
        },
        newDetail: false,
        selectedNode: null,
      }, () => {
        this.setState({ selectedNode:node.props.data });
      });
    //   this.DetailEdit.requestMemberData(node.props.data.id);
    }
  }

  /**
   * 判断指定结点是否有指定名称的子结点
   * @param {*} node 
   * @param {*} name 
   */
  hasSameChild(node, name) {
    let children = node.subCompanyOrgList;
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
    let index = 1;
    let name = '新增组织' + index;

    //获取一个子级不存在的名称
    while (this.hasSameChild(parentNode, name)) {
      index++;
      name = '新增组织' + index;
    }
    postService(API_PREFIX + 'services/web/company/org/addSubCompanyOrg',
      {
        name,
        parent: parentNode.id,
        // treepath: parentNode.treepath,
        fullName: parentNode.fullName + '>' + name,
        // instruction: '部门说明',
        organizationState: 1,
      },
      (res) => {
          if(res.status == 1){
              message.success('新增部门成功!')
              let orgIds = this.state.orgIds
              orgIds = orgIds ? orgIds + `,${res.root.object.id}` : res.root.object.id
            this.setState({ selectedNode: null, orgIds, }, () => {
                this.state.selectedNode = { id: res.root.object.id };
            });
            this.requestAllData();
          }else {
              message.error(res.errorMsg);
          }
      });
  }

  renderRightMenu = () => {
    let node = this.state.selectedNode;
    console.log('-------Node-------', node);
    let parentNode = this.getSelectedParentNode();
    console.log('-------parentNode-------', parentNode);
    const { powers = {} } = this.props;
    // let powers = this.props.powers;
    // let create = powers && powers['20001.21005.001'];
    // let update = powers && powers['20001.21005.002'];
    // let read = powers && powers['20001.21005.003'];
    // let deletes = powers && powers['20001.21005.004'];
    const showCreate = powers['20004.21501.001'];//新建
    const showMove = powers['20004.21501.002'];//修改
    const showRemove = powers['20004.21501.004'];//删除
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
        if (parentNode.subCompanyOrgList[0].id == node.id && parentNode.subCompanyOrgList.length != 1) {
          menuData.push({ key: '3', label: '下移', disabled: false });
        } else if (parentNode.subCompanyOrgList[parentNode.subCompanyOrgList.length - 1].id == node.id && parentNode.subCompanyOrgList.length != 1) {
          menuData.push({ key: '2', label: '上移', disabled: false });
        } else if(parentNode.subCompanyOrgList.length > 1) {
          menuData.push({ key: '2', label: '上移', disabled: false });
          menuData.push({ key: '3', label: '下移', disabled: false });
        }
      }
      //过滤菜单,如果当前选中的结点已禁用，则显示启用；反之显示禁用
      if (showMove) {
        if (node.organizationState == '1') {
          menuData.push({ key: '4', label: '停用', disabled: false });
        }
        else if (node.organizationState == '0') {
          menuData.push({ key: '5', label: '启用', disabled: false });
        }
      }
      // if(showRemove) {
      //   if(node.memCount == '0') {
      //     menuData.push({ key: '6', label: '删除', disabled: false },)
      //   }
      // }
      if (node.parent == '-1') {
        menuData = [{ key: '7', label: '增加下级', disabled: false }];
      }
      const { showMenu, showClient } = this.state;
      console.log('我们都是一家人', showMenu)
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
        this.updatePartState(node, '0');
        break;
      case '5':
        this.updatePartState(node, '1');
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
    let path = `${API_PREFIX}services/system/partyOrganization/exportDatas`;
    if (this.state.myCheckedKeys.length <= 0) {
      message.error('请选择党组织导出');
      return;
    }
    this.setState({ reportExcel: true });
    let res = await exportExcelService(path, this.state.myCheckedKeys, '党组织树信息');
    this.setState({ reportExcel: res });
  }
  getDutieStatu = (v) => {
    this.setState({ dutieStatu: v });
  }
  render() {
    // console.log(JSON.stringify(this.state.selectedNode))
    const newSuccess = () => {
      this.setState({
        newDetail: false,
      });
      this.requestAllData(this.state.partyId);
    };
    const { powers = {} } = this.props;
    let {orgIds, orgIdsAll} = this.state
    let disabled = !orgIdsAll ? true : this.state.selectedNode && orgIds.indexOf(this.state.selectedNode.id) > -1 ? true : false;
    console.log('99999999999999999999999999999999999999999999', this.state.selectedNode &&orgIds.indexOf(this.state.selectedNode.id) > -1)
    const ModifyEnable = powers['20004.21501.002'] && disabled;//修改
    const exportExcel = powers && powers['20004.21501.202'];//导出
    let parentNode = this.getSelectedParentNode();
    return (
      <div className="departmentManagement" onClick={this.handleCloseMenu}>
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
          {/* {
            exportExcel ? <Button className='exportExcel' disabled={this.state.reportExcel} onClick={this.exportEcel} type='default' >导出EXCEL</Button> : null
          } */}
        </div>
        {this.state.selectedNode ?
          <DetailEdit
            className="right"
            getDutieStatu={this.getDutieStatu}
            orgInfo={{
              name: this.state.selectedNode.name,
              id: this.state.selectedNode.id,
              enable: this.state.selectedNode.organizationState === "1" ? false : true,
              instruction: this.state.selectedNode.instruction,
              fullname: parentNode ? parentNode.fullName : '',
            //   treepath: this.state.selectedNode.treepath,
            //   parentid: this.state.selectedNode.parentid,
            //   memCount: this.state.selectedNode.memCount,
              // sortid: this.state.selectedNode.sortid,
              modifyEnable: ModifyEnable,
              organizationState: this.state.selectedNode.organizationState,
              isEnable: this.state.selectedNode.isEnable,
              showIndex: this.state.selectedNode.showIndex,
              nickName: this.state.selectedNode.nickName,
              parentid: this.state.selectedNode.parent,
            }}
            parentNode={parentNode}
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