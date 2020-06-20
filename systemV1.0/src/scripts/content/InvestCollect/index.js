//信息报送
import React,{Component} from "react";
import {connect} from 'react-redux'
import { 
    Icon,Button,Menu,DatePicker,
    TimePicker,LocaleProvider,Calendar,
    ConfigProvider,Row,Col,InputNumber,
    Modal,Table,Select,Input, Form, Spin,
    Empty,message,Divider,Popconfirm,Cascader
} from 'antd';
const { Option } = Select;
const FormItem = Form.Item;
const {TextArea} = Input;
import moment from 'moment';
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
            yearOption:[],
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
    componentWillMount(){

        this.getYears()
        this.getTree()
    }

    getTree = () => {
        let {data,searchData} = this.state;
        getService(`/workReport/auth/getUnitList/true`,res=>{
            if(res.flag){
                let list = res.data || [];
                this.dealCompany(list)
                this.setState({data:list,searchData:list})
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

    getYears = () => {
        let year = new Date().getFullYear();
        let yearOption = []
        for(let i=year-15;i<year+16;i++){
            yearOption.push({key:i,value:i})
        }
        this.setState({yearOption})
    }

    componentDidMount(){
        document.addEventListener('keydown',this.onkeydown);
        this.getList(1,10)
        
    }
    getList = (page, pageSize,params='') => {
        this.setState({spin:true})
        getService(`/workReport/investment/getListOfCollect/${page}/${pageSize}?${params}`,res=>{
            if(res.flag){
                this.setState({list:res.data.investments,total:res.data.count,spin:false})
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
    

    // handleChange = (value,selectedOptions) => {
    //     let {params} = this.state;
    //     params.unitId = value.length?value[value.length-1]:'';
    //     this.setState({params},()=>{
    //         this.setSearch(true)
    //     })
    // }
    handleChange = e => {
        let {params} = this.state;
        params.createUnitName = e.target.value;
        this.setState({params},()=>{
            this.setSearch(true)
        })
    }
    handlePersonChange = e => {//填表人
        let {params} = this.state;
        params.writeUserName = e.target.value;
        this.setState({params},()=>{
            this.setSearch()
        })
    }
    handleYearChange = e => {//审批日期
        let {params} = this.state;
        params.year = e;
        this.setState({params},()=>{
            this.setSearch(true)
        })
    }
    handleStatusChange = e => {
        let {params} = this.state;
        params.status = e;
        this.setState({params},()=>{
            this.setSearch()
        })
    }
    closeModal = () => {
        let {current,PageSize,search} = this.state
        this.getList(current,PageSize,search)
        this.setState({addModal:false,exportModal:false,editModal:false})
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
        const {list,searchData,yearOption} = this.state;
        const options = searchData.map(d => <Option key={d.key} value={d.key}>{d.value}</Option>);
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
                title: '最后更新',
                dataIndex: 'updateDate',
                key: 'updateDate',
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
                width:'15%'
            },
            {
                title: '最后审核',
                dataIndex: 'approvalDate',
                key: 'approvalDate',
                width:'10%',
            },
            {
                title: '审批人',
                dataIndex: 'admitUserName',
                key: 'admitUserName',
                width:'10%',
            },
            {
                title: '操作',
                dataIndex: 'option',
                key: 'option',
                width:'10%',
                render:(_,data)=>{
                    return  <span>
                                <a onClick={()=>this.editData(data)}>查看</a>
                            </span>
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
            <div className='InvestCollect'>
                <div className='middle-addBtn'>
                   <Button type='primary' onClick={()=>this.setState({exportModal:true})}>实际资金到位汇总</Button>　　
                </div>
                <div className='table'>
                    <div className='table-search'>
                        <div className='table-search-item1'>
                        {/* <Cascader 
                            style={{width:'calc(100% - 20px)'}} 
                            options={this.state.data} 
                            showSearch={()=>this.filter()} 
                            allowClear 
                            changeOnSelect 
                            onChange={this.handleChange}
                        /> */}
                        <Input onChange={this.handleChange} style={{width:'90%'}}/>
                        </div>
                        <div className='table-search-item2'>
                            <Input onChange={this.handlePersonChange} style={{width:'90%'}}/>
                        </div>
                        <div className='table-search-item3'>
                            <Select style={{width:'calc(100% - 20px)'}} allowClear onChange={this.handleYearChange}>
                                {
                                    yearOption.map(item=>{
                                        return <Option key={item.key} value={item.key}>{item.value}</Option>
                                    })
                                }
                            </Select>
                        </div>
                    </div>
                    <Table rowKey={'id'} columns={columns} dataSource={list} bordered pagination={pagination}/>
               </div>
                <Modal
                    title='实际资金到位详情'
                    footer={null}
                    width={700}
                    visible={this.state.editModal}
                    destroyOnClose={true}
                    afterClose={()=>this.setState({editModal:false})}
                    onCancel={()=>this.setState({editModal:false})}
                >
                    <Detail closeModal={this.closeModal} detail={this.state.detail} getEditData={this.getEditData}/>
                </Modal>
                <Modal
                    title='实际资金到位汇总'
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
                    writeUnit:userInfo.unitName,
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
    handleSubmit = e => {
        // e.preventDefault;
        this.props.form.validateFields((error, values) => {
            if(!error){
                getExportExcelService(`/workReport/investment/excel/collectExport?year=${values.year}`,'投资汇总表格')
                this.props.closeModal()
            }
        })
    }
    render(){
        const {yearOption} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

        return(
            <div>
                <Form>
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
                        <Button type='primary' onClick={this.handleSubmit}>导出</Button>
                    </div>
                </Form>
            </div>
        )
    }
}









