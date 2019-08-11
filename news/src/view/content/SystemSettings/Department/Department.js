import React, { Component } from 'react';
import DynamicTree from '../../../component/tree/DynamicTree';
// import { treeData } from '../../../component/tree/mockData';
import './Department.less';
import { getService } from '../../myFetch';
import ServiceApi from '../../apiprefix';
import { connect } from 'react-redux';
@connect(state => ({
  powers: state.powers,
}))
export default class Department extends Component {
  constructor(props) {
    super(props);
    this.state = { treeDataKey: 0,treeData:[] };
  }
  componentDidMount() {
    this.getTreeData();
  }
  getTreeData = () => {


  };

  render() {
    let powers = this.props.powers;
    let create = powers && powers['20001.21004.001'];
    let update = powers && powers['20001.21004.002'];
    let read = powers && powers['20001.21004.003'];
    let deletes = powers && powers['20001.21004.004'];
    //只禁用企业部门管理中的右键删除
    let deleteList = false;
    let allPowers = { create, update, read, deletes,deleteList };
    return <div className="Department">
      <span className="tip">提示:选中类别,单击鼠标右键可进行更多操作!</span>
      <DynamicTree RightForm={data}
        powers={allPowers}
        treeData={this.state.treeData}
        key={this.state.treeDataKey}
        rootDisable={true}
        updateTree={this.getTreeData}
        addUrl={'services/system/organization/addOrganization'}
        updateUrl={'services/system/organization/update'}
        deleteUrl={'services/system/organization/deleteOrganizationById'}
        stopUrl={'services/system/organization/changeOrganizationState/stop'}
        startUrl={'services/system/organization/changeOrganizationState/start'}
        //不禁用企业部门管理部门名称
        inputDisabled={false}
      />

    </div>;
  }
}
const data = [
  { key: 'name', label: '部门名称', type: 'input'},
  { key: 'instruction', label: '部门说明', type: 'textArea' },
  { key: 'disabled', label: '部门状态', type: 'select', option: option, disabled: true },
];
const option = [{ key: '0', value: '停用' }, { key: '1', value: '启用' }];