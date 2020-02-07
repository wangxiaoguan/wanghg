import React, { PureComponent } from 'react';
import { Breadcrumb, Icon } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ partyTask }) => ({
  partyTask,
}))
class TaskBread extends PureComponent {
  getSteps = arr => {
    const newArr = [];
    for (let i = 3; i < arr.length; i += 1) {
      const obj = {};
      obj.name = arr[i];
      obj.index = i - 2;
      newArr.push(obj);
    }
    return newArr;
  };

  getItem = (item, arr, type) => {
    const {
      location: { query },
    } = this.props;

    // 跳转地址
    const ahead = `${arr.slice(0, 2 + item.index).join('/')}`;
    let path = '';
    if (item.index === 1) {
      path = ahead;
    } else if (item.index === 3 && path.indexOf('topics') !== -1) {
      path = `${arr.slice(0, 4 + item.index).join('/')}`;
    } else {
      path = `${ahead}/${item.name}`;
    }

    // 任务详情含地址参数
    let param = '?';
    if (query && path.indexOf('detail') !== -1) {
      for (let k in query) {
        param = `${param}${k}=${query[k]}&`;
      }
    }
    param = param.slice(0, param.length - 1);
    path = `${path}${param}`;

    //专题类型
    if (item.index === 4 && path.indexOf('topics') !== -1) {
      return;
    }

    return (
      <Breadcrumb.Item key={item.index}>
        <Link to={path} replace>
          {this.getBreadcrumb(item, type)}
        </Link>
      </Breadcrumb.Item>
    );
  };

  getBreadcrumb = (item, type) => {
    const { location } = this.props;
    const arr = location.pathname.split('/');
    const { partyTask } = this.props;
    const themList = partyTask.navList[2].categorylist;
    if (item.index === 1) {
      if (type) {
        return type;
      } else if (arr[1] === 'tsak') {
        return '主题教育';
      } else {
        return '党建任务';
      }
    }
    if (arr[3] === 'education') {
      for (let i = 0; i < themList.length; i += 1) {
        if (themList[i].id === item.name) {
          return themList[i].name;
        }
      }
    }
    switch (item.name) {
      case '99':
        return '重要工作部署';
      case '1':
        return '支部党员大会';
      case '3':
        return '党小组会';
      case '2':
        return '党支部委员会';
      case '4':
        return '党课';
      case '5':
        return '其他任务';
      case '7':
        return '党建统计';
      case '1564989821468132':
        return '我的任务';
      case 'createNew':
        return '新建任务';
      case 'detail':
        return '任务详情';
      case 'completionRate':
        return '查看完成率';
      case 'edit':
        return '任务编辑';
      case 'party':
        return '各级党组织任务执行情况';
      case 'allRank':
        return '各级党组织任务执行情况';
      case 'topics':
        return '专题';
      case 'examination':
        return '我的考试';
      case 'joinExam':
        return '参加考试';
      case 'viewExam':
        return '查看考试';
      case 'news':
        return '资讯详情';
      case 'activity':
        return '活动详情';
      case '305':
        return '案例集锦';
      case '304':
        return '案例学习';
      default:
        break;
    }
    return item.name;
  };

  render() {
    const { location, type } = this.props;
    const arr = location.pathname.split('/');
    const steps = this.getSteps(arr);

    return (
      <div className={styles.breadcrumb}>
        <i className={styles.titleStar}></i>
        <Breadcrumb separator={<Icon type="right" style={{ fontSize: 14 }} />}>
          {steps.map(item => this.getItem(item, arr, type))}
        </Breadcrumb>
      </div>
    );
  }
}
export default TaskBread;
