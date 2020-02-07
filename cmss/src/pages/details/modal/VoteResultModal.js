/* eslint-disable global-require */
import React from 'react';
import BaseModal from '@/pages/details/modal/BaseModal';
import { List, Typography } from 'antd';
import ImageModal from '../../../components/ImgModal';
import styles from '@/pages/details/modal/index.less';
/**
 * 问卷统计弹窗
 *
 *
 */
const { Paragraph } = Typography;

class VoteResultModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { dataSource } = this.props;
    return (
      <BaseModal {...this.props} title="投票结果">
        {dataSource.titleList.length ? (
          <div className={styles.banner}>
            <Paragraph ellipsis={{ rows: 6, expandable: true }} className={styles.questionTitle}>
              {dataSource.titleList[0].title}
              {dataSource.titleList[0].type === 1 ? '(单选)：' : '(多选)：'}
            </Paragraph>
          </div>
        ) : null}
        <List
          itemLayout="horizontal"
          dataSource={dataSource.list.length ? dataSource.list : []}
          renderItem={item => (
            <List.Item className={styles.item}>
              <span className={styles.itemTitle}>
                {item.url && item.url !== 'null' && item.url !== '' && (
                  <ImageModal url={item.url} {...this.props} />
                )}
                <span className={styles.content}>{item.content}</span>
              </span>
              <span className={styles.score}>{`${item.percent}%`}</span>
            </List.Item>
          )}
        />
      </BaseModal>
    );
  }
}

export default VoteResultModal;
