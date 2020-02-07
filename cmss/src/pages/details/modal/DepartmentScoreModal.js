import React from 'react';
import BaseModal from '@/pages/details/modal/BaseModal';
import { List, Pagination } from 'antd';
import styles from '@/pages/details/modal/index.less';

/* const data = [
  { title: 'AAAAA', number: 12, score: 9.4 },
  { title: 'BBBBB', number: 14, score: 9.76 },
  { title: 'CCCCC', number: 18, score: 9.1 },
  { title: 'EEEEE', number: 11, score: 9.6 },
  { title: 'GGGGG', number: 2, score: 9.1 },
]; */

export default class DepartmentScoreModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
    };
  }

  componentDidMount() { }

  onChange = page => {
    this.setState({
      current: page,
    });
  };

  render() {
    const { dataSource } = this.props;
    const { current } = this.state;
    return (
      <BaseModal {...this.props} title="组织平均分">
        <List
          itemLayout="horizontal"
          dataSource={dataSource.slice((current - 1) * 10, current * 10)}
          renderItem={item => (
            <List.Item className={styles.item}>
              <span className={styles.itemTitle}>
                {item.title}
                <span className={styles.joinNumber}>{` - [${item.number}人参与]`}</span>
              </span>
              <span className={styles.score}>{`${item.score}分`}</span>
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
