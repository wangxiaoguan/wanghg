//信息报送
import React,{Component} from "react";
import {connect} from 'react-redux'
import { 
    Icon,Button,Menu,DatePicker,
    Tooltip,Radio,Divider,message,
    TimePicker,LocaleProvider,Calendar,
    ConfigProvider,Row,Col,Modal,
    Table,Select,Input, Form, 
    InputNumber,Spin  } from 'antd';
const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
import $ from 'jquery'
import moment from 'moment';
import './index.less';
import {getService,postService} from '../../common/fetch'
const empty = require('../../../assets/images/empty.png')
@connect(
    state => ({
        state: state,
    }),
    dispatch => ({
        
    })
)
@Form.create()
export default class AddInformationSubmit extends Component{
    constructor(props){
        super(props);
        this.state={
            list1:[],
            list2:[],
            list3:[],
            list4:[],
            list5:[],
            list6:[],
            tableList3:[],
            tableList4:[],
            tableList5:[],
            tableList6:[],
            detail1:{},
            detail2:{},
            spin:false,
            allData:{},
            data1Visible:false,
        }
    }

    componentDidMount(){
        window.addEventListener('scroll', this.handleScroll);
        this.getDetail()
        
    }
    handleScroll = e => {
        let top = $(window).scrollTop(); 
        if(top>208){
            $('#header').addClass('header-fixed')
            $('#empty').addClass('empty')
        }else{
            $('#header').removeClass('header-fixed')
            $('#empty').removeClass('empty')
        }
    }
    getDetail = () => {
        let {match} = this.props;
        this.setState({spin:true})
        getService(`/workReport/infoSubmit/getDetail?id=${match.params.id}`,res=>{
            if(res.flag){
                let data = res.data;
                let list1 = [],list2 = [],tableList3 = [],tableList4 = [],tableList5 = [],tableList6 = [];
                data.smApplicationInfoList.map((item,index)=>{
                    list1.push({
                        orderNum:index+1,
                        systemName:item.systemName,
                        isSm:item.isSm,
                        startTime:item.startTime,
                        finishTime:item.finishTime,
                    })
                })
                data.fsmApplicationInfoList.map((item,index)=>{
                    list2.push({
                        orderNum:index+1,
                        systemName:item.systemName,
                        isSm:item.isSm,
                        startTime:item.startTime,
                        finishTime:item.finishTime,
                    })
                })
                data.smDeviceInfoNoInList.map((e,index)=>{//涉密设备非类别
                    let object = {productId:e.deviceType,productName:e.deviceName,list:[]}
                    let list = [];
                    e.childDevices.map(item=>{
                        list.push({
                            companyName:item.manufacturerName,
                            companyId:item.manufacturer,

                            cpuName:item.cpuName,
                            cpuId:item.cpu,

                            systemName:item.osName,
                            systemId:item.os,

                            model:item.model,
                            num:String(item.num),
                            remark:item.remark,
                        })
                    })
                    object.list = list;
                    tableList3.push(object)

                })

                data.smDeviceInfoInList.map((e,index)=>{//涉密设备类别
                    let object = {productId:e.deviceType,productName:e.deviceName,list:[]}
                    let list = [];
                    e.childDevices.map(item=>{
                        list.push({
                            typeId:item.deviceDetailType,
                            typeName:item.deviceDetailTypeName,
                            model:item.model,
                            num:String(item.num),
                            remark:item.remark,
                        })
                    })
                    object.list = list;
                    tableList4.push(object)
                })

                data.fsmDeviceInfoNoInList.map((e,index)=>{//非涉密设备非类别
                    let object = {productId:e.deviceType,productName:e.deviceName,list:[]}
                    let list = [];
                    e.childDevices.map(item=>{
                        list.push({
                            companyName:item.manufacturerName,
                            companyId:item.manufacturer,

                            cpuName:item.cpuName,
                            cpuId:item.cpu,

                            systemName:item.osName,
                            systemId:item.os,

                            model:item.model,
                            num:String(item.num),
                            remark:item.remark,
                        })
                    })
                    object.list = list;
                    tableList5.push(object)
                })

                data.fsmDeviceInfoInList.map((e,index)=>{//非涉密设备类别
                    let object = {productId:e.deviceType,productName:e.deviceName,list:[]}
                    let list = [];
                    e.childDevices.map(item=>{
                        list.push({
                            typeId:item.deviceDetailType,
                            typeName:item.deviceDetailTypeName,
                            model:item.model,
                            num:String(item.num),
                            remark:item.remark,
                        })
                    })
                    object.list = list;
                    tableList6.push(object)
                })

                this.setState({spin:false,list1,list2,tableList3,tableList4,tableList5,tableList6,allData:{...data,month:new Date().getMonth()+1}
                })
                
            }
        })
    }

    editData1 = (data) => {
        this.setState({detail1:data,data1Visible:true})
    }
    closeData1Modal = () => {
        this.setState({data1Visible:false})
    }
    getList1 = (data) => {
        let {list1,list2} = this.state;
        let list = []
        if(data.isSm){
            list1.map(item=>{
                if(item.orderNum === data.orderNum){
                    list.push({...data,isEdit:true})
                }else{
                    list.push(item)
                }
            })
            this.setState({list1:list})
        }else{
            list2.map(item=>{
                if(item.orderNum === data.orderNum){
                    list.push({...data,isEdit:true})
                }else{
                    list.push(item)
                }
            })
            this.setState({list2:list})
        }
    }

    handleSubmit = () => { 
        let {allData,list1,list2} = this.state;
        this.props.form.validateFields((error, values) => {
            if(!error){
                let applicationInfoList = [...list1,...list2];
                let body = {
                    id:allData.id,
                    govOrderTime:values.govOrderTime?moment(values.govOrderTime).format('YYYY-MM-DD'):'',
                    systemAdapteTime:values.systemAdapteTime?moment(values.systemAdapteTime).format('YYYY-MM-DD'):'',
                    systemTestTime:values.systemTestTime?moment(values.systemTestTime).format('YYYY-MM-DD'):'',
                    systemTestRunTime:values.systemTestRunTime?moment(values.systemTestRunTime).format('YYYY-MM-DD'):'',

                    assessmentTime:values.assessmentTime?moment(values.assessmentTime).format('YYYY-MM-DD'):'',
                    systemOnlineTime:values.systemOnlineTime?moment(values.systemOnlineTime).format('YYYY-MM-DD'):'',
                    projectFinishTime:values.projectFinishTime?moment(values.projectFinishTime).format('YYYY-MM-DD'):'',
                    financialAccountsTime:values.financialAccountsTime?moment(values.financialAccountsTime).format('YYYY-MM-DD'):'',

                    adjustInfo:values.adjustInfo,
                    applicationInfoList:applicationInfoList,

                    importantItem:values.importantItem,
                    suggestion:values.suggestion

                    
                }

                postService('/workReport/infoSubmit/haveUpdate',body,data=>{
                    if(data.flag){
                        message.success('修改成功')
                        this.setState({spin:false})
                        history.back()
                    }else{
                        this.setState({spin:false})
                        message.error('修改失败')
                    }
                })
            }
        })
    }
    render(){
        const {allData,list1,list2,tableList3,tableList4,tableList5,tableList6} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
        const formItemLayout3 = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };
        const formItemLayout4 = { labelCol: { span: 4 }, wrapperCol: { span: 12 } };
        const formItemLayout5 = { labelCol: { span: 2 }, wrapperCol: { span: 20 } };

        const reformTbale = () => {
            return (
              <table className="reformTbaleEdit">
                <thead>
                  <tr>
                    <th colSpan="2">{allData.month}月适配改造的涉密系统名称</th>
                    <th>开始时间</th>
                    <th>结束时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    list1.length?list1.map((item, j) => (
                        <tr key={j}>
                            <td>{j + 1}</td>
                            <td>{item.systemName}</td>
                            <td>{item.startTime}</td>
                            <td>{item.finishTime}</td>
                            <td>
                                {
                                    item.isEdit?<a onClick={()=>this.editData1(item)}>编辑</a>:item.finishTime?'无':<a onClick={()=>this.editData1(item)}>编辑</a>
                                }
                            </td>
                        </tr>
                    )):<tr><td colSpan={5}><img src={empty} alt=''/></td></tr>
                  }
                </tbody>
                <thead>
                  <tr>
                    <th colSpan="2">{allData.month}月适配改造的非涉密系统名称</th>
                    <th>开始时间</th>
                    <th>结束时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    list2.length?list2.map((item, j) => (
                        <tr key={j}>
                            <td>{j + 1}</td>
                            <td>{item.systemName}</td>
                            <td>{item.startTime}</td>
                            <td>{item.finishTime}</td>
                            <td>
                                {
                                    item.isEdit?<a onClick={()=>this.editData1(item)}>编辑</a>:item.finishTime?'无':<a onClick={()=>this.editData1(item)}>编辑</a>
                                }
                            </td>
                        </tr>
                    )):<tr><td colSpan={5}><img src={empty} alt=''/></td></tr>
                    }
                </tbody>
              </table>
            );
        };
        const deplayTable = () => {
            return (
              <div>
                <div className='deplayContent'>
                  <table border="1">
                    <thead>
                      <tr>
                        <th>产品分类</th>
                        <th colSpan="2">生产厂商</th>
                        <th>CPU芯片</th>
                        <th>操作系统</th>
                        <th>数量（台/套）</th>
                        <th>备注</th>
                      </tr>
                    </thead>
                    <tbody>
                        {
                            tableList3.length?tableList3.map(e=>{
                                return e.list.map((item, index) => {
                                    return (
                                      <tr key={index}>
                                        {index === 0 ? (
                                          <td rowSpan={e.list.length}>{e.productName}</td>
                                        ) : null}
                                        <td>{index + 1}</td>
                                        <td>{item.companyName}</td>
                                        <td>{item.cpuName}</td>
                                        <td>{item.systemName}</td>
                                        <td>{item.num}</td>
                                        <td>{item.remark}</td>
                                      </tr>
                                    );
                                  })
                            }):<tr><td colSpan={7}><img src={empty} alt=''/></td></tr>
                        }
                    </tbody>
                     <thead>
                      <tr>
                        <th> </th>
                        <th colSpan="2">类别</th>
                        <th>数量（台/套）</th>
                        <th colSpan="3">备注</th>
                      </tr>
                    </thead>
                    <tbody>
                        {
                            tableList4.length?tableList4.map(e=>{
                                return e.list.map((item, index) => {
                                    return (
                                    <tr key={index}>
                                        {index === 0 ? (
                                        <td rowSpan={e.list.length}>{e.productName}</td>
                                        ) : null}
                                        <td>{index + 1}</td>
                                        <td>{item.typeName}</td>
                                        <td>{item.num}</td>
                                        <td colSpan='3'>{item.remarks}</td>
                                    </tr>
                                    )
                                })
                            }):<tr><td colSpan={7}><img src={empty} alt=''/></td></tr>
                        }
                    </tbody>
                  </table>
                </div>
              </div>
            );
        };
        const deplayTable2 = () => {
            return (
              <div>
                <div className='deplayContent'>
                  <table border="1">
                    <thead>
                      <tr>
                        <th>产品分类</th>
                        <th colSpan="2">生产厂商</th>
                        <th>CPU芯片</th>
                        <th>操作系统</th>
                        <th>数量（台/套）</th>
                        <th>备注</th>
                      </tr>
                    </thead>
                    <tbody>
                        {
                            tableList5.length?tableList5.map(e=>{
                                return e.list.map((item, index) => {
                                    return (
                                      <tr key={index}>
                                        {index === 0 ? (
                                          <td rowSpan={e.list.length}>{e.productName}</td>
                                        ) : null}
                                        <td>{index + 1}</td>
                                        <td>{item.companyName}</td>
                                        <td>{item.cpuName}</td>
                                        <td>{item.systemName}</td>
                                        <td>{item.num}</td>
                                        <td>{item.remark}</td>
                                      </tr>
                                    );
                                  })
                            }):<tr><td colSpan={7}><img src={empty} alt=''/></td></tr>
                        }
                    </tbody>
                     <thead>
                      <tr>
                        <th> </th>
                        <th colSpan="2">类别</th>
                        <th>数量（台/套）</th>
                        <th colSpan="3">备注</th>
                      </tr>
                    </thead>
                    <tbody>
                        {
                            tableList6.length?tableList6.map(e=>{
                                return e.list.map((item, index) => {
                                    return (
                                    <tr key={index}>
                                        {index === 0 ? (
                                        <td rowSpan={e.list.length}>{e.productName}</td>
                                        ) : null}
                                        <td>{index + 1}</td>
                                        <td>{item.typeName}</td>
                                        <td>{item.num}</td>
                                        <td colSpan='3'>{item.remark}</td>
                                    </tr>
                                    )
                                })
                            }):<tr><td colSpan={7}><img src={empty} alt=''/></td></tr>
                        }
                    </tbody>
                  </table>
                </div>
              </div>
            );
        };
        const timeList = [
          {
              key:'govOrderTime',
              name:'政府采购'
          },
          {
              key:'systemAdapteTime',
              name:'系统适配改造'
          },
          {
              key:'systemTestTime',
              name:'系统功能、性能测试'
          },
          {
              key:'systemTestRunTime',
              name:'系统试运行'
          },
          {
              key:'assessmentTime',
              name:'系统测试评估'
          },
          {
              key:'systemOnlineTime',
              name:'系统正式上线'
          },
          {
              key:'projectFinishTime',
              name:'项目竣工验收'
          },
          {
              key:'financialAccountsTime',
              name:'财务决算'
          }
        ]
        return(
            <Spin spinning={this.state.spin}>
                <div className='addInformationSubmit'>
                  <Form>
                    <header id='header'>
                        <div className='header-item'>填报单位：{allData.createUnitName}</div>
                        <div className='header-item'>填报人：{allData.createUserName}</div>
                        <div className='header-item'>时间：{allData.createTime&&allData.createTime.substring(0,10)}</div>
                        <div className='header-item header-itembtn'>
                            <div className='header-item-btn'><Button type='primary' onClick={this.handleSubmit}>保存</Button></div>
                            <div className='header-item-btn'><Button type='default' onClick={()=>history.back()}>返回</Button></div>
                        </div>
                    </header>
                    <div id='empty'></div>
                    <div className='step-name'>
                        <span>一、项目推进主要进度节点</span>　
                        <Tooltip placement="right" title={'说明：已完成的工作在对应进度下选择完成日期，未完成的可不填写'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
                    <Row style={{padding:'10px 0px'}}>
                        {
                            timeList.map(item=>{
                                return <Col span={6} key={item.key}>
                                            <div className='ant-form-item-title'>{item.name}：</div>
                                            <FormItem {...formItemLayout} >
                                                {
                                                    getFieldDecorator(item.key, {
                                                        rules: [{
                                                            required: false,
                                                            message:`${item.name}为必填项`
                                                        }], initialValue:allData[item.key]?moment(allData[item.key]):null,
                                                    })
                                                    (<DatePicker disabled={allData[item.key]?true:allData.projectFinishTime?true:false} style={{width:'100%'}}/>)
                                                }
                                            </FormItem>
                                        </Col>
                            })
                        }
                    </Row>
                    
                    <div className='step-name'>
                        <span>二、项目资金使用情况</span>　
                        <Tooltip placement="right" title={'说明：计划投资完成指完成项目采购签订合同，计划投资拨付指向工程承建、监理等单位拨付款项，如分批次付款，以最后一次为准。如有调整请写明调整事项、时间、设计金额和履行的程序。'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
                    <Row style={{padding:'10px 0px'}}>
                        <Col span={12}>
                            <div>
                                <label>
                                    <span className='ant-form-item-title'>计划投资完成：</span>
                                </label>
                            </div>
                            <FormItem label='日期' {...formItemLayout4} >
                                {
                                    getFieldDecorator('curInvestmentPlanTime', {
                                        rules: [{
                                            required: true,
                                            message:'日期为必填项'
                                        }], initialValue: allData.curInvestmentPlanTime?moment(allData.curInvestmentPlanTime):null,
                                    })
                                    (<DatePicker disabled style={{width:'60%'}}/>)
                                }
                            </FormItem>
                            <FormItem label='金额' {...formItemLayout4} >
                                {
                                    getFieldDecorator('curInvestmentPlanMoney', {
                                        rules: [{
                                            required: true,
                                            validator:(rule,value,callback)=>{
                                                if(!value){
                                                    callback('金额为必填项')
                                                }else if(isNaN(Number(value))){
                                                    callback('请勿输入非数字值')
                                                }else if(Number(value)<0){
                                                    callback('请勿输入负数')
                                                }else{
                                                    callback()
                                                }
                                            }
                                        }], initialValue: allData.curInvestmentPlanMoney?allData.curInvestmentPlanMoney:null,
                                    })
                                    (<Input disabled style={{width:'60%'}} addonAfter="万元"/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <div>
                                <label>
                                    <span className='ant-form-item-title'>计划投资拨付：</span>
                                </label>
                            </div>
                            <FormItem label='日期' {...formItemLayout4} >
                                {
                                    getFieldDecorator('curInvestmentPayTime', {
                                        rules: [{
                                            required: true,
                                            message:'日期为必填项'
                                        }], initialValue:  allData.curInvestmentPayTime?moment(allData.curInvestmentPayTime):null,
                                    })
                                    (<DatePicker disabled style={{width:'60%'}}/>)
                                }
                            </FormItem>
                            <FormItem label='金额' {...formItemLayout4} >
                                {
                                    getFieldDecorator('curInvestmentPayMoney', {
                                        rules: [{
                                            required: true,
                                            validator:(rule,value,callback)=>{
                                                if(!value){
                                                    callback('金额为必填项')
                                                }else if(isNaN(Number(value))){
                                                    callback('请勿输入非数字值')
                                                }else if(Number(value)<0){
                                                    callback('请勿输入负数')
                                                }else{
                                                    callback()
                                                }
                                            }
                                        }], initialValue:  allData.curInvestmentPayMoney?allData.curInvestmentPayMoney:null,
                                    })
                                    (<Input disabled style={{width:'60%'}} addonAfter="万元"/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label='投资调整' {...formItemLayout5} >
                                {
                                    getFieldDecorator('adjustInfo', {
                                        rules: [{
                                            required: false,
                                        }], initialValue:allData.adjustInfo||'',
                                    })
                                    (<TextArea disabled={allData.adjustInfo?true:false} rows={4} style={{width:'100%'}}/>)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    
                    <div className='step-name'>
                        <span>三、应用系统改造情况</span>　
                        <Tooltip placement="right" title={'说明：涉密系统点击“新增涉密系统改造”，非涉密系统点击“新增涉密系统改造”，来分别填写本次采购项目涉及到的应用系统适配改造情况，如果没有则不填'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
                    {
                        reformTbale()
                    }
                    <div className='step-name'>
                        <span>四、设备部署情况</span>　
                        <Tooltip placement="right" title={'说明：填写过程中，请点击按钮新增设备，来添加设备。生产城市、CPU芯片、操作系统、数据库请在下拉菜单中选择'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
                    <Row style={{padding:'10px 0px'}}>
                        <div className='row-div-title'>{allData.month}月涉密领域部署情况</div>
                        {
                            deplayTable()
                        }
                        <div className='row-div-title'>{allData.month}月非涉密领域部署情况</div>
                        {
                            deplayTable2()
                        }
                    </Row>
                    <div className='step-name'>
                        <span>五、重要事项</span>　
                        <Tooltip placement="right" title={'说明：主要填写领导批示、好的经验做法等，以及推进工作中遇到的重要情况.'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
                    <Row style={{padding:'10px 0px'}}>
                        <Col span={24}>
                            <FormItem {...formItemLayout3} >
                                {
                                    getFieldDecorator('importantItem', {
                                        rules: [{
                                            required: false,
                                        }], initialValue:allData.importantItem||'',
                                    })
                                    (<TextArea disabled={allData.importantItem?true:false} rows={5} style={{width:'100%'}}/>)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <div className='step-name'>
                        <span>六、问题和建议</span>　
                        <Tooltip placement="right" title={'说明：请填写推进工作中遇到的主要困难和问题，包括出现问题的产品、生产厂商等，以及对全面替代工作的意见建议.'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
                    <Row style={{padding:'10px 0px'}}>
                        <Col span={24}>
                            <FormItem {...formItemLayout3} >
                                {
                                    getFieldDecorator('suggestion', {
                                        rules: [{
                                            required: false,
                                        }], initialValue:allData.suggestion||'',
                                    })
                                    (<TextArea disabled={allData.suggestion?true:false} rows={5} style={{width:'100%'}}/>)
                                }
                            </FormItem>
                        </Col>
                    </Row>  
                    </Form>
                    <Modal
                        title='编辑应用系统'
                        visible={this.state.data1Visible}
                        width={600}
                        footer={null}
                        onCancel={()=>this.setState({data1Visible:false})}
                        destroyOnClose={true}
                        afterClose={()=>this.setState({data1Visible:false})}
                    >
                        <Data1 
                            detail1={this.state.detail1}
                            closeData1Modal={this.closeData1Modal} 
                            getList1={this.getList1}
                        />
                    </Modal>
                </div>
            </Spin>
        )
    }
}

@Form.create()
class Data1 extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    componentDidMount(){
        let {detail1} = this.props;
        this.props.form.setFieldsValue({
            systemName:detail1.systemName,
            isSm:detail1.isSm,
            startTime:moment(detail1.startTime),
            finishTime:detail1.finishTime?moment(detail1.finishTime):null,
        })
        
    }
    handleSubmit = () => {
        let {detail1} = this.props;
        this.props.form.validateFields((error, values) => {
            if(!error){
                let body = {
                    ...detail1,
                    ...values,
                    startTime:moment(values.startTime).format('YYYY-MM-DD'),
                    finishTime:values.finishTime?moment(values.finishTime).format('YYYY-MM-DD'):'',
                }
                this.props.getList1(body)
                this.props.closeData1Modal()
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
        return(
            <div>
                <Form>
                    <FormItem label='系统名称' {...formItemLayout} >
                        {
                            getFieldDecorator('systemName', {
                                rules: [{
                                    required: true,
                                    max:60,
                                    message:'系统名称为必填项且字数限制60字'
                                }], initialValue: '',
                            })
                            (<Input disabled style={{width:'100%'}}/>)
                        }
                    </FormItem>
                    <FormItem label='是否涉密' {...formItemLayout} >
                        {
                            getFieldDecorator('isSm', {
                                rules: [{
                                    required: false,
                                    message:'是否涉密为必填项'
                                }], initialValue: true,
                            })
                            (
                                <Radio.Group disabled>
                                    <Radio value={true}>是</Radio>
                                    <Radio value={false}>否</Radio>
                                </Radio.Group>
                            )
                        }
                    </FormItem>
                    <FormItem label='开始时间' {...formItemLayout} >
                        {
                            getFieldDecorator('startTime', {
                                rules: [{
                                    required: true,
                                    message:'开始时间为必填项'
                                }], initialValue: null,
                            })
                            (<DatePicker disabled style={{width:'100%'}}/>)
                        }
                    </FormItem>
                    <FormItem label='结束时间' {...formItemLayout} >
                        {
                            getFieldDecorator('finishTime', {
                                rules: [{
                                    required: false,
                                    message:'结束时间为必填项'
                                }], initialValue: null,
                            })
                            (<DatePicker style={{width:'100%'}}/>)
                        }
                    </FormItem>
                    <div style={{textAlign:'center',padding:'16px 0'}}>
                        <Button onClick={() => this.props.closeData1Modal()}>取消</Button>　　
                        <Button type='primary' onClick={this.handleSubmit}>确定</Button>
                    </div>

                </Form>
            </div>
        )
    }
}





