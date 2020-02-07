import React, { Component } from 'react';
import { Button } from 'antd';
import TreeList from '../../component/tree/TreeList';
import { setCheckTreeData } from '../../../redux-root/action';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getService } from '../../content/myFetch';
import ServiceApi from '../../content/apiprefix';
@connect(
  state => ({
    AllTreeData: state.treeCheckData,
  }),
  dispatch => ({
    setCheckData: n => dispatch(setCheckTreeData(n)),
  })
)
/**
 * 可同时以树结构选择：部门、党组织、虚拟群的组件
 * 可传参数如下
 * <li>disabled--节点是否可选中</li>
 * 
 */
export default class MultipleTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AllTreeData: this.props.AllTreeData,
      checkData: {
        ['department' + '_' + this.props.type]: [],
        ['partyid' + '_' + this.props.type]: [],
        ['virtualgroupid' + '_' + this.props.type]: [],
      },
      virtualGroupData: [],
      organizationData: [],
      partyOrganizationData: [],
      flowData: this.props.flowData,
    };
  }


  componentDidMount = async () => {
    await this.getTreeData();
    console.log('树initialValue', this.props.initialValue);
    console.log('this.props.flowData', this.props.flowData);
    if (this.props.initialValue) {
      console.log('树初始数据', this.props.initialValue);
      await this.props.setCheckData(this.props.initialValue);
    } else if (this.props.flowData && JSON.stringify(this.props.flowData) !== '{}') {
      await this.props.setCheckData(this.props.flowData);
      console.log('树流转数据', this.props.flowData);
    } else if (this.props.leaveData && this.props.leaveData !== {}) {
      await this.props.setCheckData(this.props.leaveData);
      console.log('树流转数据', this.props.leaveData);
    }

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.AllTreeData !== prevState.AllTreeData) {
      let checkData = { ...prevState.checkData };
      checkData = { ...checkData, ...nextProps.AllTreeData };
      return { checkData, AllTreeData: nextProps.AllTreeData };
    }
    return null;
  }
  render() {
    const {
      organizationData,
      partyOrganizationData,
      virtualGroupData,
      checkData,
    } = this.state;
    const { disabled } = this.props;
    return (
      <div className="trees">
        <div className="single-tree" onClick={(event) => {
          if (event.target === event.currentTarget) {
            window.location.hash = '/SystemSettings/Department?back=1';
          }
        }}>
          <span className="location-span">选择部门</span>
          <div style={{ display: 'flex', marginTop: '10px' }}>
            <TreeList
              type={'department' + '_' + this.props.type}
              treeData={organizationData}
              checkable
              checkedKeys={
                checkData ? checkData['department' + '_' + this.props.type] : []
              }
              disabled={disabled}
            />
            <Link
              className="operation"
              style={{ marginLeft: '20px', marginTop: '4px' ,height: '20px'}}
              to="/SystemSettings/Department?back=1"
            >
              部门管理
            </Link>
          </div>
        </div>

        <div className="single-tree" onClick={(event) => {
          if (event.target === event.currentTarget) {
            window.location.hash = '/SystemSettings/PartyOrganization?back=1';
          }
        }}>
          <span className="location-span">选择党组织</span>
          <div style={{ display: 'flex', marginTop: '10px' }}>
            <TreeList
              type={'partyid' + '_' + this.props.type}
              treeData={partyOrganizationData}
              checkable
              checkedKeys={
                checkData ? checkData['partyid' + '_' + this.props.type] : []
              }
              disabled={disabled}
            />
            <Link
              className="operation"
              style={{ marginLeft: '20px', marginTop: '4px' ,height: '20px'}}
              to="/SystemSettings/PartyOrganization?back=1"
            >
              党组织管理
            </Link>
          </div>
        </div>

        <div className="single-tree" onClick={(event) => {
          if (event.target === event.currentTarget) {
            window.location.hash = '/SystemSettings/VirtualGroup?bcak=1';
          }
        }}>
          <span className="location-span">选择虚拟群组</span>
          <div style={{ display: 'flex', marginTop: '10px' }}>
            <TreeList
              type={'virtualgroupid' + '_' + this.props.type}
              treeData={virtualGroupData}
              checkable
              checkedKeys={
                checkData
                  ? checkData['virtualgroupid' + '_' + this.props.type]
                  : []
              }
              disabled={disabled}
            />
            <Link
              className="operation"
              style={{ marginLeft: '20px', marginTop: '4px' ,height: '20px'}}
              to="/SystemSettings/VirtualGroup?bcak=1"
            >
              虚拟群组管理
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
