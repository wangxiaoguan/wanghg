import React,{Component} from 'react';
import {Divider,Popconfirm,message,Modal,Spin} from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { getService,postService } from '../../myFetch.js';
import API_PREFIX from '../../apiprefix';
import {BEGIN} from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
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
export default class Experience extends Component{

    constructor(props){
        super(props);
        this.state={
           
            
        }
    }

    editTask=(record)=>{
      console.log("record==>",record)
      location.hash =`/SystemSettings/EditExperience?id=${record.levelid}`;
    }
    render(){
      let powers = this.props.powers;
      console.log('权限码', powers);
      let hasAddPower = powers && powers['20001.21814.001'];
      let hasDelPower = powers && powers['20001.21814.004'];
      let hasEditPower = powers && powers['20001.21814.002'];
      let hasSearchPower = powers && powers['20001.21814.003'];
      const {FileUrl,name}=this.state
        const columns=[
            {
              title: '等级名称',
              key: 'levelname',
              dataIndex: 'levelname',
              width: 100,
              fixed: 'left'
            },
            {
              title: '经验值大于',
              dataIndex: 'credits',
              key: 'credits',
            },
            {
              title: '经验值小于',
              dataIndex: 'creditsmax',
              key: 'creditsmax',
            },
            {
              title: '级别',
              dataIndex: 'grade',
              key: 'grade',
            },
            {
              title: '创建时间',
              dataIndex: 'createdate',
              key: 'createdate',
            },
            {
              title: '修改时间',
              dataIndex: 'updatetime',
              key: 'updatetime',
            },
            {
              title: '操作',
              dataIndex: 'operation',
              key: 'operation',
              width:200,
              fixed: 'right',
              
              render:(data,record)=>(
                  <div>
                    <Divider type="vertical" />
                    <a className='operation' disabled={!hasEditPower} onClick={()=>this.editTask(record)} >编辑</a>
                    <Divider type="vertical"/>
                  </div>
                )
            },
          ];
          const search = [
            { key: 'levelname', label: '等级名称',qFilter:'Q=levelname_S_LK',type:'input'},
              
          ];
        return(
            <div>
                  
                    <TableAndSearch
                        rowkey={'levelid'}
                        columns={columns}
                        search={search}
                        url={'services/system/level/getLeveByName'}
                        addBtn={hasAddPower ? {order:1,url:'/SystemSettings/AddExperience'} : null}
                        deleteBtn={hasDelPower ? {order:2,url:'services/system/level/deleteLevel',field:'idList'} : null}
                    ></TableAndSearch>
            </div>
        )
    }



}