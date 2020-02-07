import React, { Component } from 'react';
import { Tabs, Spin, Select } from 'antd';
import styles from './index.less';
import { isLaeder } from '@/utils/partyRoleUtil';

const { TabPane } = Tabs;
// const { Paragraph } = Typography;
const { Option } = Select;

class MyTab extends Component {
  getPostValue = () => {
    const { postList, upPartyIdIndex, upPartyId } = this.props;
    const arr = [];
    postList.map(item => {
      arr.push(`${item.value}#${item.index}`);
    });
    if (arr.includes(`${upPartyId}#${upPartyIdIndex}`)) {
      return `${upPartyId}#${upPartyIdIndex}`;
    } else if (arr.length) {
      return arr[0];
    } else {
      return '';
    }
  };

  isShowSend(){
    const {
      postList=[]
    } = this.props;
    let isShow = false
    postList.forEach(p=>{
      if(p.level < 3){
        isShow = true
      }
    })
    return isShow
  }

  onChange=(value)=>{
    const {
      tabChange,
      changeOption,
      isSend,
    } = this.props;
    if(isSend && this.isShowSend()){
      tabChange('2')
    }
    changeOption(value)
  }

  render() {
    const {
      postList,
      tabChange,
      changeOption,
      upPartyId,
      upPartyIdIndex,
      getTabPanl,
      isSend,
      loadingGetUserLevel,
    } = this.props;
    return (
      <Tabs
        tabBarExtraContent={
          <Spin spinning={loadingGetUserLevel}>
            <span>职务: </span>
            <Select
              value={postList.length ? this.getPostValue() : ''}
              dropdownMatchSelectWidth={false}
              style={{ maxWidth: 320, minWidth: 200 }}
              onChange={this.onChange}
              activeKey={isSend ? '1' : '2'}
            >
              {postList.length ? (
                postList.map(item => (
                  <Option key={`${item.value}#${item.index}`} value={`${item.value}#${item.index}`}>
                    {item.label}
                  </Option>
                ))
              ) : (
                  <Option key="" value="">
                    {''}
                  </Option>
                )}
            </Select>
          </Spin>
        }
        className={styles.tabStyle}
        onChange={tabChange}
        animated={false}
        activeKey={isSend ? '1' : '2'}
      >
        <TabPane tab="收到的" key="2">
          {!isSend ? getTabPanl() : null}
        </TabPane>
        {
          this.isShowSend() && <TabPane tab="发出的" key="1">
            {isSend ? getTabPanl() : null}
          </TabPane>
        }

      </Tabs>
    );
  }
}
export default MyTab;
