import React from 'react';
import { Route } from 'react-router-dom';

import HomeLayout from './HomeLayout';
const match = '/InterfaceManagement';
import PopularWords from '../../view/content/SystemSettings/PopularWords/PopularWords';
import ColumnManagement from '../../view/content/SystemSettings/ColumnManagement/Column';
const InterfaceManagement=(props)=>{
    return(
        <div>
             <HomeLayout match={match} {...props}/>
             {props.p('20003.21405.000')(<Route path={`${match}/ColumnManagement`} component={ColumnManagement} />)}
             {props.p('20003.21406.000')(<Route path={`${match}/PopularWords`} component={PopularWords} />)}
        </div>
    );
};
export default InterfaceManagement;