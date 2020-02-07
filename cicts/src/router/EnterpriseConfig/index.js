import React from 'react';
import { Route } from 'react-router-dom';

const match = '/EnterpriseConfig';
import DepartMent from '../../view/content/SystemSettings/Department/Department';
import Company from '../../view/content/PlatformAdministrator/company';
import RolePermissions from '../../view/content/SystemSettings/RolePermissions/RolePermissions';
import AddRolePermissions from '../../view/content/SystemSettings/RolePermissions/AddRolePermissions';
import VirtualGroup from '../../view/content/SystemSettings/VirtualGroup/VirtualGroup';
import VirtualGroupUser from '../../view/content/SystemSettings/VirtualGroup/VirtualGroupUser';
import VirtualGroupAddUser from '../../view/content/SystemSettings/VirtualGroup/VirtualGroupAddUser';
import Visitor from '../../view/content/SystemSettings/Visitor/Visitor';
import UserManagement from '../../view/content/SystemSettings/UserManagement/UserManagement';
import NewUser from '../../view/content/SystemSettings/UserManagement/NewUser';
import AuthorizationRang from '../../view/content/SystemSettings/UserManagement/AuthorizationRang';
import UserManagementDetail from '../../view/content/SystemSettings/UserManagement/UserManagementDetail';

const EnterpriseConfig=(props)=>{
    return(
        <div>
            {props.p('20004.21501.000')(<Route path={`${match}/DepartMent`} component={DepartMent} />)}
            {props.p('20004.21502.000')(<Route path={`${match}/company`} component={Company} />)}
            {props.p('20004.21503.000')(<Route path={`${match}/RolePermissions`} component={RolePermissions} />)}
            <Route path={`${match}/AddRolePermissions`} component={AddRolePermissions} />
            <Route path={`${match}/EditRolePermissions`} component={AddRolePermissions} />
            <Route path={`${match}/DetailRolePermissions`} component={AddRolePermissions} />
            {/*虚拟群管理*/}
            {props.p('20004.21505.000')(<Route path={`${match}/VirtualGroup`} component={VirtualGroup} />)}
            {/*群成员管理*/}
            <Route path={`${match}/VirtualGroupUser`} component={VirtualGroupUser} />
            {/*添加群成员*/}
            <Route path={`${match}/VirtualGroupAddUser`} component={VirtualGroupAddUser} />
            {/*游客管理*/}
            {props.p('20001.21002.000')(<Route path={`${match}/Visitor`} component={Visitor} />)}
                  {/*用户管理*/}
            {props.p('20004.21504.000')(<Route path={`${match}/UserManagement`} component={UserManagement} />)}
            <Route path={`${match}/UserManagementDetail`} component={UserManagementDetail} />
            <Route path={`${match}/NewUser`} component={NewUser} />
            <Route path={`${match}/EditUser`} component={NewUser} />
            <Route path={`${match}/AuthorizationRang`} component={AuthorizationRang} />
        </div>
    );
};
export default EnterpriseConfig;