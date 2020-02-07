import React from 'react';
import { Route, Switch } from 'react-router-dom';


const match = '/TradeManager';
import Organization from '../../view/content/TradeManager/Organization';
import Member from '../../view/content/TradeManager/Member';
import Suggestions from '../../view/content/TradeManager/Suggestions';

//学习管理
import LearnManagation from '../../view/content/TradeManager/LearnManagation/List';
import AddLearn from '../../view/content/TradeManager/LearnManagation/Add';
import EditLearn from '../../view/content/TradeManager/LearnManagation/Edit';
import DetailLearn from '../../view/content/TradeManager/LearnManagation/Detail';
import Notes from '../../view/content/TradeManager/LearnManagation/Note';

//主席信箱
import ChairmanComBox from '../../view/content/TradeManager/ChairmanBox/CommonBox';
import ChairmanRepBox from '../../view/content/TradeManager/ChairmanBox/ReportBox';

//困难帮扶
import DifficultyComBox from '../../view/content/TradeManager/DifficultyHelp/CommonBox';
import DifficultyRepBox from '../../view/content/TradeManager/DifficultyHelp/ReportBox';

//维权管理
import PowerComBox from '../../view/content/TradeManager/PowerManagation/CommonBox';
import PowerRepBox from '../../view/content/TradeManager/PowerManagation/ReportBox';

//论坛管理
import CardManagation from '../../view/content/TradeManager/ForumManagation/CardManagation';
import CommentManagation from '../../view/content/TradeManager/ForumManagation/CommentManagation';
import ThemeManagation from '../../view/content/TradeManager/ForumManagation/ThemeManagation';
import EditTheme from '../../view/content/TradeManager/ForumManagation/EditTheme';
//帖子管理和评论管理公用的详情页面
import ForumDetail from '../../view/content/TradeManager/ForumManagation/ForumDetail';
import CommentManageationDetail from '../../view/content/TradeManager/ForumManagation/CommentManageationDetail';

//主席信箱、困难帮扶、维权管理公用的信件详情页面
import BoxDetail from '../../view/content/TradeManager/BoxDetail';


//
const PlatformAdministrator = (props) => {
  return (
    <div>
      {props.p('20007.21704.000')(<Route path={`${match}/Organization`} component={Organization} />)}
      {props.p('20007.21705.000')(<Route path={`${match}/Member`} component={Member} />)}
      {props.p('20030.20031.000')(<Route path={`${match}/Suggestions`} component={Suggestions} />)}

      <Route exact path={`${match}/LearnManagation/List`} component={LearnManagation} />
      <Route exact path={`${match}/LearnManagation/Add`} component={AddLearn} />
      <Route exact path={`${match}/LearnManagation/Edit`} component={EditLearn} />
      <Route exact path={`${match}/LearnManagation/Detail`} component={DetailLearn} />
      <Route exact path={`${match}/LearnManagation/Note`} component={Notes} />

      <Route exact path={`${match}/ChairmanBox/CommonBox`} component={ChairmanComBox} />
      <Route exact path={`${match}/ChairmanBox/CommonBox/Detail`} component={BoxDetail} />
      <Route exact path={`${match}/ChairmanBox/ReportBox`} component={ChairmanRepBox} />
      <Route exact path={`${match}/ChairmanBox/ReportBox/Detail`} component={BoxDetail} />

      <Route exact path={`${match}/DifficultyHelp/CommonBox`} component={DifficultyComBox} />
      <Route exact path={`${match}/DifficultyHelp/CommonBox/Detail`} component={BoxDetail} />
      <Route exact path={`${match}/DifficultyHelp/ReportBox`} component={DifficultyRepBox} />
      <Route exact path={`${match}/DifficultyHelp/ReportBox/Detail`} component={BoxDetail} />

      <Route exact path={`${match}/PowerManagation/CommonBox`} component={PowerComBox} />
      <Route exact path={`${match}/PowerManagation/CommonBox/Detail`} component={BoxDetail} />
      <Route exact path={`${match}/PowerManagation/ReportBox`} component={PowerRepBox} />
      <Route exact path={`${match}/PowerManagation/ReportBox/Detail`} component={BoxDetail} />

      <Route exact path={`${match}/ForumManagation/CardManagation`} component={CardManagation} />
      <Route exact path={`${match}/ForumManagation/CardManagation/Detail`} component={ForumDetail} />
      <Route exact path={`${match}/ForumManagation/CommentManagation`} component={CommentManagation} />
      <Route exact path={`${match}/ForumManagation/CommentManagation/Detail`} component={ForumDetail} />
      <Route exact path={`${match}/ForumManagation/CommentManagation/SecondDetail`} component={CommentManageationDetail} />
      <Route exact path={`${match}/ForumManagation/ThemeManagation`} component={ThemeManagation} />
      <Route exact path={`${match}/ForumManagation/ThemeManagation/Add`} component={EditTheme} />
      <Route exact path={`${match}/ForumManagation/ThemeManagation/Edit`} component={EditTheme} />

    </div>
  );
};
export default PlatformAdministrator;