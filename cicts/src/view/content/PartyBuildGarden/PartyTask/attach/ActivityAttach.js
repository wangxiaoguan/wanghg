import React, { Component } from 'react';
import { Form, Button,Row,Col,Select,Modal ,Input,message,InputNumber } from 'antd';
// import TableSearch from '../../../../component/table/TableSearch';
import FormAndInput from '../../../../component/table/FormAndInput';
import { connect } from 'react-redux';
import { BEGIN,getPageData } from '../../../../../redux-root/action/table/table';// yelu 2019-01-16 取出缓存里面设置分页数据函数getPageData
import API_PREFIX from '../../../../content/apiprefix';
import {setActivityData,setActivityAdd} from '../../../../../redux-root/action/attach/attach';
import './attach.less';
const Option = Select.Option;
@connect(state => ({
      pageData: state.table.pageData,              //封装表格分页查询条件数据
      selectRowsData: state.table.selectRowsData,  //封装表格选择数据
      getArticleAdd:state.attach.articleAdd,
      getFileAdd:state.attach.fileAdd,
      getFormData: state.attach.getFormData,
    }),
    dispatch => ({
      setTableData: n =>dispatch(BEGIN(n)),
      setActivityData:n=>dispatch(setActivityData(n)),
      setActivityAdd:n=>dispatch(setActivityAdd(n)),
      getPageData:n=>dispatch(getPageData(n)), // yelu 2019-01-16 每次查询时初始缓冲里面的页码为默认值
    }))
export default class ActivityAttach extends  Component {
  constructor(props){
    super(props);
    let tenantId = sessionStorage.getItem('tenantId')
    this.state={
      activityArr:[],//添加活动的arr
      showModal:false,//是否展示modal
      showModalKey:0,//展示modal的key值
      //下拉框的Option  （用户展示活动title，id返回给后端）
      selectOption:[],
      addId:0, //添加活动时的id
      result:[],//添加完成后的数据  {key:addId,id:selectedId}
      all:[],//全部的附件信息，用于判断附件是否已经是5个
      initialValue:this.props.initialValue,//编辑时传入的数据
      flowData:[],
      // qfilter: `Q=status=1&Q=tenantId=${tenantId}`, // yelu 2019-01-16 添加作者查询条件字段 
      qfilter: ``, // yelu 2019-01-16 添加作者查询条件字段 
    }
  }
  componentDidMount(){
    // if(this.props.flowData){//不为空
    //   this.dealData(this.props.flowData);
    // }
  }
  componentDidUpdate(){
    if (this.props.initialValue&&this.props.initialValue !== this.state.initialValue) {
      this.setState({initialValue: this.props.initialValue}, () => {
        //总的数据，返回上一步，父组件传入的 initialValue
        let initialValue = this.state.initialValue;
        //页面相关的数据处理
        this.dealData(initialValue);
      });
    }
    if (this.props.flowData&&this.props.flowData !== this.state.flowData) {
      console.log('11111111111111111我们都是一家人！！！！！！！！！！！！！！！！', this.props.flowData)
      this.setState({flowData: this.props.flowData}, () => {
        //总的数据，返回上一步，父组件传入的 initialValue
        let flowData = this.state.flowData;
        //页面相关的数据处理
        this.dealData(flowData);
      });
    }

  }
  dealData=(data)=>{
        let activityArr=this.state.activityArr;
        let result=this.state.result;
        let selectOption=this.state.selectOption;
        if(data&&data.length>0){//有数据 即为 上一步
          data.map((item,index)=>{
            if(item.attachType == 2) {
              activityArr.push({key:index});
              result.push({key:index,id:item.attachUrl,name:item.fileName,content: item.content});
              selectOption.push({key:index,option:[{key:item.attachUrl,value:item.fileName}]});
            }
          });
          this.setState({activityArr,result});
          this.props.setActivityData(result);
          this.props.setActivityAdd(activityArr); //向缓存中放数据
        }

  }
  //添加活动
  addArticle=(e)=>{
    if(this.state.activityArr.length>0){//任务附件=》添加附件，修复添加多个活动，选择活动，选好活动以后数据始终回填在最后一个活动的问题xwx2019/2/27
      if(this.state.activityArr.length>this.state.selectOption.length){
        message.error('请先选好活动，再添加活动!')
        return false
      }
    }
      let activityArr=this.state.activityArr;
      let addId=this.state.addId+1;
      if(activityArr.length>4){
        message.error('任务附件不能大于5个');
        return;
      }else{
        activityArr.push({key:addId});
      }
     let all=[...this.props.getArticleAdd,...activityArr,...this.props.getFileAdd];
    //  if(all.length>5){
    //    message.error('任务附件不能大于5个');
    //    return;
    //  }
     this.setState({addId,activityArr});
      this.props.setActivityAdd(activityArr);

  }
  //选择资讯
  selectActivity=(e)=>{
    localStorage.setItem("selectedRowKeys", '');
    this.setState({showModal:true,showModalKey:this.state.showModalKey+1});
  }
  //删除活动
  delActivity=(e,key)=>{

    let activityArr=this.state.activityArr;
    let result=this.state.result;
    let selectOption=this.state.selectOption;
     activityArr=activityArr.filter((item,index)=>{
      return item.key!=key;
    });
    result=result.filter((item,index)=>{
      return item&&item.key!=key;
    });
    selectOption=selectOption.filter((item,index)=>{
      return item&&item.key!=key;
    });
    this.setState({activityArr,result,selectOption},()=>{
      //往缓存中放数据
      this.props.setActivityData(result);
      this.props.setActivityAdd(activityArr);
    });
  }
  //ok弹窗  1、关闭弹窗2、将数据给select框3、设置数据到result中
  handleOk=(e,key)=>{
    this.setState({showModal:false});  //1、关闭弹窗
    let selectedData=this.props.selectRowsData;
    let selectOption=this.state.selectOption;
    selectOption.push({key:key,option:[{key:selectedData[0].id,value:selectedData[0].activityName}]});
    this.setState({selectOption}); //2、将数据给select框
    //3、设置数据到result中
    let result=this.state.result;
    result=result.filter((item,index)=>{  //去重（选择多次）
      return item&&item.key!=key;
    });
    let content = {
      objectId: selectedData[0].id,
      objectType: 2,
      type: selectedData[0].typeId,
      title: selectedData[0].activityName,
      isAtlas: false,
      titleImage:  selectedData[0].titleImage ? selectedData[0].titleImage.split(',') : []
    }
    result.push({key:key,id:selectedData[0].id,name:selectedData[0].activityName,content: JSON.stringify(content)});
    this.setState({result});
    //往缓存中放数据
    this.props.setActivityData(result);
  }
  //cancle弹窗   关闭弹窗
  handleCancel=()=>{
    this.setState({showModal:false});
  }
  //  search框，点击回车后条件查询
  handleSearch = (value, url, qfilter) => {
    value = value.target.value
    // let qf = value == '' ? `${qfilter}` : qfilter ? `Q=searchText=${value}&${qfilter}` : `Q=searchText=${value}` // yelu 2019-01-16 修改选择人员查询后分页后不带查询条件
    let qf = value == '' ? '' : `Q=searchText=${value}` // yelu 2019-01-16 修改选择人员查询后分页后不带查询条件
    this.setState({qfilter: qf})
    // yelu 2019-01-16 每次查询的时候要重置页码为1
    this.props.getPageData({currentPage: 1, pageSize: 10, query: qf}); // 每次查询时初始缓冲里面的页码为默认值
    this.props.setTableData(API_PREFIX + `${url}/1/10?${qf}`);
    // this.props.setTableData(API_PREFIX + `${url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=name_S_LK=${value}&&${qfilter}`);
}
  render(){
    const {activityArr,showModalKey,showModal,selectOption,result}=this.state;
    let initialValue=this.props.initialValue;
    const {disabled}=this.props;
    const columns=[
      {
        title:'活动标题',
        dataIndex:'activityName',
        key:'activityName',
      },
      {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate',
      }
    ];
    const url=`services/web/party/task/getTaskAttachActivity/${this.props.getFormData.userId}/2`;
    return(
        <div>
          <Button onClick={this.addArticle} disabled={disabled} >
            添加活动
          </Button>
          {
            activityArr&&activityArr.map((item,index)=>{
              let select=[];//取出对应的option及value
              selectOption.map((s)=>{
                if(s.key==item.key){
                  select=s.option;
                }
              })
              return(
                  <div key={item.key} className={'attach-main'}>
                     <Select  value={select.length>0?select[0].key:''}>
                       {
                         select&&select.map((_=>{
                           return (<Option key={_.key} value={_.key}>
                             {_.value}</Option>)
                         }))
                       }
                     </Select>
                    <Button onClick={this.selectActivity} disabled={disabled}>选择活动</Button>
                    <Button onClick={(e)=>this.delActivity(e,item.key)} disabled={disabled}>删除</Button>
                    <Modal
                        title='添加活动'
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
                          qfilter={this.state.qfilter}
                          onSearch={(value)=>this.handleSearch(value,url,this.state.qfilter)}
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