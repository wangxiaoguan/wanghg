import React from 'react'
import { Route,Switch } from 'react-router-dom'

import PalmarPartySchool_a from '../../view/content/PartyBuildReport/StudyExamination/PalmarPartySchool/PalmarPartySchool'
import CompleteRate from '../../view/content/PartyBuildReport/StudyExamination/PalmarPartySchool/CompleteRate'
// import FirstCourseDetail from '../../view/content/PartyBuildReport/StudyExamination/FirstCourseDetail'
import SecondCourseDetail from '../../view/content/PartyBuildReport/StudyExamination/PalmarPartySchool/secondCourseDetail'
import LastCourseDetail from '../../view/content/PartyBuildReport/StudyExamination/PalmarPartySchool/LastCourseDetail'
const PalmarPartySchool = _ => {
    return (
    <Switch>
        {/* {_.p('20010.20013.000')(<Route exact path='/PartyBuildReport/StudyExamination/PalmarPartySchool' component={PalmarPartySchool_a}></Route>)} */}
        <Route exact path='/PartyBuildReport/StudyExamination/PalmarPartySchool' component={PalmarPartySchool_a}></Route>
        {/* <Route exact path='/PartyBuildReport/StudyExamination/PalmarPartySchool' component={PalmarPartySchool_a}></Route> */}
        <Route exact path='/PartyBuildReport/StudyExamination/CompleteRate' component={CompleteRate}></Route>
        {/* <Route exact path='/PartyBuildReport/StudyExamination/PalmarPartySchool/FirstCourseDetail' component={FirstCourseDetail}></Route> */}
        <Route exact path='/PartyBuildReport/StudyExamination/SecondCourseDetail' component={SecondCourseDetail}></Route>
        <Route exact path='/PartyBuildReport/StudyExamination/LastCourseDetail' component={LastCourseDetail}></Route>
    </Switch>
    )
}

export default PalmarPartySchool