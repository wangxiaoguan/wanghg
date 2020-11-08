//信息报送
import React,{Component} from "react";
import {connect} from 'react-redux'
import { Icon,Button,Row,Col,Modal,Table,Select,Input,Form,Divider,Spin,Popconfirm,Tooltip  } from 'antd';
const { Option } = Select;
const FormItem = Form.Item;
import './index.less';
import {getService,postService} from '../../common/fetch'
import {limitStr} from '../../common/checkForm'
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
            list:[],
            data:[],
            addModal:false,
            alertModal:false,
            value:'',
            PageSize: 10, //每页十条数据
            current: 1, //当前页
            total: 0,//查询的总数量
            params:{},//搜索参数
            search:'',
            spin:false,
            NofinishedItem:[],
            searchData:[]
        }
    }

    componentDidMount(){
        console.log('0000000000000')
        document.addEventListener('keydown',this.onkeydown);
        // this.getList(1,10)
        // this.getTree()
        // if(!sessionStorage.getItem('isFinishedItem')){
        //     this.getNofinishedItem()
        // }
    }
    getList = (page, pageSize,params='') => {
        this.setState({spin:true})
        getService(`/workReport/infoSubmit/getList/${page}/${pageSize}?${params}`,res=>{
            if(res.flag){
                this.setState({list:res.data.tbPrjProjectReports,total:res.data.count,spin:false})
            }
        })
    }

    getNofinishedItem = () => {
        getService(`/workReport/infoSubmit/getIncomplete`,res=>{
            if(res.flag){
                let NofinishedItem = res.data;
                this.setState({alertModal:NofinishedItem.length?true:false,NofinishedItem})
                sessionStorage.setItem('isFinishedItem',true)
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

    componentDidUpdate(){
		
	}
    handleSend = ()=>{ 
        //要执行的代码
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
    handleChange = e => {
        let {params} = this.state;
        params.createUnitName = e.target.value;
        this.setState({params},()=>{
            this.setSearch(true)
        })
    }
    handlePersonChange = e => {//填表人
        let {params} = this.state;
        params.createUserName = e.target.value;
        this.setState({params},()=>{
            this.setSearch()
        })
    }
    handleNameChange = e => {//项目名称
        let {params} = this.state;
        params.projectName = e.target.value;
        this.setState({params},()=>{
            this.setSearch()
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
        this.setState({ addModal:false });
    }

    lookData = data => {
        location.hash = `/InformationSubmit/Detail/${data.id}`
    }

    editData = data => {
        if(data.status === 3 || data.status === 5){
            location.hash = `/InformationSubmit/EditPass/${data.id}`
        }else{
            location.hash = `/InformationSubmit/Edit/${data.id}`
        }
        
    }

    submitData = data => {
        let {current,PageSize,search} = this.state;
        postService(`/workReport/infoSubmit/submit?id=${data.id}`,{},data=>{
            if(data.flag){
                this.getList(current,PageSize,search)
            }
        })
    }
    deleteData = data => {
        let {current,PageSize,search} = this.state;
        postService(`/workReport/infoSubmit/delete?id=${data.id}`,{},data=>{
            if(data.flag){
                this.getList(current,PageSize,search)
            }
        })
    }
    exportData = data => {
        
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
    onTableRow = (record, index) => {
        console.log(record,index)
    }
    render(){
        const TooltipTitle = (text, title) => { // text 展示的thead title 展示的提醒文字
            return (
                <Tooltip placement="top" title={title}>
                  <Icon type="question-circle" theme="outlined" />
                </Tooltip>
            );
          };
        const {list,NofinishedItem} = this.state;
        const options = this.state.searchData.map(item => <Option key={item.unitId} value={item.unitId}>{item.unitName}</Option>);
        const columns = [
            {
                title: '填报单位',
                dataIndex: 'createUnitName',
                key: 'createUnitName',
                width:'15%'
            },
            {
                title: '填表人',
                dataIndex: 'createUserName',
                key: 'createUserName',
                width:'10%'
            },
 
            {
                title: '项目名称',
                dataIndex: 'projectName',
                key: 'projectName',
                width:'15%'
            },
            {
                title: '建表时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width:'10%'
            },
            {
                title: '提交时间',
                dataIndex: 'commitTime',
                key: 'commitTime',
                width:'10%',
            },
            {
                title: '审核状态',
                dataIndex: 'status',
                key: 'status',
                width:'10%',
                render:(_,data)=>{
                    let notPassReason = data.notPassReason? "未通过原因：" + data.notPassReason: "未通过原因："+ '无'
                    return <div>
                        {
                            data.status===1?<span>待提交</span>:
                            data.status===2?<span style={{color:'#999'}}>待审核</span>:
                            data.status===3?<span style={{color:'#20DCB2'}}>已通过</span>:
                            data.status===4?<Tooltip placement="top" title={notPassReason}>
                            <span style={{color:'red'}}>未通过</span></Tooltip>:
                            data.status===5?<span>有更新</span>:null
                        }
                    </div>
                }
            },
            {
                title: '审核时间',
                dataIndex: 'admitTime',
                key: 'admitTime',
                width:'10%'
            },
            {
                title: '操作',
                dataIndex: 'option',
                key: 'option',
                width:'20%',
                render:(_,data)=>{
                    let status = data.status;
                    let isFinishTime = data.projectFinishTime?true:false;
                    return <div>
                        {
                            status===1||status===4?
                            <span>
                                <a onClick={()=>this.lookData(data)}>查看</a>
                                <Divider type="vertical"/>
                                <a onClick={()=>this.editData(data)}>修改</a>
                                <Divider type="vertical"/>
                                <Popconfirm title="确定提交吗?" onConfirm={()=>this.submitData(data)}><a>提交</a></Popconfirm>
                                <Divider type="vertical"/>
                                <Popconfirm title="确定删除吗?" onConfirm={()=>this.deleteData(data)}><a>删除</a></Popconfirm>
                            </span>:
                            status===2?
                            <span>
                                <a onClick={()=>this.lookData(data)}>查看</a>
                            </span>:
                            status===3||status===5?isFinishTime?
                            <a onClick={()=>this.lookData(data)}>查看</a>:
                            <span>
                                <a onClick={()=>this.lookData(data)}>查看</a>
                                <Divider type="vertical"/>
                                <a onClick={()=>this.editData(data)}>修改</a>
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
            <div className='InformationSubmit'>
                <div className='middle-addBtn'>
                    <Button type='primary' onClick={()=>this.setState({ addModal:true })}>新建项目</Button>
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
                            <Input onChange={this.handleNameChange} style={{width:'90%'}}/>
                        </div>
                        <div className='table-search-item4'>
                            <Select style={{width:'calc(100% - 20px)'}} allowClear onChange={this.handleStatusChange}>
                                <Option key={'1'} value={'1'}>待提交</Option>
                                <Option key={'2'} value={'2'}>待审核</Option>
                                <Option key={'3'} value={'3'}>已通过</Option>
                                <Option key={'4'} value={'4'}>未通过</Option>
                                <Option key={'5'} value={'5'}>有更新</Option>
                            </Select>
                        </div>
                    </div>
                    <Table 
                        columns={columns} 
                        rowKey={'id'} 
                        dataSource={list} 
                        bordered 
                        pagination={pagination}
                        // onRow={this.onTableRow}
                        onRow={record=>{
                            return {
                              onMouseEnter:(e)=>{
                                TooltipTitle('1','1')
                              }
                            }
                          }
                        }
                    />
                </div>
                <Modal
                    title='新建项目'
                    visible={this.state.addModal}
                    destroyOnClose={true}
                    footer={null}
                    width={500}
                    onCancel={()=>this.setState({addModal:false})}
                    afterClose={()=>this.setState({addModal:false})}
                >
                    <Add closeModal={this.closeModal}/>
                </Modal>
                <Modal
                    title='提示'
                    visible={this.state.alertModal}
                    destroyOnClose={true}
                    footer={null}
                    width={500}
                    onCancel={()=>this.setState({alertModal:false})}
                    afterClose={()=>this.setState({alertModal:false})}
                >
                    <div>
                        <h3 style={{textAlign:"center",fontSize:'18px'}}>请及时补完项目的竣工时间</h3>
                        {
                            NofinishedItem.map(item=>{
                                return <p style={{textAlign:"center",fontSize:'16px'}}>{item}</p>
                            })
                        }
                        <div style={{padding:'20px 0',textAlign:'center'}}>
                            <Button type='primary' onClick={()=>this.setState({alertModal:false})}>知道了</Button>
                        </div>
                    </div>
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
           
        }
    }
    handleSubmit = () => {
        this.props.form.validateFields((error, values) => {
            if(!error){
                sessionStorage.setItem('projectName',values.projectName)
                location.hash = '/InformationSubmit/Add'
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
        return(
            <div>
                <Form>
                    <FormItem label='项目名称' {...formItemLayout} >
                        {
                            getFieldDecorator('projectName', {
                                rules: [{
                                    required: true,
                                    max:60,
                                    // message:'项目名称为必填项且字数限制60字',
                                    validator:(rule,value,callback)=>limitStr(rule,value,callback,'项目名称')
                                    // validator:(rule,value,callback)=>{
                                    //     if(!value){
                                    //         callback('项目名称为必填项且字数限制60字')
                                    //     }else if(!value.replace(/\s+/g,"")){
                                    //         callback('项目名称不可为字符串')
                                    //     }else{
                                    //         callback()
                                    //     }
                                    // }
                                }], initialValue:null,
                            })
                            (<Input style={{width:'100%'}}/>)
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







