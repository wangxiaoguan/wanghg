import React from 'react';
import { Route,Switch } from 'react-router-dom';
import PartyFeePay from '../../../view/content/PartyBuildReport/PartyAffairsInform/PartyFeePay';
import FirstLevelOrganizationDetails from '../../../view/content/PartyBuildReport/PartyAffairsInform/FirstLevelOrganizationDetails';
import SecondOrganizationDetails from '../../../view/content/PartyBuildReport/PartyAffairsInform/SecondOrganizationDetails';
import PartyBranchesDetails from '../../../view/content/PartyBuildReport/PartyAffairsInform/PartyBranchesDetails';


const pre='/PartyBuildReport/PartyAffairsInform'
const PartyBuildReport=(props)=>{
    return(
        <div>
        {/* {props.p('20003.23001.000')(<Route exact path={`${pre}/Article`} component={Article}/>)}     */}
        <Route exact path={`${pre}/PartyFeePay`} component={PartyFeePay}/>
        <Route exact path={`${pre}/PartyFeePay/FirstLevelOrganizationDetails`} component={FirstLevelOrganizationDetails} />
        <Route exact path={`${pre}/PartyFeePay/SecondOrganizationDetails`} component={SecondOrganizationDetails} />
        <Route exact path={`${pre}/PartyFeePay/PartyBranchesDetails`} component={PartyBranchesDetails} />
        </div>
    )
}

export default PartyBuildReport