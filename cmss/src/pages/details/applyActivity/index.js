import React from 'react';
import { Avatar, Button, Spin } from 'antd';
import { getNowFormatDate, storage } from '../../../utils/utils';
import { connect } from 'dva';
import MyFont from '../../../utils/myIcon';
import styles from './index.less';
import PropTypes from 'prop-types';
import EditModal from './modal'
import ActivityMemberModal from '../modal/ActivityMemberModal';

@connect(({ applyActivityModel, activityDetailModel, loading }) => ({
  applyActivityModel,
  activityDetailModel,
  loading,
  getMembersLoading: loading.effects['applyActivityModel/getActivityMembers'],
  getUserInfoLoading: loading.effects['applyActivityModel/getActivityUserInfo'],
}))
class ApplyActivity extends React.Component {

  static propTypes = {
    activityNewsId: PropTypes.string,
  };

  joinActivity = () => {
    const { activityInfo, isJoin, userInfo } = this.props.activityDetailModel;
    const { dispatch, activityNewsId } = this.props;
    const userDetail = {
      activityId: activityNewsId,
      msgId: 'APP018',
      userId: userInfo.id,
      userInfoList: [],
    };

    const exitDetail = {
      activityId: activityNewsId,
      msgId: 'APP019',
      userId: userInfo.id,
    };

    if (isJoin) {
      dispatch({
        type: 'applyActivityModel/exitActivity',
        payload: {
          text: JSON.stringify(exitDetail),
        },
      });
    } else if (activityInfo.typeid === '1') {
      dispatch({
        type: 'applyActivityModel/joinActivity',
        payload: {
          text: JSON.stringify(userDetail),
        },
      });
    } else if (activityInfo.typeid === '2') {
      // this.showModal();
      dispatch({
        type: 'applyActivityModel/saveState',
        payload: {
          visible: true
        },
      });
    }
  };


  // 修改报名信息
  editUserInfo = () => {
    const { dispatch, activityNewsId } = this.props;
    const { userInfo } = this.props.activityDetailModel;
    const formData = {
      activityId: activityNewsId,
      msgId: 'APP043',
      userId: userInfo.id,
    };
    dispatch({
      type: 'applyActivityModel/getActivityUserInfo',
      payload: {
        text: JSON.stringify(formData),
      },
    });
  };

  // 获取参见活动按钮信息
  getActivityButton = (activityInfo, isExTime) => {
    const { isJoin, isCan } = this.props.activityDetailModel;
    if (isJoin) {// 是否已参加
      return { name: '退出活动', disable: false };
    }
    if (activityInfo.upperLimit && activityInfo.participant >= activityInfo.upperLimit) {
      return { name: '该活动参与人数已达上限', disable: true };
    }
    if (isCan) {
      return isExTime
        ? { name: '我要参加', disable: false }
        : { name: '该活动已结束', disable: true };
    }
  };

  // 活动参与人员
  getJoinPersons = () => {
    const { dispatch, activityNewsId } = this.props;
    const formdata = {
      activityId: activityNewsId,
      msgId: 'APP042',
      index: 0,
    };
    dispatch({
      type: 'applyActivityModel/getActivityMembers',
      payload: {
        text: JSON.stringify(formdata),
      },
    });
  };

  getButtons = () => {
    const { activityInfo, isJoin } = this.props.activityDetailModel;
    console.log('activityInfo:', activityInfo)
    if (activityInfo && JSON.stringify(activityInfo) === '{}') {
      console.log('null:', activityInfo)
      return null;
    }
    const ButtonTitle = [];
    const { getMembersLoading, getUserInfoLoading, loading } = this.props;
    // 活动时间是否截止
    let isExTime = false;
    if (activityInfo.endtime && getNowFormatDate() && (
      new Date(getNowFormatDate().replace(/-/g, '/')) <
      new Date(activityInfo.endtime.replace(/-/g, '/'))
    )) {
      isExTime = true;
    }
    // 报名时间是否截止
    let joinExTime = false;
    if (activityInfo.endtime && getNowFormatDate() && (
      new Date(getNowFormatDate().replace(/-/g, '/')) <
      new Date(activityInfo.applyend.replace(/-/g, '/'))
    )) {
      joinExTime = true;
    }
    ButtonTitle.push(
      // 报名按钮
      <Button
        // className={
        //   this.getActivityButton(activityInfo, isExTime).disable
        //     ? styles.butttonDisable
        //     : styles.buttton
        // }
        className='btn-bordered'
        style={{ marginLeft: '5px', marginRight: '5px' }}
        onClick={() => this.joinActivity()}
        disabled={this.getActivityButton(activityInfo, isExTime).disable}
        loading={loading.effects['applyActivityModel/joinActivity'] || loading.effects['applyActivityModel/exitActivity']}
        key={'报名按钮'}
      >
        {this.getActivityButton(activityInfo, isExTime).name}
      </Button>,
    );
    ButtonTitle.push(
      <Button
        // type="danger"
        // className={styles.buttton}
        className='btn-bordered'
        style={{ marginLeft: '5px', marginRight: '5px' }}
        onClick={this.getJoinPersons}
        loading={getMembersLoading}
        key={'活动参与人员'}
      >
        活动参与人员
      </Button>,
    );
    if (activityInfo.typeid === '2') {
      // 修改报名信息
      if (isJoin && joinExTime) {
        ButtonTitle.push(
          <Button
            // type="danger"
            // className={styles.buttton}
            className='btn-bordered'
            style={{ marginLeft: '5px', marginRight: '5px' }}
            onClick={this.editUserInfo}
            loading={getUserInfoLoading}
            key={'修改报名信息'}
          >
            修改报名信息
          </Button>,
        );
      }
    }
    return ButtonTitle;
  };

  getActivityTime = (start, end) => `${start.slice(0, 16)}--${end.slice(0, 16)}`;

  getDetailInfo = (title, content) => (
    <div className={styles.activityDetail}>
      <span className={styles.activityTitle}>{title}</span>
      <span className={styles.activityInfo}>{content}</span>
    </div>
  );

  render() {
    const {
      activityDetail,
      activityInfo,// 'onlineExam/getonlineExam',获取 activityInfo
      isMore, // TODO 待确定作用
      // isIframe, //if (`${item.resultMap.objectType}` === '3' || `${item.resultMap.objectType}` === '6')
      // iframeSrc, //const { newsContent } = item.resultMap;
    } = this.props.activityDetailModel;

    const {
      memberList,
      userInfoList,
      memberListVisible
    } = this.props.applyActivityModel;

    const { dispatch } = this.props;

    const isIframe = `${activityDetail.objectType}` === '3' || `${activityDetail.objectType}` === '6';
    const iframeSrc = isIframe && activityDetail.newsContent;
    return (
      <div style={{ padding: 20 }}>
        {isIframe ? (
          <div className={styles.iframeBox}>
            <iframe src={iframeSrc} frameBorder="0" title="iframe" className={styles.more} />
          </div>
        ) : (
            <div className={styles.waitTxt}>
              <p className={styles.title}>{activityInfo.name}</p>
              {activityInfo.name ? (
                <div className={styles.subTitle}>
                  {this.getDetailInfo(
                    '活动时间：',
                    this.getActivityTime(activityInfo.begintime, activityInfo.endtime),
                  )}
                  {this.getDetailInfo(
                    '报名时间：',
                    this.getActivityTime(activityInfo.applybegin, activityInfo.applyend),
                  )}
                  <div className={styles.activityDetail}>
                    <span className={styles.activityTitleContacts}>活动联系人：</span>
                    <span className={styles.activityInfoContacts}>
                      <Avatar
                        size="36px"
                        style={{
                          backgroundColor: '#087edf',
                          color: '#fff',
                          marginRight: 8,
                          verticalAlign: 'middle',
                        }}
                      >
                        {activityInfo.linkman.length >= 2
                          ? activityInfo.linkman.slice(-2)
                          : activityInfo.linkman}
                      </Avatar>
                      <span style={{ marginRight: 40 }}>{`${activityInfo.linkman}`}</span>
                      <MyFont
                        type="icon-shouji"
                        style={{ fontSize: 16, color: 'black', marginRight: 6 }}
                      />
                      <span>{`${activityInfo.mobile}`}</span>
                    </span>
                  </div>

                  {this.getDetailInfo('活动地点：', activityInfo.address)}

                  <div className={styles.activityDetail}>
                    <span className={styles.activityTitle}>活动安排：</span>
                  </div>
                </div>
              ) : null}
              <p className={styles.examTime} id="content" dangerouslySetInnerHTML={{ __html: activityInfo.content }} />
              <div className={styles.joinExamBtn}>{this.getButtons()}</div>
            </div>
          )}
        <EditModal />
        <ActivityMemberModal
          visible={memberListVisible}
          dataSource={memberList}
          onCancel={() => {
            dispatch({
              type: 'applyActivityModel/saveState',
              payload: {
                memberListVisible: false
              }
            })
          }}
        />
      </div>
    );
  }
}

export default ApplyActivity;
