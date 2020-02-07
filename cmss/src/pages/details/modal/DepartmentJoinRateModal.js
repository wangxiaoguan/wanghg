import React from 'react';
import BaseModal from '@/pages/details/modal/BaseModal';
import { List, Pagination } from 'antd';
import styles from '@/pages/details/modal/index.less';
import * as PropTypes from 'prop-types';

export default class DepartmentJoinRateModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    onCancel: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 1,
    };
  }

  getProgress = value => {
    if (value >= 15) {
      return (
        <div className={styles.progress}>
          <div className={styles.inner} style={{ width: value > 100 ? '100%' : `${value}%` }}>
            <small style={{ color: '#fff' }}>{`${value}%`}</small>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.progress}>
        <div className={styles.inner} style={{ width: `${value}%` }} />
        <small style={{ color: '#908383' }}>{`${value}%`}</small>
      </div>
    );
  };

  onChange = page => {
    this.setState({
      current: page,
    });
  };

  render() {
    const { dataSource } = this.props;
    const { current } = this.state;
    return (
      <BaseModal {...this.props} title="组织参与率">
        <List
          itemLayout="horizontal"
          dataSource={dataSource.slice((current - 1) * 10, current * 10)}
          renderItem={item => (
            <List.Item className={styles.item}>
              <span className={styles.itemTitle}>{item.title}</span>
              {/*  <Progress
                type="line"
                strokeColor={{
                  from: '#FF905A',
                  to: '#D60D0D',
                }}
                strokeLinecap="square"
                strokeWidth="20px"
                percent={item.percent}
                style={{ width: '250px' }}
              /> */}
              {this.getProgress(item.percent)}
              <span className={styles.rate}>{`${item.joinNum}/${item.totalNum}`}</span>
            </List.Item>
          )}
        />
        {dataSource.length > 10 && (
          <Pagination
            current={current}
            pageSize={10}
            onChange={this.onChange}
            total={dataSource.length}
            className={styles.pagination}
          />
        )}
      </BaseModal>
    );
  }
}
