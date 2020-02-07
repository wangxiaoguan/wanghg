export const partyTaskData = [
  {
    id: '99',
    name: '重要工作部署',
    type: 'deployment',
    categorylist: [],
  },
  {
    id: '300',
    name: '三会一课',
    type: 'deployment',
    categorylist: [
      {
        id: '1',
        name: '支部党员大会',
        type: 'deployment',
      },
      {
        id: '3',
        name: '党小组会',
        type: 'deployment',
      },
      {
        id: '2',
        name: '党支部委员会',
        type: 'deployment',
      },
      {
        id: '4',
        name: '党课',
        type: 'deployment',
      },
    ],
  },
  {
    id: '6',
    name: '主题教育',
    type: 'education',
    categorylist: [],
  },
  {
    id: '5',
    name: '其他任务',
    type: 'normalTask',
    categorylist: [],
  },
  {
    id: '7',
    name: '党建工作统计',
    type: 'partyStat',
    categorylist: [],
  },
];

export const taskList = {
  taskStatus: [
    { value: 1, label: '全部' },
    { value: 2, label: '进行中' },
    { value: 3, label: '已截止' },
    { value: 4, label: '未开始' },
  ],
};
