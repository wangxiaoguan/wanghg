/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { storage, getNowFormatDate } from '@/utils/utils';
import { connect } from 'dva';
import DepartmentJoinRateModal from '../modal/DepartmentJoinRateModal';
import DepartmentScoreModal from '../modal/DepartmentScoreModal';
import StudyRateModal from '../modal/StudyRateModal';
import styles from './index.less';

@connect(({ examActivityModel, activityDetailModel, loading }) => ({
  examActivityModel,
  activityDetailModel,
  loading3: loading.effects['examActivityModel/getDepartmentJoinRate'],
  loading4: loading.effects['examActivityModel/getDepartmentScore'],
  loading5: loading.effects['examActivityModel/getStudyRank'],
}))
class index extends Component {
  // 查看考试
  viewExam = () => {
    const { activityNewsId, match, location } = this.props;
    router.push(`${match.url}/viewExam?id=${activityNewsId}&subType=${location.query.subType}`);
  };

  // 参加考试
  joinExam = () => {
    const { match, location, activityNewsId } = this.props;
    // console.log('location', location);
    const { activityDetail } = this.props.activityDetailModel;
    if (activityDetail.relatedNewsInfo) {
      const studyUrl = `${location.pathname.slice(0, 1)}accountCenter/study/news?id=${
        activityDetail.relatedNewsInfo.newsid
        }&subType=${activityDetail.relatedNewsInfo.type}`;
      const falg = window.confirm('还未完成学习，不能参加考试，是否前往学习？');
      if (falg) {
        router.push(studyUrl);
      }
    } else {
      router.push(`${match.url}/joinExam?id=${activityNewsId}&subType=${location.query.subType}`);
    }
  };

  // 获取组织参与率
  getDepartmentJoinRate = () => {
    const { dispatch, activityNewsId } = this.props;
    const { userInfo } = this.props.activityDetailModel;
    const formData = {
      activityId: activityNewsId,
      msgId: 'APP055',
      index: 0,
      userId: userInfo.id,
      department: userInfo.orgid,
    };
    dispatch({
      type: 'examActivityModel/getDepartmentJoinRate',
      payload: {
        text: JSON.stringify(formData),
      },
    });
  };

  //组织平均分
  getDepartmentScore = () => {
    const { dispatch, activityNewsId } = this.props;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const formData = {
      activityId: activityNewsId,
      msgId: 'APP046',
      index: 0,
      userId: userInfo.id,
      department: userInfo.orgid,
    };
    dispatch({
      type: 'examActivityModel/getDepartmentScore',
      payload: {
        text: JSON.stringify(formData),
      },
    });
  };

  // 学霸排行榜
  getStudyRank = () => {
    const { dispatch, activityNewsId } = this.props;
    const formData = {
      activityId: activityNewsId,
      msgId: 'APP059',
      topNum: '10',
    };
    dispatch({
      type: 'examActivityModel/getStudyRank',
      payload: {
        text: JSON.stringify(formData),
      },
    });
  };

  cancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'examActivityModel/saveState',
      payload: {
        visible: '',
      },
    });
  };

  getButtonTitle = () => {
    const {
      activityInfo = {},
      activityDetail = {},
      isJoin,
      isCan,
    } = this.props.activityDetailModel;

    const { begintime = '', endtime = '', status, selectcount, isshowpeople } = activityInfo;
    const { reason = '', joincount } = activityDetail;

    const ButtonTitle = [];
    const { loading5, loading3, loading4 } = this.props;
    // 考试活动
    let isExpira = false;
    if (begintime && endtime) {
      isExpira =
        new Date(getNowFormatDate().replace(/-/g, '/')) > new Date(begintime.replace(/-/g, '/')) &&
        new Date(getNowFormatDate().replace(/-/g, '/')) < new Date(endtime.replace(/-/g, '/'));
    }
    // 是否已经参加考试
    if (isJoin === true) {
      if (
        isExpira === false ||
        !isCan ||
        status === '2' ||
        selectcount === '0' ||
        joincount >= selectcount
      ) {
        <Button />;
      } else {
        ButtonTitle.push(
          <Button
            className={'btn-bordered'}
            style={{ marginLeft: '5px', marginRight: '5px' }}
            onClick={this.joinExam}
            key={'再次参加'}
          >
            再次参加
          </Button>
        );
      }
      ButtonTitle.push(
        <Button
          className={'btn-bordered'}
          onClick={this.viewExam}
          key={'查看详情'}
          style={{ marginLeft: '5px', marginRight: '5px' }}
        >
          查看详情
        </Button>
      );
    } else if (isExpira === false) {
      // 考试活动是否到期
      // 未到开始时间或已超过结束时间
      ButtonTitle.push(
        <Button className={'btn-bordered'} disabled key={reason}>
          {reason}
        </Button>
      );
    } else if (!isCan) {
      // 用户是否可参加
      // 不可参加
      ButtonTitle.push(
        <Button
          className={'btn-bordered'}
          style={{ marginLeft: '5px', marginRight: '5px' }}
          disabled
          key={reason}
        >
          {reason}
        </Button>
      );
    } else if (status === '2') {
      ButtonTitle.push(
        <Button className={'btn-bordered'} disabled key={'活动已取消'}>
          活动已取消
        </Button>
      );
    } else {
      ButtonTitle.push(
        <Button
          className={'btn-bordered'}
          style={{ marginLeft: '5px', marginRight: '5px' }}
          onClick={this.joinExam}
          key={'我要参加考试'}
        >
          我要参加考试
        </Button>
      );
    }
    ButtonTitle.push(
      <Button
        className={'btn-bordered'}
        style={{ marginLeft: '5px', marginRight: '5px' }}
        onClick={this.getDepartmentScore}
        loading={loading4}
        key={'组织平均分'}
      >
        组织平均分
      </Button>
    );
    ButtonTitle.push(
      <Button
        className={'btn-bordered'}
        style={{ marginLeft: '5px', marginRight: '5px' }}
        onClick={this.getDepartmentJoinRate}
        loading={loading3}
        key={'组织参与率'}
      >
        组织参与率
      </Button>
    );
    (isshowpeople === 'true' || isshowpeople === true) &&
      ButtonTitle.push(
        <Button
          // type="danger"
          // className={styles.buttton}
          className={'btn-bordered'}
          style={{ marginLeft: '5px', marginRight: '5px' }}
          onClick={this.getStudyRank}
          loading={loading5}
          key={'学霸排行'}
        >
          学霸排行
        </Button>
      );
    return ButtonTitle;
  };

  getInitValue = (list, item) => {
    if (item.type !== '选项') {
      return list[0][item.name];
    }
    return list[0][item.name];
  };

  getActivityTime = (start, end) => `${start.slice(0, 16)}--${end.slice(0, 16)}`;

  render() {
    const { activityInfo } = this.props.activityDetailModel;
    const { JoinRateList, userRankList, scoreList, visible } = this.props.examActivityModel;

    const ButtonTitle = this.getButtonTitle(activityInfo);
    return (
      <div style={{ padding: 20 }}>
        <div className={styles.waitTxt}>
          <p className={styles.title}>{activityInfo.name}</p>
          {activityInfo.name ? (
            <div className={styles.subTitle}>
              <div className={styles.activityDetail}>
                <span className={styles.activityTitle}>{'活动时间：'}</span>
                <span className={styles.activityInfo}>
                  {this.getActivityTime(activityInfo.begintime, activityInfo.endtime)}
                </span>
              </div>
              <div className={styles.activityDetail}>
                <span className={styles.activityTitle}>活动安排：</span>
              </div>
            </div>
          ) : null}
          <p
            className={styles.examTime}
            id="content"
            dangerouslySetInnerHTML={{ __html: activityInfo.content }}
          />
          <div className={styles.joinExamBtn}>{ButtonTitle}</div>
        </div>

        <DepartmentJoinRateModal
          visible={visible === 'joinRate'}
          dataSource={JoinRateList}
          onCancel={this.cancel}
        />
        <DepartmentScoreModal
          visible={visible === 'score'}
          dataSource={scoreList}
          onCancel={this.cancel}
        />
        <StudyRateModal
          visible={visible === 'rank'}
          dataSource={userRankList}
          onCancel={this.cancel}
        />
      </div>
    );
  }
}

export default index;
