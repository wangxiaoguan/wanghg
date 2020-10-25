import React,{Component} from "react";
import {NavLink} from 'react-router-dom'
import {Input,Button,message,Select} from 'antd'
import './app.scss'
class Search extends Component{
    constructor(props){
        super(props);
        this.state={
			inputValue:'',
			selectKey:'',
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
		console.log(this.props)
	}
	

	//搜索
	onSearch = () => {

		const {inputValue,selectKey} = this.state;
		this.props.onSearch({inputValue,selectKey})
		
	}

	//重置
	setInput = () => {
		this.setState({inputValue:'',selectKey:''},()=>{
			this.props.onSearch({inputValue:'',selectKey:''})
		})
	}

    render(){
		const {inputValue,selectKey,typeList} = this.state;
        return(
            <div className='header-search'>
                <div className='header-search-item'>
					<Input 
						style={{width:200}} 
						value={inputValue} 
						placeholder='请输入标题内容' 
						onInput={e=>this.setState({inputValue:e.target.value})}
					/>
                </div>
                <div className='header-search-item'>
				<Select 
					style={{width:120}}
					value={selectKey} 
					onChange={selectKey =>this.setState({selectKey})} 
				>
                    {
                        typeList.map(e=>{
                            return <Select.Option value={e.type} key={e.type} >{e.name}</Select.Option>
                        })
                    }
                </Select>
                </div> 
                <div className='header-search-item'>
                    <Button onClick={this.onSearch}>搜索</Button>
                </div> 
                <div className='header-search-item'>
                    <Button type='primary' onClick={this.setInput}>重置</Button>
                </div> 
                <div className='header-search-item'>
                    <Button>
						<NavLink to='/common/add'>新建</NavLink>
					</Button>
                </div> 	
  	        </div>
    
        )
    }
} 
export default Search;