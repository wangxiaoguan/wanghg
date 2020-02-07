/**
 * 网页详情
 */
import React from 'react';
import styles from './index.less';

export default class WebDetail extends React.Component {

  render() {
    const { detail = {} } = this.props;
    return (
      <div className={styles.iframeBox} id={'content'}>
        <iframe src={detail.newsContent} frameBorder="0" title="iframe" className={styles.more} />
      </div>
    );

  }
}
