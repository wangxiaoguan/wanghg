import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, message, Spin, Input, Divider, Tree, Icon } from 'antd';
import styles from './index.less';

let timer;
const { Search } = Input;
const { TreeNode } = Tree;

// 扁平化list
let treeNodeItem = [];
let vsTreeNodeItem = [];

@connect(({ partyTask, loading }) => ({
  partyTask,
  loadingTree: loading.effects['partyTask/getPartySynchro'],
}))
class SetReceiver extends Component {
  constructor(props) {
    super(props);
    this.dataListP = [];
    const arrKeys = props.location.pathname.split('/');
    //接收人是否有虚拟组
    this.isVisualGroup =
      arrKeys.length > 4 &&
      (arrKeys[3] === 'normalTask' || arrKeys[3] === 'education' || arrKeys[1] === 'thematic');
    this.state = {
      taskReceivers: [],
      visualGroup: [],
      autoExpandParent: true,
      list: [],
      expandedKeys: [],
      selectedKeys: [],
      checkedKeys: [],
      searchValue: '',
      vsAutoExpandParent: true,
      vsList: [],
      vsExpandedKeys: [],
      vsSelectedKeys: [],
      vsCheckedKeys: [],
      vsSearchValue: '',
      taskId: 0,
    };
  }

  componentDidMount() {
    const { initIds, dispatch, partyTask, treeSelectDetail, visualList, treeSelect } = this.props;
    const { upPartyId } = partyTask;
    if (Number(initIds.topicId) === 99) {
      const flag = true;
      const id = upPartyId;
      const msgId = 'GET_PARTY_TX';
      const formData = { id, msgId };
      dispatch({
        type: 'partyTask/getPartys',
        payload: {
          text: JSON.stringify(formData),
        },
        callBack: res => {
          // 新建时初始化第一层组织
          const treeNodes = [];
          const { obj } = res;
          if (res.root !== undefined) {
            const rootObj = {
              title: res.root.name,
              key: `${res.root.id}`,
              userId: -1,
              partyId: res.root.id,
            };
            this.dataListP.push(rootObj);
            treeNodes.push(rootObj);
            this.setState({
              list: treeNodes,
            });
          } else {
            for (let i = 0; i < obj.length; i += 1) {
              const node = {
                title: obj[i].name,
                userId: flag ? -1 : obj[i].userid,
                partyId: obj[i].partyId,
                ischild: obj[i].ischild,
              };
              if (flag) {
                node.key = `${obj[i].partyId}`;
              } else {
                node.key = res[i].userid === -1 ? `${res[i].partyid}` : `0#${res[i].userId}`;
              }
              treeNodes.push(node);
              this.dataListP.push(node);
            }
            this.setState({
              list: treeNodes,
            });
          }
        },
      });
    } else if (treeSelect.length) {
      this.setState({
        list: treeSelect,
        vsList: visualList,
        expandedKeys: [treeSelect[0].key],
      });
      // console.log('treeSelectDetail==', treeSelectDetail);
      this.dataListP = treeSelectDetail;
    }
  }
  UNSAFE_componentWillReceiveProps(nextprops) {
    // console.log(nextprops)
    const { list } = this.state;
    const {
      initIds,
      treeSelectDetail,
      visualList,
      treeSelect,
    } = nextprops;
    // 获取到的树列表数据处理
    // if (Number(initIds.topicId) !== 99 && list.length === 0 && treeSelect.length !== 0) {
    this.setState({
      list: treeSelect,
      vsList: visualList,
      expandedKeys: treeSelect && treeSelect.length > 0 && [treeSelect[0].key],
    });
    this.dataListP = treeSelectDetail;
    // }
  }
  componentDidUpdate(preProps, preState) {
    const { taskId, list } = preState;
    const {
      initData,
      componentType,
      initIds,
      treeSelectDetail,
      visualList,
      treeSelect,
      transmit,
    } = preProps;
    // 获取到的树列表数据处理
    // if (Number(initIds.topicId) !== 99 && list.length === 0 && treeSelect.length !== 0) {
    //   this.setState({
    //     list: treeSelect,
    //     vsList: visualList,
    //     expandedKeys: [treeSelect[0].key],
    //   });
    //   this.dataListP = treeSelectDetail;
    // }

    // 判断编辑/转发时是否有回显的数据
    if ((initData.task_tx && !taskId && componentType) /*|| (transmit && !taskId)*/) {
      this.setState({ taskId: initData.task_tx.taskId });
      if (Number(initIds.topicId) === 99) {
        //  重要工作部署接收人回显
        const newPartyId = [];
        const { partyReceiverList: list } = initData.task_tx;
        for (let i = 0; list && i < list.length; i += 1) {
          newPartyId.push(list[i].partyId);
          const newParam = [];
          for (let i = 0; i < newPartyId.length; i += 1) {
            newParam[i] = Number(newPartyId[i]);
          }
          this.setState({ taskReceivers: newParam, checkedKeys: newPartyId });
        }
      } else {
        const { memReceiverList: list, visualGroup: visualList } = initData.task_tx;
        const newVsList = visualList === '' ? [] : JSON.parse(visualList);
        const receiverList = [];
        const partyIds = [];
        let newCheckedKeys = [];
        let vsCheckedKeys = [];
        // const newExpandKeys = [];
        for (let i = 0; i < list.length; i += 1) {
          if (Number(list[i].userid) !== -1) {
            const receiver = {
              partyid: `${list[i].partyid}`,
              userid: `${list[i].userid}`,
            };
            receiverList.push(receiver);
            newCheckedKeys.push(`${list[i].partyid}#${list[i].userid}`);
          } else {
            partyIds.push(Number(list[i].partyid));
            newCheckedKeys.push(`${list[i].partyid}`);
          }
        }
        // 回显虚拟组数据
        if (this.isVisualGroup) {
          for (let i = 0; i < newVsList.length; i += 1) {
            vsCheckedKeys.push(`${newVsList[i].groupId}#${newVsList[i].userId}`);
          }
          this.setState({
            vsCheckedKeys,
            visualGroup: newVsList,
            vsAutoExpandParent: true,
          });
        }
        // 回显党组织数据
        const params = { receiverList, partyIds };
        this.setState({
          // expandedKeys: newExpandKeys,
          autoExpandParent: true,
          checkedKeys: newCheckedKeys,
          taskReceivers: params,
        });
      }
    }
  }

  submit = () => {
    const { submitInfo } = this.props;
    const { taskReceivers, visualGroup } = this.state;
    // 防抖
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      if (
        (taskReceivers.length === 0 ||
          (taskReceivers.receiverList &&
            taskReceivers.partyIds &&
            taskReceivers.receiverList.length === 0 &&
            taskReceivers.partyIds.length === 0)) &&
        visualGroup.length === 0
      ) {
        message.warning('请选择任务接收人员');
        return;
      }
      if (this.isVisualGroup) {
        submitInfo(taskReceivers, visualGroup);
      } else {
        submitInfo(taskReceivers);
      }
    }, 500);
  };

  onCheckVs = vsCheckedKeys => {
    const { visualDetail } = this.props;
    let statevsCheckedKeys = this.state.vsCheckedKeys;
    const visual = [];
    let newCheckedKeys = [...vsCheckedKeys];
    for (let i = 0; i < vsCheckedKeys.length; i += 1) {
      // 判断勾选的是人还是组织
      let flag = true;
      console.log(newCheckedKeys);
      if (vsCheckedKeys[i].indexOf('#') === -1) {
        newCheckedKeys.splice(i, 1);
        flag = false;
      }
      for (let j = 0; j < visualDetail.length && flag; j += 1) {
        if (vsCheckedKeys[i] === visualDetail[j].key) {
          flag = false;
          if (visualDetail[j].userId !== -1) {
            visual.push({
              groupId: `${visualDetail[j].partyId}`,
              userId: `${visualDetail[j].userId}`,
              userName: visualDetail[j].title,
              // groupName: visualDetail[j].groupName,
            });
          }
        }
      }
    }
    // let allCheckedKeys = [...statevsCheckedKeys,...newCheckedKeys]
    let allCheckedKeys = [...newCheckedKeys]
    this.setState({ vsCheckedKeys: allCheckedKeys, visualGroup: visual });
  };

  onCheck = checkedKeys => {
    // console.log('onCheck',checkedKeys,e)
    const { initIds } = this.props;
    const { dataListP } = this;
    const { searchValue } = this.state;
    let stateCheckedKeys = this.state.checkedKeys;
    let newCheckedKeys = [...checkedKeys];
    if (Number(initIds.topicId) === 99) {
      this.setState({ checkedKeys });
      const newParam = [];
      for (let i = 0; i < checkedKeys.length; i += 1) {
        newParam[i] = Number(checkedKeys[i]);
      }
      this.setState({ taskReceivers: newParam, checkedKeys });
    } else {
      const receiverList = [];
      const partyIds = [];
      // console.log('dataListP',dataListP)
      // 判断选择的是人还是组织
      for (let i = 0; i < checkedKeys.length; i += 1) {
        let flag2 = true;
        for (let j = 0; j < dataListP.length && flag2; j += 1) {
          if (checkedKeys[i] === dataListP[j].key) {
            flag2 = false;
            if (dataListP[j].userId !== -1 && !partyIds.includes(dataListP[j].partyId)) {
              const receiver = {
                partyid: `${dataListP[j].partyId}`,
                userid: `${dataListP[j].userId}`,
              };
              receiverList.push(receiver);
            }
            if (dataListP[j].userId === -1 && searchValue.trim() === '') {
              partyIds.push(Number(checkedKeys[i]));
            } else if (dataListP[j].userId === -1 && searchValue.trim() !== '') {
              newCheckedKeys.splice(i, 1);
            }
          }
        }
      }
      // const params = { receiverList, partyIds };
      let allCheckedKeys = [/*...stateCheckedKeys,*/...newCheckedKeys]
      if(searchValue !== ''){
        allCheckedKeys = [...stateCheckedKeys,...newCheckedKeys]
      }
      let receiverList1 = [];
      allCheckedKeys.forEach(c => {
        const info = c.split('#');
        receiverList1.push({
          partyid: info[0],
          userid: info[1],
        })
      })
      const params = { receiverList:receiverList1, partyIds };
      this.setState({ taskReceivers: params, checkedKeys: allCheckedKeys });
    }
  };

  onChange = e => {
    const { list, checkedKeys } = this.state;
    // console.log('checkedKeys', checkedKeys);
    const { initIds } = this.props;
    const value = e;
    if (value === '') {
      this.setState({
        searchValue: '',
        expandedKeys: checkedKeys.length === 0 ? [list[0].key] : checkedKeys,
        autoExpandParent: true,
      });
      return;
    }
    if (Number(initIds.topicId) === 99) {
      const expandedKeys = this.dataListP
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, list);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      this.setState({
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
    } else {
      this.setState({
        expandedKeys: [list[0].key],
        searchValue: value,
        autoExpandParent: true,
      });
    }
  };

  onChangeVs = e => {
    const { vsList, vsCheckedKeys } = this.state;
    const value = e;
    if (value === '') {
      this.setState({
        vsSearchValue: value,
        vsExpandedKeys: vsCheckedKeys.length === 0 ? [vsList[0].key] : vsCheckedKeys,
        vsAutoExpandParent: true,
      });
      return;
    }
    this.setState({
      vsSearchValue: value,
      vsExpandedKeys: [vsList[0].key],
      vsAutoExpandParent: true,
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onExpandVs = expandedKeys => {
    this.setState({
      vsExpandedKeys: expandedKeys,
      vsAutoExpandParent: false,
    });
  };

  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i += 1) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  loop = (data, isLeaf) =>
    data.map(item => {
      const { searchValue, checkedKeys } = this.state;
      const { initIds } = this.props;
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      if (searchValue.trim() !== '' && index === -1 && !item.children) {
        // 重要工作部署接收人只有组织
        if (Number(initIds.topicId) !== 99) {
          // 排除已经选择的人员
          if (!checkedKeys.includes(item.key)) {
            return null;
          }
        }
      }
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
          <TreeNode key={item.key} title={title} isLeaf={item.userId === -1 ? isLeaf : true}>
            {this.loop(item.children, isLeaf)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.key}
          className={item.userId !== -1 ? styles.leafNode : null}
          isLeaf={item.userId === -1 ? isLeaf : true}
          title={title}
        />
      );
    });

  loop2 = (data, isLeaf) => {
    const treeRenderItem = data.map(item => {
      if (item.children) {
        return (
          <TreeNode key={item.key} title={item.title} isLeaf={item.userId === -1 ? isLeaf : true}>
            {this.loop2(item.children, isLeaf)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.key}
          className={item.userId !== -1 ? styles.leafNode : null}
          isLeaf={item.userId === -1 ? isLeaf : true}
          title={item.title}
        />
      );
    });
    return treeRenderItem;
  };

  // 搜索结果中人员所属的组织信息
  getSearchData = (data, parentTitle, type) => {
    for (let i = 0; i < data.length; i += 1) {
      const node = data[i];
      const { searchValue, vsSearchValue } = this.state;
      let value = type === 'visual' ? vsSearchValue : searchValue;
      const { key, title } = node;
      const index = title.indexOf(value);
      if (index !== -1 && !node.children && node.userId !== -1) {
        if (type === 'visual') {
          vsTreeNodeItem.push({ key, title: `${title}(${parentTitle})` });
        } else {
          treeNodeItem.push({ key, title: `${title}(${parentTitle})` });
        }
      }
      if (node.children) {
        const paretT = parentTitle !== node.title ? `${parentTitle}>${node.title}` : parentTitle;
        this.getSearchData(node.children, paretT, type);
      }
    }
  };

  loopSearch = (data, isLeaf, type) => {
    if (data.length) {
      const treeNode = data[0];
      const { searchValue, vsSearchValue } = this.state;
      let value = '';
      let items = []; // 扁平化数据
      if (type === 'visual') {
        vsTreeNodeItem = [];
        value = vsSearchValue;
        this.getSearchData(data, data[0].title, type);
        items = vsTreeNodeItem;
      } else {
        treeNodeItem = [];
        value = searchValue;
        this.getSearchData(data, data[0].title, type);
        items = treeNodeItem;
      }
      if (TreeNode && items.length) {
        return (
          <TreeNode key={treeNode.key} title={treeNode.title} isLeaf={isLeaf}>
            {items.map(item => {
              const index = item.title.indexOf(value);
              const beforeStr = item.title.substr(0, index);
              const afterStr = item.title.substr(index + value.length);
              const title =
                index > -1 ? (
                  <span>
                    {beforeStr}
                    <span style={{ color: '#f50' }}>{value}</span>
                    {afterStr}
                  </span>
                ) : (
                    <span>{item.title}</span>
                  );
              return <TreeNode key={item.key} className={styles.leafNode} title={title} isLeaf />;
            })}
          </TreeNode>
        );
      }
    }
    return null;
  };

  render() {
    const { changeTab, initIds, loading, loadingTree } = this.props;
    const {
      autoExpandParent,
      searchValue,
      list,
      vsList,
      checkedKeys,
      selectedKeys,
      expandedKeys,
      // taskReceivers,
      vsAutoExpandParent,
      vsExpandedKeys,
      vsSelectedKeys,
      vsCheckedKeys,
      vsSearchValue,
    } = this.state;
    // console.error('list', list)
    const antIcon = <Icon type="loading" style={{ fontSize: 20 }} spin />;
    const isLeaf = Number(initIds.topicId) === 99;

    return (
      <div className={styles.setPage}>
        <div className={styles.title}>任务接收人</div>
        <div>
          <div className={styles.taskReceive}>
            <div className={styles.typeTitle}>党组织</div>
            <Spin spinning={list.length ? false : loadingTree}>
              <div className={styles.TreeContain}>
                <Search
                  placeholder="请输入内容"
                  value={searchValue}
                  onChange={e => {
                    this.setState({ searchValue: e.target.value });
                  }}
                  onSearch={e => this.onChange(e)}
                />
                <Icon
                  className={styles.closeInput}
                  onClick={() => this.onChange('')}
                  type="close"
                />
                <Divider className={styles.divider} type="vertical" />
                {/* 重要工作部署树结构和第二种树结构 */}
                {isLeaf ? (
                  <Tree
                    checkable
                    showLine
                    autoExpandParent={autoExpandParent}
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    selectedKeys={selectedKeys}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                  >
                    {this.loop(list, isLeaf)}
                  </Tree>
                ) : (
                    <Tree
                      checkable
                      showLine
                      autoExpandParent={autoExpandParent}
                      onExpand={this.onExpand}
                      expandedKeys={expandedKeys}
                      // selectedKeys={selectedKeys}
                      checkedKeys={checkedKeys}
                      onCheck={this.onCheck}
                    >
                      {typeof searchValue === 'string' && searchValue.trim() !== ''
                        ? this.loopSearch(list, false, '')
                        : this.loop2(list, false)}
                    </Tree>
                  )}
              </div>
            </Spin>
          </div>
          {this.isVisualGroup ? (
            <div className={styles.taskReceive}>
              <div className={styles.typeTitle}>虚拟组</div>
              <Spin spinning={vsList.length ? false : loadingTree}>
                <div className={styles.TreeContain}>
                  <Search
                    placeholder="请输入内容"
                    value={vsSearchValue}
                    onChange={e => {
                      this.setState({ vsSearchValue: e.target.value });
                    }}
                    onSearch={e => this.onChangeVs(e)}
                  />
                  <Icon
                    className={styles.closeInput}
                    onClick={() => this.onChangeVs('')}
                    type="close"
                  />
                  <Divider className={styles.divider} type="vertical" />
                  {/* 虚拟组树 */}
                  <Tree
                    checkable
                    showLine
                    autoExpandParent={vsAutoExpandParent}
                    onExpand={this.onExpandVs}
                    expandedKeys={vsExpandedKeys}
                    // selectedKeys={vsSelectedKeys}
                    checkedKeys={vsCheckedKeys}
                    onCheck={this.onCheckVs}
                  >
                    {typeof vsSearchValue === 'string' && vsSearchValue.trim() !== ''
                      ? this.loopSearch(vsList, false, 'visual')
                      : this.loop2(vsList, false)}
                  </Tree>
                </div>
              </Spin>
            </div>
          ) : null}
        </div>
        <div className={styles.button} onClick={() => this.submit()}>
          <Spin
            spinning={loading}
            indicator={antIcon}
            style={{ display: 'inline-block', color: '#fff' }}
          />
          保存
        </div>
        <div className="global_btn">
          <Button onClick={() => changeTab('1')}>上一步</Button>
        </div>
      </div>
    );
  }
}
export default SetReceiver;
