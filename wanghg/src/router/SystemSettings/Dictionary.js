import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Apply from '../../view/content/SystemSettings/Dictionary/Apply/Apply.js';
import Magazines from '../../view/content/SystemSettings/Dictionary/Magazines/Magazines.js';
import MagazinesDetail from '../../view/content/SystemSettings/Dictionary/Magazines/detail.js';
import ApplyDetail from 
  '../../view/content/SystemSettings/Dictionary/Apply/detail.js';
// import TaskTopicList from '../../view/content/SystemSettings/Dictionary/TaskTopic/List';
// import TaskTopicAdd from '../../view/content/SystemSettings/Dictionary/TaskTopic/Add';
// import TaskTopicEdit from '../../view/content/SystemSettings/Dictionary/TaskTopic/Edit';
// import TaskTypeList from '../../view/content/SystemSettings/Dictionary/TaskType/List';
// import TaskTypeAdd from '../../view/content/SystemSettings/Dictionary/TaskType/Add';
// import TaskTypeEdit from '../../view/content/SystemSettings/Dictionary/TaskType/Edit';

const DictionaryMatch = 'Dictionary';
const Dictionary = _ => (
  <Switch>
  <Route  exact path={`${_.match}/${DictionaryMatch}/Apply`} component={Apply} />
  <Route
      exact
      path={`${_.match}/${DictionaryMatch}/Magazines`}
      component={Magazines}
    />
    <Route
      path={`${_.match}/${DictionaryMatch}/Magazines/detail`}
      component={MagazinesDetail}
    />
    <Route
      path={`${_.match}/${DictionaryMatch}/ApplyDetail`}
      component={ApplyDetail}
    />
    <Route
      path={`${_.match}/${DictionaryMatch}/AddApply`}
      component={ApplyDetail}
    />
      {/* <Route
          path={`${_.match}/${DictionaryMatch}/TaskTopic`}
          component={TaskTopicList}
      />
    <Route
        path={`${_.match}/${DictionaryMatch}/TaskTopicAdd`}
        component={TaskTopicAdd}
    />
    <Route
        path={`${_.match}/${DictionaryMatch}/TaskTopicEdit`}
        component={TaskTopicEdit}
    /> */}

    {/* <Route
        path={`${_.match}/${DictionaryMatch}/TaskType`}
        component={TaskTypeList}
    />
    <Route
        path={`${_.match}/${DictionaryMatch}/TaskTypeAdd`}
        component={TaskTypeAdd}
    />
    <Route
        path={`${_.match}/${DictionaryMatch}/TaskTypeEdit`}
        component={TaskTypeEdit}
    /> */}

  </Switch>
);
export default Dictionary;