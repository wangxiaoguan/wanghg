import React, { Component } from 'react';
import { Form, Button,Row,Col,Select,Modal ,Input,Message,InputNumber } from 'antd';
import TableSearch from '../../../../component/table/TableSearch';
import { connect } from 'react-redux';
import { BEGIN,setActivityData,setActivityAdd } from '../../../../../redux-root/action';
import ServiceApi from '../../../../content/apiprefix';
import './attach.less';
const Option = Select.Option;
@connect(state => ({
      pageData: state.pageData,              //封装表格分页查询条件数据
      selectRowsData: state.selectRowsData,  //封装表格选择数据
      getArticleAdd:state.articleAdd,
      getFileAdd:state.fileAdd,
    }),
    dispatch => ({
      setTableData: n =>dispatch(BEGIN(n)),
      setActivityData:n=>dispatch(setActivityData(n)),
      setActivityAdd:n=>dispatch(setActivityAdd(n)),
    }))
export default class ActivityAttach extends  Component {
  constructor(props){
    super(props);
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
      flowData:this.props.flowData,
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
      this.setState({flowData: this.props.flowData}, () => {
        //总的数据，返回上一步，父组件传入的 initialValue
        let flowData = this.state.flowData;
        //页面相关的数据处理
        this.dealData(flowData);
      });
    }

  }
  dealData=(data)=>{
        console.log('initialValuett',data);
        let activityArr=this.state.activityArr;
        let result=this.state.result;
        let selectOption=this.state.selectOption;
        if(data&&data.length>0){//有数据 即为 上一步
          data.map((item,index)=>{
            this.setState({addId:index},()=>{
              activityArr.push({key:this.state.addId});
              result.push({key:this.state.addId,id:item.id,name:item.name});
              selectOption.push({key:this.state.addId,option:[{key:item.id,value:item.name}]});
            });
          });
          this.setState({activityArr,result});
          this.props.setActivityData(result);
          this.props.setActivityAdd(activityArr); //向缓存中放数据
        }

  }
  //添加活动
  addArticle=(e)=>{
      let activityArr=this.state.activityArr;
      let addId=this.state.addId+1;
      activityArr.push({key:addId});
     let all=[...this.props.getArticleAdd,...activityArr,...this.props.getFileAdd];
     if(all.length>5){
       Message.error('任务附件不能大于5个');
       return;
     }
     this.setState({addId,activityArr});
      this.props.setActivityAdd(activityArr);

  }
  //选择资讯
  selectActivity=(e)=>{
    this.setState({showModal:true,showModalKey:this.state.showModalKey+1});
  }
  //删除活动
  delActivity=(e,key)=>{

    let activityArr=this.state.activityArr;
    let result=this.state.result;
    let selectOption=this.state.selectOption;
    console.log('删除前activityArr',activityArr);
    console.log('删除前result',result);
    console.log('删除前selectOption',selectOption);
     activityArr=activityArr.filter((item,index)=>{
      console.log("item",item,key,item.key==key);
      return item.key!=key;
    });
    result=result.filter((item,index)=>{
      return item&&item.key!=key;
    });
    selectOption=selectOption.filter((item,index)=>{
      return item&&item.key!=key;
    });
    console.log('删除后activityArr',activityArr);
    console.log('删除后result',result);
    console.log('删除后selectOption',selectOption);
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
    console.log('选中行的值为：',selectedData);
    selectOption.push({key:key,option:[{key:selectedData[0].id,value:selectedData[0].name}]});
    this.setState({selectOption}); //2、将数据给select框
    //3、设置数据到result中
    let result=this.state.result;
    result=result.filter((item,index)=>{  //去重（选择多次）
      return item&&item.key!=key;
    });
    result.push({key:key,id:selectedData[0].id,name:selectedData[0].name});
    this.setState({result});
    //往缓存中放数据
    this.props.setActivityData(result);

  }
  //cancle弹窗   关闭弹窗
  handleCancel=()=>{
    this.setState({showModal:false});
  }
  //  search框，点击回车后条件查询
  handleSearch=(value,url,qfilter)=>{
    this.props.setTableData(ServiceApi + `${url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=name_S_LK=${value}&&${qfilter}`);
}
  render(){
    const {activityArr,showModalKey,showModal,selectOption,result}=this.state;
    let initialValue=this.props.initialValue;
    console.log('initialValue2',initialValue);
    const {disabled}=this.props;
    const columns=[
      {
        title:'活动标题',
        dataIndex:'name',
        key:'name',
      },
      {
        title:'创建时间',
        dataIndex:'createDate',
        key:'createDate',
      }
    ];
    const url='services/activity/activity/list';
    const qfilter='Q=status_I_EQ=1';
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
              console.log('select',select);
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