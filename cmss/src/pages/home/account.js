// import React from 'react';
import {Tooltip} from 'antd'
import styles from './index.less';

const Account = ({ userInfo }) => {
  return (
    <div className={styles.account}>
      <div className={styles.username}>
        <Tooltip title={userInfo.name}><span>{userInfo.name}</span></Tooltip>
        <span className={styles.partyStatus}>{userInfo.partyStatus}</span>
      </div>
      <div className={styles.department}>
        <i className={styles.iconparty}></i>
        <Tooltip title={userInfo.department}><span>{userInfo.department}</span></Tooltip>
      </div>
      <div className={styles.partyJob}>{userInfo.partyJob}</div>
      <div className={styles.joinPartyTime}>入党时间：{userInfo.joinPartyTime}</div>
      <div className={styles.regularPartyTime}>转正时间：{userInfo.regularPartyTime}</div>
      <div className={styles.look} onClick={()=>window.location.hash='/accountCenter/archive'}>查看</div>
    </div>
  );
};

export default Account;
