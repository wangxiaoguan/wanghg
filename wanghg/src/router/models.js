
export const sidebarMenu = [
  {
    url: '#/PersonalWork',
    key: '#/PersonalWork',
    defaultImgUrl: require('../styles/images/sidebarMenu/icon_work.png'),
    selectedImgUrl: require('../styles/images/sidebarMenu/icon_work.png'),
    title: '个人工作',
    unClickable: true,
    subMenu: [
      {
        url: '#/PersonalWork/Examine',
        key: '#/PersonalWork/Examine',
        title: '内容审核',
        subBreadcrumb: [{
          url: '#/PersonalWork/Examine/Add',
          key: '#/PersonalWork/Examine/Add',
          title: '新建文章',
          unClickable: true,
        }],
      }]

  },
  {
    url: '#/InformationManagement',
    key: '#/InformationManagement',
    defaultImgUrl: require('../styles/images/sidebarMenu/icon_zixun.png'),
    selectedImgUrl: require('../styles/images/sidebarMenu/icon_zixun.png'),
    title: '资讯管理',
    unClickable: true,
    subMenu: [
      {
        url: '#/InformationManagement/Article',
        key: '#/InformationManagement/Article',
        title: '文章管理',
        subBreadcrumb: [{
          url: '#/InformationManagement/Article/add',
          key: '#/InformationManagement/Article/add',
          title: '新建文章',
          unClickable: true,
        }, {
          url: '#/InformationManagement/Article/EditArticle',
          key: '#/InformationManagement/Article/EditArticle',
          title: '编辑文章',
          unClickable: true,
        }, {
          url: '#/InformationManagement/Article/DetailArticle',
          key: '#/InformationManagement/Article/DetailArticle',
          title: '文章详情',
          unClickable: true,
        },
        {
          url: '#/InformationManagement/Article/SpecialNews',
          key: '#/InformationManagement/Article/SpecialNews',
          title: '专题栏目列表',
          unClickable: true,
        },
        {
          url: '#/InformationManagement/Article/NewsActivityList',
          key: '#/InformationManagement/Article/NewsActivityList',
          title: '栏目资讯活动列表',
          unClickable: true,
        },{
          url: '#/InformationManagement/Article/PageView',
          key: '#/InformationManagement/Article/PageView',
          title: '浏览数',
          unClickable: true,
        },{
          url: '#/InformationManagement/Article/Comments',
          key: '#/InformationManagement/Article/Comments',
          title: '评论数',
          unClickable: true,
        },{
          url: '#/InformationManagement/Article/CommentDetail',
          key: '#/InformationManagement/Article/CommentDetail',
          title: '评论详情',
          unClickable: true,
        }],
      }, {
        url: '#/InformationManagement/Video',
        key: '#/InformationManagement/Video',
        title: '视频管理',
        subBreadcrumb: [{
          url: '#/InformationManagement/Video/NewVideo',
          key: '#/InformationManagement/Video/NewVideo',
          title: '新建视频',
          unClickable: true,
        }, {
          url: '#/InformationManagement/Video/EditVideo',
          key: '#/InformationManagement/Video/EditVideo',
          title: '编辑视频',
          unClickable: true,
        }, { 
          url: '#/InformationManagement/Video/DetailVideo',
          key: '#/InformationManagement/Video/DetailVideo',
          title: '视频详情',
          unClickable: true,
        },{
          url: '#/InformationManagement/Video/PageView',
          key: '#/InformationManagement/Video/PageView',
          title: '浏览数',
          unClickable: true,
        },{
          url: '#/InformationManagement/Video/Comments',
          key: '#/InformationManagement/Video/Comments',
          title: '评论数',
          unClickable: true,
        },{
          url: '#/InformationManagement/Video/CommentDetail',
          key: '#/InformationManagement/Video/CommentDetail',
          title: '评论详情',
          unClickable: true,
        }],
      },
      {
        url: '#/InformationManagement/Magazine',
        key: '#/InformationManagement/Magazine',
        title: '杂志管理',
        subBreadcrumb: [{
          url: '#/InformationManagement/Magazine/Add',
          key: '#/InformationManagement/Magazine/Add',
          title: '新建杂志',
          unClickable: true,
        }, {
          url: '#/InformationManagement/Magazine/Edit',
          key: '#/InformationManagement/Magazine/Edit',
          title: '编辑杂志',
          unClickable: true,
        }],
      },
      {
        url: '#/InformationManagement/project',
        key: '#/InformationManagement/project',
        title: '专题管理',
        defaultImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
        selectedImgUrl: require('../styles/images/sidebarMenu/icon_jianhao.png'),
        unClickable: true,
        subMenu: [{
          url: '#/InformationManagement/project/list',
          key: '#/InformationManagement/project/list',
          title: '普通专题',
          subBreadcrumb: [{
            url: '#/InformationManagement/project/Add',
            key: '#/InformationManagement/project/Add',
            title: '新建考试活动',
            unClickable: true,
          }, {
            url: '#/InformationManagement/project/Edit',
            key: '#/InformationManagement/project/Edit',
            title: '编辑考试活动',
            unClickable: true,
          }],
        },{
          url: '#/InformationManagement/project/Bank',
          key: '#/InformationManagement/project/Bank',
          title: '部门专题',
          subBreadcrumb: [{
            url: '#/InformationManagement/project/Add2',
            key: '#/InformationManagement/project/Add2',
            title: '新建考试活动',
            unClickable: true,
          }, {
            url: '#/InformationManagement/project/Edit2',
            key: '#/InformationManagement/project/Edit2',
            title: '编辑考试活动',
            unClickable: true,
          }],
        }]
      }
    ],

  },
  {
    url: '#/EventManagement',
    title: '活动管理',
    key: '#/EventManagement',
    defaultImgUrl: require('../styles/images/sidebarMenu/icon_huodongguanli.png'),
    selectedImgUrl: require('../styles/images/sidebarMenu/icon_huodongguanli.png'),
    unClickable: true,
    subMenu: [{
      url: '#/EventManagement/Apply/List',
      key: '#/EventManagement/Apply/List',
      title: '报名活动',
      unClickable: true,
      subBreadcrumb: [{
        url: '#/EventManagement/Apply/Add',
        key: '#/EventManagement/Apply/Add', 
        title: '新建报名活动',
        unClickable: true,
      }, {
        url: '#/EventManagement/Apply/Edit',
        key: '#/EventManagement/Apply/Edit',
        title: '编辑报名活动',
        unClickable: true,
      },
      {
        url: '#/EventManagement/Apply/Detail',
        key: '#/EventManagement/Apply/Detail',
        title: '报名活动详情',
        unClickable: true,
      },
      {
        url: '#/EventManagement/Apply/ApplyFields',
        key: '#/EventManagement/Apply/ApplyFields',
        title: '设置报名表单',
        unClickable: true,
      },
      {
        url: '#/EventManagement/Apply/ApplyInfo',
        key: '#/EventManagement/Apply/ApplyInfo',
        title: '查看报名信息',
        unClickable: true,
      },
      {                                 //20181106   浏览  参与   点赞   评论
        url: '#/EventManagement/Apply/JoinList',
        key: '#/EventManagement/Apply/JoinList',
        title: '参与人数详情',
        unClickable: true,
      },
      {
        url: '#/EventManagement/Apply/ViewList',
        key: '#/EventManagement/Apply/ViewList',
        title: '浏览人数详情',
        unClickable: true,
      },
      {
        url: '#/EventManagement/Apply/LikesList',
        key: '#/EventManagement/Apply/LikesList',
        title: '点赞数详情',
        unClickable: true,
      },
      {
        url: '#/EventManagement/Apply/CommentList',
        key: '#/EventManagement/Apply/CommentList',
        title: '评论数详情',
        unClickable: true,
      }],
      /*  subMenu: [{
                url: '#/EventManagement/Apply/List',
                key: '#/EventManagement/Apply/List',
                title: '报名活动列表',
              },/*,{
                url: '#/EventManagement/Apply/Field',
                key: '#/EventManagement/Apply/Field',
                title: '报名字段管理',
              }*//*],*/
    }, {
      url: '#/EventManagement/Examination',
      key: '#/EventManagement/Examination',
      title: '考试活动',
      defaultImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
      selectedImgUrl: require('../styles/images/sidebarMenu/icon_jianhao.png'),
      unClickable: true,
      subMenu: [{
        url: '#/EventManagement/Examination/List',
        key: '#/EventManagement/Examination/List',
        title: '考试活动列表',
        subBreadcrumb: [{
          url: '#/EventManagement/Examination/Add',
          key: '#/EventManagement/Examination/Add',
          title: '新建考试活动',
          unClickable: true,
        }, {
          url: '#/EventManagement/Examination/Edit',
          key: '#/EventManagement/Examination/Edit',
          title: '编辑考试活动',
          unClickable: true,
        }, {
          url: '#/EventManagement/Examination/Detail',
          key: '#/EventManagement/Examination/Detail',
          title: '考试活动详情',
          unClickable: true,
        },{                                 //20181106   浏览  参与   点赞   评论
          url: '#/EventManagement/Examination/JoinList',
          key: '#/EventManagement/Examination/JoinList',
          title: '参与人数详情',
          unClickable: true,
        },
        {
          url: '#/EventManagement/Examination/ViewList',
          key: '#/EventManagement/Examination/ViewList',
          title: '浏览人数详情',
          unClickable: true,
        },
        {
          url: '#/EventManagement/Examination/LikesList',
          key: '#/EventManagement/Examination/LikesList',
          title: '点赞数详情',
          unClickable: true,
        },
        {
          url: '#/EventManagement/Examination/CommentList',
          key: '#/EventManagement/Examination/CommentList',
          title: '评论数详情',
          unClickable: true,
        },
         {
          url: '#/EventManagement/Examination/QuestionsSettings',
          key: '#/EventManagement/Examination/QuestionsSettings',
          title: '设置考试题目',
          unClickable: true,
          subBreadcrumb: [{
            url: '#/EventManagement/Examination/AddCustomQuestion',
            key: '#/EventManagement/Examination/AddCustomQuestion',
            title: '添加题目',
            unClickable: true,
          }, {
            url: '#/EventManagement/Examination/EditCustomQuestion',
            key: '#/EventManagement/Examination/EditCustomQuestion',
            title: '编辑题目',
            unClickable: true,
          }],
        }, {
          url: '#/EventManagement/Examination/Score',
          key: '#/EventManagement/Examination/Score',
          title: '查看考试成绩',
          unClickable: true,
        }],
      }, {
        url: '#/EventManagement/Examination/Bank',
        key: '#/EventManagement/Examination/Bank',
        title: '考试题库管理',
        subBreadcrumb: [{
          url: '#/EventManagement/Examination/QuestionsManagement',
          key: '#/EventManagement/Examination/QuestionsManagement',
          title: '题目管理',
          unClickable: true,
          subBreadcrumb: [{
            url: '#/EventManagement/Examination/AddQuestionsConfiguration',
            key: '#/EventManagement/Examination/AddQuestionsConfiguration',
            title: '新建题目',
            unClickable: true,
          }, {
            url: '#/EventManagement/Examination/EditQuestionsConfiguration',
            key: '#/EventManagement/Examination/EditQuestionsConfiguration',
            title: '编辑题目',
            unClickable: true,
          }],
        }],
      }],
    }, {
      url: '#/EventManagement/Questionnaire/List',
      key: '#/EventManagement/Questionnaire/List',
      title: '问卷活动',
      subBreadcrumb: [{
        url: '#/EventManagement/Questionnaire/Add',
        key: '#/EventManagement/Questionnaire/Add',
        title: '新建问卷活动',
        unClickable: true,
      }, {
        url: '#/EventManagement/Questionnaire/Edit',
        key: '#/EventManagement/Questionnaire/Edit',
        title: '编辑问卷活动',
        unClickable: true,
      },
      {
        url: '#/EventManagement/Questionnaire/Detail',
        key: '#/EventManagement/Questionnaire/Detail',
        title: '问卷活动详情',
        unClickable: true,
      },{                                 //20181106   浏览  参与   点赞   评论
        url: '#/EventManagement/Questionnaire/JoinList',
        key: '#/EventManagement/Questionnaire/JoinList',
        title: '参与人数详情',
        unClickable: true,
      },
      {
        url: '#/EventManagement/Questionnaire/ViewList',
        key: '#/EventManagement/Questionnaire/ViewList',
        title: '浏览人数详情',
        unClickable: true,
      },
      {
        url: '#/EventManagement/Questionnaire/LikesList',
        key: '#/EventManagement/Questionnaire/LikesList',
        title: '点赞数详情',
        unClickable: true,
      },
      {
        url: '#/EventManagement/Questionnaire/CommentList',
        key: '#/EventManagement/Questionnaire/CommentList',
        title: '评论数详情',
        unClickable: true,
      },
      {
        url: '#/EventManagement/Questionnaire/TopicList',
        key: '#/EventManagement/Questionnaire/TopicList',
        title: '设置问卷题目',
        unClickable: true,
        subBreadcrumb: [{
          url: '#/EventManagement/Questionnaire/TopicAdd',
          key: '#/EventManagement/Questionnaire/TopicAdd',
          title: '新建问卷题目',
          unClickable: true,
        }, {
          url: '#/EventManagement/Questionnaire/TopicEdit',
          key: '#/EventManagement/Questionnaire/TopicEdit',
          title: '编辑问卷题目',
          unClickable: true,
        }],
      }],
    }, {
      url: '#/EventManagement/Vote/List',
      key: '#/EventManagement/Vote/List',
      title: '投票活动',
      subBreadcrumb: [{
        url: '#/EventManagement/Vote/Add',
        key: '#/EventManagement/Vote/Add',
        title: '新建投票活动',
        unClickable: true,
      }, {
        url: '#/EventManagement/Vote/Edit',
        key: '#/EventManagement/Vote/Edit',
        title: '编辑投票活动',
        unClickable: true,
      }, {
        url: '#/EventManagement/Vote/Detail',
        key: '#/EventManagement/Vote/Detail',
        title: '投票活动详情',
        unClickable: true,
      },{                                 //20181106   浏览  参与   点赞   评论
        url: '#/EventManagement/Vote/JoinList',
        key: '#/EventManagement/Vote/JoinList',
        title: '参与人数详情',
        unClickable: true,
      },
      {
        url: '#/EventManagement/Vote/ViewList',
        key: '#/EventManagement/Vote/ViewList',
        title: '浏览人数详情',
        unClickable: true,
      },
      {
        url: '#/EventManagement/Vote/LikesList',
        key: '#/EventManagement/Vote/LikesList',
        title: '点赞数详情',
        unClickable: true,
      },
      {
        url: '#/EventManagement/Vote/CommentList',
        key: '#/EventManagement/Vote/CommentList',
        title: '评论数详情',
        unClickable: true,
      },
      {
        url: '#/EventManagement/Vote/TopicList',
        key: '#/EventManagement/Vote/TopicList',
        title: '设置投票题目',
        unClickable: true,
        subBreadcrumb: [{
          url: '#/EventManagement/Vote/TopicAdd',
          key: '#/EventManagement/Vote/TopicAdd',
          title: '新建投票题目',
          unClickable: true,
        }, {
          url: '#/EventManagement/Vote/TopicEdit',
          key: '#/EventManagement/Vote/TopicEdit',
          title: '编辑投票题目',
          unClickable: true,
        }],
      }],
    }, {
      url: '#/EventManagement/Order',
      key: '#/EventManagement/Order',
      title: '订购活动',
      defaultImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
      selectedImgUrl: require('../styles/images/sidebarMenu/icon_jianhao.png'),
      unClickable: true,
      subMenu: [{
        url: '#/EventManagement/Order/List',
        key: '#/EventManagement/Order/List',
        title: '订购活动列表',
        subBreadcrumb: [{
          url: '#/EventManagement/Order/Add',
          key: '#/EventManagement/Order/Add',
          title: '新建订购活动',
          unClickable: true,
        }, {
          url: '#/EventManagement/Order/Edit',
          key: '#/EventManagement/Order/Edit',
          title: '编辑订购活动',
          unClickable: true,
        }, {
          url: '#/EventManagement/Order/Detail',
          key: '#/EventManagement/Order/Detail',
          title: '订购活动详情',
          unClickable: true,
        }, {
          url: '#/EventManagement/Order/SetShopping',
          key: '#/EventManagement/Order/SetShopping',
          title: '设置订购商品',
          unClickable: true,
        }, {
          url: '#/EventManagement/Order/OrderInformation',
          key: '#/EventManagement/Order/OrderInformation',
          title: '查看订购信息',
          unClickable: true,
        },{                                 //20181106   浏览  参与   点赞   评论
          url: '#/EventManagement/Order/JoinList',
          key: '#/EventManagement/Order/JoinList',
          title: '参与人数详情',
          unClickable: true,
        },
        {
          url: '#/EventManagement/Order/ViewList',
          key: '#/EventManagement/Order/ViewList',
          title: '浏览人数详情',
          unClickable: true,
        },
        {
          url: '#/EventManagement/Order/LikesList',
          key: '#/EventManagement/Order/LikesList',
          title: '点赞数详情',
          unClickable: true,
        },
        {
          url: '#/EventManagement/Order/CommentList',
          key: '#/EventManagement/Order/CommentList',
          title: '评论数详情',
          unClickable: true,
        }
        ],

      }, {
        url: '#/EventManagement/Order/Commodity',
        key: '#/EventManagement/Order/Commodity',
        title: '订购商品管理',
        subBreadcrumb: [{
          url: '#/EventManagement/Order/CommodityEdit',
          key: '#/EventManagement/Order/CommodityEdit',
          title: '编辑订购商品管理',
          unClickable: true,
        },
        {
          url: '#/EventManagement/Order/CommodityAdd',
          key: '#/EventManagement/Order/CommodityAdd',
          title: '新建订购商品管理',
          unClickable: true,
        }],

      }],
    },
      /*   {
            url: '#/EventManagement/Task',
            key: '#/EventManagement/Task',
            title: '任务活动',
            defaultImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
            selectedImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
            unClickable: true,
            subMenu: [{
              url: '#/EventManagement/Task/List/Redirect',
              key: '#/EventManagement/Task/List/Redirect',
              title: '任务活动列表',
            }, {
              url: '#/EventManagement/Task/Theme',
              key: '#/EventManagement/Task/Theme',
              title: '任务主题管理',
            }, {
              url: '#/EventManagement/Task/Type',
              key: '#/EventManagement/Task/Type',
              title: '任务类型管理',
            }],
          }*/
    ],
  },
  {
    url: '#/PartyBuildGarden',
    key: '#/PartyBuildGarden',
    defaultImgUrl: require('../styles/images/sidebarMenu/icon_dangjian.png'),
    selectedImgUrl: require('../styles/images/sidebarMenu/icon_dangjian.png'),
    title: '党建园地',
    unClickable: true,
    subMenu: [
      {
        url: '#/PartyBuildGarden/PartyLearning',
        key: '#/PartyBuildGarden/PartyLearning',
        title: '党建学习管理',
        subBreadcrumb: [
          {
            url: '#/PartyBuildGarden/PartyLearning/AddLearn',
            key: '#/PartyBuildGarden/PartyLearning/AddLearn',
            title: '新建党建学习',
            unClickable: true,
          },
          {
            url: '#/PartyBuildGarden/PartyLearning/EditLearn',
            key: '#/PartyBuildGarden/PartyLearning/EditLearn',
            title: '编辑党建学习',
            unClickable: true,
          },
          {
            url: '#/PartyBuildGarden/PartyLearning/DetailLearn',
            key: '#/PartyBuildGarden/PartyLearning/DetailLearn',
            title: '党建学习详情',
            unClickable: true,
          },
          {
            url: '#/PartyBuildGarden/PartyLearning/CompletionRate',
            key: '#/PartyBuildGarden/PartyLearning/CompletionRate',
            title: '查看完成率',
            unClickable: true,
          }
        ],
      },
      {
        url: '#/PartyBuildGarden/PartyTask',
        key: '#/PartyBuildGarden/PartyTask',
        title: '党建任务管理',
        subBreadcrumb: [
          {
            url: '#/PartyBuildGarden/PartyTask/Add',
            key: '#/PartyBuildGarden/PartyTask/Add',
            title: '新建党建任务',
            unClickable: true,
          },
          {
            url: '#/PartyBuildGarden/PartyTask/Edit',
            key: '#/PartyBuildGarden/PartyTask/Edit',
            title: '编辑党建任务',
            unClickable: true,
          },
          {
            url: '#/PartyBuildGarden/PartyTask/Detail',
            key: '#/PartyBuildGarden/PartyTask/Detail',
            title: '党建任务详情',
            unClickable: true,
          },
          {
            url: '#/PartyBuildGarden/PartyTask/CompletionRate',
            key: '#/PartyBuildGarden/PartyTask/CompletionRate',
            title: '查看完成率',
            unClickable: true,
          },
        ],
      },

      {
        url: '#/PartyBuildGarden/PublicAnnouncement',
        key: '#/PartyBuildGarden/PublicAnnouncement',
        title: '张榜公布管理',
        subBreadcrumb: [
          {
            url: '#/PartyBuildGarden/PublicAnnouncement/PublicDetail',
            key: '#/PartyBuildGarden/PublicAnnouncement/DePublicDetailtail',
            title: '榜单详情',
            unClickable: true,
          },
        ],
      },
      {
        url: '#/PartyBuildGarden/Dictionary',
        key: '#/PartyBuildGarden/Dictionary',
        title: '字典管理',
        defaultImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
        selectedImgUrl: require('../styles/images/sidebarMenu/icon_jianhao.png'),
        unClickable: true,
        subMenu: [
        {
          url: '#/PartyBuildGarden/Dictionary/TaskTopic',
          key: '#/PartyBuildGarden/Dictionary/TaskTopic',
          title: '任务主题管理',
          subBreadcrumb: [{
            url: '#/PartyBuildGarden/Dictionary/TaskTopicAdd',
            key: '#/PartyBuildGarden/Dictionary/TaskTopicAdd',
            title: '新建任务主题',
            unClickable: true,
          }, {
            url: '#/PartyBuildGarden/Dictionary/TaskTopicEdit',
            key: '#/PartyBuildGarden/Dictionary/TaskTopicEdit',
            title: '编辑任务主题',
            unClickable: true,
          },
          ],
        },
        {
          url: '#/PartyBuildGarden/Dictionary/TaskType',
          key: '#/PartyBuildGarden/Dictionary/TaskType',
          title: '任务类型管理',
          subBreadcrumb: [{
            url: '#/PartyBuildGarden/Dictionary/TaskTypeAdd',
            key: '#/PartyBuildGarden/Dictionary/TaskTypeAdd',
            title: '新建类型主题',
            unClickable: true,
          }, {
            url: '#/PartyBuildGarden/Dictionary/TaskTypeEdit',
            key: '#/PartyBuildGarden/Dictionary/TaskTypeEdit',
            title: '编辑任务类型',
            unClickable: true,
          },
          ],
        },
        ],
      }, 
    ],
  },


  {
    url: '#/Statistics/',
    key: '#/Statistics/',
    defaultImgUrl: require('../styles/images/sidebarMenu/icon_baobiao.png'),
    selectedImgUrl: require('../styles/images/sidebarMenu/icon_baobiao.png'),
    title: '统计分析',
    subMenu: [
      {
        url: '#/Statistics/User',
        key: '#/Statistics/User',
        title: '用户分析',
        unClickable: true,
        defaultImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
        selectedImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
        subMenu: [
          {
            url: '#/Statistics/User/Reg',
            key: '#/Statistics/User/Reg',
            title: '总注册人数',
          },
        ],
      },
      {
        url: '#/Statistics/Content',
        key: '#/Statistics/Content',
        title: '内容分析',
      },
      {
        url: '#/Statistics/Menu',
        key: '#/Statistics/Menu',
        title: '菜单分析',
      },
      {
        url: '#/Statistics/Message',
        key: '#/Statistics/Message',
        title: '消息分析',
      },
      {
        url: '#/Statistics/Score',
        key: '#/Statistics/Score',
        title: '积分分析',
      },
    ],
  },


  {
    url: '#/PointManagement',
    title: '积分管理',
    key: '#/PointManagement',
    defaultImgUrl: require('../styles/images/sidebarMenu/icon_tongji1.png'),
    selectedImgUrl: require('../styles/images/sidebarMenu/icon_tongji1.png'),
    unClickable: true,
    subMenu: [{
      url: '#/PointManagement/UserPoint',
      key: '#/PointManagement/UserPoint',
      title: '用户积分管理',
      unClickable: true,
      subBreadcrumb: [{
        url: '#/PointManagement/PointInfo',
        key: '#/PointManagement/PointInfo',
        title: '经验值变更详情',
        unClickable: true,
      }, {
        url: '#/PointManagement/TreasureInfo',
        key: '#/PointManagement/TreasureInfo',
        title: '普通积分变更详情',
        unClickable: true,
      }, {
        url: '#/PointManagement/PartyMemHonorInfo',
        key: '#/PointManagement/PartyMemHonorInfo',
        title: '党员荣誉积分变更详情',
        unClickable: true,
      }, {
        url: '#/PointManagement/BirthdayTicketInfo',
        key: '#/PointManagement/BirthdayTicketInfo',
        title: '生日券变更详情',
        unClickable: true,
      }, {
        url: '#/PointManagement/CinemaTicketInfo',
        key: '#/PointManagement/CinemaTicketInfo',
        title: '电影票积分变更详情',
        unClickable: true,
      }, {
        url: '#/PointManagement/FestivitiesMaterialInfo',
        key: '#/PointManagement/FestivitiesMaterialInfo',
        title: '过节物资积分变更详情',
        unClickable: true,
      }],
    }, {
      url: '#/PointManagement/SpecialPoint',
      key: '#/PointManagement/SpecialPoint',
      title: '专项积分发放管理',
      unClickable: true,
      subBreadcrumb: [{
        url: '#/PointManagement/SpecialPoint/AddTask',
        key: '#/PointManagement/SpecialPoint/AddTask',
        title: '添加任务',
        unClickable: true,
      }, {
        url: '#/PointManagement/SpecialPoint/EditTask',
        key: '#/PointManagement/SpecialPoint/EditTask',
        title: '编辑任务',
        unClickable: true,
      }, {
        url: '#/PointManagement/CategoryManagement',
        key: '#/PointManagement/CategoryManagement',
        title: '类别管理',
        unClickable: true,
      }],
    }, {
      url: '#/PointManagement/RechargePoint',
      key: '#/PointManagement/RechargePoint',
      title: '积分充值配置',
      unClickable: true,
    }, {
      url: '#/PointManagement/RechargeRecord',
      key: '#/PointManagement/RechargeRecord',
      title: '用户充值记录',
      unClickable: true,
    },
    ],
  },

 
  

  
  {
    url: '#/Message',
    key: '#/Message',
    defaultImgUrl: require('../styles/images/sidebarMenu/icon_shixiangtixing.png'),
    selectedImgUrl: require('../styles/images/sidebarMenu/icon_shixiangtixing.png'),
    title: '消息管理',
    subMenu: [
      {
        url: '#/Message/Notice',
        key: '#/Message/Notice',
        title: '通知管理',
      },
      {
        url: '#/Message/Idea',
        key: '#/Message/Idea',
        title: '意见反馈',
      },
      {
        url: '#/Message/Inform',
        key: '#/Message/Inform',
        title: '举报管理',
      },
    ],
  },

  {
    url: '#/Service/',
    key: '#/Service/',
    defaultImgUrl: require('../styles/images/sidebarMenu/icon_fuwu1.png'),
    selectedImgUrl: require('../styles/images/sidebarMenu/icon_fuwu1.png'),
    title: '服务管理',
    subMenu: [
      {
        url: '#/Service/Bus',
        key: '#/Service/Bus',
        title: '班车管理',
      },
      {
        url: '#/Service/CheckIn',
        key: '#/Service/CheckIn',
        title: '考勤管理',
      },
      {
        url: '#/Service/Remind',
        key: '#/Service/Remind',
        title: '事项提醒管理',
      },
      {
        url: '#/Service/ChangeTeam',
        key: '#/Service/ChangeTeam',
        title: '党支部换届提醒',
      },
    ],
  },


  

  {
    url: '#/SystemSettings',
    title: '系统设置',
    key: '#/SystemSettings',
    defaultImgUrl: require('../styles/images/sidebarMenu/icon_xitong.png'),
    selectedImgUrl: require('../styles/images/sidebarMenu/icon_xitong.png'),
    unClickable: true,
    subMenu: [{
      url: '#/SystemSettings/UserManagement',
      key: '#/SystemSettings/UserManagement',
      title: '用户管理',
      subBreadcrumb: [{
        url: '#/SystemSettings/NewUser',
        key: '#/SystemSettings/NewUser',
        title: '新建用户',
        unClickable: true,
      }, {
        url: '#/SystemSettings/EditUser',
        key: '#/SystemSettings/EditUser',
        title: '编辑用户',
        unClickable: true,
      }, {
        url: '#/SystemSettings/UserManagementDetail',
        key: '#/SystemSettings/UserManagementDetail',
        title: '用户详情',
        unClickable: true,
      }, {
        url: '#/SystemSettings/AuthorizationRang',
        key: '#/SystemSettings/AuthorizationRang',
        title: '数据权限设置',
        unClickable: true,
      }],
    }, {
      url: '#/SystemSettings/PartyMembers',
      key: '#/SystemSettings/PartyMembers',
      title: '党员管理',
      defaultImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
      selectedImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
      subBreadcrumb: [{
        url: '#/SystemSettings/NewPartyMember',
        key: '#/SystemSettings/NewPartyMember',
        title: '新建党员用户',
        unClickable: true,
      }, {
        url: '#/SystemSettings/PartyFeeManagement',
        key: '#/SystemSettings/PartyFeeManagement',
        title: '党费管理',
        unClickable: true,
      },
      {
        url: '#/SystemSettings/NewEditPartyMember',
        key: '#/SystemSettings/NewEditPartyMember',
        title: '编辑党员用户',
        unClickable: true,
      },
      ],
    }, 
    {
      url: '#/SystemSettings/PartyApply',
      key: '#/SystemSettings/PartyApply',
      title: '入党申请管理',
    },
    {
      url: '#/SystemSettings/Experience',
      key: '#/SystemSettings/Experience',
      title: '经验值管理',
    },
    {
      url: '#/SystemSettings/ConfigGrade',
      key: '#/SystemSettings/ConfigGrade',
      title: '配置档设定',
    },
    {
      url: '#/SystemSettings/PartyMenOut',
      key: '#/SystemSettings/PartyMenOut',
      title: '转出党员',
      subBreadcrumb: [{
        url: '#/SystemSettings/PartyEdit',
        key: '#/SystemSettings/PartyEdit',
        title: '编辑菜单',
        unClickable: true,
      }],
    }, {
      url: '#/SystemSettings/Visitor',
      key: '#/SystemSettings/Visitor',
      title: '游客管理',
    }, {
      url: '#/SystemSettings/RolePermissions', 
      key: '#/SystemSettings/RolePermissions',
      title: '角色权限管理',
      subBreadcrumb: [{
        url: '#/SystemSettings/AddRolePermissions',
        key: '#/SystemSettings/AddRolePermissions',
        title: '新建角色权限',
        unClickable: true,
      }, {
        url: '#/SystemSettings/EditRolePermissions',
        key: '#/SystemSettings/EditRolePermissions',
        title: '编辑角色权限',
        unClickable: true,
      }, {
        url: '#/SystemSettings/DetailRolePermissions',
        key: '#/SystemSettings/DetailRolePermissions',
        title: '查看角色权限',
        unClickable: true,
      },
      ],
    }, {
      url: '#/SystemSettings/HomeLayout',
      key: '#/SystemSettings/HomeLayout',
      title: '首页布局管理',
      defaultImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
      selectedImgUrl: require('../styles/images/sidebarMenu/icon_jianhao.png'),
      unClickable: true,
      subMenu: [{
        url: '#/SystemSettings/HomeLayout/Carousel',
        key: '#/SystemSettings/HomeLayout/Carousel',
        title: '首页轮播图管理',
        defaultImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
        selectedImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
        subBreadcrumb: [{
          url: '#/SystemSettings/HomeLayout/NewCarousel',
          key: '#/SystemSettings/HomeLayout/NewCarousel',
          title: '新建轮播图',
          unClickable: true,
        }, {
          url: '#/SystemSettings/HomeLayout/CarouselDetail',
          key: '#/SystemSettings/HomeLayout/CarouselDetail',
          title: '轮播图详情',
          unClickable: true,
        }, {
          url: '#/SystemSettings/HomeLayout/EditCarousel',
          key: '#/SystemSettings/HomeLayout/EditCarousel',
          title: '编辑轮播图',
          unClickable: true,
        }],
      }, {
        url: '#/SystemSettings/HomeLayout/Tag',
        key: '#/SystemSettings/HomeLayout/Tag',
        title: '首页标签管理',
        defaultImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
        selectedImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
        subBreadcrumb: [{
          url: '#/SystemSettings/HomeLayout/NewTag',
          key: '#/SystemSettings/HomeLayout/NewTag',
          title: '新建标签',
          unClickable: true,
        }, {
          url: '#/SystemSettings/HomeLayout/EditTag',
          key: '#/SystemSettings/HomeLayout/EditTag',
          title: '编辑标签',
          unClickable: true,
        }],
      }, {
        url: '#/SystemSettings/HomeLayout/Menu',
        key: '#/SystemSettings/HomeLayout/Menu',
        title: '首页菜单管理',
        defaultImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
        selectedImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
        subBreadcrumb: [{
          url: '#/SystemSettings/HomeLayout/NewMenu',
          key: '#/SystemSettings/HomeLayout/NewMenu',
          title: '新建菜单',
          unClickable: true,
        }, {
          url: '#/SystemSettings/HomeLayout/EditMenu',
          key: '#/SystemSettings/HomeLayout/EditMenu',
          title: '编辑菜单',
          unClickable: true,
        }],
      }, {
        url: '#/SystemSettings/HomeLayout/ContentManagement',
        key: '#/SystemSettings/HomeLayout/ContentManagement',
        title: '首页内容管理',
      }],
    }, 
    {
      url: '#/SystemSettings/Dictionary',
      key: '#/SystemSettings/Dictionary',
      title: '字典管理',
      defaultImgUrl: require('../styles/images/sidebarMenu/icon_jiahao.png'),
      selectedImgUrl: require('../styles/images/sidebarMenu/icon_jianhao.png'),
      unClickable: true,
      subMenu: [{
        url: '#/SystemSettings/Dictionary/Magazines',
        key: '#/SystemSettings/Dictionary/Magazines',
        title: '杂志系列管理',
      },
      {
        url: '#/SystemSettings/Dictionary/Apply',
        key: '#/SystemSettings/Dictionary/Apply',
        title: '报名字段管理',
        subBreadcrumb: [{
          url: '#/SystemSettings/Dictionary/AddApply',
          key: '#/SystemSettings/Dictionary/AddApply',
          title: '新建报名字段',
          unClickable: true,
        }, {
          url: '#/SystemSettings/Dictionary/ApplyDetail',
          key: '#/SystemSettings/Dictionary/ApplyDetail',
          title: '编辑报名字段',
          unClickable: true,
        },
        ],
      },
      {
        url: '#/SystemSettings/Dictionary/TaskTopic',
        key: '#/SystemSettings/Dictionary/TaskTopic',
        title: '任务主题管理',
        subBreadcrumb: [{
          url: '#/SystemSettings/Dictionary/TaskTopicAdd',
          key: '#/SystemSettings/Dictionary/TaskTopicAdd',
          title: '新建任务主题',
          unClickable: true,
        }, {
          url: '#/SystemSettings/Dictionary/TaskTopicEdit',
          key: '#/SystemSettings/Dictionary/TaskTopicEdit',
          title: '编辑任务主题',
          unClickable: true,
        },
        ],
      },
      {
        url: '#/SystemSettings/Dictionary/TaskType',
        key: '#/SystemSettings/Dictionary/TaskType',
        title: '任务类型管理',
        subBreadcrumb: [{
          url: '#/SystemSettings/Dictionary/TaskTypeAdd',
          key: '#/SystemSettings/Dictionary/TaskTypeAdd',
          title: '新建类型主题',
          unClickable: true,
        }, {
          url: '#/SystemSettings/Dictionary/TaskTypeEdit',
          key: '#/SystemSettings/Dictionary/TaskTypeEdit',
          title: '编辑任务类型',
          unClickable: true,
        },
        ],
      },
      ],
    }, 
    {
      url: '#/SystemSettings/ColumnManagement',
      key: '#/SystemSettings/ColumnManagement',
      title: '栏目管理',
    }, {
      url: '#/SystemSettings/PopularWords',
      key: '#/SystemSettings/PopularWords',
      title: '热词管理',
    }, {
      url: '#/SystemSettings/DepartMent',
      key: '#/SystemSettings/DepartMent',
      title: '企业部门管理',
    }, {
      url: '#/SystemSettings/PartyOrganization',
      key: '#/SystemSettings/PartyOrganization',
      title: '党组织管理',
    }, {
      url: '#/SystemSettings/VirtualGroup',
      key: '#/SystemSettings/VirtualGroup',
      title: '虚拟群组管理',
      subBreadcrumb: [{
        url: '#/SystemSettings/VirtualGroupUser',
        key: '#/SystemSettings/VirtualGroupUser',
        title: '群成员管理',
        unClickable: true,
      }, {
        url: '#/SystemSettings/VirtualGroupAddUser',
        key: '#/SystemSettings/VirtualGroupAddUser',
        title: '添加群成员',
        unClickable: true,
      }],
    }, {
      url: '#/SystemSettings/versionManagement',
      key: '#/SystemSettings/versionManagement',
      title: '版本管理',
      subBreadcrumb: [{
        url: '#/SystemSettings/AddVersionManagement',
        key: '#/SystemSettings/AddVersionManagement',
        title: '新建版本',
        unClickable: true,
      }, {
        url: '#/SystemSettings/EditVersionManagement',
        key: '#/SystemSettings/EditVersionManagement',
        title: '编辑版本',
        unClickable: true,
      }, {
        url: '#/SystemSettings/DetailVersionManagement',
        key: '#/SystemSettings/DetailVersionManagement',
        title: '查看版本',
        unClickable: true,
      },
      ],
    }, {
      url: '#/SystemSettings/company',
      key: '#/SystemSettings/company',
      title: '企业管理',
    }, 
   
  ],
  },

  
  
        
      
];

//declaration
