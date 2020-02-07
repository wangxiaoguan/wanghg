/* eslint-disable jsx-a11y/anchor-is-valid */
// eslint-disable-next-line
/* eslint-disable */
import React, { Component } from 'react';
import router from 'umi/router';

import { Menu, Badge, Spin, Typography } from 'antd';
import styles from './index.less';

const { Paragraph } = Typography;
const { SubMenu } = Menu;

class TaskWrapper extends Component {
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
    };
  }

  componentDidUpdate(preProps, next) {
    const { navList, initSelectKeys, initOpenKeys, location } = this.props;
    if (location.pathname !== preProps.location.pathname) {
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
    const { handleNavChange } = this.props;
    if (type === 'parent') {
      // 选中栏目id
      const selectedId =
        item.categorylist && item.categorylist.length ? `${item.categorylist[0].id}` : `${item.id}`;

      // 选中栏目key
      const selectedKey =
        item.categorylist && item.categorylist.length
          ? [`${item.categorylist[0].type}-${item.categorylist[0].id}`]
          : [`${item.type}-${item.id}`];
      this.setState(
        {
          selectedKeys: selectedKey,
          openKeys: selectedKey,
        },
        () => {
          handleNavChange(item.type, selectedId);
        }
      );
    } else {
      this.setState(
        {
          selectedKeys: [`${item.type}-${item.id}`],
        },
        () => {
          handleNavChange(item.type, item.id);
        }
      );
    }
  };

  getInitKey = props => {
    const { location, match, navList } = props;
    const arrKey = location.pathname.split('/');
    if (navList.length === 0) {
      return;
    }

    // 所有菜单id
    let newNav = [];

    // 默认type和id
    let defaultType = '';
    let defaultId = '';

    // 注意判断是否有子菜单
    if (navList[0].categorylist && navList[0].categorylist.length > 0) {
      defaultType = navList[0].categorylist[0].type;
      defaultId = navList[0].categorylist[0].id;
    } else {
      defaultType = navList[0].type;
      defaultId = navList[0].id;
    }
    navList.forEach(item => {
      if (!item.categorylist || item.categorylist.length === 0) {
        newNav.push(item.id);
      } else {
        newNav.push(...item.categorylist.map(v => `${v.id}`));
      }
    });
    let initKey = [''];

    // 判断后自动补全url
    if (arrKey.length > 4) {
      if (newNav.includes(arrKey[4])) {
        initKey = [`${arrKey[3]}-${arrKey[4]}`];
      } else {
        router.replace('/404');
      }
    } else if (arrKey.length === 4 && arrKey[3] === '') {
      router.replace(`${match.url}${defaultType}/${defaultId}`);
    } else if (arrKey.length < 4) {
      router.replace(`${match.url}/${defaultType}/${defaultId}`);
    }
    return initKey;
  };

  getInitOpenKey = (initKey, navList) => {
    for (let i = 0; i < navList.length; i += 1) {
      let navListhildren = [];
      if (navList[i].categorylist && navList[i].categorylist.length > 0) {
        navListhildren = navList[i].categorylist.map(v => `${v.type}-${v.id}`);
      }
      if (
        `${navList[i].type}-${navList[i].id}` === initKey[0] ||
        navListhildren.includes(initKey[0])
      ) {
        return [`${navList[i].type}-${navList[i].id}`];
      }
    }
    return initKey;
  };

  render() {
    const { children, navList } = this.props;
    const { openKeys, selectedKeys, arrKey } = this.state;
    // const displayFlag = arrKey.includes('news') || arrKey.includes('activity');
    const displayFlag = false;
    return (
      <div className={styles.wrapperClassName}>
        <div
          className={styles.nav}
          style={{
            display: displayFlag ? 'none' : 'inline-block',
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
                navList.map(item => (
                  <SubMenu
                    key={`${item.type}-${item.id}`}
                    onTitleClick={obj => this.clickSubMenu(obj, item, 'parent')}
                    title={
                      <a className={item.key === 'life' ? styles.subLifeTitle : styles.subTitle}>
                        {item.name}
                      </a>
                    }
                  >
                    {item.categorylist &&
                      item.categorylist.length > 0 &&
                      item.categorylist.map(item1 => (
                        <Menu.Item
                          key={`${item1.type}-${item1.id}`}
                          onClick={obj => this.clickSubMenu(obj, item1, 'children')}
                        >
                          <a>
                            <Badge status="default" />
                            <span className={styles.title}>{item1.name}</span>
                          </a>
                        </Menu.Item>
                      ))}
                  </SubMenu>
                ))}
            </Menu>
          </Spin>
        </div>
        <div className={styles.content} style={{ width: displayFlag ? 1000 : 858 }}>
          {children || null}
        </div>
      </div>
    );
  }
}
export default TaskWrapper;
