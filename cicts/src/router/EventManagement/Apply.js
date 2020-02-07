import React from 'react';
import { Route, Switch } from 'react-router-dom';

import List from '../../view/content/EventManagement/Apply/List/List';
import Add from '../../view/content/EventManagement/Apply/List/Add';
import Edit from '../../view/content/EventManagement/Apply/List/Edit';
import Detail from '../../view/content/EventManagement/Apply/List/detail';
import ApplyFields from '../../view/content/EventManagement/Apply/List/ApplyFieldSettings';
import ApplyInfo from '../../view/content/EventManagement/Apply/List/ApplyInfo';
import Field from '../../view/content/EventManagement/Apply/Field/Field';
import FieldAdd from '../../view/content/EventManagement/Apply/Field/Add';

//参与  浏览  点赞  评论详情页
import JoinList from '../../view/content/EventManagement/StatisticalList/JoinList';
import ViewList from '../../view/content/EventManagement/StatisticalList/ViewList';
import LikesList from '../../view/content/EventManagement/StatisticalList/LikesList';
import CommentList from '../../view/content/EventManagement/StatisticalList/CommentList';
import CommentDetail from  '../../view/content/EventManagement/StatisticalList/CommentDetail';
const ApplyMatch = 'Apply';
const Apply = _ => {
	return(
  <Switch>
    { _.p('20002.22001.000')(<Route exact path={`${_.match}/${ApplyMatch}/List`} component={List} />)}
    <Route exact path={`${_.match}/${ApplyMatch}/Add`} component={Add} />
    <Route exact path={`${_.match}/${ApplyMatch}/Edit`} component={Edit} />
    <Route exact path={`${_.match}/${ApplyMatch}/Detail`} component={Detail} />
    <Route exact path={`${_.match}/${ApplyMatch}/ApplyFields`} component={ApplyFields} />
    <Route exact path={`${_.match}/${ApplyMatch}/ApplyInfo`} component={ApplyInfo} />
    <Route exact path={`${_.match}/${ApplyMatch}/Field`}component={Field}/>
    <Route exact path={`${_.match}/${ApplyMatch}/FieldAdd`}component={FieldAdd}/>
    <Route exact path={`${_.match}/${ApplyMatch}/FieldEdit`}component={FieldAdd}/>

    <Route exact path={`${_.match}/${ApplyMatch}/JoinList`} component={JoinList} />
    <Route exact path={`${_.match}/${ApplyMatch}/ViewList`} component={ViewList} />
    <Route exact path={`${_.match}/${ApplyMatch}/LikesList`} component={LikesList} />
    <Route exact path={`${_.match}/${ApplyMatch}/CommentList`} component={CommentList} />
    <Route exact path={`${_.match}/${ApplyMatch}/CommentDetail`} component={CommentDetail} />
  </Switch>
	);
  
};
export default Apply;
