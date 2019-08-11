import React, { Component } from 'react';
import { Layout, Affix, Breadcrumb } from 'antd';
import { sidebarMenu } from './models';
import { getBreadcrumb } from '../view/component/tools';
import SideMenu from '../view/component/sidemenu/sidemenu';
import Head from '../view/component/head/head.js';
import { Link } from 'react-router-dom';
import './base.less';
// import { Main } from 'yrui';
const fold = require('../styles/images/sidebarMenu/icon_fold.png');
const un_fold = require('../styles/images/sidebarMenu/icon_unfold.png');
const icon_sideMenu = require('../styles/images/sidebarMenu/img_logo.png');
const icon_more = require('../styles/images/sidebarMenu/icon_more.png');
const icon_home = require('../styles/images/sidebarMenu/icon_home.png');
const icon_title = require('../styles/images/sidebarMenu/icon_title.png');
const { Header, Content } = Layout;

const getsidebarMenu = (obj, powers) => {
  if (powers) {
    const arr = [];
    obj.forEach(v => {
      if (v.subMenu) {
        const arr2 = getsidebarMenu(v.subMenu, powers);
        if (arr2.length > 0) {
          // arr.push(arr2);
          arr.push({
            url: v.url,
            title: v.title,
            key: v.key,
            defaultImgUrl: v.defaultImgUrl,
            selectedImgUrl: v.selectedImgUrl,
            subMenu: arr2,
          });
        }
      } else {
        
          arr.push(v);
       
      }
    });
    return arr;
  } else {
    return obj;
  }
};


export default class Base extends Component {

  constructor(props) {
    super(props);
    this.state = ({
      menu: sidebarMenu,
      breadcrumb: [],
      flag: true,
      url: fold,
      currentTitle: '',
    });
    window.addEventListener('hashchange', this.hashChg, false);
  }

  hashChg = () => {
    document.documentElement.scrollTop ? (document.documentElement.scrollTop = 0) : (document.body.scrollTop = 0);
    let str = location.hash.match(/#(\S+)\?/) || location.hash.match(/#(\S+)/);
    let breadcrumb = getBreadcrumb(sidebarMenu, str);
    this.setState({
      breadcrumb: breadcrumb,
      currentTitle: breadcrumb.length != 0 ? breadcrumb[breadcrumb.length - 1].title : '',
    });
  }

  componentWillMount = () => {
    this.hashChg();
  }

  componentWillUnmount = () => {
    window.removeEventListener('hashchange', this.hashChg, false);
  };
  componentDidMount() {

  }
  render() {
    const { children, powers } = this.props;
    const { breadcrumb } = this.state;
    /**可判断是否只可点击二级面包屑 */
    const breadcrumbItems =
      breadcrumb.map(item => {
        return item.unClickable ? (
          <Breadcrumb.Item key={item.title}>
            <a>{item.title}</a>
          </Breadcrumb.Item>
        ) : (<Breadcrumb.Item key={item.title}>
          <a href={`${item.url}`}>{item.title}</a>
        </Breadcrumb.Item>);
      });

    return (
      <Layout className="base-layout">
        <div className="base-sidemenu">
          <div className="base-icon">
            <img src={icon_sideMenu} className="sidemenu-icon" />
            <img src={icon_more} className="sidemenu-more" />
          </div>
          <SideMenu menu1={getsidebarMenu(sidebarMenu, powers)} {...this.state} />
        </div>
        <div className="background">
          <Header className="headers"
          >
            <Head />
          </Header>
          <div className="main-background">
            <img src={icon_home} className="icon-breadcrumb" />
            <Breadcrumb className="breadcrumb" separator={<div style={{ color: '#79d3ff', display: 'inline-block' }}>></div>}>
              <Breadcrumb.Item key="home">
                <Link to="/">首页</Link>
              </Breadcrumb.Item>
              {breadcrumbItems}
            </Breadcrumb>
          </div>
        </div>
        <Content id="main-container">
          <div className="container-title"><img src={icon_title} /><span>{this.state.currentTitle}</span></div>
          <div className="container-children">
            {children}
          </div>
        </Content>

      </Layout>
    );
  }
}

