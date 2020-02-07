import React, { Component } from 'react';
import TaskBread from './taskBread.js';
import SeekActivityBread from './seekActivityBread.js';
// import styles from './index.less';

class BreadCrumbDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getSteps = () => {
    return '';
  };

  render() {
    const { type, location } = this.props;
    const arrKeys = location.pathname.split('/');
    if (
      type === '党建任务' ||
      type === '主题教育' ||
      arrKeys[1] === 'task' ||
      arrKeys[1] === 'thematic'
    ) {
      return <TaskBread {...this.props}></TaskBread>;
    }
    return <SeekActivityBread {...this.props}></SeekActivityBread>;
  }
}
export default BreadCrumbDetail;
