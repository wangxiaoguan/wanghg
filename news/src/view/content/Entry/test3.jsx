import React, { Component } from 'react';
import TreeList from '../../component/tree/TreeList';
import { connect } from 'react-redux';
const treeData = [];
@connect(state => ({
  AllTreeData: state.tree.treeCheckData,
}))
export default class Test3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AllTreeData: this.props.AllTreeData,
      checkData :{
        department: [],
        partyOrganization: [],
        virtualGroup: [],
      },
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.AllTreeData !== prevState.AllTreeData) {
      // console.log(nextProps.AllTreeData);
      let checkData = prevState.checkData;
      checkData[Object.keys(nextProps.AllTreeData)[0]] = nextProps.AllTreeData[Object.keys(nextProps.AllTreeData)[0]];
      return {checkData};
    }
    return null;
  }
  render() {
    console.log('多棵树勾选的值，根据type区分',this.state.checkData);
    const {checkData}=this.state;
    return <div>
      <TreeList treeData={treeData} checkable type="department" checkedKeys={checkData.department} />
      <TreeList treeData={treeData} checkable type="virtualGroup" checkedKeys={checkData.virtualGroup} />
      <TreeList treeData={treeData} checkable type="partyOrganization" checkedKeys={checkData.partyOrganization} />
    </div>;
  }
}