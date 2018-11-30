import React from 'react';
import { Route } from 'react-router-dom';
import Article from '../../view/content/InformationManagement/AriticleManagement/Article';
import SpecialNews from '../../view/content/InformationManagement/AriticleManagement/SpecialNews';
import NewsActivityList from '../../view/content/InformationManagement/AriticleManagement/NewsActivityList';
import NewArticle from '../../view/content/InformationManagement/AriticleManagement/NewArticle';
import EditArticle from '../../view/content/InformationManagement/AriticleManagement/EditArticle';
import DetailArticle from '../../view/content/InformationManagement/AriticleManagement/DetailArticle';
// import Comments from '../../view/content/InformationManagement/Comments';
// 文章管理评论数
import Comments from '../../view/content/EventManagement/StatisticalList/CommentList';
import Commentv from '../../view/content/EventManagement/StatisticalList/CommentList';
import CommentDetail  from '../../view/content/EventManagement/StatisticalList/CommentDetail';
import PageView from '../../view/content/InformationManagement/PageView';
import MagazineSwitch1 from '../../view/content/InformationManagement/MagazineManagement/SwitchOne';
import MagazineAdd from '../../view/content/InformationManagement/MagazineManagement/MagazineAdd';
import MagazineEdit from '../../view/content/InformationManagement/MagazineManagement/MagazineEdit';
//import MagazineSwitch2 from '../../view/content/InformationManagement/MagazineManagement/SwitchTwo';
//import MagazineSwitch3 from '../../view/content/InformationManagement/MagazineManagement/SwitchThree';
import Magazine from '../../view/content/InformationManagement/MagazineManagement/Magazine';
import Content from '../../view/content/InformationManagement/MagazineManagement/Content';
import MagazineArticle from '../../view/content/InformationManagement/MagazineManagement/Article';
import Video from '../../view/content/InformationManagement/VideoManagement/Video';
import NewVideo from  '../../view/content/InformationManagement/VideoManagement/NewVideo';
import EditVideo from  '../../view/content/InformationManagement/VideoManagement/EditVideo';
import DetailVideo from  '../../view/content/InformationManagement/VideoManagement/DetailVideo';
// 新增video
import PageViewv from '../../view/content/InformationManagement/PageView';
//普通专题管理
import General from '../../view/content/InformationManagement/ProjectManagment/General/List';

//部门专题管理
import Department from '../../view/content/InformationManagement/ProjectManagment/Department/List';

const pre='/InformationManagement';
const InformationManagement=(props)=>{
  return(
  <div>
    {<Route exact path={`${pre}/Article`} component={Article}/>}
    <Route  exact path={`${pre}/Article/add`} component={NewArticle}/>
    <Route exact path={`${pre}/Article/EditArticle`} component={EditArticle}/>
    <Route exact path={`${pre}/Article/DetailArticle`} component={DetailArticle}/>
    <Route  exact path={`${pre}/Article/SpecialNews`} component={SpecialNews}/>
    <Route  exact path={`${pre}/Article/NewsActivityList`} component={NewsActivityList}/>

    {<Route exact path={`${pre}/Video`} component={Video}/>}
    <Route exact path={`${pre}/Video/NewVideo`} component={NewVideo}/>
    <Route exact path={`${pre}/Video/EditVideo`} component={EditVideo}/>
    <Route exact path={`${pre}/Video/DetailVideo`} component={DetailVideo}/>

    <Route path={`${pre}/Article/Comments`} component={Comments}/>
    <Route path={`${pre}/Video/Comments`} component={Commentv}/>
    <Route path={`${pre}/Article/PageView`} component={PageView}/>
    <Route path={`${pre}/Video/PageView`} component={PageViewv}/>
    <Route path={`${pre}/Article/CommentDetail`} component={CommentDetail}/>
    <Route path={`${pre}/Video/CommentDetail`} component={CommentDetail}/>

    
    {<Route exact path={`${pre}/Magazine`} component={MagazineSwitch1}/>}
    <Route exact path={`${pre}/Magazine/Add`} component={MagazineAdd}/>
    <Route exact path={`${pre}/Magazine/Edit`} component={MagazineEdit} />
    {/*<Route path={`${pre}/Magazine/List`} component={Magazine}/>*/}
    {/*<Route path={`${pre}/Magazine/Content`} component={MagazineSwitch2}/>
    <Route path={`${pre}/Magazine/Article`} component={MagazineSwitch3}/>*/}

    {/* 普通专题管理 */}
    {/* {_.p('20002.22002.000')(<Route exact path={`${_.match}/${ExaminationMatch}/List`} component={List} />)}
    {_.p('20002.22002.000')(<Route exact path={`${_.match}/${ExaminationMatch}/Bank`} component={Bank} />)} */}
    <Route exact path={`${pre}/project/list`} component={General} />
    <Route exact path={`${pre}/project/Bank`} component={Department} />

  </div>
  )
  
};
export default InformationManagement;
