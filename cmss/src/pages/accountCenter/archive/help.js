export const loadData = (userInfo, userData) => {
  let sex = '';
  if (`${userInfo.sex}` === 'true') {
    sex = '男';
  } else {
    sex = '女';
  }
  // let { phone } = userInfo;
  // if (userInfo.phone === 'null' || !userInfo.phone) {
  //   phone = '';
  // }
  // let { address } = userInfo;
  // if (userInfo.address === 'null' || !userInfo.address) {
  //   address = '';
  // }
  const lineList = [
    // {
    //   label: '所属部门',
    //   value: userInfo.deptname || '',
    // },
    // {
    //   label: '性别',
    //   value: sex,
    // },
    {
      label: '手机号',
      value: userInfo.mobile || '',
    },
    // {
    //   label: '邮箱',
    //   value: userInfo.email || '',
    // },
    // {
    //   label: '办公座机',
    //   value: phone || '',
    // },
    // {
    //   label: '办公地点',
    //   value: address || '',
    // },
    {
      label: '普通积分',
      value: userInfo.treasure || '',
    },
    // {
    //   label: '经验值',
    //   value: userInfo.points || '',
    // },
  ];

  const partyList = [
    // {
    //   label: '所属部门',
    //   value: userInfo.deptname || '',
    // },
    // {
    //   label: '性别',
    //   value: sex,
    // },
    {
      label: '手机号',
      value: userInfo.mobile || '',
    },
    // {
    //   label: '邮箱',
    //   value: userInfo.email || '',
    // },
    // {
    //   label: '办公座机',
    //   value: phone || '',
    // },
    // {
    //   label: '办公地点',
    //   value: address || '',
    // },
    {
      label: '入党时间',
      value: userInfo.joindate || '',
    },
    {
      label: '所属党组织',
      value: userInfo.partyname || '',
    },
    {
      label: '党内职务',
      value: userData.postlist || [],
    },
    // {
    //   label: '党员荣誉积分',
    //   value: userInfo.partypoint || '',
    // },
    // {
    //   label: '普通积分',
    //   value: userInfo.treasure || '',
    // },
    // {
    //   label: '经验值',
    //   value: userInfo.points || '',
    // },
  ];
  return userData.state === 1 || userData.state === 2 ? partyList : lineList;
};

export default {
  loadData,
};
