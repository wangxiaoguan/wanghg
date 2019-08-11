import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {Button,Popconfirm,message} from 'antd';
import {GetQueryString,postService} from '../../myFetch.js';
import ServiceApi from '../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
import moment from 'moment';
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
class PartyFeeManagement extends Component{
  constructor(props){
    super(props);
    this.state={
      //从上一个页面获取用户id（userId）
      userId:GetQueryString(location.hash,['userid']).userid,
    }
  }
  componentWillMount(){

  }

  //变更缴费状态
  handleConfirm=(record)=>{
  let body={
    id:record.id
  }

  console.log("当前数据的id：",id);
  if(id){
    postService(ServiceApi+'services/system/partyFee/edit/partyFee',body,data=>{
      if(data.retCode==1){
        message.success('操作成功');
        this.props.getData(ServiceApi+`services/system/partyFee/list/${this.state.userId}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      }else{
        message.success(data.retMsg);
      }
    });
  }

  }
  render(){
    let powers=this.props.powers;
    console.log('权限码', powers);
    let hasDelPower=powers&&powers['20001.21203.004'];
    let hasEditPower=powers&&powers['20001.21203.002'];
    console.log("前一个页面传入的用户id为：",this.state.userId);
    const columns=[
      {
        title:'姓名',
        dataIndex:'name',
        key:'name'
      },{
        title:'应缴年月',
        dataIndex:'shouldPayDate',
        key:'shouldPayDate',
        render:(data,record)=>{
          return moment(record.shouldPayDate,'YYYY-MM').format('YYYY-MM');
        }
      },{
        title:'应缴金额',
        dataIndex:'money',
        key:'money'
      },{
        title:'是否缴纳',
        dataIndex:'isPay',
        key:'isPay',
        render:(data,record)=>{
         return record.isPay ? '是' :'否'
        }
      },{
        title:'支付时间',
        dataIndex:'payDate',
        key:'payDate'
      },{
        title:'变更缴费状态',
        dataIndex:'changePayStatus',
        key:'changePayStatus',
        render:(data,record)=>(
            <div>
              {

                record.isPay?
                    (<span>已缴费，无法变更</span>)
                   :

                    (   <Popconfirm title="确定变更该用户的缴费状态吗?" onConfirm={()=>this.handleConfirm(record)}>
                          <a disabled={!hasEditPower} className='operation'> 变更缴费状态</a>
                        </Popconfirm>
                    )
              }
            </div>
    ),
      }
    ];
    return(
        <div>
          <TableAndSearch columns={columns}  url={`services/system/partyFee/list/${this.state.userId}`}
                          deleteBtn={hasDelPower?{order:1,url:'/services/system/partyFee/remove/partyFee',field:'ids'  }:null}

          >

          </TableAndSearch>
          <div >
             <Button className="resetBtn" style={{margin:"100px 0 100px 45%"}} onClick={()=>location.hash='/SystemSettings/PartyMembers'}>
                 返回
            </Button>
          </div>
        </div>

    );
  }

}
export default PartyFeeManagement;