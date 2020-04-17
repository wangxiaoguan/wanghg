
export const OrgCategoryCode = [
  {
    value: '9',
    label: '工商',
    children: [
      { value: '1', label: '企业' },
      { value: '2', label: '个体工商户' },
      { value: '3', label: '农民专用合作社' }
    ]
  },
  {
    value: '5',
    label: '民政',
    children: [
      { value: '1', label: '社会团体' },
      { value: '2', label: '民办非企业单位' },
      { value: '3', label: '基金会' },
      { value: '9', label: '其他' }
    ]
  },
  {
    value: '1',
    label: '机构编制',
    children: [
      { value: '1', label: '机关' },
      { value: '2', label: '事业单位' },
      { value: '3', label: '中央编办直接管理结构编辑的群众团体' },
      { value: '9', label: '其他' }
    ]
  },
  {
    value: 'null',
    label: '其他',
    children: [
      { value: '1', label: '其他' },
    ]
  }
]

export const AdministrativeDivision = [
  {
    value: '420000',
    label: '省直'
  },
  {
    value: '420100',
    label: '武汉市',
    children: [
      { value: '420101', label: '武汉市市辖区' },
      { value: '420102', label: '武汉市江岸区' },
      { value: '420103', label: '武汉市江汉区' },
      { value: '420104', label: '武汉市硚口区' },
      { value: '420105', label: '武汉市汉阳区' },
      { value: '420106', label: '武汉市武昌区' },
      { value: '420107', label: '武汉市青山区' },
      { value: '420111', label: '武汉市洪山区' },
      { value: '420112', label: '武汉市东西湖区' },
      { value: '420113', label: '武汉市汉南区' },
      { value: '420114', label: '武汉市蔡甸区' },
      { value: '420115', label: '武汉市江夏区' },
      { value: '420116', label: '武汉市黄陂区' },
      { value: '420117', label: '武汉市新洲区' },
      { value: '420151', label: '武汉市经济开发区' },
      { value: '420152', label: '武汉市东湖高新技术开发区' },
    ]
  },
  {
    value: '420200',
    label: '黄石市',
    children: [
      { value: '420202', label: '黄石市黄石港区' },
      { value: '420203', label: '黄石市西塞山区' },
      { value: '420204', label: '黄石市下陆区' },
      { value: '420205', label: '黄石市铁山区' },
      { value: '420222', label: '黄石市阳新县' },
      { value: '420251', label: '黄石市黄石经济开发区' },
      { value: '420281', label: '黄石市大冶市' },
    ]
  },
  {
    value: '420300',
    label: '十堰市',
    children: [
      { value: '420302', label: '十堰市茅箭区' },
      { value: '420303', label: '十堰市张湾区' },
      { value: '420304', label: '湖北省十堰市郧阳区' },
      { value: '420321', label: '十堰市郧县' },
      { value: '420322', label: '十堰市郧西县' },
      { value: '420323', label: '十堰市竹山县' },
      { value: '420324', label: '十堰市竹溪县' },
      { value: '420325', label: '十堰市房县' },
      { value: '420351', label: '十堰市十堰开发区' },
      { value: '420352', label: '十堰市武当山旅游经济开发区' },
      { value: '420381', label: '十堰市丹江口市' },
    ]
  },
  {
    value: '420500',
    label: '宜昌市',
    children: [
      { label: '宜昌市西陵区', value: '420502' },
      { label: '宜昌市伍家岗区', value: '420503' },
      { label: '宜昌市点军区', value: '420504' },
      { label: '宜昌市猇亭区', value: '420505' },
      { label: '宜昌市夷陵区', value: '420506' },
      { label: '宜昌市远安县', value: '420525' },
      { label: '宜昌市兴山县', value: '420526' },
      { label: '宜昌市秭归县', value: '420527' },
      { label: '宜昌市长阳县', value: '420528' },
      { label: '宜昌市五峰县', value: '420529' },
      { label: '宜昌市经济开发区', value: '420551' },
      { label: '宜昌市宜都市', value: '420581' },
      { label: '宜昌市当阳市', value: '420582' },
      { label: '宜昌市枝江市', value: '420583' },
    ]
  },
  {
    value: '420600',
    label: '襄阳市',
    children: [
      { label: '襄阳市襄城区', value: '420602' },
      { label: '襄阳市樊城区', value: '420606' },
      { label: '襄阳市襄州区', value: '420607' },
      { label: '襄阳市南漳县', value: '420624' },
      { label: '襄阳市谷城县', value: '420625' },
      { label: '襄阳市保康县', value: '420626' },
      { label: '襄樊市高新技术产业开发区(襄樊汽车产业开发区)', value: '420651' },
      { label: '襄阳市老河口市', value: '420682' },
      { label: '襄阳市枣阳市', value: '420683' },
      { label: '襄阳市宜城市', value: '420684' },
    ]
  },
  {
    value: '420700',
    label: '鄂州市',
    children: [
      { label: '鄂州市梁子湖区', value: '420702' },
      { label: '鄂州市华容区', value: '420703' },
      { label: '鄂州市鄂城区', value: '420704' },
      { label: '鄂州市葛店经济开发区', value: '420751' },
    ]
  },
  {
    value: '420800',
    label: '荆门市',
    children: [
      { label: '荆门市东宝区', value: '420802' },
      { label: '荆门市掇刀区', value: '420804' },
      { label: '荆门市京山县', value: '420821' },
      { label: '荆门市沙洋县', value: '420822' },
      { label: '荆门市五三农场', value: '420852' },
      { label: '荆门市钟祥市', value: '420881' },
    ]
  },
  {
    value: '420900',
    label: '孝感市',
    children: [
      { label: '孝感市孝南区', value: '420902' },
      { label: '孝感市孝昌县', value: '420921' },
      { label: '孝感市大悟县', value: '420922' },
      { label: '孝感市云梦县', value: '420923' },
      { label: '孝感市孝感经济开发区', value: '420951' },
      { label: '孝感市应城市', value: '420981' },
      { label: '孝感市安陆市', value: '420982' },
      { label: '孝感市汉川市', value: '420984' },
    ]
  },
  {
    value: '421000',
    label: '荆州市',
    children: [

      { label: '荆州市沙市区', value: '421002' },
      { label: '荆州市荆州区', value: '421003' },
      { label: '荆州市公安县', value: '421022' },
      { label: '荆州市监利县', value: '421023' },
      { label: '荆州市江陵县', value: '421024' },
      { label: '荆州市荆州经济开发区', value: '421051' },
      { label: '荆州市石首市', value: '421081' },
      { label: '荆州市洪湖市', value: '421083' },
      { label: '荆州市松滋市', value: '421087' },

    ]
  },
  {
    value: '421100',
    label: '黄冈市',
    children: [

      { label: '黄冈市市辖区', value: '421101' },
      { label: '黄冈市黄州区', value: '421102' },
      { label: '黄冈市团风县', value: '421121' },
      { label: '黄冈市红安县', value: '421122' },
      { label: '黄冈市罗田县', value: '421123' },
      { label: '黄冈市英山县', value: '421124' },
      { label: '黄冈市浠水县', value: '421125' },
      { label: '黄冈市蕲春县', value: '421126' },
      { label: '黄冈市黄梅县', value: '421127' },
      { label: '黄冈市龙感湖管理区', value: '421152' },
      { label: '黄冈市麻城市', value: '421181' },
      { label: '黄冈市武穴市', value: '421182' },

    ]
  },
  {
    value: '421200',
    label: '咸宁市',
    children: [

      { label: '咸宁市咸安区', value: '421202' },
      { label: '咸宁市嘉鱼县', value: '421221' },
      { label: '咸宁市通城县', value: '421222' },
      { label: '咸宁市崇阳县', value: '421223' },
      { label: '咸宁市通山县', value: '421224' },
      { label: '咸宁市温泉经济开发区', value: '421251' },
      { label: '咸宁市赤壁市', value: '421281' },

    ]
  },
  {
    value: '421300',
    label: '随州市',
    children: [
      { value: '421302', label: '随州市曾都区' },
      { value: '421321', label: '随州市随县' },
      { value: '421381', label: '随州市广水市' }
    ]
  },
  {
    value: '422800',
    label: '恩施州',
    children: [

      { label: '恩施州恩施市', value: '422801' },
      { label: '恩施州利川市', value: '422802' },
      { label: '恩施州建始县', value: '422822' },
      { label: '恩施州巴东县', value: '422823' },
      { label: '恩施州宣恩县', value: '422825' },
      { label: '恩施州咸丰县', value: '422826' },
      { label: '恩施州来凤县', value: '422827' },
      { label: '恩施州鹤峰县', value: '422828' },
    ]
  },
  {
    value: '429004',
    label: '仙桃市'
  },
  {
    value: '429005',
    label: '潜江市'
  },
  {
    value: '429006',
    label: '天门市'
  },
  {
    value: '429021',
    label: '神农架'
  },
]


export const queryTypeList = [
  { value: "jgdm", label: '机构代码' },
  { value: "jgdz", label: '注册地址' },
  { value: "njglx", label: '机构类型' },
  { value: "zch", label: '登记号' },
  { value: "fddbr", label: '法定代表人姓名' },
  { value: "zjhm", label: '法定代表人证件号码' },
  { value: "jyfw", label: '经营范围' },
  { value: "njjlx", label: '经济类型' },
  { value: "zcrq", label: '成立日期' },
  { value: "zgmc", label: '主管部门名称' },
  { value: "pzjgmc", label: '批准机构名称' },
  { value: "yzbm", label: '注册地址邮政编码' },
  { value: "dhhm", label: '固定电话号码' },
  { value: "wftzgb", label: '外方投资国别或地区' },
  { value: "zgrs", label: '职工人数' },
  { value: "dec_yyqxz", label: '经营期限自' },
  { value: "dec_yyqxzto", label: '经营期限至' },
  { value: "zczj", label: '注册资本' },
  { value: "bzjgdm", label: '办证机构代码' },
]


export const CityAndDistrict = [
  {
    value: '420100',
    label: '武汉市',
    children: [
      { value: '420101', label: '武汉市市辖区' },
      { value: '420102', label: '武汉市江岸区' },
      { value: '420103', label: '武汉市江汉区' },
      { value: '420104', label: '武汉市硚口区' },
      { value: '420105', label: '武汉市汉阳区' },
      { value: '420106', label: '武汉市武昌区' },
      { value: '420107', label: '武汉市青山区' },
      { value: '420111', label: '武汉市洪山区' },
      { value: '420112', label: '武汉市东西湖区' },
      { value: '420113', label: '武汉市汉南区' },
      { value: '420114', label: '武汉市蔡甸区' },
      { value: '420115', label: '武汉市江夏区' },
      { value: '420116', label: '武汉市黄陂区' },
      { value: '420117', label: '武汉市新洲区' },
      { value: '420151', label: '武汉市经济开发区' },
      { value: '420152', label: '武汉市东湖高新技术开发区' },
    ]
  },
  {
    value: '420200',
    label: '黄石市',
    children: [
      { value: '420202', label: '黄石市黄石港区' },
      { value: '420203', label: '黄石市西塞山区' },
      { value: '420204', label: '黄石市下陆区' },
      { value: '420205', label: '黄石市铁山区' },
      { value: '420222', label: '黄石市阳新县' },
      { value: '420251', label: '黄石市黄石经济开发区' },
      { value: '420281', label: '黄石市大冶市' },
    ]
  },
  {
    value: '420300',
    label: '十堰市',
    children: [
      { value: '420302', label: '十堰市茅箭区' },
      { value: '420303', label: '十堰市张湾区' },
      { value: '420304', label: '湖北省十堰市郧阳区' },
      { value: '420321', label: '十堰市郧县' },
      { value: '420322', label: '十堰市郧西县' },
      { value: '420323', label: '十堰市竹山县' },
      { value: '420324', label: '十堰市竹溪县' },
      { value: '420325', label: '十堰市房县' },
      { value: '420351', label: '十堰市十堰开发区' },
      { value: '420352', label: '十堰市武当山旅游经济开发区' },
      { value: '420381', label: '十堰市丹江口市' },
    ]
  },
  {
    value: '420500',
    label: '宜昌市',
    children: [
      { label: '宜昌市西陵区', value: '420502' },
      { label: '宜昌市伍家岗区', value: '420503' },
      { label: '宜昌市点军区', value: '420504' },
      { label: '宜昌市猇亭区', value: '420505' },
      { label: '宜昌市夷陵区', value: '420506' },
      { label: '宜昌市远安县', value: '420525' },
      { label: '宜昌市兴山县', value: '420526' },
      { label: '宜昌市秭归县', value: '420527' },
      { label: '宜昌市长阳县', value: '420528' },
      { label: '宜昌市五峰县', value: '420529' },
      { label: '宜昌市经济开发区', value: '420551' },
      { label: '宜昌市宜都市', value: '420581' },
      { label: '宜昌市当阳市', value: '420582' },
      { label: '宜昌市枝江市', value: '420583' },
    ]
  },
  {
    value: '420600',
    label: '襄阳市',
    children: [
      { label: '襄阳市襄城区', value: '420602' },
      { label: '襄阳市樊城区', value: '420606' },
      { label: '襄阳市襄州区', value: '420607' },
      { label: '襄阳市南漳县', value: '420624' },
      { label: '襄阳市谷城县', value: '420625' },
      { label: '襄阳市保康县', value: '420626' },
      { label: '襄樊市高新技术产业开发区(襄樊汽车产业开发区)', value: '420651' },
      { label: '襄阳市老河口市', value: '420682' },
      { label: '襄阳市枣阳市', value: '420683' },
      { label: '襄阳市宜城市', value: '420684' },
    ]
  },
  {
    value: '420700',
    label: '鄂州市',
    children: [
      { label: '鄂州市梁子湖区', value: '420702' },
      { label: '鄂州市华容区', value: '420703' },
      { label: '鄂州市鄂城区', value: '420704' },
      { label: '鄂州市葛店经济开发区', value: '420751' },
    ]
  },
  {
    value: '420800',
    label: '荆门市',
    children: [
      { label: '荆门市东宝区', value: '420802' },
      { label: '荆门市掇刀区', value: '420804' },
      { label: '荆门市京山县', value: '420821' },
      { label: '荆门市沙洋县', value: '420822' },
      { label: '荆门市五三农场', value: '420852' },
      { label: '荆门市钟祥市', value: '420881' },
    ]
  },
  {
    value: '420900',
    label: '孝感市',
    children: [
      { label: '孝感市孝南区', value: '420902' },
      { label: '孝感市孝昌县', value: '420921' },
      { label: '孝感市大悟县', value: '420922' },
      { label: '孝感市云梦县', value: '420923' },
      { label: '孝感市孝感经济开发区', value: '420951' },
      { label: '孝感市应城市', value: '420981' },
      { label: '孝感市安陆市', value: '420982' },
      { label: '孝感市汉川市', value: '420984' },
    ]
  },
  {
    value: '421000',
    label: '荆州市',
    children: [

      { label: '荆州市沙市区', value: '421002' },
      { label: '荆州市荆州区', value: '421003' },
      { label: '荆州市公安县', value: '421022' },
      { label: '荆州市监利县', value: '421023' },
      { label: '荆州市江陵县', value: '421024' },
      { label: '荆州市荆州经济开发区', value: '421051' },
      { label: '荆州市石首市', value: '421081' },
      { label: '荆州市洪湖市', value: '421083' },
      { label: '荆州市松滋市', value: '421087' },

    ]
  },
  {
    value: '421100',
    label: '黄冈市',
    children: [

      { label: '黄冈市市辖区', value: '421101' },
      { label: '黄冈市黄州区', value: '421102' },
      { label: '黄冈市团风县', value: '421121' },
      { label: '黄冈市红安县', value: '421122' },
      { label: '黄冈市罗田县', value: '421123' },
      { label: '黄冈市英山县', value: '421124' },
      { label: '黄冈市浠水县', value: '421125' },
      { label: '黄冈市蕲春县', value: '421126' },
      { label: '黄冈市黄梅县', value: '421127' },
      { label: '黄冈市龙感湖管理区', value: '421152' },
      { label: '黄冈市麻城市', value: '421181' },
      { label: '黄冈市武穴市', value: '421182' },

    ]
  },
  {
    value: '421200',
    label: '咸宁市',
    children: [

      { label: '咸宁市咸安区', value: '421202' },
      { label: '咸宁市嘉鱼县', value: '421221' },
      { label: '咸宁市通城县', value: '421222' },
      { label: '咸宁市崇阳县', value: '421223' },
      { label: '咸宁市通山县', value: '421224' },
      { label: '咸宁市温泉经济开发区', value: '421251' },
      { label: '咸宁市赤壁市', value: '421281' },

    ]
  },
  {
    value: '421300',
    label: '随州市',
    children: [
      { value: '421302', label: '随州市曾都区' },
      { value: '421321', label: '随州市随县' },
      { value: '421381', label: '随州市广水市' }
    ]
  },
  {
    value: '422800',
    label: '恩施州',
    children: [

      { label: '恩施州恩施市', value: '422801' },
      { label: '恩施州利川市', value: '422802' },
      { label: '恩施州建始县', value: '422822' },
      { label: '恩施州巴东县', value: '422823' },
      { label: '恩施州宣恩县', value: '422825' },
      { label: '恩施州咸丰县', value: '422826' },
      { label: '恩施州来凤县', value: '422827' },
      { label: '恩施州鹤峰县', value: '422828' },
    ]
  },
  {
    value: '429004',
    label: '仙桃市'
  },
  {
    value: '429005',
    label: '潜江市'
  },
  {
    value: '429006',
    label: '天门市'
  },
  {
    value: '429021',
    label: '神农架'
  },
]
