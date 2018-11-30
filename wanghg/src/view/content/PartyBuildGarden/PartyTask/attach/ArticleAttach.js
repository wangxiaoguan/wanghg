import React, { Component } from 'react';
import { Form, Button,Row,Col,Select,Modal ,Input,Message,InputNumber } from 'antd';
import TableSearch from '../../../../component/table/TableSearch';
import { connect } from 'react-redux';
import { BEGIN } from '../../../../../redux-root/action/table/table';
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
    }),
    dispatch => ({
      setTableData: n => dispatch(BEGIN(n)),
      setArticleData:n=>dispatch(setArticleData(n)),
      setArticleAdd:n=>dispatch(setArticleAdd(n)),
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
       flowData:this.props.flowData,
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
      this.setState({flowData: this.props.flowData}, () => {
        //总的数据，返回上一步，父组件传入的 initialValue
        let flowData = this.state.flowData;
        //页面相关的数据处理
        this.dealData(flowData);
      });
    }

  }
  dealData=(data)=>{
        console.log('initialValuea',data);
        let articleArr=this.state.articleArr;
        let result=this.state.result;
        let selectOption=this.state.selectOption;
        if(data&&data.length>0){//有数据 即为 上一步
          data.map((item,index)=>{
            this.setState({addId:index},()=>{
              articleArr.push({key:this.state.addId});
              result.push({key:this.state.addId,id:item.id,name:item.name});
              selectOption.push({key:this.state.addId,option:[{key:item.id,value:item.name}]});
            });
          });
          this.setState({articleArr,result},()=>{
            this.props.setArticleData(result);
            this.props.setArticleAdd(articleArr); //向缓存中放数据
          });

        }


  }
  //添加文章
  addArticle=(e)=>{
    let addId=this.state.addId+1;
    let articleArr=this.state.articleArr;
    articleArr.push({key:addId});
    let all=[...articleArr,...this.props.getActivityAdd,...this.props.getFileAdd];
    if(all.length>5){ //不能超过5个
      Message.error('任务附件不能大于5个');
      return;
    }
    this.setState({addId,articleArr});
    this.props.setArticleAdd(articleArr);
  }
  //选择资讯
  selectArticle=(e)=>{
    this.setState({showModal:true,showModalKey:this.state.showModalKey+1});
  }
  //删除文章
  delArticle=(e,key)=>{

    let articleArr=this.state.articleArr;
    let result=this.state.result;
    let selectOption=this.state.selectOption;
    console.log('删除前articleArr',articleArr);
    console.log('删除前result',result);
    console.log('删除前selectOption',selectOption);
     articleArr=articleArr.filter((item,index)=>{
      console.log("item",item,key,item.key==key);
      return item.key!=key;
    });
    result=result.filter((item,index)=>{
      return item&&item.key!=key;
    });
    selectOption=selectOption.filter((item,index)=>{
      return item&&item.key!=key;
    });
    console.log('删除后articleArr',articleArr);
    console.log('删除后result',result);
    console.log('删除后selectOption',selectOption);
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
    console.log('选中行的值为：',selectedData);
    selectOption.push({key:key,option:[{key:selectedData[0].id,value:selectedData[0].title}]});
    this.setState({selectOption}); //2、将数据给select框
    //3、设置数据到result中
    let result=this.state.result;
    result=result.filter((item)=>{  //去重
      return item&&item.key!=key;
    });
    result.push({key:key,id:selectedData[0].id,name:selectedData[0].title});
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
    this.props.setTableData(API_PREFIX + `${url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=title_S_LK=${value}&&${qfilter}`);
}
  render(){
    const {articleArr,showModalKey,showModal,selectOption,result}=this.state;
    console.log('this.props.initialValue',this.props.initialValue);
    const { disabled}=this.props;
    const columns=[
      {
        title:'文章标题',
        dataIndex:'title',
        key:'title',
      },
      {
        title:'创建时间',
        dataIndex:'createdate',
        key:'createdate',
      }
    ];
    const url='services/news/artical/newsList/get';
    const qfilter='Q=onlineState_S_EQ=1&&Q=type_I_NE=6';
    return(
        <div>
          <Button onClick={this.addArticle}  disabled={disabled} >
            添加文章
          </Button>
          {
            articleArr&&articleArr.map((item,index)=>{
              let select=[];//取出对应的option及value
              selectOption.map((s)=>{
                if(s.key==item.key){
                  select=s.option;
                }
              })
              console.log('select',select);
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
                    <Button onClick={this.selectArticle}  disabled={disabled} >选择文章</Button>
                    <Button onClick={(e)=>this.delArticle(e,item.key)} disabled={disabled}>删除</Button>
                    <Modal
                        title='添加'
                        cancelTexnt='添加'
                        okText='确定'
                        maskClosable={false}//点击蒙层是否关闭
                        key={showModalKey}
                        visible={showModal}
                        destroyOnClose={true}
                        onOk={(e)=>this.handleOk(e,item.key)}
                        onCancel={this.handleCancel}
                    >
                      <TableSearch
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