import React from 'react';
import { Route, Switch } from 'react-router-dom';

import List from '../../view/content/EventManagement/Examination/List/List';
import Bank from '../../view/content/EventManagement/Examination/Bank/Bank';
import Add from '../../view/content/EventManagement/Examination/List/Add';
import Edit from '../../view/content/EventManagement/Examination/List/Edit';
import Detail from '../../view/content/EventManagement/Examination/List/Detail';
import QuestionsSettings from '../../view/content/EventManagement/Examination/List/QuestionsSettings';
import QuestionsManagement from '../../view/content/EventManagement/Examination/Bank/Question/QuestionManagement';
import QuestionsConfiguration from '../../view/content/EventManagement/Examination/Bank/Question/QuestionConfiguration';
import AddCustomQuestion from '../../view/content/EventManagement/Examination/List/AddCutomQuestion';
import Score from '../../view/content/EventManagement/Examination/List/Score';

//参与  浏览  点赞  评论详情页
import JoinList from '../../view/content/EventManagement/StatisticalList/JoinList';
import ViewList from '../../view/content/EventManagement/StatisticalList/ViewList';
import LikesList from '../../view/content/EventManagement/StatisticalList/LikesList';
import CommentList from '../../view/content/EventManagement/StatisticalList/CommentList';
const ExaminationMatch = 'Examination';
const Examination = _ => (
  <Switch>
    <Route exact path={`${_.match}/${ExaminationMatch}/List`} component={List} />
    <Route exact path={`${_.match}/${ExaminationMatch}/Bank`} component={Bank} />
    <Route exact path={`${_.match}/${ExaminationMatch}/Add`} component={Add} />
    <Route exact path={`${_.match}/${ExaminationMatch}/Edit`} component={Edit} />
    <Route exact path={`${_.match}/${ExaminationMatch}/Detail`} component={Detail} />
    <Route exact path={`${_.match}/${ExaminationMatch}/QuestionsSettings`} component={QuestionsSettings} />
    <Route exact path={`${_.match}/${ExaminationMatch}/QuestionsManagement`} component={QuestionsManagement} />
    <Route exact path={`${_.match}/${ExaminationMatch}/AddQuestionsConfiguration`} component={QuestionsConfiguration} />
    <Route exact path={`${_.match}/${ExaminationMatch}/EditQuestionsConfiguration`} component={QuestionsConfiguration} />
    <Route exact path={`${_.match}/${ExaminationMatch}/AddCustomQuestion`} component={AddCustomQuestion} />
    <Route exact path={`${_.match}/${ExaminationMatch}/EditCustomQuestion`} component={AddCustomQuestion} />
    <Route exact path={`${_.match}/${ExaminationMatch}/Score`} component={Score} />

    <Route exact path={`${_.match}/${ExaminationMatch}/JoinList`} component={JoinList} />
    <Route exact path={`${_.match}/${ExaminationMatch}/ViewList`} component={ViewList} />
    <Route exact path={`${_.match}/${ExaminationMatch}/LikesList`} component={LikesList} />
    <Route exact path={`${_.match}/${ExaminationMatch}/CommentList`} component={CommentList} />
  </Switch>
);
export default Examination;