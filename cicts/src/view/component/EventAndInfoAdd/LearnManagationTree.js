import React, {
  Component,
} from 'react';
import {
  Button,
} from 'antd';
import TreeList from '../../component/tree/TreeList';
import TreeArr from '../../component/tree/TreeArr';
import {setCheckTreeData} from '../../../redux-root/action/tree/tree';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {getService, GetQueryString} from '../../content/myFetch';
import API_PREFIX from '../../content/apiprefix';
@connect(
  state => ({
    AllTreeData: state.tree.treeCheckData,
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
      wordTreeData: [],
      organizationData: [],
      partyOrganizationData: [],
      flowData: this.props.flowData,
      treeID: this.props.initialValue && this.props.initialValue.id,
      treeID_a: GetQueryString(location.hash, ['id']).id || "0",
      status:'2',//判断是显示部门还是工会组织
    };
  }
  componentDidMount = async () => {
    await this.getTreeData();
    // console.log('树initialValue', this.props.initialValue);
    // console.log('this.props.flowData', this.props.flowData);
    if (this.props.initialValue) {
      // console.log('树初始数据', this.props.initialValue);
      await this.props.setCheckData(this.props.initialValue);
    } else if (this.props.flowData && JSON.stringify(this.props.flowData) !== '{}') {
      await this.props.setCheckData(this.props.flowData);
      // console.log('树流转数据', this.props.flowData);
    } else if (this.props.leaveData && this.props.leaveData !== {}) {
      await this.props.setCheckData(this.props.leaveData);
      // console.log('树流转数据', this.props.leaveData);
    }
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
    let treeUrl = 'services/system/cateogry/group/tree';//虚拟圈树数据
    // let organizationUrl = `services/system/organization/organizationList/get`;
    let organizationUrl = `services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false`;//部门树数据
    let partyOrganizationUrl = `services/web/union/org/getUnionOrgList/0`;//工会组织树数据
    // if (this.props.datatype != 'notice') {
    //   treeUrl = `services/system/cateogry/group/tree/${treeID_b}`;
    //   // organizationUrl = `services/system/organization/organizationList/get/${treeID_b}`;
    //   partyOrganizationUrl = `services/system/partyOrganization/partyOrganizationList/get/${treeID_b}`;
    // }
    getService(API_PREFIX + treeUrl, data => {
      if (data.status === 1) {

        // 只需要虚拟圈
        let virtualGroupData = [];
        let list;
        data.root.list.map((item, index) => {
          if (item.name == '虚拟圈') {
            virtualGroupData.push(item);
            list = data.root.list[index]['children'].map(items => {
              return items;
            });
          }
        });
        this.setState({
          virtualGroupData,
          wordTreeData: list,
        });
      }
    });
    let organizationData = [];
    getService(API_PREFIX + organizationUrl,data => {
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
      }
    );
    let partyOrganizationData = [];
    getService(
      API_PREFIX + partyOrganizationUrl,
      data => {
        if (data.status === 1) {
          partyOrganizationData = data.root.object;
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
          DealData(partyOrganizationData);
          this.setState({
            partyOrganizationData,
          });
        }
      }
    );
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps,prevState);
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
    const {
      organizationData,
      partyOrganizationData,
      virtualGroupData,checkData,wordTreeData,
    } = this.state;

    console.log('organizationData==>',organizationData);
    console.log(checkData);
    const {disabled} = this.props;
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
        <div>
        <div style={{color:'red'}}>参加权限设置（若不勾选则默认为全部用户可参加）</div>
        <div className = "trees" >
          {
            this.state.status==='1'?(
              <div className = "single-tree">
              <span className = "location-span" > 选择部门 </span> 
              <div style = {
                {
                  display: 'flex',
                  marginTop: '10px',
                }
              } >
              <TreeList
              type = {
                'department' + '_' + this.props.type
              }
              treeData = {
                organizationData
              }
              checkable
              checkedKeys = {
                checkData ? checkData['department' + '_' + this.props.type] : []
              }
              disabled = {
                disabled 
              }
              haha="12121212"
              enable = {
                this.props.enable
              }
              /> {
                this.props.add != 'add' ? <Link className = "operation"
                style = {
                  {
                    marginLeft: '20px',
                    marginTop: '4px',
                    height: '20px',
                  }
                }
                to = "/SystemSettings/DepartMent?back=1" >
                  部门管理 </Link>:null
              }
      
              </div> </div>
            ):(
              <div className = "single-tree">
              <span className = "location-span" > 选择工会组织 </span> <div style = {
                {
                  display: 'flex',
                  marginTop: '10px',
                }
              } >
              <TreeList
              type = {
                'partyid' + '_' + this.props.type
              }
              treeData = {
                partyOrganizationData
              }
              checkable
              checkedKeys = {
                checkData ? checkData['partyid' + '_' + this.props.type] : []
              }
              disabled = {
                disabled
              }
              enable = {
                this.props.enable
              }
              />{
                this.props.add != 'add' ? <Link className = "operation"
                style = {
                  {
                    marginLeft: '20px',
                    marginTop: '4px',
                    height: '20px',
                  }
                }
                to = "/TradeManager/Organization?back=1" >
                  工会组织管理 </Link>:null
              }
      
              </div> </div>
            )
          }

        <div className = "single-tree">
        <span className = "location-span" > 选择虚拟群组 </span> <div style = {
          {
            display: 'flex',
            marginTop: '10px',
          }
        } >
        <TreeArr
        type = {
          'virtualgroupid' + '_' + this.props.type
        }
        treeData = {
          virtualGroupData
        }
        wordTreeData = {
          wordTreeData
        }
        checkable
        checkedKeys = {
          checkData ?
          checkData['virtualgroupid' + '_' + this.props.type] :
            []
        }
        disabled = {
          disabled
        }
        enable = {
          this.props.enable
        }
        /> {
          this.props.add != 'add' ? <Link className = "operation"
          style = {
            {
              marginLeft: '20px',
              marginTop: '4px',
              height: '20px',
            }
          }
          to = "/SystemSettings/VirtualGroup?back=1" >
            虚拟群组管理 </Link>:null
        }

        </div> </div> </div>
        </div>
      } </div>
    );
  }
}