import React from 'react';
import { Route, Switch } from 'react-router-dom';

import List from '../../view/content/EventManagement/Task/List/List';
import Theme from '../../view/content/EventManagement/Task/Theme/Theme';
import Type from '../../view/content/EventManagement/Task/Type/Type';
const TaskMatch = 'Task';
const Task = _ => (
  <Switch>
    <Route exact path={`${_.match}/${TaskMatch}/List/Redirect`} component={List} />
    <Route exact path={`${_.match}/${TaskMatch}/Theme`} component={Theme} />
    <Route exact path={`${_.match}/${TaskMatch}/Type`} component={Type} />
  </Switch>
);
export default Task;
