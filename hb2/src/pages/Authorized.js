import RenderAuthorized from '@/components/Authorized';
import {getAuthority} from '@/utils/authority';

import React from 'react';

import Redirect from 'umi/redirect';

const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);

export default ({children}) => (
  <Authorized authority={children.props.route.authority}>
    {children}
  </Authorized>
);
