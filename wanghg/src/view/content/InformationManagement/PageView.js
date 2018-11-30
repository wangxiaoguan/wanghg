import React, { Component } from 'react';
import TableAndSearch from './../../component/table/TableAndSearch';
import {postService,getService,GetQueryString} from '.././myFetch';
import API_PREFIX from '.././apiprefix';
class PageView extends Component{
  constructor(props){
    super(props);
    this.state={
      detail:'',//；浏览量中详情的数据
      // userId:'',//当前浏览用户的id
      newsId:GetQueryString(location.hash,['newsId']).newsId,//获取前一个页面传过来的id
    }
  }

  componentDidMount(){

  }
  render(){
    const columns=[
      {
        title:'手机号',
        dataIndex:'mobile',
        key:'mobile'
      },
      {
        title:'用户姓名',
        dataIndex:'lastname',
        key:'lastname'
      },
      {
        title:'邮箱',
        dataIndex:'email',
        key:'email'
      },{
        title:'部门',
        dataIndex:'orginfoName',
        key:'orginfoName',
      },{
        title:'浏览时间',
        dataIndex:'createDate',
        key:'createDate'
      },
      // {
      //   title:'操作',
      //   dataIndex:'categoryname',
      //   key:'categoryname3',
      //   render:(data,record)=>{
      //      return (
      //          <a
      //              onClick={()=>{
      //                // this.setState({userId:record.id},()=>{
      //                  // console.log("***********",record.id);
      //                  getService(API_PREFIX + `services/system/systemAndCompanyUser/list/1/10?Q=userid_S_EQ=${record.id}`, data => {
      //                    if(data.retCode==1){
      //                      if(data.root.list){
      //                        this.setState({detail:data.root.list[0]});
      //                      }
      //
      //                    }
      //                  // });
      //                });
      //                const data=JSON.stringify(this.state.detail);
      //                window.sessionStorage.setItem('userData',data);
      //                location.hash="/SystemSettings/UserManagementDetail"
      //              }
      //              }>
      //            详情</a>
      //      );
      //   }
      // }
    ];
    const search = [
      { key: 'lastname', label: '用户',qFilter:'Q=lastname_LK',type:'input'},
      { key: 'orginfoName', label: '部门',qFilter:'Q=orginfoName_LK',type:'input'},
      { key: 'createdate', label: '起止时间', type: 'rangePicker' },
    ];
    return(
        <TableAndSearch
            columns={columns}
            search={search}
            url={`services/system/user/newsInfo/viewCountUserList/get/${this.state.newsId}`}
            goBackBtn={{order:1,label:'返回',url:''}}
        >
        </TableAndSearch>
    );
  }
}
export default PageView;