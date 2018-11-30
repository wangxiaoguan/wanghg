import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { Tag, Message, Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import Content from '../MagazineManagement/Content';
import MagazineArticle from '../MagazineManagement/Article';
import API_PREFIX from '../../apiprefix';
import { GetQueryString, postService, getService } from '../../myFetch';
import Magazine from './Magazine';

export default class MagazineSwitchThree extends Component{
  constructor(props) {
    super(props);
    const panes = [
      { title: '杂志列表', content: <Magazine/>, key: '1', closable: false },
      { title: '所属系列-期刊名称-期数-杂志目录', content: <Content/>, key: '2' },
      { title: '所属系列-期刊名称-期数-杂志文章', content: <MagazineArticle/>, key: '3' },
    ];

    this.state = {
      activeKey: panes[2].key,
      panes,
    };
  }

  componentDidMount(){
  }

  onChange = (activeKey) => {
    this.setState({ activeKey });
    if(activeKey==='1'){
      this.remove2(['2','3']);
      this.setState({ activeKey });
    }
    if(activeKey==='2'){
      this.remove('3');
      //this.setState({ activeKey });
    }
  }
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  remove2 = (targetKey) => {
    console.log('targetKey',targetKey);
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - targetKey.length ;
      }
    });
    let panes = this.state.panes;
    targetKey.map((item)=>{
      panes = panes.filter(pane => pane.key !== item);
    });

    console.log('panes',panes);
    let activeKey = this.state.activeKey;
    console.log('activeKey',activeKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    this.setState({ panes, activeKey });
  }

  remove = (targetKey) => {
    console.log('targetKey',targetKey);
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    console.log('panes',panes);
    let activeKey = this.state.activeKey;
    console.log('activeKey',activeKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    this.setState({ panes, activeKey },()=>{
      console.log('++++',this.state.panes, this.state.activeKey);
    });
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