import React, { Component } from 'react';
import { Tree, message, Spin, Input, Button,Tabs } from 'antd';
import { connect } from 'react-redux';
import API_PREFIX from '../../apiprefix';
import { getService, postService, exportExcelService } from '../../myFetch';
import TreeControl from '../../../../utils/TreeControl';
import '../oprativereport.less';
import PartyUserInfo from './PartyUserInfo';
import PartyBranch from './PartyBranch';
// import './index.less';

const { TabPane } = Tabs;
const Search = Input.Search;
const TreeNode = Tree.TreeNode;
const DirectoryTree = Tree.DirectoryTree;

@connect(
  state => ({
    powers: state.powers,
    partyId: state.head.headPartyIdData,
  })
)

export default class PartyActionData extends Component {

  constructor(props) {
    super(props);

    this.treeControl = new TreeControl('id', 'partyOrgList');

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
        let id = item.parentId;
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
    // getService(API_PREFIX + 'services/system/partyOrganization/queryPartyOrgCategory', res => {
    //     if(res.retCode == 1) {
    //         this.setState({levelData: res.root.list})
    //     }
    // })
    // this.setState({ partyId: this.props.partyId })
    // if (JSON.stringify(this.props.partyId) !== "{}") {
    //   this.requestAllData(this.props.partyId)
    // }
    this.requestAllData();
  }
//   componentWillReceiveProps(nextProps) {
//     if (this.state.partyId != nextProps.partyId) {
//       this.setState({
//         partyId: nextProps.partyId,
//       })
//       this.requestAllData(nextProps.partyId)
//     }
//   }
  requestAllData(partyId) {
    this.setState({ loadingData: true });
    getService(API_PREFIX + `services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1`, (res) => {
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
          this.state.treeExplandKeys = this.state.treeExplandKeys.concat([parentId == '-1' ? JSON.stringify(this.state.selectedNode.id):JSON.stringify(parentId)]);
        }
        this.setState({ loadingData: false });
      }else {
        message.error(res.errorMsg)
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


  afterChangedData = (res) => {
    if (res.retCode === 1) {
      this.requestAllData(this.state.partyId);
    }
    else {
      message.error(res.retMsg);
    }
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
          autoExpandParent={true}
          onExpand={this.onExpand}
          expandedKeys={this.state.treeExplandKeys}
          onSelect={this.onSelect}
        //   onCheck={this.onCheck}
          selectedKeys={this.state.selectedNode ? [JSON.stringify(this.state.selectedNode.id)] : null}
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

// console.log("nodeList===>",nodeList);


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
      let item = (<TreeNode   disabled={node.partyOrganizationState === '0'?true:false}     title={<span>{title}{node.partyOrganizationState === '0' ? '(已停用)' : ''}</span>} key={node.id} data={node} isLeaf={node.leaf}>
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
    console.log('info---', info);

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
  getDutieStatu = (v) => {
    this.setState({ dutieStatu: v });
  }
  keyChange = (key) => {
    console.log('key改变', key);
    this.setState({tabKey: key});
  }
  detailData = () => {
    let parentNode = this.getSelectedParentNode();
    // let res = []
    let node = (
        <div className="DepartmentActionData">
            <div className="left">
                <Spin spinning={this.state.loadingData} >
                <Search style={{ marginBottom: 8 }} placeholder="搜索" onChange={(event) => {
                    this.setState({ searchKey: event.target.value}, () => {
                    this.state.searchNode = this.searchTree();
                    this.state.treeExplandKeys = this.getExpandKeysBySearched();               
                      this.forceUpdate();                
                    });
                }} />
                {this.renderTree()}
                </Spin>
            </div>
            {this.state.selectedNode !== null ?
            <PartyBranch
            className="right"
            id={this.state.selectedNode.id}
            tabkey={this.state.tabKey}
            orgInfo={{
                name: this.state.selectedNode.partyName,
                id: this.state.selectedNode.id,
                enable: this.state.selectedNode.partyOrganizationState === "1",
                instruction: this.state.selectedNode.instruction,
                fullname: parentNode ? parentNode.fullname : '',
                treepath: this.state.selectedNode.treepath,
                parentid: this.state.selectedNode.parentid,
                memCount: this.state.selectedNode.memCount,
                // sortid: this.state.selectedNode.sortid,
                level: this.state.selectedNode.level,
            }}
            // isNew={false}
            // wrappedRef={e => {
            //     this.PartyBranch = e;
            // }}
            // levelData={this.state.levelData}
            /> 
            :
            <div />}
        </div>
    );
    // res.push(node)
    return node;
  }
  render() {
    // console.log(JSON.stringify(this.state.selectedNode))
    let parentNode = this.getSelectedParentNode();
    return (
        <Tabs defaultActiveKey="1" onChange={this.keyChange}>
            <TabPane tab="党员信息" key="1">
                {this.state.tabKey == 1 ? <PartyUserInfo /> : null}
            </TabPane>
            <TabPane tab="党支部信息" key="2">
                {this.state.tabKey == 2 ? this.detailData() : null}
            </TabPane>
        </Tabs>
      
    );
  }
}