import React, { Component } from 'react';
import { Tabs,Select,Row,Col,Button,message,Input,Form,Popconfirm,Modal,Table ,InputNumber,Message} from 'antd';
import {postService,getService,GetQueryString} from '../../myFetch';
import ServiceApi from '../../apiprefix';
import TableAndSearch from '../../../component/table/TableAndSearch';
import FormAndInput from '../../../component/table/FormAndInput';
import {  BEGIN,getDataSource,getPageData } from '../../../../redux-root/action';
import {connect} from 'react-redux';
const FormItem=Form.Item;
const Search = Input.Search;
@connect(
    state => ({
      dataSource: state.tableData,
      pageData:state.pageData,
      powers: state.powers,
      selectRowsData: state.selectRowsData,
    }),
    dispatch => ({
      getData: n => dispatch(BEGIN(n)),
    })
)
@Form.create()
class NewsActivityList extends Component {
  constructor(props){
    super(props);
    this.state={
      id:GetQueryString(location.hash,['id']).id,//获取前一个页面传过来的id
      showSort:false,//设置排序
      showSortKey:0,
      showAdd:false,//添加文章、活动
      showAddKey:0,
      addType:'文章',//添加的类型
      key:0,
      setSort:false,//设置排序
      setSortKey:0,
      record:'',//编辑时的数据
      dataSource:[],//表格中的数据
      currentPage:1,//当前页数
      pageSize:10,
      totalNumber:10,
      selectedRowKeys: [],//指定选中项的 key 数组，需要和 onChange 进行配合
      selectedRows:[],//选中的一行
      searchCotent:'',//搜索框中的值

    }
  }
  //获取分页数据
  getData=(page,pageSize)=>{
    let url=this.state.addType=='文章'?`services/news/artical/newsList/get/${page}/${pageSize}?Q=onlineState_S_EQ=1&&Q=type_I_NE=6`:`services/activity/activity/list/${page}/${pageSize}?Q=status_I_EQ=1`;
    getService(ServiceApi+url,data=>{
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
  pageChange=(page)=>{
    this.setState({
      currentPage:page
    },()=>{
      console.log("当前页为：",page);
      let url=this.state.addType=='文章'?`services/news/artical/newsList/get/${page}/10?Q=onlineState_S_EQ=1&&Q=type_I_NE=6&&Q=title_S_LK=${this.state.searchCotent}`:`services/activity/activity/list/${page}/10?Q=status_I_EQ=1&&Q=name_S_LK=${this.state.searchCotent}`;
      console.log("当前页的url为：",url);
      getService(ServiceApi+url,data=>{
        if (data.retCode === 1) {
          data.root.list&&data.root.list.map((item,index) => {
            item.key = index
          });
        }
        this.setState({
          totalNumber:data.root.totalNum,
          dataSource:data.root.list,//表格中的数据
        });
      });
    });

  }
  //设置排序
  setSort=(record)=>{

    this.setState({
      record:record,
      setSort:true,
      setSortKey:this.state.setSortKey+1,
    });
  }
  //设置排序  ok
  handleEditModalOK=()=>{
    this.props.form.validateFields((err,values)=>{
      if (err) {
        console.log('err',err)
        return;
      }
      let body={
        "newsspecialid":this.state.record?this.state.record.newsspecialid:'',
        "newsid":this.state.record?this.state.record.newsid:'',
        "sortid":values['sortid'],
      }
      console.log("数据为：",body);
      postService(ServiceApi + `services/news/artical/specialCategory/setNewsIdSort/update`,body, data => {
        if (data.retCode == 1) {
          Message.success("设置成功!");
          this.setState({
            setSort:false,
          });
        }
        else{
          message.error(data.retMsg);
        }
      });


      });
    this.setState({
      setSort:false,
    });
}
  //设置排序 cancle
  handleEditModalCancel=()=>{
    this.setState({
      setSort:false,
    });
  }
  //添加文章
  addNews=()=>{

   this.setState({
     addType:'文章',
     showAdd:true,
     showAddKey:this.state.showAddKey+1,
   },()=>{
     this.getData(1,10);
   });
  }
  //添加活动
  addActivity=()=>{

    this.setState({
      addType:'活动',
      showAdd:true,
      showAddKey:this.state.showAddKey+1,
    },()=>{
      this.getData(1,10);
    });
  }
  //ok
  handleAddModalOK=()=>{
    //添加活动/文章
    //获取选中的一行数据
    let selectedData=this.state.selectedRows;
    console.log('选中的值为：',selectedData[0]);
    let values={
      newsspecialid:this.state.id,
      newsid:selectedData[0].id,
      sortid:0,
      type:this.state.addType=='文章'?'1':'2',
    }
    console.log("添加的数据为：",values);
    if(this.state.addType=='文章'){//添加文章
      postService(ServiceApi + `services/news/artical/specialCategory/addNewsId`,values, data => {
        if (data.retCode == 1) {
          Message.success("添加成功!");
          this.setState({
            showAdd:false,
          });
        }
        else{
          message.error(data.retMsg);
        }
      });
    }else{//添加活动
      postService(ServiceApi + `services/news/artical/specialCategory/addNewsId`,values, data => {
        if (data.retCode == 1) {
          Message.success("添加成功!");
          console.log('url为：',ServiceApi+this.props.url);
          this.setState({
            showAdd:false,
          });
        }
        else{
          message.error(data.retMsg);
        }
      });

    }
  }
  //cancel
  handleAddModalCancel=()=>{
    this.setState({
      showAdd:false,
    });
  }
  reflesh=()=>{
    this.props.getData(ServiceApi+`services/news/artical/specialCategory/getNewsList/${this.state.id}/1/10`);
    this.setState({
      selectedRowKeys:[],
      searchCotent:'',

    });
  }
  //条件查询
  handleInput=(e)=>{
    console.log("哈哈哈哈哈哈哈");
    if(this.state.addType=='文章'){
      this.getData(this.state.currentPage,this.state.pageSize,`services/news/artical/newsList/get/1/10?Q=onlineState_S_EQ=1&&Q=type_I_NE=6&&Q=title_S_LK=${e.target.value}`);
    }else{
      this.getData(this.state.currentPage,this.state.pageSize,`services/activity/activity/list/1/10?Q=status_I_EQ=1&&Q=name_S_LK=${e.target.value}`);
    }
  }
//条件查询
  onSearch=(value)=>{
    this.setState({searchCotent:value});
    let url=this.state.addType=='文章'?`services/news/artical/newsList/get/1/10?Q=onlineState_S_EQ=1&&Q=type_I_NE=6&&Q=title_S_LK=${value}`:`services/activity/activity/list/1/10?Q=status_I_EQ=1&&Q=name_S_LK=${value}`;
    getService(ServiceApi+url,data=>{
      if (data.retCode === 1) {
        data.root.list&&data.root.list.map((item,index) => {
          item.key = index
        });
      }
      this.setState({
        totalNumber:data.root.totalNum,
        dataSource:data.root.list,//表格中的数据
      });
  });
  }
  render(){
    const pagination={
      showQuickJumper: true,
      total: this.state.totalNumber,
      // showSizeChanger: true,
      pageSize: this.state.pageSize,
      current: this.state.currentPage,
      onShowSizeChange: this.pageSizeChange,
      onChange: this.pageChange,
    };
    const rowSelection = {
      selectedRowKeys:this.state.selectedRowKeys,
      type:"radio",
      onChange: (selectedRowKeys, selectedRows) => {  //选中项发生变化的时的回调
        this.setState({selectedRowKeys:selectedRowKeys,selectedRows:selectedRows},()=>{
          console.log("selectedRowKeys",selectedRowKeys);
        });
      },
    };
    const { dataSource } = this.state;
    let data=[];
    dataSource&&dataSource.map((item,index)=>{
      let itemKey={
        key:index
      }
      data.push({...item,...itemKey});
    });
    console.log("type:",this.state.editType);
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
    const setStting= (
        <Row >
          <Col span="24">
            <FormItem
                label="排序ID："
                {...formItemLayout}
            >
                {
                  getFieldDecorator('sortid',{
                        initialValue: this.state.record.sortid,
                        rules: [
                          {
                            required: true,
                            message:'请输入排序ID'
                          },
                        ]
                  }

                  )
                  (
                      <InputNumber/>
                  )
                }
            </FormItem>
          </Col>
      </Row>);

    const columns=[
      {
        title:'标题',
        dataIndex:'title',
        key:'title',
      },
      {
        title:'排序ID',
        dataIndex:'sortid',
        key:'sortid',
      },
      {
        title:'类型',
        dataIndex:'type',
        key:'type',
      },
      {
        title:'创建时间',
        dataIndex:'createdate',
        key:'createdate',
      },
      {
        title:'操作',
        dataIndex:'operation',
        key:'operation',
        render:(data,record)=>(
          <a  onClick={()=>this.setSort(record)}>设置排序</a>
        )
      },
    ];
    const newsColumns=[
      {
        title:'标题',
        dataIndex:'title',
        key:'title',
      },
        ];
    const activityColumns=[
      {
        title:'标题',
        dataIndex:'name',
        key:'name',
      },
    ];
    let special={
      "idList":[],
      "id":this.state.id,
    }
 console.log("前一个页面传入的id:",this.state.id);

    return<div>
      <TableAndSearch
          columns={columns}
          url={`services/news/artical/specialCategory/getNewsList/${this.state.id}`}
          deleteBtn={{order:1,url:'services/news/artical/sepcialCategory/newsId/delete',field:'ids',special:special}}
          updateBtn={{order:2}}
          customBtn={{order: 3, label: '添加文章', onClick: this.addNews, className: 'queryBtn' }}
          addBtn={{order: 4,label: '添加活动',  OnEvent: this.addActivity, className: 'queryBtn'}}
          goBackBtn={{order:5,url:'',label:'返回'}}
          rowkey={'newsid'}
      >

      </TableAndSearch>
      <Modal
          afterClose={this.reflesh}
          title={this.state.addType=='文章'?'添加文章':'添加活动'}
          visible={this.state.showAdd}
          cancelText="取消"
          okText="添加"
          onOk={this.handleAddModalOK}
          onCancel={this.handleAddModalCancel}
          destroyOnClose={true}
          key={this.state.showAddKey}
      >
        <Search
            style={{width:"440px",marginLeft:"15px",marginBottom:"20px"}}
            placeholder="请输入关键字进行查询"
            onSearch={value =>this.onSearch(value)}
            enterButton
        >
        </Search>
        <Table
            columns={this.state.addType=='文章'?newsColumns:activityColumns}
            dataSource={data}
            pagination={pagination}
            rowSelection={rowSelection}
            bordered
            rowKey={'id'}
        >
        </Table>
      </Modal>
      <Modal
          afterClose={this.reflesh}
          title={this.state.record.type=='资讯'?'编辑专题文章信息':'编辑专题活动信息'}
          visible={this.state.setSort}
          key={this.state.setSortKey}
          cancelText="返回"
          okText="确定"
          onOk={this.handleEditModalOK}
          onCancel={this.handleEditModalCancel}
          destroyOnClose={true}
      >
        <Form >{setStting}</Form>
      </Modal>
    </div>
  }

}
export default NewsActivityList;
