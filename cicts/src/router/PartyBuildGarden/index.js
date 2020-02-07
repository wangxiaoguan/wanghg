import React from 'react';
import { Route } from 'react-router-dom';
import PartyLearning from '../../view/content/PartyBuildGarden/PartyLearning/List';
import AddLearn from '../../view/content/PartyBuildGarden/PartyLearning/Add';
import EditLearn from '../../view/content/PartyBuildGarden/PartyLearning/Edit';
import DetailLearn from '../../view/content/PartyBuildGarden/PartyLearning/Detail';
import Note from '../../view/content/PartyBuildGarden/PartyLearning/Note';
// import CompletionRateLearn from  '../../view/content/PartyBuildGarden/PartyLearning/CompletionRate'
import PartyTask from '../../view/content/PartyBuildGarden/PartyTask/List';
import PartyTaskAdd from '../../view/content/PartyBuildGarden/PartyTask/add/Add';
import PartyTaskEdit from '../../view/content/PartyBuildGarden/PartyTask/edit/Edit';
import CompletionRate from '../../view/content/PartyBuildGarden/PartyTask/CompletionRate';
import PublicAnnouncement from '../../view/content/PartyBuildGarden/PublicAnnouncement/List';
import PublicDetail from '../../view/content/PartyBuildGarden/PublicAnnouncement/PublicDetail';
//添加任务主题以及任务类型
import TaskTopicList from '../../view/content/PartyBuildGarden/Dictionary/TaskTopic/List';
import TaskTopicAdd from '../../view/content/PartyBuildGarden/Dictionary/TaskTopic/Add';
import TaskTopicEdit from '../../view/content/PartyBuildGarden/Dictionary/TaskTopic/Edit';

import TaskTypeList from '../../view/content/PartyBuildGarden/Dictionary/TaskType/List';
import TaskTypeAdd from '../../view/content/PartyBuildGarden/Dictionary/TaskType/Add';
import TaskTypeEdit from '../../view/content/PartyBuildGarden/Dictionary/TaskType/Edit';


import PartyMembers from '../../view/content/PartyBuildGarden/PartyMembers/PartyMembers';
import NewPartyMember from '../../view/content/PartyBuildGarden/PartyMembers/NewPartyMember';
import PartyFeeManagement from '../../view/content/PartyBuildGarden/PartyMembers/PartyFeeManagement';
import PartyOrganization from '../../view/content/PartyBuildGarden/PartyOrganization/';
import PartyApply  from  '../../view/content/PartyBuildGarden/PartyApply/PartyApply';//入党申请管理页面
import PartyMenOut  from  '../../view/content/PartyBuildGarden/PartyMenOut/PartyMenOut';//转出党员页面
import PartyEdit  from  '../../view/content/PartyBuildGarden/PartyMenOut/PartyEdit';//转出党员编辑页面

const DictionaryMatch = 'Dictionary';
const pre='/PartyBuildGarden';
const PartyBuildGarden=(props)=>{
  return(
    <div>
      <Route exact path={`${pre}/PartyLearning`} component={PartyLearning}/>
      <Route exact path={`${pre}/PartyLearning/AddLearn`} component={AddLearn}/>
      <Route exact path={`${pre}/PartyLearning/EditLearn`} component={EditLearn}/>
      <Route exact path={`${pre}/PartyLearning/DetailLearn`} component={DetailLearn}/>
      <Route exact path={`${pre}/PartyLearning/Note`} component={Note}/>
      {/* <Route exact path={`${pre}/PartyLearning/CompletionRate`} component={CompletionRateLearn}/> */}
      <Route exact path={`${pre}/PartyTask`} component={PartyTask}/>
      <Route exact path={`${pre}/PartyTask/Add`} component={PartyTaskAdd}/>
      <Route exact path={`${pre}/PartyTask/Edit`} component={PartyTaskEdit}/>
      <Route exact path={`${pre}/PartyTask/Detail`} component={PartyTaskEdit}/>
      <Route exact path={`${pre}/PartyTask/CompletionRate`} component={CompletionRate}/>
      <Route exact path={`${pre}/PublicAnnouncement`} component={PublicAnnouncement}/>
      <Route exact path={`${pre}/PublicAnnouncement/PublicDetail`} component={PublicDetail}/>
      {/* 党建园地中添加任务主题以及任务类型 */}
      <Route exact path={`${pre}/${DictionaryMatch}/TaskTopic`} component={TaskTopicList}/>
      <Route exact path={`${pre}/${DictionaryMatch}/TaskTopicAdd`} component={TaskTopicAdd}/>
      <Route exact path={`${pre}/${DictionaryMatch}/TaskTopicEdit`} component={TaskTopicEdit}/>

      <Route exact path={`${pre}/${DictionaryMatch}/TaskType`} component={TaskTypeList}/>
      <Route exact path={`${pre}/${DictionaryMatch}/TaskTypeAdd`} component={TaskTypeAdd}/>
      <Route exact path={`${pre}/${DictionaryMatch}/TaskTypeEdit`} component={TaskTypeEdit}/>
      
      
      {/*入党申请管理*/}
      {/* {props.p('20001.21204.000')(<Route path={`${pre}/PartyApply`} component={PartyApply} />)} */}
      <Route path={`${pre}/PartyApply`} component={PartyApply} />
      {/*转出党员*/}
      {/* {props.p('20001.21205.000')(<Route path={`${pre}/PartyMenOut`} component={PartyMenOut} />)} */}
      <Route path={`${pre}/PartyMenOut`} component={PartyMenOut} />
      <Route path={`${pre}/PartyEdit`} component={PartyEdit} />
      {/*党员管理*/}
      {/* {props.p('20001.21201.000')(<Route path={`${pre}/PartyMembers`} component={PartyMembers} />)} */}
      <Route path={`${pre}/PartyMembers`} component={PartyMembers} />
      <Route path={`${pre}/NewPartyMember`} component={NewPartyMember} />
      <Route path={`${pre}/NewEditPartyMember`} component={NewPartyMember} />
      <Route path={`${pre}/PartyFeeManagement`} component={PartyFeeManagement} />
      {/*党组织管理*/}
      {/* {props.p('20001.21005.000')(<Route path={`${pre}/PartyOrganization`} component={PartyOrganization} />)} */}
      <Route path={`${pre}/PartyOrganization`} component={PartyOrganization} />
    </div>
  )

};
export default PartyBuildGarden;