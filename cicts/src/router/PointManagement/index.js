import React from 'react';
import { Route,Switch } from 'react-router-dom';

import UserPoint from '../../view/content/PointManagement/UserPoint/UserPoint';
import PointInfo from '../../view/content/PointManagement/UserPoint/PointInfo';
import TreasureInfo from '../../view/content/PointManagement/UserPoint/TreasureInfo';
import PartyMemHonorInfo from '../../view/content/PointManagement/UserPoint/PartyMemHonorInfo';
import BirthdayTicketInfo from '../../view/content/PointManagement/UserPoint/BirthdayTicketInfo';
import CinemaTicketInfo from '../../view/content/PointManagement/UserPoint/CinemaTicketInfo';
import FestivitiesMaterialInfo from '../../view/content/PointManagement/UserPoint/FestivitiesMaterialInfo';

import SpecialPoint from '../../view/content/PointManagement/SpecialPoint/SpecialPoint';
import CategoryManagement from '../../view/content/PointManagement/SpecialPoint/CategoryManagement';
import AddTask from '../../view/content/PointManagement/SpecialPoint/AddTask/AddTask';
import EditTask from '../../view/content/PointManagement/SpecialPoint/EditTask/EditTask';

import RechargePoint from '../../view/content/PointManagement/RechargePoint/RechargePoint';
import RechargeRecord from '../../view/content/PointManagement/RechargeRecord/RechargeRecord';

//平台积分明细xwx2018/12/26
import PartyMemberChange from '../../view/content/PointManagement/PlatformPoint/PartyMemberChange';
import BirthdayCouponChange from '../../view/content/PointManagement/PlatformPoint/BirthdayCouponChange';
import MoviePiaoChange from '../../view/content/PointManagement/PlatformPoint/MoviePiaoChange';
import FestivalMaterialsChange from '../../view/content/PointManagement/PlatformPoint/FestivalMaterialsChange';
import CurrencyIntegralChange from '../../view/content/PointManagement/PlatformPoint/CurrencyIntegralChange';

//对账导出xwx2018/12/26
import ReconciliationExport from '../../view/content/PointManagement/ReconciliationExport/ReconciliationExport';

//积分规则管理
import PointRule from '../../view/content/PointManagement/PointRule/PointRule';

const match = '/PointManagement';
const PointManagement = (props) => {
  return (
    <div>
      <Route path={`${match}/UserPoint`} component={UserPoint} />
      <Route path={`${match}/PointInfo`} component={PointInfo} />
      <Route path={`${match}/TreasureInfo`} component={TreasureInfo} />
      <Route path={`${match}/PartyMemHonorInfo`} component={PartyMemHonorInfo} />
      <Route path={`${match}/BirthdayTicketInfo`} component={BirthdayTicketInfo} />
      <Route path={`${match}/CinemaTicketInfo`} component={CinemaTicketInfo} />
      <Route path={`${match}/FestivitiesMaterialInfo`} component={FestivitiesMaterialInfo} />

      <Route exact path={`${match}/SpecialPoint`} component={SpecialPoint} />
      <Route exact path={`${match}/CategoryManagement`} component={CategoryManagement} />
      <Route exact path={`${match}/SpecialPoint/AddTask`} component={AddTask} />
      <Route exact path={`${match}/SpecialPoint/EditTask`} component={EditTask} />

      <Route path={`${match}/RechargePoint`} component={RechargePoint} />

      <Route path={`${match}/RechargeRecord`} component={RechargeRecord} />

      {/*平台积分明细xwx2018/12/26*/}
      <Route path={`${match}/PlatformPoint/PartyMemberChange`} component={PartyMemberChange} />
      <Route path={`${match}/PlatformPoint/BirthdayCouponChange`} component={BirthdayCouponChange} />
      <Route path={`${match}/PlatformPoint/MoviePiaoChange`} component={MoviePiaoChange} />
      <Route path={`${match}/PlatformPoint/FestivalMaterialsChange`} component={FestivalMaterialsChange} />
      <Route path={`${match}/PlatformPoint/CurrencyIntegralChange`} component={CurrencyIntegralChange} />
      {/*对账导出xwx2018/12/26*/}
      <Route path={`${match}/ReconciliationExport`} component={ReconciliationExport} />
      {/*积分规则管理*/}
      <Route path={`${match}/PointRule`} component={PointRule} />
    </div>
  );
};
export default PointManagement;