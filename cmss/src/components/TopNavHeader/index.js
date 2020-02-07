import React, { PureComponent } from 'react';
// import Link from 'umi/link';
// import RightContent from '../GlobalHeader/RightContent';
import { Typography, Popover, Badge } from 'antd';
import router from 'umi/router';
import BaseMenu from '../SiderMenu/BaseMenu';
import { getFlatMenuKeys } from '../SiderMenu/SiderMenuUtils';
import { storage } from '@/utils/utils';
import { connect } from 'dva';
import styles from './index.less';

const { Paragraph } = Typography;

@connect(({ home }) => ({ home }))
class TopNavHeader extends PureComponent {
  state = {
    maxWidth: undefined,
  };

  static getDerivedStateFromProps(props) {
    return {
      maxWidth: (props.contentWidth === 'Fixed' ? 1200 : window.innerWidth) - 280 - 165 - 40,
    };
  }

  render() {
    const { theme, contentWidth, menuData, onMenuClick, home } = this.props;
    const { informationList } = home;
    // 通知未完成任务的数量
    let taskCount = 0;
    for (let i in informationList) {
      if (typeof informationList[i] !== 'object') {
        taskCount = taskCount + informationList[i];
      } else {
        for (let key in informationList[i]) {
          taskCount = taskCount + informationList[i][key];
        }
      }
    }
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const userName = userInfo.name || '';
    const flatMenuKeys = getFlatMenuKeys(menuData);
    return (
      <div className={`${styles.head} ${theme === 'light' ? styles.light : ''}`}>
        <div
          ref={ref => {
            this.maim = ref;
          }}
          className={`${styles.main} ${contentWidth === 'Fixed' ? styles.wide : ''}`}
        >
          <div className={styles.logo} key="logo" id="logo" />
          <section className={styles.left}>
            <div className={styles.navBg}>
              <div className={styles.navHarder}>
                <div className={styles.navCenter}>
                  <BaseMenu
                    {...this.props}
                    flatMenuKeys={flatMenuKeys}
                    className={styles.menu}
                    style={{ border: 'none' }}
                  />
                  <div className={styles.navLeft}>
                    {
                      /**
                       * <div className={styles.partyNet}>党建网站</div>
                       */
                    }

                    <div className={styles.linkContent}>
                      {userName.length <= 4 ? (
                        <Paragraph
                          ellipsis={{
                            rows: 1,
                            expandable: false,
                          }}
                          className={styles.newContain}
                        >
                          {userName}
                        </Paragraph>
                      ) : (
                        <Popover content={userName}>
                          <Paragraph
                            ellipsis={{
                              rows: 1,
                              expandable: false,
                            }}
                            className={styles.newContain}
                          >
                            {userName}
                          </Paragraph>
                        </Popover>
                      )}
                    </div>
                    <i
                      className={styles.connect}
                      onClick={() => onMenuClick({ key: 'addressBook' })}
                    ></i>
                    <Badge count={taskCount}>
                      <i
                        className={styles.notice}
                        onClick={() => {
                          router.replace('/accountCenter/remind');
                        }}
                      ></i>
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default TopNavHeader;
