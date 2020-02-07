import React, {Component} from 'react';
import {Button,Radio,Row,Col} from 'antd';
import TreeList from '../../component/tree/TreeList';
import InfoTreeList from '../../component/tree/InfoTreeList';
import { setCheckTreeData } from '../../../redux-root/action/tree/tree';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getService, GetQueryString,postService } from '../../content/myFetch';
import API_PREFIX from '../../content/apiprefix';
@connect(
  state => ({
    AllTreeData: state.tree.treeCheckData,
    powers:state.powers
  }),
  dispatch => ({
    setCheckData: n => dispatch(setCheckTreeData(n)),
  })
)
/*
 * 资讯树结构专用
 */
export default class InfoTree extends Component {
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
      unionData:[],
      companyData:[],
      flowData: this.props.flowData,
      treeID: this.props.initialValue && this.props.initialValue.id,
      treeID_a: GetQueryString(location.hash, ['id']).id || "0",
      valueOne:1,
      valueTwo:0,
      disabledOne:false,
      disabledTwo:false,
      display:'none',
      unionCheckedKeys:[],
      newsId:GetQueryString(location.hash, ['id']).id || null,
    };
  }

  componentDidMount = async () => {
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
    await this.setTreeParams()
    
  }
  componentDidUpdate(nextProps, nextState){
      if(nextProps.valueOne!==nextState.valueOne){
          this.setState({valueOne:nextProps.valueOne})
      }
      if(nextProps.valueTwo!==nextState.valueTwo){
          this.setState({valueTwo:nextProps.valueTwo})
      }
  }
  getAuth = () => {
      postService(API_PREFIX+`services/web/auth/authdata/getAllByDataId/${this.state.newsId}`,{},data=>{
        if(data.status===1){
          let allData = data.root.object;
          let checkData={
            'department_join': allData['departments'],
            'partyid_join':allData['partys'],
            'virtualgroupid_join':allData['groups'],
            'union_join':allData['unions'],
            'company_join': allData['companyList'],
            'id':this.state.newsId,
          };
          this.props.setCheckData(checkData)
        }
      })
  }
  setTreeParams = () => {
    const {valueOne,valueTwo,disabled,belonged} = this.props;
    if(!disabled){
      if(belonged==='magazine'){
        this.setState({disabledOne:false,disabledTwo:false})
      }else{
        this.setState({disabledOne:valueOne===1?true:false})
        this.setState({disabledTwo:valueTwo===0||valueTwo===1?true:false})
      }
      
    }else{
      this.setState({disabledOne:true,disabledTwo:true})
    }
    if(belonged==='article'||belonged==='video'||belonged==='magazine'){
      this.setState({display:'block'})
    }else{
      this.setState({display:'none'})
    }
    
  }
  getTreeData = () => {

    let treeID_b;
    if (this.state.treeID_a === '0') {
      treeID_b = this.state.treeID;
    } else {
      treeID_b = this.state.treeID_a;
    }

    let organizationUrl = `services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false`;   //部门接口
    let partyOrganizationUrl = `services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1`;//党组织接口
    let treeUrl = 'services/web/company/group/getGroupListTree';                                    //虚拟圈接口
    let unionUrl = 'services/web/union/org/getUnionOrgList/0';                                      //工会接口
    let companyUrl = 'services/web/system/tree/getSubCompaniesByParentIds';                         //下级企业接口


    let powersStore = this.props.powers;
    let powersLocal = JSON.parse(window.sessionStorage.getItem('powers'))
    let powers = powersLocal || powersStore;
    let departPower=powers && powers['20004.21501.003'];//部门权限
    let partyPower=powers && powers['20005.23002.003'];//党组织权限
    let ringtPower=powers && powers['20004.21505.003'];//虚拟圈权限
    let unionPower=powers && powers['20007.21704.000'];//工会权限
    let downPower=true;//下级权限【权限码待定】

    if(departPower){
      let organizationData = [];
      getService(API_PREFIX + organizationUrl, data => {
        if (data.status === 1) {
          organizationData = data.root.object;
          const DealData = data => {
            for (let index = 0; index < data.length; index++) {
              let node = data[index];
              node.key = node.id + '';
              if (node.subCompanyOrgList&&node.subCompanyOrgList.length) {
                node.children = node.subCompanyOrgList;
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

    if(partyPower){
      let partyOrganizationData = [];
      getService(API_PREFIX + partyOrganizationUrl,data => {
          if (data.status === 1) {
            partyOrganizationData = data.root.object;
            const DealData = data => {
              for (let index = 0; index < data.length; index++) {
                let node = data[index];
                node.key = node.id + '';
                node.name = node.partyName;
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

    if(ringtPower){
      let virtualGroupData = [];
      getService(API_PREFIX + treeUrl, data => {
        if (data.status === 1) {
          virtualGroupData = data.root.object;
          const DealData = data => {
            for (let index = 0; index < data.length; index++) {
              let node = data[index];
              node.key = node.id?node.id:'-1';
              node.id = node.id?node.id:'-1';
              if (node.subList) {
                node.children = node.subList;
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
    if(unionPower){
      let unionData = [];
      getService(API_PREFIX + unionUrl,data => {
        if (data.status === 1) {
          unionData = data.root.object;
          const DealData = data => {
            for (let index = 0; index < data.length; index++) {
              let node = data[index];
              node.key = node.id;
              if (node.unionOrgList) {
                node.children = node.unionOrgList;
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
    if(downPower){
      let companyData = [];
      let unionCheckedKeys = this.state.unionCheckedKeys;
      getService(API_PREFIX + companyUrl,data => {
        if (data.status === 1) {
          companyData = data.root.object;
          const DealData = data => {
            for (let index = 0; index < data.length; index++) {
              let node = data[index];
              node.key = node.id;
              unionCheckedKeys.push(node.id)
              node.children = node.subCompanyList;
              if (node.subCompanyList) {
                DealData(node.subCompanyList);
              }
            }
          };
          DealData(companyData);
          this.setState({
            companyData,unionCheckedKeys
          });
        }
      });
    }


  };
  static getDerivedStateFromProps(nextProps, prevState) {
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
  onChangeOne = async e => {
    let value = e.target.value
    let {checkData} = this.state
    this.props.onChangeOne(value)
    const {disabled} = this.props;
    if(!disabled){
      this.setState({disabledOne:value===1?true:false})
    }
  };
  onChangeTwo = async e => {
    let value = e.target.value
    let {unionCheckedKeys,checkData} = this.state
    this.props.onChangeTwo(value)
    if(value === 1){
      await this.props.setCheckData({'company_join': unionCheckedKeys});
    }
    if(value === 2||value === 0){
      await this.props.setCheckData({'company_join': []});
      checkData['company_join'] = []
    }
    this.setState({checkData})
    const {disabled} = this.props;
    if(!disabled){
      this.setState({disabledTwo:value===0||value===1?true:false})
    }
  };
  render() {
    const {organizationData,partyOrganizationData,virtualGroupData,unionData,companyData,checkData,disabledOne,disabledTwo,display} = this.state;
    const { disabled,valueOne,valueTwo,belonged,powers} = this.props;
    const radioStyle = {display: 'block',height: '30px',lineHeight: '30px'};
    let departPower=powers && powers['20004.21501.000'];//部门权限
    let partyPower=powers && powers['20005.23002.000'];//党组织权限
    let ringtPower=powers && powers['20004.21505.000'];//虚拟圈权限
    let unionPower=powers && powers['20007.21704.000'];//工会权限
    let downPower=true;//下级权限

console.log('-------------------->',this.props)



    return (
      <div> 
        <div className='treeTop' style={{display:display}}>
          <div className='treeTitle'>选择本级级企业查看权限：</div>
          <Radio.Group onChange={this.onChangeOne} disabled={this.props.disabled} value={valueOne}>
            <Radio style={radioStyle} value={1}>全部</Radio>
            <Radio style={radioStyle} value={2}>部分用户</Radio>
          </Radio.Group>
        </div>
        <div style={{display:valueOne===1?'none':'block'}}>
        {
            this.props.belongedType === 'unionLearn'?<div className='unionLearn'>参加权限设置(若不勾选则默认为全部用户可参加):</div>:null
        }
        <div className="trees">
          {
            departPower?
            <div className="single-tree">
              <span className="location-span" > 选择部门 </span>
              <div style={{display:'flex',marginTop: '10px'}}>
                <InfoTreeList
                  type={'department' + '_' + this.props.type}
                  treeData={organizationData}
                  checkable
                  checkedKeys={checkData ? checkData['department' + '_' + this.props.type] : []}
                  disabled={disabled}
                  enable={this.props.enable}
                /> 
                {
                  this.props.add != 'add'?<Link className="operation" style={{marginLeft: '20px',marginTop: '4px',height: '20px'}} to="/EnterpriseConfig/DepartMent?back=1">部门管理</Link>:null
                }
              </div> 
            </div>:null
          }
          {
            partyPower?
            <div className = "single-tree">
              <span className = "location-span" > 选择党组织 </span>
              <div style = {{display:'flex',marginTop: '10px'}}>
              <InfoTreeList
                type = {'partyid' + '_' + this.props.type}
                treeData = {partyOrganizationData}
                checkable
                checkedKeys = {checkData ? checkData['partyid' + '_' + this.props.type] : []}
                disabled = {disabled}
                enable = {this.props.enable}
              /> 
              {
                this.props.add != 'add'?<Link className = "operation" style = {{marginLeft: '20px',marginTop: '4px',height: '20px'}} to = "/PartyBuildGarden/PartyOrganization?back=1">党组织管理</Link>:null
              }
              </div> 
            </div>:null
          }
          {
            ringtPower?
            <div className="single-tree">
              <span className="location-span" > 选择虚拟群组 </span>
              <div style={{display: 'flex',marginTop: '10px'}} >
                <InfoTreeList
                  type={'virtualgroupid' + '_' + this.props.type}
                  treeData={virtualGroupData}
                  checkable
                  checkedKeys={checkData?checkData['virtualgroupid' + '_' + this.props.type] :[]}
                  disabled={disabled}
                  enable={this.props.enable}
                /> 
                {
                  this.props.add != 'add'?<Link className="operation" style={{marginLeft: '20px',marginTop: '4px',height: '20px'}} to="/EnterpriseConfig/VirtualGroup?back=1">虚拟群组管理</Link>:null
                }
              </div>
            </div>:null
          }
          {
            unionPower?
            <div className="single-tree">
              <span className="location-span" > 选择工会 </span>
              <div style={{display: 'flex',marginTop: '10px'}} >
                <InfoTreeList
                  type={'union' + '_' + this.props.type}
                  treeData={unionData}
                  checkable
                  checkedKeys={checkData?checkData['union' + '_' + this.props.type] :[]}
                  disabled={disabled}
                  enable={this.props.enable}
                /> 
                {
                  this.props.add != 'add'?<Link className="operation" style={{marginLeft: '20px',marginTop: '4px',height: '20px'}} to="/TradeManager/Organization?back=1">工会管理</Link>:null
                }
              </div>
            </div>:null
          }
          </div>
        </div>

        <div className='treeTop' style={{display:belonged==='magazine'?'none':display}}>
          <div className='treeTitle'>选择下级企业查看权限：</div>
          <Radio.Group onChange={this.onChangeTwo} disabled={this.props.disabled} value={valueTwo}>
            <Radio style={radioStyle} value={0}>无</Radio>
            <Radio style={radioStyle} value={1}>全部</Radio>
            <Radio style={radioStyle} value={2}>部分</Radio>
          </Radio.Group>
        </div>
        <div className="treesTwo" style={{display:display}}>
          <div style={{display:valueTwo===2?'block':'none'}}>
            {
              downPower?
              <div className="single-tree">
              <span className="location-span" >选择下级企业</span>
              <div style={{display:'flex',marginTop: '10px'}}>
                <InfoTreeList
                  type={'company' + '_' + this.props.type}
                  treeData={companyData}
                  checkable
                  checkedKeys={checkData ? checkData['company' + '_' + this.props.type] : []}
                  disabled={disabled}
                  enable={this.props.enable}
                /> 
                {/* {
                  this.props.add != 'add' ? <Link className="operation" style={{marginLeft: '20px',marginTop: '4px',height: '20px'}} to="/SystemSettings/DepartMent?back=1" >部门管理</Link> : null
                } */}
              </div>
            </div>:null
            }

          </div>
        </div>
      </div>
    );
  }
}