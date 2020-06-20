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
import {getService,postService} from '../../common/fetch'
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
        getService(`/workReport/investment/getAuditList/${page}/${pageSize}?${params}`,res=>{
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
            this.setSearch(true)
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
    filter = (inputValue, path) => {
        return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
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
                width:'15%'
            },
 
            {
                title: '提交日期',
                dataIndex: 'submitDate',
                key: 'submitDate',
                width:'15%'
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
                title: '审核状态',
                dataIndex: 'status',
                key: 'status',
                width:'10%',
                render:(_,data)=>{
                    return <div>
                        {
                            data.status==1?<span>待提交</span>:
                            data.status==2?<span style={{color:'#999'}}>待审核</span>:
                            data.status==3?<span style={{color:'#20DCB2'}}>已通过</span>:
                            data.status==4?<span style={{color:'red'}}>未通过</span>:null
                        }
                    </div>
                }
            },
            {
                title: '操作',
                dataIndex: 'option',
                key: 'option',
                width:'10%',
                render:(_,data)=>{
                    return <span><a onClick={()=>this.editData(data)}>审核</a></span>
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
            <div className='InvestExamine'>
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
                    title='审核实际资金到位'
                    footer={null}
                    width={700}
                    visible={this.state.editModal}
                    destroyOnClose={true}
                    afterClose={()=>this.setState({editModal:false})}
                    onCancel={()=>this.setState({editModal:false})}
                >
                    <Detail closeModal={this.closeModal} detail={this.state.detail} getEditData={this.getEditData}/>
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
        this.setState({reasonModal:false})
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
                <div　style={{padding:'30px 0',textAlign:'center'}}>
                    <Button type='primary' onClick={this.pass}>通过</Button>　
                    <Button type='default' onClick={()=>this.setState({reasonModal:true})}>不通过</Button>
                </div>
           
                <Modal
                    title='不通过原因'
                    footer={null}
                    width={600}
                    visible={this.state.reasonModal}
                    destroyOnClose={true}
                    afterClose={()=>this.setState({reasonModal:false})}
                    onCancel={()=>this.setState({reasonModal:false})}
                >
                    <Reason getReason={this.getReason} closeModal={this.closeModal}/>
                </Modal>
                
            </div>
        )
    }
}
@Form.create()
class Reason extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

    handleSubmit = () => {
        this.props.form.validateFields((error, values) => {
            if(!error){
                this.props.getReason(values)
                
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };
        return(
            <div>
                <Form>
                    <FormItem  {...formItemLayout} >
                        {
                            getFieldDecorator('reason', {
                                rules: [{
                                    required: false,
                                    message:'不通过原因为必填项'
                                }],
                                initialValue: '',
                            })
                            (<TextArea rows={4} max={200}/>)
                        }
                    </FormItem>
                    <div style={{textAlign:'center',padding:'16px 0'}}>
                        <Button onClick={() => this.props.closeModal()}>取消</Button>　　
                        <Button type='primary' onClick={this.handleSubmit}>确定</Button>
                    </div>
                </Form>
            </div>
        )
    }
}







