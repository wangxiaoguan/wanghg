import React from 'react';
import { Modal } from 'antd';

import styles from './index.less';

export default class BaseModal extends React.PureComponent {
  render() {
    const { children, visible, title, onCancel, dataSource } = this.props;
    return (
      <Modal
        footer={null}
        visible={visible}
        title={<div style={{ fontWeight: 600 }}>{title}</div>}
        destroyOnClose
        className={styles.container}
        width={title === '问卷统计' && dataSource.length > 1 ? '660px' : '600px'}
        centered
        onCancel={onCancel}
      >
        {children}
      </Modal>
    );
  }
}
