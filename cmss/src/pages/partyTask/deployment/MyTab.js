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
    // 重要工作部署：党委、党总支有发出的页面；党支部、党小组没有发出的页面
    // 三会一课、主题教育、其他任务：只要有职务就有发出的页面
    const {
      postList =[],
      upPartyIdIndex,
      location
    } = this.props;
    let isShow;
    const arrKeys = location.pathname.split('/');
    if(arrKeys[4] === '99'){
      // 重要工作部署
      const index = upPartyIdIndex - 1
      isShow = postList[index] && postList[index].level === 1;
    } else {
      // isShow = postList.length > 0
      postList.forEach(p=>{
        if(p.level < 3){
          isShow = true
        }
      })
    }
    return isShow;
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
