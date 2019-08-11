import React from 'react';

import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal } from 'antd';

import { setIsSubmit } from '../redux-root/action/eventAndInfoData/eventAndInfoData';
import Base from './base.js';
import Login from '../view/login.js';

import SystemSettings from './SystemSettings';
import InformationManagement from './InformationManagement';
import EventManagement from './EventManagement';
import PlatformAdministrator from './PlatformAdministrator';
import PartyBuildGarden from './PartyBuildGarden';
import PointManagement from './PointManagement';
import Message from './Message';
import PartyFeePay from './PartyBuildReport/PartyAffairsInform/PartyFeePay';
import PersonalWork from './PersonalWork';//个人工作
const confirm = Modal.confirm;
const filter =powers => component => !powers? component : null;

export default connect(
  state => ({
    powers: state.powers,
  }),
  dispatch => ({
    setIsSubmit: n => dispatch(setIsSubmit(n)),
  })
)(props => {
  const p = filter.bind(null, props.powers);
  return (
    <HashRouter basename="">
      <Switch>
        <Route path="/login" component={Login} />
        <Redirect from="/" to="/login" exact />
        <Route>
          <Base {...props}>
            <div>
              <SystemSettings {...props} p={p} />
              <InformationManagement {...props} p={p} />
              <EventManagement {...props} p={p} />
              <PlatformAdministrator {...props} p={p} />
              <PartyBuildGarden {...props} p={p} />
              <PointManagement {...props} p={p} />
              <Message  {...props} p={p} />
              <PersonalWork  {...props} p={p} />
              <PartyFeePay {...props} p={p}/>
            </div>
          </Base>
        </Route>
      </Switch>
    </HashRouter>
  );
});
