import React, { Component} from 'react';
import { Tabs,Select,Button,message, Table,Input,Modal,Form,Radio,Message} from 'antd';
const Search=Input.Search;
import API_PREFIX, { masterUrl } from '../../content/apiprefix';
import {getService,postService} from '../.././content/myFetch';
class TableInModal extends Component{
  constructor(props){
    super(props);
    this.state={
      url:this.props.url,//全路径由3部分组成  纯路径（不包含分页条件等）
      query:this.props.query,//单独的条件
      search:this.props.search,//的条件
      searchValue:'',//搜索时输入框中的值

      addUrl:this.props.addUrl,//页面增加数据的接口
      body:this.props.body,//页面增加数据时的body   只需要更改其中的某个值即可   规定body.field为需要修改的值
      field:this.props.field,//需要table中的哪个字段

      // visible:this.props.visible,//弹窗是否可见
      key:this.props.key,//弹窗的key
      selectedRowKeys:[],//选中行的key值
      selectedRows:[],//选中的那一行
      currentPage:1,//当前页数
      // pageSize:10,  modal本身就不大，所以不能让用户选择每页显示多少条
      totalNumber:10,//全部的数据
      dataSource:[]

    }
  }
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   // console.log('nextProps, prevState',nextProps, prevState);
  //   if (nextProps.visible !== prevState.visible) {
  //     return {visible:nextProps.visible};
  //   }
  // }
  componentDidMount() {
    console.log("this.props",this.props);
    let url;
    if(this.state.query){//有过滤
      url=`${this.state.url}/1/10?${this.state.query}`;
    }else{//没有过滤
      url=`${this.state.url}/1/10`;
    }

    //初次渲染
    this.getData(url);
    // this.setState({key:this.state.key+1});
  }
  //工具  获取数据
  getData=(url)=>{
    console.log("tableInModal中的url",url);
     getService(API_PREFIX+url,data=>{
       console.log("返回的dataAPI_PREFIX+url",API_PREFIX+url);
       console.log("返回的data",data);
       if (data.retCode == 1) {
         console.log("返回的data2",data.root.list);
         data.root.list && data.root.list.map((item, index) => {
           item.key = index
         });
         this.setState({
           totalNumber: data.root.totalNum,
           dataSource: data.root.list,//表格中的数据
         },console.log('data.root.list',data.root.list));
       }
     });
   }
  //modal  ok
  handleOk=(e)=>{
    console.log('选中的值为：',this.state.selectedRows&&this.state.selectedRows[0]);

    const values={
        ...this.state.body,
      [this.state.body.field]:this.state.selectedRows&&this.state.selectedRows[0][this.state.field],
    };
    console.log("添加的数据为：",values);
    postService(API_PREFIX + `${this.state.addUrl}`,values, data => {
      if (data.retCode == 1) {
        Message.success("添加成功!");
        console.log('url为：', API_PREFIX + this.props.url);
        // this.setState({
        //   showAdd: false,
        // });
      }
      else {
        message.error(data.retMsg);
      }
    });
    this.setState({ searchValue: '',selectedRowKeys:[]});
    this.props.change(false);
  }
  //modal cancle
  handleCancel=(e)=>{
    this.props.change(false);
    this.setState({searchValue:'',selectedRowKeys:[]});
  }
  //条件查询
  onSearch=(value)=>{
    console.log('调用');
    this.setState({searchValue:value});
    let url;
    if(this.state.query){//有过滤
      url=`${this.state.url}/1/10?${this.state.query}&${this.state.search}${value}`;
    }else{//没有过滤
      url=`${this.state.url}/1/10?${this.state.search}${value}`;
    }
    console.log("tableInModal中的url(条件过滤时)",url);
    //条件过滤渲染
    this.getData(url);
  }
  //选中项发生变化的时的回调
  onSelectChange=(selectedRowKeys, selectedRows)=>{
    console.log("当前选中的行:",selectedRows);
        this.setState({selectedRowKeys, selectedRows});
  }
  //页码发生变化
  onPageChange=(page)=>{
    console.log("this.state.queryUrl",this.state.queryUrl);
    this.setState({currentPage:page},()=>{
      let url;
      if(this.state.query){//有过滤
        url=`${this.state.url}/${page}/10?${this.state.query}&${this.state.search}${this.state.searchValue}`;
      }else{//没有过滤
        url=`${this.state.url}/${page}/10?${this.state.search}${this.state.searchValue}`;
      }
      console.log("页码发生变化时url(条件过滤时)",url);
      //条件过滤渲染
      this.getData(url);
    });

  }
  render(){
    //获取从上一个页面传递过来的不再发生变化的数据
    const {modalData,searchData,tableData}=this.props;
    //rowSelection
    const rowSelection = {
      type:tableData.type,
      selectedRowKeys:this.state.selectedRowKeys,
      onChange: this.onSelectChange,
    };
    //pagination
    let pagination = {
      total: this.state.totalNumber,
      current: this.state.currentPage,
      onChange: this.onPageChange,
    };
    console.log('this.state.dataSource',this.state.dataSource);
    return(
        <div>
          <Modal
              title={modalData.title}
              cancelText={modalData.cancelText}
              okText={modalData.okText}
              maskClosable={false}//点击蒙层是否关闭
              visible={this.props.visible}
              destroyOnClose={true}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              key={modalData.key}
              width={modalData.width}
              afterClose={modalData.afterClose}
          >
            <Search
                enterButton
                placeholder="请输入关键字进行查询"
                onSearch={this.onSearch}
                //style={searchData.style}
            >
            </Search>
            <Table
                bordered
                rowSelection={rowSelection}
                columns={tableData.columns}
                dataSource={this.state.dataSource}
                pagination={pagination}
                rowKey={'id'}
            >

            </Table>
          </Modal>

        </div>
    )
  }

}
export default TableInModal;