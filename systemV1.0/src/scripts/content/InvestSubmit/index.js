//信息报送
import React,{Component} from "react";
import {connect} from 'react-redux'
import { 
    Icon,Button,Menu,DatePicker,
    TimePicker,LocaleProvider,Calendar,
    ConfigProvider,Row,Col,InputNumber,
    Modal,Table,Select,Input, Form, Tooltip,
    Empty,message,Divider,Popconfirm,Spin
} from 'antd';
const { Option } = Select;
const FormItem = Form.Item;
import moment from 'moment';
import {limitStr} from '../../common/checkForm'
import {getService,postService,getExportExcelService} from '../../common/fetch'
import './index.less';
@connect(
    state => ({
        state: state,
    }),
    dispatch => ({
        
    })
)
export default class List extends Component{
    constructor(props){
        super(props);
        this.state={
            addModal:false,
            editModal:false,
            exportModal:false,
            list:[],
            value:'',
            PageSize: 10, //每页十条数据
            current: 1, //当前页
            total: 0,//查询的总数量
            params:{},//搜索参数
            search:'',
            detail:{},
            spin:true,
            data:[],
            searchData:[]
            
        }
    }

    componentDidMount(){
        document.addEventListener('keydown',this.onkeydown);
        this.getList(1,10)
        this.getTree()
        
    }
    getList = (page, pageSize,params='') => {
        this.setState({spin:true})
        getService(`/workReport/investment/getList/${page}/${pageSize}?${params}`,res=>{
            if(res.flag){
                this.setState({list:res.data.investments,total:res.data.count,spin:false})
            }
        })
    }
    getTree = () => {
        let {data,searchData} = this.state;
        getService(`/workReport/auth/getUnitList/false`,res=>{
            if(res.flag){
                let list = res.data || [];
                data.push(...list)
                searchData.push(...list)
                this.setState({data,searchData})
            }
        })
    }
    
    getAddData = data => {
        let {PageSize,search} = this.state
        postService(`/workReport/investment/add`,data,res=>{
            if(res.flag){
                message.success('新增成功')
                this.setState({ current: 1,addModal:false},()=>{
                    this.getList(1,PageSize,search)
                })
            }else{
                message.error('新增失败')
            }
        })
    }

    getEditData = data => {
        let {PageSize,search} = this.state
        postService(`/workReport/investment/update`,data,res=>{
            if(res.flag){
                message.success('编辑成功')
                this.setState({ current: 1,editModal:false},()=>{
                    this.getList(1,PageSize,search)
                })
            }else{
                message.error('编辑失败')
            }
        })
    }

    editData = data => {
        this.setState({detail:data,editModal:true})
    }

    submitData = data => {
        let {current,PageSize,search} = this.state
        postService(`/workReport/investment/submit?id=${data.id}`,{},res=>{
            if(res.flag){
                message.success('提交成功')
                this.getList(current,PageSize,search)
            }else{
                message.error('提交失败')
            }
        })
    }

    deleteData = data => {
        let {current,PageSize,search} = this.state
        postService(`/workReport/investment/delete?id=${data.id}`,{},res=>{
            if(res.flag){
                message.success('删除成功')
                this.getList(current,PageSize,search)
            }else{
                message.error('删除失败')
            }
        })
    }

    lookData = data => {
        this.setState({detail:data,detailModal:true})
    }

    setSearch = (isRefresh=false) => {//参数拼接
        let {params,current,PageSize} = this.state;
        let search = '';
        for(let key in params){
            if(params[key]){
                search = search + `${key}=${params[key]}&`
            }
        }
        this.setState({search:search.substring(0, search.length - 1)},()=>{
            if(isRefresh){
                this.getList(current,PageSize,search)
            }
        })
    }
    onkeydown = (e)=>{
        let {search,current,PageSize} = this.state;
        if (e.keyCode === 13) {
            this.getList(current,PageSize,search)
        }
    }
    handleSearch = value => {
        if (value) {
          fetch(value, data => this.setState({ data }));
        } else {
          this.setState({ data: [] });
        }
    };
    

    handleChange = e => {
        let {params} = this.state;
        params.createUnitName = e.target.value;
        this.setState({params},()=>{
            this.setSearch()
        })
    }
    handlePersonChange = e => {//填表人
        let {params} = this.state;
        params.writeUserName = e.target.value;
        this.setState({params},()=>{
            this.setSearch()
        })
    }
    handleDateChange = e => {//审批日期
        let {params} = this.state;
        params.approvalDate = e ? moment(e).format('YYYY-MM-DD'):''
        this.setState({params},()=>{
            this.setSearch(true)
        })
    }
    handleStatusChange = e => {
        let {params} = this.state;
        params.status = e;
        this.setState({params},()=>{
            this.setSearch(true)
        })
    }
    closeModal = () => {
        this.setState({addModal:false,exportModal:false,editModal:false,detailModal:false})
    }
    onPageSizeChange = (current, pageSize) => {
        let {search} = this.state;
        this.setState({ current: 1, PageSize: pageSize  },()=>{
            this.getList(1,pageSize,search)
        })
    }
    changePage = (page, pageSize) => {//跳转对应的第几页触发的事件
        let {search} = this.state;
        this.setState({ current: page, PageSize: pageSize },()=>{
            this.getList(page,pageSize,search)
        })
    }
    render(){
        const {list,searchData} = this.state;
        const options = this.state.searchData.map(item => <Option key={item.unitId} value={item.unitId}>{item.unitName}</Option>);
        const columns = [
            {
                title: '填报单位',
                dataIndex: 'writeUnit',
                key: 'writeUnit',
                width:'25%'
            },
            {
                title: '填表人',
                dataIndex: 'writeUserName',
                key: 'writeUserName',
                width:'10%'
            },
 
            {
                title: '提交日期',
                dataIndex: 'submitDate',
                key: 'submitDate',
                width:'10%'
            },
            {
                title: '年份',
                dataIndex: 'year',
                key: 'year',
                width:'10%'
            },
            {
                title: '累计金额(万元)',
                dataIndex: 'totalMoney',
                key: 'totalMoney',
                width:'10%'
            },
            {
                title: '审批日期',
                dataIndex: 'approvalDate',
                key: 'approvalDate',
                width:'10%'
            },
            {
                title: '审核状态',
                dataIndex: 'status',
                key: 'status',
                width:'10%',
                render:(_,data)=>{
                    let failReason = data.failReason? "未通过原因：" + data.failReason: "未通过原因："+ '无'
                    return <div>
                        {
                            data.status==1?<span>待提交</span>:
                            data.status==2?<span style={{color:'#999'}}>待审核</span>:
                            data.status==3?<span style={{color:'#20DCB2'}}>已通过</span>:
                            data.status==4?<Tooltip placement="top" title={failReason}>
                            <span style={{color:'red'}}>未通过</span></Tooltip>:null
                        }
                    </div>
                }
            },
            {
                title: '操作',
                dataIndex: 'option',
                key: 'option',
                width:'15%',
                render:(_,data)=>{
                    return <div>
                        {
                            data.status==1 || data.status==4 ?
                            <span>
                                <a onClick={()=>this.lookData(data)}>查看</a>
                                <Divider type="vertical"/>
                                <a onClick={()=>this.editData(data)}>修改</a>
                                <Divider type="vertical"/>
                                <Popconfirm title="确定提交吗?" onConfirm={()=>this.submitData(data)}><a>提交</a></Popconfirm>
                                <Divider type="vertical"/>
                                <Popconfirm title="确定删除吗?" onConfirm={()=>this.deleteData(data)}><a>删除</a></Popconfirm>
                            </span>:
                            data.status==2 || data.status==3 ?
                            <span>
                                <a onClick={()=>this.lookData(data)}>查看</a>
                            </span>:null
                        }
      
                        
                    </div>
                }
            },
        ];
        const pagination = {
            pageSize: this.state.PageSize,
            current: this.state.current,
            total: this.state.total,
            showSizeChanger: true,
            showQuickJumper: true,
            onShowSizeChange: this.onPageSizeChange,
            pageSizeOptions: ['10', "20", "30", "40"],
            onChange: this.changePage,
            showTotal: total => `共 ${total} 条`
        }
        return(
            <Spin spinning={this.state.spin}>
            <div className='InvestSubmit'>
                <div className='middle-addBtn'>
                    <Button type='primary' onClick={()=>this.setState({addModal:true})}>新增金额</Button>　　
                    <Button onClick={()=>this.setState({exportModal:true})}>导出电子表格</Button>
                </div>
                <div className='table'>
                    <div className='table-search'>
                        <div className='table-search-item1'>
                            {/* <Select
                                showSearch 
                                allowClear
                                filterOption={(input, option) =>option.props.children.indexOf(input) >= 0}
                                style={{width:'calc(100% - 20px)'}}
                                value={this.state.value}
                                onChange={this.handleChange}
                            >
                                {options}
                            </Select> */}
                            <Input onChange={this.handleChange} style={{width:'90%'}}/>
                        </div>
                        <div className='table-search-item2'>
                            <Input onChange={this.handlePersonChange} style={{width:'90%'}}/>
                        </div>
                        <div className='table-search-item3'>
                            <DatePicker onChange={this.handleDateChange} style={{width:'90%'}}/>
                        </div>
                        <div className='table-search-item4'>
                            <Select style={{width:'calc(100% - 20px)'}} allowClear onChange={this.handleStatusChange}>
                                <Option key={'1'} value={'1'}>待提交</Option>
                                <Option key={'2'} value={'2'}>待审核</Option>
                                <Option key={'3'} value={'3'}>已通过</Option>
                                <Option key={'4'} value={'4'}>未通过</Option>
                            </Select>
                        </div>
                    </div>
                    <Table rowKey={'id'} columns={columns} dataSource={list} bordered pagination={pagination}/>
               </div>
                <Modal
                    title='新增实际资金到位'
                    footer={null}
                    width={1000}
                    visible={this.state.addModal}
                    destroyOnClose={true}
                    afterClose={()=>this.setState({addModal:false})}
                    onCancel={()=>this.setState({addModal:false})}
                >
                    <Add closeModal={this.closeModal} getAddData={this.getAddData}/>
                </Modal>
                <Modal
                    title='编辑实际资金到位'
                    footer={null}
                    width={1000}
                    visible={this.state.editModal}
                    destroyOnClose={true}
                    afterClose={()=>this.setState({editModal:false})}
                    onCancel={()=>this.setState({editModal:false})}
                >
                    <Edit closeModal={this.closeModal} detail={this.state.detail} getEditData={this.getEditData}/>
                </Modal>
                <Modal
                    title='实际资金到位详情'
                    footer={null}
                    width={700}
                    visible={this.state.detailModal}
                    destroyOnClose={true}
                    afterClose={()=>this.setState({detailModal:false})}
                    onCancel={()=>this.setState({detailModal:false})}
                >
                    <Detail closeModal={this.closeModal} detail={this.state.detail} getEditData={this.getEditData}/>
                </Modal>
                <Modal
                    title='汇总导出'
                    footer={null}
                    width={400}
                    visible={this.state.exportModal}
                    destroyOnClose={true}
                    afterClose={()=>this.setState({exportModal:false})}
                    onCancel={()=>this.setState({exportModal:false})}
                >
                    <ExportTable closeModal={this.closeModal}/>
                </Modal>
            </div>
            </Spin>
        )
    }
}
@Form.create()
class Add extends Component{
    constructor(props){
        super(props);
        this.state={
            yearOption:[],
            list:[],
            addModal:false,
            addTableData:[{key:'time',money:'666666',reason:'贷款6666'}],

            
        }
    }
    componentWillMount(){
        this.getYears()
    }
    componentDidMount(){
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        this.props.form.setFieldsValue({writeUnit:userInfo.unitName})
    }
    getYears = () => {
        let yearOption = []
        for(let i=2005;i<2036;i++){
            yearOption.push({key:i,value:i})
        }
        this.setState({yearOption})
    }

    handleSubmit = () => {
        // e.preventDefault;
        this.props.form.validateFields((error, values) => {
            if(!error){
                let list = [];
                for(let key in values){
                    if(key.indexOf('arrivalTime-')>-1){
                        let num = key.split('-')[1]
                        list.push({
                            arrivalTime:moment(values[key]).format('YYYY-MM-DD'),
                            amount:values[`amount-${num}`],
                            source:values[`source-${num}`],
                        })
                    }
                }
                let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
                
                let body = {
                    writeUnit:values.writeUnit,
                    unitId:userInfo.unitId,
                    year:values.year,
                    investmentDetails:list
                }
                this.props.getAddData(body)
                // location.hash = '/InformationSubmit'
            }
        })
    }

    closeModal = () => {
        this.setState({addModal:false})
    }

    // addTableData = data => {
    //     let {list} = this.state;
    //     list.push(data)
    //     this.setState({list})
    // }

    // delete = data => {
        
    // }

    addData = () => {
        let {addTableData} = this.state;
        addTableData.push({key:'time',money:'',reason:''})
        this.setState({addTableData})
    }
    deleteData = index => {
        let {addTableData} = this.state;
        addTableData.splice(index,1,null)
        this.setState({addTableData})
    }
    render(){
        const {yearOption,list,addTableData} = this.state;
        const { getFieldDecorator } = this.props.form;
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        const formItemLayout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };
        const formItemLayout2 = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };
        const columns = [
            {
                title: '到位时间',
                dataIndex: 'time',
                key: 'time',
                width:'20%'
            },
            {
                title: '金额(万元)',
                dataIndex: 'money',
                key: 'money',
                width:'20%'
            },
 
            {
                title: '经费来源',
                dataIndex: 'source',
                key: 'source',
                width:'40%'
            },
            {
                title: '操作',
                dataIndex: 'option',
                key: 'option',
                width:'20%',
                render:(_,data)=>{
                    return <a onClick={()=>this.delete(data)}>删除</a>
                }
            },
        ]
        
        return(
            <div>
                <div style={{marginBottom:'20px',color:'red',fontSize:'16px'}}>
                    说明：填写每一次批复的安可替代项目资金到账信息，经费来源包括财政年度预算、财政专项经费等，涉及到发改、政数局批复的，请特别说明。
                </div>
                <Form>
                    <FormItem label='填报单位' {...formItemLayout} >
                        {
                            getFieldDecorator('writeUnit', {
                                rules: [{
                                    required: true,
                                    max:60,
                                    // message:'填报单位为必填项且字数限制60字'
                                    validator:(rule,value,callback)=>limitStr(rule,value,callback,'填报单位')
                                    // validator:(rule,value,callback)=>{
                                    //     if(!value){
                                    //         callback('填报单位为必填项且字数限制60字')
                                    //     }else if(!value.replace(/\s+/g,"")){
                                    //         callback('填报单位不可为字符串')
                                    //     }else{
                                    //         callback()
                                    //     }
                                    // }
                                }], initialValue:userInfo.unitName,
                            })
                            (<Input  style={{width:'100%'}}/>)
                        }
                    </FormItem>
                    <FormItem label='年份' {...formItemLayout} >
                        {
                            getFieldDecorator('year', {
                                rules: [{
                                    required: true,
                                    message:'年份为必填项'
                                }], initialValue: 2020,
                            })
                            (
                                <Select style={{width:'100%'}}>
                                    {
                                        yearOption.map(item=>{
                                            return <Option key={item.key} value={item.key}>{item.value}</Option>
                                        })
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem>
                        {/* <Table columns={columns} dataSource={list} bordered/> */}
                        <table className='addDataTable'>
                            <thead>
                                <tr>
                                    <th>到位时间</th>
                                    <th>金额(万元)</th>
                                    <th>经费来源</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    addTableData.map((item,index)=>{
                                        return item&&<tr key={index}>
                                                    <td>
                                                        <FormItem  {...formItemLayout2} >
                                                            {
                                                                getFieldDecorator(`arrivalTime-${index}`, {
                                                                    rules: [{
                                                                        required: true,
                                                                        message:'到位时间为必填项'
                                                                    }], initialValue: null,
                                                                })
                                                                (<DatePicker style={{width:'100%'}}/>)
                                                            }
                                                        </FormItem>
                                                    </td>
                                                    <td>
                                                        <FormItem {...formItemLayout2} >
                                                            {
                                                                getFieldDecorator(`amount-${index}`, {
                                                                    rules: [{
                                                                        required: true,
                                                                        validator:(rule,value,callback)=>{
                                                                            if(!value){
                                                                                callback('金额为必填项且不为0')
                                                                            }else if(isNaN(Number(value))){
                                                                                callback('请勿输入非数字值')
                                                                            }else if(Number(value)<0){
                                                                                callback('请勿输入负数')
                                                                            }else{
                                                                                callback()
                                                                            }
                                                                        }
                                                                    }], initialValue: null,
                                                                })
                                                                (<InputNumber style={{width:'100%'}}/>)
                                                            }
                                                        </FormItem>
                                                    </td>
                                                    <td>
                                                        <FormItem {...formItemLayout2} >
                                                            {
                                                                getFieldDecorator(`source-${index}`, {
                                                                    rules: [{
                                                                        required: true,
                                                                        max:30,
                                                                        // message:'经费来源为必填项且字数限制30字'
                                                                        validator:(rule,value,callback)=>limitStr(rule,value,callback,'经费来源')
                                                                        
                                                                    }], initialValue: null,
                                                                })
                                                                (<Input style={{width:'100%'}}/>)
                                                            }
                                                        </FormItem>
                                                    </td>
                                                    <td>
                                                        {
                                                            index===0?<Icon type="plus" onClick={this.addData}/>:
                                                            <span>
                                                                <Icon type="plus" onClick={this.addData}/>
                                                                <Icon type="minus" onClick={()=>this.deleteData(index)}/>
                                                            </span>
                                                        }
                                                    </td>
                                                </tr>
                                    })
                                }
                                
                            </tbody>
                        </table>
                        
                    </FormItem>
                    {/* <div style={{padding:'6px 0',textAlign:'left'}}>
                        <Button type='primary' onClick={()=>this.setState({addModal:true})}>列表数据添加</Button>
                    </div> */}
                    <div style={{padding:'10px 0',textAlign:'center'}}>
                        <Button type='default' onClick={()=>this.props.closeModal()}>取消</Button>　
                        <Button type='primary' onClick={this.handleSubmit}>确认</Button>
                    </div>
                </Form>
                {/* <Modal
                    title='新增经费数据'
                    footer={null}
                    width={400}
                    visible={this.state.addModal}
                    destroyOnClose={true}
                    afterClose={()=>this.setState({addModal:false})}
                    onCancel={()=>this.setState({addModal:false})}
                >
                    <AddTable closeModal={this.closeModal} addTableData={this.addTableData}/>
                </Modal> */}
                
            </div>
        )
    }
}
@Form.create()
class Edit extends Component{
    constructor(props){
        super(props);
        this.state={
            yearOption:[],
            list:[],
            addModal:false,
            addTableData:[],
            detail:{}
            
        }
    }
    componentWillMount(){
        this.getYears()
    }
    componentDidMount(){
        let {detail} = this.props;
        this.props.form.setFieldsValue({year:detail.year,writeUnit:detail.writeUnit})
        this.getDetail(detail.id)

    }

    getDetail = (id) => {
        getService(`/workReport/investment/getDetail?id=${id}`,res=>{
            if(res.flag){
                let data = res.data.investmentDetails
                let addTableData = [];
                data.map(item=>{
                    addTableData.push({arrivalTime:item.arrivalTime,amount:item.amount,source:item.source,id:item.id})
                })
                this.setState({detail:res.data,addTableData},()=>{
                })
            }
        })
    }
    getYears = () => {
        let yearOption = []
        for(let i=2005;i<2036;i++){
            yearOption.push({key:i,value:i})
        }
        this.setState({yearOption})
    }

    handleSubmit = () => {
        let {detail} = this.props;
        this.props.form.validateFields((error, values) => {
            if(!error){
                let list = [];
                for(let key in values){
                    if(key.indexOf('arrivalTime-')>-1){
                        let num = key.split('-')[1]
                        list.push({
                            arrivalTime:moment(values[key]).format('YYYY-MM-DD'),
                            amount:values[`amount-${num}`],
                            source:values[`source-${num}`],
                        })
                    }
                }
                let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
                
                let body = {
                    id:detail.id,
                    writeUnit:values.writeUnit,
                    unitId:userInfo.unitId,
                    year:values.year,
                    investmentDetails:list
                }
                this.props.getEditData(body)
                // location.hash = '/InformationSubmit'
            }
        })
    }

    closeModal = () => {
        this.setState({addModal:false})
    }

    // addTableData = data => {
    //     let {list} = this.state;
    //     list.push(data)
    //     this.setState({list})
    // }

    // delete = data => {
        
    // }

    addData = () => {
        let {addTableData} = this.state;
        addTableData.push({arrivalTime:null,amount:null,source:null})
        this.setState({addTableData})
    }
    deleteData = index => {
        let {addTableData} = this.state;
        addTableData.splice(index,1,null)
        this.setState({addTableData})
    }
    render(){
        const {yearOption,list,addTableData} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };
        const formItemLayout2 = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };
        const columns = [
            {
                title: '到位时间',
                dataIndex: 'time',
                key: 'time',
                width:'20%'
            },
            {
                title: '金额(万元)',
                dataIndex: 'money',
                key: 'money',
                width:'20%'
            },
 
            {
                title: '经费来源',
                dataIndex: 'source',
                key: 'source',
                width:'40%'
            },
            {
                title: '操作',
                dataIndex: 'option',
                key: 'option',
                width:'20%',
                render:(_,data)=>{
                    return <a onClick={()=>this.delete(data)}>删除</a>
                }
            },
        ]
        
        return(
            <div>
                <Form>
                    <FormItem label='填报单位' {...formItemLayout} >
                        {
                            getFieldDecorator('writeUnit', {
                                rules: [{
                                    required: true,
                                    max:60,
                                    // message:'填报单位为必填项且字数限制60字'
                                    validator:(rule,value,callback)=>limitStr(rule,value,callback,'填报单位')
                                    // validator:(rule,value,callback)=>{
                                    //     if(!value){
                                    //         callback('填报单位为必填项且字数限制60字')
                                    //     }else if(!value.replace(/\s+/g,"")){
                                    //         callback('填报单位不可为字符串')
                                    //     }else{
                                    //         callback()
                                    //     }
                                    // }
                                }], initialValue:null,
                            })
                            (<Input style={{width:'100%'}}/>)
                        }
                    </FormItem>
                    <FormItem label='年份' {...formItemLayout} >
                        {
                            getFieldDecorator('year', {
                                rules: [{
                                    required: true,
                                    message:'年份为必填项'
                                }], initialValue:null,
                            })
                            (
                                <Select style={{width:'100%'}}>
                                    {
                                        yearOption.map(item=>{
                                            return <Option key={item.key} value={item.key}>{item.value}</Option>
                                        })
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem>
                        {/* <Table columns={columns} dataSource={list} bordered/> */}
                        <table className='addDataTable'>
                            <thead>
                                <tr>
                                    <th>到位时间</th>
                                    <th>金额(万元)</th>
                                    <th>经费来源</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    addTableData.map((item,index)=>{
                                        return item&&<tr key={index}>
                                                    <td>
                                                        <FormItem  {...formItemLayout2} >
                                                            {
                                                                getFieldDecorator(`arrivalTime-${index}`, {
                                                                    rules: [{
                                                                        required: true,
                                                                        message:'到位时间为必填项'
                                                                    }], initialValue:item.arrivalTime?moment(item.arrivalTime):null,
                                                                })
                                                                (<DatePicker style={{width:'100%'}}/>)
                                                            }
                                                        </FormItem>
                                                    </td>
                                                    <td>
                                                        <FormItem {...formItemLayout2} >
                                                            {
                                                                getFieldDecorator(`amount-${index}`, {
                                                                    rules: [{
                                                                        required: true,
                                                                        validator:(rule,value,callback)=>{
                                                                            if(!value){
                                                                                callback('金额为必填项且不为0')
                                                                            }else if(isNaN(Number(value))){
                                                                                callback('请勿输入非数字值')
                                                                            }else if(Number(value)<0){
                                                                                callback('请勿输入负数')
                                                                            }else{
                                                                                callback()
                                                                            }
                                                                        }
                                                                    }], initialValue: item.amount,
                                                                })
                                                                (<InputNumber style={{width:'100%'}}/>)
                                                            }
                                                        </FormItem>
                                                    </td>
                                                    <td>
                                                        <FormItem {...formItemLayout2} >
                                                            {
                                                                getFieldDecorator(`source-${index}`, {
                                                                    rules: [{
                                                                        required: true,
                                                                        max:30,
                                                                        validator:(rule,value,callback)=>limitStr(rule,value,callback,'经费来源')
                                                                        // message:'经费来源为必填项且字数限制30字'
                                                                    }], initialValue: item.source,
                                                                })
                                                                (<Input style={{width:'100%'}}/>)
                                                            }
                                                        </FormItem>
                                                    </td>
                                                    <td>
                                                        {
                                                            index===0?<Icon type="plus" onClick={this.addData}/>:
                                                            <span>
                                                                <Icon type="plus" onClick={this.addData}/>
                                                                <Icon type="minus" onClick={()=>this.deleteData(index)}/>
                                                            </span>
                                                        }
                                                    </td>
                                                </tr>
                                    })
                                }
                                
                            </tbody>
                        </table>
                        
                    </FormItem>
                    {/* <div style={{padding:'6px 0',textAlign:'left'}}>
                        <Button type='primary' onClick={()=>this.setState({addModal:true})}>列表数据添加</Button>
                    </div> */}
                    <div style={{padding:'10px 0',textAlign:'center'}}>
                        <Button type='default' onClick={()=>this.props.closeModal()}>取消</Button>　
                        <Button type='primary' onClick={this.handleSubmit}>确认</Button>
                    </div>
                </Form>
                {/* <Modal
                    title='新增经费数据'
                    footer={null}
                    width={400}
                    visible={this.state.addModal}
                    destroyOnClose={true}
                    afterClose={()=>this.setState({addModal:false})}
                    onCancel={()=>this.setState({addModal:false})}
                >
                    <AddTable closeModal={this.closeModal} addTableData={this.addTableData}/>
                </Modal> */}
                
            </div>
        )
    }
}
@Form.create()
class Detail extends Component{
    constructor(props){
        super(props);
        this.state={
            yearOption:[],
            list:[],
            addModal:false,
            reasonModal:false,
            addTableData:[],
            detail:{}
            
        }
    }
    componentWillMount(){
        this.getYears()
    }
    componentDidMount(){
        let {detail} = this.props;
        this.getDetail(detail.id)

    }

    getDetail = (id) => {
        getService(`/workReport/investment/getDetail?id=${id}`,res=>{
            if(res.flag){
                let data = res.data.investmentDetails
                let addTableData = [];
                data.map(item=>{
                    addTableData.push({arrivalTime:item.arrivalTime,amount:item.amount,source:item.source,id:item.id})
                })
                this.setState({detail:res.data,addTableData},()=>{
                })
            }
        })
    }
    getYears = () => {
        let yearOption = []
        for(let i=2005;i<2036;i++){
            yearOption.push({key:i,value:i})
        }
        this.setState({yearOption})
    }

    handleSubmit = () => {
        let {detail} = this.props;
        this.props.form.validateFields((error, values) => {
            if(!error){
                let list = [];
                for(let key in values){
                    if(key.indexOf('arrivalTime-')>-1){
                        let num = key.split('-')[1]
                        list.push({
                            arrivalTime:moment(values[key]).format('YYYY-MM-DD'),
                            amount:values[`amount-${num}`],
                            source:values[`source-${num}`],
                        })
                    }
                }
                let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
                
                let body = {
                    id:detail.id,
                    writeUnit:values.writeUnit,
                    unitId:userInfo.unitId,
                    year:values.year,
                    investmentDetails:list
                }
                this.props.getEditData(body)
                // location.hash = '/InformationSubmit'
            }
        })
    }

    closeModal = () => {
        this.setState({addModal:false,reasonModal:false})
    }

    // addTableData = data => {
    //     let {list} = this.state;
    //     list.push(data)
    //     this.setState({list})
    // }

    // delete = data => {
        
    // }

    addData = () => {
        let {addTableData} = this.state;
        addTableData.push({arrivalTime:null,amount:null,source:null})
        this.setState({addTableData})
    }
    deleteData = index => {
        let {addTableData} = this.state;
        addTableData.splice(index,1,null)
        this.setState({addTableData})
    }
    getReason = (data) => {
        let {detail} = this.props;
        let body = {
            id:detail.id,
            status:4,
            failReason:data.reason
        }
        postService(`/workReport/investment/audit?id=${detail.id}`,body,res=>{
            if(res.flag){
                message.success('审核成功')
                this.props.closeModal()
            }else{
                message.error('审核失败')
                this.props.closeModal()
            }
        })
    }

    pass = () => {
        let {detail} = this.props;
        let body = {
            id:detail.id,
            status:3,
            failReason:''
        }
        postService(`/workReport/investment/audit?id=${detail.id}`,body,res=>{
            if(res.flag){
                message.success('审核成功')
                this.props.closeModal()
            }else{
                message.error('审核失败')
                this.props.closeModal()
            }
        })
    }
    render(){
        const {yearOption,list,addTableData} = this.state;
        let {detail} = this.props;

        
        return(
            <div>
                <Row style={{padding:'20px 0 0',fontSize:'16px'}}>
                    <Col span={3}>填报单位：</Col>
                    <Col span={20} offset={1}>{detail.writeUnit}</Col>
                </Row>
                <Row style={{padding:'20px 0',fontSize:'16px'}}>
                    <Col span={3}>年份：</Col>
                    <Col span={20} offset={1}>{detail.year}</Col>
                </Row>
                <table className='detailDataTable'>
                    <thead>
                        <tr>
                            <th>到位时间</th>
                            <th>金额(万元)</th>
                            <th>经费来源</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            addTableData.map((item,index)=>{
                                return item&&<tr key={index}>
                                            <td>{item.arrivalTime}</td>
                                            <td>{item.amount}</td>
                                            <td>{item.source}</td>
                                        </tr>
                            })
                        }
                        
                    </tbody>
                </table>
            </div>
        )
    }
}
@Form.create()
class AddTable extends Component{
    constructor(props){
        super(props);
        this.state={
        }
    }
    handleSubmit = () => {
        // e.preventDefault;
        this.props.form.validateFields((error, values) => {
            if(!error){
                let body = {
                    ...values,
                    time:moment(values.time).format('YYYY-MM-DD')
                }
                this.props.addTableData(body)
                this.props.closeModal()
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

        return(
            <div>
                <Form>
                    <FormItem label='到位时间' {...formItemLayout} >
                        {
                            getFieldDecorator('time', {
                                rules: [{
                                    required: true,
                                    message:'到位时间为必填项'
                                }], initialValue: null,
                            })
                            (<DatePicker style={{width:'100%'}}/>)
                        }
                    </FormItem>
                    <FormItem label='金额' {...formItemLayout} >
                        {
                            getFieldDecorator('money', {
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
                                }], initialValue: null,
                            })
                            (<Input style={{width:'100%'}} addonAfter='万元'/>)
                        }
                    </FormItem>
                    <FormItem label='经费来源' {...formItemLayout} >
                        {
                            getFieldDecorator('source', {
                                rules: [{
                                    required: true,
                                    message:'经费来源为必填项'
                                }], initialValue: null,
                            })
                            (<Input style={{width:'100%'}}/>)
                        }
                    </FormItem>
                    <div　style={{padding:'30px 0',textAlign:'center'}}>
                        <Button type='default' onClick={()=>this.props.closeModal()}>取消</Button>　
                        <Button type='primary' onClick={this.handleSubmit}>确定</Button>
                    </div>
                </Form>
            </div>
        )
    }
}

@Form.create()
class ExportTable extends Component{
    constructor(props){
        super(props);
        this.state={
            yearOption:[]
        }
    }
    componentWillMount(){
        this.getYears()
    }
    getYears = () => {
        let yearOption = []
        for(let i=2005;i<2036;i++){
            yearOption.push({key:i,value:i})
        }
        this.setState({yearOption})
    }
    handleSubmit = () => {
        // e.preventDefault;
        this.props.form.validateFields((error, values) => {
            if(!error){
                getExportExcelService(`/workReport/investment/excel/submitExport?year=${values.year}`,'投资报送表格')
                this.props.closeModal()
            }
        })
    }
    render(){
        const {yearOption} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        return(
            <div>
                <Form>
                    <FormItem label='填报单位' {...formItemLayout} >
                        {
                            getFieldDecorator('company', {
                                rules: [{
                                    required: false,
                                    message:'填报单位为必填项'
                                }], initialValue: userInfo.unitName,
                            })
                            (<Input disabled style={{width:'100%'}}/>)
                        }
                    </FormItem>
                    <FormItem label='导出年份' {...formItemLayout} >
                        {
                            getFieldDecorator('year', {
                                rules: [{
                                    required: false,
                                    message:'导出年份为必填项'
                                }], initialValue: '2020',
                            })
                            (
                                <Select style={{width:'100%'}}>
                                    {
                                        yearOption.map(item=>{
                                            return <Option key={item.key} value={item.key}>{item.value}</Option>
                                        })
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    <div　style={{padding:'30px 0',textAlign:'center'}}>
                        <Button type='default' onClick={()=>this.props.closeModal()}>取消</Button>　
                        <Button type='primary' onClick={this.handleSubmit}>确定</Button>
                    </div>
                </Form>
            </div>
        )
    }
}





