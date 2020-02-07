import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {Button,Popconfirm,message,Modal} from 'antd';
import {GetQueryString,postService} from '../../myFetch.js';
import API_PREFIX from '../../apiprefix';
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
      selectedRowKeys: []
    }
  }
  componentWillMount(){

  } 

  //变更缴费状态
  handleConfirm=(record)=>{
      postService(API_PREFIX+`services/web/party/fee/changeStatus/${record.id}`,null,data=>{
        if(data.status==1){
          message.success('操作成功');
          this.props.getData(API_PREFIX+`services/web/party/fee/getList/${this.state.userId}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
        }else{
          message.success(data.errorMsg);
        }
      });
  }
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  delPartyFee = () => {
    postService(`${API_PREFIX}services/web/party/fee/delete`, this.state.selectedRowKeys, data=> {
      if(data.status == '1') {
        this.state.selectedRowKeys.length = 0;
        message.success('删除成功')
        this.props.getData(API_PREFIX+`services/web/party/fee/getList/${this.state.userId}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`)
      }else {
        message.error(data.errorMsg)
      }
    })
  }

  deleteHandler = (event) => {
    if (this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0) {
      Modal.confirm(
        {
          title: '操作不可恢复！',
          content: `您确定要删除${this.state.selectedRowKeys.length}条数据吗？ 此操作不可恢复`,
          onOk: () => {
            this.delPartyFee();
          },
        }
      );
    }
    else {
      message.warn('请选择要删除的数据');
    }
  }
  render(){
    let powers=this.props.powers;
    console.log('权限码', powers);
    // let hasDelPower=powers&&powers['20001.21003.004'];
    // let hasEditPower=powers&&powers['20001.21003.002'];
    // let delPower = powers&&powers['20001.21203.004']
    
    //党费权限
    let feeEditPower =  powers && powers['20005.23004.002'];
    let feeSearchPower =  powers && powers['20005.23004.003'];
    let feeDelPower = powers && powers['20005.23004.004'];
    console.log("前一个页面传入的用户id为：",this.state.userId);
    const columns=[
      {
        title:'姓名',
        dataIndex:'userName',
        key:'userName'
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
        dataIndex:'isPayName',
        key:'isPayName',
        // render:(data,record)=>{
        //  return record.isPay ? '是' :'否'
        // }
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
              (<span>{ record.isPay==1?'已缴费，无法变更':"支付中，无法变更"}</span>)
                   :

                    (   <Popconfirm title="确定变更该用户的缴费状态吗?" onConfirm={()=>this.handleConfirm(record)}>
                          <a className='operation'> 变更缴费状态</a>
                        </Popconfirm>
                    )
              }
            </div>
    ),
      }
    ];
    const {selectedRowKeys} = this.state
    return(
        <div>
          <Button type='danger'
          style={{marginTop: 50, marginLeft: 20,borderRadius:100,height:29,paddingBottom:3}}
          disabled={feeDelPower && selectedRowKeys.length <= 0}
          onClick={this.deleteHandler}>删除</Button>
          <TableAndSearch columns={columns}
          getSelectKey={this.onSelectChange}
          url={`services/web/party/fee/getList/${this.state.userId}`}
          // deleteBtn={feeDelPower?{order:1,url:'/services/web/party/fee/delete',field:''  }:null}

          >

          </TableAndSearch>
          <div >
             <Button className="resetBtn" style={{margin:"100px 0 100px 45%"}} onClick={()=>location.hash='/PartyBuildGarden/PartyMembers'}>
                 返回
            </Button>
          </div>
        </div>

    );
  }

}
export default PartyFeeManagement;