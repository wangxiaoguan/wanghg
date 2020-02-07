import React from 'react';
import { Route,Switch } from 'react-router-dom';
import Article from '../../view/content/InformationManagement/AriticleManagement/Article';


const match = '/SystemSettings';
import versionManagement from '../../view/content/PlatformAdministrator/versionManagement';
import AddVersionManagement from '../../view/content/PlatformAdministrator/AddVersionManagement';
import Company from '../../view/content/PlatformAdministrator/company';
const PlatformAdministrator = (props) => {
	return (
  <div>
    {props.p('20006.21408.000')(<Route path={`${match}/versionManagement`} component={versionManagement} />)}
    <Route path={`${match}/AddVersionManagement`} component={AddVersionManagement} />
    <Route path={`${match}/EditVersionManagement`} component={AddVersionManagement} />
    <Route path={`${match}/DetailVersionManagement`} component={AddVersionManagement} />
    {props.p('20001.21012.000')(<Route path={`${match}/company`} component={Company} />)}
  </div>
	);
};
export default PlatformAdministrator;