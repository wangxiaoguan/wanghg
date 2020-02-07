export const  pageJummps={

     //文章管理
     ArticleList:'services/web/news/article/newsList/get',                           //文章列表
     ArticlePush:'services/web/news/article/publish',                                //文章发布
     ArticleUpDown:'services/web/news/article/newsInfo/onlineState',                 //文章上线下线
     ArticleAdd:'services/web/news/article/add',                                     //文章新增
     ArticleEditOne:'services/web/news/article/update',                              //文章编辑【第一步】
     ArticleEditThree:'services/web/news/article/updateOther',                       //文章编辑【第三步】
     ArticleDelete:'services/web/news/article/delete',                               //文章删除
     ArticleExport:'services/web/news/article/export',                               //文章导出
     ArticleDetail:'services/web/news/article/newsInfo/get',                         //文章详情
     ArticleType:'services/web/lookup/init/newsType',                                //文章类型

     //视频管理
     VideoList:'services/web/news/vedio/vedioList/get',                              //视频列表
     VideoPush:'services/web/news/vedio/publish',                                    //视频发布
     VideoUpDown:'services/web/news/vedio/vedioInfo/onlineState',                    //视频上线下线
     VideoAdd:'services/web/news/vedio/add',                                         //视频新增
     VideoEditOne:'services/web/news/article/update',                                //视频编辑【第一步】
     VideoEditThree:'services/web/news/article/updateOther',                         //视频编辑【第三步】
     VideoDelete:'services/web/news/vedio/delete',                                   //视频删除
     VideoExport:'services/web/news/vedio/export?Q=newsType=3',                      //视频导出
     VideoDetail:'services/web/news/vedio/vedioInfo/get',                            //视频详情

     //杂志管理
     MagazineList:'services/web/news/magazine/getList',                              //杂志列表
     MagazinePush:'services/web/news/magazine/publishMagazine',                      //杂志发布
     MagazineAdd:'services/web/news/magazine/insert',                                //杂志新增
     MagazineEdit:'services/web/news/magazine/update',                               //杂志编辑
     MagazineDelete:'services/web/news/magazine/delete',                             //杂志删除
     MagazineSeries:'services/web/news/magazineSeries/getList/1/10',                 //杂志系列
     MagazineDetail:'services/web/news/magazine/getMagazineById',                    //杂志详情
     /**杂志目录**/
     CatalogueList:'services/web/news/magazine/catalogue/getCatalogueByMagazineId',  //杂志目录列表
     CatalogueAdd:'services/web/news/magazine/catalogue/add',                        //杂志目录新增
     CatalogueEdit:'services/web/news/magazine/catalogue/update',                    //杂志目录编辑
     CatalogueDelete:'services/web/news/magazine/catalogue/delete',                  //杂志目录删除
     /**杂志文章**/
     MagaArtList:'services/web/news/magazine/article/getArticleByCatalogueId',       //杂志文章列表
     MagaArtAdd:'services/web/news/magazine/article/insert',                         //杂志文章新增
     MagaArtEdit:'services/web/news/magazine/article/update',                        //杂志文章编辑
     MagaArtDetail:'services/web/news/magazine/article/getArticleById',              //杂志文章详情
     MagaArtDeleta:'services/web/news/magazine/article/delete',                      //杂志文章删除

     //杂志系列管理
     MagaSeriesList:'services/web/news/magazineSeries/getList',                      //杂志系列列表
     MagaSeriesAdd:'services/web/news/magazineSeries/add',                           //杂志系列新增
     MagaSeriesEdit:'services/web/news/magazineSeries/update',                       //杂志系列编辑
     MagaSeriesDelete:'services/web/news/magazineSeries/delete',                     //杂志系列删除

     //普通专题
     TopicCommonList:'services/web/news/special/normal/getList',                     //普通专题列表
     TopicCommonAdd:'services/web/news/special/normal/insert',                       //普通专题新增
     TopicCommonEdit:'services/web/news/special/normal/update',                      //普通专题编辑
     TopicCommonDetail:'services/web/news/special/normal/getSpecialById',            //普通专题详情
     TopicCommonDeleta:'services/web/news/special/normal/delete',                    //普通专题删除
     TopicCommonExport:'services/web/news/special/normal/export',                    //普通专题导出
     TopicCommonPush:'services/web/news/special/normal/publish',                     //普通专题发布
     TopicCommonUpDown:'services/web/news/special/normal/onlineState',               //普通专题上线下线
     /**专题栏目管理**/
     TopicColumnList:'services/web/news/special/category/getList',                   //专题栏目列表
     TopicColumnAdd:'services/web/news/special/category/insert',                     //专题栏目新增
     TopicColumnEdit:'services/web/news/special/category/update',                    //专题栏目编辑
     TopicColumnDelete:'services/web/news/special/category/delete',                  //专题栏目删除
     /**专题栏目内容管理**/
     TopicContentList:'services/web/news/special/rel/getList',                        //专题栏目内容列表
     TopicContentAdd:'services/web/news/special/rel/insert',                         //专题栏目内容新增
     TopicContentDeleta:'services/web/news/special/rel/delete',                       //专题栏目内容删除
     TopicContentSort:'services/web/news/special/rel/update',                         //专题栏目内容排序
     TopicContentAddArt:'services/web/news/special/rel/getArticList',                 //专题栏目内容文章
     TopicContentAddVideo:'services/web/news/special/rel/getVideoList',               //专题栏目内容视频
     TopicContentAddAct:'services/web/news/special/rel/getActivityList',              //专题栏目内容活动

     //部门专题
     DepartmentList:'services/web/news/special/department/getList',                       //部门专题列表
     DepartmentAdd:'services/web/news/special/department/insert',                    //部门专题新增
     DepartmentEdit:'services/web/news/special/department/update',                   //部门专题编辑
     DepartmentDelete:'services/web/news/special/department/delete',                 //部门专题删除
     DepartmentUse:'services/web/news/special/normal/onlineState',                   //部门专题启用

    
     articleView:'/InformationManagement/Article/PageView',
     articleVote:'/InformationManagement/Article/PageVote',
     articleComment:'/InformationManagement/Article/PageComment',
     videoView:'/InformationManagement/Video/PageView',
     videoComment:'/InformationManagement/Video/PageComment',
     magazineView:'/InformationManagement/Magazine/PageView',
     magazineComment:'/InformationManagement/Magazine/PageComment',
     
     article:'/InformationManagement/Article',
     newArticle:'/InformationManagement/Article/add',
     editArticle:'/InformationManagement/Article/EditArticle',
     detailAriticle:'/InformationManagement/Article/DetailArticle',
     newsSpecial:'/InformationManagement/Article/SpecialNews',
     newsActivityList:'/InformationManagement/Article/NewsActivityList',
     newVideo:'/InformationManagement/Video/NewVideo',
     editVideo:'/InformationManagement/Video/EditVideo',
     detailVideo:'/InformationManagement/Video/DetailVideo',

     InfoAuthorityAdd:'services/web/auth/authdata/updAuthData',//资讯鉴权添加
     InfoAuthorityDetail:'services/web/auth/authdata/getAllByDataId',//资讯鉴权详情
     InfoAuthor:'services/web/company/userInfo/simpleList',//资讯作者
     // InfoColumn:'services/web/config/category/getList',//资讯栏目【需要权限码】
     InfoColumn:'services/web/system/tree/category/getList',//资讯栏目【不需要权限码】
     DepartmentTree:'services/web/company/org/orgList/get?Q=isAll=true&Q=haveUsers=false',//部门数据
     companyUrl:'services/web/system/tree/getSubCompaniesByParentIds',//下级企业 
}