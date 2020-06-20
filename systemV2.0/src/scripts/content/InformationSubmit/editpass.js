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
import {limitStr,limitMoney,limitMoney2,limitNumber,limitWordNumber,checkPhone,checkMobilePhone} from '../../common/checkForm';
import {timeList} from '../../common/staticData';
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
            moneyList:[],
            endList:[],
            serverList:[],
        }
    }

    componentDidMount(){
        window.addEventListener('scroll', this.handleScroll);
        this.getDetail();
        
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
                let list1 = [],list2 = [],list3 = [],list4 = [],list5 = [],list6 = [],tableList3 = [],tableList4 = [],tableList5 = [],tableList6 = [];
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
                    e.childDevices.map((item,index)=>{
                        item.orderNum = index + 1;
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
                        list3.push(item)
                    })
                    
                    object.list = list;
                    tableList3.push(object)

                })

                data.smDeviceInfoInList.map((e,index)=>{//涉密设备类别
                    let object = {productId:e.deviceType,productName:e.deviceName,list:[]}
                    let list = [];
                    e.childDevices.map((item,index)=>{
                        item.orderNum = index + 1;
                        list.push({
                            typeId:item.deviceDetailType,
                            typeName:item.deviceDetailTypeName,
                            model:item.model,
                            num:String(item.num),
                            remark:item.remark,
                        })
                        list4.push(item)
                    })
                    
                    object.list = list;
                    tableList4.push(object)
                })

                data.fsmDeviceInfoNoInList.map((e,index)=>{//非涉密设备非类别
                    let object = {productId:e.deviceType,productName:e.deviceName,list:[]}
                    let list = [];
                    e.childDevices.map((item,index)=>{
                        item.orderNum = index + 1;
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
                        list5.push(item)
                    })
                    
                    object.list = list;
                    tableList5.push(object)
                })

                data.fsmDeviceInfoInList.map((e,index)=>{//非涉密设备类别
                    let object = {productId:e.deviceType,productName:e.deviceName,list:[]}
                    let list = [];
                    e.childDevices.map((item,index)=>{
                        item.orderNum = index + 1;
                        list.push({
                            typeId:item.deviceDetailType,
                            typeName:item.deviceDetailTypeName,
                            model:item.model,
                            num:String(item.num),
                            remark:item.remark,
                        })
                        list6.push(item)
                    })
                   
                    object.list = list;
                    tableList6.push(object)
                })

                this.setState({spin:false,list1,list2,list3,list4,list5,list6,tableList3,tableList4,tableList5,tableList6,allData:{...data,month:new Date().getMonth()+1}
                })
                
            }else{
                this.setState({spin:false})
                message.error('未知错误')
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
        let {allData,list1,list2,list3,list4,list5,list6} = this.state;
        this.props.form.validateFields((error, values) => {
            if(!error){
                let deviceInfoList = [...list3,...list4,...list5,...list6],applicationInfoList = [...list1,...list2];
                let body = {
                    id:allData.id,
                    projectName:allData.projectName,
                    govOrderStartTime:values.govOrderStartTime?moment(values.govOrderStartTime).format('YYYY-MM-DD'):'',
                    govOrderEndTime:values.govOrderEndTime?moment(values.govOrderEndTime).format('YYYY-MM-DD'):'',

                    systemAdapteStartTime:values.systemAdapteStartTime?moment(values.systemAdapteStartTime).format('YYYY-MM-DD'):'',
                    systemAdapteEndTime:values.systemAdapteEndTime?moment(values.systemAdapteEndTime).format('YYYY-MM-DD'):'',

                    systemTestStartTime:values.systemTestStartTime?moment(values.systemTestStartTime).format('YYYY-MM-DD'):'',
                    systemTestEndTime:values.systemTestEndTime?moment(values.systemTestEndTime).format('YYYY-MM-DD'):'',

                    systemTestRunStartTime:values.systemTestRunStartTime?moment(values.systemTestRunStartTime).format('YYYY-MM-DD'):'',
                    systemTestRunEndTime:values.systemTestRunEndTime?moment(values.systemTestRunEndTime).format('YYYY-MM-DD'):'',

                    assessmentStartTime:values.assessmentStartTime?moment(values.assessmentStartTime).format('YYYY-MM-DD'):'',
                    assessmentEndTime:values.assessmentEndTime?moment(values.assessmentEndTime).format('YYYY-MM-DD'):'',

                    systemOnlineStartTime:values.systemOnlineStartTime?moment(values.systemOnlineStartTime).format('YYYY-MM-DD'):'',
                    systemOnlineEndTime:values.systemOnlineEndTime?moment(values.systemOnlineEndTime).format('YYYY-MM-DD'):'',

                    projectFinishStartTime:values.projectFinishStartTime?moment(values.projectFinishStartTime).format('YYYY-MM-DD'):'',
                    projectFinishEndTime:values.projectFinishEndTime?moment(values.projectFinishEndTime).format('YYYY-MM-DD'):'',

                    financialAccountsStartTime:values.financialAccountsStartTime?moment(values.financialAccountsStartTime).format('YYYY-MM-DD'):'',
                    financialAccountsEndTime:values.financialAccountsEndTime?moment(values.financialAccountsEndTime).format('YYYY-MM-DD'):'',

                    adjustInfo:values.adjustInfo,
                    deviceInfoList:deviceInfoList,
                    applicationInfoList:applicationInfoList,

                    //二、项目资金使用情况
                    curInvestmentPlaceTime:values.curInvestmentPlaceTime?moment(values.curInvestmentPlaceTime).format('YYYY-MM-DD'):'',
                    curInvestmentPlanTime:values.curInvestmentPlanTime?moment(values.curInvestmentPlanTime).format('YYYY-MM-DD'):'',
                    curInvestmentPayTime:values.curInvestmentPayTime?moment(values.curInvestmentPayTime).format('YYYY-MM-DD'):'',
                    curInvestmentPlaceMoney:Number(values.curInvestmentPlaceMoney),
                    curInvestmentPlanMoney:Number(values.curInvestmentPlanMoney),
                    curInvestmentPayMoney:Number(values.curInvestmentPayMoney),

                    //六、备注
                    addInvestmentMoney:values.addInvestmentMoney?Number(values.addInvestmentMoney):null,
                    addTerminalsNum:values.addTerminalsNum?Number(values.addTerminalsNum):null,
                    addServersNum:values.addServersNum?Number(values.addServersNum):null,
                    ebInvestmentMoney:values.ebInvestmentMoney?Number(values.ebInvestmentMoney):null,
                    ebTerminalsNum:values.ebTerminalsNum?Number(values.ebTerminalsNum):null,
                    ebServersNum:values.ebServersNum?Number(values.ebServersNum):null,
                    otherItem:values.otherItem,

                    //七、问题与建议
                    isSmSuggestion:values.isSmSuggestion,
                    notSmSuggestion:values.notSmSuggestion,
                    contactName:values.contactName,
                    officePhone:values.officePhone,
                    contactPhone:values.contactPhone,

                    //统计周期
                    curReportStartTime:values.curReportStartTime?moment(values.curReportStartTime).format('YYYY-MM-DD'):'',
                    curReportEndTime:values.curReportEndTime?moment(values.curReportEndTime).format('YYYY-MM-DD'):'',
                    appReportStartTime:values.appReportStartTime?moment(values.appReportStartTime).format('YYYY-MM-DD'):'',
                    appReportEndTime:values.appReportEndTime?moment(values.appReportEndTime).format('YYYY-MM-DD'):'',
                    devReportStartTime:values.devReportStartTime?moment(values.devReportStartTime).format('YYYY-MM-DD'):'',
                    devReportEndTime:values.devReportEndTime?moment(values.devReportEndTime).format('YYYY-MM-DD'):'',

                    importantItem:values.importantItem,
                    suggestion:values.suggestion

                }

                postService('/workReport/infoSubmit/update',body,data=>{
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
        const formItemLayout1 = { labelCol: { span: 0 }, wrapperCol: { span: 22 } };
        const formItemLayout3 = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };
        const formItemLayout4 = { labelCol: { span: 4 }, wrapperCol: { span: 18 } };
        const formItemLayout5 = { labelCol: { span: 2 }, wrapperCol: { span: 20 } };
        const formItemLayout7 = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };

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
        return(
            <Spin spinning={this.state.spin}>
                <div className='addInformationSubmit'>
                  <Form>
                    <header id='header'>
                        <div className='header-item'>填报单位：{allData.createUnitName}</div>
                        <div className='header-item'>填报人：{allData.createUserName}</div>
                        <div className='header-item'>时间：{allData.createTime&&allData.createTime.substring(0,10)}</div>
                        <div className='header-item'>
                            <Button type='primary' onClick={this.handleSubmit}>保存</Button>　
                            <Button type='default' onClick={()=>history.back()}>返回</Button>
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
                                            <div className='ant-from-item-head'>
                                                <label>
                                                    <span className={`ant-form-item-title ${item.name==='项目竣工验收'?'ant-form-item-boldTitle':''}`}>{item.name}：</span>
                                                </label>
                                            </div>
                                            <div>
                                                <div className='ant-form-time'>
                                                    <FormItem {...formItemLayout1} >
                                                        {
                                                            getFieldDecorator(item.key, {
                                                                rules: [{
                                                                    required: false,
                                                                    message:`${item.name}为必填项`
                                                                }], initialValue: allData[item.key]?moment(allData[item.key]):null,
                                                            })
                                                            (<DatePicker disabled={allData[item.key]?true:allData.projectFinishEndTime?true:false} placeholder="请选择启动时间" style={{width:'calc(100% - 26px)'}}/>)
                                                        }　~
                                                    </FormItem>
                                                </div>
                                                <div className='ant-form-time'>
                                                    <FormItem {...formItemLayout1} >
                                                        {
                                                            getFieldDecorator(item.key2, {
                                                                rules: [{
                                                                    required: false,
                                                                    message:`${item.name}为必填项`
                                                                }], initialValue: allData[item.key2]?moment(allData[item.key2]):null,
                                                            })
                                                            (<DatePicker disabled={allData[item.key2]?true:allData.projectFinishEndTime?true:false} placeholder="请选择完成时间" style={{width:'calc(100% - 26px)'}}/>)
                                                        }
                                                    </FormItem>
                                                </div>
                                            </div>
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
                        <div style={{height:'60px',padding:'10px 0'}}>
                            <div className='ant-from-inline-block'>统计周期：</div>
                            <div className='ant-from-inline-block'>
                                <FormItem {...formItemLayout3} >
                                    {
                                        getFieldDecorator('curReportStartTime', {
                                            rules: [{
                                                required: false,
                                                message:'日期为必填项'
                                            }], initialValue: allData.curReportStartTime?moment(allData.curReportStartTime):null,
                                        })
                                        (<DatePicker disabled={allData.curReportStartTime?true:allData.projectFinishEndTime?true:false} style={{width:'calc(100% - 26px)'}}/>)
                                    }　~
                                </FormItem>
                            </div>
                            <div className='ant-from-inline-block'>
                                <FormItem {...formItemLayout3} >
                                    {
                                        getFieldDecorator('curReportEndTime', {
                                            rules: [{
                                                required: false,
                                                message:'日期为必填项'
                                            }], initialValue: allData.curReportEndTime?moment(allData.curReportEndTime):null,
                                        })
                                        (<DatePicker disabled={allData.curReportEndTime?true:allData.projectFinishEndTime?true:false} style={{width:'calc(100% - 26px)'}}/>)
                                    }
                                </FormItem>
                            </div>
                        </div>
                        <Col span={8}>
                            <div className='ant-from-item-head'>
                                <label>
                                    <span className='ant-form-item-title'>年度计划投资到位 </span>
                                </label>
                                <Tooltip placement="right" title={'说明：指统计时间区间内安可替代工程项目资金到账。如在统计时间区间内分批到账，‘日期’填写最后一批到账时间，‘金额’填写统计时间区间内到账金额总和。'}>
                                    <Icon type="exclamation-circle" style={{color:'#666'}}/>
                                </Tooltip>
                            </div>
                            <FormItem label='日期' {...formItemLayout4} >
                                {
                                    getFieldDecorator('curInvestmentPlaceTime', {
                                        rules: [{
                                            required: false,
                                        }], initialValue: allData.curInvestmentPlaceTime?moment(allData.curInvestmentPlaceTime):null,
                                    })
                                    (<DatePicker disabled style={{width:'60%'}}/>)
                                }
                            </FormItem>
                            <FormItem label='金额' {...formItemLayout4} >
                                {
                                    getFieldDecorator('curInvestmentPlaceMoney', {
                                        rules: [{
                                            required: false,
                                        }], initialValue: allData.curInvestmentPlaceMoney?allData.curInvestmentPlaceMoney:'',
                                    })
                                    (<Input disabled style={{width:'60%'}} addonAfter="万元"/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <div className='ant-from-item-head'>
                                <label>
                                    <span className='ant-form-item-title'>年度计划投资完成 </span>
                                </label>
                                <Tooltip placement="right" title={'说明：指签订项目采购合同。如在统计时间区间内分批签订，‘日期’填写最后一次合同签订时间，‘金额’填写统计时间区间内签订合同金额总和。'}>
                                    <Icon type="exclamation-circle" style={{color:'#666'}}/>
                                </Tooltip>
                            </div>
                            <FormItem label='日期' {...formItemLayout4} >
                                {
                                    getFieldDecorator('curInvestmentPlanTime', {
                                        rules: [{
                                            required: false,
                                        }], initialValue: allData.curInvestmentPlanTime?moment(allData.curInvestmentPlanTime):null,
                                    })
                                    (<DatePicker disabled style={{width:'60%'}}/>)
                                }
                            </FormItem>
                            <FormItem label='金额' {...formItemLayout4} >
                                {
                                    getFieldDecorator('curInvestmentPlanMoney', {
                                        rules: [{
                                            required: false,
                                        }], initialValue: allData.curInvestmentPlanMoney?allData.curInvestmentPlanMoney:'',
                                    })
                                    (<Input disabled style={{width:'60%'}} addonAfter="万元"/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <div className='ant-from-item-head'>
                                <label>
                                    <span className='ant-form-item-title'>年度计划投资拨付 </span>
                                </label>
                                <Tooltip placement="right" title={'说明：指向工程承建、监理等单位拨付款项。如在统计时间区间内分批拨付，‘日期’填写最后一次款项拨付时间，‘金额’填写统计时间区间内拨付款项金额总和。'}>
                                    <Icon type="exclamation-circle" style={{color:'#666'}}/>
                                </Tooltip>
                            </div>
                            <FormItem label='日期' {...formItemLayout4} >
                                {
                                    getFieldDecorator('curInvestmentPayTime', {
                                        rules: [{
                                            required: false,
                                        }], initialValue:  allData.curInvestmentPayTime?moment(allData.curInvestmentPayTime):null,
                                    })
                                    (<DatePicker disabled style={{width:'60%'}}/>)
                                }
                            </FormItem>
                            <FormItem label='金额' {...formItemLayout4} >
                                {
                                    getFieldDecorator('curInvestmentPayMoney', {
                                        rules: [{
                                            required: false,
                                        }], initialValue:  allData.curInvestmentPayMoney?allData.curInvestmentPayMoney:'',
                                    })
                                    (<Input disabled style={{width:'60%'}} addonAfter="万元"/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <div style={{display:'inline-block',width:'100px',verticalAlign:'top'}}>
                                <div className='ant-from-item-head' style={{textAlign:'right'}}>
                                    <label>
                                        <span className='ant-form-item-title'>投资调整 </span>
                                    </label>
                                    <Tooltip placement="right" title={'说明：指向工程承建、监理等单位拨付款项。如在统计时间区间内分批拨付，‘日期’填写最后一次款项拨付时间，‘金额’填写统计时间区间内拨付款项金额总和。'}>
                                        <Icon type="exclamation-circle" style={{color:'#666'}}/>
                                    </Tooltip>　
                                </div>
                            </div>
                            <div style={{display:'inline-block',width:'calc(100% - 100px)'}}>
                                <FormItem {...formItemLayout3} >
                                    {
                                        getFieldDecorator('adjustInfo', {
                                            rules: [{
                                                required: false,
                                            }], initialValue:allData.adjustInfo||'',
                                        })
                                        (<TextArea disabled={allData.adjustInfo?true:allData.projectFinishEndTime?true:false} rows={4} style={{width:'100%'}}/>)
                                    }
                                </FormItem>
                            </div>
                            
                        </Col>
                    </Row>
                    <div className='step-name'>
                        <span>三、应用系统改造情况</span>　
                        <Tooltip placement="right" title={'说明：涉密系统点击“新增涉密系统改造”，非涉密系统点击“新增涉密系统改造”，来分别填写本次采购项目涉及到的应用系统适配改造情况，如果没有则不填'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
                    <div style={{height:'60px',paddingTop:'20px'}}>
                        <div className='ant-from-inline-block'>统计周期：</div>
                        <div className='ant-from-inline-block'>
                            <FormItem {...formItemLayout3} >
                                {
                                    getFieldDecorator('appReportStartTime', {
                                        rules: [{
                                            required: false,
                                            message:'日期为必填项'
                                        }], initialValue: allData.appReportStartTime?moment(allData.appReportStartTime):null,
                                    })
                                    (<DatePicker disabled={allData.appReportStartTime?true:allData.projectFinishEndTime?true:false} style={{width:'calc(100% - 26px)'}}/>)
                                }　~
                            </FormItem>
                        </div>
                        <div className='ant-from-inline-block'>
                            <FormItem {...formItemLayout3} >
                                {
                                    getFieldDecorator('appReportEndTime', {
                                        rules: [{
                                            required: false,
                                            message:'日期为必填项'
                                        }], initialValue: allData.appReportEndTime?moment(allData.appReportEndTime):null,
                                    })
                                    (<DatePicker disabled={allData.appReportEndTime?true:allData.projectFinishEndTime?true:false} style={{width:'calc(100% - 26px)'}}/>)
                                }
                            </FormItem>
                        </div>
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
                        <div style={{height:'60px',paddingTop:'12px'}}>
                            <div className='ant-from-inline-block'>统计周期：</div>
                            <div className='ant-from-inline-block'>
                                <FormItem {...formItemLayout3} >
                                    {
                                        getFieldDecorator('devReportStartTime', {
                                            rules: [{
                                                required: false,
                                                message:'日期为必填项'
                                            }], initialValue: allData.devReportStartTime?moment(allData.devReportStartTime):null,
                                        })
                                        (<DatePicker disabled={allData.devReportStartTime?true:allData.projectFinishEndTime?true:false} style={{width:'calc(100% - 26px)'}}/>)
                                    }　~
                                </FormItem>
                            </div>
                            <div className='ant-from-inline-block'>
                                <FormItem {...formItemLayout3} >
                                    {
                                        getFieldDecorator('devReportEndTime', {
                                            rules: [{
                                                required: false,
                                                message:'日期为必填项'
                                            }], initialValue: allData.devReportEndTime?moment(allData.devReportEndTime):null,
                                        })
                                        (<DatePicker disabled={allData.devReportEndTime?true:allData.projectFinishEndTime?true:false} style={{width:'calc(100% - 26px)'}}/>)
                                    }
                                </FormItem>
                            </div>
                        </div>
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
                    <Row style={{padding:'30px 0px 0'}}>
                        <Col span={24}>
                            <FormItem {...formItemLayout3} >
                                {
                                    getFieldDecorator('importantItem', {
                                        rules: [{
                                            required: false,
                                            validator:(rule,value,callback)=>limitWordNumber(rule,value,callback,5000)
                                        }], initialValue: allData.importantItem||'',
                                    })
                                    (<TextArea disabled={allData.importantItem?true:allData.projectFinishEndTime?true:false} rows={5} placeholder='说明：落实经费情况，好的经验做法等，推进工作中遇到的重要情况，以及本地区本部门主要领导同志或主要分管领导同志批示等，仅填写奔重汽内的相关情况，限制5000字' style={{width:'100%'}}/>)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <div className='step-name'>
                        <span>六、备注</span>　
                    </div>
                    <Row style={{padding:'10px 0px'}}>
                        <div className='editPassRemark'>
                            <Col span={8}>
                                <div className='ant-from-item-head'>
                                    <label>
                                        <span className='ant-form-item-title'>本次填报周期新增投资经费</span>
                                    </label>
                                </div>
                                <FormItem {...formItemLayout1} >
                                    {
                                        getFieldDecorator('addInvestmentMoney', {
                                            rules: [{
                                                required: false,
                                                validator:(rule,value,callback)=>limitMoney2(rule,value,callback)
                                            }], initialValue: '',
                                        })
                                        (<Input style={{width:'60%',marginRight:'12px'}} addonAfter="万元"/>)
                                    }  <Tooltip placement="right" title={'说明：只填写较上次填报新增的支付经费'}>
                                            <Icon type="exclamation-circle" style={{color:'#666'}}/>
                                        </Tooltip>
                                </FormItem>
                                
                            </Col>
                            <Col span={8}>
                                <div className='ant-from-item-head'>
                                    <label>
                                        <span className='ant-form-item-title'>本次填报周期新增终端数量</span>
                                    </label>
                                </div>
                                <FormItem {...formItemLayout1} >
                                    {
                                        getFieldDecorator('addTerminalsNum', {
                                            rules: [{
                                                required: false,
                                                validator:(rule,value,callback)=>limitNumber(rule,value,callback)
                                            }], initialValue: '',
                                        })
                                        (<Input style={{width:'60%',marginRight:'12px'}} addonAfter="台"/>)
                                    }  <Tooltip placement="right" title={'说明：只填写较上次填报新购置的涉密和非涉密终端总数'}>
                                    <Icon type="exclamation-circle" style={{color:'#666'}}/>
                                </Tooltip>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <div className='ant-from-item-head'>
                                    <label>
                                        <span className='ant-form-item-title'>本次填报周期新增服务器</span>
                                    </label>
                                </div>
                                <FormItem {...formItemLayout1} >
                                    {
                                        getFieldDecorator('addServersNum', {
                                            rules: [{
                                                required: false,
                                                validator:(rule,value,callback)=>limitNumber(rule,value,callback)
                                            }], initialValue: '',
                                        })
                                        (<Input style={{width:'60%',marginRight:'12px'}} addonAfter="台"/>)
                                    }  <Tooltip placement="right" title={'说明：只填写较上次填报新购置的涉密和非涉密服务器总数'}>
                                    <Icon type="exclamation-circle" style={{color:'#666'}}/>
                                </Tooltip>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <div className='ant-from-item-head'>
                                    <label>
                                        <span className='ant-form-item-title'>台账预算外投资经费</span>
                                    </label>
                                </div>
                                <FormItem {...formItemLayout1} >
                                    {
                                        getFieldDecorator('ebInvestmentMoney', {
                                            rules: [{
                                                required: false,
                                                validator:(rule,value,callback)=>limitMoney2(rule,value,callback)
                                            }], initialValue:allData.ebInvestmentMoney?String(allData.ebInvestmentMoney):'',
                                        })
                                        (<Input disabled={allData.ebInvestmentMoney?true:allData.projectFinishEndTime?true:false} style={{width:'60%',marginRight:'12px'}} addonAfter="万元"/>)
                                    }  <Tooltip placement="right" title={'说明：填写超出立项或预算、额外支付的经费'}>
                                    <Icon type="exclamation-circle" style={{color:'#666'}}/>
                                </Tooltip>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <div className='ant-from-item-head'>
                                    <label>
                                        <span className='ant-form-item-title'>台账外新增终端数量</span>
                                    </label>
                                </div>
                                <FormItem {...formItemLayout1} >
                                    {
                                        getFieldDecorator('ebTerminalsNum', {
                                            rules: [{
                                                required: true,
                                                validator:(rule,value,callback)=>limitNumber(rule,value,callback)
                                            }], initialValue: allData.ebTerminalsNum?String(allData.ebTerminalsNum):'',
                                        })
                                        (<Input disabled={allData.ebTerminalsNum?true:allData.projectFinishEndTime?true:false} style={{width:'60%',marginRight:'12px'}} addonAfter="台"/>)
                                    } <Tooltip placement="right" title={'说明：填写超出台账计划、额外购买的计算机终端数量'}>
                                            <Icon type="exclamation-circle" style={{color:'#666'}}/>
                                        </Tooltip>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <div className='ant-from-item-head'>
                                    <label>
                                        <span className='ant-form-item-title'>台账外新增服务器数量</span>
                                    </label>
                                </div>
                                <FormItem {...formItemLayout1} >
                                    {
                                        getFieldDecorator('ebServersNum', {
                                            rules: [{
                                                required: true,
                                                validator:(rule,value,callback)=>limitNumber(rule,value,callback)
                                            }], initialValue: allData.ebServersNum?String(allData.ebServersNum):'',
                                        })
                                        (<Input disabled={allData.ebServersNum?true:allData.projectFinishEndTime?true:false} style={{width:'60%',marginRight:'12px'}} addonAfter="台"/>)
                                    }  <Tooltip placement="right" title={'说明：填写超出台账计划、额外购买的服务器数量'}>
                                    <Icon type="exclamation-circle" style={{color:'#666'}}/>
                                </Tooltip>
                                </FormItem>
                            </Col>
                            <Col span={24}>
                            <div className='ant-from-item-head'>
                                <label>
                                    <span className='ant-form-item-title'>其他事项</span>
                                </label>
                            </div>
                            <FormItem {...formItemLayout3} >
                                {
                                    getFieldDecorator('otherItem', {
                                        rules: [{
                                            required: false,
                                        }], initialValue: allData.otherItem||'',
                                    })
                                    (<TextArea disabled={allData.otherItem?true:allData.projectFinishEndTime?true:false} rows={5} style={{width:'100%'}}/>)
                                }
                            </FormItem>
                        </Col>
                        </div>
                    </Row> 
                    <div className='step-name'>
                        <span>七、问题和建议</span>　
                        <Tooltip placement="right" title={'说明：请填写推进工作中遇到的主要困难和问题，包括出现问题的产品、生产厂商等，以及对全面替代工作的意见建议.'}>
                            <Icon type="exclamation-circle" style={{color:'#fff'}}/>
                        </Tooltip>
                    </div>
                    <Row style={{padding:'10px 0px'}}>
                        <Col span={11}>
                            <div className='ant-from-item-head'>
                                <label>
                                    <span className='ant-form-item-title'>涉密领域</span>
                                </label>
                            </div>
                            <FormItem {...formItemLayout3} >
                                {
                                    getFieldDecorator('isSmSuggestion', {
                                        rules: [{
                                            required: false,
                                        }], initialValue: allData.isSmSuggestion||'',
                                    })
                                    (<TextArea disabled={allData.isSmSuggestion?true:allData.projectFinishEndTime?true:false} rows={5} placeholder='说明：请填写推进工作中，涉密领域遇到的主要困难和问题，包括出现问题的产品、生产厂商等，以及对全面替代工作的意见建议。' style={{width:'100%'}}/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={11} offset={2}>
                            <div className='ant-from-item-head'>
                                <label>
                                    <span className='ant-form-item-title'>非涉密领域</span>
                                </label>
                            </div>
                            <FormItem {...formItemLayout3} >
                                {
                                    getFieldDecorator('notSmSuggestion', {
                                        rules: [{
                                            required: false,
                                        }], initialValue: allData.notSmSuggestion||'',
                                    })
                                    (<TextArea disabled={allData.notSmSuggestion?true:allData.projectFinishEndTime?true:false} rows={5} placeholder='说明：请填写推进工作中，法涉密领域遇到的主要困难和问题，包括出现问题的产品、生产厂商等，以及对全面替代工作的意见建议。' style={{width:'100%'}}/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='联系人' {...formItemLayout7} >
                                {
                                    getFieldDecorator('contactName', {
                                        rules: [{
                                            required: false,
                                            validator:(rule,value,callback)=>limitWordNumber(rule,value,callback,20)
                                        }], initialValue: allData.contactName||'',
                                    })
                                    (<Input disabled={allData.contactName?true:allData.projectFinishEndTime?true:false} style={{width:'100%'}}/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='办公室电话' {...formItemLayout7} >
                                {
                                    getFieldDecorator('officePhone', {
                                        rules: [{
                                            required: false,
                                            validator:(rule,value,callback)=>checkPhone(rule,value,callback)
                                        }], initialValue: allData.officePhone||'',
                                    })
                                    (<Input disabled={allData.officePhone?true:allData.projectFinishEndTime?true:false} style={{width:'100%'}}/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='移动电话' {...formItemLayout7} >
                                {
                                    getFieldDecorator('contactPhone', {
                                        rules: [{
                                            required: false,
                                            validator:(rule,value,callback)=>checkMobilePhone(rule,value,callback)
                                        }], initialValue: allData.contactPhone||'',
                                    })
                                    (<Input disabled={allData.contactPhone?true:allData.projectFinishEndTime?true:false} style={{width:'100%'}}/>)
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





