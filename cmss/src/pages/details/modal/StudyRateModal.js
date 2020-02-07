/* eslint-disable global-require */
import React from 'react';
import BaseModal from '@/pages/details/modal/BaseModal';
import { List, Avatar } from 'antd';
import styles from '@/pages/details/modal/index.less';

const rateLogo = [
  require('../../../assets/rate1.png'),
  require('../../../assets/rate2.png'),
  require('../../../assets/rate3.png'),
  require('../../../assets/rate4.png'),
  require('../../../assets/rate5.png'),
  require('../../../assets/rate6.png'),
  require('../../../assets/rate7.png'),
  require('../../../assets/rate8.png'),
  require('../../../assets/rate9.png'),
  require('../../../assets/rate10.png'),
];

const rateTitle = ['学神', '学魔', '学帝', '学圣', '学尊', '学宗', '学皇', '学王', '学灵', '学民'];
const titleStyle = [
  { bg: '#FEE605', text: '#E39507' },
  { bg: '#D3D6EB', text: '#7F81A7' },
  { bg: '#EDCCC9', text: '#A65B60' },
];

export default class StudyRateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { dataSource } = this.props;
    return (
      <BaseModal {...this.props} title="学霸排行">
        <List
          itemLayout="horizontal"
          dataSource={dataSource}
          renderItem={(item, index) => (
            <List.Item className={styles.item}>
              <img alt="" src={rateLogo[index]} height="36px" width="36px" />
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
              <span className={styles.itemTitle}>{item.name}</span>
              <div
                className={styles.rateTitle}
                style={{ background: index > 2 ? null : titleStyle[index].bg }}
              >
                <span
                  className={styles.rateTitleText}
                  style={{ color: index > 2 ? null : titleStyle[index].text }}
                >
                  {rateTitle[index]}
                </span>
              </div>
            </List.Item>
          )}
        />
      </BaseModal>
    );
  }
}
