export const RuleConfig={
  usernoConfig:{
    rules:[
      { required: true,
        message: '请输入您的员工号，最长20个字符',
        max:20,
      },

    ],
  },
  lastnameConfig:{
    rules:[
      { required: true,
        message: '请输入您的姓名',
      },
    ],
  },
  nameConfig:{
    rules:[
      { required: true,
        message: '请输入您的姓名',
      },
    ],
  },
  emailConfig:{
    rules:[
      {type:'email',message:'您输入的邮箱格式不正确，请输入正确的邮箱'},
      { required:true , message: '请填写邮箱邮箱'},
    ],
  },
  mobileConfig:{
    rules:[
      { required:true,message:'请输入您的手机号'},
    ],
  },

  ageCofig:{
  },
  degreeCofig:{
  },
  genderCofig:{
  },
  isGrayUserConfig:{
    rules:[
      {required:true ,message:'请选择是否为灰度用户'},
    ],
  },
  belongsDepartmentCofig:{
    rules:[
      {required:true,message:'所属部门不能为空'},
    ],
  },
  postnameCofig:{

  },
  partynamesConfig:{
    rules:[
      {required:true,message:'所属党组织不能为空'},
    ],
  },
  memtypeCofig:{
    rules:[
      {required:true,message:'政治面貌不能为空'},
    ],
  },
  typeCofig:{
    rules:[
      {required:true,message:'必须选择一种类型'},
    ],
  },
  actionCofig:{
    rules:[
      {required:true,message:'必须选择一种操作'},
    ],
  },
  pointCofig:{
    rules:[
      {type:'integer',required:true,message:'经验值不能为空,且不能为负数'},
    ],
  },
  remarkCofig:{
    rules:[
      {required:true,message:'描述信息不能为空'},
    ],
  },
  changePointCofig:{
    rules:[
      {type:'integer',required:true,message:'变更数值不能为空,且不能为负数'},
    ],
  },
  remarkReasonCofig:{
    rules:[
      {
        required:true,
        whitespace: true,
        message:'变更原因不能为空，且最多15个字符',
        max: 15,
      },
    ],
  },
  rechargePointCofig:{
    rules:[
      {
        type:'integer',
        required:true,
        whitespace: true,
        message:'请输入充值积分，不大于99999的整数',
        max: 99999,
      },
    ],
  },
  moneyCofig:{
    rules:[
      {
        type: 'number',
        required:true,
        whitespace: true,
        message:'请输入所需金额，不大于99999元',
        max: 99999,
      },
    ],
  },
  sortCofig:{
    rules:[
      {
        type: 'integer',
        required:true,
        whitespace: true,
        message:'请输入显示顺序，不大于999',
        max: 999,
      },
    ],
  },
  statusCofig:{
    rules:[
      {
        required: true,
        message:'请选择一种类型',
      },
    ],
  },
  typeNameConfig:{
    rules:[
      {
        required: false,
        message:'类别名称最多15个字符',
        max: 15,
      },
    ],
  },
  priorityConfig:{
    rules:[
      {
        type: 'integer',
        required: true,
        message:'请输入优先级，最多3位整数',
        max: 999,
      },
    ],
  },
  ratioConfig:{
    rules:[
      {
        type: 'number',
        required: true,
        message:'请输入兑换比例，不大于100',
        max: 100,
      },
    ],
  },
};




