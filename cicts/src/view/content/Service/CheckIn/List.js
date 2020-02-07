import React,{Component} from 'react';
import {Divider,Popconfirm,message,Spin,Modal} from 'antd';
import NewTableSearch from '../../../component/table/NewTableSearch';
import { getService,postService } from '../../myFetch.js';
import API_PREFIX from '../../apiprefix';
import {BEGIN} from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
import {ImportPart} from '../../PartyBuildGarden/PartyMembers/PartyMembers';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
export default class PartyApply extends Component{

    constructor(props){
        super(props);
        this.state={
            // partyOrganizationDatas: [],    //党组织机构数据
            loading: false,
            totalNum:0,
            data:[],
            showImportModal:false,//用户导入modal
        }
    }

    componentWillMount() {
      // this.setState({ loading: true });
      //   //获取党组织数据
      //   getService(API_PREFIX + 'services/system/partyOrganization/partyOrganizationList/get', data => {
      //     console.log('党组织数据：', data);
      //     let pOrgs = data.root.list;
      //     if (pOrgs) {
      //       //调用接口数据处理函数
      //       this.getPartyOrganationData(pOrgs);
      //       this.setState({
      //         partyOrganizationDatas: pOrgs,
      //         loading: false,
      //       });
    
      //     }else{
      //       message.error(data.retMsg);
      //       this.setState({ loading: false });
      //     }
      //   }
      //   );
    
      // }
      // //递归取出接口返回的党组织的数据
      // getPartyOrganationData(poData) {
      //   poData.map((item, index) => {
      //     item.value = item.id;
      //     item.label = item.name;
      //     item.children = item.partyOrganizationList;
      //     if (item.partyOrganizationList) {//不为空，递归
      //       this.getPartyOrganationData(item.partyOrganizationList);
      //     }
      //   });
      }
    componentDidMount(){
    }
    dealData=()=>{
      //获取转出党员信息
      getService(API_PREFIX+'services/system/partyMenOut/get/list/1/10',(data)=>{
        if(data.retCode===1){
          this.setState({totalNum:data.root.totalNum,data:data.root.list});
        }
      });
    }
    //控制用户导入的modal的显示或者隐藏
  showImportModal=()=>{
    this.setState({
      showImportModal:true,
      keyImportModal:this.state.keyImportModal
    })
  }
  //用户导入 确定的点击事件
  handleImportModalOk=()=>{
    this.setState({
      showImportModal:false,
    });
    this.props.getData(API_PREFIX+`services/servicemanager/attendance/queryAttendance/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
  }
  //用户导入 取消的点击事件
  handleImportModalCancel=()=>{
    this.setState({
      showImportModal:false,
    })
  }
  hideModel = (v) => {
    this.setState({showImportModal: v})
  }
  
  getData = async (url) => {
    await this.props.getData(API_PREFIX + `${url}`);
  }
    render(){
        let powers = this.props.powers;
        console.log('权限码', powers);
        let hasAddPower = powers && powers['20888.22004.001'];
        let hasDelPower = powers && powers['20888.22004.004'];
        let hasEditPower = powers && powers['20888.22004.002'];
        let hasSearchPower = powers && powers['20888.22004.003'];
        let hasImportPower=powers&&powers['20888.22005.201'];
        let hasSendEmailPower = powers&&powers['20888.22004.205'];
        const columns=[
            {
              title: '员工号',
              key: 'userNo',
              dataIndex: 'userNo',
              width: 100,
              fixed: 'left'
            },
            {
              title: '员工姓名',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '岗位名称',
              dataIndex: 'post',
              key: 'post',
            },
            {
              title: '职业类别',
              dataIndex: 'postType',
              key: 'postType',
            },
            {
              title: '交通费标准',
              dataIndex: 'dayTrafficFee',
              key: 'dayTrafficFee',
            },
            {
              title: '请假天数',
              dataIndex: 'leaveDays',
              key: 'leaveDays',          
            },
            {
              title: '出差天数',
              dataIndex: 'tripDays',
              key: 'tripDays',
            },
            {
              title: '异常天数',
              dataIndex: 'abnormalDays',
              key: 'abnormalDays',
            },
            {
              title: '核减扣除标准',
              dataIndex: 'trafficFee',
              key: 'trafficFee',
            },
            {
              title: '实发交通费',
              dataIndex: 'reimburseAmount',
              key: 'reimburseAmount',
            },
            {
              title: '考勤年月',
              dataIndex: 'attendanceDate',
              key: 'attendanceDate',
            },
            {
              title: '备注(请假、出差、异常时间)',
              dataIndex: 'remarks',
              key: 'remarks',
              render:(text, record)=>{
                return record.remarks === '无异常' ? '--' : record.remarks
              }
            },
            {
              title: '是否邮件通知',
              dataIndex: 'isEmail',
              key: 'isEmail',
              render: (text, record) => {
                return record.isEmail === 0 ? '未发送' : '已发送'
              }
            },
            {
              title: '信息异常备注',
              dataIndex: 'reasons',
              key: 'reasons',
              render:(text, record)=>{
                return record.reasons ? record.reasons : '--'
              }
            },
            {
              title: '创建日期',
              dataIndex: 'createDate',
              key: 'createDate',
            },
            // {
            //   title: '操作',
            //   dataIndex: 'operation',
            //   key: 'operation',
            //   width:100,
            //   fixed: 'right',
              
            //   render:(data,record)=>(
            //       <div>
            //         {/* <Divider type="vertical" /> */}
            //         {/* <a className='operation' onClick={() => location.hash = `/SystemSettings/Edit?isEdit=true&userid=${record.id}`} >编辑</a> */}
            //         {/* <Divider type="vertical"/>
            //         <a className='operation' onClick={()=>this.applyParty(record) } >详情</a>
            //         <Divider type="vertical"/> */}
            //       </div>
            //     )
            // },
          ];
          const search = [
            { key: 'name', label: '姓名',qFilter:'Q=name_LK',type:'input'},
            // { key: 'partyid',label: '党组织名称',qFilter: 'Q=partyId_S_ST',  type: 'cascader',option: this.state.partyOrganizationDatas,
            //   },
            { key: 'userno', label: '工号',qFilter:'Q=userno_LK',type:'input'},
            // { key: 'email', label: '邮箱',qFilter:'Q=email_LK',type:'input'},
            // { key: 'mobile', label: '手机号',qFilter:'Q=mobile_LK',type:'input'},
            { key: 'attendancedate',label: '考勤时间',type:'rangePicker',isMont:'monthPicker'},
          ];
        return(
          <Spin spinning={this.state.loading}>
            <div>
                <NewTableSearch
                    rowkey={'id'}
                    columns={columns}
                    search={search}
                    url={'services/servicemanager/attendance/queryAttendance'}
                    deleteBtn={hasDelPower ?{order:4,url:'services/servicemanager/attendance/deleteAttendace',field:'idList'}: null}
                    customBtn={hasImportPower?{ order: 2, label: '导入', onClick: this.showImportModal, className: 'resetBtn' }: null}
                    sendEmailBtn={hasSendEmailPower?{ order: 2, label: '重新发送邮件', className: 'resetBtn' }: null}
                ></NewTableSearch>
                <Modal
                  title="考勤信息导入"
                  cancelText="返回"
                  okText="确定"
                  visible={this.state.showImportModal}
                  onOk={this.handleImportModalOk}
                  onCancel={this.handleImportModalCancel}
                  destroyOnClose={true}
                  footer={null}
                >
                <ImportPart importUrl='services/servicemanager/import/attendanceImport' downlodUrl={API_PREFIX + 'services/servicemanager/attendance/attendanceTemplate'}
                                listurl={'services/servicemanager/attendance/queryAttendance'}
                                pageData={this.props.pageData}
                                getData={this.getData}
                                fileName='考勤信息模板'
                                hideModel={this.hideModel}
                  />
                </Modal>
            </div>
          </Spin>  
        )
    }



}