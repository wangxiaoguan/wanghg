import React from 'react';
import { Route, Switch } from 'react-router-dom';
//党建考试统计
import PartyBuildExamination from '../../view/content/PartyBuildReport/StudyExamination/PartyBuildExamination/PartyBuildExamination';
import ViewCompletionRateFromExa from '../../view/content/PartyBuildReport/StudyExamination/PartyBuildExamination/ViewCompletionRate';
import FirstOrganization from '../../view/content/PartyBuildReport/StudyExamination/PartyBuildExamination/FirstOrganization';
import PartyBranchesDetail from '../../view/content/PartyBuildReport/StudyExamination/PartyBuildExamination/PartyBranchesDetail';
//三会一课任务统计
import MeetingTask from '../../view/content/PartyBuildReport/PartyBuildTask/MeetingTask/MeetingTask';
import ViewCompletionRateFromMeet from '../../view/content/PartyBuildReport/PartyBuildTask/MeetingTask/ViewCompletionRate';
import FirstOrganizationFromMeet from '../../view/content/PartyBuildReport/PartyBuildTask/MeetingTask/FirstOrganization';
import PartyBranchesDetailFromMeet from '../../view/content/PartyBuildReport/PartyBuildTask/MeetingTask/PartyBranchesDetail';
//党员荣誉值统计
import PartyMemberHonor from '../../view/content/PartyBuildReport/PartyAffairsInform/PartyMemberHonor/PartyMemberHonor';
import FirstOrganizationFromHonor from '../../view/content/PartyBuildReport/PartyAffairsInform/PartyMemberHonor/FirstOrganization';
import PartyBranchesDetailFromHonor from '../../view/content/PartyBuildReport/PartyAffairsInform/PartyMemberHonor/PartyBranchesDetail';
//重要工作部署统计


const match = '/PartyBuildReport';
// const StudyExamination = 'StudyExamination';
// const MeetingTask = 'MeetingTask';
const PartyBuildReport = _ => {
	return(
  <Switch>
    {/* {_.p('20010.20011.000')(<Route exact path={`${_.match}`} component={List} />)} */}
    {/* {_.p('20010.20014.000')(<Route exact path={`${match}/StudyExamination/PartyBuildExamination`} component={PartyBuildExamination}></Route>)} */}
    <Route exact path={`${match}/StudyExamination/PartyBuildExamination`} component={PartyBuildExamination}></Route>
    <Route exact path={`${match}/StudyExamination/ViewCompletionRate`} component={ViewCompletionRateFromExa} ></Route>
    <Route exact path={`${match}/StudyExamination/FirstOrganization`} component={FirstOrganization}></Route>
    <Route exact path={`${match}/StudyExamination/PartyBranchesDetail`} component={PartyBranchesDetail} ></Route>

    {/* {_.p('20010.20012.000')(<Route exact path={`${match}/PartyBuildTask/MeetingTask`} component={MeetingTask} ></Route>)} */}
    <Route exact path={`${match}/PartyBuildTask/MeetingTask`} component={MeetingTask} ></Route>
    <Route exact path={`${match}/PartyBuildTask/ViewCompletionRate`} component={ViewCompletionRateFromMeet} ></Route>
    <Route exact path={`${match}/PartyBuildTask/FirstOrganization`} component={FirstOrganizationFromMeet} ></Route>
    <Route exact path={`${match}/PartyBuildTask/PartyBranchesDetail`} component={PartyBranchesDetailFromMeet} ></Route>

    {/* {_.p('20010.20017.000')(<Route exact path={`${match}/PartyAffairsInform/PartyMemberHonor`} component={PartyMemberHonor} ></Route>)} */}
    <Route exact path={`${match}/PartyAffairsInform/PartyMemberHonor`} component={PartyMemberHonor} ></Route>
    <Route exact path={`${match}/PartyAffairsInform/FirstOrganization`} component={FirstOrganizationFromHonor} ></Route>
    <Route exact path={`${match}/PartyAffairsInform/PartyBranchesDetail`} component={PartyBranchesDetailFromHonor} ></Route>
    {/*<Route exact path={`${_.match}/${StudyExamination}/Field`}component={Field}/>*/}
  </Switch>
	)
  
};
export default PartyBuildReport;