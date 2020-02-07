import React from 'react';
import { Route,Switch } from 'react-router-dom';
import Article from '../../view/content/InformationManagement/AriticleManagement/Article';

import Dictionary from './Dictionary';
// import HomeLayout from './HomeLayout';
// import DepartMent from '../../view/content/SystemSettings/Department/Department';
// import ColumnManagement from '../../view/content/SystemSettings/ColumnManagement/Column';
const match = '/SystemSettings';
// import PopularWords from '../../view/content/SystemSettings/PopularWords/PopularWords';
// import RolePermissions from '../../view/content/SystemSettings/RolePermissions/RolePermissions';
// import AddRolePermissions from '../../view/content/SystemSettings/RolePermissions/AddRolePermissions';
import UserManagement from '../../view/content/SystemSettings/UserManagement/UserManagement';
import NewUser from '../../view/content/SystemSettings/UserManagement/NewUser';
import AuthorizationRang from '../../view/content/SystemSettings/UserManagement/AuthorizationRang';
import UserManagementDetail from '../../view/content/SystemSettings/UserManagement/UserManagementDetail';
// import VirtualGroup from '../../view/content/SystemSettings/VirtualGroup/VirtualGroup';
// import VirtualGroupUser from '../../view/content/SystemSettings/VirtualGroup/VirtualGroupUser';
// import VirtualGroupAddUser from '../../view/content/SystemSettings/VirtualGroup/VirtualGroupAddUser';
import Visitor from '../../view/content/SystemSettings/Visitor/Visitor';
import DepartmentAlias from '../../view/content/oldSystem/DepartmentAlias';
import feedBack from '../../view/content/oldSystem/feedBack';
import reviewReport from '../../view/content/oldSystem/reviewReport';
import ReportManagement from '../../view/content/oldSystem/ReportManagement';
import MessageService from '../../view/content/oldSystem/MessageService';
import MattersRemind from '../../view/content/oldSystem/MattersRemind/MattersRemind';
import PartyBranchReminder from '../../view/content/oldSystem/MattersRemind/PartyBranchReminder';
import ShuttleManagement from '../../view/content/oldSystem/server/ShuttleManagement';
import CommodityManagement from '../../view/content/oldSystem/server/CommodityManagement';
import MallActivityManagement from '../../view/content/oldSystem/IntegralMall/MallActivityManagement';
import SpecialPointsManagement from '../../view/content/oldSystem/IntegralMall/SpecialPointsManagement';
import CreditGrantingUserManagement from '../../view/content/oldSystem/IntegralMall/CreditGrantingUserManagement';
import IntegralRechargeConfiguration from '../../view/content/oldSystem/IntegralMall/IntegralRechargeConfiguration';
import IntegralRechargeManagement from '../../view/content/oldSystem/IntegralMall/IntegralRechargeManagement';
import CheckExport from '../../view/content/oldSystem/IntegralMall/CheckExport';
import TaskManagement from '../../view/content/oldSystem/DanjianTaskManagement/TaskManagement';
import TaskThemeManagement from '../../view/content/oldSystem/DanjianTaskManagement/TaskThemeManagement';
import TaskTypeManagement from '../../view/content/oldSystem/DanjianTaskManagement/TaskTypeManagement';

import Experience  from  '../../view/content/SystemSettings/Experience/Experience';//经验值管理页面
import AddExperience  from  '../../view/content/SystemSettings/Experience/AddExperience';//经验值新增页面
import EditExperience  from  '../../view/content/SystemSettings/Experience/EditExperience';//经验值编辑页面
import ConfigGrade  from  '../../view/content/SystemSettings/ConfigGrade/ConfigGrade';//配置档页面
import AddConfig  from  '../../view/content/SystemSettings/ConfigGrade/AddConfig';//配置档新增页面
import EditConfig  from  '../../view/content/SystemSettings/ConfigGrade/EditConfig';//配置档编辑页面


import VersionInformation from '../../view/content/SystemSettings/VersionInformation/VersionInformation';    //版本信息
import VersionInformationAdd from '../../view/content/SystemSettings/VersionInformation/VersionInformationAdd';
import VersionInformationDetail from '../../view/content/SystemSettings/VersionInformation/detail';
import VersionInformationEdit from '../../view/content/SystemSettings/VersionInformation/Edit';
import ServiceAgreement from '../../view/content/SystemSettings/ServiceAgreement/List';    //服务协议
import WeightManagList from '../../view/content/SystemSettings/WeightManagement/WeightManagList'; //权重管理

import LiveTelecast  from  '../../view/content/SystemSettings/LiveTelecast/LiveTelecast';//直播管理页面
import AddLiveTelecast  from  '../../view/content/SystemSettings/LiveTelecast/AddLiveTelecast';//直播管理页面 添加
import SendSystemMessage  from  '../../view/content/SystemSettings/LiveTelecast/SendSystemMessage';//直播管理页面 添加
import RoleList  from  '../../view/content/SystemSettings/LiveTelecast/RoleList';//直播管理页面 添加


const SystemSettings = (props) => {
  return (
    <div>
      <Dictionary match={match} {...props}/>
      {/* <HomeLayout match={match} {...props}/> */}
      {/*企业部门管理*/}
      {/* {props.p('20001.21004.000')(<Route path={`${match}/DepartMent`} component={DepartMent} />)} */}
      {/*栏目管理*/}
      {/* {props.p('20001.21010.000')(<Route path={`${match}/ColumnManagement`} component={ColumnManagement} />)} */}
      {/*热刺管理*/}
      {/* {props.p('20001.21011.000')(<Route path={`${match}/PopularWords`} component={PopularWords} />)} */}
      {/*角色权限管理*/}
      {/* {props.p('20001.21301.000')(<Route path={`${match}/RolePermissions`} component={RolePermissions} />)}
      <Route path={`${match}/AddRolePermissions`} component={AddRolePermissions} />
      <Route path={`${match}/EditRolePermissions`} component={AddRolePermissions} />
      <Route path={`${match}/DetailRolePermissions`} component={AddRolePermissions} /> */}
      {/*用户管理*/}
      {props.p('20001.21101.000')(<Route path={`${match}/UserManagement`} component={UserManagement} />)}
      <Route path={`${match}/UserManagementDetail`} component={UserManagementDetail} />
      <Route path={`${match}/NewUser`} component={NewUser} />
      <Route path={`${match}/EditUser`} component={NewUser} />
      <Route path={`${match}/AuthorizationRang`} component={AuthorizationRang} />
      {/*虚拟群管理*/}
      {/* {props.p('20001.21006.000')(<Route path={`${match}/VirtualGroup`} component={VirtualGroup} />)} */}
      {/*群成员管理*/}
      {/* <Route path={`${match}/VirtualGroupUser`} component={VirtualGroupUser} /> */}
      {/*添加群成员*/}
      {/* <Route path={`${match}/VirtualGroupAddUser`} component={VirtualGroupAddUser} /> */}
      {/*游客管理*/}
      {props.p('20001.21002.000')(<Route path={`${match}/Visitor`} component={Visitor} />)}
      {/*版本信息*/}
      {props.p('20006.21407.000')(<Route path={`${match}/VersionInformation`} component={VersionInformation} />)}
      <Route path={`${match}/VersionInformationAdd`} component={VersionInformationAdd} />
      <Route path={`${match}/VersionInformationEdit`} component={VersionInformationEdit} />
      <Route path={`${match}/VersionInformationDetail`} component={VersionInformationDetail} />
      {/*权重管理*/}
      {props.p('20001.21816.000')(<Route path={`${match}/WeightManagement/List`} component={WeightManagList} />)}
      {/*服务协议*/}
      {props.p('20001.21811.000')(<Route path={`${match}/ServiceAgreement/List`} component={ServiceAgreement} />)}

      {/*系统设置旧系统跳转路由配置*/}
      {/*部门别名*/}
      {props.p('20001.21014.000')(<Route path={`${match}/DepartmentAlias/Redirect`} component={DepartmentAlias} />)}
      {/*反馈意见*/}
      {props.p('20001.21015.000')(<Route path={`${match}/feedBack/Redirect`} component={feedBack} />)}
      {/*评论举报*/}
      {props.p('20001.21016.000')(<Route path={`${match}/reviewReport/Redirect`} component={reviewReport} />)}
      {/*举报管理*/}
      {props.p('20001.21017.000')(<Route path={`${match}/ReportManagement/Redirect`} component={ReportManagement} />)}
      {/*消息服务*/}
      {props.p('20001.21018.000')(<Route path={`${match}/MessageService/Redirect`} component={MessageService} />)}
      {/*服务协议*/}
      {/* {props.p('20001.21019.000')(<Route path={`${match}/ServiceAgreement/Redirect`} component={ServiceAgreement} />)} */}
      {/*版本信息*/}
      {/* {props.p('20001.21020.000')(<Route path={`${match}/VersionInformation/Redirect`} component={VersionInformation} />)} */}
      {/*事项提醒管理*/}
      {props.p('20001.21032.000')(<Route path={`${match}/MattersRemind/Redirect`} component={MattersRemind} />)}
      {/*党支部换届提醒*/}
      {props.p('20001.21033.000')(<Route path={`${match}/PartyBranchReminder/Redirect`} component={PartyBranchReminder} />)}
      {/*班车管理*/}
      {props.p('20001.21024.000')(<Route path={`${match}/ShuttleManagement/Redirect`} component={ShuttleManagement} />)}
      {/*商品管理*/}
      {props.p('20001.21025.000')(<Route path={`${match}/CommodityManagement/Redirect`} component={CommodityManagement} />)}
      {/*商城活动管理*/}
      {props.p('20001.21026.000')(<Route path={`${match}/MallActivityManagement/Redirect`} component={MallActivityManagement} />)}
      {/*专项积分管理*/}
      {props.p('20001.21027.000')(<Route path={`${match}/SpecialPointsManagement/Redirect`} component={SpecialPointsManagement} />)}
      {/*积分发放用户管理*/}
      {props.p('20001.21028.000')(<Route path={`${match}/CreditGrantingUserManagement/Redirect`} component={CreditGrantingUserManagement} />)}
      {/*积分充值配置*/}
      {props.p('20001.21029.000')(<Route path={`${match}/IntegralRechargeConfiguration/Redirect`} component={IntegralRechargeConfiguration} />)}
      {/*积分充值管理*/}
      {props.p('20001.21030.000')(<Route path={`${match}/IntegralRechargeManagement/Redirect`} component={IntegralRechargeManagement} />)}
      {/*对账导出*/}
      {props.p('20001.21031.000')(<Route path={`${match}/CheckExport/Redirect`} component={CheckExport} />)}
      {/*任务管理*/}
      {props.p('20001.21021.000')(<Route path={`${match}/TaskManagement/Redirect`} component={TaskManagement} />)}
      {/*任务主题管理*/}
      {props.p('20001.21022.000')(<Route path={`${match}/TaskThemeManagement/Redirect`} component={TaskThemeManagement} />)}
      {/*任务类型管理*/}
      {props.p('20001.21023.000')(<Route path={`${match}/TaskTypeManagement/Redirect`} component={TaskTypeManagement} />)}
      {/* 经验值管理 */}
       {props.p('20001.21814.000')(<Route path={`${match}/Experience`} component={Experience} />)}
      {/* 配置档设定 */}
       {props.p('20006.21409.000')(<Route path={`${match}/ConfigGrade`} component={ConfigGrade} />)}

       <Route path={`${match}/AddConfig`} component={AddConfig} />
       <Route path={`${match}/EditConfig`} component={EditConfig} />
        <Route path={`${match}/AddExperience`} component={AddExperience} />
        <Route path={`${match}/EditExperience`} component={EditExperience} />
        
        {/* 直播管理 添加权限码xwx2018/12/21*/}
      {props.p('20012.21001.000')(<Route exact path={`${match}/LiveTelecast`} component={LiveTelecast} />)}
      <Route exact path={`${match}/LiveTelecast/AddLiveTelecast`} component={AddLiveTelecast} />
      <Route exact path={`${match}/LiveTelecast/SendSystemMessage`} component={SendSystemMessage} />
      <Route exact path={`${match}/LiveTelecast/RoleList`} component={RoleList} />
    </div>);
};
export default SystemSettings;