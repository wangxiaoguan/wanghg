import React from 'react';
import { Route } from 'react-router-dom';
import Article from '../../view/content/InformationManagement/AriticleManagement/Article';
import NewArticle from '../../view/content/InformationManagement/AriticleManagement/NewArticle';
import EditArticle from '../../view/content/InformationManagement/AriticleManagement/EditArticle';
import DetailArticle from '../../view/content/InformationManagement/AriticleManagement/DetailArticle';


import PageView from '../../view/content/InformationManagement/PageView';
import PageVote from '../../view/content/InformationManagement/PageVote';
import PageComment from '../../view/content/InformationManagement/PageComment';
import PageDetail  from '../../view/content/InformationManagement/PageDetail';

import MagazineSwitch1 from '../../view/content/InformationManagement/MagazineManagement/SwitchOne';
import MagazineAdd from '../../view/content/InformationManagement/MagazineManagement/MagazineAdd';
import MagazineEdit from '../../view/content/InformationManagement/MagazineManagement/MagazineEdit';
import Magazines from '../../view/content/InformationManagement/MagazineManagement/Magazines/Magazines';
import MagazinesDetail from '../../view/content/InformationManagement/MagazineManagement/Magazines/detail';
import Video from '../../view/content/InformationManagement/VideoManagement/Video';
import NewVideo from  '../../view/content/InformationManagement/VideoManagement/NewVideo';
import EditVideo from  '../../view/content/InformationManagement/VideoManagement/EditVideo';
import DetailVideo from  '../../view/content/InformationManagement/VideoManagement/DetailVideo';

//普通专题管理
import General from '../../view/content/InformationManagement/ProjectManagment/General/List';

//部门专题管理
import Department from '../../view/content/InformationManagement/ProjectManagment/Department/List';
import TopicColumn from '../../view/content/InformationManagement/ProjectManagment/TopicColumn';
import Addproject from '../../view/content/InformationManagement/ProjectManagment/General/add';
import Editorproject from '../../view/content/InformationManagement/ProjectManagment/General/editor';
import ColumnContent from '../../view/content/InformationManagement/ProjectManagment/ColumnContent';
import addG from '../../view/content/InformationManagement/ProjectManagment/Department/add';

const pre='/InformationManagement';
const InformationManagement=(props)=>{
  return(
  <div>
    {props.p('20001.21601.000')(<Route exact path={`${pre}/Article`} component={Article}/>)}
    <Route  exact path={`${pre}/Article/add`} component={NewArticle}/>
    <Route exact path={`${pre}/Article/EditArticle`} component={EditArticle}/>
    <Route exact path={`${pre}/Article/DetailArticle`} component={DetailArticle}/>

    {props.p('20001.21602.000')(<Route exact path={`${pre}/Video`} component={Video}/>)}
    <Route exact path={`${pre}/Video/NewVideo`} component={NewVideo}/>
    <Route exact path={`${pre}/Video/EditVideo`} component={EditVideo}/>
    <Route exact path={`${pre}/Video/DetailVideo`} component={DetailVideo}/>

    {/* 文章管理——浏览，点赞，评论 */}
    <Route path={`${pre}/Article/PageView`} component={PageView}/>
    <Route path={`${pre}/Article/PageVote`} component={PageVote}/>
    <Route path={`${pre}/Article/PageComment`} component={PageComment}/>

    {/* 视频管理——浏览，评论 */}
    <Route path={`${pre}/Video/PageView`} component={PageView}/>
    <Route path={`${pre}/Video/PageComment`} component={PageComment}/>

    {/* 杂志文章——浏览，评论 */}
    <Route path={`${pre}/Magazine/PageComment`} component={PageComment}/>
    <Route path={`${pre}/Magazine/PageView`} component={PageView}/>

    {/* 普通专题——浏览，评论 */}
    <Route path={`${pre}/General/PageView`} component={PageView}/>
    <Route path={`${pre}/General/PageComment`} component={PageComment}/>

    {/* 部门专题——浏览，评论 */}
    <Route path={`${pre}/Project/PageView`} component={PageView}/>
    <Route path={`${pre}/Project/PageComment`} component={PageComment}/>

    {/* 资讯模块——评论详情 */}
    <Route path={`${pre}/Information/CommentDetail`} component={PageDetail} />

    {props.p('20001.21605.000')(<Route exact path={`${pre}/Magazine/List`} component={MagazineSwitch1}/>)}
    <Route exact path={`${pre}/Magazine/Add`} component={MagazineAdd}/>
    <Route exact path={`${pre}/Magazine/Edit`} component={MagazineEdit} />
    {props.p('20001.21606.000')(<Route exact path={`${pre}/Magazine/Magazines`} component={Magazines} />)}
    <Route path={`${pre}/Magazine/Magazines/detail`} component={MagazinesDetail} />

    {/* 普通专题管理 */}
    {props.p('20001.21608.000')(<Route exact path={`${pre}/project/List`} component={General} />)}
    {props.p('20001.21607.000')(<Route exact path={`${pre}/project/Bank`} component={Department} />)}
    <Route path={`${pre}/project/topic`} component={TopicColumn}/>
    <Route exact path={`${pre}/project/normalcontentmanagement`} component={ColumnContent} />


    <Route exact path={`${pre}/project/Add`} component={Addproject} />
    <Route exact path={`${pre}/project/Edit`} component={Editorproject} />
    {/* <Route exact path={`${pre}/project/normaltopic`} component={Normaltopic} /> */}
    <Route exact path={`${pre}/project/normaltopic`} component={TopicColumn} />
    <Route exact path={`${pre}/project/contentmanagement`} component={ColumnContent} />
    <Route exact path={`${pre}/project/addG`} component={addG} />
    <Route exact path={`${pre}/project/editor`} component={addG} />
    

  </div>
  );
  
};
export default InformationManagement;
