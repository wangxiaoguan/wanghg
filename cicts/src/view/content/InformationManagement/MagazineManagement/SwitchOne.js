import React, { Component } from 'react';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import {pageJummps} from '../PageJumps';
import API_PREFIX from '../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
import Magazine from './Magazine';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
export default class MagazineSwitchOne extends Component{
  constructor(props) {
    super(props);
    const panes = [
      { title: '杂志列表', content: <Magazine add={this.add} />, key: '1', closable: false },
    ];

    this.state = {
      activeKey: panes[0].key,
      panes,
    };
  }

  componentDidMount(){
  }

  onChange = (activeKey) => {
    if(activeKey==='1'){
      this.remove2(['2','3']);
      this.setState({ activeKey },()=>{
        this.changeUrl();
      });

    }
    if(activeKey==='2'){
      this.remove('3');
      this.changeUrl();
    }
  }
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  add = (name,value) => {
    const panes = this.state.panes;
    const activeKey = value[value.length-1].key;
    value.map(item=>{
      panes.push(item);
    });
    window.sessionStorage.setItem('indexMagazine',name);
    this.setState({ panes, activeKey });
  }


  remove2 = (targetKey) => {
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

    let activeKey = this.state.activeKey;
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    this.setState({ panes, activeKey },()=>{
      this.changeUrl();
    });
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
    this.setState({ panes, activeKey },()=>{
      this.changeUrl();
    });
  }

  changeUrl = () =>{
    if(this.state.activeKey==1){
      this.props.getData(API_PREFIX+`${pageJummps.MagazineList}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}`);
    } else if (this.state.activeKey==2){
      this.props.getData(API_PREFIX+`${pageJummps.CatalogueList}/${window.sessionStorage.getItem('magazineId')}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}`);
    } else if (this.state.activeKey==3){
      let url ;
      let magazineId = window.sessionStorage.getItem('magazineId');
      let contentId = window.sessionStorage.getItem('contentId');
      if (window.sessionStorage.getItem('indexMagazine') == 'one' && magazineId != null && typeof magazineId != 'undefined') {
        url = 'services/web/news/magazine/article/getMagazineArticles/' + magazineId;
      }else if(window.sessionStorage.getItem('indexMagazine') == 'two' && contentId != null && typeof contentId != 'undefined') {
        url = `${pageJummps.MagaArtList}/${contentId}`
      }
      this.props.getData(API_PREFIX+`${url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}`);
    }


  }


  render(){

    return <div>
      <Tabs
        hideAdd
        className="tabCommon"
        onChange={this.onChange}
        activeKey={this.state.activeKey}
        type="editable-card"
        onEdit={this.onEdit}
      >
        {this.state.panes.map(pane =>
          <TabPane forceRender={true} tab={pane.title} key={pane.key} closable={pane.closable}>
            {pane.content}
          </TabPane>)}
      </Tabs>
    </div>;
  }
}