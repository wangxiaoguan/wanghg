
interface IDataStruct {
  label: string;
  authority: string;
  key: string;
}

// 原始数据
export const RawDataSource: IDataStruct[] = [
  { label: '工商企业数据', authority: '10', key: '10' },
  { label: '工商个体数据', authority: '11', key: '11' },
  { label: '民政数据（本地）', authority: '12', key: '12' },
  { label: '民政数据（中心）', authority: '13', key: '13' },
  { label: '编办数据', authority: '14', key: '14' },
  { label: '司法数据', authority: '15', key: '15' },
  { label: '宗教数据', authority: '16', key: '16' },
  { label: '工会数据', authority: '17', key: '17' },
  { label: '外交数据', authority: '18', key: '18' },
  { label: '文化数据', authority: '19', key: '19' },
  { label: '旅游数据', authority: '110', key: '110' },
  { label: '中央军委数据', authority: '111', key: '111' },
  { label: '农业', authority: '112', key: '112' },
  { label: '其他', authority: '113', key: '113' },
  { label: '接收数据', authority: '114', key: '114' },
  { label: '上报统计', authority: '115', key: '115' },
  { label: '重新上报', authority: '116', key: '116' }
]

//
export const HBUnificationCodeLib: IDataStruct[] = [
  { label: '统一社会信用代码库', authority: '20', key: '20' },
  { label: '原机构代码存量库', authority: '21', key: '21' },
  { label: '存量数据转化率', authority: '22', key: '22' },
]

export const IssueDataSource: IDataStruct[] = [
  { label: '中心返回问题数据', authority: '30', key: '30' },
  { label: '数据核查统计', authority: '31', key: '31' },
  { label: '问题类型统计', authority: '32', key: '32' },
  { label: '数据核查规则', authority: '33', key: '33' },
]