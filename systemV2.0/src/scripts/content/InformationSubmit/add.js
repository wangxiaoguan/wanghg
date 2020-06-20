//信息报送
import React,{Component} from "react";
import {connect} from 'react-redux'
import {Icon,Button,DatePicker,Tooltip,Radio,Divider,message,Row,Col,Modal,Select,Input, Form,Spin,Popconfirm} from 'antd';
const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
import $ from 'jquery'
import moment from 'moment';
import './index.less';
import {getService,postService} from '../../common/fetch';
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
            allData:{},
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
            data1Visible:false,
            data2Visible:false,
            data3Visible:false,
            isEdit:false,
            detail1:{},
            detail2:{},
            spin:false,
            options:[],
            addSameType:null,
        }
    }

    componentDidMount(){
        window.addEventListener('scroll', this.handleScroll);
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo')) 

        let allData = {
            ...userInfo,
            time:moment(new Date()).format('YYYY-MM-DD'),
            month:new Date().getMonth()+1,
        }
        this.setState({allData})
        
    }
    componentWillUnmount(){
        sessionStorage.removeItem('projectName')
    }
    getTree = () => {
        getService(`/workReport/auth/getUnitList/true`,res=>{
            if(res.flag){
                let list = res.data || [];
                this.dealCompany(list)
                this.setState({options:list})
            }
        })
    }
    //递归处理单位
    dealCompany(values){
        values&&values.map((item,index)=>{
            item.value=item.unitId;
            item.label=item.unitName;
            if(item.children){
            this.dealCompany(item.children);
            }
        });
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
    closeData1Modal = () => {
        this.setState({data1Visible:false})
    }

    closeData2Modal = () => {
        this.setState({data2Visible:false,addSameType:null})
    }

    closeData3Modal = () => {
        this.setState({data3Visible:false})
    }

    handleSubmit = (isSubmit=false) => {
        let {allData,list1,list2,list3,list4,list5,list6,tableList3,tableList4,tableList5,tableList6} = this.state;
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        this.props.form.validateFields((error, values) => {
            console.log(values)
            if(!error){
                this.setState({spin:true})
                let deviceInfoList = [...list3,...list4,...list5,...list6],applicationInfoList = [...list1,...list2];
                let body = {
                    ...values,
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

                    curInvestmentPlaceTime:values.curInvestmentPlaceTime?moment(values.curInvestmentPlaceTime).format('YYYY-MM-DD'):'',
                    curInvestmentPlanTime:values.curInvestmentPlanTime?moment(values.curInvestmentPlanTime).format('YYYY-MM-DD'):'',
                    curInvestmentPayTime:values.curInvestmentPayTime?moment(values.curInvestmentPayTime).format('YYYY-MM-DD'):'',
                    curInvestmentPlaceMoney:Number(values.curInvestmentPlaceMoney),
                    curInvestmentPlanMoney:Number(values.curInvestmentPlanMoney),
                    curInvestmentPayMoney:Number(values.curInvestmentPayMoney),

                    addInvestmentMoney:values.addInvestmentMoney?Number(values.addInvestmentMoney):null,
                    addTerminalsNum:values.addTerminalsNum?Number(values.addTerminalsNum):null,
                    addServersNum:values.addServersNum?Number(values.addServersNum):null,
                    ebInvestmentMoney:values.ebInvestmentMoney?Number(values.ebInvestmentMoney):null,
                    ebTerminalsNum:values.ebTerminalsNum?Number(values.ebTerminalsNum):null,
                    ebServersNum:values.ebServersNum?Number(values.ebServersNum):null,

                    //统计周期
                    curReportStartTime:values.curReportStartTime?moment(values.curReportStartTime).format('YYYY-MM-DD'):'',
                    curReportEndTime:values.curReportEndTime?moment(values.curReportEndTime).format('YYYY-MM-DD'):'',
                    appReportStartTime:values.appReportStartTime?moment(values.appReportStartTime).format('YYYY-MM-DD'):'',
                    appReportEndTime:values.appReportEndTime?moment(values.appReportEndTime).format('YYYY-MM-DD'):'',
                    devReportStartTime:values.devReportStartTime?moment(values.devReportStartTime).format('YYYY-MM-DD'):'',
                    devReportEndTime:values.devReportEndTime?moment(values.devReportEndTime).format('YYYY-MM-DD'):'',

                    deviceInfoList:deviceInfoList,
                    applicationInfoList:applicationInfoList,
                    projectName:sessionStorage.getItem('projectName'),
                    
                }
                console.log(body)
                postService('/workReport/infoSubmit/add',body,data=>{
                    if(data.flag){
                        message.success('新增成功')
                        this.setState({spin:false})
                        if(isSubmit){
                            postService(`/workReport/infoSubmit/submit?id=${data.data.id}`,{},data=>{
                                if(data.flag){
                                    message.success('提交成功')
                                }else{
                                    message.error('提交失败')
                                }
                                history.back()
                            })
                        }else{
                            history.back()
                        }
                        
                    }else{
                        this.setState({spin:false})
                        message.error('新增失败')
                    }
                })
            }
        })
    }
    getList1 = (data,isEdit) => {
        let {list1,list2} = this.state;
        if(isEdit){
            let list = []
            if(data.isSm){
                list1.map(item=>{
                    if(item.orderNum === data.orderNum){
                        list.push(data)
                    }else{
                        list.push(item)
                    }
                })
                this.setState({list1:list})
            }else{
                list2.map(item=>{
                    if(item.orderNum === data.orderNum){
                        list.push(data)
                    }else{
                        list.push(item)
                    }
                })
                this.setState({list2:list})
            }
            
        }else{
            if(data.isSm){
                list1.push({...data,orderNum:list1.length+1})
            }else{
                list2.push({...data,orderNum:list2.length+1})
            }
            this.setState({list1,list2})
        }
        
        
    }
    deleteData1 = (data,isSm) => {
        let {list1,list2} = this.state;
        let list = [];
        if(isSm){
            list1.map(item=>{
                if(data.orderNum !== item.orderNum){
                    list.push(item)
                }
            })
            list.map((item,index)=>{item.orderNum = index+1})
            this.setState({list1:list})
        }else{
            list2.map(item=>{
                if(data.orderNum !== item.orderNum){
                    list.push(item)
                }
            })
            list.map((item,index)=>{item.orderNum = index+1})
            this.setState({list2:list})
        }

    }
    editData1 = (data,isSm) => {
        this.setState({detail1:data,isEdit:true,data1Visible:true})
    }

    getList2 = (data,isSix) => {
        console.log(data,isSix)
        let timestamp = new Date().getTime();
        let {list3,list4,list5,list6,tableList3,tableList4,tableList5,tableList6} = this.state;
        if(isSix){
            if(data.isSm){
                list3.push({
                    ...data,
                    timestamp:timestamp,
                    orderNum:list3.length+1,
                    isSm:data.isSm,
                    deviceType:data.productId,
                    manufacturer:data.companyId,
                    model:data.model||'',
                    cpu:data.cpuId,
                    os:data.systemId,
                    num:Number(data.num),
                    remark:data.remark,
                    deviceDetailType:data.typeId,
                    
                })
                let repeatList = tableList3.filter(item=>{return item.productId === data.productId})
                if(repeatList.length){
                    tableList3.map(item=>{
                        if(item.productId === data.productId){
                            item.list.push(
                                {
                                    ...data,
                                    timestamp:timestamp,
                                    orderNum:item.list.length+1,
                                    companyName:data.companyName,
                                    manufacturer:data.companyId,
                                    cpuName:data.cpuName,
                                    systemName:data.systemName,
                                    num:Number(data.num),
                                    remark:data.remark,
                                }
                            )
                        }
                    })
                }else{
                    tableList3.push({
                        productId: data.productId,
                        productName: data.productName,
                        list:[
                            {
                                ...data,
                                orderNum:1,
                                timestamp:timestamp,
                                companyName:data.companyName,
                                manufacturer:data.companyId,
                                cpuName:data.cpuName,
                                systemName:data.systemName,
                                num:Number(data.num),
                                remark:data.remark,
                            }
                        ]
                    })
                }
                this.setState({tableList3,list3})
            }else{
                list5.push({
                    ...data,
                    timestamp:timestamp,
                    orderNum:list5.length+1,
                    isSm:data.isSm,
                    deviceType:data.productId,
                    manufacturer:data.companyId,
                    model:data.model||'',
                    cpu:data.cpuId,
                    os:data.systemId,
                    num:Number(data.num),
                    remark:data.remark,
                    deviceDetailType:data.typeId,
                    
                })
                let repeatList = tableList5.filter(item=>{return item.productId === data.productId})
                if(repeatList.length){
                    tableList5.map(item=>{
                        if(item.productId === data.productId){
                            item.list.push(
                                {
                                    ...data,
                                    timestamp:timestamp,
                                    orderNum:item.list.length+1,
                                    manufacturer:data.companyId,
                                    companyName:data.companyName,
                                    cpuName:data.cpuName,
                                    systemName:data.systemName,
                                    num:Number(data.num),
                                    remark:data.remark,
                                }
                            )
                        }
                    })
                }else{
                    tableList5.push({
                        productId: data.productId,
                        productName: data.productName,
                        list:[
                            {
                                ...data,
                                orderNum:1,
                                timestamp:timestamp,
                                companyName:data.companyName,
                                manufacturer:data.companyId,
                                cpuName:data.cpuName,
                                systemName:data.systemName,
                                num:Number(data.num),
                                remark:data.remark,
                            }
                        ]
                    })
                }
                this.setState({tableList5,list5})
            }
        }else{
            if(data.isSm){
                list4.push({
                    ...data,
                    timestamp:timestamp,
                    orderNum:list4.length+1,
                    isSm:data.isSm,
                    deviceType:data.productId,
                    manufacturer:data.companyId,
                    model:data.model||'',
                    cpu:data.cpuId,
                    os:data.systemId,
                    num:Number(data.num),
                    remark:data.remark,
                    deviceDetailType:data.typeId,
                    
                })
                let repeatList = tableList4.filter(item=>{return item.productId === data.productId})
                if(repeatList.length){
                    tableList4.map(item=>{
                        if(item.productId === data.productId){
                            item.list.push(
                                {
                                    ...data,
                                    timestamp:timestamp,
                                    orderNum:item.list.length+1,
                                    manufacturer:data.companyId,
                                    companyName:data.companyName,
                                    cpuName:data.cpuName,
                                    systemName:data.systemName,
                                    num:Number(data.num),
                                    remark:data.remark,
                                    typeName:data.typeName,
                                }
                            )
                        }
                    })
                }else{
                    tableList4.push({
                        productId: data.productId,
                        productName: data.productName,
                        list:[
                            {
                                ...data,
                                orderNum:1,
                                timestamp:timestamp,
                                companyName:data.companyName,
                                manufacturer:data.companyId,
                                cpuName:data.cpuName,
                                systemName:data.systemName,
                                num:Number(data.num),
                                remark:data.remark,
                                typeName:data.typeName,
                            }
                        ]
                    })
                }
                this.setState({tableList4,list4})
                
                
            }else{
                list6.push({
                    ...data,
                    timestamp:timestamp,
                    orderNum:list6.length+1,
                    isSm:data.isSm,
                    deviceType:data.productId,
                    manufacturer:data.companyId,
                    model:data.model||'',
                    cpu:data.cpuId,
                    os:data.systemId,
                    num:Number(data.num),
                    remark:data.remark,
                    deviceDetailType:data.typeId,
                    
                })
                let repeatList = tableList6.filter(item=>{return item.productId === data.productId})
                if(repeatList.length){
                    tableList6.map(item=>{
                        if(item.productId === data.productId){
                            item.list.push(
                                {
                                    ...data,
                                    timestamp:timestamp,
                                    orderNum:item.list.length+1,
                                    manufacturer:data.companyId,
                                    companyName:data.companyName,
                                    cpuName:data.cpuName,
                                    systemName:data.systemName,
                                    num:Number(data.num),
                                    remark:data.remark,
                                    typeName:data.typeName,
                                }
                            )
                        }
                    })
                }else{
                    tableList6.push({
                        productId: data.productId,
                        productName: data.productName,
                        list:[
                            {
                                ...data,
                                orderNum:1,
                                timestamp:timestamp,
                                companyName:data.companyName,
                                manufacturer:data.companyId,
                                cpuName:data.cpuName,
                                systemName:data.systemName,
                                num:Number(data.num),
                                remark:data.remark,
                                typeName:data.typeName,
                            }
                        ]
                    })
                }
                this.setState({tableList6,list6})
            }
        }
        
        this.setState({data2Visible:false})
    }
    getList3 = data => {
        let {
            list3,list4,//涉密
            list5,list6,//非涉密
            tableList3,tableList4,//涉密
            tableList5,tableList6,//非涉密
        } = this.state;
        let list = [],tableList = [];
        if(data.isSm){
            if(data.optionNum === 6){
                list3.map((item,index)=>{
                    if(item.timestamp === data.timestamp){
                        list.push({
                            ...item,
                            ...data,
                            orderNum:index+1,
                            deviceType:data.productId,
                            manufacturer:data.companyId,
                            model:data.model||'',
                            cpu:data.cpuId,
                            os:data.systemId,
                            num:Number(data.num),
                            remark:data.remark,
                            deviceDetailType:data.typeId,
                        })
                    }else{
                        list.push({
                            ...item,
                            orderNum:index+1,
                        })
                    }
                })
                tableList3.map(item=>{
                    if(item.productId === data.productId){
                        let itemList = []
                        item.list.map((e,index)=>{
                            if(e.timestamp === data.timestamp){
                                itemList.push({
                                    ...e,
                                    ...data,
                                    orderNum:index+1,
                                    deviceType:data.productId,
                                    manufacturer:data.companyId,
                                    model:data.model||'',
                                    cpu:data.cpuId,
                                    os:data.systemId,
                                    num:Number(data.num),
                                    remark:data.remark,
                                    deviceDetailType:data.typeId,
                                })
                            }else{
                                itemList.push({
                                    ...e,
                                    orderNum:index+1,
                                })
                            }
                        })
                        item.list = itemList
                        tableList.push(item)
                    }else{
                        tableList.push(item)
                    }
                })
                this.setState({list3:list,tableList3:tableList})
            }else{
                list4.map((item,index)=>{
                    if(item.timestamp === data.timestamp){
                        list.push({
                            ...item,
                            ...data,
                            orderNum:index+1,
                            deviceType:data.productId,
                            manufacturer:data.companyId,
                            model:data.model||'',
                            cpu:data.cpuId,
                            os:data.systemId,
                            num:Number(data.num),
                            remark:data.remark,
                            deviceDetailType:data.typeId,
                        })
                    }else{
                        list.push({
                            ...item,
                            orderNum:index+1,
                        })
                    }
                })
                tableList4.map(item=>{
                    if(item.productId === data.productId){
                        let itemList = []
                        item.list.map((e,index)=>{
                            if(e.timestamp === data.timestamp){
                                itemList.push({
                                    ...e,
                                    ...data,
                                    orderNum:index+1,
                                    deviceType:data.productId,
                                    manufacturer:data.companyId,
                                    model:data.model||'',
                                    cpu:data.cpuId,
                                    os:data.systemId,
                                    num:Number(data.num),
                                    remark:data.remark,
                                    deviceDetailType:data.typeId,
                                })
                            }else{
                                itemList.push({
                                    ...e,
                                    orderNum:index+1,
                                })
                            }
                        })
                        item.list = itemList
                        tableList.push(item)
                    }else{
                        tableList.push(item)
                    }
                })
                this.setState({list4:list,tableList4:tableList})
            }

        }else{
            if(data.optionNum === 6){
                list5.map((item,index)=>{
                    if(item.timestamp === data.timestamp){
                        list.push({
                            ...item,
                            ...data,
                            deviceType:data.productId,
                            manufacturer:data.companyId,
                            model:data.model||'',
                            cpu:data.cpuId,
                            os:data.systemId,
                            num:Number(data.num),
                            remark:data.remark,
                            deviceDetailType:data.typeId,
                        })
                    }else{
                        list.push({
                            ...item,
                            orderNum:index+1,
                        })
                    }
                })
                tableList5.map(item=>{
                    if(item.productId === data.productId){
                        let itemList = []
                        item.list.map(e=>{
                            if(e.timestamp === data.timestamp){
                                itemList.push({
                                    ...e,
                                    ...data,
                                    deviceType:data.productId,
                                    manufacturer:data.companyId,
                                    model:data.model||'',
                                    cpu:data.cpuId,
                                    os:data.systemId,
                                    num:Number(data.num),
                                    remark:data.remark,
                                    deviceDetailType:data.typeId,
                                })
                            }else{
                                itemList.push({
                                    ...e,
                                    orderNum:index+1,
                                })
                            }
                        })
                        item.list = itemList
                        tableList.push(item)
                    }else{
                        tableList.push(item)
                    }
                })
                this.setState({list5:list,tableList5:tableList})
            }else{
                list6.map((item,index)=>{
                    if(item.timestamp === data.timestamp){
                        list.push({
                            ...item,
                            ...data,
                            deviceType:data.productId,
                            manufacturer:data.companyId,
                            model:data.model||'',
                            cpu:data.cpuId,
                            os:data.systemId,
                            num:Number(data.num),
                            remark:data.remark,
                            deviceDetailType:data.typeId,
                        })
                    }else{
                        list.push({
                            ...item,
                            orderNum:index+1,
                        })
                    }
                })
                tableList6.map(item=>{
                    if(item.productId === data.productId){
                        let itemList = []
                        item.list.map((e,index)=>{
                            if(e.timestamp === data.timestamp){
                                itemList.push({
                                    ...e,
                                    ...data,
                                    deviceType:data.productId,
                                    manufacturer:data.companyId,
                                    model:data.model||'',
                                    cpu:data.cpuId,
                                    os:data.systemId,
                                    num:Number(data.num),
                                    remark:data.remark,
                                    deviceDetailType:data.typeId,
                                })
                            }else{
                                itemList.push({
                                    ...e,
                                    orderNum:index+1,
                                })
                            }
                        })
                        item.list = itemList
                        tableList.push(item)
                    }else{
                        tableList.push(item)
                    }
                })
                this.setState({list6:list,tableList6:tableList})
            }

        }

    }

    editList = (item,optionNum) => {
        let {list3,list4,list5,list6,tableList3,tableList4,tableList5,tableList6} = this.state;
        this.setState({detail2:{...item,optionNum:optionNum},data3Visible:true})
    }

    deleteList= (e,index,isSm,num,timestamp) => {
        let {
            list3,list4,//涉密
            list5,list6,//非涉密
            tableList3,tableList4,//涉密
            tableList5,tableList6,//非涉密
        } = this.state;
        let list = []
        
        if(isSm){
            if(num === 3){
                tableList3.map(item=>{
                    if(item.productId === e.productId){
                        item.list.splice(index,1)
                    }
                })
                list = list3.filter(item=>item.timestamp!==timestamp)
                list.map((item,index)=>{
                    item.orderNum = index+1
                })
                this.setState({list3:list,tableList3})
            }else if(num === 4){
                tableList4.map(item=>{
                    if(item.productId === e.productId){
                        item.list.splice(index,1)
                    }
                })
                list = list4.filter(item=>item.timestamp!==timestamp)
                list.map((item,index)=>{
                    item.orderNum = index+1
                })
                this.setState({list4:list,tableList4})
            }

        }else{
            if(num === 5){
                tableList5.map(item=>{
                    if(item.productId === e.productId){
                        item.list.splice(index,1)
                    }
                })
                list = list5.filter(item=>item.timestamp!==timestamp)
                list.map((item,index)=>{
                    item.orderNum = index+1
                })
                this.setState({list5:list,tableList5})
            }else if(num === 6){
                tableList6.map(item=>{
                    if(item.productId === e.productId){
                        item.list.splice(index,1)
                    }
                })
                list = list6.filter(item=>item.timestamp!==timestamp)
                list.map((item,index)=>{
                    item.orderNum = index+1
                })
                this.setState({list6:list,tableList6})
            }
        }
    } 
    render(){
        console.log(this.state)
        const {allData,list1,list2,list3,list4,tableList3,tableList4,tableList5,tableList6} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
        
        const formItemLayout1 = { labelCol: { span: 0 }, wrapperCol: { span: 22 } };
        const formItemLayout2 = { labelCol: { span: 3 }, wrapperCol: { span: 20 } };
        const formItemLayout3 = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };
        const formItemLayout4 = { labelCol: { span: 4 }, wrapperCol: { span: 18 } };
        const formItemLayout5 = { labelCol: { span: 1 }, wrapperCol: { span: 20 } };
        const formItemLayout6 = { labelCol: { span: 1 }, wrapperCol: { span: 2 } };
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
                            <a onClick={()=>this.editData1(item,true)}>编辑</a>
                            <Divider type="vertical"/>
                            <a onClick={()=>this.deleteData1(item,true)}>删除</a>
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
                            <a onClick={()=>this.editData1(item,false)}>编辑</a>
                            <Divider type="vertical"/>
                            <a onClick={()=>this.deleteData1(item,false)}>删除</a>
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
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                        {
                            tableList3.length?tableList3.map(e=>{
                                return e.list.map((item, index) => {
                                    return (
                                      <tr key={index}>
                                        {index === 0 ? (
                                            <td rowSpan={e.list.length}>
                                                {e.productName}　
                                                <Icon type="plus-circle" onClick={()=>this.setState({addSameType:item,data2Visible:true})} style={{color:'#038EC4',cursor:'pointer'}} />
                                            </td>
                                        ) : null}
                                        <td>{index + 1}</td>
                                        <td>{item.companyName}</td>
                                        <td>{item.cpuName}</td>
                                        <td>{item.systemName}</td>
                                        <td>{item.num}</td>
                                        <td>{item.remark}</td>
                                        <td>
                                            <a onClick={()=>this.editList(item,6)}>编辑</a>　
                                            <a onClick={()=>this.deleteList(e,index,true,3,item.timestamp)}>删除</a>
                                        </td>
                                      </tr>
                                    );
                                  })
                            }):<tr><td colSpan={8}><img src={empty} alt=''/></td></tr>
                        }
                    </tbody>
                     <thead>
                      <tr>
                        <th> </th>
                        <th colSpan="2">类别</th>
                        <th>数量（台/套）</th>
                        <th colSpan="3">备注</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                        {
                            tableList4.length?tableList4.map(e=>{
                                return e.list.map((item, index) => {
                                    return (
                                    <tr key={index}>
                                        {index === 0 ? (
                                        <td rowSpan={e.list.length}>
                                            {e.productName}　
                                            <Icon type="plus-circle" onClick={()=>this.setState({addSameType:item,data2Visible:true})} style={{color:'#038EC4',cursor:'pointer'}} />
                                        </td>
                                        ) : null}
                                        <td>{index + 1}</td>
                                        <td>{item.typeName}</td>
                                        <td>{item.num}</td>
                                        <td colSpan='3'>{item.remark}</td>
                                        <td>
                                            <a onClick={()=>this.editList(item,3)}>编辑</a>　
                                            <a onClick={()=>this.deleteList(e,index,true,4,item.timestamp)}>删除</a>
                                        </td>
                                    </tr>
                                    )
                                })
                            }):<tr><td colSpan={8}><img src={empty} alt=''/></td></tr>
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
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                        {
                            tableList5.length?tableList5.map(e=>{
                                return e.list.map((item, index) => {
                                    return (
                                      <tr key={index}>
                                        {index === 0 ? (
                                          <td rowSpan={e.list.length}>
                                              {e.productName}　
                                              <Icon type="plus-circle" onClick={()=>this.setState({addSameType:item,data2Visible:true})} style={{color:'#038EC4',cursor:'pointer'}} />
                                            </td>
                                        ) : null}
                                        <td>{index + 1}</td>
                                        <td>{item.companyName}</td>
                                        <td>{item.cpuName}</td>
                                        <td>{item.systemName}</td>
                                        <td>{item.num}</td>
                                        <td>{item.remark}</td>
                                        <td>
                                            <a onClick={()=>this.editList(item,6)}>编辑</a>　
                                            <a onClick={()=>this.deleteList(e,index,false,5,item.timestamp)}>删除</a>
                                        </td>
                                      </tr>
                                    );
                                  })
                            }):<tr><td colSpan={8}><img src={empty} alt=''/></td></tr>
                        }
                    </tbody>
                     <thead>
                      <tr>
                        <th> </th>
                        <th colSpan="2">类别</th>
                        <th>数量（台/套）</th>
                        <th colSpan="3">备注</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                        {
                            tableList6.length?tableList6.map(e=>{
                                return e.list.map((item, index) => {
                                    return (
                                    <tr key={index}>
                                        {index === 0 ? (
                                        <td rowSpan={e.list.length}>
                                            {e.productName}　
                                            <Icon type="plus-circle" onClick={()=>this.setState({addSameType:item,data2Visible:true})} style={{color:'#038EC4',cursor:'pointer'}} />
                                        </td>
                                        ) : null}
                                        <td>{index + 1}</td>
                                        <td>{item.typeName}</td>
                                        <td>{item.num}</td>
                                        <td colSpan='3'>{item.remark}</td>
                                        <td>
                                            <a onClick={()=>this.editList(item,3)}>编辑</a>　
                                            <a onClick={()=>this.deleteList(e,index,false,6,item.timestamp)}>删除</a>
                                        </td>
                                    </tr>
                                    )
                                })
                            }):<tr><td colSpan={8}><img src={empty} alt=''/></td></tr>
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
                        <div className='header-item' style={{display: 'flex',justifyContent: 'start'}}>
                            <div className='ant-from-item-head' style={{width:'92px'}}>
                                <label className='ant-form-item-required'>
                                    <span className='ant-form-item-title'>填报单位： </span>
                                </label>
                            </div>
                            <div style={{width:'calc(100% - 140px)'}}>
                                <FormItem {...formItemLayout3} >
                                    {
                                        getFieldDecorator('createUnitName', {
                                            rules: [{
                                                required: true,
                                                max:60,
                                                message:`填报单位为必填项且字数限制60字`
                                            }], initialValue: allData.unitName||'',
                                        })
                                        (<Input style={{width:'100%'}}/>)
                                    }
                                </FormItem>
                            </div>
                        </div>
                        <div className='header-item'>填报人：{allData.userName}</div>
                        <div className='header-item'>时间：{allData.time}</div>
                        <div className='header-item'>
                            <Button type='default' onClick={()=>history.back()}>返回</Button>　
                            <Button type='primary' onClick={()=>this.handleSubmit(false)}>保存</Button>　
                            <Popconfirm title="确定提交吗?" placement="bottom" onConfirm={()=>this.handleSubmit(true)}>
                                <Button type='primary'>提交</Button>　
                            </Popconfirm>
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
                                                                }], initialValue: null,
                                                            })
                                                            (<DatePicker placeholder="请选择启动时间" style={{width:'calc(100% - 24px)'}}/>)
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
                                                                }], initialValue: null,
                                                            })
                                                            (<DatePicker placeholder="请选择完成时间" style={{width:'calc(100% - 24px)'}}/>)
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
                                            }], initialValue: null,
                                        })
                                        (<DatePicker style={{width:'calc(100% - 26px)'}}/>)
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
                                            }], initialValue: null,
                                        })
                                        (<DatePicker style={{width:'calc(100% - 26px)'}}/>)
                                    }
                                </FormItem>
                            </div>
                        </div>
                        <Col span={8}>
                            <div className='ant-from-item-head'>
                                <label>
                                    <span className='ant-form-item-title ant-form-item-required'>年度计划投资到位 </span>
                                </label>
                                <Tooltip placement="right" title={'说明：指统计时间区间内安可替代工程项目资金到账。如在统计时间区间内分批到账，‘日期’填写最后一批到账时间，‘金额’填写统计时间区间内到账金额总和。'}>
                                    <Icon type="exclamation-circle" style={{color:'#666'}}/>
                                </Tooltip>
                            </div>
                            <FormItem label='日期' {...formItemLayout4} >
                                {
                                    getFieldDecorator('curInvestmentPlaceTime', {
                                        rules: [{
                                            required: true,
                                            message:'日期为必填项'
                                        }], initialValue: null,
                                    })
                                    (<DatePicker style={{width:'60%'}}/>)
                                }
                            </FormItem>
                            <FormItem label='金额' {...formItemLayout4} >
                                {
                                    getFieldDecorator('curInvestmentPlaceMoney', {
                                        rules: [{
                                            required: true,
                                            validator:(rule,value,callback)=>limitMoney(rule,value,callback)
                                        }], initialValue: null,
                                    })
                                    (<Input style={{width:'60%'}} addonAfter="万元"/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <div className='ant-from-item-head'>
                                <label>
                                    <span className='ant-form-item-title ant-form-item-required'>年度计划投资完成 </span>
                                </label>
                                <Tooltip placement="right" title={'说明：指签订项目采购合同。如在统计时间区间内分批签订，‘日期’填写最后一次合同签订时间，‘金额’填写统计时间区间内签订合同金额总和。'}>
                                    <Icon type="exclamation-circle" style={{color:'#666'}}/>
                                </Tooltip>
                            </div>
                            <FormItem label='日期' {...formItemLayout4} >
                                {
                                    getFieldDecorator('curInvestmentPlanTime', {
                                        rules: [{
                                            required: true,
                                            message:'日期为必填项'
                                        }], initialValue: null,
                                    })
                                    (<DatePicker style={{width:'60%'}}/>)
                                }
                            </FormItem>
                            <FormItem label='金额' {...formItemLayout4} >
                                {
                                    getFieldDecorator('curInvestmentPlanMoney', {
                                        rules: [{
                                            required: true,
                                            validator:(rule,value,callback)=>limitMoney(rule,value,callback)
                                        }], initialValue: null,
                                    })
                                    (<Input style={{width:'60%'}} addonAfter="万元"/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <div className='ant-from-item-head'>
                                <label>
                                    <span className='ant-form-item-title ant-form-item-required'>年度计划投资拨付 </span>
                                </label>
                                <Tooltip placement="right" title={'说明：指向工程承建、监理等单位拨付款项。如在统计时间区间内分批拨付，‘日期’填写最后一次款项拨付时间，‘金额’填写统计时间区间内拨付款项金额总和。'}>
                                    <Icon type="exclamation-circle" style={{color:'#666'}}/>
                                </Tooltip>
                            </div>
                            <FormItem label='日期' {...formItemLayout4} >
                                {
                                    getFieldDecorator('curInvestmentPayTime', {
                                        rules: [{
                                            required: true,
                                            message:'日期为必填项'
                                        }], initialValue: null,
                                    })
                                    (<DatePicker style={{width:'60%'}}/>)
                                }
                            </FormItem>
                            <FormItem label='金额' {...formItemLayout4} >
                                {
                                    getFieldDecorator('curInvestmentPayMoney', {
                                        rules: [{
                                            required: true,
                                            validator:(rule,value,callback)=>limitMoney(rule,value,callback)
                                        }], initialValue: null,
                                    })
                                    (<Input style={{width:'60%'}} addonAfter="万元"/>)
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
                                            }], initialValue: '',
                                        })
                                        (<TextArea rows={4} style={{width:'100%'}}/>)
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
                                        }], initialValue: null,
                                    })
                                    (<DatePicker style={{width:'calc(100% - 26px)'}}/>)
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
                                        }], initialValue: null,
                                    })
                                    (<DatePicker style={{width:'calc(100% - 26px)'}}/>)
                                }
                            </FormItem>
                        </div>
                    </div>
                    <div style={{paddingTop:'20px'}}><Button type='primary' onClick={()=>this.setState({data1Visible:true,isEdit:false})}>新增应用系统</Button></div>
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
                                            }], initialValue: null,
                                        })
                                        (<DatePicker style={{width:'calc(100% - 26px)'}}/>)
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
                                            }], initialValue: null,
                                        })
                                        (<DatePicker style={{width:'calc(100% - 26px)'}}/>)
                                    }
                                </FormItem>
                            </div>
                        </div>
                        <div style={{padding:'10px 0px'}}>
                            <Button type='primary' onClick={()=>this.setState({data2Visible:true})}>新增设备</Button>
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
                    </div>
                    <Row style={{padding:'30px 0px 10px'}}>
                        <Col span={24}>
                            <FormItem {...formItemLayout3} >
                                {
                                    getFieldDecorator('importantItem', {
                                        rules: [{
                                            required: false,
                                            validator:(rule,value,callback)=>limitWordNumber(rule,value,callback,5000)
                                        }], initialValue: '',
                                    })
                                    (<TextArea rows={5} placeholder='说明：落实经费情况，好的经验做法等，推进工作中遇到的重要情况，以及本地区本部门主要领导同志或主要分管领导同志批示等，仅填写奔重汽内的相关情况，限制5000字' style={{width:'100%'}}/>)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <div className='step-name'>
                        <span>六、备注</span>　
                    </div>
                    <Row style={{padding:'10px 0px'}}>
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
                                        }], initialValue: '',
                                    })
                                    (<Input style={{width:'60%',marginRight:'12px'}} addonAfter="万元"/>)
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
                                            required: false,
                                            validator:(rule,value,callback)=>limitNumber(rule,value,callback)
                                        }], initialValue: '',
                                    })
                                    (<Input style={{width:'60%',marginRight:'12px'}} addonAfter="台"/>)
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
                                            required: false,
                                            validator:(rule,value,callback)=>limitNumber(rule,value,callback)
                                        }], initialValue: '',
                                    })
                                    (<Input style={{width:'60%',marginRight:'12px'}} addonAfter="台"/>)
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
                                        }], initialValue: '',
                                    })
                                    (<TextArea rows={5} style={{width:'100%'}}/>)
                                }
                            </FormItem>
                        </Col>
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
                                        }], initialValue: '',
                                    })
                                    (<TextArea rows={5} placeholder='说明：请填写推进工作中，涉密领域遇到的主要困难和问题，包括出现问题的产品、生产厂商等，以及对全面替代工作的意见建议。' style={{width:'100%'}}/>)
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
                                        }], initialValue: '',
                                    })
                                    (<TextArea rows={5} placeholder='说明：请填写推进工作中，法涉密领域遇到的主要困难和问题，包括出现问题的产品、生产厂商等，以及对全面替代工作的意见建议。' style={{width:'100%'}}/>)
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
                                        }], initialValue: '',
                                    })
                                    (<Input style={{width:'100%'}}/>)
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
                                        }], initialValue: '',
                                    })
                                    (<Input style={{width:'100%'}}/>)
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
                                        }], initialValue: '',
                                    })
                                    (<Input style={{width:'100%'}}/>)
                                }
                            </FormItem>
                        </Col>
                        
                    </Row>            
                </Form>
                <Modal
                    title={this.state.isEdit?'编辑应用系统':'新增应用系统'}
                    visible={this.state.data1Visible}
                    width={600}
                    footer={null}
                    onCancel={()=>this.setState({data1Visible:false})}
                    destroyOnClose={true}
                    afterClose={()=>this.setState({data1Visible:false})}
                >
                    <Data1 
                        isEdit={this.state.isEdit}
                        detail1={this.state.detail1}
                        closeData1Modal={this.closeData1Modal} 
                        getList1={this.getList1}
                    />
                </Modal>
                <Modal
                    title='新增设备'
                    visible={this.state.data2Visible}
                    width={1000}
                    footer={null}
                    onCancel={this.closeData2Modal}
                    destroyOnClose={true}
                    afterClose={this.closeData2Modal}
                >
                    <Data2 closeData2Modal={this.closeData2Modal} addSameType={this.state.addSameType} getList2={this.getList2}/>
                </Modal>
                <Modal
                    title='编辑设备'
                    visible={this.state.data3Visible}
                    width={1000}
                    footer={null}
                    onCancel={()=>this.setState({data3Visible:false})}
                    destroyOnClose={true}
                    afterClose={()=>this.setState({data3Visible:false})}
                >
                    <EditData2 
                        closeData3Modal={this.closeData3Modal} 
                        getList3={this.getList3}
                        detail2={this.state.detail2}
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
        let {detail1,isEdit} = this.props;
        if(isEdit){
            this.props.form.setFieldsValue({
                systemName:detail1.systemName,
                isSm:detail1.isSm,
                startTime:moment(detail1.startTime),
                finishTime:detail1.finishTime?moment(detail1.finishTime):null,
            })
        }
    }
    handleSubmit = () => {
        let {detail1,isEdit} = this.props;
        this.props.form.validateFields((error, values) => {
            if(!error){
                let body = {
                    ...detail1,
                    ...values,
                    startTime:moment(values.startTime).format('YYYY-MM-DD'),
                    finishTime:values.finishTime?moment(values.finishTime).format('YYYY-MM-DD'):'',
                }
                this.props.getList1(body,isEdit)
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
                                    validator:(rule,value,callback)=>limitStr(rule,value,callback,'系统名称')
                                }], initialValue: '',
                            })
                            (<Input style={{width:'100%'}}/>)
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
                                <Radio.Group disabled={this.props.isEdit}>
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
                            (<DatePicker style={{width:'100%'}}/>)
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

@Form.create()
class Data2 extends Component{
    constructor(props){
        super(props);
        this.state={
            productList:[],
            companyList:[],
            cpuList:[],
            systemList:[],
            typeList:[],
            tableList1:[],
            tableList2:[],
            shortData:{},
            isOptionSix:true,
            productName:'',
            isSm:true,
        }
    }
    componentDidMount(){
        this.getProductList()
        // this.getChildList(1)
    }
    //产品分类
    getProductList = () => {
        getService(`/workReport/infoSubmit/getConfigByConfigType?configType=1`,res=>{
            if(res.flag){
                this.setState({productList:res.data},()=>{
                    if(this.props.addSameType){
                        let {addSameType} = this.props;
                        console.log(this.props.addSameType)
                        this.props.form.setFieldsValue({
                            productId:addSameType.productId
                        })
                        this.getChildList(addSameType.productId)
                        this.setState({
                            productName:addSameType.productName,
                            isSm:addSameType.isSm,
                            shortData:{
                                productId:addSameType.productId,
                                productName:addSameType.productName,
                                isSm:addSameType.isSm
                            }
                        })
                    }
                })
            }
        })
    }
    //子菜单
    getChildList = (type,isChange=false) => {
        getService(`/workReport/infoSubmit/getChildConfig?parentKeyId=${type}`,res=>{
            if(res.flag){
                let list = res.data;
                let productList = [],companyList = [],cpuList = [],systemList = [],typeList = [];
                list.map(item=>{
                    if(item.configType === '2'){//CPU
                        cpuList = item.tbPrjConfigInfos;
                    }else if(item.configType === '3'){//生产厂商
                        companyList = item.tbPrjConfigInfos;
                    }else if(item.configType === '4'){//操作系统
                        systemList = item.tbPrjConfigInfos;
                    }else if(item.configType === '5'){//类别
                        typeList = item.tbPrjConfigInfos;
                    }
                    
                })
                this.setState({
                    companyList,
                    cpuList,
                    systemList,
                    typeList,
                    isOptionSix:list.length>1
                },()=>{
                    if(isChange){
                        if(list.length>1){
                            this.props.form.setFieldsValue({
                                companyId:'',
                                cpuId:'',
                                systemId:'',
                                model:'',
                                num:null,
                                remark:'',
                            })
                        }else{
                            this.props.form.setFieldsValue({
                                typeId:'',
                                num:null,
                                remark:'',
                            })
                        }
                    }
                })
            }
        })
    }
    onProductChange = (e,data) => {
        let option = data.props
        console.log(data)
        let {productList,tableList1,tableList2,shortData} = this.state;
        
        this.setState({
            productName:option.children,
            isSm:option.className==='yes'?true:false,
            shortData:{productId:option.value,productName:option.children,isSm:option.className==='yes'?true:false}})
        this.getChildList(e,true)
        
    }
    onCompanyChange = (e,data) => {
        let option = data.props
        let {shortData} = this.state;
        shortData.companyId = option.value;
        shortData.companyName = option.children;

        this.setState({shortData})
    }
    onCpuChange = (e,data) => {
        let option = data.props
        let {shortData} = this.state;
        shortData.cpuId = option.value;
        shortData.cpuName = option.children;
        this.setState({shortData})
    }
    onSystemChange = (e,data) => {
        let option = data.props
        let {shortData} = this.state;
        shortData.systemId = option.value;
        shortData.systemName = option.children;
        this.setState({shortData})
        
    }
    onTypeChange = (e,data) => {
        let option = data.props
        let {shortData} = this.state;
        shortData.typeId = option.value;
        shortData.typeName = option.children;
        this.setState({shortData})
    }
   
    handleSubmit = () => {
        // e.preventDefault;
        let {shortData,isOptionSix} = this.state;
        this.props.form.validateFields((error, values) => {
            if(!error){
                let body = {...values,...shortData}
                this.props.getList2(body,isOptionSix)
            }
        })
    }
    render(){
        const {
            productList,
            companyList,
            cpuList,
            systemList,
            typeList,
            isOptionSix,
            productName,
            isSm
        } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
        const formItemLayout2 = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
        return(
            <div>
                <Form>
                   
                    <Row>
                        <div><label><span className='ant-form-item-title ant-form-item-required'>产品分类：</span></label></div>
                        <Col span={8}>
                            <FormItem  {...formItemLayout} >
                                {
                                    getFieldDecorator('productId', {
                                        rules: [{
                                            required: true,
                                            message:'产品分类为必填项'
                                        }],
                                        initialValue: '',
                                    })
                                    (
                                        <Select onChange={this.onProductChange}>
                                            {productList.map(item=>{return <Option key={item.id} className={item.isSm?'yes':'no'} value={item.id}>{item.content}</Option>})}
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    {
                        isSm?
                        isOptionSix?
                        <div className='writeDesp'>填写本次采购的{productName}<span className='color'>涉密</span>相关信息，在“生产厂商”、“CPU芯片”、“操作系统”内选择相应选项，并补充填写“型号”、“数量”、“备注”。如果没有则不填</div>:
                        <div className='writeDesp'>填写本次采购的{productName}<span className='color'>涉密</span>相关信息，在“类别”内选择相应选项，并补充填写“数量”、“备注”。如果没有则不填</div>:
                        isOptionSix?
                        <div className='writeDesp'>填写本次采购的{productName}<span className='color'>非涉密</span>相关信息，在“生产厂商”、“CPU芯片”、“操作系统”内选择相应选项，并补充填写“型号”、“数量”、“备注”。如果没有则不填</div>:
                        <div className='writeDesp'>填写本次采购的{productName}<span className='color'>非涉密</span>相关信息，在“类别”内选择相应选项，并补充填写“数量”、“备注”。如果没有则不填</div>
                    }
                    {
                        isOptionSix?
                        <Row>
                            <Col span={8}>
                                <div><label><span className='ant-form-item-title ant-form-item-required'>生产厂商:</span></label></div>
                                <FormItem {...formItemLayout} >
                                    {
                                        getFieldDecorator('companyId', {
                                            rules: [{
                                                required: true,
                                                message:'生产厂商为必填项'
                                            }],
                                            initialValue: '',
                                        })
                                        (
                                            <Select onChange={this.onCompanyChange}>
                                                {companyList.map(item=>{return <Option key={item.id} value={item.id}>{item.content}</Option>})}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <div><label><span className='ant-form-item-title'>型号:</span></label></div>
                                <FormItem {...formItemLayout} >
                                    {
                                        getFieldDecorator('model', {
                                            rules: [{
                                                required: false,
                                                max:60,
                                                message:'型号字数限制60字'
                                            }],
                                            initialValue: '',
                                        })
                                        (<Input style={{width:'100%'}}/>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <div><label><span className='ant-form-item-title ant-form-item-required'>CPU芯片:</span></label></div>
                                <FormItem {...formItemLayout} >
                                    {
                                        getFieldDecorator('cpuId', {
                                            rules: [{
                                                required: true,
                                                message:'CPU芯片为必填项'
                                            }],
                                            initialValue: '',
                                        })
                                        (
                                            <Select onChange={this.onCpuChange}>
                                                {cpuList.map(item=>{return <Option key={item.id} value={item.id}>{item.content}</Option>})}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <div><label><span className='ant-form-item-title ant-form-item-required'>操作系统:</span></label></div>
                                <FormItem {...formItemLayout} >
                                    {
                                        getFieldDecorator('systemId', {
                                            rules: [{
                                                required: true,
                                                message:'操作系统为必填项'
                                            }],initialValue: '',
                                        })
                                        (
                                            <Select onChange={this.onSystemChange}>
                                                {systemList.map(item=>{return <Option key={item.id} value={item.id}>{item.content}</Option>})}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <div><label><span className='ant-form-item-title ant-form-item-required'>数量(台/套):</span></label></div>
                                <FormItem {...formItemLayout} >
                                    {
                                        getFieldDecorator('num', {
                                            rules: [{
                                                required: false,
                                                validator:(rule,value,callback)=>limitNumber(rule,value,callback)
                                            }], 
                                            initialValue:null,
                                        })
                                        (<Input style={{width:'100%'}}/>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <div><label><span className='ant-form-item-title'>备注:</span></label></div>
                                <FormItem {...formItemLayout} >
                                    {
                                        getFieldDecorator('remark', {
                                            rules: [{
                                                required: false,
                                                max:60,
                                                message:'备注字数限制60字'
                                                
                                            }],initialValue: '',
                                        })
                                        (<Input style={{width:'100%'}}/>)
                                    }
                                </FormItem>
                            </Col>
                        </Row>:
                        <Row>
                        <Col span={8}>
                            <div><label><span className='ant-form-item-title ant-form-item-required'>类别:</span></label></div>
                            <FormItem {...formItemLayout} >
                                {
                                    getFieldDecorator('typeId', {
                                        rules: [{
                                            required: true,
                                            message:'类别为必填项'
                                        }],
                                        initialValue: '',
                                    })
                                    (
                                        <Select onChange={this.onTypeChange}>
                                            {typeList.map(item=>{return <Option key={item.id} value={item.id}>{item.content}</Option>})}
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <div><label><span className='ant-form-item-title ant-form-item-required'>数量(台/套):</span></label></div>
                            <FormItem {...formItemLayout} >
                                {
                                    getFieldDecorator('num', {
                                        rules: [{
                                            required: false,
                                            validator:(rule,value,callback)=>limitNumber(rule,value,callback)
                                        }], 
                                        initialValue: '',
                                    })
                                    (<Input style={{width:'100%'}}/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <div><label><span className='ant-form-item-title'>备注:</span></label></div>
                            <FormItem {...formItemLayout} >
                                {
                                    getFieldDecorator('remark', {
                                        rules: [{
                                            required: false,
                                            max:60,
                                            message:'备注字数限制60字'
                                            
                                        }],initialValue: '',
                                    })
                                    (<Input style={{width:'100%'}}/>)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                        
                    }
                    <div style={{textAlign:'center',padding:'16px 0'}}>
                        <Button onClick={() => this.props.closeData2Modal()}>取消</Button>　　
                        <Button type='primary' onClick={this.handleSubmit}>确定</Button>
                    </div>
                </Form>
            </div>
        )
    }
}
@Form.create()
class EditData2 extends Component{
    constructor(props){
        super(props);
        this.state={
            productList:[],
            companyList:[],
            cpuList:[],
            systemList:[],
            typeList:[],
            tableList1:[],
            tableList2:[],
            shortData:{},
            isOptionSix:true,
            productName:'',
            isSm:true,
        }
    }
    componentWillMount(){
        let {detail2} = this.props;
        console.log(detail2)
        this.setState({
            isOptionSix:detail2.optionNum===6,
            isSm:detail2.isSm,
            productName:detail2.productName,

        })
    }
    componentDidMount = async() => {
        let {detail2} = this.props;
        await this.getProductList()
        await this.getChildList(detail2.productId)
        if(detail2.optionNum===3){
            await this.props.form.setFieldsValue({
                productId:detail2.productId,
                typeId:detail2.typeId,
                model:detail2.model,
                num:String(detail2.num),
                remark:detail2.remark,
            })
        }else{
            this.props.form.setFieldsValue({
                productId:detail2.productId,
                companyId:detail2.companyId,
                cpuId:detail2.cpuId,
                systemId:detail2.systemId,
                model:detail2.model,
                num:String(detail2.num),
                remark:detail2.remark,
            })
        }
        
    }
    //产品分类
    getProductList = () => {
        getService(`/workReport/infoSubmit/getConfigByConfigType?configType=1`,res=>{
            if(res.flag){
                this.setState({productList:res.data})
            }
        })
    }
    //子菜单
    getChildList = (type,isChange=false) => {
        getService(`/workReport/infoSubmit/getChildConfig?parentKeyId=${type}`,res=>{
            if(res.flag){
                let list = res.data;
                let productList = [],companyList = [],cpuList = [],systemList = [],typeList = [];
                list.map(item=>{
                    if(item.configType === '2'){//CPU
                        cpuList = item.tbPrjConfigInfos;
                    }else if(item.configType === '3'){//生产厂商
                        companyList = item.tbPrjConfigInfos;
                    }else if(item.configType === '4'){//操作系统
                        systemList = item.tbPrjConfigInfos;
                    }else if(item.configType === '5'){//类别
                        typeList = item.tbPrjConfigInfos;
                    }
                    
                })
                this.setState({
                    companyList,
                    cpuList,
                    systemList,
                    typeList,
                    isOptionSix:list.length>1
                },()=>{
                    if(isChange){
                        if(list.length>1){
                            this.props.form.setFieldsValue({
                                companyId:'',
                                cpuId:'',
                                systemId:'',
                                model:'',
                                num:null,
                                remark:'',
                            })
                        }else{
                            this.props.form.setFieldsValue({
                                typeId:'',
                                num:null,
                                remark:'',
                            })
                        }
                    }
                })
            }
        })
    }
    onProductChange = (e,data) => {
        let option = data.props
        console.log(data)
        let {productList,tableList1,tableList2,shortData} = this.state;
        this.setState({shortData:{productId:option.value,productName:option.children,isSm:option.className==='yes'?true:false}})
        this.getChildList(e,true)
    }
    onCompanyChange = (e,data) => {
        let option = data.props
        let {shortData} = this.state;
        shortData.companyId = option.value;
        shortData.companyName = option.children;

        this.setState({shortData})
    }
    onCpuChange = (e,data) => {
        let option = data.props
        let {shortData} = this.state;
        shortData.cpuId = option.value;
        shortData.cpuName = option.children;
        this.setState({shortData})
    }
    onSystemChange = (e,data) => {
        let option = data.props
        let {shortData} = this.state;
        shortData.systemId = option.value;
        shortData.systemName = option.children;
        this.setState({shortData})
        
    }
    onTypeChange = (e,data) => {
        let option = data.props
        let {shortData} = this.state;
        shortData.typeId = option.value;
        shortData.typeName = option.children;
        this.setState({shortData})
    }
   
    handleSubmit = () => {
        let {shortData} = this.state;
        let {detail2} = this.props;
        this.props.form.validateFields((error, values) => {
            if(!error){
                let body = {...detail2,...values,...shortData,num:Number(values.num)}
                this.props.getList3(body)
                this.props.closeData3Modal()
            }
        })
    }
    render(){
        const {
            productList,
            companyList,
            cpuList,
            systemList,
            typeList,
            isOptionSix,
            productName,
            isSm
        } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
        const formItemLayout2 = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
        return(
            <div>
                <Form>
                   
                    <Row>
                        <div><label><span className='ant-form-item-title ant-form-item-required'>产品分类：</span></label></div>
                        <Col span={8}>
                            <FormItem  {...formItemLayout} >
                                {
                                    getFieldDecorator('productId', {
                                        rules: [{
                                            required: true,
                                            message:'产品分类为必填项'
                                        }],
                                        initialValue: '',
                                    })
                                    (
                                        <Select disabled onChange={this.onProductChange}>
                                            {productList.map(item=>{return <Option key={item.id} className={item.isSm?'yes':'no'} value={item.id}>{item.content}</Option>})}
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    {
                        isSm?
                        isOptionSix?
                        <div className='writeDesp'>填写本次采购的{productName}<span className='color'>涉密</span>相关信息，在“生产厂商”、“CPU芯片”、“操作系统”内选择相应选项，并补充填写“型号”、“数量”、“备注”。如果没有则不填</div>:
                        <div className='writeDesp'>填写本次采购的{productName}<span className='color'>涉密</span>相关信息，在“类别”内选择相应选项，并补充填写“数量”、“备注”。如果没有则不填</div>:
                        isOptionSix?
                        <div className='writeDesp'>填写本次采购的{productName}<span className='color'>非涉密</span>相关信息，在“生产厂商”、“CPU芯片”、“操作系统”内选择相应选项，并补充填写“型号”、“数量”、“备注”。如果没有则不填</div>:
                        <div className='writeDesp'>填写本次采购的{productName}<span className='color'>非涉密</span>相关信息，在“类别”内选择相应选项，并补充填写“数量”、“备注”。如果没有则不填</div>
                    }
                    {
                        isOptionSix?
                        <Row>
                            <Col span={8}>
                                <div><label><span className='ant-form-item-title ant-form-item-required'>生产厂商:</span></label></div>
                                <FormItem {...formItemLayout} >
                                    {
                                        getFieldDecorator('companyId', {
                                            rules: [{
                                                required: true,
                                                message:'生产厂商为必填项'
                                            }],
                                            initialValue: '',
                                        })
                                        (
                                            <Select onChange={this.onCompanyChange}>
                                                {companyList.map(item=>{return <Option key={item.id} value={item.id}>{item.content}</Option>})}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <div><label><span className='ant-form-item-title'>型号:</span></label></div>
                                <FormItem {...formItemLayout} >
                                    {
                                        getFieldDecorator('model', {
                                            rules: [{
                                                required: false,
                                                max:60,
                                                message:'型号字数限制60字'
                                            }],
                                            initialValue: '',
                                        })
                                        (<Input style={{width:'100%'}}/>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <div><label><span className='ant-form-item-title ant-form-item-required'>CPU芯片:</span></label></div>
                                <FormItem {...formItemLayout} >
                                    {
                                        getFieldDecorator('cpuId', {
                                            rules: [{
                                                required: true,
                                                message:'CPU芯片为必填项'
                                            }],
                                            initialValue: '',
                                        })
                                        (
                                            <Select onChange={this.onCpuChange}>
                                                {cpuList.map(item=>{return <Option key={item.id} value={item.id}>{item.content}</Option>})}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <div><label><span className='ant-form-item-title ant-form-item-required'>操作系统:</span></label></div>
                                <FormItem {...formItemLayout} >
                                    {
                                        getFieldDecorator('systemId', {
                                            rules: [{
                                                required: true,
                                                message:'操作系统为必填项'
                                            }],initialValue: '',
                                        })
                                        (
                                            <Select onChange={this.onSystemChange}>
                                                {systemList.map(item=>{return <Option key={item.id} value={item.id}>{item.content}</Option>})}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <div><label><span className='ant-form-item-title ant-form-item-required'>数量(台/套):</span></label></div>
                                <FormItem {...formItemLayout} >
                                    {
                                        getFieldDecorator('num', {
                                            rules: [{
                                                required: true,
                                                validator:(rule,value,callback)=>limitNumber(rule,value,callback)
                                            }], 
                                            initialValue:null,
                                        })
                                        (<Input style={{width:'100%'}}/>)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <div><label><span className='ant-form-item-title'>备注:</span></label></div>
                                <FormItem {...formItemLayout} >
                                    {
                                        getFieldDecorator('remark', {
                                            rules: [{
                                                required: false,
                                                max:60,
                                                message:'备注字数限制60字'
                                                
                                            }],initialValue: '',
                                        })
                                        (<Input style={{width:'100%'}}/>)
                                    }
                                </FormItem>
                            </Col>
                        </Row>:
                        <Row>
                        <Col span={8}>
                            <div><label><span className='ant-form-item-title ant-form-item-required'>类别:</span></label></div>
                            <FormItem {...formItemLayout} >
                                {
                                    getFieldDecorator('typeId', {
                                        rules: [{
                                            required: true,
                                            message:'类别为必填项'
                                        }],
                                        initialValue: '',
                                    })
                                    (
                                        <Select onChange={this.onTypeChange}>
                                            {typeList.map(item=>{return <Option key={item.id} value={item.id}>{item.content}</Option>})}
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <div><label><span className='ant-form-item-title ant-form-item-required'>数量(台/套):</span></label></div>
                            <FormItem {...formItemLayout} >
                                {
                                    getFieldDecorator('num', {
                                        rules: [{
                                            required: true,
                                            validator:(rule,value,callback)=>limitNumber(rule,value,callback)
                                        }], 
                                        initialValue: '',
                                    })
                                    (<Input style={{width:'100%'}}/>)
                                }
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <div><label><span className='ant-form-item-title'>备注:</span></label></div>
                            <FormItem {...formItemLayout} >
                                {
                                    getFieldDecorator('remark', {
                                        rules: [{
                                            required: false,
                                            max:60,
                                            message:'备注字数限制60字'
                                            
                                        }],initialValue: '',
                                    })
                                    (<Input style={{width:'100%'}}/>)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                        
                    }
                    
                    <div style={{textAlign:'center',padding:'16px 0'}}>
                        <Button onClick={() => this.props.closeData3Modal()}>取消</Button>　　
                        <Button type='primary' onClick={this.handleSubmit}>确定</Button>
                    </div>

                </Form>
            </div>
        )
    }
}




