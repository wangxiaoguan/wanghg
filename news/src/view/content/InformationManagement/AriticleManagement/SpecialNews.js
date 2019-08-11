import React, { Component } from 'react';
import { Tabs,InputNumber,Button,message,Input,Form,Popconfirm,Modal,Divider ,Message} from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {postService,getService,GetQueryString} from '../../myFetch';
import ServiceApi from '../../apiprefix';
import {pageJummps} from '../PageJumps';
const FormItem=Form.Item;
import {  BEGIN,getDataSource,getPageData } from '../../../../redux-root/action/table/table';
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
class SpecialNews extends Component {
  constructor(props){
    super(props);
    this.state={
      newsId:GetQueryString(location.hash,['newsId']).newsId,//获取前一个页面传过来的id
      isShow:false,
      showKey:0,
      isEdit:false,
      record:'',//编辑时的数据
    }
  }
  //编辑
  editNews=(record)=>{
    console.log("编辑");
  this.setState({
    isEdit:true,
    record:record,
    isShow:true,
    showKey:this.state.showKey+1,
  });
  }
  //栏目资讯活动管理
  management=(record)=>{
    location.hash =`${pageJummps.newsActivityList}/?id=${record.id}`
  }
  //新增和编辑的弹窗
  showModal=()=>{
    this.setState({
      isShow:true,
      showKey:this.state.showKey+1,
    });

  }
  //ok
  handleOk=(e)=>{
    this.setState({
      isShow:false,
    });

  }
//cancel
  handleCancel=(e)=>{
    this.setState({
      isShow:false,
    });
  }

  render(){
    const  columns=[
      {
        title:'专题栏目',
        dataIndex:'title',
        key:'title',
      },
      {
        title:'排序ID',
        dataIndex:'sortid',
        key:'sortid',
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
          <span>
            <a  onClick={()=>this.editNews(record)}>编辑</a>

             <Divider type="vertical" />
            {/*<a onClick={()=>this.management(record)}>栏目资讯活动管理</a>*/}
            <a onClick={()=>location.hash =`${pageJummps.newsActivityList}?id=${record.id}`}>栏目资讯活动管理</a>
          </span>
          )
      },

    ];
    const search=[
      { key: 'title', label: '专题栏目',qFilter:'Q=title_LK',type:'input'},
    ];

    return(
        <div>
          <TableAndSearch
              columns={columns}
              search={search}
              url={`services/news/artical/specialCategoryList/get/${this.state.newsId}`}
              addBtn={{order:1,OnEvent:this.showModal}}
              deleteBtn={{order:2,url:`services/news/artical/sepcialCategory/newsSpecialId/delete`,field:'idList'}}
              updateBtn={{order:3}}
              goBackBtn={{order:4,url:pageJummps.article,label:'返回'}}
              rowkey={'id'}
          >
          </TableAndSearch>
          <Modal
              title={this.state.isEdit?'编辑专题栏目':'增加专题栏目'}
              maskClosable={false}//点击蒙层是否关闭
              footer={null}
              visible={this.state.isShow}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              key={this.state.showKey}
          >
            <AddForm url={`services/news/artical/specialCategoryList/get/${this.state.newsId}`} isEdit={this.state.isEdit} newsId={this.state.newsId} record={this.state.record} handleCancel={this.handleCancel} handleOk={this.handleOk}/>
          </Modal>
        </div>
    );

  }
}
@connect(
    state => ({
      dataSource: state.table.tableData,
      pageData:state.table.pageData,
    }),
    dispatch => ({
      getData: n => dispatch(BEGIN(n)),
    })
)
@Form.create()
class AddForm extends Component{
  //编辑/新增提交事件
  handleSubmit=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err,values)=>{
      if (err) {
        console.log('err',err)
        return;
      }
      console.log("数据为：",values);
      if(this.props.isEdit){//编辑的数据
        values.id=this.props.record.id;
        postService(ServiceApi + `services/news/artical/specialCategory/update`,values, data => {
          if (data.retCode == 1) {
            Message.success("修改成功!");
            this.props.getData( `${ServiceApi+this.props.url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            this.props.handleOk();
          }
          else{
            message.success(data.retMsg);
          }
        });
      }else{//新增的数据
       let body={
            ...values,
          newsid:this.props.newsId
        }
        postService(ServiceApi + `services/news/artical/specialCategory/add`,body, data => {
          if (data.retCode == 1) {
            Message.success("新增成功!");
            console.log("this.props.url",this.props.url);
            this.props.getData( `${ServiceApi+this.props.url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            this.props.handleOk();
          }else{
            message.success(data.retMsg);
          }
        });
      }


    });

  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    let data=this.props.record;
    return(
        <Form  onSubmit={this.handleSubmit}>
          <FormItem
              {...formItemLayout}
              label="专题栏目名称"
          >
            {
              getFieldDecorator('title',{initialValue:data.title?data.title:'',
                rules:[
                  { required: true, message: '请输入专题栏目名称,且最长为20个字符！',max:20 }
                ]
              })
              (<Input/>)
            }

          </FormItem>
          <FormItem
              {...formItemLayout}
              label="排序ID"
          >
            {
              getFieldDecorator('sortid',{initialValue:data.sortid?data.sortid:0,
                rules:[
                  { required: true, message: '请输入排序ID！' }

                ]
              })
              (<InputNumber/>)
            }

          </FormItem>
          <FormItem>
            <Button style={{marginLeft:'150px'}} className='resetBtn' type="primary" onClick={this.props.handleCancel}>
              返回
            </Button>
            <Button className='queryBtn' type="primary" htmlType="submit">
              确定
            </Button>
          </FormItem>
        </Form>
    );
  }
}
export default SpecialNews;