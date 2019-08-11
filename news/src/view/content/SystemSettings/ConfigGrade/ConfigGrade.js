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
export default class ConfigGrade extends Component{

    constructor(props){
        super(props);
        this.state={
           
            
        }
    }

   
    render(){
      const {FileUrl,name}=this.state
        const columns=[
            {
              title: '配置名称',
              key: 'configname',
              dataIndex: 'configname',
              width: 300,
            },
            {
              title: '配置值',
              dataIndex: 'morevalue',
              key: 'morevalue',
            },
          ];
          const search = [
            { key: 'configkey', label: '配置档key',qFilter:'Q=configkey_LK',type:'input'},
            { key: 'configname', label: '配置档名称',qFilter:'Q=configname_LK',type:'input'}
              
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