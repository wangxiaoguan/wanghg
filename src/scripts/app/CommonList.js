
import React,{Component} from "react";
import {Input,Button,Row,Col,Table,Spin,Divider,message,Select,Form,DatePicker} from 'antd'
import {connect} from 'react-redux'
import store from '../redux/store'
import moment from 'moment';
import {setUser} from '../redux/action'
import './app.scss'
const Option = Select.Option;
const FormItem=Form.Item;
const {RangePicker} = DatePicker;
@connect(
    state => ({
      dataSource: state,
    }),
    dispatch => ({
      setUser: n => dispatch(setUser(n)),

    })
)
class CommonHtml extends Component{
    constructor(props){
        super(props);
        this.state={
			setUser:n =>store.dispatch(setUser(n)),
			loading:false,
			ids:[],
			type:'',
			searchValue:'',
			totalList:[],
			islogin:true,
			power:false,
			typeList:[
				{type:'',name:'全部'},
				{type:'html',name:'html'},
				{type:'css',name:'css'},
				{type:'js',name:'js'},
				{type:'node',name:'node'},
				{type:'react',name:'react'},
			]
           
        }
    }
    componentDidMount(){
		this.getList();
		console.log(this.props)
	}
	componentDidUpdate(){
		let Store = store.getState();
		let { islogin,power} = this.state;
        let user = Store.user || window.sessionStorage.getItem('user');
        if(user&&islogin){
            if(user === '17371301830'){
                this.setState({power:true,islogin:false})
            }else{
				this.setState({islogin:false})
			}
            
        }
	}
	
	//数据列表
    getList = () => {
		this.setState({loading:true})
        fetch(`http://wanghg.top/php/html/list.php`).then(res=>{
			res.json().then(data=>{
				this.setState({totalList:data.sort(this.dataSort),loading:false})
			})
		}).catch(error=>{
            message.error('获取列表失败')
            this.setState({loading:false})
        })
	}
	
	//新增数据
	DataAdd = () => {
		// location.hash = `/common/add`
		fetch('/api/php/html/list.php').then(data=>{
			console.log(data)
		})
	}
	//数据详情
	DataDetail = id => {
		location.hash = `/common/detail/${id}`
	}
	//编辑数据
	DataEdit = id => {
		location.hash = `/common/edit/${id}`
	}
	//删除数据
	DataDelete = id => {
		fetch(`http://wanghg.top/php/html/delete.php?id=${id}`).then((res)=> {
			message.success('删除成功')
			this.getList();
			this.state.setTimePushData(true)
			location.hash = `/common/list/1`
		}).catch(error=>{
            message.error('删除失败')
        });
	}
	//搜索
	search = () => {
		const {searchValue,type} = this.state
		this.setState({loading:true})
		fetch(`http://wanghg.top/php/html/search.php?title=${searchValue}&type=${type}`).then(res=>{
			res.json().then(data=>{
				this.setState({totalList:data.sort(this.dataSort),loading:false})
			})
		})
		
	}

	//输入框
	getInput = e => {
		this.setState({searchValue:e.target.value})
	}

	//重置
	setInput = () => {
		this.setState({searchValue:'',searchList:[],type:''},()=>{
			this.getList();
		})
	}
	//类型
	handleChange = type => {
		this.setState({type})
	}
	//排序
	dataSort = (date1,date2) => {
		return new Date(date2.time) - new Date(date1.time);
	}

    render(){
		let {loading,searchValue,type,typeList,totalList,power} = this.state;
		let Store = store.getState();
		let user = Store.user || window.sessionStorage.getItem('user');
		if(!user){
			power = false
		}
		const columns = [
			{
				title: '标题',
				dataIndex: 'title',
				key: 'title',
				width:400,
			},
			{
				title: '类型',
				dataIndex: 'type',
				key: 'type',
			},
			{
				title: '时间',
				dataIndex: 'time',
				key: 'time',
			},
			{
				title: '操作',
				dataIndex: 'option',
				key: 'option',
				width:160,
				render:(_,data)=>{
					return <div>
						<a onClick={()=>this.DataDetail(data.id)}>详情</a>
						<Divider type='vertical'/>
						{
							power?<a onClick={()=>this.DataEdit(data.id)}>编辑</a>:<span>编辑</span>
						}
						
						<Divider type='vertical'/>
						{
							power?<a onClick={()=>this.DataDelete(data.id)}>删除</a>:<span>删除</span>
						}
					</div>
				}
			},
		]
        return(
            <div id='CommonList'> 
				<Spin spinning={loading}>
					<Row>
						<Col offset={0} span={8}>标题：<Input style={{width:200}} value={searchValue} onChange={this.getInput}/></Col>
						<Col offset={0} span={5}>类型：<Select value={type} onChange={value =>this.handleChange(value)} style={{width:120}}>{typeList.map(e=><Option value={e.type} key={e.type} >{e.name}</Option>)}</Select></Col>
						<Col offset={1} span={2}><Button onClick={this.search}>搜索</Button></Col>
						<Col offset={1} span={2}><Button type='primary' onClick={this.setInput}>重置</Button></Col>
						<Col offset={1} span={2}><Button onClick={this.DataAdd}>新建</Button></Col>
					</Row>
					<Row style={{padding:'30px 0'}}>
						<Table bordered rowKey={'id'} dataSource={totalList} columns={columns}/>
					</Row>
				</Spin>
  	        </div>
    
        )
    }
} 

class Search extends Component{
    constructor(props){
        super(props);
        this.state={
			type:'',
			searchValue:'',
			totalList:[],
			typeList:[
				{type:'',name:'全部'},
				{type:'html',name:'html'},
				{type:'css',name:'css'},
				{type:'js',name:'js'},
				{type:'node',name:'node'},
				{type:'react',name:'react'},
			]
           
        }
    }
    componentDidMount(){
		this.getList();
		console.log(this.props)
	}
	
	//数据列表
    getList = () => {
		this.setState({loading:true})
        fetch(`http://wanghg.top/php/html/list.php`).then(res=>{
			res.json().then(data=>{
				this.setState({totalList:data,loading:false})
			})
		}).catch(error=>{
            message.error('获取列表失败')
            this.setState({loading:false})
        })
	}
	
	//新增数据
	DataAdd = () => {
		fetch('/api/jquery.js').then(data=>{
			console.log(data)
		})
		// location.hash = `/common/add`
	}
	//数据详情
	DataDetail = id => {
		location.hash = `/common/detail/${id}`
	}
	//编辑数据
	DataEdit = id => {
		location.hash = `/common/edit/${id}`
	}
	//删除数据
	DataDelete = id => {
		fetch(`http://wanghg.top/php/html/delete.php?id=${id}`).then((res)=> {
			message.success('删除成功')
			this.getList();
			location.hash = `/common/list/1`
		}).catch(error=>{
            message.error('删除失败')
        });
	}
	//搜索
	search = () => {
		const {searchValue,type} = this.state
		this.setState({loading:true})
		fetch(`http://wanghg.top/php/html/search.php?title=${searchValue}&type=${type}`).then(res=>{
			res.json().then(data=>{
				this.setState({totalList:data,loading:false})
			})
		})
		
	}

	//输入框
	getInput = e => {
		this.setState({searchValue:e.target.value})
	}

	//重置
	setInput = () => {
		this.setState({searchValue:'',searchList:[],type:''},()=>{
			this.getList();
		})
	}
	//类型
	handleChange = type => {
		this.setState({type})
	}

	changeDate = (date, dateString) => {
		console.log(date, dateString);
	}
	handleSubmit = (e) => {
        e.preventDefault();
        const {type} = this.state
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
			}
			console.log(fieldsValue)
			if(fieldsValue.time){
				let startTime = moment(fieldsValue.time[0]).format('YYYY-MM-DD 00:00:00');
				let endTime = moment(fieldsValue.time[1]).format('YYYY-MM-DD 23:59:59');
				console.log(startTime,endTime)
				let body = {
					// id:String(new Date().getTime()),
					// title:fieldsValue.title,
					// type:fieldsValue.type,
					// content:fieldsValue.content,
					startTime:startTime,
					endTime:endTime,
	
				}
				fetch(`http://wanghg.top/php/html/search.php`, {
					method: 'POST',
					mode: 'cors',
					body: JSON.stringify(body)
				}).then(function(response) {
					// message.success('新增成功')
					// location.hash = '/common/list/0'
					
				});
			}
            
            
        })
    }
    render(){
		const {searchValue,type,typeList,totalList} = this.state;
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };
		const formItemLayout2 = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
        return(
            <div> 
					<Form onSubmit={this.handleSubmit}  >
						<Row>
							<Col offset={0} span={6}>
								<FormItem  label='标题' {...formItemLayout}  >
									{
										getFieldDecorator('title',{
											rules:[
												{
													type:'string',
													

												}
											],initialValue:'', 
										})
										(<Input  /> )
									}
								</FormItem>
							</Col>
							<Col offset={0} span={4}>
								<FormItem  label='类型' {...formItemLayout2}  >
									{
										getFieldDecorator('type',{
											rules:[
												{
													type:'string',
													

												}
											],initialValue:'', 
										})
										(
											<Select style={{width:'100%'}}>
												{typeList.map(e=><Option value={e.type} key={e.type} >{e.name}</Option>)}
											</Select>
										)
									}
								</FormItem>
							</Col>
							<Col offset={1} span={8}>
								<FormItem  label='时间' {...formItemLayout}  >
									{
										getFieldDecorator('time',{
											// rules:[{type:'object',}],
										})
										(<RangePicker onChange={this.changeDate} />)
									}
								</FormItem>
							</Col>
						</Row>
					</Form>
					
					<Row>
						<Col offset={1} span={2}><Button onClick={this.handleSubmit}>搜索</Button></Col>
						<Col offset={1} span={2}><Button type='primary' onClick={this.handleSubmit}>重置</Button></Col>
						<Col offset={1} span={2}><Button onClick={this.DataAdd}>新建</Button></Col>
					</Row>

  	        </div>
    
        )
    }
} 
const SearchTable = Form.create()(Search);
export default CommonHtml;


