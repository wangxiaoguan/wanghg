import React, { Component } from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { storage, getNowFormatDate } from '@/utils/utils';
import { connect } from 'dva';
import ActivityMemberModal from '../modal/ActivityMemberModal';
import QuestionnaireModal from '../modal/QuestionnaireModal';
import DepartmentJoinRateModal from '../modal/DepartmentJoinRateModal';
import styles from './index.less';

@connect(({ questionnaireModel, activityDetailModel, loading }) => ({
  questionnaireModel,
  activityDetailModel,
  loading1: loading.effects['questionnaireModel/getActivityMembers'],
  loading2: loading.effects['questionnaireModel/getQuestionnaire'],
  loading3: loading.effects['questionnaireModel/getDepartmentJoinRate'],
}))
class index extends Component {

  joinActivity = () => {
    const { match } = this.props;
    // typeid === '5' 问卷
    const { activityNewsId } = this.props;
    const { isJoin } = this.props.questionnaireModel;
    if (!isJoin) {
      router.push({
        pathname: `${match.url}/joinExam`,
        query: {
          activityId: activityNewsId,
          subType: '4',
        },
      });
    }
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
      type: 'questionnaireModel/getActivityMembers',
      payload: {
        text: JSON.stringify(formData),
      },
    });
  };

  // 问卷统计
  getQuestionnaire = () => {
    const { dispatch, activityNewsId } = this.props;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const formData = {
      activityId: activityNewsId,
      msgId: 'APP048',
      index: 0,
      userId: userInfo.id,
      department: userInfo.orgid,
    };
    dispatch({
      type: 'questionnaireModel/getQuestionnaire',
      payload: {
        text: JSON.stringify(formData),
      },
    });
  };

  // 获取组织参与率
  getDepartmentJoinRate = () => {
    const { dispatch, activityNewsId } = this.props;
    const { userInfo } = this.props.activityDetailModel;
    const formData = {
      activityId: activityNewsId,
      msgId: 'APP047',
      index: 0,
      userId: userInfo.id,
      department: userInfo.orgid,
    };
    dispatch({
      type: 'questionnaireModel/getDepartmentJoinRate',
      payload: {
        text: JSON.stringify(formData),
      },
    });
  };

  cancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'questionnaireModel/saveState',
      payload: {
        visible: '',
      },
    });
  };


  getButtonTitle = () => {
    const ButtonTitle = [];
    const { loading1, loading2, loading3 } = this.props;
    const { activityDetail, activityInfo } = this.props.activityDetailModel;
    // 报名活动 问卷活动
    // 活动时间是否截止
    let isExTime = false;
    if (
      activityInfo.endtime && (new Date(getNowFormatDate().replace(/-/g, '/')) <
        new Date(activityInfo.endtime.replace(/-/g, '/')))
    ) {
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
          key={'112312'}
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
    ButtonTitle.push(
      <Button
        // type="danger"
        // className={styles.buttton}
        className={'btn-bordered'}
        style={{ marginLeft: '5px', marginRight: '5px' }}
        onClick={this.getQuestionnaire}
        loading={loading2}
        key={'问卷统计'}
      >
        问卷统计
      </Button>,
    );
    ButtonTitle.push(
      <Button
        // type="danger"
        // className={styles.buttton}
        className={'btn-bordered'}
        style={{ marginLeft: '5px', marginRight: '5px' }}
        onClick={this.getDepartmentJoinRate}
        loading={loading3}
        key={'组织参与率'}
      >
        组织参与率
      </Button>,
    );
    return ButtonTitle;
  };

  // 控制第一个按钮(是否参加按钮)
  getActivityButton = (activityInfo, isExTime) => {
    const { isJoin, isCan } = this.props.activityDetailModel;
    if (isJoin) {// 是否已参加
      return { name: '已参加', disable: true };
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

  getActivityTime = (start, end) => `${start.slice(0, 16)}--${end.slice(0, 16)}`;

  render() {
    const { activityNewsId } = this.props;
    const { activityInfo } = this.props.activityDetailModel;
    const { questionnaireList, memberList, JoinRateList, visible } = this.props.questionnaireModel;
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
        <QuestionnaireModal
          visible={visible === 'question'}
          dataSource={questionnaireList || []}
          onCancel={this.cancel}
          activityNewsId={activityNewsId}
        />
        <DepartmentJoinRateModal
          visible={visible === 'joinRate'}
          dataSource={JoinRateList}
          onCancel={this.cancel}
        />
      </div>
    );
  }
}

export default index;
