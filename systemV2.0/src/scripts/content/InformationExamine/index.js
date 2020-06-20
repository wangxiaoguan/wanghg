//信息审核
import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Select, Input,Cascader,Table,Spin, Menu, Dropdown,message  } from "antd";
import "./index.less";
import {getService,postService} from '../../common/fetch';
const { Option } = Select;

export default class InformationExamine extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list:[],
			data:[],
			arr:[],
            addModal:false,
            alertModal:false,
            value:'',
            PageSize: 10, //每页十条数据
            current: 1, //当前页
            total: 0,//查询的总数量
            params:{},//搜索参数
            search:'',
            spin:true,
            NofinishedItem:[],
            searchData:[]
		};
	}

	componentDidMount(){
		document.addEventListener('keydown',this.onkeydown);
		this.getList(1,10)

	}
	getList = (page, pageSize,params='') => {
		this.setState({spin:true})
		getService(`/workReport/infoSubmit/getAuditedList/${page}/${pageSize}?${params}`,res=>{
			if(res.flag){
				this.setState({list:res.data.list||[],arr:res.data.list||[],total:res.data.total,spin:false})
			}else{
                this.setState({spin:false})
                message.error('请求错误')
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
        params.rowNumber = e.target.value;
        this.setState({params},()=>{
            this.setSearch(true)
        })
    }
    handlePersonChange = e => {//填表人
        let {params} = this.state;
        params.createUnitName = e.target.value;
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
	listSort = (type) => {
		let {arr} = this.state;
		let list2 = [];
		list2 = arr.filter(item=>{return item})
		if(type === 1){
			list2.sort((a,b)=>{
				if(a.admitTime&&!b.admitTime){
					return 0 - new Date(a.admitTime).getTime();
				}else if(!a.admitTime&&b.admitTime){
					return new Date(b.admitTime).getTime() - 0;
				}else if(!a.admitTime&&!b.admitTime){
					return 0;
				}else{
					return new Date(b.admitTime).getTime() - new Date(a.admitTime).getTime()
				}
				 
			})
		}else if(type === -1){
			list2.sort((a,b)=>{
				if(a.admitTime&&!b.admitTime){
					return new Date(a.admitTime).getTime() - 0;
				}else if(!a.admitTime&&b.admitTime){
					return 0 - new Date(b.admitTime).getTime()
				}else if(!a.admitTime&&!b.admitTime){
					return 0;
				}else{
					return new Date(a.admitTime).getTime() - new Date(b.admitTime).getTime()
				}
				 
			})
		}else{
			list2 = arr
		}
		this.setState({list:list2})

	}

  render() {
	const { list } = this.state;
	const menu = (
		<Menu>
		  <Menu.Item><a onClick={()=>this.listSort(1)}>正序</a></Menu.Item>
		  <Menu.Item><a onClick={()=>this.listSort(-1)}>倒序</a></Menu.Item>
		  <Menu.Item><a onClick={()=>this.listSort(0)}>还原</a></Menu.Item>
		</Menu>
	  );
    const columns = [
		{
			title: "序号",
			dataIndex: "rowNumber",
			key: "rowNumber",
			width: "10%",
		},
		{
			title: "填报单位",
			dataIndex: "createUnitName",
			key: "createUnitName",
			width: "20%",
		},
		{
			title: "项目数量",
			dataIndex: "projectNum",
			key: "projectNum",
			width: "15%",
		},
		{
			title: "已审核",
			dataIndex: "auditedNum",
			key: "auditedNum",
			width: "15%",
		},
		{
			title: "待审数量",
			dataIndex: "beAuditedNum",
			key: "beAuditedNum",
			width: "15%",
		},
		{
			title:<Dropdown overlay={menu}><div>最后审核通过时间</div></Dropdown>,
			dataIndex: "admitTime",
			key: "admitTime",
			width: "15%",
		},
		{
			title: "操作",
			dataIndex: "option",
			key: "option",
			width: "10%",
			render: (_, record) => (<a onClick={() =>  location.hash = `/InformationExamine/List/${record.createUnitId}`}>查看</a>),
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
        showTotal: total => `总共 ${total} 个项目`
    }
    return (
		<Spin spinning={this.state.spin}>
      	<div className="InformationExamine">
			<div className='table'>
				<div className='table-search'>
					<div className='table-search-item1'>
						<Input onChange={this.handleChange} style={{width:'calc(100% - 20px)'}}/>
					</div>
					<div className='table-search-item2'>
						<Input onChange={this.handlePersonChange} style={{width:'calc(100% - 20px)'}}/>
					</div>
					<div className='table-search-item3'>
						<Select style={{width:'calc(100% - 20px)'}} defaultValue={""} onChange={this.handleStatusChange}>
							<Option key={'0'} value={''}>全部</Option>
							<Option key={'1'} value={'1'}>有待审</Option>
							<Option key={'2'} value={'2'}>无待审</Option>
						</Select>
					</div>
				</div>
				<Table 
					columns={columns} 
					rowKey={'rowNumber'} 
					dataSource={list} 
					bordered 
					pagination={pagination}
				/>
			</div>
      	</div>
		</Spin>
    );
  }
}

