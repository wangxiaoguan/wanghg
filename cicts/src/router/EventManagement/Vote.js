import React from 'react';
import { Route, Switch } from 'react-router-dom';
import List from '../../view/content/EventManagement/Vote/Vote';
import Add from '../../view/content/EventManagement/Vote/Add';
import Edit from '../../view/content/EventManagement/Vote/Edit';
import Detail from '../../view/content/EventManagement/Vote/detail';
import VoteInfo from '../../view/content/EventManagement/Vote/VoteInfo';
import StatisticalResults from '../../view/content/EventManagement/Vote/StatisticalResults';

import Topic from '../../view/content/EventManagement/Vote/Topic/List';
import TopicAdd from '../../view/content/EventManagement/Vote/Topic/Add';
import TopicMangement from '../../view/content/EventManagement/Vote/Topic/TopicMangement';//投票题目管理
import TopicMangementAdd from '../../view/content/EventManagement/Vote/Topic/TopicMangementAdd';//投票题目管理新建

//参与  浏览  点赞  评论详情页
import JoinList from '../../view/content/EventManagement/StatisticalList/JoinList';
import ViewList from '../../view/content/EventManagement/StatisticalList/ViewList';
import LikesList from '../../view/content/EventManagement/StatisticalList/LikesList';
import CommentList from '../../view/content/EventManagement/StatisticalList/CommentList';
import CommentDetail from  '../../view/content/EventManagement/StatisticalList/CommentDetail';
const VoteMatch = 'Vote';
const Vote = _ => (
  <Switch>
    { _.p('20002.22007.000')(<Route
      exact
      path={`${_.match}/${VoteMatch}/List`}
      component={List}
    />)}
    <Route exact path={`${_.match}/${VoteMatch}/Add`} component={Add} />
    <Route exact path={`${_.match}/${VoteMatch}/Edit`} component={Edit} />
    <Route exact path={`${_.match}/${VoteMatch}/Detail`} component={Detail} />
    <Route exact path={`${_.match}/${VoteMatch}/StatisticalResults`} component={StatisticalResults} />

    <Route exact path={`${_.match}/${VoteMatch}/VoteInfo`} component={VoteInfo} />
    <Route exact path={`${_.match}/${VoteMatch}/TopicList`} component={Topic} />
    <Route exact path={`${_.match}/${VoteMatch}/TopicAdd`} component={TopicAdd} />
    {/* <Route exact path={`${_.match}/${VoteMatch}/TopicEdit`} component={TopicAdd} /> */}
    <Route exact path={`${_.match}/${VoteMatch}/TopicEdit`} component={TopicMangementAdd} />
    <Route exact path={`${_.match}/${VoteMatch}/TopicMangement`} component={TopicMangement} />
    <Route exact path={`${_.match}/${VoteMatch}/TopicMangementAdd`} component={TopicMangementAdd} />
    <Route exact path={`${_.match}/${VoteMatch}/TopicMangementEdit`} component={TopicMangementAdd} />
    <Route exact path={`${_.match}/${VoteMatch}/JoinList`} component={JoinList} />
    <Route exact path={`${_.match}/${VoteMatch}/ViewList`} component={ViewList} />
    <Route exact path={`${_.match}/${VoteMatch}/LikesList`} component={LikesList} />
    <Route exact path={`${_.match}/${VoteMatch}/CommentList`} component={CommentList} />
    <Route exact path={`${_.match}/${VoteMatch}/CommentDetail`} component={CommentDetail} />
  </Switch>
);
export default Vote;
