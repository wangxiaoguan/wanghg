import React, { Component } from 'react';
import {Form,message,Button,DatePicker,Row,Col} from 'antd';
import API_PREFIX from '../../apiprefix';
import{exportExcelService1} from '../../myFetch'
import moment from 'moment';
import { connect } from 'react-redux';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

//导出权限配置
@connect(
    state => ({
      powers: state.powers
    })
  )

@Form.create()
class ReconciliationExport extends Component{
    constructor(props){
        super(props);
        this.state={
            RechargeExcel: false,//充值导出按钮可点击
            consumptionExcel:false,//消费记录按钮可点
            ReturnGoodsExcel:false,//退货记录按钮可点
        }
    }

    //充值记录导出
    Recharge=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,fieldsValue)=>{
            if(!err){
                if((fieldsValue.getDate)!=''||(fieldsValue.getDate).length!=0){
                    this.setState({RechargeExcel: true})//点击后置灰   
                    let startTime = fieldsValue.getDate[0].format('YYYY-MM-DD 00:00:00')
                    let endTime = fieldsValue.getDate[1].format('YYYY-MM-DD 23:59:59')
                    let path=''
                    path=`${API_PREFIX}services/awardpoint/reconciliationExport/rechargeLog?Q=starttime_S_EQ =${startTime}&Q=endtime_S_EQ=${endTime}`
                        exportExcelService1(path, `${startTime}至${endTime}充值记录`).then(data=>{
                        this.setState({RechargeExcel:data})
                      }) 
                }else{
                    message.error("请选择起止日期")
                    this.setState({RechargeExcel: false})//点击后恢复正常
                }
            }
        })
    }

    //消费记录导出
    consumption=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,fieldsValue)=>{
            if(!err){
                 if((fieldsValue.getDate)!=''||(fieldsValue.getDate).length!=0){
                    this.setState({consumptionExcel: true})//点击后置灰   
                    let startTime = fieldsValue.getDate[0].format('YYYY-MM-DD 00:00:00')
                    let endTime = fieldsValue.getDate[1].format('YYYY-MM-DD 23:59:59')
                     let path=''
                    path=`${API_PREFIX}services/awardpoint/reconciliationExport/tradeLog?Q=starttime_S_EQ =${startTime}&Q=endtime_S_EQ=${endTime}`
                        exportExcelService1(path, `${startTime}至${endTime}消费记录`).then(data=>{
                        this.setState({consumptionExcel:data})
                      })
                 }else{
                    message.error("请选择起止日期")
                    this.setState({consumptionExcel: false})//点击后恢复正常
                }
        
            }
        })
    }

    //退货记录导出
    ReturnGoods=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,fieldsValue)=>{
            if(!err){
                 if((fieldsValue.getDate)!=''||(fieldsValue.getDate).length!=0){
                    this.setState({ReturnGoodsExcel: true})//点击后置灰   
                    let startTime = fieldsValue.getDate[0].format('YYYY-MM-DD 00:00:00')
                    let endTime = fieldsValue.getDate[1].format('YYYY-MM-DD 23:59:59')
                     let path=''
                    path=`${API_PREFIX}services/awardpoint/reconciliationExport/refundLog?Q=starttime_S_EQ =${startTime}&Q=endtime_S_EQ=${endTime}`
                        exportExcelService1(path, `${startTime}至${endTime}退货记录`).then(data=>{
                        this.setState({ReturnGoodsExcel:data})
                      })
                 }else{
                    message.error("请选择起止日期")
                    this.setState({ReturnGoodsExcel: false})//点击后恢复正常
                }
       
            }
        })
    }

    //重置按钮
    resetBtn=()=>{
    this.props.form.resetFields();
    }
    render(){
        const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
        const { getFieldDecorator } = this.props.form;
        let powers = this.props.powers;
        let rechargePower=powers&&powers['20011.21610.202']
        let consumptionPower=powers&&powers['20011.21610.202']
        let returnGoodsPower=powers&&powers['20011.21610.202']
        return(
            <div className="ReconciliationExport">
            <Form layout="inline">
                <FormItem label="起止日期" {...formItemLayout} style={{marginTop:'24px'}} >
                  {getFieldDecorator('getDate', {
                    initialValue: ''
                  })(
                    <RangePicker format={'YYYY-MM-DD'} allowClear={true} />
                  )}
                </FormItem>
                <FormItem style={{marginTop:'24px'}} >
                    <Button className="resetBtn" style={{height:'32px',width:'74px'}} onClick={this.resetBtn}>重置</Button>
                </FormItem>
                    <Row style={{marginTop:'30px',marginLeft:'30px'}}>
                        {rechargePower?(
                            <Button className="queryBtn" style={{height:'32px',width:'117px'}}  type="primary" onClick={this.Recharge} disabled={this.state.RechargeExcel}>充值记录导出</Button>):null
                            }
                        {consumptionPower?(
                            <Button className="queryBtn" style={{height:'32px',width:'116px'}}  type="primary" onClick={this.consumption} disabled={this.state.consumptionExcel}>消费记录导出</Button>):null

                        }
                        {returnGoodsPower?(
                            <Button className="queryBtn" style={{height:'32px',width:'116px'}}  type="primary" onClick={this.ReturnGoods} disabled={this.state.ReturnGoodsExcel}>退货记录导出</Button>):null

                        }     
                    </Row>  
            </Form>
            </div>
        )
    }
}
export default ReconciliationExport;