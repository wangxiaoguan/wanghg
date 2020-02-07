import React, { Component } from 'react';
// import Link from 'umi/link';
import router from 'umi/router';
import MyFont from '../../utils/myIcon';
import styles from './index.less';
import commenConfig from '../../../config/commenConfig';

class ActivityList extends Component {
  onchange = item => {
    const {
      match: { url },
    } = this.props;
    if (`${item.objectType}` === '1' && `${item.type}` === '4') {
      // 专题
      router.push(`${url}/topics/${item.id}`);
    } else {
      router.push({
        pathname: `${url}/${`${item.objectType}` === '2' ? 'activity' : 'news'}`,
        query: {
          id: item.id,
          subType: item.type,
        },
      });
    }
  };

  getListNew = (item, key) => (
    <div key={key} className={styles.main}>
      <div
        className={styles.mainListNew}
        style={{ height: 130 }}
        onClick={() => this.onchange(item)}
      >
        <div className={styles.newsLeft}>
          {item.isRequired ? this.getNewState(item.isRequired) : null}
          <div
            style={{
              backgroundImage: `url(${commenConfig.downPath}/${item.titleImage})`,
            }}
            className={styles.newImg}
          />
          {item.type === '3' ? <div className={styles.vedioLogo} /> : null}
        </div>
        <div className={styles.newsContain}>
          <p>{item.title}</p>
          <div className={styles.newContain}>活动时间：{item.beginTime}</div>
          {this.getActivityTimeFlag(item.endTime) ? (
            <div className={styles.inStyle}>进行中</div>
          ) : (
            <div className={styles.endStyle}>已结束</div>
          )}
          <div className={styles.newBottom}>
            <div className={styles.department}>{item.source}</div>
            {item.participant !== undefined ? <span>已有{item.participant}人参加</span> : null}
          </div>
        </div>
      </div>
    </div>
  );

  // 获取当时时间格式为YYYY-MM-DD HH:MM:SS
  getNowFormatDate = () => {
    const date = new Date();
    const seperator1 = '-';
    const seperator2 = ':';
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = `0${month}`;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = `0${strDate}`;
    }
    const currentdate = `${date.getFullYear() +
      seperator1 +
      month +
      seperator1 +
      strDate} ${date.getHours()}${seperator2}${date.getMinutes()}${seperator2}${date.getSeconds()}`;
    return currentdate;
  };

  getActivityTimeFlag = time => {
    console.log(time, this.getNowFormatDate());
    let isExpira = false;
    if (time) {
      isExpira =
        new Date(this.getNowFormatDate().replace(/-/g, '/')) < new Date(time.replace(/-/g, '/'));
    }
    return isExpira;
  };

  // getLink = item => {
  //   const { newListType, match } = this.props;
  //   if (newListType === undefined || !newListType) {
  //     return null;
  //   }
  //   if (newListType === 'waitTest') {
  //     return <Link to={`${match.url}/${item.id}`}>开始考试</Link>;
  //   }
  //   if (newListType === 'overTest') {
  //     return <Link to={`${match.url}/${item.id}`}>查看详情</Link>;
  //   }
  //   return null;
  // };

  getNewState = value => {
    if (value === 1) {
      return <div className={styles.newStateY}>必修课</div>;
    }
    return <div className={styles.newStateN}>选修课</div>;
  };

  getProgress = (value, type) => {
    if (type === 'small') {
      if (value >= 5) {
        return (
          <div className={styles.right}>
            <small>学习进度：</small>
            <div className={styles.progress}>
              <div className={styles.inner} style={{ width: value > 100 ? '100%' : `${value}%` }}>
                <small style={{ color: '#fff' }}>{`${value}%`}</small>
              </div>
            </div>
          </div>
        );
      }
      return (
        <div className={styles.right}>
          <small>学习进度：</small>
          <div className={styles.progress}>
            <div className={styles.inner} style={{ width: `${value}%` }} />
            <small style={{ color: '#908383' }}>{`${value}%`}</small>
          </div>
        </div>
      );
    }
    return null;
  };

  getMyFont = type => <MyFont type={type} style={{ fontSize: 15, marginRight: 5 }} />;

  render() {
    const { newList } = this.props;
    return <div className={styles.newList}>{newList.map((v, k) => this.getListNew(v, k))}</div>;
  }
}

export default ActivityList;
