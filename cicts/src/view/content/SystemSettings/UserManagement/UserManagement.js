import React, { Component } from 'react';
import { Button, Popconfirm, Form, Cascader, message, Modal, Row, Col, Divider, Spin } from 'antd';
import { postService, getService } from '../../myFetch';
import TableAndSearch from '../../../component/table/TableAndSearch';
import ModalForm from './ModalForm';
import API_PREFIX, { masterUrl } from '../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN, getDataSource } from '../../../../redux-root/action/table/table';
import { ImportPart } from '../../PartyBuildGarden/PartyMembers/PartyMembers';
import './UserManagement.less';
import CityOption from '../../../component/city'
const FormItem = Form.Item;
import { dp } from './dp';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData: state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    retSetData: n => dispatch(getDataSource(n)),
  })
)

class UserManagement extends Component {
  constructor(props) {
    super(props);
    this.departList = []
    this.state = {
      organizations: [],    //部门数据
      selectedValues: '',//选中某个部门的id
      authorizations: {},//用户拥有的发布权限信息
      userId: '',//传递给发布权限信息的userId
      showPointChangeModal: false,//是否显示修改经验的modal
      keyPointChangeModal: 100,//修改经验modal的key值
      shoTreasureChangeModal: false,//是否显示修改积分的modal
      keyTreasureChangeModal: 800,//修改积分的modal的key值
      record: {},//列表中的数据
      showImportModal: false,//用户导入modal
      keyImportModal: 300,//用户导入modal的key值
      currentUserId: window.sessionStorage.getItem('id'),//当前登录用户的id
      currentroleIds: window.sessionStorage.getItem('roleIds'),//当前登录用户的角色
      currentAccount: window.sessionStorage.getItem('acount'),//当前登录用户的账号
      ownAdmindRole: false,//当前登录用户是否拥有最高管理员权限，用于控制 操作中的“数据权限设置”功能是否显示，是，则显示，否则，不显示
      ownSecondRole: false,//当前登录用户是否拥有第二级管理员权限，用于控制 操作中自身以及同级中编辑/冻结（解冻是否）是否显示，是，则不显示
      currentUserLevel: '',
      currentUserRoleLevel: window.sessionStorage.getItem('userRoleLevel'),//当前登录用户的角色级别
      loading: false,
      employeeType: [],//人员类型数据
      schoolOption: [], //学历下拉框数据
      isOrRold: [],//角色数据
      orgIds: window.sessionStorage.getItem('authorityOrgIds')?window.sessionStorage.getItem('authorityOrgIds'):false,
    };
  }
  // 把可以操作的部门的父节点全部找出来
  getDpData(data) {
    let orgIds = window.sessionStorage.getItem('authorityOrgIds')?window.sessionStorage.getItem('authorityOrgIds'):false
    data.map((item, index) => {
      if(orgIds&&orgIds.indexOf(item.id)>-1){
        this.departList.push(item.treePath.split(','))
      }
      if (item.subCompanyOrgList) {
        this.getDpData(item.subCompanyOrgList);
      }
    });
    let List = this.departList.join(',').split(',');
    return [...new Set(List)]
  }
  //递归取出接口返回的部门的数据
  getDepartmentData(dpData, selectIds) {
    let orgIds = this.state.orgIds
    dpData.map((item, index) => {
      item.value = item.id;
      item.label = item.name;
      item.children = item.subCompanyOrgList;
      item.disabled = !orgIds ? false : selectIds.toString().indexOf(item.id) > -1 ? false : true;
      if (item.subCompanyOrgList) {//不为空，递归
        this.getDepartmentData(item.subCompanyOrgList, selectIds);
      }
    });
  }
  componentWillMount() {
    sessionStorage.setItem("messageNum", null);
    this.setState({
      currentUserId: window.sessionStorage.getItem('id'),//当前登录用户的id
      currentroleIds: window.sessionStorage.getItem('roleIds'),//当前登录用户的角色
      currentAccount: window.sessionStorage.getItem('acount'),//当前登录用户的账号
      currentUserRoleLevel:  window.sessionStorage.getItem('userRoleLevel'),//当前登录用户的角色级别
      loading: true,
    });
    //console.log("当前登录用户的最高权限222：",this.state.currentroleIds.split(',')[0]);
    //console.log("当前登录用户的最高权限：",this.state.currentroleIds&&this.state.currentroleIds.split(',')[0]);
    //通过接口获取部门的信息
    getService(API_PREFIX + `services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false`, data => {//搜索栏所属部门数据
      if (data.status === 1) {
        let orgs = data.root.object;
        if (orgs) {
          //直接调用处理部门数据的方法===》处理数据
          let selectIds = this.getDpData(orgs)
          this.getDepartmentData(orgs, selectIds);
          this.setState({
            organizations: orgs,
            loading: false,
          });
        } else {
          // message.error(data.retMsg);
          this.setState({ loading: false });
        }
      } else {
        message.error(data.errorMsg);
      }
    });

    //通过接口获取人员类型的信息
    getService(API_PREFIX + `services/web/company/userInfo/getUserTypeDictData`, data => {
      if (data.status === 1) {
        let employeeTypeData = [];
        employeeTypeData = data.root.object;
        this.selectType(employeeTypeData);
        this.setState({
          employeeType: employeeTypeData,
        });
      }
    });

    //通过接口获取角色的信息
    getService(API_PREFIX + `services/web/role/roleList/get/0`, data => {
      if (data.status === 1) {
        let RoldData = [];
        RoldData = data.root.object;
        this.selectRoleType(RoldData);
        this.setState({ isOrRold: RoldData });
      } else {
        message.error(data.errorMsg);
      }
    });
    //学历下拉框数据
    getService(API_PREFIX + 'services/web/company/userInfo/getEduDictData', data => {
      if (data.status === 1) {
        console.log(data);
        let list = [{ key: '', value: '全部' }]
        data.root.object && data.root.object.map(item => {
          list.push({key: item.code, value: item.fieldName})
        })
        this.setState({
          schoolOption: list,
        });
      }
    })
    
    //通过接口，获取当前登录用户的角色级别
    //首先需要知道当前登录用户的id,通过接口获取
    // let currentUserId=window.sessionStorage.getItem('id');
    // let id=JSON.parse(currentUserId);
    // console.log("当前登录用户的id:",id);
    // getService(API_PREFIX+`services/system/systemAndCompanyUser/get/userRole/${id}`,data=>{
    //   console.log("获取当前用户角色信息的返回数据：",data.root.list[0]);
    //   if(data.root.list[0]){//是最高管理员===》
    //     this.setState({currentUserLevel:data.root.list[0].level},()=>{
    //       console.log('this.state.currentUserLevel2:',this.state.currentUserLevel);
    //       this.setState({
    //         ownAdmindRole:this.state.currentUserLevel==1,   //将是否拥有最高管理员权限的标志值为true
    //         ownSecondRole:this.state.currentUserLevel==2,
    //         loading: false,
    //       },()=>{
    //         console.log('this.state.ownAdmindRole:',this.state.ownAdmindRole);
    //       });
    //     });
    //   }else{
    //     message.error(data.errorMsg);
    //   }
    // });
  }

  /**
   *按照用户权限删除
   * 1. admin用户不可被删除，
   2. admin是系统管理员，可以删除所有用户，
   3.用户不可删除本身。用户不可删除同级别用户，只能删除角色等级比自已低的用户。
   4.未分配人员不可登录，所以也没有删除权限
   ====>当前登录用户的角色  <=   列表中用户的角色 即 当前用户id>=当前列表id  不能删除即禁用
   */

  getCheckboxProps = record => ({
    // disabled:((this.state.currentAccount!='admin'&&this.state.currentroleIds&&this.state.currentroleIds.split(',')[0]) >= (record.roleLevel&&record.roleLevel)||(record.acount=='admin'))
    disabled: record.id == this.state.currentUserId


  });

  //所属部门   级联选择后，处理：获取对应的   id
  handleCheckChange = (value) => {
    console.log("级联中的value：", value);
    this.setState({
      selectedValues: value ? value.toString() : '',
    }, () => {
      console.log("级联中的selectedValues：", this.state.selectedValues);
    });

  }
  //冻结/解冻 的确认点击事件
  handleConfirm = (record) => {
    console.log('record', record);
    // let body = {};
    // body.id = record.id;
    // //根据record中的值，判断是进行解冻还是冻结操作
    // if (record.status == "1") {   //进行  冻结  操作
    //   body.status = '0';
    // } else if (record.status == "0") {//  进行  解冻  操作
    //   body.status = '1';
    // }
    let body = [record.id]
    console.log('解冻/冻结时的数据', body);
    postService(API_PREFIX + `services/web/company/userInfo/${record.status == "1" ? 'freezeUsers' : 'startUsers'}`, body, data => {
      console.log("冻结/解冻 返回的数据", data);
      if (data.status == 1) {
        message.success('操作成功,重新请求表格数据');
        this.props.retSetData({ root: { list: [] } }); // yelu 清空缓存里面保存的之前的表格数据
        this.props.getData(API_PREFIX + `services/web/company/userInfo/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      } else {
        message.error(data.errorMsg);
      }
    });
  }

  //select里面增加一个全部
  selectType(data) {
    let selectTypeAll = { code: '', desp: '全部' };//前端新增一个全部字段
    data.unshift(selectTypeAll);
  }
  //角色select里面新增一个全部
  selectRoleType(data) {
    let selectRoleAll = { id: '', name: '全部' };//前端新增一个全部字段
    data.unshift(selectRoleAll);
  }

  //更改经验====>控制对应modal的显示或者隐藏
  handleChangePoints = (record) => {
    this.setState({
      record: record,
      showPointChangeModal: true,
      keyPointChangeModal: this.keyPointChangeModal + 1,
    });
  }
  // 取消的点击事件  隐藏更改经验=的modal
  handlePointChangeModalCancel = () => {
    this.setState({
      showPointChangeModal: false,
    });
  }
  // 确定的点击事件 隐藏更改经验=的modal
  handlePointChangeModalOk = () => {
    this.setState({
      showPointChangeModal: false,
    });
  }
  //更改积分===>控制对应modal的显示或者隐藏
  handleChangeTreasure = (record) => {
    this.setState({
      record: record,
      shoTreasureChangeModal: true,
      keyTreasureChangeModal: this.state.keyTreasureChangeModal + 1,
    });
  }

  //隐藏更改积分=的modal
  handleTreasureChangeModalCancel = () => {
    this.setState({
      shoTreasureChangeModal: false,
    });
  }
  //隐藏更改积分=的modal
  handleTreasureChangeModalOk = () => {
    this.setState({
      shoTreasureChangeModal: false,
    });
  }
  //控制用户导入的modal的显示或者隐藏
  showImportModal = () => {
    this.setState({
      showImportModal: true,
      keyImportModal: this.state.keyImportModal,
    });
  }
  //用户导入 确定的点击事件
  handleImportModalOk = () => {
    sessionStorage.setItem("messageNum", null);
    this.setState({
      showImportModal: false,
    });
    this.props.getData(API_PREFIX + `services/web/company/userInfo/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
  }
  //用户导入 取消的点击事件
  handleImportModalCancel = () => {
    sessionStorage.setItem("messageNum", null);
    this.setState({
      showImportModal: false,
    });
  }
  getData = async (url) => {
    await this.props.getData(API_PREFIX + `${url}`);
  }
  hideModel = (bol) => {
    this.setState({
      showImportModal: bol,
    });
  }
  render() {
    let powers = this.props.powers;
    console.log('权限码', powers);
    let hasAddPower = powers && powers['20004.21504.001'];//新建
    let hasDelPower = powers && powers['20004.21504.004'];//删除
    let hasEditPower = powers && powers['20004.21504.002'];//编辑
    let hasSearchPower = powers && powers['20004.21504.003'];//查询
    let hasExportPower = powers && powers['20004.21504.202'];//导出
    let hasImportPower = powers && powers['20004.21504.205'];//用户导入
    console.log('1111111111111', hasEditPower);
    let currentUserRoleLevel = this.state.currentUserRoleLevel
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        fixed: 'left',
      },
      {
        title: '员工工号',
        dataIndex: 'userNo',
        key: 'userNo',
        width: 100,
        fixed: 'left',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        width: 100,
        fixed: 'left',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '所属部门',
        dataIndex: 'fullName',
        key: 'fullName',
      },
      // {
      //   title:'是否注册',
      //   dataIndex:'isRegister',
      //   key:'isRegister',
      //   render:(data,record)=>{
      //     return record.isRegister ? '是' :'否';
      //   },
      // },
      {
        title: '人员类型',
        dataIndex: 'employeeTypeName',
        key: 'employeeTypeName',
      },
      {
        title: '职务',
        dataIndex: 'post',
        key: 'post',
      },
      {
        title: <span>个人经验<br />(总经验)</span>,
        dataIndex: 'exp',
        key: 'exp',
        // render:(data,record)=>{
        //   return <a onClick={()=>this.handleChangePoints(record)}>{record.points+"("+record.totalPoints+")"}</a>
        // }
      },
      {
        title: <span>个人积分<br />(总积分)</span>,
        dataIndex: 'point',
        key: 'point',
        // render:(data,record)=>{
        //   return <a onClick={()=>this.handleChangeTreasure(record)}>{record.treasure+"("+record.totalTreasure+")"}</a>
        // }
      },
      {
        title: '是否为党员',
        dataIndex: 'isPartyMem',
        key: 'isPartyMem',
        width: 60,
        render: (data, record) => {
          return record.isPartyMem ? '是' : '否';
        },
      },
      {
        title: '学历',
        dataIndex: 'eduName',
        key: 'eduName',
      },
      {
        title: '特长',
        dataIndex: 'speciality',
        key: 'speciality',
      },
      {
        title: '兴趣爱好',
        dataIndex: 'hobby',
        key: 'hobby',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '现居地',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '角色',
        dataIndex: 'roleNamesStr',
        key: 'roleNamesStr',
        render: (data, record) => {
          let list = record.roleNames
          if (record.roleNames && record.roleNames.length) {
            return record.roleNames.join(',')
          } else {
            return '未分配'
          }
          // return record.roleNamesStr ? record.roleNamesStr : '未分配';
        },
      },
      {
        title: '显示顺序',
        dataIndex: 'showIndex',
        key: 'showIndex',
      },
      {
        title: '账号状态',
        dataIndex: 'status',
        key: 'status',
        render: (data, record) => {
          return record.status === '1' ? '正常' : record.status === '0' ? '冻结' : record.status === '2' ? '已删除' : '';
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 250,
        fixed: 'right',
        render: (data, record) => (
          <div>
            {

              record.roleLevel && record.roleLevel == 1 ?
                (<a><a className='operation'
                  disabled={!hasSearchPower}
                  onClick={() => {
                    const data = JSON.stringify(record);
                    console.log("record", record);
                    window.sessionStorage.setItem('userData', data);
                    location.hash = "/EnterpriseConfig/UserManagementDetail";
                  }
                  }>查看详情</a>
                  {/*<Divider type="vertical" />*/}
                </a>)
                :
                record.roleLevel && record.roleLevel == 2 ?
                  <a>
                    <a disabled={!hasEditPower} className='operation'
                      style={{ display: this.state.ownSecondRole ? 'none' : 'inline-block' }}
                      onClick={() => location.hash = `/EnterpriseConfig/EditUser?isEdit=true&userid=${record.id}`} >编辑</a>
                    <Divider type="vertical" />
                    {record.status === '0' ? <span>禁用</span> :
                      <Popconfirm title={record.statusDesp == "正常" ? "确定冻结该用户吗?" : "确定解冻该用户吗?"} onConfirm={() => this.handleConfirm(record)}>
                        <a style={{ display: this.state.ownSecondRole ? 'none' : 'inline-block' }}
                          className='operation' >{record.statusDesp == "正常" ? "冻结" : "解冻"}</a>
                      </Popconfirm>
                    }
                    <Divider type="vertical" />
                    <a style={{ display: this.state.ownAdmindRole ? 'inline-block' : 'none' }} ownAdmindRoleclassName='operation' onClick={() => {
                      //传入当前用户的userId，用于下一个页面获取当前用户的发布权限范围
                      location.hash = `/EnterpriseConfig/AuthorizationRang?userId=${record.id}`;
                    }}
                    >数据权限设置</a>
                    {/*<Divider type="vertical" />*/}
                  </a>
                  :
                  (
                    <a>
                      <a style={{display: record.id == this.state.currentUserId ? 'none' : 'inline-block'}} disabled={!hasEditPower} className='operation'
                        onClick={() => location.hash = `/EnterpriseConfig/EditUser?isEdit=true&userid=${record.id}`} >编辑</a>
                      <Divider type="vertical" />
                      {/* {record.status==='0'?<span style={{color:"#000"}}>禁用</span>: */}
                      <Popconfirm title={record.status == "1" ? "确定冻结该用户吗?" : "确定解冻该用户吗?"} onConfirm={() => this.handleConfirm(record)}>
                        <a disabled={!hasEditPower} className='operation' style={{display: record.id == this.state.currentUserId ? 'none' : 'inline-block'}} >{record.status == "1" ? "冻结" : "解冻"}</a>
                        {/*<Divider type="vertical" />*/}
                      </Popconfirm>
                      {/* // } */}
                      <Divider type="vertical" />{/**调试完毕后删除xwx2019/8/9第1-6行 */}
                      <a style={{ display: record.id == this.state.currentUserId ? 'none' : record.roleIds && record.roleIds.length !== 0 ? 'inline-block' : 'none' }} className='operation' onClick={() => {
                        //传入当前用户的userId，用于下一个页面获取当前用户的发布权限范围{/**调试完毕后删除xwx2019/8/9 */}
                        location.hash = `/EnterpriseConfig/AuthorizationRang?userId=${record.id}&tenantId=${record.tenantId}`;
                      }}
                      >数据权限设置</a>
                    </a>
                  )
              // disabled={hasEditPower ? !this.state.disabledStatu : true}
            }
          </div>
        ),
      },

    ];
    const departments = [
      {
        key: 'dp1',
        value: '部门名称1',
      },
      {
        key: 'dp2',
        value: '部门名称2',
      },
      {
        key: 'dp3',
        value: '部门名称3',
      },
    ];
    const isOrNot = [
      {
        key: '',
        value: '全部',
      },
      {
        key: 1,
        value: '是',
      },
      {
        key: 0,
        value: '否',
      },
    ];

    const isregisterOp = [
      {
        key: '',
        value: '全部',
      },
      {
        key: 'true',
        value: '是',
      },
      {
        key: 'false',
        value: '否',
      },
    ];
    const statusDesp = [
      {
        key: '',
        value: '全部',
      },
      {
        key: '1',
        value: '正常',
      },
      {
        key: '0',
        value: '冻结',
      },
      //   {key:'2',
      //   value:'已删除',
      //   },
    ];

    // const search = [

    //   { key: 'name', label: '姓名', qFilter: 'Q=name', type: 'input' },
    //   { key: 'blurUserNo', label: '员工号', qFilter: 'Q=blurUserNo', type: 'input' },

    //   // {key:'isRegister' ,label:'是否注册',qFilter:'Q=isRegister_Z_EQ' ,type:'select',option:isregisterOp},//最新原型已修改，屏蔽xwx2019/8/7


    //   // {key:'isPartyMem' ,label:'是否为党员',qFilter:'Q=isPartyMem_S_EQ' ,type:'select',option:isOrNot},


    //   { key: 'createDate', startTime: 'startDate', endTime: 'endDate', label: '创建日期', type: 'rangePicker' },
    //   { key: 'mobile', label: '手机号', qFilter: 'Q=mobile', type: 'input' },
    //   { key: 'status', label: '账号状态', qFilter: 'Q=status', type: 'select', option: statusDesp },
    //   { key: 'isGrayUser', label: '是否为灰度用户', qFilter: 'Q=isGrayUser', type: 'select', option: isOrNot },
    //   { key: 'roleId', label: '角色', qFilter: 'Q=roleId', type: 'select', option: this.state.isOrRold },
    //   { key: 'employeeType', label: '人员类型', qFilter: 'Q=employeeType', type: 'select', option: this.state.employeeType },
    //   { key: 'orgId', label: '所属部门', qFilter: 'Q=orgId', type: 'cascader', option: this.state.organizations },

    // ];
    const search=[
      { key: 'name', label: '姓名', qFilter: 'Q=name', type: 'input' },
      { key: 'blurUserNo', label: '员工号', qFilter: 'Q=blurUserNo', type: 'input' },
      // {key:'post' ,label:'职务',qFilter:'Q=post_S_LK' ,type:'input'},
      {key:'edu' ,label:'学历',qFilter:'Q=edu' ,type:'select',option:this.state.schoolOption},
      { key: 'mobile', label: '手机号', qFilter: 'Q=mobile', type: 'input' },
      {startKey:'startAge',endKey: 'endAge' ,label:'年龄段', type:'inputAge', qFilterStart: 'Q=startAge', qFilterEnd: 'Q=endAge'},
      {key:'address' ,label:'现居地',qFilter:'Q=address' ,type:'cascader', option: CityOption},
      { key: 'orgId', label: '所属部门', qFilter: 'Q=orgId', type: 'cascader', option: this.state.organizations },
      { key: 'roleId', label: '角色', qFilter: 'Q=roleId', type: 'select', option: this.state.isOrRold },
      { key: 'employeeType', label: '人员类型', qFilter: 'Q=employeeType', type: 'select', option: this.state.employeeType },
      // {key:'isPartyMem' ,label:'是否为党员',qFilter:'Q=isPartyMem_S_EQ' ,type:'select',option:isOrNot},
     
    ];
    const moreSearch = [
      { key: 'createDate', startTime: 'startDate', endTime: 'endDate', label: '创建日期', type: 'rangePicker' },
      {key:'speciality' ,label:'特长',qFilter:'Q=speciality' ,type:'input'},
      { key: 'hobby', label: '兴趣爱好', qFilter: 'Q=hobby', type: 'input' },
      {key:'post' ,label:'职务',qFilter:'Q=post' ,type:'input'},
      // {key:'isRegister' ,label:'是否注册',qFilter:'Q=isRegister_Z_EQ' ,type:'select',option:isregisterOp},
      { key: 'status', label: '账号状态', qFilter: 'Q=status', type: 'select', option: statusDesp },
      { key: 'isGrayUser', label: '是否为灰度用户', qFilter: 'Q=isGrayUser', type: 'select', option: isOrNot },
    ]
    //设置formItem的格式
    const formItemLayout = {
      labelCol: {
        xs: { span: 14 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 18 },
      },
    };
    console.log("this.state.ownAdmindRole:", this.state.ownAdmindRole);
    return (
      //   <Spin spinning={this.state.loading}>
      <div className="userManagement">
        {/*<Form className="UserManagement">*/}
        {/*<Row>*/}
        {/*<Col span={12}>*/}
        {/*<FormItem*/}
        {/*{...formItemLayout}*/}
        {/*label="所属部门"*/}
        {/*>*/}
        {/*<Cascader options={this.state.organizations} placeholder="全部" onChange={this.handleCheckChange} changeOnSelect>*/}
        {/*</Cascader>*/}
        {/*</FormItem>*/}
        {/*</Col>*/}
        {/*</Row>*/}
        {/*</Form>*/}
        <TableAndSearch
          columns={columns} url={'services/web/company/userInfo/list'} search={search} moreSearch={moreSearch}
          addBtn={hasAddPower ? { order: 1, url: '/EnterpriseConfig/NewUser?isEdit=false' } : null}
          // updateBtn={{order:2}}
          customBtn={hasImportPower ? { order: 2, label: '导入', onClick: this.showImportModal, className: 'resetBtn' } : null}
          exportBtn={hasExportPower ? { order: 3, url: 'services/web/company/userInfo/exportUsers', type: '企业用户' } : null}
          deleteBtn={hasDelPower ? { order: 4, url: 'services/web/company/userInfo/deleteUsers' } : null}//删除接口
          frozenBtn={hasEditPower ? { order: 4, url: 'services/web/company/userInfo/freezeUsers', field: '' } : null}
          // synchronizationBtn={{order:10,url:'services/system/systemAndCompanyUser/huanxinRegisterJob'}}//最新原型已修改，暂时屏蔽xwx2019/8/7
          getCheckboxProps={this.getCheckboxProps}
          rowkey={'id'}
          code='frozenBtn'
          scroll={{ width: 1600 }}
        />
        <Modal
          title="经验值操作"
          visible={this.state.showPointChangeModal}
          key={this.state.keyPointChangeModal}
          onCancel={this.handlePointChangeModalCancel}
          footer={null}
          destroyOnClose={true}
        >
          <ModalForm ok={this.handlePointChangeModalOk} cancel={this.handlePointChangeModalCancel}
            flag='point' record={this.state.record} whichPage='user'
          />
        </Modal>
        <Modal
          title="积分值操作"
          visible={this.state.shoTreasureChangeModal}
          key={this.state.keyTreasureChangeModal}
          onCancel={this.handleTreasureChangeModalCancel}
          footer={null}
          destroyOnClose={true}

        >
          <ModalForm
            ok={this.handleTreasureChangeModalOk} cancel={this.handleTreasureChangeModalCancel}
            flag='treasure' record={this.state.record} whichPage='user'
          />
        </Modal>
        <Modal
          title="用户信息导入"
          cancelText="返回"
          okText="确定"
          visible={this.state.showImportModal}
          onOk={this.handleImportModalOk}
          onCancel={this.handleImportModalCancel}
          footer={null}
          destroyOnClose={true}
        >
          <ImportPart importUrl='services/web/company/userInfo/import'
            downlodUrl={API_PREFIX + 'services/web/company/userInfo/exportUsersTemplate'}
            listurl={'services/web/company/userInfo/list'}
            pageData={this.props.pageData}
            getData={this.getData}
            fileName='用户信息模板'
            hideModel={this.hideModel}
          />
        </Modal>
      </div>
      // </Spin>  
    );

  }
}

export default UserManagement;
