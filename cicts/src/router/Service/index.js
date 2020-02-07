import React from 'react';
import { Route,Switch } from 'react-router-dom';
import BusList from '../../view/content/Service/Bus/List';
import RemindList from '../../view/content/Service/Remind/List';
import RemindListAdd from '../../view/content/Service/Remind/add';
import RemindListEditor from '../../view/content/Service/Remind/editor';
import ChangeTeamList from '../../view/content/Service/ChangeTeam/List';
import ChangeTeamAdd from '../../view/content/Service/ChangeTeam/add';
import CheckInList from '../../view/content/Service/CheckIn/List';

const pre='/Service';
const Service=(props)=>{
  return(
    <div>
      <Route exact path={`${pre}/BusList`} component={BusList}/>
      <Route exact path={`${pre}/RemindList`} component={RemindList}/>
      <Route path={`${pre}/RemindList/add`} component={RemindListAdd}/>
      <Route path={`${pre}/RemindList/editor`} component={RemindListEditor}/>
      <Route exact path={`${pre}/ChangeTeamList`} component={ChangeTeamList}/>
      <Route path={`${pre}/ChangeTeamList/ChangeTeamAdd`} component={ChangeTeamAdd}/>
      <Route exact path={`${pre}/CheckInList`} component={CheckInList}/>
    </div>
  )

};
export default Service;




