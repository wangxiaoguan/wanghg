import React from 'react';
import { Route } from 'react-router-dom';
import PartyLearning from '../../view/content/PartyBuildGarden/PartyLearning/List';
import AddLearn from '../../view/content/PartyBuildGarden/PartyLearning/AddLearn';
import EditLearn from '../../view/content/PartyBuildGarden/PartyLearning/EditLearn';
import DetailLearn from '../../view/content/PartyBuildGarden/PartyLearning/DetailLearn';
import CompletionRateLearn from  '../../view/content/PartyBuildGarden/PartyLearning/CompletionRate'
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
const DictionaryMatch = 'Dictionary';
const pre='/PartyBuildGarden';
const PartyBuildGarden=(props)=>{
  return(
    <div>
      <Route exact path={`${pre}/PartyLearning`} component={PartyLearning}/>
      <Route exact path={`${pre}/PartyLearning/AddLearn`} component={AddLearn}/>
      <Route exact path={`${pre}/PartyLearning/EditLearn`} component={EditLearn}/>
      <Route exact path={`${pre}/PartyLearning/DetailLearn`} component={DetailLearn}/>
      <Route exact path={`${pre}/PartyLearning/CompletionRate`} component={CompletionRateLearn}/>
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
    </div>
  )

};
export default PartyBuildGarden;