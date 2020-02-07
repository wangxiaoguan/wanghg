import React, { Component } from 'react';
import './head.less';
import * as action2 from 'redux-root/action';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import icon_user from '../../../styles/images/sidebarMenu/icon_yonghu.png';



function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...action2 }, dispatch);
}


@connect(
  state => ({
    powers: state.powers,
  }),
  mapDispatchToProps
)

class Head extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acount: null,
    };

  }
  //componentWillMount() {

  // if (!window.sessionStorage.lastname) {
  //   location.hash = '#/login';
  // }
  // $q.get($q.url + '/security/authInfo', data => {
  //   if (window.sessionStorage.lastname === 'root' && data.permissions.length === 0) {
  //     this.props.getPowers(false);
  //   } else {
  //     let obj = {};
  //     data.permissions.map(v => {
  //       obj[v] = true;
  //     });
  //     this.props.getPowers(obj);
  //   }
  // });
  //}
  tick = () => {
    this.setState({
      acount: window.sessionStorage.getItem('acount'),
    })
  }
  componentDidMount() {
    this.interval = setTimeout(() => this.tick(), 100);
  }

  logout = () => {
    location.hash = '#/login';
    window.localStorage.removeItem('company');
  }

  componentWillUnmount() {
    window.localStorage.removeItem('company');
  }

  render() {
    return (
      <div className="root-head">
        <div className="head-title">武船党建管理平台 / 
          <span style={{fontSize:'10px',lineHeight:'15px',display:'inline-block',marginLeft:'7px'}}>
            <div> WUCHUAN GROUP MANAGEMENT</div>
            <div> PLATFORM</div>
          </span>
        </div>
        <div style={{ flexGrow: 1 }} />
        <img src={icon_user} />
        <div className="head-user">{this.state.acount}</div>
        <div style={{ cursor: "pointer" }} className="head-exit" onClick={this.logout.bind(this)}>退出</div>
      </div>
    );
  }
}
export default Head;
