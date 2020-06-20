//信息审核
import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Select, Input,Cascader,Table,Spin,Button,Divider,Modal,Tooltip,message  } from "antd";
import "./list.less";
import {getService,postService} from '../../common/fetch';
import {status,checkStatus} from '../../common/staticData'
const { Option } = Select;

export default class InformationExamineList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list:[],
            data:[],
            addModal:false,
			alertModal:false,
			listModal:false,
            value:'',
            PageSize: 10, //每页十条数据
            current: 1, //当前页
            total: 0,//查询的总数量
            params:{},//搜索参数
            search:'',
            spin:true,
            NofinishedItem:[],
			searchData:[],
            itemName:'',
            createUnitId:'',
			id:'',
		};
	}
    componentWillMount(){
        let {match} = this.props;
        let id = match.params.id;
        this.setState({createUnitId:id})
    }
	componentDidMount(){
		document.addEventListener('keydown',this.onkeydown);
		this.getList(1,10)

	}
	getList = (page, pageSize,params='') => {
		this.setState({spin:true})
		getService(`/workReport/infoSubmit/getAuditList/${page}/${pageSize}?createUnitId=${this.state.createUnitId}&${params}`,res=>{
			if(res.flag){
				this.setState({list:res.data.tbPrjProjectReports,total:res.data.count,spin:false})
			}else{
                this.setState({spin:false})
                message.error('未知错误')
            }
		})
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
            this.setSearch(true)
        })
	}
	handleNameChange = e => {//项目名称
        let {params} = this.state;
        params.projectName = e.target.value;
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
	lookEditList = e => {
        if(e.lastAuditTime){
            this.setState({
                id:e.id,
                itemName:e.projectName,
                listModal:true
            })
        }else{
            location.hash = `/InformationExamine/List/Detail/${e.id}/0` 
            
        }
		
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


  render() {
	const { list } = this.state;
	const columns = [
		{
			title: "填报单位",
			dataIndex: "createUnitName",
			key: "createUnitName",
			width: "20%",
		},
		{
			title: "填报人",
			dataIndex: "createUserName",
			key: "createUserName",
			width: "10%",
		},
		{
			title: "项目名称",
			dataIndex: "projectName",
			key: "projectName",
			width: "20%",
		},
		{
			title: "最后提交",
			dataIndex: "commitTime",
			key: "commitTime",
			width: "15%",
		},
		{
			title: "最后审核",
			dataIndex: "lastAuditTime",
			key: "lastAuditTime",
			width: "15%",
		},
		{
			title: "审核状态",
			dataIndex: "status",
			key: "status",
			width: "10%",
			render: (item) => <span>{checkStatus(item)}</span>,
		},
		{
			title: "操作",
			dataIndex: "option",
			key: "option",
			width: "10%",
			render: (_, record) => {
				return <div>
					{
						record.status === 2 ?
						<span>
							<a onClick={()=>this.lookEditList(record)}>查看</a>
							<Divider type="vertical"/>
							<a onClick={()=>location.hash = `/InformationExamine/List/Examine/${record.id}`}>审批</a>
						</span>:
						<span>
							<a onClick={()=>this.lookEditList(record)}>查看</a>
						</span>
					}
				</div>
			}
		}
	]
	const pagination = {
        pageSize: this.state.PageSize,
        current: this.state.current,
        total: this.state.total,
        showSizeChanger: true,
        showQuickJumper: true,
        onShowSizeChange: this.onPageSizeChange,
        pageSizeOptions: ['10', "20", "30", "40"],
        onChange: this.changePage,
        showTotal: total => `总共 ${total} 个项目`
    }
    return (
		<Spin spinning={this.state.spin}>
      	<div className="InformationExamineList">
		  	<div className='middle-addBtn'>
                <Button type='default' onClick={()=>location.hash = '/InformationExamine'}>返回</Button>
            </div>
			<div className='table'>
				<div className='table-search'>
					<div className='table-search-item1'>
						<Input onChange={this.handleChange} style={{width:'calc(100% - 20px)'}}/>
					</div>
					<div className='table-search-item2'>
						<Input onChange={this.handlePersonChange} style={{width:'calc(100% - 20px)'}}/>
					</div>
					<div className='table-search-item3'>
						<Input onChange={this.handleNameChange} style={{width:'calc(100% - 20px)'}}/>
					</div>
					<div className='table-search-item4'>
						<Select style={{width:'calc(100% - 20px)'}} defaultValue={""} onChange={this.handleStatusChange}>
                            <Option key={'0'} value={''}>全部</Option>
                            <Option key={'1'} value={'1'}>待审核</Option>
							<Option key={'2'} value={'2'}>已审核</Option>
						</Select>
					</div>
				</div>
				<Table 
					columns={columns} 
					rowKey={'id'} 
					dataSource={list} 
					bordered 
					pagination={pagination}
				/>
			</div>
			<Modal
				title={this.state.itemName}
				visible={this.state.listModal}
				destroyOnClose={true}
				footer={null}
				width={700}
				onCancel={()=>this.setState({listModal:false})}
				afterClose={()=>this.setState({listModal:false})}
			>
				<List 
					id={this.state.id}
					closeModal={()=>this.setState({listModal:false})}
				/>
			</Modal>
      	</div>
		</Spin>
    );
  }
}

@Form.create()
class List extends Component{
    constructor(props){
        super(props);
        this.state={
           list:[],
           PageSize: 10, //每页十条数据
           current: 1, //当前页
           total: 0,//查询的总数量
           spin:true
        }
    }

    componentDidMount(){
        this.getList(1,10)
    }
    getList = (page, pageSize) => {
        this.setState({spin:true})
        let {id} = this.props
        getService(`/workReport/infoSubmit/getHistoryRevision/${id}/${page}/${pageSize}`,res=>{
            if(res.flag){
                this.setState({list:res.data.list,total:res.data.total,spin:false})
            }else{
                this.setState({spin:false})
                message.error('未知错误')
            }
        })
    }
    lookDetail = id => {
        location.hash = `/InformationExamine/List/Detail/${id}/1`
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
        const {list} = this.state;
        const columns = [
  
            {
                title: '提交时间',
                dataIndex: 'commitTime',
                key: 'commitTime',
                width:'30%'
            },
            {
                title: '审核时间',
                dataIndex: 'admitTime',
                key: 'admitTime',
                width:'30%'
            },
            {
                title: '结果',
                dataIndex: 'status',
                key: 'status',
                width:'20%',
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
                title: '操作',
                dataIndex: 'option',
                key: 'option',
                width:'20%',
                render:(_,data)=>(<a onClick={()=>this.lookDetail(data.id)}>查看</a>)
                
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
                <div>
                    <Table 
                        columns={columns} 
                        rowKey={'id'} 
                        dataSource={list} 
                        bordered 
                        pagination={pagination}
                    />
                </div>
            </Spin>
        )
    }
}

