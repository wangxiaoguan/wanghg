//信息汇总
import React, { Component } from "react";
import { Button, Form, Input, Select, Divider,Cascader,Table,Modal,Col,Row,message,Spin} from "antd";
import "./index.less";
import {getService,postService,getExportExcelService} from '../../common/fetch';
const { Option } = Select;
const FormItem = Form.Item;
export default class InformationCollect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list:[],
			PageSize: 10, //每页十条数据
			current: 1, //当前页
			total: 0,//查询的总数量
			createModal:false,
			spin:false
		};
	}


	componentDidMount(){
		this.getList(1,10)
	}
	getList = (page, pageSize,params='') => {
		this.setState({spin:true})
		getService(`/workReport/infoSubmit/getCollectList/${page}/${pageSize}?${params}`,res=>{
			if(res.flag){
				let list = res.data.list||[];
				list.map((item,index)=>{item.sort = (page - 1)*10 + index})
				this.setState({list,total:res.data.total,spin:false})
			}else{
				this.setState({spin:false})
				message.error('未知错误')
			}
		})
	}
	lookDetail = data => {
		sessionStorage.setItem('collectMonth',data.collectMonth)
		sessionStorage.setItem('collectTime',data.collectTime)
		location.hash = `/InformationCollect/Detail`
	}

	exportExcel = (data) => {
		getExportExcelService(`/workReport/infoSubmit/exportUnitDetails?collect=1`,`${data.collectMonth}月单位明细`);
	}

	exportViewExcel = () => {
		getExportExcelService(`/workReport/infoSubmit/exportUnitDetails`,'预览明细');
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

	closeModal = () => {
		let {current,PageSize} = this.state;
		this.setState({createModal:false})
		this.getList(current,PageSize)
	}
  	render() {
	  	const {list} = this.state;
		const columns = [
			{
				title: "汇总月",
				dataIndex: "collectMonth",
				key: "collectMonth",
				width: "20%",
			},
			{
				title: "生成时间",
				dataIndex: "collectTime",
				key: "collectTime",
				width: "15%",
			},
			{
				title: "汇总人",
				dataIndex: "collectUserName",
				key: "collectUserName",
				width: "10%",
			},
			{
				title: "操作",
				dataIndex: "option",
				key: "option",
				width: "10%",
				render: (_, record) => (
					<span>
						<a onClick={()=>this.lookDetail(record)}>查看</a>
						<Divider type="vertical"/>
						<a onClick={()=>this.exportExcel(record)}>导出单位明细</a>
					</span>
				),
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
				<div className="InformationCollect">
					<div className="middle-addBtn">
						<Button type="primary" onClick={() => this.setState({createModal:true})}>生成汇总</Button>　
						<Button type="default" onClick={() => location.hash = `/InformationCollect/ViewTotal`}>预览本次汇总</Button>　　
						<Button type="default" onClick={() => this.exportViewExcel()}>导出预览明细</Button>
					</div>
					<div className='table'>
						<Table 
							columns={columns} 
							rowKey={'sort'} 
							dataSource={list} 
							bordered 
							pagination={pagination}
						/>
					</div>
					<Modal
						title='生成汇总'
						visible={this.state.createModal}
						destroyOnClose={true}
						footer={null}
						width={500}
						onCancel={()=>this.setState({createModal:false})}
						afterClose={()=>this.setState({createModal:false})}
					>
						<CreateTotal closeModal={this.closeModal}/>
					</Modal>
				</div>
			</Spin>
    	)
  	}
}

@Form.create()
class CreateTotal extends Component{
	constructor(props) {
		super(props);
		this.state = {
			list:[],
			PageSize: 10, //每页十条数据
			current: 1, //当前页
			total: 0,//查询的总数量
			yearOption:[],
			monthOption:[]
		};
	}

	componentDidMount(){
		this.getYears();
	}
	getYears = () => {
		let year = new Date().getFullYear()
		getService('/workReport/infoSubmit/getYear', res => {
			if(res && res.flag && res.data){
				let years = res.data||[];
				years.sort((a,b)=>{return a-b})
				this.setState({yearOption:years.length?years:[year] },()=>{
					years.length?this.getMonths(years[0]):this.getMonths(year);
				})
			}else{
				message.error('获取年份失败')
			}
		})
	}
	getMonths = (year) => {
		getService(`/workReport/infoSubmit/getUnCollect/${year}`,res=>{
			if(res.flag){
			  this.setState({monthOption:res.data||[]})
			}else{
				message.error('获取月份失败')
			}
		})
	}
    handleSubmit = () => {
        let {} = this.state;
        let {} = this.props;
        this.props.form.validateFields((error, values) => {
            if(!error){
                Modal.confirm({
					title: "提示",
					content: `确定将未汇总数据划归到${values.month}月吗？`,
					okText: "确认",
					cancelText: "取消",
					onOk: () => {
						this.createSummary(values);
					},
				});
            }
        })
	}
	createSummary = (values) => {
		this.setState({ loading: true });
		postService(`/workReport/infoSubmit/addCollect?collectMonth=${values.year}-${values.month}`, {},res => {
			this.setState({ loading: false });
			if (res && res.flag) {
				message.success("操作成功！");
				this.props.closeModal()
			} else {
				message.error(res.msg);
			}
		})
	}
	render(){
		const { yearOption,monthOption } = this.state;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = { labelCol: { span: 0 }, wrapperCol: { span: 20 } };
		return(
			<div>
				<Form>
				<Row>
					<Col span={10} style={{lineHeight:'40px'}}>将所有项目最新进展，划归到</Col>
					<Col span={5}>
						<FormItem {...formItemLayout} >
							{
								getFieldDecorator('year', {
									rules: [{
										required: true,
										message:`年份为必填项`
									}], initialValue: yearOption.length?yearOption[0]:'',
								})
								(
									<Select onChange={e=>this.getMonths(e)}>
										{
											yearOption.map((item) => (<Option key={item} value={item}>{item}</Option>))
										}
									</Select>
								)
							}
						</FormItem>
					</Col>
					<Col span={5}>
						<FormItem {...formItemLayout} >
							{
								getFieldDecorator('month', {
									rules: [{
										required: true,
										message:`月份为必填项`
									}], initialValue: '',
								})
								(
									<Select>
										{
											monthOption.map((item) => (<Option style={{textAlign:'center'}} key={item} value={item}>{item}</Option>))
										}
									</Select>
								)
							}
						</FormItem>
					</Col>
					<Col span={1} style={{lineHeight:'40px'}}>月</Col>
				</Row>
				<div style={{textAlign:'center',padding:'16px 0'}}>
					<Button onClick={() => this.props.closeModal()}>取消</Button>　　
					<Button type='primary' onClick={this.handleSubmit}>确定</Button>
				</div>
				</Form>
			</div>
		)
	}
}
