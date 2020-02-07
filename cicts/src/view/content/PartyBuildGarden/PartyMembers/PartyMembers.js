import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { Button, Row, Col, Modal, Upload, Message, Divider, message, Spin} from 'antd';
import PartyFeeExportForm from './PartyFeeExportForm';
import PartyLivenessExportForm from './PartyLivenessExportForm';
import { getService } from '../../myFetch.js';
import API_PREFIX from '../../apiprefix';
import './PartyMembers.less';
import { postService } from '../../myFetch.js';
import { BEGIN } from '../../../../redux-root/action/table/table';
import { connect } from 'react-redux';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData: state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)

class PartyMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPartyFeeImportModal: false,//是否显示党费导入的modal
      keyPartyFeeImportModal: 100,//党费导入的key值
      showBeforeImortIcon: false,//党费导入过程中显示的图标
      showPartyFeeExmportModal: false,//是否显示党费导出的modal
      keyPartyFeeExportModal: 200,//党费导出的key值

      showNewPartyImportModal: false,//新党员导入
      keyNewPartyImportModal: 300,//新党员导入的key值

      showPartyLivenessModal: false,//是否显示党员活跃度的导出按钮
      keyPartyLivenessModal: 500,

      selectedValues: '',   //所属党组织  用来做过滤查询，所以是级联选择的内容最后一级  （value）
      partyOrganizationDatas: [],    //党组织机构数据
      loading: false,
    };
  }
  componentWillMount() {
    this.setState({ loading: true });
    //获取党组织数据
    getService(API_PREFIX + 'services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1', data => {
      console.log('党组织数据：', data);
      let pOrgs = data.root.object;
      if(data.status === 1) {
        this.getPartyOrganationData(pOrgs);
        this.setState({
          partyOrganizationDatas: pOrgs,
          loading: false,
        });
      }else{
        message.error(data.errorMsg);
        this.setState({ loading: false });
      }
    });

  }
  //递归取出接口返回的党组织的数据
  getPartyOrganationData(poData) {
    poData.map((item, index) => {
      item.value = item.id;
      item.label = item.partyName;
      item.children = item.partyOrgList;
      if (item.partyOrgList) {//不为空，递归
        this.getPartyOrganationData(item.partyOrgList);
      }
    });
  }
  //控制展示党费的modal
  showPartyFeeImportModal = () => {
    this.setState({
      showPartyFeeImportModal: true,
      keyPartyFeeImportModal: this.state.keyPartyFeeImportModal + 1,
    });
  }
  //党费导入的确认点击事件
  handlePartyFeeImportModalOK = () => {
    this.setState({
      showPartyFeeImportModal: false,
    });
  }
  //党费导入的取消点击事件
  handlePartyFeeImportModalCancel = () => {
    this.setState({
      showPartyFeeImportModal: false,
    });
  }
  //党费导出的事件处理
  showPartyFeeExmportModal = () => {
    this.setState(
      {
        showPartyFeeExmportModal: true,
        keyPartyFeeExportModal: this.state.keyPartyFeeExportModal + 1,
      }
    );
  }
  //党费导出的确定按钮点击事件
  handlePartyFeeExportModalOK = () => {
    this.setState(
      {
        showPartyFeeExmportModal: false,
      }
    );
  }
  //党费导出的取消按钮点击事件
  handlePartyFeeExportModalCancel = () => {
    this.setState(
      {
        showPartyFeeExmportModal: false,
      }
    );
  }
  //控制展示党员活跃度展示的modal
  showPartyLivenessModal = () => {
    this.setState(
      {
        showPartyLivenessModal: true,
        keyPartyLivenessModal: this.state.keyPartyLivenessModal,
      }
    );
  }
  //党员活跃度modal 确认的点击事件
  handlePartyLivenessModalOK = () => {
    this.setState(
      {
        showPartyLivenessModal: false,
      }
    );
  }
  //党员活跃度modal 取消的点击事件
  handlePartyLivenessModalCancel = () => {
    this.setState(
      {
        showPartyLivenessModal: false,
      }
    );
  }
  //控制展示新党员导入展示的modal
  showNewPartyImportModal = () => {
    this.setState({
      showNewPartyImportModal: true,
      keyNewPartyImportModal: this.state.keyNewPartyImportModal,
    });

  }
  //新党员导入 确定的点击事件
  handleNewPartyImportModalOk = () => {
    this.setState({
      showNewPartyImportModal: false,
    });
  }
  //新党员导入 取消的点击事件
  handleNewPartyImportModalCancel = () => {
    this.setState({
      showNewPartyImportModal: false,
    });
  }
  //所属党组织    级联选择后，处理：获取对应的   id
  handleCheckChange = (value) => {
    console.log('级联中的value：', value);
    this.setState({
      selectedValues: value ? value.toString() : '',
    }, () => {
      console.log('级联中的this.state.selectedValues：', this.state.selectedValues);
    });

  }
  getData = async (url) => {
    await this.props.getData(API_PREFIX + `${url}`);
  }
  //党费同步
  syncPartyFee = () => {
    getService(API_PREFIX + 'services/web/party/fee/syncPartyFee', data => {
      if (data.status === 1) {
        message.success('党费同步成功');
      } else {
        message.error(data.errorMsg)
      }
    });

  }
  render() {
    let powers = this.props.powers;
    console.log('权限码', powers);
    let hasAddPower = powers && powers['20005.23007.001'];
    let hasDelPower = powers && powers['20005.23007.004'];
    let hasEditPower = powers && powers['20005.23007.002'];
    let hasSearchPower = powers && powers['20005.23007.003'];
    let hasExportPower = powers && powers['20005.23007.202'];
    let hasImportPower = powers && powers['20005.23007.201'];
    //党费权限
    let feeExportPower =  powers && powers['20005.23004.202'];
    let feeEditPower =  powers && powers['20005.23004.002'];
    let feeSearchPower =  powers && powers['20005.23004.003'];
    let feeImportPower =  powers && powers['20005.23004.201'];
    let feeDelPower = powers && powers['20005.23004.004'];
    let hasSyncPower = powers && powers['20005.23004.203'];
    console.log('aa', this.state.showPartyFeeImportModal);
    const columns = [
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        width: 100,
        fixed: 'left',
      }, {
        title: '员工工号',
        dataIndex: 'userNo',
        key: 'userNo',
        width: 100,
        fixed: 'left',
      }, {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        width: 100,
      },{
        title: '党组织',
        dataIndex: 'fullName',
        key: 'fullName',
      }, {
        title: '政治面貌',
        dataIndex: 'stateName',
        key: 'stateName',
        width: 80,
      },
      {
        title: '入党时间',
        dataIndex: 'joinDate',
        key: 'joinDate',
        width: 150,
        render:(text,record)=>{
          return <span>
            {
              record.joinDate&&record.joinDate.substr(0,10)
            }
          </span>;
        },
      }, {
        title: '职务',
        dataIndex: 'postName',
        key: 'postName',
      },
      {
        title: '是否注册',
        dataIndex: 'isRegister',
        key: 'isRegister',
        render: (text, record) => {
          if(record.isRegister == 1) {
            return '是'
          }else {
            return '否'
          }
        }
      }, {
        title: '最后更新时间',
        dataIndex: 'lastUpdateDate',
        key: 'lastUpdateDate',
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 250,
        render: (data, record) => (

          <div>
            <a className="operation" disabled={!hasEditPower} onClick={() => location.hash = `/PartyBuildGarden/NewEditPartyMember?isEdit=true&userid=${record.id}&userNo=${record.userNo}`} >编辑</a>
            <Divider type="vertical" />
            <a className="operation" disabled={!feeSearchPower} onClick={() => location.hash = `/PartyBuildGarden/PartyFeeManagement?userid=${record.id}&userNo=${record.userNo}`}>党费管理</a>
            {/*<Divider type="vertical" />*/}
          </div>
        ),
      },
    ];
    const search = [
      { key: 'userName', label: '姓名', qFilter: 'Q=userName', type: 'input' },
      {
        key: 'partyId',
        label: '所属党组织',
        qFilter: 'Q=partyId',
        type: 'cascader',
        option: this.state.partyOrganizationDatas,
      },
      { key: 'mobile', label: '手机号', qFilter: 'Q=mobile', type: 'input' },
      { key: 'userNo', label: '员工号', qFilter: 'Q=userNo', type: 'input' },
    ];
    const refreshScreen=()=>{
      this.setState({
        showPartyFeeImportModal: false,
      });
    };
    const refreshScreenModalClose=()=>{
      this.setState({
        showNewPartyImportModal: false,
      });
    };
    return (
      // <Spin spinning={this.state.loading}>
        <div>
          <TableAndSearch columns={columns} search={search} url={'services/web/party/partyUser/getFullList/-1'} styleType={'PartyMembers'}
            addBtn={hasAddPower ? { order: 1, url: '/PartyBuildGarden/NewPartyMember?isEdit=false' } : null} exportBtn={hasExportPower ? { order: 3, url: 'services/web/party/partyUser/exportPartyMem/-1', type: '党员信息',request: 'get' } : null} deleteBtn={hasDelPower ? { order: 4, url: 'services/web/party/partyUser/deletePartyMem', field: '' } : null} customBtn={hasImportPower ? { order: 2, label: '导入', onClick: this.showNewPartyImportModal, className: 'resetBtn' } : null}
            rowkey={'id'}
            urlfilter='Q=state=1,2'
            scroll={{ width: 1600 }}
          >
            <Row style={{ position: "relative", left: "34%", top: "41px" }}>
              <Col>
                <Button disabled={!feeImportPower} className="resetBtn" onClick={this.showPartyFeeImportModal} type="primary">党费导入</Button>
                <Button className="resetBtn" disabled={!feeExportPower} onClick={this.showPartyFeeExmportModal} type="primary">党费导出</Button>
                <Button className="resetBtn" disabled={!hasSyncPower} onClick={this.syncPartyFee} >党费同步</Button>
              </Col>
              {/*<Col span={2}>*/}
              {/*<Button className="resetBtn">党费催缴</Button>*/}
              {/*</Col>*/}
              {/* <Col span={3} style={{marginLeft:'-30px'}}>
                <Button disabled={!hasExportPower} className="resetBtnCopy" onClick={this.showPartyLivenessModal} type="primary">党员活跃度导出</Button>
              </Col> */}
              {/* <Col span={2}>
                <Button className="resetBtn" onClick={this.showNewPartyImportModal} type="primary">导入</Button>
              </Col> */}
              {/*<Col span={3}>*/}
              {/*<Button>导出</Button>*/}
              {/*</Col>*/}


            </Row>
          </TableAndSearch>
          <Modal
            title="党费导入"
            cancelText="返回"
            okText="确定"
            visible={this.state.showPartyFeeImportModal}
            onOk={this.handlePartyFeeImportModalOK}
            onCancel={this.handlePartyFeeImportModalCancel}
            destroyOnClose={true}
            footer={null}
          >
            <ImportPart importUrl="services/web/party/fee/importPartyFee"
              downlodUrl={API_PREFIX + 'services/web/party/fee/exportPartyFeeTemplate'}
              fileName='党费信息模板'
              refreshScreen={refreshScreen}
              type='partyMembers'
            />
          </Modal>
          <Modal
            title="党费导出"
            visible={this.state.showPartyFeeExmportModal}
            // onOk={this.handlePartyFeeExportModalOK}
            onCancel={this.handlePartyFeeExportModalCancel}
            pageData={this.props.pageData}
            footer={null}
            destroyOnClose={true}
          >
            <PartyFeeExportForm ok={this.handlePartyFeeExportModalOK} cancel={this.handlePartyFeeExportModalCancel} />
          </Modal>

          <Modal
            title="党员活跃度导出"
            visible={this.state.showPartyLivenessModal}
            onCancel={this.handlePartyLivenessModalCancel}
            footer={null}
            destroyOnClose={true}
          >
            <PartyLivenessExportForm ok={this.handlePartyLivenessModalOK} cancel={this.handlePartyLivenessModalCancel} flag="point" />
          </Modal>
          <Modal
            title="党员导入"
            cancelText="返回"
            okText="确定"
            visible={this.state.showNewPartyImportModal}
            onOk={this.handleNewPartyImportModalOk}
            onCancel={this.handleNewPartyImportModalCancel}
            footer={null}
            destroyOnClose={true}
          >
            <ImportPart importUrl="services/web/party/partyUser/importPartyUser" downlodUrl={API_PREFIX + 'services/web/party/partyUser/exportPartyUserTemplate'}
              listurl={'services/web/party/partyUser/getFullList/-1'}
              pageData={this.props.pageData}
              getData={this.getData}
              fileName='党员信息模板'
              refreshScreenModalClose={refreshScreenModalClose}
              type='partyMembers'
            />

          </Modal>

        </div>
      // </Spin>        
    );

  }
}

export default PartyMembers;
//党费导入和新党员导入时，页面一致的提取部分    区别在于action的值不一样==》将路径定义成变量
export class ImportPart extends Component {
  constructor(props) {
    super(props);
    this.state={
      fileState:false,//导入选择文件默认可导入xwx2019/3/4
    };
  }
  //文件导入之前的校验函数
  beforeUpload = (file) => {

    //const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const suffix  = file.name.substr(file.name.lastIndexOf("."));
    if(suffix!=".xls" && suffix!=".xlsx"){
        console.log('suffix', suffix);
        message.error('文件格式有误，必须为Excel文件');
    }
    /*if (!isExcel) {
      console.log('isExcel', isExcel);
      message.error('文件格式有误，必须为Excel文件');
    }*/
    return true;
  }
  handleInport = (res, name) => {
    if(res.root.object) {
      if(res.root.object.error > 0 && res.root.object.path) {
        // message.warning(name+'中不合格用户将会导出',5);
        message.warning(`[${name}] 导入完成！新增${res.root.object.success}条,失败${res.root.object.error}条,失败数据将导出，请更正后重试`, 8);
        this.handleClick(res.root.object.path, '')
        this.props.getData(`${this.props.listurl}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`); 
      }else if(!res.root.object.error) {
        // message.success(name + ' 导入成功。', 3)
        message.success(`[${name}] 导入完成！新增${res.root.object.success}条`, 3)
        this.props.getData(`${this.props.listurl}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`); 
      }
    }
  }
  //
  //文件导入的  onChange处理函数
  handleChange = (info) => {
    console.log('Changeinfo', info);
    this.setState({fileState:true});
    if (info.file.status === 'uploading') {
      console.log('uploading-----------');
    }
    if (info.file.response && info.file.status !== 'error') {
      if(this.props.refreshScreen){
        this.props.refreshScreen();
      }else if(this.props.refreshScreenModalClose){
        this.props.refreshScreenModalClose();
      }
      if (info.file.response.status === 1) {
        if(this.props.type === 'partyMembers') {
          this.handleInport(info.file.response, info.file.name)
        }else {
          if(info.file.response.root.object&&JSON.stringify(info.file.response.root.object)==='[]'){
            message.success(info.file.name + ' 上传成功。', 3);
            this.setState({fileState:false});
            this.props.getData(`${this.props.listurl}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            this.props.hideModel && this.props.hideModel(false);
          }else if(info.file.response.root.object&&info.file.response.root.object!==''){
            message.warning(info.file.name+'中不合格用户将会导出',3);
            this.setState({fileState:false});
            let a = document.createElement('a');
            a.href=`${info.file.response.root.object}`;
          //   a.click();
          //   a.download = fileName;
            if (document.all) {
              a.click();
            } else {
              let evt = document.createEvent('MouseEvents');
              evt.initEvent('click', true, true);
              a.dispatchEvent(evt);
            } 
            this.props.getData(`${this.props.listurl}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            this.props.hideModel && this.props.hideModel(false);
          }else{
            this.setState({fileState:false});
            this.props.getData(`${this.props.listurl}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            this.props.hideModel && this.props.hideModel(false);
          }
        }
        
      
      } else if (info.file.response.status === 0) {
        message.error(info.file.response.errorMsg);
        this.setState({fileState:false});
        setTimeout(function(){//全局消息销毁xwx2019/1/18
          message.destroy();
        },3000);
        // if(this.props.fileName == '考勤信息模板' || this.props.fileName == '党支部换届提醒模板') {
        //   this.props.getData(API_PREFIX +`${this.props.listurl}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
        //   this.props.hideModel(false);
        // }
      }
    }else if(info.file.status === 'error'){
      message.error('导入失败，请检查接口状态!');
      let messageNum=sessionStorage.getItem("messageNum")=='null'?1:sessionStorage.getItem("messageNum");
      if(messageNum==1){
        // message.error('导入失败，请重新登录后再导入');
        messageNum=Number(messageNum)+1;
        sessionStorage.setItem("messageNum",messageNum);
      }
      this.setState({fileState:false});
    }

  }
  handleClick = (url, fileName) => {
    let a = document.createElement('a');
    a.href = url;
    // if (fileName == null) {
    //   fileName = 'default_excel_name';
    // }
    // a.download = fileName + '.xls';
    if (document.all) {
      a.click();
    } else {
      let evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, true);
      a.dispatchEvent(evt);
    }
  }
  render() {
    return (
      <Row>
        <Col span={10}>
          <span style={{ color: 'red' }}>*</span>请选择导入文件
        </Col>
        <Col span={6}>
          <Upload
            name="file"
            action={API_PREFIX + this.props.importUrl}
            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            multiple={false}
            data={null}
            showUploadList={false}
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}
          >
            <Button disabled={this.state.fileState}>选择文件</Button>
          </Upload>
        </Col>
        <Col span={6}>
          <Button onClick={this.handleClick.bind(this, this.props.downlodUrl, this.props.fileName)} className="but-tab" icon="download" style={{ float: 'right', marginTop: '4px' }}><a id="excel" herf="javascript:void(0);" >模板下载</a></Button>
        </Col>
      </Row>
    );
  }
}

