import React from 'react';
import { Route, Switch } from 'react-router-dom';

import JoinList from '../../view/content/EventManagement/StatisticalList/JoinList';
import ViewList from '../../view/content/EventManagement/StatisticalList/ViewList';
import LikesList from '../../view/content/EventManagement/StatisticalList/LikesList';
import CommentList from '../../view/content/EventManagement/StatisticalList/CommentList';
import CommentDetail from  '../../view/content/EventManagement/StatisticalList/CommentDetail';
const StatisticalListMatch = 'StatisticalList';
const StatisticalList = _ => (
  <Switch>
    <Route exact path={`${_.match}/${StatisticalListMatch}/ViewList`} component={ViewList} />
    <Route exact path={`${_.match}/${StatisticalListMatch}/JoinList`} component={JoinList} />
    <Route exact path={`${_.match}/${StatisticalListMatch}/LikesList`} component={LikesList} />
    <Route exact path={`/CommentList`} component={CommentList} />
    <Route exact path={`/CommentDetail`} component={CommentDetail} />
  </Switch>
);
export default StatisticalList;
