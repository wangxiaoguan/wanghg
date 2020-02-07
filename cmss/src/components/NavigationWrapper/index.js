/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { storage } from '@/utils/utils';
import { connect } from 'dva';
import router from 'umi/router';
import { Menu, Badge, Spin } from 'antd';
import styles from './index.less';

const { SubMenu } = Menu;

@connect(({ accountCenter }) => ({
  accountCenter,
}))
class NavigationWrapper extends Component {
  constructor(props) {
    super(props);
    const { navList, initSelectKeys, initOpenKeys, location } = props;
    const selectedKeys = initSelectKeys || this.getInitKey(props);
    const openKeys = initOpenKeys || this.getInitOpenKey(selectedKeys, navList);
    const arrKey = location.pathname.split('/');
    this.state = {
      openKeys,
      selectedKeys,
      arrKey,
      tipsFlag: {},
    };
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    if (location.pathname.indexOf('accountCenter') !== -1) {
      const formatData = {
        department: `${userInfo.orgid}`,
        msgId: 'PARTY_BUILDING_REMIND_AMOUNT',
        userId: `${userInfo.id}`,
      };
      dispatch({
        type: 'accountCenter/getTips',
        payload: {
          text: JSON.stringify(formatData),
        },
        callBack: res => {
          this.setState({
            tipsFlag: res,
          });
        },
      });
    }
  }

  componentDidUpdate(nextProps) {
    if (this.props !== nextProps) {
      const { navList, initSelectKeys, initOpenKeys, location } = this.props;
      const initKey = initSelectKeys || this.getInitKey(this.props);
      const arrKey = location.pathname.split('/');
      const initOpenKey = initOpenKeys || this.getInitOpenKey(initKey, navList);
      this.setState({
        openKeys: initOpenKey,
        selectedKeys: initKey,
        arrKey,
      });
    }
  }

  clickSubMenu = (obj, item, type) => {
    // const userInfo = JSON.parse (storage.getLocal ('userInfo'));
    const { handleNavChange } = this.props;
    if (type === 'parent') {
      this.setState(
        {
          selectedKeys: [`${item.id}`],
          openKeys: [item.id],
        },
        () => {
          handleNavChange(item.type, item.id);
        }
      );
    } else {
      this.setState(
        {
          selectedKeys: [`${item.id}`],
        },
        () => {
          handleNavChange(item.type, item.id);
        }
      );
    }
    if (item.children !== undefined && item.children.length > 0) {
    }
    // const userId = userInfo && userInfo.id;
    // const data = storage.getLocal (`${userId}`)
    //   ? JSON.parse (storage.getLocal (`${userId}`))
    //   : '';
    // if (data) {
    //   for (let i = 0; i < data.length; i++) {
    //     if (data[i].key === obj.key) {
    //       data[i].dataList.push ({
    //         time: new Date ().getTime (),
    //         cnt: 1,
    //       });
    //     }
    //   }
    //   storage.setLocal (`${userId}`, JSON.stringify (data));
    // }
  };

  getInitKey = props => {
    const { location, match, navList } = props;
    const arrKey = location.pathname.split('/');
    if (navList.length === 0) {
      return;
    }
    const newNav = navList.map(item => Number(item.id));
    let initKey = [''];
    if (arrKey.length > 4) {
      if (newNav.includes(Number(arrKey[4]))) {
        initKey = [arrKey[4]];
      } else {
        router.replace('/404');
      }
    } else if (arrKey.length === 4 && arrKey[3] === '') {
      router.replace(`${match.url}${navList[0].type}/${navList[0].id}`);
    } else if (arrKey.length < 4) {
      router.replace(`${match.url}/${navList[0].type}/${navList[0].id}`);
    }
    return initKey;
  };

  getInitOpenKey = (initKey, navList) => {
    for (let i = 0; i < navList.length; i += 1) {
      if (navList[i].id === initKey[0]) {
        return [navList[i].id];
      }
      if (navList[i].children !== undefined) {
        for (let j = 0; j < navList[i].children.length; j += 1) {
          if (navList[i].children[j].id === initKey[0]) {
            return [navList[i].id];
          }
        }
      }
    }
    return initKey;
  };

  render() {
    const { children, navList } = this.props;
    const { openKeys, selectedKeys, arrKey, tipsFlag } = this.state;
    const displayFlag = arrKey.includes('accountCenter') && arrKey.length > 3;
    return (
      <div className={styles.wrapperClassName}>
        <div
          className={styles.nav}
          style={{
            display: arrKey.length > 5 || displayFlag ? 'none' : 'inline-block',
          }}
        >
          <Spin spinning={false} style={{ top: 200 }}>
            <Menu
              onClick={this.handleClick}
              style={{ width: 142 }}
              openKeys={openKeys}
              selectedKeys={selectedKeys}
              onSelect={this.onSelect}
              mode="inline"
            >
              {navList.length > 0 &&
                navList.map(item => {
                  let flag = false;
                  if (tipsFlag.unlearnedNum > 0 && item.name === '我的学习') {
                    flag = true;
                  }
                  if (tipsFlag.unexamedNum > 0 && item.name === '我的考试') {
                    flag = true;
                  }
                  return (
                    <SubMenu
                      key={item.id}
                      onTitleClick={obj => this.clickSubMenu(obj, item, 'parent')}
                      title={
                        <a className={item.key === 'life' ? styles.subLifeTitle : styles.subTitle}>
                          {item.name}
                          {flag && <span className={styles.tips} />}
                        </a>
                      }
                    >
                      {item.children &&
                        item.children.length > 0 &&
                        item.children.map(item1 => (
                          <Menu.Item
                            key={item1.id}
                            onClick={obj => this.clickSubMenu(obj, item1, 'children')}
                          >
                            <a>
                              <Badge status="default" /> <span>{item1.name}</span>
                            </a>
                          </Menu.Item>
                        ))}
                    </SubMenu>
                  );
                })}
            </Menu>
          </Spin>
        </div>
        <div
          className={styles.content}
          style={{ width: arrKey.length > 5 || displayFlag ? 1000 : 858 }}
        >
          {children || null}
        </div>
      </div>
    );
  }
}
export default NavigationWrapper;
