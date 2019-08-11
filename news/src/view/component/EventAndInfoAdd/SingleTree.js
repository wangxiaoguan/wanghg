import React, { Component } from 'react';
import { Button } from 'antd';
import TreeList from '../../component/tree/TreeList';
import {setSelectTreeData,setCheckTreeData} from '../../../redux-root/action/tree/tree';
import { setModal}from'../../../redux-root/action/modal';
import { connect } from 'react-redux';
import { getService } from '../../content/myFetch';
import ServiceApi from '../../content/apiprefix';
import {Link}from'react-router-dom';
const cutStr = str => {
  return str.split(',');
};
@connect(
  state => ({
    checkTreeData: state.tree.treeCheckData,
    selectDetail: state.tree.treeSelectData.selectDetail,
    selectTreeData: state.tree.treeSelectData,
  }),
  dispatch => ({
    setSelectData: n => dispatch(setSelectTreeData(n)),
    setCheckData: n => dispatch(setCheckTreeData(n)),
    setModal: n => dispatch(setModal(n)),
  })
)
export default class MultipleTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkTreeData: this.props.checkTreeData,
      checkData: {
        column: [],
      },
      treeData:[],
      treeType :this.props.treeType,
      allData: this.props.allData,
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.checkTreeData !== prevState.checkTreeData) {
      let checkData = { ...prevState.checkData };
      checkData = { ...checkData, ...nextProps.checkTreeData };
      return { checkData, checkTreeData: nextProps.checkTreeData };
    }
    return null;
  }

  setInitialValue=(data)=>{
    if (this.props.type === 'selectTree') {
      this.props.setSelectData({ column: data });
    } else if (this.props.type === 'checkTree') {
      this.props.setCheckData({ column: data });
    }
  }
  componentDidUpdate(){
    if (this.props.treeType !== this.state.treeType) {
      let data = [];
      if (this.props.treeType===4) {
        data =this.state.allData.filter(item => item.type === '3');
      }else{
        data = this.state.allData.filter(item => item.type === '1');
      }
      this.DealData(data);
      this.setState({ treeData: data, treeType: this.props.treeType });
    }
  }
   DealData = data => {
     for (let index = 0; index < data.length; index++) {
       let node = data[index];
       node.key = node.id + '';
       node.disabled = node.categoryState === '0';
       node.department = node.department ? cutStr(node.department) : [];
       node.partyid = node.partyid ? cutStr(node.partyid) : [];
       node.virtualgroupid = node.virtualgroupid
         ? cutStr(node.virtualgroupid)
         : [];
       node.children = node.subCategoryList;
       if (node.subCategoryList) {
         this.DealData(node.subCategoryList);
       }
     }
   };
   componentDidMount() {
     this.getTreeData();
     if (this.props.initialValue) {
       console.log('栏目单棵树initialValue', this.props.initialValue);
       this.setInitialValue(this.props.initialValue);
     } else if (
       this.props.flowData &&
      JSON.stringify(this.props.flowData) !== '{}'
     ) {
       console.log('栏目单棵树flowData', this.props.flowData);
       this.setInitialValue(this.props.flowData);
     } else if (this.props.leaveData && this.props.leaveData !== {}) {
       console.log('栏目单棵树leaveData', this.props.leaveData);
       this.setInitialValue(this.props.leaveData);
     }
   }
  getTreeData = () => {

  };

  render() {
    const { treeData, checkData } = this.state;
    const { disabled, selectTreeData, type } = this.props;
    return (
      <div className="trees">
        <TreeList
          type="column"
          treeData={treeData}
          checkable
          style={this.props.style}
          checkedKeys={checkData['column']}
          disabled={disabled}
        />
        <Link to="/SystemSettings/ColumnManagement?back=1">栏目管理</Link>
      </div>
    );
  }
}
