import React from 'react';
import { Route, Switch } from 'react-router-dom';
import List from '../../view/content/EventManagement/Questionnaire/Questionnaire';
import Add from '../../view/content/EventManagement/Questionnaire/Add';
import Edit from '../../view/content/EventManagement/Questionnaire/Edit';
import Detail from '../../view/content/EventManagement/Questionnaire/detail';
import QuestionnaireInfo from '../../view/content/EventManagement/Questionnaire/QuestionnaireInfo';

import Topic from '../../view/content/EventManagement/Questionnaire/Topic/List';
import TopicAdd from '../../view/content/EventManagement/Questionnaire/Topic/Add';
import ManagementList from '../../view/content/EventManagement/Questionnaire/Topic/ManagementList';
import ManagementAdd from '../../view/content/EventManagement/Questionnaire/Topic/ManagementAdd';
import StatisticalResults from '../../view/content/EventManagement/Questionnaire/StatisticalResults';

//参与  浏览 点赞  评论 
import JoinList from '../../view/content/EventManagement/StatisticalList/JoinList';
import ViewList from '../../view/content/EventManagement/StatisticalList/ViewList';
import LikesList from '../../view/content/EventManagement/StatisticalList/LikesList';
import CommentList from '../../view/content/EventManagement/StatisticalList/CommentList';
import CommentDetail from  '../../view/content/EventManagement/StatisticalList/CommentDetail';
const QuestionnaireMatch = 'Questionnaire';
const Questionnaire = _ => (
  <Switch>
     {_.p('20002.22005.000')(<Route
      exact
      path={`${_.match}/${QuestionnaireMatch}/List`}
      component={List}
    />)}
    <Route exact path={`${_.match}/${QuestionnaireMatch}/Add`} component={Add} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/Edit`} component={Edit} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/StatisticalResults`} component={StatisticalResults} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/Detail`} component={Detail} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/QuestionnaireInfo`} component={QuestionnaireInfo} />

    <Route exact path={`${_.match}/${QuestionnaireMatch}/TopicList`} component={Topic} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/TopicAdd`} component={TopicAdd} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/TopicManagement`} component={ManagementList} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/TopicManagementAdd`} component={ManagementAdd} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/TopicManagementEdit`} component={ManagementAdd} />

   

    <Route exact path={`${_.match}/${QuestionnaireMatch}/TopicEdit`} component={TopicAdd} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/JoinList`} component={JoinList} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/ViewList`} component={ViewList} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/LikesList`} component={LikesList} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/CommentList`} component={CommentList} />
    <Route exact path={`${_.match}/${QuestionnaireMatch}/CommentDetail`} component={CommentDetail} />
  </Switch>
);
export default Questionnaire;
