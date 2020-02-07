import React, { Component } from 'react';
import { Form, Button,Row,Col,Select,Modal ,Input,message,InputNumber } from 'antd';
// import TableSearch from '../../../../component/table/TableSearch';
import FormAndInput from '../../../../component/table/FormAndInput';
import { connect } from 'react-redux';
import { BEGIN,getPageData } from '../../../../../redux-root/action/table/table';// yelu 2019-01-16 取出缓存里面设置分页数据函数getPageData
import API_PREFIX from '../../../../content/apiprefix';
import {setArticleData,setArticleAdd} from '../../../../../redux-root/action/attach/attach';
import './attach.less';
const Option = Select.Option;
@connect(state => ({
      pageData: state.table.pageData,              //封装表格分页查询条件数据
      selectRowsData: state.table.selectRowsData,  //封装表格选择数据
      getActivityAdd:state.attach.activityAdd,
      getFileAdd:state.attach.fileAdd,
      getArticleData:state.attach.articleData,//获取添加文章的数据
      getFormData: state.attach.getFormData,
    }),
    dispatch => ({
      setTableData: n => dispatch(BEGIN(n)),
      setArticleData:n=>dispatch(setArticleData(n)),
      setArticleAdd:n=>dispatch(setArticleAdd(n)),
      getPageData:n=>dispatch(getPageData(n)), // yelu 2019-01-16 每次查询时初始缓冲里面的页码为默认值
    }))
export default class ArticleAttach extends  Component {
  constructor(props){
    super(props);
    this.state={
      articleArr:[],//添加文章的arr
      showModal:false,//是否展示modal
      showModalKey:0,//展示modal的key值
      //下拉框的Option  （用户展示文章title，id返回给后端）
      selectOption:[],
      addId:0, //添加文章时的id
      result:[],//添加完成后的数据  {key:addId,id:selectedId}
      all:[],//全部的附件信息，用于判断附件是否已经是5个
      initialValue:this.props.initialValue,
      flowData:[],
      qfilter: '', // yelu 2019-01-16 添加作者查询条件字段 
    }
  }
  componentDidMount(){
    // if(this.props.flowData){//不为空
    //   this.dealData(this.props.flowData);
    // }
  }
  componentDidUpdate(){
    if (this.props.initialValue &&this.props.initialValue !== this.state.initialValue) {
      this.setState({ initialValue: this.props.initialValue },()=>{
        let initialValue=this.state.initialValue;
        this.dealData(initialValue);
      });
    }
    if (this.props.flowData&&this.props.flowData !== this.state.flowData) {
      console.log('我们都是一家人！！！！！！！！！！！！！！！！', this.props.flowData)
      this.setState({flowData: this.props.flowData}, () => {
        //总的数据，返回上一步，父组件传入的 initialValue
        let flowData = this.state.flowData;
        //页面相关的数据处理
        this.dealData(flowData);
      });
    }

  }
  dealData=(data)=>{
        let articleArr=this.state.articleArr;
        let result=this.state.result;
        let selectOption=this.state.selectOption;
        if(data&&data.length>0){//有数据 即为 上一步
          data.map((item,index)=>{
            if(item.attachType == 1) {
              articleArr.push({key:index});
              result.push({key:index,id:item.attachUrl,name:item.fileName, content:item.content});
              selectOption.push({key:index,option:[{key:item.attachUrl,value:item.fileName}]});
            }
          });
          this.setState({articleArr,result,addId:(data.length)-1},()=>{
            this.props.setArticleData(result);
            this.props.setArticleAdd(articleArr); //向缓存中放数据
          });
        }
  }
  //添加文章
  addArticle=(e)=>{
    if(this.state.articleArr.length>0){//任务附件=》添加附件，修复添加多个资讯，选择资讯，选好资讯以后数据始终回填在最后一个资讯的问题xwx2019/2/27
      if(this.state.articleArr.length>this.state.selectOption.length){
        message.error('请先选好资讯，再添加资讯!')
        return false
      }
    }
    let addId=this.state.addId+1;
    let articleArr=this.state.articleArr;
    if(articleArr.length>4){
      message.error('任务附件不能大于5个');
      return;
    }else{
      articleArr.push({key:addId});
    }

    let all=[...articleArr,...this.props.getActivityAdd,...this.props.getFileAdd];
    // if(all.length>5){ //不能超过5个
    //   message.error('任务附件不能大于5个');
    //   return;
    // }
    this.setState({addId,articleArr});
    this.props.setArticleAdd(articleArr);
  }
  //选择资讯
  selectArticle=(e)=>{
    localStorage.setItem("selectedRowKeys", '');
    this.setState({showModal:true,showModalKey:this.state.showModalKey+1});
  }
  //删除文章
  delArticle=(e,key)=>{

    let articleArr=this.state.articleArr;
    let result=this.state.result;
    let selectOption=this.state.selectOption;
     articleArr=articleArr.filter((item,index)=>{
      return item.key!=key;
    });
    result=result.filter((item,index)=>{
      return item&&item.key!=key;
    });
    selectOption=selectOption.filter((item,index)=>{
      return item&&item.key!=key;
    });
    this.setState({articleArr,result,selectOption},()=>{
      //往缓存中放数据
      this.props.setArticleData(result);
      this.props.setArticleAdd(articleArr);
    });
  }
  //ok弹窗  1、关闭弹窗2、将数据给select框3、设置数据到result中
  handleOk=(e,key)=>{
    this.setState({showModal:false});  //1、关闭弹窗
    let selectedData=this.props.selectRowsData;
    let selectOption=this.state.selectOption;
    selectOption.push({key:key,option:[{key:selectedData[0].id,value:selectedData[0].title}]});
    this.setState({selectOption}); //2、将数据给select框
    //3、设置数据到result中
    let result=this.state.result;
    result=result.filter((item)=>{  //去重
      return item&&item.key!=key;
    });
    let content = {
      objectId: selectedData[0].id,
      objectType: 1,
      type: selectedData[0].newsType,
      title: selectedData[0].title,
      isAtlas:  selectedData[0].isAtlas ? true : false,
      titleImage:  selectedData[0].titleImage ? selectedData[0].titleImage.split(',') : []
    }
    result.push({key:key,id:selectedData[0].id,name:selectedData[0].title,content:JSON.stringify(content)});
    this.setState({result});
    //往缓存中放数据
    this.props.setArticleData(result);

  }
  //cancle弹窗   关闭弹窗
  handleCancel=()=>{
    this.setState({showModal:false});
  }
  //  search框，点击回车后条件查询
  handleSearch=(value,url,qfilter)=>{
    value = value.target.value
    qfilter = value == '' ? '' : `Q=searchText=${value}` // yelu 2019-01-16 修改选择人员查询后分页后不带查询条件
    this.setState({qfilter,})
    // yelu 2019-01-16 每次查询的时候要重置页码为1
    this.props.getPageData({currentPage: 1, pageSize: 10, query: qfilter}); // 每次查询时初始缓冲里面的页码为默认值
    this.props.setTableData(API_PREFIX + `${url}/1/10?${qfilter}`);
    // this.props.setTableData(API_PREFIX + `${url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=title_S_LK=${value}`);
  }
  render(){
    const {articleArr,showModalKey,showModal,selectOption,result,qfilter}=this.state;
    const { disabled}=this.props;
    const columns=[
      {
        title:'资讯标题',
        dataIndex:'title',
        key:'title',
      },
      {
        title:'类型',
        dataIndex:'newsType',
        key:'newsType',
        render: (text, record) => {
          switch (record.newsType) {
            case 1: return '文字';
            case 2: return '图片';
            case 3: return '视频';
            case 4: return '网页';
            case 5: return '党建学习';
            case 6: return '其它学习';
            default: return '';
          }
        }
      },
      {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate',
      }
    ];
    const url=`services/web/party/task/getTaskAttachActivity/${this.props.getFormData.userId}/1`;
    // const qfilter='Q=onlineState_S_EQ=1&&Q=type_I_NE=6';
    return(
        <div>
          <Button onClick={this.addArticle}  disabled={disabled} >
            添加资讯
          </Button>
          {
            articleArr&&articleArr.map((item,index)=>{
              let select=[];//取出对应的option及value
              selectOption.map((s)=>{
                if(s.key==item.key){
                  select=s.option;
                }
              })
              return(
                  <div key={item.key}  className='attach-main'>
                     <Select  value={select.length>0?select[0].key:''}>
                       {
                         select&&select.map((_=>{
                           return (<Option key={_.key} value={_.key}>
                             {_.value}</Option>)
                         }))
                       }
                     </Select>
                    <Button onClick={this.selectArticle}  disabled={disabled} >选择资讯</Button>
                    <Button onClick={(e)=>this.delArticle(e,item.key)} disabled={disabled}>删除</Button>
                    <Modal width='50%'
                        title='添加资讯'
                        cancelTexnt='添加'
                        okText='确定'
                        maskClosable={false}//点击蒙层是否关闭
                        key={showModalKey}
                        visible={showModal}
                        destroyOnClose={true}
                        onOk={(e)=>this.handleOk(e,item.key)}
                        onCancel={this.handleCancel}
                    >
                      {/* <TableSearch
                          columns={columns}
                          url={url}
                          qfilter={qfilter}
                          onSearch={(value)=>this.handleSearch(value,url,qfilter)}
                      /> */}
                      {/* yelu 2019-01-16 替换TableSearch */}
                      <FormAndInput 
                          columns={columns}
                          url={url}
                          qfilter={qfilter}
                          onSearch={(value)=>this.handleSearch(value,url,qfilter)}
                      />
                    </Modal>
                  </div>
              )
            })
          }

        </div>
    );
  }
}