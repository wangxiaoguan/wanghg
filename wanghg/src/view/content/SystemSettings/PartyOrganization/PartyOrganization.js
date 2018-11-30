import React, { Component } from 'react';
import DynamicTree from '../../../component/tree/DynamicTree';
// import { treeData } from '../../../component/tree/mockData';
import './PartyOrganization.less';
import { connect } from 'react-redux';
import { getService } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
@connect(state => ({
  powers: state.powers,
}))
export default class PartyOrganization extends Component {
  constructor(props) {
    super(props);
    this.state = { treeDataKey:0,treeData:[] };
  }
  componentDidMount() {
    this.getTreeData();
  }
  getTreeData = () => {
    let treeData = [];
    const cutStr = str => {
      // return str.match(/^[$]&/);
      let result = str.replace('[', '').replace(']', '').split(',');
      console.log('result', result);
      return result;
    };
    getService(
      API_PREFIX + 'services/system/partyOrganization/partyOrganizationList/get/10',
      data => {
        if (data.retCode === 1) {
          treeData = data.root.list;
          const DealData = data => {
            for (let index = 0; index < data.length; index++) {
              let node = data[index];
              node.key = node.id + '';
              node.disabled = node.partyOrganizationState === '0';
              node.children = node.partyOrganizationList;
              if (node.partyOrganizationList) {
                DealData(node.partyOrganizationList);
              }
            }
          };
          DealData(treeData);
          this.setState({
            treeData,
            treeDataKey: this.state.treeDataKey + 1,
          });
        }
      }
    );
  };

  render() {
    let powers = this.props.powers;
    let create = powers && powers['20001.21005.001'];
    let update = powers && powers['20001.21005.002'];
    let read = powers && powers['20001.21005.003'];
    let deletes = powers && powers['20001.21005.004'];
    let allPowers = { create, update, read, deletes };
    return <div className="PartyOrganization">
      <span className="tip">提示:选中类别,单击鼠标右键可进行更多操作!</span>
      <DynamicTree RightForm={data}
        powers={allPowers}
        treeData={this.state.treeData}
        key={this.state.treeDataKey}
        rootDisable={true}
        updateTree={this.getTreeData}
        addUrl={'services/system/partyOrganization/addPartyOrganization'}
        updateUrl={'services/system/partyOrganization/update'}
        deleteUrl={'services/system/partyOrganization/deletePartyOrganizationById'}
        stopUrl={'services/system/partyOrganization/changePartyOrganizationState/stop'}
        startUrl={'services/system/partyOrganization/changePartyOrganizationState/start'} />
    </div>;
  }
}
const data = [
  { key: 'name', label: '组织名称', type: 'input' },
  { key: 'instruction', label: '组织说明', type: 'textArea' },
  { key: 'disabled', label: '组织状态', type: 'select', option: option, disabled: true },
  // { key: 'test4', label: '党委书记', type: 'input' },
  // { key: 'test5', label: '党委副书记', type: 'input' },
  // { key: 'test6', label: '纪检委员', type: 'input' },
  // { key: 'test7', label: '保密委员', type: 'input' },
  // { key: 'test8', label: '青年委员', type: 'input' },
  // { key: 'test9', label: '宣传委员', type: 'input' },
  // { key: 'test10', label: '组织委员', type: 'input' },

];
const option = [{ key: '0', value: '停用' }, { key: '1', value: '启用' }];