import React, { Component } from 'react';
import { Button, Spin, message } from 'antd';
import DynamicTree from '../../../component/tree/DynamicTree';
import ColumnTree from '../../../component/tree/ColumnTree';
import TreeList from '../../../component/tree/TreeList';
import {setCheckTreeData} from '../../../../redux-root/action/tree/tree';
import { connect } from 'react-redux';
import './Column.less';

import { getService,postService } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
let list=[];
@connect(state => ({
  AllTreeData: state.tree.treeCheckData,                       // pyj  20190320 
  selectDetail: state.tree.treeSelectData.selectDetail,
  selectTreeData: state.tree.treeSelectData.DynamicTree,
  selectRowsData: state.table.selectRowsData,
  loading:state.loading.loading,
  powers: state.powers,
}),
dispatch=>({
  setCheckData:n=>dispatch(setCheckTreeData(n)),
})
)

export default class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {
      virtualGroupData:[],
      organizationData:[],
      partyOrganizationData:[],
      unionsData: [],
      treeDataKey: 0,
      update: 0,
      treeData: [],
      judge: false,
      // AllTreeData: this.props.AllTreeData,
      AllTreeData:"",
      checkData: {
        department: [],
        partyid: [],
        virtualgroupid: [],
        unionsId: [],
      },
      selectChange:false,
      orgList:[],
      partyList:[],
      virList:[],
      reviewerList:[],
      type:'',
      NewAdd:false,
      selectTreeData1:[],
      selectTreeData:[],
      columnChange:'2',
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
    getService(//栏目信息获取
      API_PREFIX + 'services/web/config/category/getList',
      data => {
        if (data.status === 1) {
          treeData = data.root.object;
          // const DealData = data => {
          //   for (let index = 0; index < data.length; index++) {
          //     let node = data[index];
          //     node.key = node.id + '';
          //     node.disabled = node.categoryState === '0';
          //     node.department = node.department ? cutStr(node.department) : [];
          //     node.partyid = node.partyid ? cutStr(node.partyid) : [];
          //     node.virtualgroupid = node.virtualgroupid ? cutStr(node.virtualgroupid) : [];
          //     node.children = node.subCategoryList;
          //     if (node.subCategoryList) {
          //       DealData(node.subCategoryList);
          //     }
          //   }
          // };
          const DealData = (nodes, predicate) => {
            if (!(nodes && nodes.length)) {
              return [];
            }
        
            const newChildren = [];
            for (const node of nodes) {
              node.key = node.id + '';
              node.disabled = node.categoryState === '0';
              node.department = node.department ? cutStr(node.department) : [];
              node.partyid = node.partyid ? cutStr(node.partyid) : [];
              node.virtualgroupid = node.virtualgroupid ? cutStr(node.virtualgroupid) : [];
              node.children = node.subCategoryList;
              if (predicate(node)) {
                // 如果节点符合条件，直接加入新的节点集
                newChildren.push(node);
                node.children = DealData(node.children, predicate);
              } else {
                // 如果当前节点不符合条件，递归过滤子节点，
                // 把符合条件的子节点提升上来，并入新节点集
                newChildren.push(...DealData(node.children, predicate));
              }
            }
            return newChildren;
          }
          treeData = DealData(treeData, node => node.showType !== 2); 

          console.log('first treeData',treeData);
          this.setState({ treeData, treeDataKey: this.state.treeDataKey + 1 });
        }else{
          message.error(data.errorMsg);
        }
      }
    );
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.AllTreeData.name){
      delete nextProps.AllTreeData.name;
      if (nextProps.AllTreeData !== prevState.AllTreeData) {
        let checkData = { ...prevState.checkData };
        checkData = { ...checkData, ...nextProps.AllTreeData };
        // let judge = prevState.checkData.department.length > 0 || prevState.checkData.partyid.length > 0 || prevState.checkData.virtualgroupid.length > 0;
        return { checkData, AllTreeData: nextProps.AllTreeData,selectChange:true };
      }
      return null;
    }else{
      if (nextProps.AllTreeData!== prevState.AllTreeData) {
        let checkData = { ...prevState.checkData };
        checkData = { ...checkData, ...nextProps.AllTreeData };
        // let judge = prevState.checkData.department.length > 0 || prevState.checkData.partyid.length > 0 || prevState.checkData.virtualgroupid.length > 0;
        return { checkData, AllTreeData: nextProps.AllTreeData,selectChange:true };
      }
      return null;
    }
  }

//递归获取部门，党组织，虚拟群最低层所有得key值的集合 

arrConversion=(arr)=>{
  if(arr&&arr.children){
    if(arr.children.length>0){
      for (let i = 0; i < arr.children.length; i++) {
        if (arr.children[i].children) {
          this.arrConversion(arr.children[i]);
        } else {
           list.push(arr.children[i].key);
        }
      }
    }else{
      list.push(arr.key);
    }
  }else if(arr&&arr.length>0){
    for (let j = 0; j < arr.length; j++) {
      if (arr[j].children) {
        this.arrConversion(arr[j]);
      } else {
         list.push(arr[j].key);         
      }
    }
    
  }else{
    if(arr){
      list.push(arr.key);
    }
  }
  return list;
}

NewAddNode=(data)=>{
  this.setState({
    NewAdd:data,
  });
}
getTreeList = (id) => {
    let powers = this.props.powers
    let departmentPowers=powers && powers['20004.21501.000'];//部门树权限码
    let partyPower=powers && powers['20005.23002.000'];//党组织权限
    let virtualGroupPowers=powers && powers['20004.21505.000'];//虚拟树权限码
    let tradePowers = powers && powers['20007.21704.000']; //工会树权限码
    const virtualGroup = new Promise((pass,fail)=>{
      virtualGroupPowers ? 
      getService(API_PREFIX + 'services/web/company/group/getGroupListTree', data => {
            if (data.status === 1) {
                let virtualGroupData = [];
                data.root.object.map((item, index) => {
                    if (item.name == '虚拟圈') {
                        virtualGroupData.push(item);
                        const DealData = data => {
                            for (let index = 0; index < data.length; index++) {
                                let node = data[index];
                                node.key = node.id?node.id:'-1';
                                node.id = node.id?node.id:'-1';
                                node.children = node.subList;
                                if (node.subList) {
                                    DealData(node.subList);
                                }
                            }
                        };
                        DealData(virtualGroupData);
                        this.setState({ virtualGroupData });
                        pass(virtualGroupData)
                    }
                });
            }
        }) : pass([])

    })
    const organization = new Promise((pass,fail)=>{
      departmentPowers ?
        getService(API_PREFIX + 'services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false',data=>{
            if (data.status === 1) {
                let organizationData = data.root.object;
                const DealData = data => {
                    for (let index = 0; index < data.length; index++) {
                        let node = data[index];
                        node.key = node.id + '';
                        node.children = node.subCompanyOrgList;
                        if (node.subCompanyOrgList) {
                            DealData(node.subCompanyOrgList);
                        }
                    }
                };
                DealData(organizationData);
                this.setState({ organizationData});
                pass(organizationData)
      
            }
        }) : pass([])
    })
    const getColumnAuth = new Promise((pass,fail)=>{
        postService(API_PREFIX+`services/web/auth/authdata/getAllByDataId/${id}`,{},data=>{
            if(data.status===1){
                pass(data.root.object)
            }
        })
    })
    const unionsOrg = new Promise((pass, fail) => {
      tradePowers ?
        getService(API_PREFIX + 'services/web/union/org/getUnionOrgList/0',data=>{
            if (data.status === 1) {
                let unionsData = data.root.object;
                const DealData = data => {
                    for (let index = 0; index < data.length; index++) {
                        let node = data[index];
                        node.key = node.id + '';
                        node.children = node.unionOrgList;
                        if (node.unionOrgList) {
                            DealData(node.unionOrgList);
                        }
                    }
                };
                DealData(unionsData);
                this.setState({ unionsData});
                pass(unionsData)
      
            }
        }) : pass([])
    })
    const partyOrg = new Promise((pass, fail) => {
      partyPower ?
      getService(API_PREFIX + 'services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1',data=>{
          if (data.status === 1) {
              let partyData = data.root.object;
              const DealData = data => {
                  for (let index = 0; index < data.length; index++) {
                      let node = data[index];
                      node.name = node.partyName;
                      node.key = node.id + '';
                      node.children = node.partyOrgList;
                      if (node.partyOrgList) {
                          DealData(node.partyOrgList);
                      }
                  }
              };
              DealData(partyData);
              this.setState({partyOrganizationData: partyData});
              pass(partyData)
          }
      }) : pass([])
  })
    Promise.all([virtualGroup,organization,getColumnAuth,unionsOrg,partyOrg]).then(data=>{
      console.log('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', data)
      this.props.setCheckData({
        department:data[2].departments,
        partyid:data[2].partys,
        virtualgroupid:data[2].groups,
        unionsId: data[2].unions,
        isCheck:false,
      });
    })
}
getColumnAuth = (id) => {
  postService(API_PREFIX+`services/web/auth/authdata/getAllByDataId/${id}`,{},data=>{
    if(data.status===1){
      let obj = data.root.object;
      let checkData = this.state.checkData;
      checkData['department'] = obj.departments;
      checkData['virtual'] = obj.groups;
      checkData['partyid'] = obj.partys;
      checkData['unionsId'] = obj.unions;
      
      this.props.setCheckData({
          department: obj.departments,
          partyid: obj.partys,
          virtual: obj.groups,
          unionsId: obj.unions,
          isCheck: false,
      });
      this.setState({checkData})
    }
  })
}
columnonCLick=(a,b)=>{
  this.setState({columnChange:'2'});
   let { selectChange} = this.state;
   let { selectTreeData} = this.props;
   console.log("selectTreeData",selectTreeData);
   if (selectChange&&selectTreeData&&selectTreeData.length>0) {
     if(selectTreeData.toString().indexOf('unsavetreenodekey')<0){  //不包含模拟的id
       //点击对于栏目进行数据回显
       getService(API_PREFIX + `services/web/config/category/getCategory/${selectTreeData}`,res=>{
         if (res.status === 1 && JSON.stringify(res.root) !== '{}') {
            this.setState({type: res.root.object.type});
              this.getTreeList(selectTreeData)




          //  let virtualGroupData = [];//虚拟圈树接口数据请求
          //  getService(API_PREFIX + 'services/web/company/group/getGroupListTree', data => {
          //    if (data.status === 1) {
          //      data.root.object.map((item, index) => {
          //        if (item.name == '虚拟圈') {
          //          virtualGroupData.push(item);
          //          const DealData = data => {
          //            for (let index = 0; index < data.length; index++) {
          //              let node = data[index];
          //              node.key = node.id?node.id:'-1';
          //              node.id = node.id?node.id:'-1';
          //              node.children = node.subList;
          //              if (node.subList) {
          //                DealData(node.subList);
          //              }
          //            }
          //          };
          //          DealData(virtualGroupData);
          //          this.setState({ virtualGroupData });
          //        }
          //      });
          //    }
          //  });
   
          //  let organizationData = [];//部门树接口数据请求
          //  getService(API_PREFIX + 'services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false',data=>{
          //    if (data.status === 1) {
          //      organizationData = data.root.object;
          //      const DealData = data => {
          //        for (let index = 0; index < data.length; index++) {
          //          let node = data[index];
          //          node.key = node.id + '';
          //          node.children = node.subCompanyOrgList;
          //          if (node.subCompanyOrgList) {
          //            DealData(node.subCompanyOrgList);
          //          }
          //        }
          //      };
          //      DealData(organizationData);
          //      this.setState({ organizationData});
       
          //    }
          //  });
           //部门树、虚拟群组树数据回显
          //  this.props.setCheckData({
          //    department:res.root.object.departments&&res.root.object.departments.length!==0?res.root.object.departments:[],
          //    partyid:res.root.object.partys&&res.root.object.partys.length!==0?res.root.object.partys:[],
          //    virtualgroupid:res.root.object.groups&&res.root.object.groups.length!==0?res.root.object.groups:[],
          //    isCheck:false,
          //  });
         }else if(res.status!==1){
           message.error(res.errorMsg);
         }
       });

       // getService(API_PREFIX + `services/web/config/category/getCategory/${selectTreeData}`,data=>{
       //   if (data.status===1&&JSON.stringify(data.root)!=='{}') {
       //     this.setState({type:data.root.object.type});
       //     let virtualGroupData = [];

       //     //虚拟圈数据
       //     data.root.object&&data.root.object.groups&&data.root.object.groups.length!==0&&data.root.object.groups.map((item, index) => {
       //       if (item.name == '虚拟圈') {  
       //         virtualGroupData.push(item);
       //       }
       //     });

       //     let organizationData = data.root.object.departments;//部门数据
       //     let partyOrganizationData = data.root.object.partyOrganizationsList;//党组织数据
       //     const DealOrganizationData = data => {
       //         if(data[0]!==''){
       //           for (let index = 0; index < data.length; index++) {
       //             let node = data[index];
       //             node.key = node.id + '';
       //             node.children = node.subOrganizationList;
       //             if (node.subOrganizationList) {
       //               DealOrganizationData(node.subOrganizationList);
       //             }
       //           }
       //         }
       //     };
       //     const DealPartyData = data => {
       //       for (let index = 0; index < data&&data.length; index++) {
       //         let node = data[index];
       //         node.key = node.id + '';
       //         node.children = node.partyOrganizationList;
       //         if (node.partyOrganizationList) {
       //           DealPartyData(node.partyOrganizationList);
       //         }
       //       }
       //     };
       //     DealOrganizationData(organizationData);
       //     DealPartyData(partyOrganizationData);
       //     this.setState({
       //       organizationData,
       //       partyOrganizationData,
       //       virtualGroupData,
       //     });

       //   }
       // });
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
         virList:virArr,
         selectTreeData1:selectTreeData,
       });
       this.arrConversion(this.state.organizationData);
     }
   }

}

//改变状态
columnChange=(value)=>{
  console.log('value的值==》',value);
  this.setState({columnChange:value});
}
  setColumnAuth = (data,type) => {
    let tenantId = window.sessionStorage.getItem("tenantId");

    let body = {
        dataId: data.id,
        dataType: 4,
        departments:data.departments[0] ? data.departments : [],
        partys:data.partys[0] ? data.partys : [],
        groups: data.groups[0] ? data.groups : [],
        companyList: [],
        viewTenantId:type==='edit'?[]:[tenantId],
        partysJoin: [],
        departmentsJoin: [],
        groupsJoin: [],
        companyJoinList: [],
        unions:data.unions[0] ? data.unions : [],
        unionsJoin:[],
        joinTenantId: [],
      };
      if(type==='add'&&(data.departments.length||data.partys.length||data.groups.length||data.unions[0])){
        body['viewTenantId'] = []
      }
      if(type==='edit'&&!data.departments[0]&&!data.partys[0]&&!data.groups[0]&&!data.unions[0]){
        body['departments'] = [];
        body['partys'] = [];
        body['groups'] = [];
        body['unions'] = [];
        body['viewTenantId'] = [tenantId]
      }
      if(!data.departments.length&&!data.partys.length&&!data.groups.length&&!data.unions[0]){
        body['unions'] = [];
        body['viewTenantId'] = [tenantId]
      }
      postService(API_PREFIX + `services/web/auth/authdata/updAuthData`, body, data => {
        if (data.status === 1) {
          
        }
      });
  }
  render() {
    const { virtualGroupData, organizationData,unionsData, treeData, treeDataKey, checkData, partyOrganizationData,orgList,partyList, virList,NewAdd} = this.state;


    let powers = this.props.powers;
    let create = powers && powers['20003.21405.001'];//新建
    let update = powers && powers['20003.21405.002'];//修改
    let read = powers && powers['20003.21405.003'];//查询
    let deletes = powers && powers["20003.21405.004"];//删除
    let departmentPowers=powers && powers['20004.21501.000'];//部门树权限码
    let partyPower=powers && powers['20005.23002.000'];//党组织权限
    // let partyPower=true
    let virtualGroupPowers=powers && powers['20004.21505.000'];//虚拟树权限码
    let tradePowers = powers && powers['20007.21704.000']; //工会树权限码
    let allPowers={create,update,read,deletes};
    return (
      <div className="Column">
        <Spin spinning={false}>
          <span className="tip">提示:选中类别,单击鼠标右键可进行更多操作!</span>
          <ColumnTree
            powers={allPowers}
            datatype={this.state.type}
            reviewerList={this.props.selectDetail?this.props.selectDetail.reviewerList:[]}
            type={'column'}
            dataCodeType='columnTree'
            RightForm={data}
            externalData={checkData}
            orgList={orgList}
            partyList={partyList}
            virList={virList}
            treeData={treeData}
            key={treeDataKey}
            NewAddNode={this.NewAddNode}
            columnonCLick={this.columnonCLick}
            rootDisable={true}
            updateTree={this.getTreeData}
            isforbed="true"
            addUrl={'services/web/config/category/add'}
            updateUrl={'services/web/config/category/update'}
            deleteUrl={'services/web/config/category/delete'}
            stopUrl={'services/web/config/category/stop'}
            startUrl={'services/web/config/category/start'}
            columnChange={this.columnChange}
            setColumnAuth={this.setColumnAuth}
          >
            {NewAdd?null:
              <div className="data-weight">
              <p style={{ margin: '20px 0' }}>
                <span style={{ color: '#ff0000' }}>*</span>
                <span>数据鉴权:</span>
              </p>
              <div  className="trees">
                {
                  departmentPowers?(
                    <div className="single-tree">
                    <div>
                      <span className="location-span">选择部门</span>
                      <a
                        className="location-btn operation-1"
                        onClick={() => (location.hash = '/EnterpriseConfig/DepartMent?back=1')}>
                        部门管理
                      </a>
                    </div>
                    <TreeList
                      type="department"
                      treeData={organizationData}
                      checkable  
                      checkedKeys={checkData&&this.state.columnChange==='2' ? checkData.department : []}
                      disabled={this.props.selectTreeData&& this.props.selectTreeData.length>0?false:true}
                    />
                  </div>
                  ):null
                }
                {
                  partyPower?
                  <div className="single-tree">
                  <div>
                    <span className="location-span">选择党组织</span>
                    <a
                      className="location-btn operation-2"
                      onClick={() =>
                        (location.hash = '/PartyBuildGarden/PartyOrganization?back=1')
                      }
                    >
                  党组织管理
                    </a>
                  </div>
                  
                  <TreeList
                    type="partyid"
                    treeData={partyOrganizationData}
                    checkable  
                    checkedKeys={checkData&&this.state.columnChange==='2' ? checkData.partyid : []}
                    disabled={this.props.selectTreeData && this.props.selectTreeData.length > 0 ? false : true}
                  />
                </div>:null
                }

              {
                virtualGroupPowers?(
                  <div className="single-tree-noborder">
                  <div>
                    <span className="location-span">选择虚拟群组</span>
                    <a
                      className="location-btn operation-3"
                      onClick={() =>
                        (location.hash = '/EnterpriseConfig/VirtualGroup?back=1')
                      }>
                  虚拟群组管理
                    </a>
                  </div>
                  
                  <TreeList
                    type="virtualgroupid"
                    treeData={virtualGroupData}
                    checkable
                    checkedKeys={checkData&&this.state.columnChange==='2' ? checkData.virtualgroupid : []}
                    disabled={this.props.selectTreeData && this.props.selectTreeData.length > 0 ? false : true}
                  />
                </div>
                ):null
              }
              {
                tradePowers?(
                  <div className="single-tree-noborder">
                  <div>
                    <span className="location-span">选择工会</span>
                    <a
                      className="location-btn operation-3"
                      onClick={() =>
                        (location.hash = '/TradeManager/Organization?back=1')
                      }>
                  工会组织管理
                    </a>
                  </div>
                  
                  <TreeList
                    type="unionsId"
                    treeData={unionsData}
                    checkable
                    checkedKeys={checkData&&this.state.columnChange==='2' ? checkData.unionsId : []}
                    disabled={this.props.selectTreeData && this.props.selectTreeData.length > 0 ? false : true}
                  />
                </div>
                ):null
              }
              </div>
            </div>
            }
            
          </ColumnTree>
        </Spin>
      </div>
    );
  }
}
const data = [
  { key: 'name', label: '栏目名称', type: 'input' },
  { key: 'instruction', label: '栏目说明', type: 'textArea' },
  { key: 'disabled', label: '栏目状态',type:'select' , option:option,disabled:true },
  { key: 'reviewerList', label: '审核人员',type:'Checkbox'  },
];
const option = [{ key: '0', value: '停用' }, { key:'1', value: '正常' }];