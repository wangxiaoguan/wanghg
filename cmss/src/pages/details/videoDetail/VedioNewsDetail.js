import React, { Component } from 'react';
import 'react-html5video/dist/styles.css';
import styles from './VedioNewsDetail.less';
import VideoFile from './video';
import PropTypes from 'prop-types';
import { storage } from '@/utils/utils';

class VideoNewsDetail extends Component {

  static propTypes = {
    detail: PropTypes.object,
  };


  getVideo = () => {
    const { newsInfo = {}, attachList } = this.props.detail;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    if (attachList && Array.isArray(attachList)) {
      // attachList.map(a => {
      //   if(a.type === '2') {
      //     return <VideoFile videoUrl={a.url} key={a.url} newsId={newsInfo.id||''} userId={userInfo.id || ''}/>
      //   }
      //   return null;
      // })
      if (attachList[1]) {
        const a = attachList[1];
        return <VideoFile videoUrl={a.url} key={a.url} newsId={newsInfo.id || ''} userId={userInfo.id || ''} />
      }
    }
  }

  render() {

    const { newsInfo = {} } = this.props.detail;
    let content = '';
    if (newsInfo) {
      content = newsInfo.content;
    }
    return (
      <div>
        <h2 className={styles.newsTitle} id="newsTitle">
          {newsInfo.title || ''}
        </h2>
        <div id="content" className={styles.content}>
          <div className={styles.contentVideo}>
            {this.getVideo()}
          </div>
          <div dangerouslySetInnerHTML={{ __html: content }} id={'content'} />
        </div>
      </div>
    );
  }
}

export default VideoNewsDetail;
