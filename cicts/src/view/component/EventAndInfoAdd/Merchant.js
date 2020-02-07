import React, { Component } from 'react';
import { Form, Button,Row,Col,Select,Modal ,Input,Message,InputNumber } from 'antd';
// import TableSearch from '../table/TableSearch';
import FormAndInput from '../table/FormAndInput'; // yelu 2019-01-18
import { connect } from 'react-redux';
import { BEGIN, getPageData } from '../../../redux-root/action/table/table';
import API_PREFIX from '../../content/apiprefix';
import {setMerchantData,setMerchantAdd} from '../../../redux-root/action/attach/attach';
import './addStyle.less';
const Option = Select.Option;
@connect(state => ({
      pageData: state.table.pageData,              //封装表格分页查询条件数据
      selectRowsData: state.table.selectRowsData,  //封装表格选择数据
      getMerchantData:state.attach.MerchantData,//获取添加用户的数据
    }),
    dispatch => ({
      setTableData: n => dispatch(BEGIN(n)),
      setMerchantData:n=>dispatch(setMerchantData(n)),
      setMerchantAdd:n=>dispatch(setMerchantAdd(n)),
      getPageData:n=>dispatch(getPageData(n)), // yelu 2019-01-18 每次查询时初始缓冲里面的页码为默认值
    }))
export default class Merchant extends  Component {
  constructor(props){
    super(props);
    console.log('props==>',props)
    this.state={
      MerchantArr:[],//添加文章的arr
      showModal:false,//是否展示modal
      showModalKey:0,//展示modal的key值
      //下拉框的Option  （用户展示文章title，id返回给后端）
      selectOption:[],
      addId:0, //添加文章时的id
      result:[],//添加完成后的数据  {key:addId,id:selectedId}
      all:[],//全部的附件信息，用于判断附件是否已经是5个
      initialValue:this.props.initialValue,
      flowData:this.props.flowData,
      qfilter: '', // yelu 2019-01-18 添加作者查询条件字段 
    }
  }
  componentDidMount(){
    console.log('XXXXXXXXXXXXXXXX===>>', this.props)
    let {selectOption, MerchantArr} = this.state
    // if(this.props.initialValue.merchants) {
    //   this.props.initialValue.merchants.forEach((v, i) => {
    //     MerchantArr.push({key:i});
    //     selectOption.push({key: i, option: [{key:v.id,value:v.name}]})
    //   })
    // }
    if(this.props.edit == 'shopTimeEdit' && this.props.initialValue.merchants) {
      this.props.initialValue.merchants.forEach((v, i) => {
        MerchantArr.push({key:i});
        selectOption.push({key: i, option: [{key:v.id,value:v.name}]})
      })
    }
    this.setState({
      MerchantArr,
      selectOption
    })
    console.log(MerchantArr, selectOption)
  }
  componentDidUpdate(){
    // console.log('=====================>>>>>>', this.props.defaultMerchant)
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
    if(this.props.defaultMerchant) {
      this.setState({})
    }
  }
  dealData=(data)=>{
        console.log('initialValuea',data);
        let MerchantArr=this.state.MerchantArr;
        let result=this.state.result;
        let selectOption=this.state.selectOption;
        if(data&&data.length>0){//有数据 即为 上一步
          data.map((item,index)=>{
            MerchantArr.push({key:index});
              result.push({key:index,id:item.id,name:item.name});
              selectOption.push({key:index,option:[{key:item.id,value:item.name}]});
          });
          this.setState({MerchantArr,result,addId:(data.length)-1},()=>{
            this.props.setMerchantData(result);
            this.props.setMerchantAdd(MerchantArr); //向缓存中放数据
          });
        }
  }
  //添加用户
  addMerchant=(e)=>{
    if(this.state.MerchantArr.length > 0){
      if(this.state.MerchantArr.length > this.state.selectOption.length){
        Message.error('请填选好商家，再添加商家!')
        return false;
      }
    }
    let MerchantArr=this.state.MerchantArr;
    let addId = MerchantArr.length > 0 ? MerchantArr[MerchantArr.length - 1].key + 1 : this.state.addId + 1
    MerchantArr.push({key:addId});
    this.setState({addId,MerchantArr});
    this.props.setMerchantAdd(MerchantArr);
    sessionStorage.setItem('MerchantCount', MerchantArr.length)
  }
  //选择用户
  selectArticle=(e)=>{
    this.setState({showModal:true,showModalKey:this.state.showModalKey+1,keyID:e});
  }
  //删除用户
  delMerchant=(e,key)=>{

    let MerchantArr=this.state.MerchantArr;
    sessionStorage.setItem('MerchantCount', MerchantArr.length - 1)
    let result=this.state.result;
    let selectOption=this.state.selectOption;
    console.log('MerchantArr',MerchantArr);
    console.log('删除前result',result);
    console.log('删除前selectOption',selectOption);
    MerchantArr=MerchantArr.filter((item,index)=>{
      console.log("item",item,key,item.key==key);
      return item.key!=key;
    });
    result=result.filter((item,index)=>{
      return item&&item.key!=key;
    });
    selectOption=selectOption.filter((item,index)=>{
      if(item.key == key) {
        this.props.getMerchantList(item, 1) // 传递给父组件删除的商家
      }
      return item&&item.key!=key;
    });
    console.log('MerchantArr',MerchantArr);
    console.log('删除后result',result);
    console.log('删除后selectOption',selectOption);
    this.setState({MerchantArr,result,selectOption},()=>{
      //往缓存中放数据
      this.props.setMerchantData(result);
      this.props.setMerchantAdd(MerchantArr);
    });
  }
  //ok弹窗  1、关闭弹窗2、将数据给select框3、设置数据到result中
  handleOk=(e,key)=>{
    this.setState({showModal:false});  //1、关闭弹窗
    let selectedData=this.props.selectRowsData;
    let selectOption=this.state.selectOption;
    let MerchantArr = this.state.MerchantArr;
    let keyID = this.state.keyID;
    // this.props.getMerchantList(selectedData, 2, MerchantArr) //传递给父组件添加的商家
    let code = selectedData[0].id
    let count = 0
    selectOption.forEach(item => { //控制不让选择重复的商家
      if(item.option[0].key == code) {
        count++
      }
    })


    let yCount=0
    if(!count) {
      selectOption.map(y=>{
        if(y.key==keyID){
          yCount++
        }
      })

      if(yCount>0){
        selectOption.map(u=>{
          if(u.key==keyID){
            u.option=[{key:selectedData[0].id,value:selectedData[0].lastname}]
          }
        })
      }else{
        selectOption.push({key:keyID,option:[{key:selectedData[0].id,value:selectedData[0].lastname}]});
      }
    }else {
      Message.error('请不要选择相同的商家')
      
    }

    this.props.getMerchantList(selectedData, 2, selectOption,MerchantArr) //传递给父组件添加的商家
    this.setState({selectOption}); //2、将数据给select框
    //3、设置数据到result中
    let result=this.state.result;
    result=result.filter((item)=>{  //去重
      return item&&item.key!=keyID;
    });
    result.push({key:keyID,id:selectedData[0].id,name:selectedData[0].lastname});

    var allArr = [];
    for(var i=0;i<result.length;i++){
    　　var flag = true;
    　　for(var j=0;j<allArr.length;j++){
    　　　　if(result[i].id == allArr[j].id){
    　　　　　　flag = false;
    　　　　};
    　　}; 
    　　if(flag){
          allArr.push(result[i]);
    　　};
    };

    result=allArr;
    this.setState({result});
    //往缓存中放数据
    this.props.setMerchantData(result);
  }
  //cancle弹窗   关闭弹窗
  handleCancel=()=>{
    this.setState({showModal:false});
  }
  //  search框，点击回车后条件查询
  handleSearch=(e)=>{
    let qfilter = e.target.value == '' ? '' : `Q=lastname_S_LK=${e.target.value}` // yelu 2019-01-18 修改选择人员查询后分页后不带查询条件
    this.setState({qfilter,})
    // yelu 2019-01-18 每次查询的时候要重置页码为1
    this.props.getPageData({currentPage: 1, pageSize: 10, query: qfilter}); // 每次查询时初始缓冲里面的页码为默认值
    this.props.setTableData(API_PREFIX + `services/activity/orderActivity/seller/1/10?${qfilter}`);
    // this.props.setTableData(API_PREFIX + `${url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${qfilter}=${value}`);
}
  render(){
    const {MerchantArr,showModalKey,showModal,selectOption,result}=this.state;
    const { disabled}=this.props;
    const columns = [
        {
          title: 'ID',
          key: 'id',
          dataIndex: 'id',
      },{
          title: '姓名',
          key: 'lastname',
          dataIndex: 'lastname',
      },{
          title: '手机号',
          key: 'acount',
          dataIndex: 'acount',
      },{
          title: '部门',
          key: 'orginfoName',
          dataIndex: 'orginfoName',
      }]

    const url='services/activity/orderActivity/seller';
    // const qfilter='Q=lastname_S_LK';
    return(
        <div>
          {
            MerchantArr&&MerchantArr.map((item,index)=>{
              let select=[];//取出对应的option及value
              selectOption.map((s)=>{
                if(s.key==item.key){
                  select=s.option;
                }
              })
              console.log('select',select);
              return(
                  <div key={item.key}>
                     <Select id='merchantOpt' style={{width: 200}} value={select.length>0?select[0].key:''}>
                       {
                         select&&select.map((_=>{
                           return (<Option key={_.key} value={_.key}>
                             {_.value}</Option>)
                         }))
                       }
                     </Select>
                    <Button onClick={()=>this.selectArticle(item.key)} id={item.key} disabled={disabled} style={{marginLeft: '5px'}}>选择用户</Button>
                    <Button onClick={(e)=>this.delMerchant(e,item.key)} disabled={disabled}>删除</Button>
                    <Modal
                        title='选择用户'
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
                          qfilter={''}
                          onSearch={(value)=>this.handleSearch(value,url,qfilter)}
                      /> */}
                      <FormAndInput
                          columns={columns}
                          url={url}
                          qfilter={this.state.qfilter}
                          onSearch={this.handleSearch}
                      />
                    </Modal>
                  </div>
              )
            })
          }
          {MerchantArr.length<5?<Button onClick={this.addMerchant}  disabled={disabled} >
            添加商家
          </Button>:null}
          
        </div>
    );
  }
}