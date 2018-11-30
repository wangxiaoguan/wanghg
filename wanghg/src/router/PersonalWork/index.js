import React from 'react';
import { Route } from 'react-router-dom';
import List from '../../view/content/PersonalWork/Examine/List';


const pre='/PersonalWork';
const PersonalWork=(props)=>{
  return(
    <div>
      {/* {props.p('20003.23001.000')(<Route exact path={`${pre}/Examine`} component={List}/>)} */}
      <Route exact path={`${pre}/Examine`} component={List}/>
     
    </div>
  )

};
export default PersonalWork;