import React, {Component} from 'react';
import {Button,Radio,Modal} from 'antd';
import TreeList from '../../component/tree/TreeList';
import InfoTreeList from '../../component/tree/InfoTreeList';
import { setCheckTreeData } from '../../../redux-root/action/tree/tree';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getService, GetQueryString } from '../../content/myFetch';
import API_PREFIX from '../../content/apiprefix';
@connect(
  state => ({
    AllTreeData: state.tree.treeCheckData,
    checkTreeData: state.tree.treeCheckData,
    powers:state.powers
  }),
  dispatch => ({
    setCheckData: n => dispatch(setCheckTreeData(n)),
    
  })
)
/*
 * 党建学习专用
 */
export default class ColumnTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkTreeData: this.props.checkTreeData,
      checkData: {partys: []},
      treeData:[],
      allData: this.props.allData,
      InfoColumn:false,
    };
  }

  componentDidMount = async () => {
      await this.getTreeData();
      if (this.props.initialValue) {
          this.setInitialValue(this.props.initialValue);
      } else if (this.props.flowData&&JSON.stringify(this.props.flowData) !== '{}'){
          this.setInitialValue(this.props.flowData);
      } else if (this.props.leaveData && this.props.leaveData !== {}) {
          this.setInitialValue(this.props.leaveData);
      }
    
  }
  setInitialValue=(data)=>{
      console.log(this.props)
      this.props.setCheckData({ partys: data });
  }
  getTreeData = () => {

    let powersStore = this.props.powers;
    let powersLocal = JSON.parse(window.sessionStorage.getItem('powers'))
    let powers = powersLocal || powersStore;
    let partyPower=powers && powers['20003.21405.000'];//党组织管理权限


    if(partyPower){
        let treeData = [];
        getService(API_PREFIX + 'services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1', data => {
            if (data.status === 1) {
                treeData = data.root.object
                this.DealInfoData(treeData);
                this.setState({treeData,treeDataKey: this.state.treeDataKey + 1});
            }
        })
    }
  }
  DealInfoData = data => {
      data.map(item => {
          item.key = item.id;
          item.name = item.partyName
          item.children = item.partyOrgList;
          if(item.partyOrgList){
              this.DealInfoData(item.partyOrgList);
          }
      })
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.checkTreeData !== prevState.checkTreeData) {
      let checkData = { ...prevState.checkData };
      checkData = { ...checkData, ...nextProps.checkTreeData };
      return { checkData, checkTreeData: nextProps.checkTreeData };
    }
    return null;
  }
  confirm = () => {
    Modal.confirm({
        title: '您确定直接前往党组织管理吗？',
        content: '直接前往党组织管理会丢失已修改的数据,建议先点击下方保存按钮!',
        okText: '确认',
        cancelText: '取消',
        onOk() {
            location.hash = "/InterfaceManagement/ColumnManagement?back=1";
        },
    });
  }

  render() {
    const { treeData, checkData,InfoColumn } = this.state;
    const { disabled} = this.props;

    return (
        <div className="trees">
            <InfoTreeList
              type="partys"
              treeData={treeData}
              checkable isforbed='true' 
              style={this.props.style}
              checkedKeys={checkData['partys']}
              disabled={disabled}
              InfoColumn={InfoColumn}
            /> 
            {
              this.props.style!='add'?<Button className="location-btn" style={{ marginLeft: '5px' }} onClick={this.confirm} to="/PartyBuildGarden/PartyOrganization?back=1">党组织管理</Button>:null
            }
        </div> 
    );
  }
}
