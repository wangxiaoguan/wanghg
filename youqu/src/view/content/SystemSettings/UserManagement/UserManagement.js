import React, { Component } from 'react';
import {Button,Popconfirm,Form,Cascader,message,Modal,Row,Col,Divider,Spin} from 'antd';
import {postService,getService} from '../../myFetch';
import TableAndSearch from '../../../component/table/TableAndSearch';
import ModalForm from './ModalForm'
import ServiceApi,{masterUrl} from'../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action';
import {ImportPart} from '../PartyMembers/PartyMembers';
import './UserManagement.less';
const FormItem = Form.Item;
import {dp } from './dp';
@connect(
    state => ({
      dataSource: state.tableData,
      pageData:state.pageData,
      powers: state.powers,
    }),
    dispatch => ({
      getData: n => dispatch(BEGIN(n)),
    })
)

class UserManagement extends Component {
  constructor(props){
    super(props);
    this.state={
      organizations:[],    //部门数据
      selectedValues:'',//选中某个部门的id
      authorizations:{},//用户拥有的发布权限信息
      userId:'',//传递给发布权限信息的userId
      showPointChangeModal:false,//是否显示修改经验的modal
      keyPointChangeModal:100,//修改经验modal的key值
      shoTreasureChangeModal:false,//是否显示修改积分的modal
      keyTreasureChangeModal:800,//修改积分的modal的key值
      record:{},//列表中的数据
      showImportModal:false,//用户导入modal
      keyImportModal:300,//用户导入modal的key值
      currentUserId:window.sessionStorage.getItem('id'),//当前登录用户的id
      currentroleIds:window.sessionStorage.getItem('roleIds'),//当前登录用户的角色
      currentAccount:window.sessionStorage.getItem('acount'),//当前登录用户的账号
      ownAdmindRole:false,//当前登录用户是否拥有最高管理员权限，用于控制 操作中的“数据权限设置”功能是否显示，是，则显示，否则，不显示
      ownSecondRole:false,//当前登录用户是否拥有第二级管理员权限，用于控制 操作中自身以及同级中编辑/冻结（解冻是否）是否显示，是，则不显示
      currentUserLevel:'',
      loading: false,
    }
  }
  componentWillMount(){
    this.setState({
      currentUserId:window.sessionStorage.getItem('id'),//当前登录用户的id
      currentroleIds:window.sessionStorage.getItem('roleIds'),//当前登录用户的角色
      currentAccount:window.sessionStorage.getItem('acount'),//当前登录用户的账号
      loading: true,
    });

  }

  /**
   *按照用户权限删除
   * 1. admin用户不可被删除，
   2. admin是系统管理员，可以删除所有用户，
   3.用户不可删除本身。用户不可删除同级别用户，只能删除角色等级比自已低的用户。
   4.未分配人员不可登录，所以也没有删除权限
   ====>当前登录用户的角色  <=   列表中用户的角色 即 当前用户id>=当前列表id  不能删除即禁用
   */

  getCheckboxProps =  record => ({
      // disabled:((this.state.currentAccount!='admin'&&this.state.currentroleIds&&this.state.currentroleIds.split(',')[0]) >= (record.roleLevel&&record.roleLevel)||(record.acount=='admin'))
    disabled:((this.state.currentAccount!='admin'&&this.state.currentUserLevel >= record.roleLevel)||(record.roleLevel==1))


  });

//所属部门   级联选择后，处理：获取对应的   id
  handleCheckChange=(value)=>{
    console.log("级联中的value：",value);
    this.setState({
      selectedValues:value?value.toString():''
    },()=>{
      console.log("级联中的selectedValues：",this.state.selectedValues);
    });

  }
//冻结/解冻 的确认点击事件
  handleConfirm=(record)=>{
    console.log('record',record);
    let body={};
    body.userId=record.userId;
    //根据record中的值，判断是进行解冻还是冻结操作
    if(record.statusDesp=="正常"){   //进行  冻结  操作
      body.status='2';
    }else if(record.statusDesp=="冻结"){//  进行  解冻  操作
      body.status='1';
    }
    console.log('解冻/冻结时的数据',body);
    postService(ServiceApi+'services/system/systemAndCompanyUser/update/userInfo',body,data=>{
      console.log("冻结/解冻 返回的数据",data);
      if(data.retCode==1){
        message.success('操作成功');
        this.props.getData(ServiceApi+`services/system/systemAndCompanyUser/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);

      }
    });
  }
//递归取出接口返回的部门的数据
  getDepartmentData(dpData){
    dpData.map((item,index)=>{
      item.value=item.id;
      item.label=item.name;
      item.children=item.subOrganizationList;
      if(item.subOrganizationList){//不为空，递归
        this.getDepartmentData(item.subOrganizationList)
      }
    });
  }
//更改经验====>控制对应modal的显示或者隐藏
  handleChangePoints=(record)=>{
    this.setState({
      record:record,
      showPointChangeModal:true,
      keyPointChangeModal:this.keyPointChangeModal+1,
    });
  }
  // 取消的点击事件  隐藏更改经验=的modal
  handlePointChangeModalCancel=()=>{
    this.setState({
      showPointChangeModal:false,
    });
  }
  // 确定的点击事件 隐藏更改经验=的modal
  handlePointChangeModalOk=()=>{
    this.setState({
      showPointChangeModal:false,
    });
  }
  //更改积分===>控制对应modal的显示或者隐藏
  handleChangeTreasure=(record)=>{
    this.setState({
      record:record,
      shoTreasureChangeModal:true,
      keyTreasureChangeModal:this.state.keyTreasureChangeModal+1
    })
  }

  //隐藏更改积分=的modal
  handleTreasureChangeModalCancel=()=>{
    this.setState({
      shoTreasureChangeModal:false,
    });
  }
  //隐藏更改积分=的modal
  handleTreasureChangeModalOk=()=>{
    this.setState({
      shoTreasureChangeModal:false,
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
    this.props.getData(ServiceApi+`services/system/systemAndCompanyUser/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
  }
//用户导入 取消的点击事件
  handleImportModalCancel=()=>{
    this.setState({
      showImportModal:false,
    })
  }
  getData = async(url) => {
    await this.props.getData(ServiceApi + `${url}`);
  }
  render() {
    let powers=this.props.powers;
    console.log('权限码', powers);
    let hasAddPower=powers&&powers['20001.21101.001'];
    let hasDelPower=powers&&powers['20001.21101.004'];
    let hasEditPower=powers&&powers['20001.21101.002'];
    let hasSearchPower=powers&&powers['20001.21101.003'];
    let hasExportPower=powers&&powers['20001.21101.202'];
    let hasImportPower=powers&&powers['20001.21034.205'];
    const columns=[
      {
        title: '姓名',
        dataIndex: 'lastname',
        key: 'lastname',
        width:100,
        fixed: 'left',
      },
      {
        title:'手机号',
        dataIndex:'mobile',
        key:'mobile',
        width:100,
        fixed: 'left',
      },
      {
        title:'邮箱',
        dataIndex:'email',
        key:'email',
      },
      {
        title:'所属部门',
        dataIndex:'orginfoName',
        key:'orginfoName',
      },
      {
        title:'是否注册',
        dataIndex:'isRegister',
        key:'isRegister',
        render:(data,record)=>{
          return record.isRegister ? '是' :'否'
        }
      },
      {
        title:<span>个人经验<br/>(总经验)</span>,
        dataIndex:'points',
        key:'points',
        // render:(data,record)=>{
        //   return <a onClick={()=>this.handleChangePoints(record)}>{record.points+"("+record.totalPoints+")"}</a>
        // }
      },
      {
        title:<span>个人积分<br/>(总积分)</span>,
        dataIndex:'treasure',
        key:'treasure',
        // render:(data,record)=>{
        //   return <a onClick={()=>this.handleChangeTreasure(record)}>{record.treasure+"("+record.totalTreasure+")"}</a>
        // }
      },
      {
        title:'是否为党员',
        dataIndex:'isPartyMem',
        key:'isPartyMem',
        width:60,
        render:(data,record)=>{
          return record.isPartyMem ? '是' :'否'
        }
      },
      {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate',
        width:150,
      },
      {
        title:'角色',
        dataIndex:'roleNames',
        key:'roleNames',
        render:(data,record)=>{
          return record.roleNames ? record.roleNames :'未分配'
        }
      },
      {
        title:'账号状态',
        dataIndex:'statusDesp',
        key:'statusDesp',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width:250,
        fixed: 'right',
        render: (data, record) => (
            <div>
              {

                record.roleLevel&&record.roleLevel==1 ?
                    (<a><a className='operation'
                              disabled={!hasSearchPower}
                              onClick={()=>{
                                const data=JSON.stringify(record);
                                console.log("record",record);
                                window.sessionStorage.setItem('userData',data);
                                location.hash="/SystemSettings/UserManagementDetail"
                              }
                              }>查看详情</a>
                      {/*<Divider type="vertical" />*/}
                    </a>)
                    :
                    record.roleLevel&&record.roleLevel==2?
                        <a style={{display:this.state.ownSecondRole?'none':'inline-block'}} >
                          <a  disabled={!hasEditPower} className='operation'   onClick={()=>location.hash=`/SystemSettings/EditUser?isEdit=true&userid=${record.userId}`} >编辑</a>
                          <Divider type="vertical" />
                          <Popconfirm title="确定冻结该用户吗?" onConfirm={()=>this.handleConfirm(record)}>
                            <a className='operation' >{record.statusDesp == "正常" ? "冻结" :"解冻"}</a>
                          </Popconfirm>
                          <Divider type="vertical" />
                          <a style={{display:this.state.ownAdmindRole?'inline-block':'none'}} ownAdmindRoleclassName='operation' onClick={()=>{
                            //传入当前用户的userId，用于下一个页面获取当前用户的发布权限范围
                            location.hash=`/SystemSettings/AuthorizationRang?userId=${record.userId}`
                          }}
                          >数据权限设置</a>
                          {/*<Divider type="vertical" />*/}
                        </a>
                        :
                        (
                            <a>
                              <a disabled={!hasEditPower} className='operation'   onClick={()=>location.hash=`/SystemSettings/EditUser?isEdit=true&userid=${record.userId}`} >编辑</a>
                              <Divider type="vertical" />
                              <Popconfirm title="确定冻结该用户吗?"  onConfirm={()=>this.handleConfirm(record)}>
                                <a disabled={!hasEditPower} className='operation' >{record.statusDesp =="正常"? "冻结" :"解冻"}</a>
                                {/*<Divider type="vertical" />*/}
                              </Popconfirm>
                            </a>
                        )

              }
            </div>
        ),
      }

    ];
    const departments = [
      {key:'dp1',
        value:'部门名称1'
      },
      {key:'dp2',
        value:'部门名称2'
      },
      {key:'dp3',
        value:'部门名称3'
      },
    ];
    const isOrNot=[
      {key:'',
        value:'全部'
      },
      {key:1,
        value:'是'
      },
      {key:0,
        value:'否'
      },
    ];
    const isregisterOp=[
      {key:'',
        value:'全部'
      },
      {key:'true',
        value:'是'
      },
      {key:'false',
        value:'否'
      },
    ];
    const statusDesp=[
      {key:'',
        value:'全部'
      },
      {key:'1',
        value:'正常'
      },
      {key:'2',
        value:'冻结'
      },
    ];

    const search=[
      
      {key:'lastname' ,label:'姓名',qFilter:'Q=lastname_S_LK' ,type:'input'},
      
      {key:'isRegister' ,label:'是否注册',qFilter:'Q=isRegister_Z_EQ' ,type:'select',option:isregisterOp},
      
      
      // {key:'isPartyMem' ,label:'是否为党员',qFilter:'Q=isPartyMem_S_EQ' ,type:'select',option:isOrNot},
      

      { key: 'createDate', label: '创建日期', type: 'rangePicker' },
      {key:'mobile' ,label:'手机号',qFilter:'Q=mobile_S_LK' ,type:'input'},
      {key:'status' ,label:'账号状态',qFilter:'Q=status_S_EQ' ,type:'select',option:statusDesp}, 
      {key:'isGrayUser' ,label:'是否为灰度用户',qFilter:'Q=isGrayUser_I_EQ' ,type:'select',option:isOrNot},
      {
        key: 'orginfo',
        label: '所属部门',
        qFilter: 'Q=orginfo_S_ST',
        type: 'cascader',
        option: this.state.organizations },
       
    ];
    //设置formItem的格式
    const formItemLayout = {
      labelCol: {
        xs: { span: 14},
        sm: { span: 6},
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 18 },
      },
    };
    console.log("this.state.ownAdmindRole:",this.state.ownAdmindRole);
    return(
      <Spin spinning={this.state.loading}>
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
                            columns={columns}  url={'services/system/systemAndCompanyUser/list'} search={search}
                            addBtn={hasAddPower?{order:1,url:'/SystemSettings/NewUser?isEdit=false'}:null}
                            // updateBtn={{order:2}}
                            customBtn={hasImportPower?{ order: 2, label: '导入', onClick: this.showImportModal, className: 'resetBtn' }:null}
                            exportBtn={hasExportPower?{order:3,url:'services/system/systemAndCompanyUser/export',type:'企业用户'}:null}
                            deleteBtn={hasDelPower?{order:4,url:'services/system/systemAndCompanyUser/remove/userInfo',field:'ids'}:null}
                            getCheckboxProps={this.getCheckboxProps}
                            rowkey={'userId'}
                            scroll={{width:1600}}
            >
            </TableAndSearch>
            <Modal
                title="经验值操作"
                visible={this.state.showPointChangeModal}
                key={this.state.keyPointChangeModal}
                onCancel={this.handlePointChangeModalCancel}
                footer={null}
                destroyOnClose={true}
            >
              <ModalForm ok={this.handlePointChangeModalOk} cancel={this.handlePointChangeModalCancel} flag='point' record={this.state.record} whichPage='user'
              ></ModalForm>
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
                  ok={this.handleTreasureChangeModalOk} cancel={this.handleTreasureChangeModalCancel}  flag='treasure' record={this.state.record} whichPage='user'
              ></ModalForm>
            </Modal>
            <Modal
                title="用户信息导入"
                cancelText="返回"
                okText="确定"
                visible={this.state.showImportModal}
                onOk={this.handleImportModalOk}
                onCancel={this.handleImportModalCancel}
                destroyOnClose={true}
            >
            <ImportPart importUrl='services/system/import/userInfo/importUserInfo' downlodUrl={ServiceApi + 'services/system/systemAndCompanyUser/template/export'}
                            listurl={'services/system/systemAndCompanyUser/list'}
                            pageData={this.props.pageData}
                            getData={this.getData}
                            fileName='用户信息模板'
              />
            </Modal>
          </div>
        </Spin>  
    )

  }
}

export default UserManagement;
