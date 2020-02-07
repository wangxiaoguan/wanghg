import React from 'react';
import { List, Avatar } from 'antd';

import BaseModal from './BaseModal';
import styles from './index.less';

/* const data = [
  { avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', name: 'AAAAA' },
  { avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', name: 'BBB' },
  { avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', name: 'CCCCC' },
]; */

export default class ActivityMemberModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dataSource } = this.props;
    return (
      <BaseModal {...this.props} title="活动参与人员">
        <List
          itemLayout="horizontal"
          dataSource={dataSource}
          renderItem={item => (
            <List.Item className={styles.item}>
              <Avatar
                size="36px"
                style={{
                  backgroundColor: '#3699ff',
                  color: '#fff',
                  verticalAlign: 'middle',
                }}
              >
                {item.name.length >= 2 ? item.name.slice(-2) : item.name}
              </Avatar>
              <span className={styles.itemTitle} style={{ marginLeft: '10px' }}>
                {item.name}
              </span>
            </List.Item>
          )}
        />
      </BaseModal>
    );
  }
}
