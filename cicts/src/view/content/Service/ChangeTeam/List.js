import React,{Component} from 'react';
import {Divider,Popconfirm,message,Spin,Modal} from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
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
            partyOrganizationDatas: [],    //党组织机构数据
            loading: false,
            totalNum:0,
            data:[],
            showImportModal:false,//用户导入modal
        }
    }

    componentWillMount() {
      this.setState({ loading: true });
        //获取党组织数据
        getService(API_PREFIX + 'services/system/partyOrganization/partyOrganizationList/get', data => {
          console.log('党组织数据：', data);
          let pOrgs = data.root.list;
          if (pOrgs) {
            //调用接口数据处理函数
            this.getPartyOrganationData(pOrgs);
            this.setState({
              partyOrganizationDatas: pOrgs,
              loading: false,
            });
    
          }else{
            message.error(data.retMsg);
            this.setState({ loading: false });
          }
        }
        );
    
      }
      //递归取出接口返回的党组织的数据
      getPartyOrganationData(poData) {
        poData.map((item, index) => {
          item.value = item.id;
          item.label = item.name;
          item.children = item.partyOrganizationList;
          if (item.partyOrganizationList) {//不为空，递归
            this.getPartyOrganationData(item.partyOrganizationList);
          }
        });
      }
    
    dealData=()=>{
      //获取转出党员信息
      getService(API_PREFIX+'services/servicemanager/PartyElectionInfo/selectPartyElectionIfon/1/10',(data)=>{
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
      this.props.getData(API_PREFIX+`services/system/systemAndCompanyUser/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
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
      let hasAddPower = powers && powers['20888.22003.001'];
      let hasDelPower = powers && powers['20888.22003.004'];
      let hasEditPower = powers && powers['20888.22003.002'];
      let hasSearchPower = powers && powers['20888.22003.003'];
      let hasImportPower=powers&&powers['20888.22005.201'];
        const columns=[
            {
              title: '编号',
              key: 'id',
              dataIndex: 'id',
              width: 100,
              fixed: 'left'
            },
            {
              title: '党总支名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '上次换届时间',
              dataIndex: 'lastElectionTime',
              key: 'lastElectionTime',
            },
            {
              title: '下次换届时间',
              dataIndex: 'nextElectionTime',
              key: 'nextElectionTime',
            },
            {
              title: '选举时间间隔',
              dataIndex: 'intervals',
              key: 'intervals',
            },
            {
              title: '选举预提醒时间',
              dataIndex: 'reminderTime',
              key: 'reminderTime',          
            },
            {
              title: '提醒次数',
              dataIndex: 'reminderCount',
              key: 'reminderCount',
            },
            {
              title: '提醒职务',
              dataIndex: 'remindeDuty',
              key: 'remindeDuty',
              render: (text, record) => {
                return <div>
                  {record.remindeDuty==='1'?'党组织委员':null}
                  {record.remindeDuty==='2'?'上级党组织委员':null}
                </div>
              },
            },
            {
              title: '提醒对象',
              dataIndex: 'remindeObject',
              key: 'remindeObject',
              render: (text, record) => {
                return <div>
                  {record.remindeObject==='1'?'党组织委员':null}
                  {record.remindeObject==='2'?'上级党组织委员':null}
                </div>
              },
            },
            {
              title: '提醒方式',
              dataIndex: 'push',
              key: 'push',
              render: (text, record) => {
                return <div>
                  {record.push===false?'-':null}
                  {record.push===true?'信科视界推送':null}
                </div>
              },
            }
          ];
        return(
          <Spin spinning={this.state.loading}>
            <div>
                    <TableAndSearch
                        rowkey={'id'}
                        columns={columns}
                        url={'services/servicemanager/PartyElectionInfo/selectPartyElectionIfon'}
                        addBtn={hasAddPower ?{order:1,url:'/Service/ChangeTeamList/ChangeTeamAdd?isEdit=false'}: null}
                        deleteBtn={hasDelPower ?{order:4,url:'services/servicemanager/PartyElectionInfo/deletePartyElectionIfon',field:'idList'}: null}
                        customBtn={hasImportPower?{ order: 2, label: '导入', onClick: this.showImportModal, className: 'resetBtn' }: null}
                    ></TableAndSearch>
                    <Modal
                      title="党支部换届提醒导入"
                      cancelText="返回"
                      okText="确定"
                      visible={this.state.showImportModal}
                      onOk={this.handleImportModalOk}
                      onCancel={this.handleImportModalCancel}
                      footer={null}
                      destroyOnClose={true}
                    >
                    <ImportPart importUrl='services/servicemanager/import/partyElectionInfoImport' downlodUrl={API_PREFIX + 'services/servicemanager/PartyElectionInfo/partyElectionTemplate'}
                        listurl={'services/servicemanager/PartyElectionInfo/selectPartyElectionIfon'}
                        pageData={this.props.pageData}
                        getData={this.getData}
                        fileName='党支部换届提醒模板'
                        hideModel = {this.hideModel}
                      />
                    </Modal>
            </div>
          </Spin>  
        )
    }



}