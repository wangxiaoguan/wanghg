/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
// import router from 'umi/router';
import { Typography, Button } from 'antd';
import MyFont from '../../utils/myIcon';
import moment from 'moment';
import { getCurrentDate } from '@/utils/utils';
import commenConfig from '../../../config/commenConfig';
import styles from './index.less';

const { Paragraph } = Typography;

class NewList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onchange = item => {
    let newPath;
    if (`${item.objectType}` === '1' && `${item.type}` === '4') {
      // 专题
      newPath = `${window.location.href}/topics/${item.id}`;
    } else {
      const Type = `${item.objectType}` === '2' ? 'activity' : 'news';
      newPath = `${window.location.href}/${Type}?id=${item.id}&subType=${item.type}`;
    }

    // console.log(newPath);
    window.open(newPath, '_blank');
  };

  changeBig = id => {
    let img = document.getElementById(id);
    let i = 1;
    const myVar = setInterval(() => {
      i = i + 0.01;
      if (i >= 1.1) {
        clearInterval(myVar);
      }
      img.style.cssText = `${img.style.cssText}-ms-transform:scale(${1.1})`;
      img.style.setProperty('-ms-transform', `scale(${i})`);
      img.style.setProperty('transform', `scale(${i})`);
      img.style.setProperty('-o-transform', `scale(${i})`);
    }, 15);
  };

  changeSmall = id => {
    const img = document.getElementById(id);
    let i = 1.1;
    const myVar = setInterval(() => {
      i = i - 0.02;
      if (i <= 1) {
        clearInterval(myVar);
      }
      img.style.cssText = `${img.style.cssText}-ms-transform:scale(${1})`;
      img.style.setProperty('-ms-transform', `scale(${i})`);
      img.style.setProperty('transform', `scale(${i})`);
      img.style.setProperty('-moz-transform', `scale(${i})`);
    }, 15);
  };

  getMyFont = type => <MyFont type={type} style={{ fontSize: 15, marginRight: 5 }} />;

  getListNew = (item, k) => {
    // console.log(k, item);
    // const { newListType } = this.props;
    let prog = -1;
    if (item.studyTime !== undefined && item.totalStudyTime !== undefined) {
      if (item.totalStudyTime > item.studyTime) {
        prog = 100;
      } else if (item.totalStudyTime === 0 || item.studyTime === 0) {
        prog = 0;
      } else {
        prog = Number(((item.totalStudyTime * 100) / item.studyTime).toFixed(0));
      }
    } else {
      prog = -1;
    }

    let imageUrl;
    const newImg = item.titleImage;
    if (newImg && newImg.length > 0 && newImg[0].indexOf('http') === -1) {
      imageUrl = `${commenConfig.downPath}/${newImg[0]}`;
    } else if (newImg && newImg.length > 0) {
      imageUrl = `${newImg[0]}`;
    } else {
      imageUrl = '';
    }
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    //活动已经结束的需要加标志
    let endFlag = false;
    if (moment(item.endTime) < moment(getCurrentDate(0), dateFormat)) {
      endFlag = true;
    }
    // console.log('imageUrl', imageUrl);
    const isTopics = `${item.objectType}` === '1' && `${item.type}` === '4';
    return (
      <div className={styles.newItem} key={item.id} onClick={() => this.onchange(item)}>
        <div className={styles.itemWraper}>
          <div value="" className={styles.left}>
            {item.isRequired ? this.getNewState(item.isRequired) : null}
            {endFlag ? <div className={styles.endStyle}>结束</div> : null}
            <img
              src={`${imageUrl}`}
              onError={e => {
                const img = document.getElementById(`${item.id}-k`);
                img.src = require('../../assets/error.png');
              }}
              id={`${item.id}-k`}
              onMouseOver={() => this.changeBig(`${item.id}-k`)}
              onMouseOut={() => this.changeSmall(`${item.id}-k`)}
              className={styles.newImg}
            />
          </div>
          <div className={styles.newsContain}>
            <p>{item.title}</p>
            <div className={styles.newTime}>
              {typeof item.updateTime === 'string' ? item.updateTime.slice(0, 11) : ''}
            </div>
            <Paragraph
              ellipsis={{
                rows: 2,
                expandable: false,
              }}
              className={styles.newContain}
            >
              {item.digest}
            </Paragraph>
            <div className={styles.newBottom}>
              {isTopics ? (
                <MyFont
                  type="icon-group5"
                  style={{ fontSize: 35, color: 'red', marginRight: 115 }}
                />
              ) : (
                <div className={styles.department}>{item.source}</div>
              )}
              <span className={styles.span}>
                {this.getMyFont('icon-yuedu')}
                {item.pviews || 0}
              </span>
              {/* 专题类型没有统计评论数 */}
              {`${item.type}` !== '4' ? (
                <span className={styles.span}>
                  {this.getMyFont('icon-pinglun')}
                  {item.commentCount || 0}
                </span>
              ) : null}
              <div className={styles.progressContainer}>
                {prog >= 0 ? this.getProgress(prog, 'small') : this.getLink(item)}
                {prog >= 0 && Number(prog) !== 100 ? (
                  <Button className={`red-btn ${styles.studyBtn}`}>
                    {prog === 0 ? '开始学习' : '继续学习'}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  getNewState = value => {
    if (value === 2) {
      return <div className={styles.newStateY}>必修课</div>;
    }
    return <div className={styles.newStateN}>选修课</div>;
  };

  getLink = item => {
    const { newListType } = this.props;
    const testFlag = item.objectType === 2 && item.type === '6';
    if (!testFlag && newListType === undefined) {
      return null;
    }
    if (newListType === 'waitTest') {
      return (
        <Button className={styles.butnTest} type="danger">
          立即考试
        </Button>
      );
    }
    if (newListType === 'overTest') {
      return <a>查看详情</a>;
    }
    return null;
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

  render() {
    const { newsList } = this.props;
    return <div className={styles.newList}>{newsList.map((v, k) => this.getListNew(v, k))}</div>;
  }
}
export default NewList;
