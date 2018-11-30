import React, { Component } from 'react';
import {  Menu } from 'antd';
import CustomScrollbars from '../scrollbars/scrollbars.js';
import './sidemenu.less';
const SubMenu = Menu.SubMenu;

class SideMenu extends Component {
  constructor(props) {
    super(props);
    const str = location.hash.match(/#(\S+)\?/) || location.hash.match(/#(\S+)/);
    const open = str[1].split('/');
    let openKeys = [];
    if (open[1] === '404') {
    } else if (open.length === 4) {
      openKeys = ['#/' + open[1], '#/' + open[1] + '/' + open[2]];
    } else if (open.length === 3) {
      openKeys = ['#/' + open[1]];
    }
    this.state = {
      selectedKeys: ['#' + str[1]],
      openKeys,
      rootSubmenuKeys: [],
      marginLeft: '5%',
      //  openKeys: ['#/monthly/supervision', '#/monthly'],
    };
    window.addEventListener('hashchange', this.hashChg, false);
  }

  //hashchange
  hashChg = () => {
    document.documentElement.scrollTop ? (document.documentElement.scrollTop = 0) : (document.body.scrollTop = 0);
    const str = location.hash.match(/#(\S+)\?/) || location.hash.match(/#(\S+)/);
    const open = str[1].split('/');
    let openKeys = [];
    if (open[1] === '404') {
    } else if (open.length === 4) {
      openKeys = ['#/' + open[1], '#/' + open[1] + '/' + open[2]];
    } else if (open.length === 3) {
      openKeys = ['#/' + open[1]];
    }else if (open.length === 5) {
      openKeys = ['#/' + open[1], '#/' + open[1] + '/' + open[2] + '/' + open[3] + '/' + open[4]];
    }
    this.setState({
      selectedKeys: ['#' + str[1]],
      openKeys,
    });
  }
  onOpenChange = (openKeys) => {
    
    this.props.menu.map((s, v) => {
      this.state.rootSubmenuKeys.push(s.key);
    });
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }
  componentWillUnmount = () => {
    window.removeEventListener('hashchange', this.hashChg, false);

  };
  hashRedirect = (url) => {
    window.open(url);
  }
  onTitleClick = (key) => {
    if(key.key == "#/EventManagement/Order"){
      this.setState({
        selected:true
      })
    }
  }
  onSelect = (item) => {

  }
  render() {
    const { menu1 } = this.props;
    const { openKeys } = this.state;
    return (
      <div className="sider-inner">
        <CustomScrollbars className="side-scrollbar" autoHide={true} drawVertical={true} >
          <Menu
            className="main-menu"
            mode="inline"
            onOpenChange={this.onOpenChange}
            openKeys={openKeys}
            style={{
              minHeight: '100%',
            }}
          >
            {
              menu1.map((v, i) => {
                if (v.subMenu) {
                  
                 let selected = (v.title == "订购活动");
                  //console.log("selectedKeys",selected,v.title,openKeys)
                  return <SubMenu key={v.key} title={<div className="main-submenu-first"><img src={selected ? v.selectedImgUrl : v.defaultImgUrl} className="submenu-img" /> <span className="first-title">{v.title}</span></div>} className={i !== menu1.length - 1 ? 'submenu-divider submenu' :'submenu'}>
                    {
                      v.subMenu.map((w, j) => {
                        if (w.subMenu) { 
                          console.log("openKeys",openKeys)
                          let selected = (w.key == openKeys[openKeys.length - 1]);
                          return( 
                            <SubMenu onTitleClick={this.onTitleClick} key={w.key} title={<div className="special-main-submenu-second"><img src={selected ? w.selectedImgUrl:w.defaultImgUrl  } className="submenu-img" /><span >
                              {w.title}</span></div>} >
                              {
                                w.subMenu.map((c,k)=>{
                                  if((c.url).slice(-8) == 'Redirect'){
                                    return <Menu.Item key={c.key} ><a onClick={this.hashRedirect.bind(this,c.key)} href={c.url} className="main-submenu-third" >{c.title}</a></Menu.Item>;
                                  }else{
                                    return <Menu.Item key={c.key} ><a href={c.url} className="main-submenu-third" >{c.title}</a></Menu.Item>;
                                  }
                                  
                                  
                                })
                              }
                            </SubMenu>);
                        }else{
                          if((w.url).slice(-8) == 'Redirect'){
                            return <Menu.Item key={w.key} className="main-submenu-second"><a onClick={this.hashRedirect.bind(this,w.key)} href={w.url}><span>{w.title}</span></a></Menu.Item>;
                          }else{
                            return <Menu.Item key={w.key} className="main-submenu-second"><a href={w.url}><span>{w.title}</span></a></Menu.Item>;
                          }
                        }
                       

                      })
                    }
                  </SubMenu>;
                } else {
                  return (
                    <Menu.Item key={v.key}>
                      <a href={v.url} className="home-a-menu" >
                        <img src={v.defaultImgUrl}  />
                        <span className="home-menu">{v.title}</span>
                      </a>
                    </Menu.Item>
                  );
                }
              })
            }
          </Menu>
        </CustomScrollbars>
      </div>
    );
  }
}

export default SideMenu;
