import React, { Component } from 'react';
import DynamicTree from '../../../component/tree/DynamicTree';
// import { treeData } from '../../../component/tree/mockData';
import './Department.less';
import { getService } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import { connect } from 'react-redux';
@connect(state => ({
  powers: state.powers,
}))
export default class Department extends Component {
  constructor(props) {
    super(props);
    this.state = { treeDataKey: 0,treeData:[],NewAdd:false};
  }
  componentDidMount() {
    this.getTreeData();
  }
  getTreeData = () => {
    let treeData = [];
    const cutStr = str => {
      // return str.match(/^[$]&/);
      let result = str.split(',');
      console.log('result', result);
      return result;
    };
    getService(
      API_PREFIX + `services/web/company/org/orgList/get?Q=isAll=${true}&Q=haveUsers=${false}`,
      data => {
        if (data.status === 1) {
          treeData = data.root.object;
          const DealData = data => {
            for (let index = 0; index < data.length; index++) {
              let node = data[index];
              node.key = node.id + '';
              node.disabled = node.organizationState === '0';
              node.children = node.subCompanyOrgList;
              if (node.subCompanyOrgList) {
                DealData(node.subCompanyOrgList);
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

  NewAddNode=(data)=>{
    console.log(data)
    this.setState({
      NewAdd:data
    })
  }

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
        NewAddNode={this.NewAddNode}
        updateTree={this.getTreeData}
        addUrl={'services/web/company/org/addSubCompanyOrg'}
        updateUrl={'services/system/organization/update'}
        deleteUrl={'services/system/organization/deleteOrganizationById'}
        stopUrl={'services/web/company/org/updateCompanyOrgState'}
        startUrl={'services/web/company/org/updateCompanyOrgState'}
        //不禁用企业部门管理部门名称
        inputDisabled={false}
      />
    </div>;
  }
}
const radioOption = [
  { label: '是', value: true },
  { label: '否', value: false },
];
const data = [
  { key: 'name', label: '部门名称', type: 'input',disabled:true},
  { key: 'showIndex', label: '显示顺序', type: 'input'},
  { key: 'nickName', label: '部门别名', type: 'input'},
  // { key: 'organizationState', label: '是否启用', type: 'radioButton', option: radioOption },
  { key: 'isEnable', label: '是否启用别名', type: 'radioButton', option: radioOption },
  { key: 'instruction', label: '部门说明', type: 'textArea' },
  { key: 'disabled', label: '部门状态', type: 'select', option: option, disabled: true },
];
const option = [{ key: '0', value: '停用' }, { key: '1', value: '启用' }];
