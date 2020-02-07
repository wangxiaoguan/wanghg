import React, { Component } from 'react';
import './head.less';
import * as action2 from 'redux-root/action/powers.js';
import {setAuthInfo} from 'redux-root/action/login.js';
import { Select ,message} from 'antd';

const Option = Select.Option;

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import icon_user from '../../../styles/images/sidebarMenu/icon_yonghu.png';
import { getService } from '../../content/myFetch';
import API_PREFIX from '../../content/apiprefix';
import { changePartyId } from '../../../redux-root/action/head/head';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...action2 }, dispatch);
}

@connect(
  state => ({
    powers: state.powers,
  }),
  dispatch => ({
    changePartyId: n => dispatch(changePartyId(n)),
    setAuthInfo: n => dispatch(setAuthInfo(n)),
  }),
  // mapDispatchToProps
)

class Head extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acount: null,
      data: [],
      shortCompanyName: ''
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
  componentWillMount() {
    // this.props.changePartyId(this.state.data[0].id)
    // getService(`${API_PREFIX}services/system/partyMember/list/queryPartyList`, data => {
    //   if(data.retCode === 1) {
    //     this.setState({
    //       data: data.root.list,
    //     });
    //     if(data.root.list.length > 0) {
    //       this.props.changePartyId(this.state.data[0].id);
    //       sessionStorage.setItem('partyid',data.root.list[0].id);
    //     }else {
    //       this.props.changePartyId(-1);
    //       sessionStorage.setItem('partyid',-1);
    //     }
    //   }else {
    //     this.props.changePartyId(-1);
    //     sessionStorage.setItem('partyid',-1);
    //   }
    // });
    let authInfo = JSON.parse(window.localStorage.getItem("LoginauthInfo"))
    let shortCompanyName = '智慧'
    if (authInfo && authInfo.company && authInfo.company.shortCompanyName) {
      shortCompanyName = authInfo.company.shortCompanyName
    }
    this.setState({shortCompanyName})
    if(authInfo && authInfo.partyMemPosts && authInfo.partyMemPosts.length) {
      let partyMemPosts = []
      authInfo.partyMemPosts.forEach(item => {
        if(item.fullName && item.fullName.indexOf('小组') == -1) {
          partyMemPosts.push({
            id: item.partyId,
            fullName: `${item.fullName}>${item.postName}`
          })
        }
      })
      let partyId = partyMemPosts[0] ? partyMemPosts[0].id : -1
      this.props.changePartyId(partyId);
      sessionStorage.setItem('partyid',partyId);
      this.setState({data: partyMemPosts})
    }else {
      this.props.changePartyId(-1);
      sessionStorage.setItem('partyid',-1);
    }
  }
  tick = () => {
    this.setState({
      acount: window.sessionStorage.getItem('acount'),
    });
  }
  componentDidMount() {
    this.interval = setTimeout(() => this.tick(), 100);
  }

  logout = () => {
    let path = '/web/security/logout'
    if (sessionStorage.getItem('loginUserOrMerchant') == 2) {
      path = '/web/merchant/logout'
    }
    $q.post($q.url + path, '', (data) => {
      if(data.status===1){
        // this.props.setAuthInfo({})
        window.sessionStorage.clear()
        location.hash = '#/login';
        window.localStorage.removeItem('company');
        message.success(data.root.logoutStatus);
      }
    }, () => {

      location.hash = '#/login';
    });

  }

  componentWillUnmount() {
    window.localStorage.removeItem('company');
  }
  option = () => {
    if(!this.state.data.length) {
      return false;
    }else {
      return <MyOption data={this.state.data} changePartyId={this.props.changePartyId} />;
    }
  }
  render() {
    sessionStorage.setItem('partyId', this.state.partyId);
    const {shortCompanyName}=this.state;
    return (
      <div className="root-head">
        {/* <div className="head-title">武船党建管理平台 / 
          <span style={{fontSize:'10px',lineHeight:'15px',display:'inline-block',marginLeft:'7px'}}>
            <div> WUCHUAN GROUP MANAGEMENT</div>
            <div> PLATFORM</div>
          </span>
        </div> */}
        {/* <div className="head-title">信科视界党建管理平台</div> */}
      <div className="head-title">{shortCompanyName}党建管理平台</div>
        <div style={{ flexGrow: 1 }} />
          {this.option()}
          <img src={icon_user} />
          <div className="head-user">{this.state.acount}</div>
          <div style={{ cursor: "pointer" }} className="head-exit" onClick={this.logout.bind(this)}>退出</div>
        </div>
    );
  }
}
export default Head;

class MyOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
    
  }
  handleChange = (value) => {
    this.props.changePartyId(value);
    sessionStorage.setItem('partyid',value||-1);
  }
  render() {
    return (
      <Select style={{width: 500, border: 'none'}} className='partyUser' defaultValue={this.state.data[0].id}  onChange={this.handleChange}>
        {
          this.state.data.map(item => { 
            if(item.fullName.indexOf('小组') == -1) {
              return <Option key={item.id} value={item.id}>{item.fullName}</Option>;
            }
          })
        }
      </Select>
    );
  }
}
