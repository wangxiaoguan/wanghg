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
export default class ConfigGrade extends Component{

    constructor(props){
        super(props);
        this.state={
           
            
        };
    }

    editTask=(record)=>{
      console.log("record==>",record);
      location.hash =`/SystemSettings/EditConfig?id=${record.id}`;
    }
    render(){
      let powers = this.props.powers;
      let hasAddPower = powers && powers['20006.21409.001'];//新建
      let hasDelPower = powers && powers['20006.21409.004'];//删除
      let hasEditPower = powers && powers['20006.21409.002'];//修改
      let hasSearchPower = powers && powers['20006.21409.003'];//查询
      const {FileUrl,name}=this.state;
        const columns=[
            {
              title: '配置名称',
              key: 'name',
              dataIndex: 'name',
              width: 300,
            },
            {
              title: '配置值',
              dataIndex: 'value',
              key: 'value',
            },
            {
              title: '是否启用',
              dataIndex: 'isEnable',
              key: 'isEnable',
              render:(record)=>{
                if(record){
                  return <div>是</div>;
                }else{
                  return <div>否</div>;
                }
              },
            },
            {
              title: '配置描述',
              dataIndex: 'description',
              key: 'description',
            },
            {
              title: '创建时间',
              dataIndex: 'createDate',
              key: 'createDate',
            },
            {
              title: '操作',
              dataIndex: 'x',
              key: 'x',
              width:200,
              fixed: 'right',
              render:(data,record)=>(
                  <div>
                    <a className='operation' disabled={!hasEditPower} onClick={()=>this.editTask(record)} >编辑</a>
                  </div>
                ),
            },
          ];
          const search = [
            { key: 'name', label: '配置档名称',qFilter:'Q=name',type:'input'},
              
          ];
        return(
            <div>
                  
                    <TableAndSearch
                        rowkey={'id'}
                        columns={columns}
                        search={search}
                        url={'services/web/configInfo/getList'}
                        addBtn={hasAddPower ? {order:1,url:'/SystemSettings/AddConfig'} : null}
                        deleteBtn={hasDelPower ? {order:2,url:'services/web/configInfo/delete '} : null}
                        ConfigGrade='ConfigGrade'
                     />
                   
                  
            </div>
        );
    }



}