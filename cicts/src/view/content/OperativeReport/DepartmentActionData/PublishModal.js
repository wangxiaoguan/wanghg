import React, { Component } from 'react';
import { Form, Button,Row,Col,DatePicker,Input,Message } from 'antd';
import API_PREFIX from '../../apiprefix';
import { getService, postService } from '../../myFetch';
import moment from 'moment';
const FormItem = Form.Item;

@Form.create()
export default class PublishModal extends  Component {
  constructor(props){
    super(props);
    this.state={
        id: this.props.id,
        initData: [],
        dataArr: [],//点击部门数的数据回显，
        inputOption: [],
        addKey: 0,
        publishDate:'',
        taskParamId:'',//判断是新增还是更新
    };
  }
  componentWillMount(){
   this.getTaskData();
  }

  //点击某个部门获取对应部门的id数据
  getTaskData=()=>{
      this.setState({inputOption:[],dataArr:[]},()=>{
        let {inputOption, dataArr} = this.state;
    getService(API_PREFIX + `services/web/report/business/departmentBehavior/getTaskParamMessageByUserIdOrgId/${this.props.id}`, res => {
        if(res.status == 1) {
        if(res.root&&JSON.stringify(res.root.object)!=='[]'&&res.root.object[0].emailList){//定时任务已设置
            res.root.object[0].emailList&&res.root.object[0].emailList.forEach((item, index) => {
            dataArr.push({key: index});
            inputOption.push({key: index, value: item});
    });
        this.setState({
            dataArr,
            inputOption,
            addKey: res.root.object[0].emailList&&res.root.object[0].emailList.length,
        });
                this.setState({publishDate:res.root.object[0].endDate,taskParamId:res.root.object[0].taskParamId,initData:res.root.object[0].emailList});
            }else{
                this.setState({publishDate:'',taskParamId:''});
            }
        }else{
            Message.error(res.errorMsg);
        }
    });
      });
  }

  //添加用户
  addData=(e)=>{
    if(this.state.dataArr.length > 0){
      if(this.state.dataArr.length > this.state.inputOption.length){
        Message.error('请填选好邮箱，再添加收件人!');
        return false;
      }
    }
    let dataArr=this.state.dataArr;
    let addKey = dataArr.length > 0 ? dataArr[dataArr.length - 1].key + 1 : this.state.addKey + 1;
    dataArr.push({key:addKey});
    this.setState({addKey,dataArr});
 }
  //删除用户
  delData=(e,key)=>{


    let dataArr=this.state.dataArr;
    let inputOption=this.state.inputOption;
    console.log('dataArr',dataArr);
    console.log('删除前inputOption',inputOption);
    dataArr=dataArr.filter((item,index)=>{
      console.log("item",item,key,item.key==key);
      return item.key!=key;
    });
    inputOption=inputOption.filter((item,index)=>{
    //   if(item.key == key) {
    //     this.props.getPublishList(item, 1) // 传递给父组件删除的收件人
    //   }
      return item&&item.key!=key;
    });
    console.log('dataArr',dataArr);
    console.log('删除后inputOption',inputOption);
    this.setState({dataArr,inputOption});
 }
  querySubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        if(!err) {
            if(this.state.inputOption&&this.state.inputOption.length===0){
                Message.error('收件人为必填项');
                return;
            }
            let body={};
            let emailAll=[];
            this.state.inputOption.length!==0&&this.state.inputOption.map(item=>{
                emailAll.push(item.value);
            });
            body.emailList=emailAll;
            body.endDate=moment(values.publishDate).format('YYYY-MM-DD HH:mm:ss');
            body.orgId=this.props.id;
            if(this.state.taskParamId){
                body.taskParamId=this.state.taskParamId;
            }
            postService(API_PREFIX +'services/web/report/business/departmentBehavior/operateTaskParamMessage',body,data=>{
                if(data.status===1){
                    Message.success('保存成功');
                }else{
                    Message.error(data.errorMsg);
                }
            });
            this.props.callBack();
            this.getTaskData();
        }
    });
  }
  emailChange = (e, key) => {
    let inputOption=this.state.inputOption;
    let count=0;
    inputOption.map(y=>{
        if(y.key == key){
            count++;
        }
    });
    if(count) {
        inputOption.map(u=>{
            if(u.key == key){
              u.value = e.target.value;
            }
        });
    }else {
        inputOption.push({key: key, value: e.target.value}); 
    }
    this.setState({inputOption});
    console.log('33333333333333333333',inputOption);
 }
  render(){
    const {dataArr,inputOption,initData}=this.state;
    
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = { labelCol: { span: '6' }, wrapperCol: { span: '18' } };
    return(
        
        <Form className="right" onSubmit={this.querySubmit}>
            <FormItem {...formItemLayout} label='收件人：'>
                {getFieldDecorator('publishEmail', {
                    initialValue:initData.length!==0?initData[0]:'',
                    rules: [
                        {type:'email',message:'您输入的邮箱格式不正确，请输入正确的邮箱'},
                        {required: true, message: '请填写收件人邮箱'},
                    ],
                })(
                    <div>
                    {
                        dataArr&&dataArr.map((item,index)=>{
                        let value='';//取出对应的value
                        inputOption.map((s)=>{
                            if(s.key==item.key){
                            value=s.value;
                            }

                        });
                        return(
                            <div key={item.key}>
                                <Input value={value} placeholder='请输入邮箱地址' style={{width: 300, height: 30, marginRight: 10}} onChange={(e) => this.emailChange(e, item.key)} />
                                <Button style={{height: 30}} onClick={(e)=>this.delData(e,item.key)}>删除</Button>
                            </div>
                        );
                        })
                    }
                    <div> 
                        {dataArr.length<5?<Button style={{height: 30}} onClick={this.addData}>添加收件人</Button>:null}
                    </div>
                    </div>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label='任务停止时间：'>
                {getFieldDecorator('publishDate', {
                    initialValue:this.state.publishDate ? moment(this.state.publishDate, 'YYYY-MM-DD HH:mm:ss') : '',
                    rules: [{required: true, message: '请选择任务停止时间'}],
                })(
                    <DatePicker showTime />
                )}
            </FormItem>
            <FormItem >
                <Row>
                    <Col offset='6' style={{color: 'red'}}>定时任务将于每周一9:00:00将上周的部门报表发送至收件人邮箱</Col>
                </Row>
            </FormItem>
            <Row style={{textAlign: 'center'}}>
                <Button type="primary" htmlType="submit" style={{borderRadius: '15px'}}>保存</Button>
            </Row>
        </Form>
    );
  }
}