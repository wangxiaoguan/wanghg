import React,{Component} from 'react';
import {Divider,Popconfirm,Message,Modal,Spin} from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { getService,postService } from '../../myFetch.js';
import ServiceApi from '../../apiprefix';
import {BEGIN} from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
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

   
    render(){
      const {FileUrl,name}=this.state
        const columns=[
            {
              title: '等级名称',
              key: 'name',
              dataIndex: 'name',
              width: 100,
              fixed: 'left'
            },
            {
              title: '经验值大于',
              dataIndex: 'morevalue',
              key: 'morevalue',
            },
            {
              title: '经验值小于',
              dataIndex: 'lessvalue',
              key: 'lessvalue',
            },
            {
              title: '级别',
              dataIndex: 'grade',
              key: 'grade',
            },
            {
              title: '创建时间',
              dataIndex: 'createtime',
              key: 'createtime',
            },
            {
              title: '修改时间',
              dataIndex: 'revisetime',
              key: 'revisetime',
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
                    <a className='operation'  >编辑</a>
                    <Divider type="vertical"/>
                  </div>
                )
            },
          ];
          const search = [
            { key: 'name', label: '等级名称',qFilter:'Q=name_LK',type:'input'},
              
          ];
        return(
            <div>
                  
                    <TableAndSearch
                        rowkey={'id'}
                        columns={columns}
                        search={search}
                        url={''}
                        addBtn={{order:1,url:''}}
                        deleteBtn={{order:2,url:'',field:'ids'}}
                    ></TableAndSearch>
                   
                  
            </div>
        )
    }



}