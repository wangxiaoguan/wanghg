import React from 'react';
import { Route } from 'react-router-dom';

import UserClick from '../../view/content/OperativeReport/UserClick/UserClick';
// import UserUseSituaiton from '../../view/content/OperativeReport/UserUseSituaiton/UserUseSituaiton';
// import DepartmentUserSituation from '../../view/content/OperativeReport/DepartmentUserSituation/DepartmentUserSituation';
import RoundupCollect from '../../view/content/OperativeReport/RoundupCollect/RoundupCollect';
import UserActionData from '../../view/content/OperativeReport/UserActionData/UserActionData';
import UserActionDataDetail from '../../view/content/OperativeReport/UserActionData/UserActionDataDetail';
import DepartmentActionData from '../../view/content/OperativeReport/DepartmentActionData/DepartmentActionData';
import PartyActionData from '../../view/content/OperativeReport/PartyActionData/PartyActionData';
import PartyActionDataDetail from '../../view/content/OperativeReport/PartyActionData/PartyUserInfoDetail';
import PointsStatistics from '../../view/content/OperativeReport/PointsStatistics/PointsStatistics';
import ExperienceStatistics from '../../view/content/OperativeReport/ExperienceStatistics/ExperienceStatistics';
import UserSigned from '../../view/content/OperativeReport/UserSigned/UserSigned';
const pre='/OperativeReport';
const OperativeReport=(props)=>{
  return(
  <div>
    {/* {props.p('20018.21002.000')(<Route  exact path={`${pre}/UserUseSituaiton`} component={UserUseSituaiton}/>)} */}
    {props.p('20009.21906.000')(<Route exact path={`${pre}/RoundupCollect`} component={RoundupCollect}/>)}
    {/* {props.p('20018.21003.000')(<Route exact path={`${pre}/DepartmentUserSituation`} component={DepartmentUserSituation}/>)} */}
    {props.p('20009.21907.000')(<Route exact path={`${pre}/UserActionData`} component={UserActionData}/>)}
    <Route exact path={`${pre}/UserActionData/Detail`} component={UserActionDataDetail}  />
    {props.p('20009.21901.000')(<Route exact path={`${pre}/DepartmentActionData`} component={DepartmentActionData}/>)}
    {props.p('20009.21903.000')(<Route exact path={`${pre}/PartyActionData`} component={PartyActionData}/>)}
    <Route exact path={`${pre}/PartyActionData/Detail`} component={PartyActionDataDetail}/>
    {props.p('20009.21904.000')(<Route exact path={`${pre}/PointsStatistics`} component={PointsStatistics}/>)}
    {props.p('20009.21902.000')(<Route exact path={`${pre}/ExperienceStatistics`} component={ExperienceStatistics}/>)}
    {props.p('20009.21908.000')(<Route exact path={`${pre}/UserClick`} component={UserClick}/>)}
    {props.p('20009.21905.000')(<Route exact path={`${pre}/UserSigned`} component={UserSigned}/>)}
  </div>
  );
  
};
export default OperativeReport;
