export const merchatSidebarMenu = [
  {
    url: '#/MerchantInfomatin',
    key: '#/MerchantInfomatin',
    defaultImgUrl: require('../styles/images/sidebarMenu/icon_zixun.png'),
    selectedImgUrl: require('../styles/images/sidebarMenu/icon_zixun.png'),
    title: '商家信息',
    unClickable: true,
  },
  {
    url: '#/GoodsManagetion',
    key: '#/GoodsManagetion',
    defaultImgUrl: require('../styles/images/sidebarMenu/icon_zixun.png'),
    selectedImgUrl: require('../styles/images/sidebarMenu/icon_zixun.png'),
    title: '商品管理',
    unClickable: true,
    subMenu: [
      {
        url: '#/GoodsManagetion/GoodsList',
        key: '#/GoodsManagetion/GoodsList',
        title: '商品列表',
        unClickable: true,
        subBreadcrumb: [
          {
            url: '#/GoodsManagetion/AddGoods',
            key: '#/GoodsManagetion/AddGoods',
            title: '新建',
            unClickable: true,
          },
          {
            url: '#/GoodsManagetion/EditGoods',
            key: '#/GoodsManagetion/EditGoods',
            title: '编辑',
            unClickable: true,
          },
        ]
      },
      {
        url: '#/GoodsManagetion/ClassifyList',
        key: '#/GoodsManagetion/ClassifyList',
        title: '分类列表',
        unClickable: true,
        subBreadcrumb: [
          // {
          //   url: '#/GoodsManagetion/AddClassify',
          //   key: '#/GoodsManagetion/AddClassify',
          //   title: '新增',
          //   unClickable: true,
          // },
          // {
          //   url: '#/GoodsManagetion/EditClassify',
          //   key: '#/GoodsManagetion/EditClassify',
          //   title: '编辑',
          //   unClickable: true,
          // },
          {
            url: '#/GoodsManagetion/secondClassify',
            key: '#/GoodsManagetion/secondClassify',
            title: '二级分类',
            unClickable: true,
          }
        ]
      }
    ]
  },
  {
    url: '#/OrdersMaganetion',
    key: '#/OrdersMaganetion',
    defaultImgUrl: require('../styles/images/sidebarMenu/icon_zixun.png'),
    selectedImgUrl: require('../styles/images/sidebarMenu/icon_zixun.png'),
    title: '订单管理',
    unClickable: true,
    subMenu: [
      {
        url: '#/OrdersMaganetion/OrdersList',
        key: '#/OrdersMaganetion/OrdersList',
        title: '订单列表',
        unClickable: true,
      },
    ]
  }
]