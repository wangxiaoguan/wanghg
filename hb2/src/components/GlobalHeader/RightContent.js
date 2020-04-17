import {connect} from 'dva';

import {Spin, Tag, Menu, Icon, Avatar, Badge, Dropdown} from 'antd';

import React, {Component} from 'react';

import moment from 'moment';

import {FormattedMessage} from 'umi/locale';

import groupBy from 'lodash/groupBy';

import HeaderDropdown from '../HeaderDropdown';
import {themes, updateTheme} from '../../theme';

import styles from './index.less';

@connect(({global}) => (
  {
    global
  }
))
class GlobalHeaderRight extends Component {
  constructor(props) {
    super(props);
    updateTheme();
  }

  getNoticeData() {
    const {notices = []} = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = {...notice};
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{marginRight: 0}}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  changeReadState = clickedItem => {
    const {id} = clickedItem;
    const {dispatch} = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  render() {
    const currentUser = this.props.global.user || {};
    const {onMenuClick, theme} = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter">
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Item key="triggerError">
          <Icon type="close-circle" />
          <FormattedMessage id="menu.account.trigger" defaultMessage="Trigger Error" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        <div className={`${styles.action} themeAction`}>
          <Badge count={5} style={{backgroundColor: '#ff9933'}}>
            <img src={require('../../assets/world.svg')} alt="world" />
          </Badge>
        </div>
        <div className={`${styles.action} themeAction`}>
          <Badge count={5} style={{backgroundColor: '#4e3db9'}}>
            <img src={require('../../assets/clock.svg')} alt="world" />
          </Badge>
        </div>
        <div className={`${styles.action} themeAction`}>
          <Badge count={5} style={{backgroundColor: '#66c258'}}>
            <img src={require('../../assets/bell.svg')} alt="world" />
          </Badge>
        </div>
        <div className={`${styles.action} themeAction`}>
          <Badge count={5} style={{backgroundColor: '#3399ff'}}>
            <img src={require('../../assets/mail.svg')} alt="world" />
          </Badge>
        </div>
        <div className={`${styles.action} themeAction`}>
          <img src={require('../../assets/calendar.svg')} alt="world" />
        </div>
        <div className={`${styles.action} themeAction`}>
          <Dropdown
            overlay={
              <Menu>
                {Object.keys(themes).map(itemKey => {
                  return (
                    <Menu.Item
                      key={itemKey}
                      onClick={() => {
                        localStorage.setItem('themeKey', itemKey);
                        updateTheme();
                      }}
                    >
                      {themes[itemKey].name || itemKey}
                    </Menu.Item>
                  );
                })}
              </Menu>
            }
          >
            <img src={require('../../assets/clothing.svg')} alt="world" />
          </Dropdown>
        </div>
        <div className={`${styles.action} themeAction`}>
          <img src={require('../../assets/setting.svg')} alt="world" />
        </div>
        {currentUser.workerName ? (
          <HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account} themeAction`}>
              <Avatar className={styles.avatar} src={currentUser.avatar} alt="avatar" />
              <span className={styles.name}>{currentUser.workerName}</span>
              <Icon type="caret-down" style={{fontSize: 22}} />
            </span>
          </HeaderDropdown>
        ) : (<Spin size="small" style={{marginLeft: 8, marginRight: 8}} />
          )}
        {/* <SelectLang className={styles.action} /> */}
      </div>
    );
  }
}

export default GlobalHeaderRight;
