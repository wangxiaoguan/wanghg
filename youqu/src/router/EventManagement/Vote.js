import React from 'react';
import { Route, Switch } from 'react-router-dom';
import List from '../../view/content/EventManagement/Vote/Vote';
import Add from '../../view/content/EventManagement/Vote/Add';
import Edit from '../../view/content/EventManagement/Vote/Edit';
import Detail from '../../view/content/EventManagement/Vote/Detail';
import Topic from '../../view/content/EventManagement/Vote/Topic/List';
import TopicAdd from '../../view/content/EventManagement/Vote/Topic/Add';
//参与  浏览  点赞  评论详情页
import JoinList from '../../view/content/EventManagement/StatisticalList/JoinList';
import ViewList from '../../view/content/EventManagement/StatisticalList/ViewList';
import LikesList from '../../view/content/EventManagement/StatisticalList/LikesList';
import CommentList from '../../view/content/EventManagement/StatisticalList/CommentList';
const VoteMatch = 'Vote';
const Vote = _ => (
  <Switch>
   <Route
      exact
      path={`${_.match}/${VoteMatch}/List`}
      component={List}
    />
    <Route exact path={`${_.match}/${VoteMatch}/Add`} component={Add} />
    <Route exact path={`${_.match}/${VoteMatch}/Edit`} component={Edit} />
    <Route exact path={`${_.match}/${VoteMatch}/Detail`} component={Detail} />
    <Route exact path={`${_.match}/${VoteMatch}/TopicList`} component={Topic} />
    <Route exact path={`${_.match}/${VoteMatch}/TopicAdd`} component={TopicAdd} />
    <Route exact path={`${_.match}/${VoteMatch}/TopicEdit`} component={TopicAdd} />
    <Route exact path={`${_.match}/${VoteMatch}/JoinList`} component={JoinList} />
    <Route exact path={`${_.match}/${VoteMatch}/ViewList`} component={ViewList} />
    <Route exact path={`${_.match}/${VoteMatch}/LikesList`} component={LikesList} />
    <Route exact path={`${_.match}/${VoteMatch}/CommentList`} component={CommentList} />
  </Switch>
);
export default Vote;
