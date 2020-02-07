import React, { Component } from 'react';
import { Tree, message, Spin, Input, Button,Tabs  } from 'antd';

import DetailEdit from './DetailEdit';
import { connect } from 'react-redux';
import API_PREFIX from '../../apiprefix';
import { getService, postService, exportExcelService } from '../../myFetch';
import TreeControl from '../../../../utils/TreeControl';
import '../oprativereport.less';
import PublishModal from './PublishModal';
// import './index.less';
const { TabPane } = Tabs;
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

export default class DepartmentActionData extends Component {

  constructor(props) {
    super(props);

    this.treeControl = new TreeControl('id', 'partyOrganizationList');

    this.state = {
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
      levelData: [], //组织级别下拉框数据
      tabKey: 1,
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
    if(this.state.tabKey == 4){//设置定时任务
      getService(API_PREFIX + 'services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false&Q=isSendedEmail=1', (res) => {
        if (res.status === 1) {
          //如果是当前无选中的节点，则设置为第一个节点
          this.state.treeData = res.root.object;
          if (this.state.selectedNode) {
            this.state.selectedNode = this.searchNodeById(this.state.selectedNode.id);
          }
          if (!this.state.selectedNode) {
            this.state.selectedNode = res.root.object[0];
            // this.DetailEdit.requestMemberData(res.root.list[0].id)
          }
          //展开选中结点的父结点 
          if (this.state.selectedNode) {
            this.state.treeExplandKeys = this.state.treeExplandKeys.concat([this.state.selectedNode.parent.toString()]);
          }
          this.setState({ loadingData: false });
        }
      });
    }else{//部门情况,经理人及干部情况,不活跃员工
      getService(API_PREFIX + 'services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false', (res) => {
        if (res.status === 1) {
          //如果是当前无选中的节点，则设置为第一个节点
          this.state.treeData = res.root.object;
          if (this.state.selectedNode) {
            this.state.selectedNode = this.searchNodeById(this.state.selectedNode.id);
          }
          if (!this.state.selectedNode) {
            this.state.selectedNode = res.root.object[0];
            // this.DetailEdit.requestMemberData(res.root.list[0].id)
          }
          //展开选中结点的父结点 
          if (this.state.selectedNode) {
            this.state.treeExplandKeys = this.state.treeExplandKeys.concat([this.state.selectedNode.parent.toString()]);
          }
          this.setState({ loadingData: false });
        }
      });
    }
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
    if (data) {
      return (
        <Tree
          showLine
        //   checkable
          autoExpandParent
          onExpand={this.onExpand}
          expandedKeys={this.state.treeExplandKeys}
          onSelect={this.onSelect}
        //   onCheck={this.onCheck}
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
    let result = [];
    for (let i = 0; i < nodeList.length; i++) {
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
      let item = (<TreeNode title={<span>{title}{node.sendedEmail === '1' ?<span style={{color:'#FF8A01'}}>(已设置)</span> : ''}</span>} key={node.id} data={node} isLeaf={node.leaf}>
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
  detailData = () => {
    let parentNode = this.getSelectedParentNode();
    // let res = []
    let node = (
        <div className="DepartmentActionData">
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
                </Spin>
            </div>
            {this.state.selectedNode !== null ? (
                this.state.tabKey != 4 ?
                <DetailEdit
                className="right"
                id={this.state.selectedNode.id}
                tabkey={this.state.tabKey}
                orgInfo={{
                    name: this.state.selectedNode.name,
                    id: this.state.selectedNode.id,
                    enable: this.state.selectedNode.partyOrganizationState === "1",
                    instruction: this.state.selectedNode.instruction,
                    fullname: parentNode ? parentNode.fullname : '',
                    treepath: this.state.selectedNode.treepath,
                    parentid: this.state.selectedNode.parent,
                    memCount: this.state.selectedNode.memCount,
                    // sortid: this.state.selectedNode.sortid,
                    level: this.state.selectedNode.level,
                }}
                /> 
                :
                <PublishModal
                className="right"
                id={this.state.selectedNode.id}
                callBack={() => this.requestAllData()}
                />
            )
            :
            <div />}
        </div>
    );
    // res.push(node)
    return node;
  }
  keyChange = (key) => {
    console.log('key改变', key);
    this.setState({tabKey: key},()=>{
        this.requestAllData();
    });
  }
  render() {
    // console.log(JSON.stringify(this.state.selectedNode))
    // const newSuccess = () => {
    //   this.setState({
    //     newDetail: false
    //   })
    //   this.requestAllData()
    // };
    const { powers = {} } = this.props;
    const ModifyEnable = powers['20001.21005.002'];
    const exportExcel = powers && powers['20001.21005.202'];
    let parentNode = this.getSelectedParentNode();
    return (
        <Tabs defaultActiveKey="1" onChange={this.keyChange}>
            <TabPane tab="部门情况" key="1">
                {this.state.tabKey == 1 ? this.detailData() : null}
            </TabPane>
            <TabPane tab="经理人及干部情况" key="2">
                {this.state.tabKey == 2 ?this.detailData() : null}
            </TabPane>
            <TabPane tab="不活跃员工" key="3">
                {this.state.tabKey == 3 ?this.detailData() : null}
            </TabPane>
            <TabPane tab="设置定时任务" key="4">
                {this.state.tabKey == 4 ? this.detailData() : null}
            </TabPane>
        </Tabs>
      
    );
  }
}