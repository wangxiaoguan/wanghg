import React, { Component } from 'react';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import Content from '../MagazineManagement/Content';
import Magazine from './Magazine';

export default class MagazineSwitchTwo extends Component{
  constructor(props) {
    super(props);
    const panes = [
      { title: '杂志列表', content: <Magazine/>, key: '1', closable: false },
      { title: '所属系列-期刊名称-期数-杂志目录', content: <Content/>, key: '2' },
    ];

    this.state = {
      activeKey: panes[1].key,
      panes,
    };
  }

  onChange = (activeKey) => {
    this.setState({ activeKey });
    if(activeKey==='1'){
      this.remove('2');
      this.setState({ activeKey });
    }
  }
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  remove = (targetKey) => {
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    this.setState({ panes, activeKey });
  }

  render(){
    return <div>
      <Tabs
        hideAdd
        onChange={this.onChange}
        activeKey={this.state.activeKey}
        type="editable-card"
        onEdit={this.onEdit}
      >
        {this.state.panes.map(pane =>
          <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
            {pane.content}
          </TabPane>)}
      </Tabs>
    </div>;
  }
}