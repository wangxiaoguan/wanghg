import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { Button, Row, Col, Modal, Upload, message, Divider, Message, Spin} from 'antd';
import PartyFeeExportForm from './PartyFeeExportForm';
import PartyLivenessExportForm from './PartyLivenessExportForm';
import { getService } from '../../myFetch.js';
import ServiceApi from '../../apiprefix';
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
    getService(ServiceApi + 'services/system/partyOrganization/partyOrganizationList/get', data => {
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
    await this.props.getData(ServiceApi + `${url}`);
  }
  //党费同步
  syncPartyFee = () => {
    postService(ServiceApi + 'services/system/partyFee/syncPartyFee', '', data => {
      if (data.retCode === 1) {
        message.success(data.retMsg);
      }
    });

  }
  render() {
    let powers = this.props.powers;
    console.log('权限码', powers);
    let hasAddPower = powers && powers['20001.21201.001'];
    let hasDelPower = powers && powers['20001.21201.004'];
    let hasEditPower = powers && powers['20001.21201.002'];
    let hasSearchPower = powers && powers['20001.21201.003'];
    let hasExportPower = powers && powers['20001.21201.202'];
    let hasImportPower = powers && powers['20001.21034.205'];
    let hasSyncPower = powers && powers['20001.21201.203'];
    console.log('aa', this.state.showPartyFeeImportModal);
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        fixed: 'left',
      }, {
        title: '员工号',
        dataIndex: 'userno',
        key: 'userno',
        width: 100,
        fixed: 'left',
      }, {
        title: '党组织',
        dataIndex: 'partynames',
        key: 'partynames',
      }, {
        title: '政治面貌',
        dataIndex: 'memtype',
        key: 'memtype',
        width: 80,
      },
      {
        title: '入党时间',
        dataIndex: 'joindate',
        key: 'joindate',
        width: 150,
      }, {
        title: '职务',
        dataIndex: 'postname',
        key: 'postname',
      },
      {
        title: '是否注册',
        dataIndex: 'isregister',
        key: 'isregister',
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 250,
        render: (data, record) => (

          <div>
            <a className="operation" disabled={!hasEditPower} onClick={() => location.hash = `/SystemSettings/NewEditPartyMember?isEdit=true&userid=${record.userid}`} >编辑</a>
            <Divider type="vertical" />
            <a className="operation" disabled={!hasSearchPower} onClick={() => location.hash = `/SystemSettings/PartyFeeManagement?userid=${record.userid}`}>党费管理</a>
            {/*<Divider type="vertical" />*/}
          </div>
        ),
      },
    ];
    const search = [

      { key: 'name', label: '姓名', qFilter: 'Q=name_S_LK', type: 'input' },
      {
        key: 'partyids',
        label: '所属党组织',
        qFilter: 'Q=partyids_S_ST',
        type: 'cascader',
        option: this.state.partyOrganizationDatas,
      },
      { key: 'phone', label: '手机号', qFilter: 'Q=mobile_S_LK', type: 'input' },
    ];

    return (
      <Spin spinning={this.state.loading}>
        <div>
          <TableAndSearch columns={columns} search={search} url={'services/system/partyMember/list'}
            addBtn={hasAddPower ? { order: 1, url: '/SystemSettings/NewPartyMember?isEdit=false' } : null} exportBtn={hasExportPower ? { order: 3, url: 'services/system/partyMember/export/partyMember', type: '党员信息' } : null} deleteBtn={hasDelPower ? { order: 4, url: 'services/system/partyMember/remove/partyMemberInfo', field: 'ids' } : null} customBtn={hasImportPower ? { order: 2, label: '导入', onClick: this.showNewPartyImportModal, className: 'resetBtn' } : null}
            rowkey={'userid'}
            scroll={{ width: 1600 }}
          >
            <Row style={{ position: "relative", left: "30%", top: "41px" }}>
              <Col span={2}>
                <Button disabled={!hasImportPower} className="resetBtn" onClick={this.showPartyFeeImportModal} type="primary">党费导入</Button>
              </Col>
              <Col span={2}>
                <Button className="resetBtn" disabled={!hasExportPower} onClick={this.showPartyFeeExmportModal} type="primary">党费导出</Button>
              </Col>
              <Col span={2}>
                <Button className="resetBtn" disabled={!hasSyncPower} onClick={this.syncPartyFee} >党费同步</Button>
              </Col>
              {/*<Col span={2}>*/}
              {/*<Button className="resetBtn">党费催缴</Button>*/}
              {/*</Col>*/}
              <Col span={3}>
                <Button disabled={!hasExportPower} className="resetBtnCopy" onClick={this.showPartyLivenessModal} type="primary">党员活跃度导出</Button>
              </Col>
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
          >
            <ImportPart importUrl="services/system/import/userInfo/partyFee"
              downlodUrl={ServiceApi + 'services/system/partyFee/template/export/partyFee'}
              fileName='党费信息模板'

            />
          </Modal>
          <Modal
            title="党费导出"
            visible={this.state.showPartyFeeExmportModal}
            // onOk={this.handlePartyFeeExportModalOK}
            onCancel={this.handlePartyFeeExportModalCancel}
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
            <ImportPart importUrl="services/system/import/userInfo/partyMember" downlodUrl={ServiceApi + 'services/system/partyMember/template/export/partyMember'}
              listurl={'services/system/partyMember/list'}
              pageData={this.props.pageData}
              getData={this.getData}
              fileName='党员信息模板'
            />

          </Modal>

        </div>
      </Spin>        
    );

  }
}

export default PartyMembers;
//党费导入和新党员导入时，页面一致的提取部分    区别在于action的值不一样==》将路径定义成变量
export class ImportPart extends Component {
  constructor(props) {
    super(props);
  }
  //文件导入之前的校验函数
  beforeUpload = (file) => {

    //const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const suffix  = file.name.substr(file.name.lastIndexOf("."));
    debugger;
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
  //
  //文件导入的  onChange处理函数
  handleChange = (info) => {
    console.log('Changeinfo', info);

    if (info.file.status === 'uploading') {
      // this.setState(
      //     {
      //       showBeforeImortIcon:true
      //     }
      // )
      console.log('uploading-----------');
    }
    if (info.file.response) {
      if (info.file.response.retCode === 1) {
        Message.success(info.file.name + ' 上传成功。', 3);
        this.props.getData(`${this.props.listurl}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      } else if (info.file.response.retCode === 0) {
        console.log("info.file.response.root", info.file.response.root);
        let mess = '';
        console.log("info.file.response.root", info.file.response.root);
        if (info.file.response.root.list !== undefined) {
          info.file.response.root.list.map((item, index) => {
            mess = mess + item;
          });
        } else {
          mess = info.file.response.retMsg;
        }
        console.log("mess", mess);
        Message.error('导入失败，' + '失败原因：' + mess, 5);
      }
    }

  }
  handleClick = (url, fileName) => {
    /*    var $eleForm = $("<form method='get'></form>");
    
        $eleForm.attr("action",url);
    
        $("#excel").append($eleForm);
    
        //提交表单，实现下载
        $eleForm.submit();*/
    let a = document.createElement('a');
    a.href = url;
    if (fileName == null) {
      fileName = 'default_excel_name';
    }
    a.download = fileName + '.xls';
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
            action={ServiceApi + this.props.importUrl}
            accept="application/vnd.ms-excel"
            multiple={false}
            data={null}
            showUploadList={false}
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}
          >
            <Button>选择文件</Button>
          </Upload>
        </Col>
        <Col span={6}>
          <Button onClick={this.handleClick.bind(this, this.props.downlodUrl, this.props.fileName)} className="but-tab" icon="download" style={{ float: 'right', marginTop: '4px' }}><a id="excel" herf="javascript:void(0);" >模板下载</a></Button>
        </Col>
      </Row>
    );
  }
}

