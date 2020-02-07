

import React,{Component} from 'react';
import {Divider,Popconfirm,message,Spin} from 'antd';
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
class VersionInformation extends Component{

    constructor(props){
        super(props);
        this.state={
            provinceData: ['Android', 'IOS','TV', 'Windows'],    //平台类型
            loading: false,
            totalNum:0,
            data:[],
        };
    }

    componentWillMount() {
      
    
      }
    componentDidMount(){
    }
    //转出党员编辑
    editParty=(data)=>{
      
    }

    render(){
        let powers = this.props.powers;
        console.log('权限码', powers);
        let hasAddPower = powers && powers['20006.21407.001'];//新建
        let hasDelPower = powers && powers['20006.21407.004'];//删除
        let hasEditPower = powers && powers['20006.21407.002'];//编辑
        let hasSearchPower = powers && powers['20006.21407.003'];//查询
        const columns=[
            {
              title: '版本号',
              key: 'nearCode',
              dataIndex: 'nearCode',
              width: 100,
              fixed: 'left',
            },
            {
              title: '版本名称',
              dataIndex: 'versionName',
              key: 'versionName',
            },
            {
              title: '平台类型',
              dataIndex: 'versionType',
              key: 'versionType',
              render: (text, record) => {
                return <div>
                  {record.versionType===1?'Android':null}
                  {record.versionType===2?'IOS':null}
                  {record.versionType===3?'TV':null}
                  {record.versionType===4?'Windows':null}
                </div>;
              },
            },
            {
              title: '下载地址',
              dataIndex: 'downLoadAddr',
              key: 'downLoadAddr',
            },
            {
              title: '更新日志',
              dataIndex: 'versionLog',
              key: 'versionLog',
            },
            {
              title: '发布时间',
              dataIndex: 'createDate',
              key: 'createDate',          
            },
            {
              title: '描述',
              dataIndex: 'remark',
              key: 'remark',
            },
            {
              title: '操作',
              dataIndex: 'operation',
              key: 'operation',
              width:100,
              fixed: 'right',
              
              render:(data,record)=>(
                  <div>
                    {/* <Divider type="vertical" /> */}
                    <a className='operation' disabled={!hasEditPower} onClick={() => location.hash = `/SystemSettings/VersionInformationEdit?isEdit=true&id=${record.id}`} >编辑</a>
                    <Divider type="vertical"/>
                    <a className='operation' disabled={!hasSearchPower} onClick={() => location.hash = `/SystemSettings/VersionInformationDetail?isEdit=true&id=${record.id}`} >详情</a>
                  </div>
                ),
            },
          ];
          const search = [
            { key: 'select',label: '平台类型',qFilter: 'Q=versionType',  type: 'select',option:[{key:'',value:'全部'},{key:1,value:'Android'}, {key:2,value:'IOS'},{key:3,value:'TV'},{key:4,value:'Windows'}],
              },
          ];
        return(
          <Spin spinning={this.state.loading}>
            <div>
                    <TableAndSearch
                        type="VersionInformation"
                        rowkey={'id'}
                        columns={columns}
                        addBtn={hasAddPower ? {order:1,url:'/SystemSettings/VersionInformationAdd?isEdit=false'} : null}
                        deleteBtn={hasDelPower ? {order:4,url:'services/web/config/VersionInfo/delete'} : null}
                        search={search}
                        url={'services/web/config/VersionInfo/getList'}
                     />
            </div>
          </Spin>  
        );
    }
     

}

export default VersionInformation;