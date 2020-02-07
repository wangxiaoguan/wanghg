export const typeList = [
  { key: 0, value: '按年份统计' },
  { key: 1, value: '按季度统计' },
  { key: 2, value: '按月份统计' },
];

export const yearList = () => {
  const year = Number(new Date().getFullYear());
  const list = [];
  for (let i = 0; i < 6; i += 1) {
    list.push({ key: year - i, value: `${year - i}年` });
  }
  return list;
};

export const quarterList = year => {
  const now = Number(new Date().getFullYear());
  let quarter = 4;
  const quarterList = [
    { key: 1, value: '第一季度' },
    { key: 2, value: '第二季度' },
    { key: 3, value: '第三季度' },
    { key: 4, value: '第四季度' },
  ];
  if (year === now) {
    const month = new Date().getMonth() + 1;
    quarter = Math.ceil(month / 3);
  }
  return quarterList.slice(0, quarter);
};

export const monthList = year => {
  const now = Number(new Date().getFullYear());
  let month = 12;
  const mothList = [
    { key: 1, value: '一月份' },
    { key: 2, value: '二月份' },
    { key: 3, value: '三月份' },
    { key: 4, value: '四月份' },
    { key: 5, value: '五月份' },
    { key: 6, value: '六月份' },
    { key: 7, value: '七月份' },
    { key: 8, value: '八月份' },
    { key: 9, value: '九月份' },
    { key: 10, value: '十月份' },
    { key: 11, value: '十一月份' },
    { key: 12, value: '十二月份' },
  ];
  if (year === now) {
    month = new Date().getMonth() + 1;
  }
  return mothList.slice(0, month);
};
