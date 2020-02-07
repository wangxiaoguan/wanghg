import React, { Component } from 'react';
import { Form, Button,Row,Col,DatePicker,Input,Message } from 'antd';
// import API_PREFIX from '../../apiprefix';
// import { getService, postService } from '../../myFetch';
// import moment from 'moment';
// const FormItem = Form.Item;

// @Form.create()
export default class PublishModal extends  Component {
  constructor(props){
    super(props);
    this.state={
        initData: [],
        dataArr: [],//点击部门数的数据回显，
        inputOption: [],
        addKey: 0,
        initialValue:this.props.initialValue,
        flowData:this.props.flowData,
    };
  }
  componentWillMount(){
    console.log("1111",this.props);
  //  this.getTaskData();
   let {inputOption, dataArr} = this.state
   if(this.props.edit == 'shopTimeEdit' &&  this.props.initialValue&&this.props.initialValue.pickupAddress) {
     this.props.initialValue.pickupAddress.forEach((item, index) => {
      dataArr.push({id:item.id,addressName:item.addressName});
      inputOption.push({id:item.id,addressName: item.addressName})
     })
    this.props.getPickupAddressList(inputOption)
    this.setState({
      dataArr,
      inputOption
    })
   }
   
   if(this.props.belonged=='order'&&this.props.style=='add'&&this.props.flowData&&this.props.flowData.length>0){
    this.props.flowData.forEach((item, index) => {
      dataArr.push({id:item.id,addressName:item.addressName});
      inputOption.push({id:item.id,addressName: item.addressName})
     })
    this.props.getPickupAddressList(inputOption)
    this.setState({
      dataArr,
      inputOption
    })
   }
  }

  // //点击某个部门获取对应部门的id数据
  // getTaskData=()=>{
  //     this.setState({inputOption:[],dataArr:[]},()=>{
  //       let {inputOption, dataArr} = this.state;
  //   getService(API_PREFIX + `services/web/report/business/departmentBehavior/getTaskParamMessageByUserIdOrgId/${this.props.id}`, res => {
  //       if(res.status == 1) {
  //       if(res.root&&JSON.stringify(res.root.object)!=='[]'&&res.root.object[0].emailList){//定时任务已设置
  //           res.root.object[0].emailList&&res.root.object[0].emailList.forEach((item, index) => {
  //           dataArr.push({key: index});
  //           inputOption.push({key: index, value: item});
  //   });
  //       this.setState({
  //           dataArr,
  //           inputOption,
  //           addKey: res.root.object[0].emailList&&res.root.object[0].emailList.length,
  //       });
  //               this.setState({publishDate:res.root.object[0].endDate,taskParamId:res.root.object[0].taskParamId,initData:res.root.object[0].emailList});
  //           }else{
  //               this.setState({publishDate:'',taskParamId:''});
  //           }
  //       }else{
  //           Message.error(res.errorMsg);
  //       }
  //   });
  //     });
  // }

  //添加用户
  addData=(e)=>{
    if(this.state.dataArr.length > 0){
      if(this.state.dataArr.length > this.state.inputOption.length){
        Message.error('请填写好取货地点,才能再次添加!');
        return false;
      }
    }
    let dataArr=this.state.dataArr;
    // let addKey = dataArr.length > 0 ? dataArr[dataArr.length - 1].id + 1 : this.state.addKey + 1;
    dataArr.push({id:this.createRandomId()});
    this.setState({dataArr});
 }
  //删除用户
  delData=(e,key)=>{
    let dataArr=this.state.dataArr;
    let inputOption=this.state.inputOption;
    dataArr=dataArr.filter((item,index)=>{
      return item.id!=key;
    });
    inputOption=inputOption.filter((item,index)=>{
      // if (item.id == key) {
      //   this.props.getMerchantList(item, 1) // 传递给父组件删除的商家
      // }
      return item&&item.id!=key;
    });
    this.props.getPickupAddressList(inputOption)
    console.log('dataArr',dataArr);
    console.log('删除后inputOption',inputOption);
    this.setState({dataArr,inputOption});
 }
//自动生成id
    createRandomId=()=> {
     return (Math.random()*10000000).toString(16).substr(0,4)+Math.random().toString().substr(2,5);
    }

  emailChange = (e, key) => {
   if(e.target.value.length>40){
     Message.error("不能超出40个字符");
     e.target.value=e.target.value.substring(0,39)
     return false;
   }

    let inputOption=this.state.inputOption;
    let count=0;
    inputOption.map(y=>{
        if(y.id == key){
            count++;
        }
    });
    if(count) {
        inputOption.map(u=>{
            if(u.id == key){
              u.addressName = e.target.value;
            }
        });
    }else {
        inputOption.push({id: key, addressName: e.target.value}); 
    }
    this.props.getPickupAddressList(inputOption)
    this.setState({inputOption});
    console.log('33333333333333333333',inputOption);
 }
  render(){
    let {dataArr,inputOption,initData}=this.state;
    console.log(dataArr,inputOption)
    return(
     <div>
        {dataArr&&dataArr.map((item,index)=>{
          let addressName="";
           inputOption&&inputOption.map((list,_index)=>{
             if(list.id==item.id){
               addressName=list.addressName;
             }         
           })
          return  (<div key={item.id}>
           <Input value={addressName}  disabled={this.props.disabled?true:false} placeholder='请输入取货地点' style={{width: 300, height: 30, marginRight: 10}} onChange={(e) => this.emailChange(e, item.id)} />
           {!this.props.disabled? <Button style={{height: 30}} onClick={(e)=>this.delData(e,item.id)}>删除</Button>:null}
          </div>)          
        })}
        {!this.props.disabled? <div> 
            {dataArr.length<5?<Button style={{height: 30}} onClick={this.addData} >添加地点</Button>:null}
        </div>:null}   
       </div>           
    );
  }
}