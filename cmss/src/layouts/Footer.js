/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import styles from './footer.less';

class FooterView extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className={styles.footer}>
        <span>
          <span>
            {['COPYRIGHT ', <span key="1">&copy;</span>, ' WUHANRT.COM']} 版权所有:
            中国联合网络通信有限公司北京分公司 地址:骡马市大街9号中国联通北京分公司总部大厦
          </span>
        </span>
      </div>
    );
  }
}
export default FooterView;
