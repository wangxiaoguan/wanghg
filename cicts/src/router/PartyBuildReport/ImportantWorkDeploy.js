import React from 'react'
import { Route,Switch } from 'react-router-dom'

import ImportantWorkDeploy_a from '../../view/content/PartyBuildReport/PartyBuildTask/ImportantWork/ImportantWorkDeploy'
import CompleteRate from '../../view/content/PartyBuildReport/PartyBuildTask/ImportantWork/CompleteRate'
// import CompleteRateDetail from '../../view/content/PartyBuildReport/PartyBuildTask/CompleteRateDetail'
// import FirstCourseDetail from '../../view/content/PartyBuildReport/PartyBuildTask/FirstCourseDetail'
import SecondCourseDetail from '../../view/content/PartyBuildReport/PartyBuildTask/ImportantWork/secondCourseDetail'
import LastCourseDetail from '../../view/content/PartyBuildReport/PartyBuildTask/ImportantWork/LastCourseDetail'
import MeetingCompleteRate from '../../view/content/PartyBuildReport/PartyBuildTask/ImportantWork/MeetingCompleteRate'
const ImportantWorkDeploy = _ => {
    return (
    <Switch>
        {/* {_.p('20010.20011.000')(<Route exact path='/PartyBuildReport/PartyBuildTask/ImportantWorkDeploy' component={ImportantWorkDeploy_a}></Route>)} */}
        <Route exact path='/PartyBuildReport/PartyBuildTask/ImportantWorkDeploy' component={ImportantWorkDeploy_a}></Route>
        {/* <Route exact path='/PartyBuildReport/PartyBuildTask/ImportantWorkDeploy' component={ImportantWorkDeploy_a}></Route> */}
        <Route exact path='/PartyBuildReport/PartyBuildTask/CompleteRate' component={CompleteRate}></Route>
        {/* <Route exact path='/PartyBuildReport/PartyBuildTask/ImportantWorkDeploy/CompleteRateDetail' component={CompleteRateDetail}></Route> */}
        {/* <Route exact path='/PartyBuildReport/PartyBuildTask/ImportantWorkDeploy/FirstCourseDetail' component={FirstCourseDetail}></Route> */}
        <Route exact path='/PartyBuildReport/PartyBuildTask/SecondCourseDetail' component={SecondCourseDetail}></Route>
        <Route exact path='/PartyBuildReport/PartyBuildTask/LastCourseDetail' component={LastCourseDetail}></Route>
        <Route exact path='/PartyBuildReport/PartyBuildTask/MeetingCompleteRate' component={MeetingCompleteRate}></Route>
    </Switch>
    )
} 

export default ImportantWorkDeploy