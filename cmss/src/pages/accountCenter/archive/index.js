import React from 'react';
import { connect } from 'dva';
import { Spin, Avatar, Divider } from 'antd';
import styles from './index.less';
import { loadData } from './help';
import { storage } from '@/utils/utils';

const Line = props => {
  const { label, value } = props;
  return (
    <div className={styles.line}>
      <div style={{ fontWeight: 600 }}>{`${label}:`}</div>
      {label === '党内职务' && value.length !== 0 && (
        <div className={styles.postContet}>
          {value.map(item => (
            <div key={`${item.postname}${item.fullname}`}>
              <i className={styles.honorIcon} />
              <span style={{ fontWeight: 600 }}>{item.postname}</span>
              <div>{item.fullname}</div>
              <Divider dashed />
            </div>
          ))}
        </div>
      )}

      {label === '党内职务' && value.length === 0 && '--'}
      {label !== '党内职务' && (
        <div className={styles.postContet}>{value === 'null' ? '' : value}</div>
      )}
    </div>
  );
};

@connect(({ accountCenter }) => ({
  accountCenter,
}))
class Archives extends React.Component {
  state = {
    userData: {},
    loading: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    this.setState({ loading: true });
    console.log(userInfo);
    const formData = {
      userId: userInfo.id,
      msgId: 'MY_PROFILE',
    };
    dispatch({
      type: 'accountCenter/loadData',
      payload: {
        text: JSON.stringify(formData),
      },
      callBack: () => {
        const formPartyData = {
          isQryAll: false,
          isQryChild: false,
          msgId: 'QRY_MEM_PARTY_INFO',
          type: 0,
          userId: userInfo ? userInfo.id : '',
        };
        dispatch({
          type: 'accountCenter/getUserInfo',
          payload: {
            text: JSON.stringify(formPartyData),
          },
          callBack: res => {
            this.setState({ loading: false });
            const userData = res;
            this.setState({
              userData,
            });
          },
        });
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'myArchive/updateState',
      payload: {
        userInfo: {},
        error: '',
      },
    });
  }

  render() {
    const { accountCenter } = this.props;
    const username = accountCenter.userInfo.lastname || '';
    const { userData, loading } = this.state;
    return (
      <Spin spinning={loading}>
        <div className={styles.main}>
          <div>
            <Avatar
              size="large"
              style={{
                backgroundColor: '#3699ff',
                display: 'inline-block',
                lineHeight: 3,
                color: '#fff',
                fontSize: 24,
              }}
            >
              {username.length >= 2 ? username.slice(-2) : username}
            </Avatar>
            <div className={styles.name}>{username}</div>
          </div>
          <div className={styles.divider}></div>
          {/* 确保有数据 */}
          <div className={styles.content}>
            {loadData(accountCenter.userInfo, userData).map(item => (
              <div key={item.label ? item.label : '0'}>
                {item.label && <Line label={item.label} value={item.value} />}
              </div>
            ))}
          </div>
        </div>
      </Spin>
    );
  }
}

export default Archives;
