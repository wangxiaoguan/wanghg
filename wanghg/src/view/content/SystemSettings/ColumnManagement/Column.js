import React, { Component } from 'react';
import { Button, Spin } from 'antd';
import DynamicTree from '../../../component/tree/DynamicTree';
import TreeList from '../../../component/tree/TreeList';
import { connect } from 'react-redux';
import './Column.less';

import { getService } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
var list=[];
@connect(state => ({
  AllTreeData: state.tree.treeCheckData,
  selectDetail: state.tree.treeSelectData.selectDetail,
  selectTreeData: state.tree.treeSelectData.DynamicTree,
  loading:state.loading.loading,
  powers: state.powers,
}))
export default class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {
      virtualGroupData:[],
      organizationData:[],
      partyOrganizationData:[],
      treeDataKey: 0,
      update: 0,
      treeData: [],
      judge: false,
      AllTreeData: this.props.AllTreeData,
      checkData: {
        department: [],
        partyid: [],
        virtualgroupid: [],
      },
      selectChange:false,
      orgList:[],
      partyList:[],
      virList:[],
    };
  }
  componentDidMount() {
    this.getTreeData();
  }
  getTreeData = () => {
    let treeData = [];
    const cutStr = str => {
      // return str.match(/^[$]&/);
      let result = str.split(',');
      return result;
    };
    getService(
      API_PREFIX + 'services/system/cateogry/categoryList/get',
      data => {
        if (data.retCode === 1) {
          treeData = data.root.list;
          const DealData = data => {
            for (let index = 0; index < data.length; index++) {
              let node = data[index];
              node.key = node.id + '';
              node.disabled = node.categoryState === '0';
              node.department = node.department ? cutStr(node.department) : [];
              node.partyid = node.partyid ? cutStr(node.partyid) : [];
              node.virtualgroupid = node.virtualgroupid ? cutStr(node.virtualgroupid) : [];
              node.children = node.subCategoryList;
              if (node.subCategoryList) {
                DealData(node.subCategoryList);
              }
            }
          };
          DealData(treeData);
          this.setState({ treeData, treeDataKey: this.state.treeDataKey + 1 });
        }
      }
    );
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.AllTreeData !== prevState.AllTreeData) {
      let checkData = { ...prevState.checkData };
      checkData = { ...checkData, ...nextProps.AllTreeData };
      // let judge = prevState.checkData.department.length > 0 || prevState.checkData.partyid.length > 0 || prevState.checkData.virtualgroupid.length > 0;
      return { checkData, AllTreeData: nextProps.AllTreeData,selectChange:true };
    }
    return null;
  }

//递归获取部门，党组织，虚拟群最低层所有得key值的集合 

arrConversion=(arr)=>{
    
  if(arr.children){
    if(arr.children.length>0){
      for (let i = 0; i < arr.children.length; i++) {
        if (arr.children[i].children) {
          this.arrConversion(arr.children[i])
        } else {
           list.push(arr.children[i].key)
        }
      }
    }else{
      list.push(arr.key)
    }
  }else if(arr.length>0){
    for (let j = 0; j < arr.length; j++) {
      if (arr[j].children) {
        this.arrConversion(arr[j])
      } else {
         list.push(arr[j].key)
         
      }
    }
    
  }else{
    list.push(arr.key)
  }
  return list;
}

  componentDidUpdate(){
    const { selectChange} = this.state;
    const { selectTreeData} = this.props;
    console.log('selectTreeData', selectTreeData);
    if (selectChange && selectTreeData&&selectTreeData.length>0) {
      console.log('selectTreeData666',selectTreeData);
      if(selectTreeData.toString().indexOf('unsavetreenodekey')<0){  //不包含模拟的id
        getService(API_PREFIX + `services/system/cateogry/categoryAuthInfo/get/${selectTreeData}`,data=>{
          console.log('neirong',data);
          if (data.retCode===1) {
            let virtualGroupData = data.root.object.virtualGroupList;
            let organizationData = data.root.object.organizationList;
            let partyOrganizationData = data.root.object.partyOrganizationsList;
            const DealOrganizationData = data => {
              for (let index = 0; index < data.length; index++) {
                let node = data[index];
                node.key = node.id + '';
                node.children = node.subOrganizationList;
                if (node.subOrganizationList) {
                  DealOrganizationData(node.subOrganizationList);
                }
              }
            };
            const DealPartyData = data => {
              for (let index = 0; index < data.length; index++) {
                let node = data[index];
                node.key = node.id + '';
                node.children = node.partyOrganizationList;
                if (node.partyOrganizationList) {
                  DealPartyData(node.partyOrganizationList);
                }
              }
            };
            DealOrganizationData(organizationData);
            DealPartyData(partyOrganizationData);
            this.setState({
              organizationData,
              partyOrganizationData,
              virtualGroupData,
            });

          }
        });
        this.setState({ selectChange:false});
        list=[];
        let orgArr=this.arrConversion(this.state.organizationData);
        list=[];
        let partyArr=this.arrConversion(this.state.partyOrganizationData);
        list=[];
        let virArr=this.arrConversion(this.state.virtualGroupData);
        list=[];
        this.setState({
          orgList:orgArr,
          partyList:partyArr,
          virList:virArr
        })
        this.arrConversion(this.state.organizationData)
      }

    }
  }

  render() {
    console.log("this.props.loading",this.props.loading)
    const { virtualGroupData, organizationData, treeData, treeDataKey, checkData, partyOrganizationData,orgList,partyList, virList} = this.state;
    let powers = this.props.powers;
    let create = powers && powers['20001.21010.001'];
    let update = powers && powers['20001.21010.002'];
    let read = powers && powers['20001.21010.003'];
    let deletes = powers && powers["20001.21010.004"];
    let allPowers={create,update,read,deletes};
    return (
      <div className="Column">
        <Spin spinning={false}>
          <span className="tip">提示:选中类别,单击鼠标右键可进行更多操作!</span>
          <DynamicTree
            powers={allPowers}
            RightForm={data}
            externalData={checkData}
            orgList={orgList}
            partyList={partyList}
            virList={virList}
            treeData={treeData}
            key={treeDataKey}
            rootDisable={true}
            updateTree={this.getTreeData}
            addUrl={'services/system/cateogry/addCategory'}
            updateUrl={'services/system/cateogry/update'}
            deleteUrl={'services/system/cateogry/deleteCategoryById'}
            stopUrl={'services/system/cateogry/changeCategoryState/stop'}
            startUrl={'services/system/cateogry/changeCategoryState/start'}
          >
            <div className="data-weight">
              <p style={{ margin: '20px 0' }}>
                <span style={{ color: '#ff0000' }}>*</span>
                <span>数据鉴权:</span>
              </p>
              <div
                className="trees"
              >
                <div className="single-tree">
                  <div>
                    <span className="location-span">选择部门</span>
                    <a
                      className="location-btn operation-1"
                      onClick={() => (location.hash = '/SystemSettings/Department')}
                    >
                      部门管理
                    </a>
                  </div>
                  <TreeList
                    type="department"
                    treeData={organizationData}
                    checkable
                    checkedKeys={checkData ? checkData.department : []}
                    disabled={this.props.selectTreeData&& this.props.selectTreeData.length>0?false:true}
                  />
                </div>

                <div className="single-tree">
                  <div>
                    <span className="location-span">选择党组织</span>
                    <a
                      className="location-btn operation-2"
                      onClick={() =>
                        (location.hash = '/SystemSettings/PartyOrganization')
                      }
                    >
                  党组织管理
                    </a>
                  </div>
                  
                  <TreeList
                    type="partyid"
                    treeData={partyOrganizationData}
                    checkable
                    checkedKeys={checkData ? checkData.partyid : []}
                    disabled={this.props.selectTreeData && this.props.selectTreeData.length > 0 ? false : true}
                  />
                </div>

                <div className="single-tree-noborder">
                  <div>
                    <span className="location-span">选择虚拟群组</span>
                    <a
                      className="location-btn operation-3"
                      onClick={() =>
                        (location.hash = '/SystemSettings/VirtualGroup')
                      }
                    >
                  虚拟群组管理
                    </a>
                  </div>
                  
                  <TreeList
                    type="virtualgroupid"
                    treeData={virtualGroupData}
                    checkable
                    checkedKeys={checkData ? checkData.virtualgroupid : []}
                    disabled={this.props.selectTreeData && this.props.selectTreeData.length > 0 ? false : true}
                  />
                </div>
              </div>
            </div>
          </DynamicTree>
        </Spin>
      </div>
    );
  }
}
const data = [
  { key: 'name', label: '组织名称', type: 'input' },
  { key: 'instruction', label: '组织说明', type: 'textArea' },
  { key: 'disabled', label: '组织状态',type:'select' , option:option,disabled:true },
];
const option = [{ key: '0', value: '停用' }, { key:'1', value: '正常' }];