import React from 'react';
import { Route } from 'react-router-dom';
import List from '../../view/content/PersonalWork/Examine/List';
import ArtDetail from '../../view/content/PersonalWork/Examine/ArtDetail';
import VideoDetail from '../../view/content/PersonalWork/Examine/VideoDetail';
import MyExport from '../../view/content/PersonalWork/MyExport/MyExport';

const pre='/PersonalWork';
const PersonalWork=(props)=>{
  return(
    <div>
      {/* {props.p('20009.20001.000')(<Route exact path={`${pre}/Examine`} component={List}/>)} */}
      <Route exact path={`${pre}/Examine`} component={List}/>
      <Route exact path={`${pre}/Examine/ArtDetail`} component={ArtDetail}/>
      <Route exact path={`${pre}/Examine/VideoDetail`} component={VideoDetail}/>
      <Route exact path={`${pre}/MyExport`} component={MyExport}/>
    </div>
  )

};
export default PersonalWork;