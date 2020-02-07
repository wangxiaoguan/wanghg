import React, { PureComponent } from 'react';
import { Breadcrumb, Icon } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ menu, seekActivity, thematicEducation }) => ({
  menu,
  seekActivity,
  thematicEducation,
}))
class SeekActivityBread extends PureComponent {
  // 获取面包屑节点数据
  getSteps = (arr, start) => {
    const newArr = [];
    for (let i = start; i < arr.length; i += 1) {
      const obj = {};
      obj.name = arr[i];
      obj.index = i - start + 1;
      newArr.push(obj);
    }
    return newArr;
  };

  getItem = (item, arr, type) => {
    const {
      location: { query },
    } = this.props;
    // console.log('item=', item);

    // 跳转地址
    const ahead = `${arr.slice(0, 1 + item.index).join('/')}`;
    let path = '';
    path = `${ahead}/${item.name}`;
    if (item.index === 4 && path.indexOf('topics') !== -1) {
      path = `${arr.slice(0, 3 + item.index).join('/')}`;
    }

    // 资讯活动详情含地址参数
    let param = '?';
    if (query && (path.indexOf('news') !== -1 || path.indexOf('activity') !== -1)) {
      for (let k in query) {
        param = `${param}${k}=${query[k]}&`;
      }
    }
    param = param.slice(0, param.length - 1);
    path = `${path}${param}`;

    // console.log('path', path, item.index);
    //面包屑不包含栏目类型和专题id
    if (item.index === 2) {
      return;
    }
    if (item.index === 5 && path.indexOf('topics') !== -1) {
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

  getHomeItem = (item, arr, type) => {
    const {
      location: { query },
    } = this.props;

    // 跳转地址
    const ahead = `${arr.slice(0, item.index).join('/')}`;
    let path = '';
    path = `${ahead}/${item.name}`;
    if (item.index === 2 && path.indexOf('topics') !== -1) {
      path = `${arr.slice(0, 2 + item.index).join('/')}`;
    }

    // 资讯活动详情含地址参数
    let param = '?';
    if (query && (path.indexOf('news') !== -1 || path.indexOf('activity') !== -1)) {
      for (let k in query) {
        param = `${param}${k}=${query[k]}&`;
      }
    }
    param = param.slice(0, param.length - 1);
    path = `${path}${param}`;
    if (item.index === 3 && path.indexOf('topics') !== -1) {
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

  getAccountCenterItem = (item, arr, type) => {
    const {
      location: { query },
    } = this.props;

    // 跳转地址
    const ahead = `${arr.slice(0, item.index).join('/')}`;
    let path = '';
    path = `${ahead}/${item.name}`;
    if (item.index === 2 && path.indexOf('topics') !== -1) {
      path = `${arr.slice(0, 2 + item.index).join('/')}`;
    }

    // 资讯活动详情含地址参数
    let param = '?';
    if (query && (path.indexOf('news') !== -1 || path.indexOf('activity') !== -1)) {
      for (let k in query) {
        param = `${param}${k}=${query[k]}&`;
      }
    }
    param = param.slice(0, param.length - 1);
    path = `${path}${param}`;
    if (item.index === 3 && path.indexOf('topics') !== -1) {
      return;
    }
    // console.log('==99===', path, item.index);
    return (
      <Breadcrumb.Item key={item.index}>
        <Link to={path} replace>
          {this.getBreadcrumb(item, type)}
        </Link>
      </Breadcrumb.Item>
    );
  };

  getBreadcrumb = (item, type) => {
    const { menu, seekActivity, thematicEducation, location } = this.props;
    const { menuDetail } = menu;
    const { navList } = seekActivity;
    const { navList: themeNavList = [] } = thematicEducation;
    const arr = location.pathname.split('/');
    if (item.index === 1 && type !== 'home' && type !== 'accountCenter') {
      let menuItem = [];
      menuItem = menuDetail.filter(v => v.id === item.name);
      return menuItem.length ? menuItem[0].name : '';
    }
    if (item.index === 3 && type !== 'home' && type !== 'accountCenter') {
      let navItem = [];
      // 菜单为主题教育
      if (arr[1] === 'thematic') {
        for (let i = 0; i < themeNavList.length; i += 1) {
          if (themeNavList[i].id === item.name) {
            return themeNavList[i].name;
          } else if (themeNavList[i].categorylist.length) {
            for (let k = 0; k < themeNavList[i].categorylist.length; k += 1) {
              if (`${themeNavList[i].categorylist[k].id}` === item.name) {
                return themeNavList[i].categorylist[k].name;
              }
            }
          }
        }
        return '';
      }
      navItem = navList.filter(v => v.id === item.name);
      return navItem.length ? navItem[0].name : '';
    }
    switch (item.name) {
      case 'news':
        return '资讯详情';
      case 'activity':
        return '活动详情';
      case 'topics':
        return '专题';
      case 'home':
        return '首页';
      case 'accountCenter':
        return '个人中心';
      case 'study':
        return '我的学习';
      case 'examination':
        return '我的考试';
      case 'joinExam':
        return '参加考试';
      case 'viewExam':
        return '查看考试';
      default:
        break;
    }
    return item.name;
  };

  getRenderItem = (menuType, steps, arr) => {
    const { type } = this.props;
    if (menuType === 'home') {
      return steps.map(item => this.getHomeItem(item, arr, 'home'));
    } else if (menuType === 'accountCenter') {
      return steps.map(item => this.getAccountCenterItem(item, arr, 'accountCenter'));
    }
    return steps.map(item => this.getItem(item, arr, type));
  };

  render() {
    const { location } = this.props;
    const arr = location.pathname.split('/');
    let steps;
    let menuType = '';
    if (arr[1] === 'home') {
      steps = this.getSteps(arr, 1);
      menuType = 'home';
    } else if (arr[1] === 'accountCenter') {
      steps = this.getSteps(arr, 1);
      menuType = 'accountCenter';
    } else {
      steps = this.getSteps(arr, 2);
    }
    // console.log('steps==', steps);
    return (
      <div className={styles.breadcrumb} style={{ marginBottom: 20, width: '100%' }}>
        <i className={styles.titleStar}></i>
        <Breadcrumb separator={<Icon type="right" style={{ fontSize: 14 }} />}>
          {this.getRenderItem(menuType, steps, arr)}
        </Breadcrumb>
      </div>
    );
  }
}
export default SeekActivityBread;
