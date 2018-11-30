import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {Button,Popconfirm,Form,Cascader,message,Modal,Row,Col} from 'antd';
import ModalForm from '../UserManagement/ModalForm'
import {postService,getService} from '../../myFetch';
import API_PREFIX from'../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
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
class Visitor extends Component {
  constructor(props){
    super(props);
    this.state={
      showPointChangeModal:false,//是否显示修改经验的modal
      keyPointChangeModal:100,//修改经验modal的key值
      shoTreasureChangeModal:false,//是否显示修改积分的modal
      keyTreasureChangeModal:800,//修改积分的modal的key值
    }
  }
  //确认冻结点击事件
  handleFreezeClick(record){
    console.log('record',record);
    let body={
      userId:record.userId,
      status:'2',  //冻结的状态是2
    };
    postService(API_PREFIX+'services/system/touristUser/update/userInfo',body,data=>{
      if (data.retCode===1) {
        message.success('冻结成功');
        this.props.getData(API_PREFIX+`services/system/touristUser/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);

      }
    });
}
//确认解冻的点击事件
  handleUnFreezeClick(record){
    console.log('record',record);
    let body={
      userId:record.userId,
      status:'1',  //冻结的状态是2
    };
    postService(API_PREFIX+'services/system/touristUser/update/userInfo',body,data=>{
      if (data.retCode===1) {
        message.success('解冻成功');
        this.props.getData(API_PREFIX+ `services/system/touristUser/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);

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
  render() {
    let powers=this.props.powers;
    console.log('权限码', powers);
    let hasEditPower=powers&&powers['20001.21002.002'];
    console.log("权限码hasEditPower",hasEditPower);
    let hasExportPower=powers&&powers['20001.21002.202'];
    const columns=[
      {
        title:'姓名',
        dataIndex:'lastname',
        key:'lastname'

      },
      {
        title:'手机号',
        dataIndex:'mobile',
        key:'mobile'

      },
      {
        title:<span>个人经验<br/>(总经验)</span>,
        dataIndex:'points',
        key:'points',
        render:(data,record)=>{
          return <a onClick={()=>this.handleChangePoints(record)}>{record.points+"("+record.totalPoints+")"}</a>
        }

      },{
        title:<span>个人积分<br/>(总积分)</span>,
        dataIndex:'treasure',
        key:'treasure',
        render:(data,record)=>{
          return <a onClick={()=>this.handleChangeTreasure(record)}>{record.treasure+"("+record.totalTreasure+")"}</a>
        }

      },
      {
        title:'用户类型',
        dataIndex:'userTypeDesp',
        key:'userTypeDesp',

      },
      {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate',
        width:150,

      },
      {
        title:'账号状态',
        dataIndex:'statusDesp',
        key:'statusDesp',

      },
      {
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        render: (data, record) => (
           <div>
             {
               record.statusDesp=='正常'?
                   (<Popconfirm title="确定冻结该用户吗?" onConfirm={()=>this.handleFreezeClick(record)} >
                     <a  disabled={!hasEditPower} className='operation' >冻结</a>
                   </Popconfirm>)
                   :(<Popconfirm title="确定解冻该用户吗?" onConfirm={()=>this.handleUnFreezeClick(record)} >
                     <a disabled={!hasEditPower} className='operation' >解冻</a>
                   </Popconfirm>)
             }
           </div>
        ),

      }
    ];
    const statusDesp=[
      {
        key:'1',
        value:'正常'
      },
      {
        key:'2',
        value:'冻结'
      }
    ];
    const search=[
      {key:'lastname',label:'姓名',qFilter:'Q=lastname_S_LK',type:'input'},
      {key:'mobile',label:'手机号',qFilter:'Q=mobile_S_LK',type:'input'},
      {key:'status',label:'账号状态',qFilter:'Q=status_S_EQ',type:'select',option:statusDesp},
    ];

    return(
        <div>
          <TableAndSearch columns={columns} url={'services/system/touristUser/list'} search={search}
                          exportBtn={hasExportPower?{order:1 ,url:'services/system/touristUser/export',type:'游客'}:null}

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
            <ModalForm ok={this.handlePointChangeModalOk} cancel={this.handlePointChangeModalCancel} flag='point' record={this.state.record } whichPage='visitor'
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
                ok={this.handleTreasureChangeModalOk} cancel={this.handleTreasureChangeModalCancel}  flag='treasure' record={this.state.record} whichPage='visitor'
            ></ModalForm>
          </Modal>
        </div>

    );
  }
}

export default Visitor;
