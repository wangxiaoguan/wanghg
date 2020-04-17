export const imageServer = 'http://10.0.10.46:31026/';

export const PART_BUILD_ID = '7F170C29B59B7E01E0532D0B000A8E43';

export const WTO_LOOP_IMGS = [
  {
    url: 'http://www.hubeiwto.org.cn/images/banner2.jpg',
  },
  {
    url: 'http://www.hubeiwto.org.cn/images/banner3.jpg',
  },
];


export const WTO_GRID_IMGS = [
  {
    url: 'http://www.hubeiwto.org.cn/WTOTBTChinese/CaseProject/ServiceImage/index_27.jpg',
  },
  {
    url: 'http://www.hubeiwto.org.cn/WTOTBTChinese/CaseProject/ServiceImage/index_25.jpg',
  },
  {
    url: 'http://www.hubeiwto.org.cn/WTOTBTChinese/CaseProject/ServiceImage/index_23.jpg',
  },
  {
    url: 'http://www.hubeiwto.org.cn/WTOTBTChinese/CaseProject/ServiceImage/index_36.jpg',
  },
  {
    url: 'http://www.hubeiwto.org.cn/WTOTBTChinese/CaseProject/ServiceImage/index_37.jpg',
  },
];


export const EMPTY_SEARCH_TYPE = [];

export const GLOBAL_SERACH_TYPE = [
  {
    label: '院官网',
    value: '0',
  },
  {
    label: 'WTO',
    value: '1',
  },
  {
    label: '检验检测',
    value: '2',
  },
  {
    label: '缺陷',
    value: '3',
  },
  {
    label: '统一社会信用代码',
    value: '5',
  },
];


export const WTO_SEARCH_TYPE = [
  {
    label: '出口商品HS编码',
    value: 1,
  },
  {
    label: '合格评定程序',
    value: 2,
  },
  {
    label: '产品出口数据',
    value: 3,
  },
  // {
  //   label: '服务项目',
  //   value: 4,
  // },
];

// export const WTO_SEARCH_KEY = [
//   {
//     label: '查询合格评定程序 | 查询产品出口数据 | 查询进口商品HS编码',
//     value: 1,
//   },
// ];
export const GUANGGUCOMPANY_SEARCH_TYPE = [
  {
    label: '类型样式示例',
    value: '1',
  },
  // {
  //   label: '贸易关注',
  //   value: 2,
  // },
  // {
  //   label: '市场准入动态',
  //   value: 3,
  // },
  // {
  //   label: '服务项目',
  //   value: 4,
  // },
]

export const VERIFY_SEARCH_TYPE = [
  {
    label: '信息公示',
    value: 1,
  },
  {
    label: '政策法规',
    value: 2,
  },
  {
    label: '政策解读',
    value: 3,
  },
]

/**
 * 获取指定数量的客户列表
 * @param {*} total 要获取数量
 * 
 * @return {{img:string}[]}
 */
export function getClientList(total) {
  let result = [];
  for (let i = 1; i <= total; i++) {
    result.push(
      {
        img: require(`@/assets/clients/${i}.png`),
      }
    );
  }
  return result;
}

/**
 * 获取指定数量的伙伴列表
 * @param {*} total 要获取数量
 * 
 * @return {{img:string}[]}
 */
export function getPartnerList(total) {
  let result = [];
  for (let i = 1; i <= total; i++) {
    result.push(
      {
        img: require(`@/assets/partners/${i}.png`),
      }
    );
  }
  return result;
}

export const TEST_IMG = 'https://images.quanjing.com//imageclk010/high/ic02900282.jpg';