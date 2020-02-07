import React from 'react';
import { Route,Switch } from 'react-router-dom';
import PartyFeePay from '../../../view/content/PartyBuildReport/PartyAffairsInform/PartyFeePay/PartyFeePay';
import FirstLevelOrganizationDetails from '../../../view/content/PartyBuildReport/PartyAffairsInform/PartyFeePay/FirstLevelOrganizationDetails';
import SecondOrganizationDetails from '../../../view/content/PartyBuildReport/PartyAffairsInform/PartyFeePay/SecondOrganizationDetails';
import PartyBranchesDetails from '../../../view/content/PartyBuildReport/PartyAffairsInform/PartyFeePay/PartyBranchesDetails';


const pre='/PartyBuildReport/PartyAffairsInform'
const PartyBuildReportPartyFeePay=(props)=>{
    return(
        <div>
        {/* {props.p('20010.20015.000')(<Route exact path={`${pre}/PartyFeePay`} component={PartyFeePay}/>)}  */}
        <Route exact path={`${pre}/PartyFeePay`} component={PartyFeePay}/>
        {/* <Route exact path={`${pre}/PartyFeePay`} component={PartyFeePay}/> */}
        <Route exact path={`${pre}/FirstLevelOrganizationDetails`} component={FirstLevelOrganizationDetails} />
        <Route exact path={`${pre}/SecondOrganizationDetails`} component={SecondOrganizationDetails} />
        <Route exact path={`${pre}/PartyBranchesDetails`} component={PartyBranchesDetails} />
        </div>
    )
}

export default PartyBuildReportPartyFeePay