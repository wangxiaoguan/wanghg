import React from 'react';
import Link from 'umi/link';
import Footer from './Footer';
import styles from './UserLayout.less';

const logo = require('../assets/danghui-big.png');

class UserLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
              </Link>
            </div>
            <div className={styles.desc}>北京联通党建信息平台</div>
          </div>
          {children}
        </div>
        <Footer />
      </div>
    );
  }
}

export default UserLayout;
