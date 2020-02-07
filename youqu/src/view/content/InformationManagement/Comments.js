import React, { Component } from 'react';
import TableAndSearch from './../../component/table/TableAndSearch';
class Comments extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const columns=[
      {
        title:'评论人',
        dataIndex:'author',
        key:'author'
      },
      {
        title:'类型',
        dataIndex:'title',
        key:'title'
      },
      {
        title:'标题名称',
        dataIndex:'type',
        key:'type'
      },{
        title:'内容',
        dataIndex:'categoryname2',
        key:'categoryname2',
      },{
        title:'被回复人',
        dataIndex:'author2',
        key:'author2'
      },
      {
        title:'举报人',
        dataIndex:'title2',
        key:'title2'
      },
      {
        title:'是否被举报',
        dataIndex:'type',
        key:'type2'
      },{
        title:'评论类型',
        dataIndex:'categoryname',
        key:'categoryname2',
      },{
        title:'创建时间',
        dataIndex:'type',
        key:'type3'
      },{
        title:'操作',
        dataIndex:'categoryname',
        key:'categoryname3',
        render:(data,record)=>{
          <div>
            <a>详情</a>
            <a>{record.评论类型=="普通评论"?'精彩评论':'普通评论'}</a>
          </div>
      }
      }
    ];
    const isOrNotOptions = [{ key: '', value: '全部' },{ key: '1', value: '是' }, { key: '0', value: '否' }];
    const search = [
      { key: 'isrequireddesp', label: '是否被举报', qFilter: 'Q=isrequireddesp_S_EQ', type: 'select', option: isOrNotOptions },
      { key: 'ispush', label: '是否推送', qFilter: 'Q=ispush_S_EQ', type: 'select', option: isOrNotOptions },
      { key: 'ishomepage', label: '类型', qFilter: 'Q=ishomepage_S_EQ', type: 'select', option: isOrNotOptions },
      { key: 'title', label: '文章标题',qFilter:'Q=title_LK',type:'input'},
      { key: 'createdate', label: '起止时间', type: 'rangePicker' },
    ];
    return(
        <TableAndSearch columns={columns}
         deleteBtn={{order:1,url:'',field:''}}
         updateBtn={{order:2}}
         exportBtn={{order:3,url:'',type:'fileName'}}
         goBackBtn={{order:4,label:'返回',url:'InformationManagement/Article'}}
        >

        </TableAndSearch>
    );
  }
}
export default Comments;