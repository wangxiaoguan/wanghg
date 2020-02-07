import React from 'react';
import { Route } from 'react-router-dom';
import Apply from './Apply';
import Examination from './Examination';
import Order from './Order';
import Task from './Task';
import Questionnaire from './Questionnaire';
import Vote from './Vote';
import StatisticalList from './StatisticalList';
const match = '/EventManagement';
const EventManagement = (props) => {
	return(
  <div>
    <Apply match={match} {...props}/>
    <Examination match={match} {...props}/>
    <Order match={match} {...props}/>
    <Task match={match} {...props}/>
    <Questionnaire match={match} {...props}/>
    <StatisticalList match={match} {...props}/>
    <Vote match={match} {...props}/>
  </div>
	)
  
};
export default EventManagement;