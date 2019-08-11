
import { Route } from 'react-router-dom';
import React from 'react';

import NoticeManagement from '../../view/content/Message/NoticeManagement';
import AddMessageNotice from '../../view/content/Message/AddMessageNotice';
import IdeaManagement from '../../view/content/Message/IdeaManagement';
import InformManagement from '../../view/content/Message/InformManagement';

const match = '/Message';
const Message = (props) => {
  return (
    <div>
      <Route exact path={`${match}/Notice`} component={NoticeManagement} />
      <Route exact path={`${match}/Notice/Edit`} component={AddMessageNotice} />
      <Route exact path={`${match}/Idea`} component={IdeaManagement} />
      <Route exact path={`${match}/Inform`} component={InformManagement} />
    </div>
  );
};

export default Message;