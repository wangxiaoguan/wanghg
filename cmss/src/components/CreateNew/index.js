import React, { Component } from 'react';
import router from 'umi/router';
import { Tabs, Icon, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import BreadCrumbDetail from '@/components/BreadCrumbDetail';
import PageLoading from '@/components/PageLoading';
import SetReceiver from './SetReceiver';
import { storage } from '@/utils/utils';
import FillTaskInfo from './FillTaskInfo';
import styles from './index.less';

const { TabPane } = Tabs;

// 扁平化树结构数据
let treeSelectDetail = [];
let visualDetail = [];

@connect(({ partyTask, loading }) => ({
  partyTask,
  loading2: loading.effects['partyTask/getTaskDetail'],
}))
class CreateNew extends Component {
  constructor(props) {
    super(props);
    const { topicId, eduId } = this.getInitData();
    this.userInfo = JSON.parse(storage.getLocal('userInfo'));
    this.state = {
      tabKey: '1',
      loading: false,
      taskInfo: {},
      initData: {},
      topicId,
      eduId,
      visualList: [],
      treeAll: [], //所有部门数据
      treeSection: [], //某部门数据
      transmit: false, // 是否是转发
    };
  }

  componentDidMount() {
    const { topicId } = this.state;
    const { dispatch, partyTask, location } = this.props;
    const { upPartyId, isSend, tansmitDetail, tansmitAttachList } = partyTask;
    const { taskId } = location.query;
    console.log('partyTask',partyTask)
    const arrKeys = location.pathname.split('/');
    treeSelectDetail = [];
    if (upPartyId === '' && !tansmitDetail) {
      this.cancel();
      return;
    }
    if (arrKeys.includes('edit')) {
      const formData = {
        taskId,
        topicId: arrKeys[4],
        msgId: 'TASK_DETAIL_TX',
        isSend,
        partyId: Number(upPartyId),
        userId: this.userInfo.id,
      };
      dispatch({
        type: 'partyTask/getTaskDetail',
        payload: {
          text: JSON.stringify(formData),
        },
        callback: res => {
          // console.log(res);
          const { topicId, eduId } = res.task_tx;
          this.setState({ initData: res, topicId, eduId });
          this.getOrgnationDataByType(res.task_tx.upPartyId, res.task_tx.topicId);
        },
      });
    }
    // 判断是否为转发任务的情况
    if (JSON.stringify(tansmitDetail) !== '{}') {
      const data = {};
      data.task_tx = JSON.parse(JSON.stringify(tansmitDetail));
      if (tansmitAttachList && tansmitAttachList.length) {
        data.attachList = JSON.parse(JSON.stringify(tansmitAttachList));
      }
      this.setState({ initData: data, transmit:true });
    }
    // 其他任务和主题场景获取虚拟组数据
    if (
      arrKeys.length > 4 &&
      (arrKeys[3] === 'normalTask' || arrKeys[3] === 'education' || arrKeys[1] === 'thematic')
    ) {
      const formData1 = {
        msgId: 'GET_VISUAL_GROUP_DETAIL',
        eduId: arrKeys[1] === 'thematic' ? tansmitDetail.eduId : Number(arrKeys[4]),
      };
      this.getGroup(formData1, res => {
        let list = [];
        if (res && res.resultMap && res.code === '0') {
          list = this.getVisualTreeData(res.resultMap.taskGroupList);
        }
        this.setState({ visualList: list });
      });
    }
    if (arrKeys[3] !== 'education' && !arrKeys.includes('edit') && topicId !== '99') {
      this.getOrgnationDataByType(upPartyId, topicId);
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'partyTask/setUpPartyId',
      payload: {
        tansmitDetail: {},
      },
    });
  }

  getInitData = () => {
    const { location, partyTask } = this.props;
    const { tansmitDetail } = partyTask;
    const arrKeys = location.pathname.split('/');
    let topicId = '';
    let eduId = '';
    if (arrKeys[1] === 'task' && arrKeys[3] === 'education') {
      eduId = arrKeys[4];
    } else {
      topicId = arrKeys[4];
    }
    if (JSON.stringify(tansmitDetail) !== '{}') {
      topicId = `${tansmitDetail.topicId}`;
      eduId = `${tansmitDetail.eduId}`;
    } else if (arrKeys[1] === 'thematic') {
      this.cancel();
      return {};
    }
    return { eduId, topicId };
  };

  // 根据type获取党组织数据
  getOrgnationDataByType = (upPartyId, type) => {
    // const { transmit } = this.state;
    const { tansmitDetail,postInfo=[] } = this.props.partyTask;
    const formData2 = {
      partyId: upPartyId,
      type: Number(type),
      msgId: 'GET_PARTY_USER_INFO_TX',
      userId: Number(this.userInfo.id),
    };
    // 转发当没有选择职务时候,默认选择最高职务
    if (tansmitDetail && upPartyId === '') {
      let partyInfo = { level: 1000 }
      postInfo.forEach(p => {
        if(p.level < partyInfo.level){
          partyInfo = p
        }
      })
      if(partyInfo.level < 1000){
        formData2.partyId = partyInfo.partyId
      }
    }
    this.getGroup(formData2, res => {
      let newList = [];
      if (res && res.resultMap) {
        newList = this.getTreeData(res.resultMap.root, type);
        // console.error('newList', newList)
      }
      this.setState({ treeSection: newList });
    });
  };

  // 获取党组织或虚拟组
  getGroup = (param, fn) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'partyTask/getPartySynchro',
      payload: {
        text: JSON.stringify(param),
      },
      callBack: fn,
    });
  };

  // 扁平化树结构数据
  getTreeData = (res, type) => {
    // const { topicId } = this.state;
    // console.error('type', type)
    // console.error('res', res)
    const treeData = [];
    for (let i = 0; i < res.length; i += 1) {
      let title;
      if (res[i].isChild === 1) {
        title = res[i].name;
      } else if (res[i].postName !== '' && res[i].postName && Number(type) === 2) {
        //党支部委员会，接收人有职位的需要显示职位
        title = `${res[i].userName}(${res[i].postName})`;
      } else {
        title = res[i].userName;
      }
      const obj = {
        title,
        key:
          res[i].userId === undefined ? `${res[i].partyid}` : `${res[i].partyid}#${res[i].userId}`,
        userId: res[i].userId === undefined ? -1 : res[i].userId,
        partyId: res[i].partyid,
      };
      if (res[i].isChild === 1) {
        // 子节点为人
        if (res[i].user !== undefined && res[i].user.length !== 0) {
          obj.children = this.getTreeData(res[i].user, type);
        }
        // 子节点为组织
        if (res[i].orgs !== undefined && res[i].orgs.length !== 0) {
          obj.children = this.getTreeData(res[i].orgs, type);
        }
        // 子节点包含人和组织
        if (
          res[i].orgs !== undefined &&
          res[i].user !== undefined &&
          res[i].orgs.length !== 0 &&
          res[i].user.length !== 0
        ) {
          obj.children = this.getTreeData([...res[i].user, ...res[i].orgs], type);
        }
      }
      treeSelectDetail.push(obj);
      treeData.push(obj);
    }
    return treeData;
  };

  getVisualTreeData = list => {
    const treeData = [];
    for (let i = 0; i < list.length; i += 1) {
      const org = {
        title: list[i].groupName,
        key: list[i].groupId,
        userId: -1,
        partyId: list[i].groupId,
        children: [],
      };
      for (let j = 0; list[i].userGroupList && j < list[i].userGroupList.length; j += 1) {
        const userList = list[i].userGroupList[j];
        const user = {
          title: userList.userName,
          key: `${userList.groupId}#${userList.userId}`,
          userId: userList.userId,
          partyId: userList.groupId,
          groupName: list[i].groupName,
        };
        visualDetail.push(user);
        org.children.push(user);
      }
      treeData.push(org);
      visualDetail.push(org);
    }
    return treeData;
  };

  cancel = () => {
    const { location } = this.props;
    const arrKeys = location.pathname.split('/');
    arrKeys.pop();
    const newUrl = arrKeys.join('/');
    router.push(`${newUrl}`);
  };

  setTaskInfo = info => {
    this.setState({ taskInfo: info });
  };

  submitInfo = (taskReceivers, visualGroup) => {
    const { partyTask, location, dispatch } = this.props;
    const { upPartyId } = partyTask;
    console.log('partyTask',partyTask)
    const { taskInfo, eduId } = this.state;
    taskInfo.endDate = moment(taskInfo.endDate).format('YYYY-MM-DD HH:mm:ss');
    taskInfo.startDate = moment(taskInfo.startDate).format('YYYY-MM-DD HH:mm:ss');
    const arrKeys = location.pathname.split('/');
    const componentType = arrKeys.includes('edit');
    console.log(taskReceivers, visualGroup);
    const {
      upTaskId,
      isOffline,
      taskAttachList,
      endDate,
      startDate,
      isNeedReceipt,
      typeId,
      topicId,
      name,
      remindDate,
      content,
      isSign,
    } = taskInfo;
    const formData = {
      msgId: componentType ? 'MODIFY_TASK_TX' : 'SEND_TASK_TX',
      id: upPartyId || -1,
      upTaskId: upTaskId || [],
      topicId: this.state.topicId,
      isOffline: isOffline === 1,
      typeId: `${typeId}`,
      name,
      isNeedReceipt,
      content,
      taskAttachList,
      endDate,
      startDate,
      remindDate: Number(remindDate),
      userId: this.userInfo.id,
      userName: this.userInfo.name,
      isSign: isSign === undefined ? false : isSign,
    };
    if (arrKeys[3] === 'education' || arrKeys[1] === 'thematic') {
      formData.topicId = `${topicId}`;
      formData.eduId = eduId;
    }
    if (Number(this.state.topicId) !== 99) {
      formData.receiverList = taskReceivers.receiverList ? taskReceivers.receiverList : [];
      if (taskReceivers.partyIds && taskReceivers.partyIds.length) {
        formData.partyIds = taskReceivers.partyIds;
      }
    } else {
      formData.partyIds = taskReceivers;
      // 重要工作部署默认不是线下会议
      formData.isOffline = false;
    }
    // 我的任务转发，主题教育，其他任务
    if (
      arrKeys.length > 4 &&
      (arrKeys[3] === 'normalTask' || arrKeys[3] === 'education' || arrKeys[1] === 'thematic')
    ) {
      formData.visualGroup = JSON.stringify(visualGroup);
    }
    // console.log(formData, taskReceivers, visualGroup);
    this.setState({ loading: true });
    if (componentType) {
      formData.taskId = location.query.taskId;
      dispatch({
        type: 'partyTask/editTask',
        payload: {
          text: JSON.stringify(formData),
        },
        callBack: res => {
          if (res.code === '0') {
            message.success('编辑成功');
            this.cancel();
            this.setState({ loading: false });
          } else {
            message.error('编辑失败');
            this.setState({ loading: false });
          }
        },
      });
    } else {
      dispatch({
        type: 'partyTask/sendTask',
        payload: {
          text: JSON.stringify(formData),
        },
        callBack: res => {
          if (res.message === '成功。') {
            message.success('新建任务成功');
            this.cancel();
            this.setState({ loading: false });
          } else {
            message.error('新建任务失败');
            this.setState({ loading: false });
          }
        },
      });
    }
  };

  getTabPane = key => {
    const { location } = this.props;
    const { initData, loading, eduId, topicId, treeSection, visualList, transmit, taskInfo } = this.state;
    const arrKeys = location.pathname.split('/');
    // 编辑,转发还是新增
    const componentType = arrKeys.includes('edit');
    // console.log('treeSection===', treeSection);
    if (componentType && initData.task_tx === undefined) {
      return <PageLoading/>;
    } else if (key === '1') {
      return (
        <FillTaskInfo
          changeTab={this.changeTab}
          initIds={{ eduId, topicId }}
          cancel={this.cancel}
          setTaskInfo={this.setTaskInfo}
          {...this.props}
          componentType={componentType}
          initData={initData}
          transmit={transmit}
          getOrgnationDataByType={this.getOrgnationDataByType}
        />
      );
    } else {
      return (
        <SetReceiver
          initData={initData}
          changeTab={this.changeTab}
          treeSelect={treeSection}
          visualList={visualList}
          {...this.props}
          typeName={taskInfo.typeName}
          initIds={{ eduId, topicId }}
          transmit={transmit}
          loading={loading}
          componentType={componentType}
          submitInfo={this.submitInfo}
          treeSelectDetail={treeSelectDetail}
          visualDetail={visualDetail}
        />
      );
    }
  };

  changeTab = key => {
    this.setState({ tabKey: key });
  };

  render() {
    const { tabKey } = this.state;
    return (
      <div className={styles.main}>
        <BreadCrumbDetail {...this.props} type="党建任务"/>
        <Tabs
          defaultActiveKey={tabKey}
          activeKey={tabKey}
          onChange={this.changeTab}
          animated={false}
        >
          <TabPane
            tab={
              <div className={styles.tabTitle}>
                <div className={tabKey === '1' ? styles.one : styles.complete}>
                  {tabKey === '1' ? 1 : null}
                </div>
                <p>填写任务信息</p>
                <div className={styles.spetor}>
                  <Icon type="right"/>
                </div>
              </div>
            }
            key="1"
          >
            {this.getTabPane('1')}
          </TabPane>
          <TabPane
            tab={
              <div className={styles.tabTitle}>
                <div className={tabKey === '1' ? styles.two : styles.twoActive}>2</div>
                <p style={tabKey === '1' ? { color: '#ACACAC' } : { color: '#333' }}>设置接收人</p>
              </div>
            }
            key="2"
            disabled
          >
            {this.getTabPane('2')}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default CreateNew;
