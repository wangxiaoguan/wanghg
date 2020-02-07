import React from 'react';
import { Route, Switch } from 'react-router-dom';

import List from '../../view/content/EventManagement/Examination/List/List';
import Bank from '../../view/content/EventManagement/Examination/Bank/Bank';
import Add from '../../view/content/EventManagement/Examination/List/Add';
import Edit from '../../view/content/EventManagement/Examination/List/Edit';
import Detail from '../../view/content/EventManagement/Examination/List/detail';
import QuestionsSettings from '../../view/content/EventManagement/Examination/List/QuestionsSettings';
import QuestionsManagement from '../../view/content/EventManagement/Examination/Bank/Question/QuestionManagement';
import QuestionsConfiguration from '../../view/content/EventManagement/Examination/Bank/Question/QuestionConfiguration';
import AddCustomQuestion from '../../view/content/EventManagement/Examination/List/AddCutomQuestion';
import Score from '../../view/content/EventManagement/Examination/List/Score';
import StatisticalResults from '../../view/content/EventManagement/Examination/List/StatisticalResults';


import CustomTopic from '../../view/content/EventManagement/Examination/Bank/CustomTopic';
import AddCustomTopic from '../../view/content/EventManagement/Examination/Bank/AddCustomTopic';



//参与  浏览  点赞  评论详情页
import JoinList from '../../view/content/EventManagement/StatisticalList/JoinList';
import ViewList from '../../view/content/EventManagement/StatisticalList/ViewList';
import LikesList from '../../view/content/EventManagement/StatisticalList/LikesList';
import CommentList from '../../view/content/EventManagement/StatisticalList/CommentList';
import CommentDetail from  '../../view/content/EventManagement/StatisticalList/CommentDetail';
const ExaminationMatch = 'Examination';
const Examination = _ => (
  <Switch>
    { _.p('20002.22003.000')(<Route exact path={`${_.match}/${ExaminationMatch}/List`} component={List} />)}
    {_.p('20002.22003.000')(<Route exact path={`${_.match}/${ExaminationMatch}/Bank`} component={Bank} />)}
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
    <Route exact path={`${_.match}/${ExaminationMatch}/StatisticalResults`} component={StatisticalResults} />
    <Route exact path={`${_.match}/${ExaminationMatch}/CustomQuestionsManagement`} component={CustomTopic} />
    <Route exact path={`${_.match}/${ExaminationMatch}/AddCustomQuestionsManagement`} component={AddCustomTopic} />
    <Route exact path={`${_.match}/${ExaminationMatch}/EditCustomQuestionsManagement`} component={AddCustomTopic} />


    <Route exact path={`${_.match}/${ExaminationMatch}/JoinList`} component={JoinList} />
    <Route exact path={`${_.match}/${ExaminationMatch}/ViewList`} component={ViewList} />
    <Route exact path={`${_.match}/${ExaminationMatch}/LikesList`} component={LikesList} />
    <Route exact path={`${_.match}/${ExaminationMatch}/CommentList`} component={CommentList} />
    <Route exact path={`${_.match}/${ExaminationMatch}/CommentDetail`} component={CommentDetail} />
  </Switch>
);
export default Examination;
