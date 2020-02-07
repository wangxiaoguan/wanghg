import React, { Component } from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { storage, getNowFormatDate } from '@/utils/utils';
import { connect } from 'dva';
import ActivityMemberModal from '../modal/ActivityMemberModal';
import VoteResultModal from '../modal/VoteResultModal';
import styles from './index.less';


@connect(({ voteModel, activityDetailModel, loading }) => ({
  voteModel,
  activityDetailModel,
  loading,
}))
class index extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  joinActivity = () => {
    const { match, activityNewsId } = this.props;
    router.push({
      pathname: `${match.url}/joinExam`,
      query: {
        activityId: activityNewsId,
        // subType,
        subType: '4',
      },
    });
  };

  // 活动参与人员
  getJoinPersons = () => {
    const { dispatch, activityNewsId } = this.props;
    const formData = {
      activityId: activityNewsId,
      msgId: 'APP042',
      index: 0,
    };
    dispatch({
      type: 'voteModel/getActivityMembers',
      payload: {
        text: JSON.stringify(formData),
      },
    });
  };

  // 获取投票结果
  getVoteResult = () => {
    const { activityNewsId, dispatch } = this.props;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const formData = {
      activityId: activityNewsId,
      msgId: 'APP030',
      index: 0,
      userId: userInfo.id,
      mobile: userInfo.mobile,
    };
    dispatch({
      type: 'voteModel/getVoteResult',
      payload: {
        text: JSON.stringify(formData),
      },
    });
  };

  cancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'voteModel/saveState',
      payload: {
        visible: '',
      },
    });
  };

  getButtonTitle = () => {
    const ButtonTitle = [];
    const { loading1, loading7 } = this.props;
    const { activityDetail, activityInfo } = this.props.activityDetailModel;
    // 投票活动
    let isExTime = false;
    if (activityInfo && activityInfo.endtime && (new Date(getNowFormatDate().replace(/-/g, '/')) < new Date(activityInfo.endtime.replace(/-/g, '/')))) {
      isExTime = true;
    }
    ButtonTitle.push(
      activityDetail && JSON.stringify(activityDetail) !== '{}' ? (
        <Button
          // type="danger"
          // className={
          //   this.getActivityButton(activityInfo, isExTime).disable
          //     ? styles.butttonDisable
          //     : styles.buttton
          // }
          className={'btn-bordered'}
          style={{ marginLeft: '5px', marginRight: '5px' }}
          onClick={this.joinActivity}
          disabled={this.getActivityButton(activityInfo, isExTime).disable}
          key={'join'}
        >
          {this.getActivityButton(activityInfo, isExTime).name}
        </Button>
      ) : null,
    );
    ButtonTitle.push(
      <Button
        // type="danger"
        // className={styles.buttton}
        className={'btn-bordered'}
        style={{ marginLeft: '5px', marginRight: '5px' }}
        onClick={this.getJoinPersons}
        loading={loading1}
        key={'活动参与人员'}
      >
        活动参与人员
      </Button>,
    );
    if (isExTime) {
      ButtonTitle.push(
        <Button
          // type="danger"
          // className={styles.buttton}
          className={'btn-bordered'}
          style={{ marginLeft: '5px', marginRight: '5px' }}
          onClick={this.getVoteResult}
          loading={loading7}
          key={'查看投票结果'}
        >
          查看投票结果
        </Button>,
      );
    }
    return ButtonTitle;
  };

  // 控制第一个按钮(是否参加按钮)
  getActivityButton = (_, isExTime) => {
    const { isJoin, isCan, activityInfo, activityDetail } = this.props.activityDetailModel;
    if (isJoin) {
      let daynum = Number(activityInfo.daycount);
      if (activityInfo.daycount === undefined || activityInfo.daycount === '') {
        daynum = 1;
        if (activityDetail.joincount >= Number(daynum)) {
          return { name: '已参加', disable: true };
        }
      }
    }
    if (activityInfo.upperLimit && activityInfo.participant >= activityInfo.upperLimit) {
      return { name: '该活动参与人数已达上限', disable: true };
    }
    if (isCan) {
      if (isExTime) {
        return activityDetail.joincount === 0
          ? { name: '我要参加', disable: false }
          : { name: '再次投票', disable: false };
      }
      return { name: '该活动已结束', disable: true };
    }
    return {
      name: activityDetail.btnName !== '' ? activityDetail.btnName : activityDetail.reason,
      disable: true,
    };
  };

  getActivityTime = (start, end) => `${start.slice(0, 16)}--${end.slice(0, 16)}`;

  render() {
    const { visible, memberList, voteList } = this.props.voteModel;
    const { activityInfo, activityDetail } = this.props.activityDetailModel;

    // 活动包含的操作按钮
    // 比对当前时间是未开始还是已结束isExpira为true表示在考试时间内
    // typeid：活动类型：报名（1无报名信息,2有报名信息），4投票，5问卷，6考试，7订购
    const ButtonTitle = this.getButtonTitle(activityInfo);
    return (
      <div style={{ padding: 20 }}>
        <div className={styles.waitTxt}>
          <p className={styles.title}>{activityInfo.name}</p>
          {activityInfo.name ? (
            <div className={styles.subTitle}>
              <div className={styles.activityDetail}>
                <span className={styles.activityTitle}>{'活动时间：'}</span>
                <span
                  className={styles.activityInfo}>{this.getActivityTime(activityInfo.begintime, activityInfo.endtime)}</span>
              </div>
              <div className={styles.activityDetail}>
                <span className={styles.activityTitle}>活动安排：</span>
              </div>
            </div>
          ) : null}
          <p className={styles.examTime} id="content" dangerouslySetInnerHTML={{ __html: activityInfo.content }} />
          <div className={styles.joinExamBtn}>{ButtonTitle}</div>
        </div>
        <ActivityMemberModal
          visible={visible === 'members'}
          dataSource={memberList}
          onCancel={this.cancel}
        />
        <VoteResultModal
          visible={visible === 'vote'}
          dataSource={{ list: voteList, titleList: activityDetail.topicList || [] }}
          onCancel={this.cancel}
        />
      </div>
    );
  }
}

export default index;
