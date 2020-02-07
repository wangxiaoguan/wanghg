import React from 'react';
import { Route, Switch } from 'react-router-dom';
import List from '../../view/content/EventManagement/Questionnaire/Questionnaire';
import Add from '../../view/content/EventManagement/Questionnaire/Add';
import Edit from '../../view/content/EventManagement/Questionnaire/Edit';
import Detail from '../../view/content/EventManagement/Questionnaire/Detail';
import Topic from '../../view/content/EventManagement/Questionnaire/Topic/List';
import TopicAdd from '../../view/content/EventManagement/Questionnaire/Topic/Add';
//参与  浏览 点赞  评论 
import JoinList from '../../view/content/EventManagement/StatisticalList/JoinList';
import ViewList from '../../view/content/EventManagement/StatisticalList/ViewList';
import LikesList from '../../view/content/EventManagement/StatisticalList/LikesList';
import CommentList from '../../view/content/EventManagement/StatisticalList/CommentList';
const QuestionnaireMatch = 'Questionnaire';
const Questionnaire = _ => (
  <Switch>
     <Route
      exact
      path={`${_.match}/${QuestionnaireMatch}/List`}
      component={List}
    />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/Add`} component={Add} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/Edit`} component={Edit} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/Detail`} component={Detail} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/TopicList`} component={Topic} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/TopicAdd`} component={TopicAdd} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/TopicEdit`} component={TopicAdd} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/JoinList`} component={JoinList} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/ViewList`} component={ViewList} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/LikesList`} component={LikesList} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/CommentList`} component={CommentList} />
  </Switch>
);
export default Questionnaire;
