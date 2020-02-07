import React, {
  Component,
} from 'react';
import {
  Button,
} from 'antd';
import TreeList from '../../component/tree/TreeList';
import TreeArr from '../../component/tree/TreeArr';
import { setCheckTreeData } from '../../../redux-root/action/tree/tree';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getService, GetQueryString, postService } from '../../content/myFetch';
import API_PREFIX from '../../content/apiprefix';
@connect(
  state => ({
    AllTreeData: state.tree.treeCheckData,
    powers: state.powers,
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
        ['union' + '_' + this.props.type]: [],
        ['company' + '_' + this.props.type]: [],
      },
      allData: [],
      virtualGroupData: [],
      wordTreeData: [],
      organizationData: [],
      partyOrganizationData: [],
      unionData: [],
      flowData: this.props.flowData,
      treeID: this.props.initialValue && this.props.initialValue.id,
      treeID_a: GetQueryString(location.hash, ['id']).id || "0",
      newsId: GetQueryString(location.hash, ['id']).id || null,
    };
  }
  componentDidMount = async () => {
    console.log(this.props, this.state)
    await this.getTreeData();
    if (this.state.newsId) {
      await this.getAuth()
    } else if (this.props.initialValue) {
      await this.props.setCheckData(this.props.initialValue);
    } else if (this.props.flowData && JSON.stringify(this.props.flowData) !== '{}') {
      await this.props.setCheckData(this.props.flowData);
    } else if (this.props.leaveData && this.props.leaveData !== {}) {
      await this.props.setCheckData(this.props.leaveData);
    }
  }
  getAuth = () => {
    postService(API_PREFIX + `services/web/auth/authdata/getAllByDataId/${this.state.newsId}`, {}, data => {
      if (data.status === 1) {
        let allData = data.root.object;
        console.log("wwwwwww", allData);
        let checkData = {
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
        this.props.setCheckData(checkData);
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
    let partyOrganizationUrl = `services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1`;    /////党组织的接口未改wgs0903
    let unionUrl = 'services/web/union/org/getUnionOrgList/0';//工会接口
    if (this.props.datatype != 'notice') {
      //// treeUrl = `services/system/cateogry/group/tree/${treeID_b}`;
      // organizationUrl = `services/system/organization/organizationList/get/${treeID_b}`;
      //// partyOrganizationUrl = `services/system/partyOrganization/partyOrganizationList/get/${treeID_b}`;
    }
    // getService(API_PREFIX + treeUrl, data => {
    //   if (data.status === 1) {

    //     // 只需要虚拟圈
    //     // virtualGroupData = data.root.list
    //     let virtualGroupData = [];
    //     let list;
    //     data.root.object.map((item, index) => {
    //       console.log('item', item);
    //       if (item.name == '虚拟圈') {
    //         virtualGroupData.push(item);
    //         list = data.root.object[index]['subList'].map(items => {
    //           return items;
    //         });
    //       }
    //     });
    //     console.log("11111", virtualGroupData, list);
    //     this.setState({
    //       virtualGroupData,
    //       wordTreeData: list,
    //     });
    //   }
    // });
    let powers = this.props.powers;
    let departPower = powers && powers['20004.21501.003'];//部门权限
    let partyPower = powers && powers['20005.23002.003'];//党组织权限
    let ringtPower = powers && powers['20004.21505.003'];//虚拟圈的权限
    let unionPower = powers && powers['20007.21704.000'];//工会权限
    //虚拟组树
    if(ringtPower){
      let virtualGroupData = [];
      getService(API_PREFIX + treeUrl, data => {
        if (data.status === 1) {
          virtualGroupData = data.root.object;
          const DealData = data => {
            for (let index = 0; index < data.length; index++) {
              let node = data[index];
              node.key = node.id ? node.id : '-1';
              node.id = node.id ? node.id : '-1';
              node.children = node.subList;
              if (node.subList) {
                DealData(node.subList);
              }
            }
          };
          DealData(virtualGroupData);
          this.setState({
            virtualGroupData,
          });
        }
      });
    }
    //部门树
    if(departPower){
      let organizationData = [];
      getService(API_PREFIX + organizationUrl, data => {
        if (data.status === 1) {
          console.log(data);
          organizationData = data.root.object;
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
          this.setState({
            organizationData,
          });
        }
      });
    }




    //党组织树
    if(partyPower){
      let partyOrganizationData = [];
      getService(API_PREFIX + partyOrganizationUrl, data => {
        if (data.status === 1) {
          partyOrganizationData = data.root.object;
          const DealData = data => {
            for (let index = 0; index < data.length; index++) {
              let node = data[index];
              node.key = node.id + '';
              node.name = node.fullName=this.getCaption(node.fullName);
              node.children = node.partyOrgList;
              if (node.partyOrgList) {
                DealData(node.partyOrgList);
              }
            }
          };
          DealData(partyOrganizationData);
          this.setState({
            partyOrganizationData,
          });
        }
      });
    }

    // getService(API_PREFIX +'services/system/cateogry/news/userAuthOrgList/get',data=>{
    //   if (data.retCode===1) {
    //     console.log('请求树');
    //   }
    // });
    //工会树
    if(unionPower){
      let unionData = [];
      getService(API_PREFIX + unionUrl, data => {
        if (data.status === 1) {
          unionData = data.root.object;
          const DealData = data => {
            for (let index = 0; index < data.length; index++) {
              let node = data[index];
              node.key = node.id;
              node.children = node.unionOrgList;
              if (node.unionOrgList) {
                DealData(node.unionOrgList);
              }
            }
          };
          DealData(unionData);
          this.setState({
            unionData,
          });
        }
      });
    }


  };

  getCaption=(obj)=>{
    var index=obj.lastIndexOf("\>");
    obj=obj.substring(index+1,obj.length);
    return obj;
   }


  static getDerivedStateFromProps(nextProps, prevState) {
    //// console.log(nextProps, prevState);
    if (nextProps.AllTreeData !== prevState.AllTreeData) {
      // let checkData = {
      //   ...prevState.checkData,
      // };
      console.log("aaaaaa==>", prevState.checkData, nextProps.AllTreeData)
      let checkData = {
        ...prevState.checkData,
        ...nextProps.AllTreeData,
      };
      console.log("bbbbbb==>", checkData)
      // debugger;
      return {
        checkData,
        AllTreeData: nextProps.AllTreeData,
      };
    }
    return null;
  }
  render() {
    const {
      organizationData,
      partyOrganizationData,
      virtualGroupData, checkData, wordTreeData, unionData,
    } = this.state;

    /// console.log('organizationData==>', organizationData);
    ////console.log(checkData);
    const { disabled, powers } = this.props;
    console.log("disabled======", disabled);
    let departPower = powers && powers['20004.21501.000'];//部门权限
    let partyPower = powers && powers['20005.23002.000'];//党组织权限
    // let ringtPower=true;//虚拟圈权限(还没有配置)
    let ringtPower = powers && powers['20004.21505.000'];//虚拟圈的权限
    let unionPower = powers && powers['20007.21704.000'];//工会权限

    let downPower = powers && powers['20004.21501.000'];//下级权限


    console.log("partyOrganizationData====>",partyOrganizationData)

    //   <TreeList
    //   type={
    //     'department' + '_' + this.props.type
    //   }
    //   treeData={
    //     organizationData
    //   }
    //   checkable
    //   checkedKeys={
    //     checkData ? checkData['department' + '_' + this.props.type] : []
    //   }
    //   disabled={
    //     disabled
    //   }
    //   haha="12121212"
    //   enable={
    //     this.props.enable
    //   }
    // /> 
    return (
      <div> {
        /**
         * 朱劲松 新增判断 活动管理---考试活动
         * 修改 ‘统计报表-党建考试-接收人统计规则’ BUG 2016
         */
        //   this.props.examination?
        //   <div className="single-tree" style={{padding:'0 20%'}}  
        //   // onClick={(event) => {
        //   //   if (event.target === event.currentTarget) {
        //   //     window.location.hash = '/PartyBuildGarden/PartyOrganization?back=1';
        //   //   }
        //   // }}
        //   >
        //     <span className="location-span">选择党组织</span>
        //     <div style={{ display: 'flex', marginTop: '10px' }}>
        //       <TreeList
        //         type={'partyid' + '_' + this.props.type}
        //         treeData={partyOrganizationData}
        //         checkable
        //         checkedKeys={
        //           checkData ? checkData['partyid' + '_' + this.props.type] : []
        //         }
        //         disabled={disabled}
        //         enable={this.props.enable}
        //       />
        //       {
        //         this.props.add!='add'?
        //           <Link
        //             className="operation"
        //             style={{ marginLeft: '20px', marginTop: '4px', height: '20px' }}
        //             to="/PartyBuildGarden/PartyOrganization?back=1"
        //           >
        //             党组织管理
        //           </Link>
        //         :null
        //       }

        //     </div>
        //   </div>
        // :
        <div className="trees" >
          {
            departPower ?
              <div className="single-tree">
                <span className="location-span" > 选择部门 </span>
                {
                  this.props.add != 'add' ? <Link className="operation"
                    style={{ marginLeft: '170px', marginTop: '4px', height: '20px', }}
                    to="/EnterpriseConfig/DepartMent?back=1" >部门管理 </Link> : null
                }
                <div style={{ display: 'flex', marginTop: '10px', }
                } >
                  <TreeList
                    type={'department' + '_' + this.props.type}
                    treeData={organizationData}
                    checkable
                    checkedKeys={checkData ? checkData['department' + '_' + this.props.type] : []}
                    disabled={disabled}
                    haha="12121212"
                    enable={this.props.enable}
                  />
                </div>

              </div>
            : null
          }

          {
            partyPower ?
              <div className="single-tree">
                <span className="location-span" > 选择党组织 </span>
                {
                  this.props.add != 'add' ? <Link className="operation"
                    style={{ marginLeft: '170px', marginTop: '4px', height: '20px' }}
                    to="/PartyBuildGarden/PartyOrganization?back=1">党组织管理</Link> : null
                }
                <div style={{ display: 'flex', marginTop: '10px' }}>
                  <TreeList
                    type={'partyid' + '_' + this.props.type}
                    treeData={partyOrganizationData}
                    checkable
                    checkedKeys={checkData ? checkData['partyid' + '_' + this.props.type] : []}
                    disabled={disabled}
                    enable={this.props.enable}
                  />
                </div>
              </div> 
            : null
          }
          {
          ringtPower?
          <div className="single-tree">
              <span className="location-span" > 选择虚拟群组 </span> 
              {
                  this.props.add != 'add' ? <Link className="operation"
                    style={{marginLeft: '150px',marginTop: '4px',height: '20px',}}
                    to="/EnterpriseConfig/VirtualGroup?back=1" >虚拟群组管理 </Link> : null
                }
              <div style={{display: 'flex',marginTop: '10px',}} >
                <TreeList
                  type={'virtualgroupid' + '_' + this.props.type}
                  treeData={virtualGroupData}
                  wordTreeData={wordTreeData}
                  checkable
                  checkedKeys={checkData ?checkData['virtualgroupid' + '_' + this.props.type] :[]
                  }
                  disabled={disabled}
                  enable={this.props.enable}
                />  
              </div>
          </div> 
         :null}
            {/* 工会树 */}
          {
            unionPower ?
              <div className="single-tree">
                <span className="location-span" > 选择工会 </span>
                {
                  this.props.add != 'add' ? <Link className="operation"
                    style={{marginLeft: '170px',marginTop: '4px',height: '20px',}}
                    to="/TradeManager/Organization?back=1" >工会管理 </Link> : null
                }
                <div style={{display: 'flex',marginTop: '10px',}} >
                  <TreeList
                    type={'union' + '_' + this.props.type}
                    treeData={unionData}
                    checkable
                    checkedKeys={checkData ? checkData['union' + '_' + this.props.type] : []}
                    disabled={disabled}
                    haha="12121212"
                    enable={this.props.enable}
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
                  to="/TradeManager/Organization?back=1" >
                  工会管理 </Link> : null
              } */} 
              </div>

            </div>
            : null
          }
        </div>
      } </div>
    );
  }
}