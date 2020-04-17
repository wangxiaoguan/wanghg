import {connect} from 'dva';

import React, {PureComponent} from 'react';

import styles from './GridContent.less';

class GridContent extends PureComponent {
  render() {
    const {contentWidth, children} = this.props;
    let className = `${styles.main}`;
    if (contentWidth === 'Fixed') {
      className = `${styles.main}`;
    }
    return <div className={className}>{children}</div>;
  }
}

export default connect(({setting}) => ({
  contentWidth: setting.contentWidth,
}))(GridContent);
