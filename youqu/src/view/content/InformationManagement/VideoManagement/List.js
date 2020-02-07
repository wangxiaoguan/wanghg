import React, { Component } from 'react';
import { Tabs,Button,message,Popconfirm,Divider,Table } from 'antd';
import {postService,getService} from '../../myFetch';
import ServiceApi from '../../apiprefix';
class List extends Component{
  constructor(props){
    super(props);
    this.state={
      dataSource:[],//表格中的数据
      currentPage:1,//当前页数
      pageSize:1,
      totalNumber:10,
    }
  }
  componentWillMount() {
    this.getData(1, 10);
  }
  getData=(page,pageSize)=>{
    getService(ServiceApi+`services/news/video/newsList/get/${page}/${pageSize}`,data=>{
      this.setState({
        currentPage:page,
        pageSize:pageSize,
        totalNumber:data.root.totalNum,
        dataSource:data.root.list,//表格中的数据
      });
    });

}
//pageSize发生改变的回调
  pageSizeChange=(current,size)=>{
    this.getData(current,size);

  }
  //页码改变的回调，参数是改变后的页码及每页条数
  pageChange=(page,pageSize)=>{
  this.getData(page,pageSize);
}


 render(){
   const { dataSource } = this.state;
   let data=[];
   dataSource&&dataSource.map((item,index)=>{
   let itemKey={
     key:index
   }
     data.push({...item,...itemKey});
   });
   const pagination={
     showQuickJumper:true,
     total: this.state.totalNumber,
     showSizeChanger: true,
     pageSize: this.state.pageSize,
     current: this.state.currentPage,
     onShowSizeChange: this.pageSizeChange,
     onChange: this.pageChange,
   }
   const columns=[
     {
       title:'发布人',
       dataIndex:'author',
       key:'author',
       width:100,
       fixed: 'left'
     },
     {
       title:'视频标题',
       dataIndex:'title',
       key:'title',
       width:100,
       fixed: 'left'
     },
     {
       title:'所属栏目',
       dataIndex:'categoryname',
       key:'categoryname',
     },
     {
       title:'是否推送',
       dataIndex:'ispushdesp',
       key:'ispushdesp',
       width:80,
     },
     {
       title:'是否上首页',
       dataIndex:'ishomepagedesp',
       key:'ishomepagedesp',
       width:80,
     }, {
       title:'创建时间',
       dataIndex:'createdate',
       key:'createdated',
       width:150,
     },
     // {
     //   title:'发布时间',
     //   dataIndex:'pulishdate',
     //   key:'pulishdate',
     //   render:(data,record)=>{
     //     return moment(record.pulishdate).format('YYYY-MM-DD HH:mm');
     //   }
     // },
     {
       title:'操作',
       dataIndex:'operation',
       key:'operation',
       width:250,
       fixed: 'right',
       render:(data,record)=>(
           <div>
             <Popconfirm title="确定发布该视频吗?">
               <a className='operation' >发布</a>
               <Divider type="vertical" />
             </Popconfirm>
             <span><a className='operation' >编辑</a>
            <Divider type="vertical" />
              <a className='operation' >详情</a>
               {/*<Divider type="vertical" />*/}
           </span>

           </div>
       )
     }
   ];
    return(
        <div>
          <Table
              columns={columns}
              dataSource={data}
              pagination={pagination}
          >
          </Table>
        </div>
    );
 }
}
export default List;