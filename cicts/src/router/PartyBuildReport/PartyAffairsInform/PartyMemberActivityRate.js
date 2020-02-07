import React from 'react';
import { Route,Switch } from 'react-router-dom';

import PartyActivityList from '../../../view/content/PartyBuildReport/PartyAffairsInform/PartyMemberActivityRate/PartyActivityList'
import FirstPartyActivityDetail from '../../../view/content/PartyBuildReport/PartyAffairsInform/PartyMemberActivityRate/FirstPartyActivityDetail'
import SecondPartyActivityDetail from '../../../view/content/PartyBuildReport/PartyAffairsInform/PartyMemberActivityRate/SecondPartyActivityDetail'
import PartyActivityBranchesDetails from '../../../view/content/PartyBuildReport/PartyAffairsInform/PartyMemberActivityRate/PartyActivityBranchesDetails'

const pre='/PartyBuildReport/PartyAffairsInform'
const PartyBuildReportPartyMemberActivityRate=(props)=>{
    return(
        <div>
        {/* {props.p('20010.20016.000')(<Route exact path={`${pre}/PartyMemberActivityRate`} component={PartyActivityList}/>)} */}
        <Route exact path={`${pre}/PartyMemberActivityRate`} component={PartyActivityList}/>
        {/* <Route exact path={`${pre}/PartyMemberActivityRate`} component={PartyActivityList}/> */}
        <Route exact path={`${pre}/FirstPartyActivityDetail`} component={FirstPartyActivityDetail} />
        <Route exact path={`${pre}/SecondPartyActivityDetail`} component={SecondPartyActivityDetail} />
        <Route exact path={`${pre}/PartyActivityBranchesDetails`} component={PartyActivityBranchesDetails} />
        </div>
    )
}

export default PartyBuildReportPartyMemberActivityRate