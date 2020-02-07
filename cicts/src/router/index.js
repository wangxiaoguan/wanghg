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
import TradeManager from './TradeManager';
import PartyBuildGarden from './PartyBuildGarden';
import PointManagement from './PointManagement';
import Message from './Message';
import PartyFeePay from './PartyBuildReport/PartyAffairsInform/PartyFeePay';
import PartyMemberActivityRate from './PartyBuildReport/PartyAffairsInform/PartyMemberActivityRate';
import PartyBuildReport from './PartyBuildReport';
import PalmarPartySchool from './PartyBuildReport/PalmarPartySchool';
import ImportantWorkDeploy from './PartyBuildReport/ImportantWorkDeploy';
import OperativeReport from './OperativeReport'; //运营报表统计路由
import InterfaceManagement from './InterfaceManagement';//界面管理
import EnterpriseConfig from './EnterpriseConfig';//企业配置
// import PartyOrganizationInfo from './PartyBuildReport/OrganizationInfo'
import PersonalWork from './PersonalWork';//个人工作
import Service from './Service';

import MerchantRouters from './merchantRouter'
const confirm = Modal.confirm;
const filter = (powers, power) => component => (!powers || powers[power]) ? component : null;
// const getConfirmation = 
// const ConFirmComponent = () => {
//   return (
//     <Modal closable maskClosable visible={true} footer={null} onCancel={() => ReactDOM.unmountComponentAtNode(document.getElementById('EventAddModal'))}>
//       <h3 style={{textAlign:'center'}}>离开页面提醒</h3>
//       <p>{message}</p>
//       <div style={{display:'flex','justifyContent': 'center'}}>
//         <Button onClick={() => { callback(true); ReactDOM.unmountComponentAtNode(document.getElementById('EventAddModal'));}} style={{margin:'0 5px'}}>确定</Button>
//         <Button onClick={() => { callback(false); ReactDOM.unmountComponentAtNode(document.getElementById('EventAddModal'));}}>取消</Button>
//       </div>
//     </Modal>
//   );};
// ReactDOM.render(<ConFirmComponent />, document.getElementById('EventAddModal'));
// };
export default connect(
  state => ({
    powers: state.powers,
  }),
  dispatch => ({
    setIsSubmit: n => dispatch(setIsSubmit(n)),
  })
)(props => {
  const p = filter.bind(null, props.powers);
  //console.log("qwer",powers);

  window.addEventListener('hashchange', () => {
     localStorage.setItem('selectedRowKeys',''); 
  });

  return (
    //getUserConfirmation提示是否进行路由跳转
    <HashRouter basename="" getUserConfirmation={(message, callback) => {
      return confirm({
        title: '离开提醒',
        content: message,
        onOk: async () => {
          await props.setIsSubmit('ok');
          await callback(true);
        },
        onCancel: async () => {
          await props.setIsSubmit('cancel');
          await callback(true);
        },
      });
    }}>
    {/* 只能在Switch内使用redirct，且switch只能匹配一个路由      */}
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
              <TradeManager {...props} p={p} />
              <PartyBuildGarden {...props} p={p} />
              <PointManagement {...props} p={p} />
              <Message  {...props} p={p} />
              <PalmarPartySchool  {...props} p={p} />
              <ImportantWorkDeploy  {...props} p={p} />
              {/* <PartyOrganizationInfo  {...props} p={p} /> */}
              <PersonalWork  {...props} p={p} />
              <Service  {...props} p={p} />
              <PartyBuildReport  {...props} p={p} />
              <PartyFeePay {...props} p={p}/>
              <PartyMemberActivityRate {...props} p={p} />
              <OperativeReport {...props} p={p} />
              <InterfaceManagement {...props} p={p} />
              <EnterpriseConfig {...props} p={p} />
              <MerchantRouters {...props} p={p} />
            </div>
          </Base>
        </Route>
        {/* <Route component={NoMatch} /> 如果匹配不到则会跳转的这个组件中来 */}
      </Switch>
    </HashRouter>
  );
});
