import React, {
  Component,
} from 'react';
import {
  Button,
} from 'antd';
import TreeList from '../tree/TreeList';
import TreeArr from '../tree/TreeArr';
import { setCheckTreeData } from '../../../redux-root/action/tree/tree';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getService, GetQueryString ,postService} from '../../content/myFetch';
import API_PREFIX from '../../content/apiprefix';
@connect(
  state => ({
    AllTreeData: state.tree.treeCheckData,
    powers:state.powers,
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
export default class CompanyTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AllTreeData: this.props.AllTreeData,
      checkData: {
        ['department' + '_' + this.props.type]: [],
        ['partyid' + '_' + this.props.type]: [],
        ['virtualgroupid' + '_' + this.props.type]: [],
        ['union' + '_' + this.props.type]:[],
        ['company' + '_' + this.props.type]: [],
      },
      virtualGroupData: [],
      wordTreeData: [],
      organizationData: [],
      partyOrganizationData: [],
      companyData:[],
      unionData:[],
      flowData: this.props.flowData,
      treeID: this.props.initialValue && this.props.initialValue.id,
      treeID_a: GetQueryString(location.hash, ['id']).id || "0",
      newsId:GetQueryString(location.hash, ['id']).id || null,
    };
  }
  componentDidMount = async () => {
    console.log(this.props,this.state)
    await this.getTreeData();
    if(this.state.newsId){
      await this.getAuth()
    }else if (this.props.initialValue) {
      await this.props.setCheckData(this.props.initialValue);
    } else if (this.props.flowData && JSON.stringify(this.props.flowData) !== '{}') {
      await this.props.setCheckData(this.props.flowData);
    } else if (this.props.leaveData && this.props.leaveData !== {}) {
      await this.props.setCheckData(this.props.leaveData);
    }
  }
  getAuth = () => {
    postService(API_PREFIX+`services/web/auth/authdata/getAllByDataId/${this.state.newsId}`,{},data=>{
      if(data.status===1){
        let allData = data.root.object;
        let checkData={
          // 'department_join': allData['departments'],
          // 'partyid_join':allData['partys'],
          // 'virtualgroupid_join':allData['groups'],
          // 'union_join':allData['unions'],
          // 'company_join': allData['companyList'],

          // 'department_view': allData['departmentsJoin'],
          // 'partyid_view':allData['partysJoin'],
          // 'virtualgroupid_view':allData['groupsJoin'],
          // 'union_view':allData['unionsJoin'],
          // 'company_view': allData['companyJoinList'],
          // 'id':this.state.newsId,
          'department_join': allData['departmentsJoin'],
          'partyid_join': allData['partysJoin'],
          'department_view': allData['departments'],
          'union_join': allData['unionsJoin'],
          'company_join': allData['companyJoinList'],
          'union_view': allData['unions'],
          'company_view': allData['companyList'],
          'virtualgroupid_join': allData['groupsJoin'],
          'virtualgroupid_view': allData['groups'],
          'partyid_view': allData['partys'],
          'id': this.state.newsId,
        };
        this.props.setCheckData(checkData)
      }
    })
}
  getTreeData = () => {

    let treeID_b;
    if (this.state.treeID_a === '0') {
      treeID_b = this.state.treeID;
    } else {
      treeID_b = this.state.treeID_a;
    }
    // console.log(this.props.datatype == 'notice');
    //消息管理——通知管理——添加通知  三个树形结构不需要id值  2018/12/20-11:30
    /////let treeUrl = 'services/system/cateogry/group/tree';    /////虚拟圈的接口wgs0903
    let treeUrl = 'services/web/company/group/getGroupListTree';    /////虚拟圈的接口wgs0903
    // let organizationUrl = `services/system/organization/organizationList/get`;
    let organizationUrl = `services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false`;   ////部门树的接口已改wgs0903
    let companynUrl = `services/web/system/tree/getSubCompaniesByParentIds`;   ////部门树的接口已改wgs0903
    let partyOrganizationUrl = `services/system/partyOrganization/partyOrganizationList/get`;    /////党组织的接口未改wgs0903
    let unionUrl = 'services/web/union/org/getUnionOrgList/0';//工会接口
    if (this.props.datatype != 'notice') {
      //// treeUrl = `services/system/cateogry/group/tree/${treeID_b}`;
      // organizationUrl = `services/system/organization/organizationList/get/${treeID_b}`;
      // partyOrganizationUrl = `services/system/partyOrganization/partyOrganizationList/get/${treeID_b}`; 
    }
    


    let companyData = [];
    getService(API_PREFIX + companynUrl, data => {
      if (data.status === 1) {
        console.log(data);
        companyData = data.root.object;
        const DealData = data => {
          for (let index = 0; index < data.length; index++) {
            let node = data[index];
            node.key = node.id + '';
            node.children = node.subCompanyList;
            if (node.subCompanyList) {
              DealData(node.subCompanyList);
            }
          }
        };
        DealData(companyData);
        this.setState({
          companyData,
        });
      }
    }
    );
   

  };
  static getDerivedStateFromProps(nextProps, prevState) {
   //// console.log(nextProps, prevState);
    if (nextProps.AllTreeData !== prevState.AllTreeData) {
      let checkData = {
        ...prevState.checkData,
      };
      checkData = {
        ...checkData,
        ...nextProps.AllTreeData,
      };
      return {
        checkData,
        AllTreeData: nextProps.AllTreeData,
      };
    }
    return null;
  }
  render() {
    const {organizationData, checkData, wordTreeData,unionData,companyData} = this.state;

   /// console.log('organizationData==>', organizationData);
    ////console.log(checkData);
    const { disabled,powers } = this.props;
  /////  console.log("disabled======", disabled);
  let departPower=powers && powers['20004.21501.000'];//部门权限
  let partyPower=true;//党组织权限(还没有配置)
  let ringtPower=true;//虚拟圈权限(还没有配置)
  let unionPower=powers && powers['20007.21704.000'];//工会权限
  let downPower=powers && powers['20004.21501.000'];//下级权限
    return (
      <div> {
        <div className="trees" >
          <div className="single-tree">
            <span className="location-span" > 选择企业 </span>
            <div style={
              {
                display: 'flex',
                marginTop: '10px',
              }
            } >
              <TreeList
                type={
                  'company' + '_' + this.props.type
                }
                treeData={
                  companyData
                }
                checkable
                checkedKeys={
                  checkData ? checkData['company' + '_' + this.props.type] : []
                }
                disabled={
                  disabled
                }
                haha="12121212"
                enable={
                  this.props.enable
                }
              /> 
              {/* {
                this.props.add != 'add' ? <Link className="operation"
                  style={
                    {
                      marginLeft: '20px',
                      marginTop: '4px',
                      height: '20px',
                    }
                  }
                  to="/EnterpriseConfig/DepartMent?back=1" >
                  部门管理 </Link> : null
              } */}

            </div> 
            </div>
        </div>
      } </div>
    );
  }
}