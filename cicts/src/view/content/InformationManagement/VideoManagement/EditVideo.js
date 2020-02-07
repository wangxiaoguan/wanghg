import React, { Component } from 'react';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import FormAndInput from '../../../component/table/FormAndInput';
import {Modal,message} from 'antd';
import { GetQueryString, getService, postService } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import {pageJummps} from '../PageJumps';
import { connect } from 'react-redux';
import { BEGIN, getPageData } from '../../../../redux-root/action/table/table';
import { setSelectTreeData, setCheckTreeData, } from '../../../../redux-root/action/tree/tree';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData: state.table.pageData,
    selectRowsData: state.table.selectRowsData,
    checkTreeData: state.tree.treeCheckData,
    selectDetail: state.tree.treeSelectData.selectDetail,
    selectTreeData: state.tree.treeSelectData,
    timePushData: state.flowData.timePushData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    setSelectData: n => dispatch(setSelectTreeData(n)),
    setCheckData: n => dispatch(setCheckTreeData(n)),
    getPageData:n=>dispatch(getPageData(n)),
  })
)
class EditVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newsTypeOptions: [],//文章类型(lookup字典中)
      dp: [],//其他设置积分提供方
      newsId: GetQueryString(location.hash, ['newsId']).newsId,//获取前一个页面传过来的id
      newsData: {},//详情中的数据
      releaseRange: [],//发布范围中处理后的数据
      department: [],//发布范围中处理后的部门数据
      partyid: [],//发布范围中处理后的部门数据
      groups: [],//发布范围中处理后的部门数据
      showAddModal: false,//展示作者列表，数据来源于用于管理
      keyAddModal: 1,//作者列表的key值
      inputValue: '',//查询时输入框的内容
      selectedRowKeys: [],//当前选中
      currentValue: '',//文章归属  单选按钮选中的值
      set: function () { },
      categoryIdList: [],//编辑时选中的栏目
      update: 0,
      authorOption: [],
      partyRootId: '',
      dpRootId: '',
      publishModal: false,//内容发布
      submithModal: false,//提交审核
      allData: [],
      submitTxt: '',
      orgName: '',
      allvalue: '',
      type: '',
      taskIdUpdate:'',//更新时，获取到的任务id
      reviewerList:[],
      qfilter: '', // yelu 2019-01-16 添加作者查询条件字段 
      valueOne:1,
      valueTwo:0,
      //三个步骤对象
      steps: [
        {
          title: '填写视频信息',
          content:[
            { key: 'title', label: '视频标题', type: 'input', required: true, max: 60 },
            { key: 'digest', label: '视频摘要', type: 'input' },
            {
              key: 'auth', label: '作者', type: 'infoAuth', disabled: true, ButtonList: [
                { key: 'auth', label: '添加作者', type: 'Button', onClick: this.addAuthor },
                { key: 'auth', label: '删除作者', type: 'Button', onClick: this.deleteAuthor },
              ]},
            { key: 'orgType', label: '资讯归属', type: 'infoBelong', required: true,option:infoOption},
            { key: 'orgId', label: '归属选择', type: 'infoBelongSelect', required: true},
            // { key: 'layout', label: '布局形式', type: 'radioButton', option:layoutOption ,required: true },
            { key: 'titleImage', label: '标题图片', type: 'uploadPicture_drop',required: true,isIamge:true},
            { key: 'contentImage', label: '内容图片', type: 'filePicture',required: true,isIamge:true,datatype:'video'},
            { key: 'content', label: '视频内容', type: 'richText',required:false},
            { key: 'categoryIdList', label: '所属栏目', type: 'infoColumnTree', required: true },
            { key: 'video', label: '视频地址', type: 'video', required:true},
            { key:'url'},
            { key:'desp'},
            { key:'videoLong'},
            { key:'orgType'},//资讯归属
            { key:'orgId'},//归属选择
            { key:'depCategory'},
            { key:'remark'}
          ],
          updateUrl: pageJummps.VideoEditOne,
          data: {},
        },
        {
          title: '选择发布范围',
          content: '',
          url: pageJummps.InfoAuthorityAdd,
          data: {}
        },
        {
          title: '其他设置',
          content:[
            { key: 'point', label: '奖励经验值数', type: 'inputNumber' },
            // { key: 'treasure', label: '奖励积分数', type: 'inputNumber' },
            // { key: 'treasureProvider', label: '积分提供方', type: 'cascader', options: [] },
            { key: 'isComment', label: '是否可评论', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isNickComment', label: '是否可匿名评论', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isShare', label: '是否可分享',  type: 'radioButton', option: isOrNotOption , required: true},
            { key: 'isInnerShare', label: '是否只能内部转发', type: 'radioButton', option: isOrNotOption , required: true},
            { key: 'isHomePage', label: '是否上首页',  type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isPush', label: '是否推送',  type: 'radioButton', option: isOrNotOption , required: true},
            { key: 'isTimePublish', label: '是否定时发送', type: 'isTimePublish', required: true },
            { key: 'isImportant', label: '是否永不清理', type: 'radioButton', option: isOrNotOption , required: true },
          ],
          url: pageJummps.VideoEditThree,
          data: {}
        },
      ],
    }
  }

  componentDidMount() {
    //页面相关的数据处理
    this.dealData();
    Promise.all([this.getData(),this.getAuth()]).then(data=>{
      let temp= [...this.state.steps];
      let allData = {...data[0],...data[1],orgId:data[0]['orgTreePath']}
      allData['desp'] = allData.newsAttachs[0].desp
      allData['videoLong'] = allData.newsAttachs[0].videoLong
      if(allData['departments'].length||allData['partys'].length||allData['groups'].length||allData['unions'].length){
        this.setState({valueOne:2});
      } 
      if(allData['companyList'].length){
        let tenantId = window.sessionStorage.getItem('tenantId');
        if(allData.companyList.indexOf(tenantId)>-1){
          this.setState({valueTwo:1});
        }else{
          this.setState({valueTwo:2});
        }
      }
      temp[0].data = allData; 
      temp[1].data = allData; 
      temp[2].data = allData; 
      this.setState({orgName:allData.orgName,steps:temp,update:this.state.update+1});
    })
  }
  componentWillUnmount() {
    sessionStorage.removeItem('eventAndInfoKey') //yelu 移除session中保存的权限设置tab对应的key值
  }
  getData = () =>{
    return new Promise((pass,fail)=>{
      getService(API_PREFIX+`${pageJummps.VideoDetail}/${this.state.newsId}`,data=>{
        if(data.status===1){
          pass(data.root.object)
        }else{
          message.error(data.errorMsg)
        }
      })
    })
  }
  getAuth = () => {
    return new Promise((pass,fail)=>{
      postService(API_PREFIX+`${pageJummps.InfoAuthorityDetail}/${this.state.newsId}`,{},data=>{
        if(data.status===1){
          pass(data.root.object)
        }else{
          message.error(data.errorMsg)
        }
      })
    })
    
  }
  getCompany = () => {
    return new Promise((pass,fail)=>{
      getService(API_PREFIX+`${pageJummps.companyUrl}`,data=>{
        if(data.status===1){
          let companyData = data.root.object;
          let unionCheckedKeys = []
            for (let index = 0; index < companyData.length; index++) {
              let node = companyData[index];
              node.key = node.id;
              unionCheckedKeys.push(node.id)
            }
            pass(unionCheckedKeys)
        }else{
          message.error(data.errorMsg)
        }
      })
    })
  }
  dealData = () => {
    //获取部门(积分提供方)
    // getService(API_PREFIX + pageJummps.DepartmentTree, data => {
    //   if (data.status === 1) {
    //     let organizationData = data.root.list;
    //     this.dealDepartmentData(organizationData);
    //     this.setState({ dp: organizationData}, () => {
    //       let temp = [...this.state.steps];
    //       // temp[2].content[2].option =organizationData;
    //       this.setState({ steps: temp, update: this.state.update + 1 });
    //     });
    //   }
    // });
  }

  //处理部门的数据
  dealDepartmentData(data) {
    data && data.map((item, index) => {
      item.value = item.id + '';
      item.label = item.name;
      item.children = item.subCompanyOrgList;
      if (item.subCompanyOrgList) {
        this.dealDepartmentData(item.subCompanyOrgList);
      }
    });
  }

  //添加作者
  addAuthor = (key, get, set) => {
    localStorage.setItem("selectedRowKeys", '')
    this.setState({showAddModal: true,keyAddModal: this.state.keyAddModal + 1,set});
  }

  //删除作者
  deleteAuthor = (key, get, set) => {
    set(key, '');
  }

  //展示添加作者modal  点击确定
  handleAddModalOK = () => {
    this.setState({ showAddModal: false });
    let selectedData = this.props.selectRowsData;
    this.state.set('auth',selectedData[0].name);
  }

  //展示添加作者modal 点击取消
  handleAddModalCancel = () => {
    this.setState({ showAddModal: false });
  }

  //新增作者时输入框输入值的变化
  handleInput = (e) => {
      let qfilter = e.target.value == '' ? '' : `Q=name=${e.target.value}` 
      this.setState({qfilter})
      this.props.getPageData({currentPage: 1, pageSize: 10, query: qfilter}); 
      this.props.getData(API_PREFIX+`${pageJummps.InfoAuthor}/1/10?${qfilter}`);
  }

    render(){
      const columns = [
        {
          title: '员工号',
          dataIndex: 'userNo',
          key: 'userNo',
        },
  
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          key: 'mobile',
        },
        {
          title: '部门',
          dataIndex: 'fullName',
          key: 'fullName',
        },
      ];
    const timePush = {
      body: {
          "name": "视频资讯定时发布任务",
          "type": "41",
          "runTime": "2019-08-23 15:39:08",
          "queryType": "post",
          "queryUrl": API_PREFIX+pageJummps.VideoPush,
          "queryValue": "{}",
          "queryContentType": "application/json"
      },
    };
      return(
          <div>
            <EventAndInfoAdd
                key={this.state.update}
                type="information"
                steps={this.state.steps}
                style="edit"
                id={{ id:this.state.newsId}}
                save={`/InformationManagement/Video?tabsVale=${sessionStorage.getItem('videoTabsKey')}`}//添加返回到所在页面的tab字段xwx2018/12/20
                timePush={timePush}
                belonged="video"
                partyRootId={this.state.partyRootId}
                dpRootId={this.state.dpRootId}
                datatype={'video'}
                saveReturn={'saveReturn'}
                saveKeep={'save'}
                valueOne={this.state.valueOne}
                valueTwo={this.state.valueTwo}
                orgName={this.state.orgName}
                getUrl={`${pageJummps.VideoDetail}/${this.state.newsId}`}
            >
            </EventAndInfoAdd>
            <Modal
              width={1000}
              title="添加作者"
              visible={this.state.showAddModal}
              cancelText="取消"
              okText="添加"
              onOk={this.handleAddModalOK}
              onCancel={this.handleAddModalCancel}
              destroyOnClose={true}
            >
              <FormAndInput
                columns={columns}
                url={pageJummps.InfoAuthor}
                onSearch={this.handleInput}
                qfilter={this.state.qfilter}
              />
            </Modal>
          </div>
    );
  }

}
//布局形式
const layoutOption = [
  { label: '左右', value: 1 },
  { label: '上下', value: 2 },
];
const isOrNotOption = [
  { label: '是', value: true },
  { label: '否', value: false },
];
const infoOption = [
  { label: '按照企业部门归属', value: 1 },
  { label: '按照党组织归属', value: 2 },
  { label: '按照工会归属', value: 3 },
]

export default EditVideo;