/**
 * 进度条
 **/

import React from 'react';
import { Progress } from 'antd'
import PropTypes from 'prop-types';
import styles from './index.less';
import { connect } from 'dva'
import { storage } from '@/utils/utils';

@connect(({ detailModel, loading }) => ({
  detailModel,
  loading
}))
class StudyProgress extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      percent: 0,
      timer: null,
      studyTime: 0,
      saveTimer: null,
    }
  }

  static propTypes = {
    totalTime: PropTypes.number, // 总学习时间
    studyTime: PropTypes.number, // 已经学习时间
    interval: PropTypes.number, // 计时器时间间隔
    id: PropTypes.string, // 活动id
  };

  static defaultProps = {
    totalTime: 0,
    studyTime: 0,
    interval: 1000,
    id: '',
  };

  componentDidMount() {
    this.getPercent();
  }

  getPercent = () => {
    const { totalTime, studyTime, interval } = this.props;
    let time = 0;
    let percent = Math.floor(((time + studyTime) / totalTime) * 100);
    if (studyTime >= totalTime) {
      percent = 100;
      this.setState({ percent, studyTime: totalTime });
      if (totalTime === 0) {
        // 没有设置时间的
        this.setState({ percent, studyTime: 1 }, () => { this.saveProgress() });
      }
      return
    }

    const timer = setInterval(() => {
      if (percent >= 100) {
        this.clearTimer();
        this.clearSaveTimer();
      } else {
        time += interval; // 每隔1s加1
        if (time + studyTime >= totalTime) {
          this.clearTimer();
          this.clearSaveTimer();
          percent = 100;
          this.setState({ percent, studyTime: totalTime });
          this.saveProgress();
        } else {
          percent = Math.floor(((time + studyTime) / totalTime) * 100);
          this.setState({ percent, studyTime: studyTime + time });
        }
      }
    }, 1000);
    this.setState({ timer })
    this.saveProgressTask();
  };

  saveProgressTask = () => {
    const saveTimer = setInterval(() => {
      this.saveProgress();
    }, 2000);
    this.setState({
      saveTimer
    })
  }

  saveProgress = (unshowExamModal) => {
    const { dispatch, id } = this.props;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const { studyTime, percent } = this.state;
    const param = {
      msgId: 'NEWS_DETAIL_QUIT',
      userId: userInfo.id,
      objectId: id,
      currentStudyTime: Math.round(studyTime), // 当前学习时长
    }
    dispatch({
      type: 'detailModel/saveProgress',
      payload: {
        text: JSON.stringify(param)
      }
    })
    if (!unshowExamModal && percent >= 100) {
      dispatch({
        type: 'detailModel/saveProgressData',
        payload: {
          studyTime
        }
      })
      dispatch({
        type: 'detailModel/showConfirmExam',
        payload: {
          showConfirmExam: true
        }
      })
    }
  }

  render() {
    const { percent } = this.state;
    return <span className={styles.studySpeed}>
      <span style={{ marginTop: '3px' }}> 学习进度:</span>
      <Progress
        className={styles.studyProgress}
        strokeColor={{
          from: '#F5273B',
          to: '#FF6B6B',
        }}
        percent={percent}
        status="active"
      />
    </span>;
  }

  clearTimer = () => {
    const { timer } = this.state;
    if (timer) {
      clearInterval(timer);
    }
  }
  clearSaveTimer = () => {
    const { saveTimer } = this.state;
    if (saveTimer) {
      clearInterval(saveTimer);
    }
  }

  componentWillUnmount() {
    this.clearTimer();
    this.clearSaveTimer();
    this.saveProgress(true);
  }
}

export default StudyProgress;
