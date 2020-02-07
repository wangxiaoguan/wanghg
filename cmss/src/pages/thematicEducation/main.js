import React, { Component } from 'react';
import { connect } from 'dva';
import Seek from './seek';
import MyTask from './myTask';
// import styles from './index.less';

@connect(({ thematicEducation }) => ({
  thematicEducation,
}))
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { thematicEducation, match } = this.props;
    const { navList } = thematicEducation;
    const { listId } = match.params;
    let isSeekOrActivity = true;
    for (let i = 0; i < navList.length; i += 1) {
      if (navList[i].id === listId && navList[i].type === '1') {
        isSeekOrActivity = false;
      }
    }
    if (isSeekOrActivity) {
      return <Seek {...this.props} />;
    }
    return <MyTask {...this.props} />;
  }
}
export default Main;
