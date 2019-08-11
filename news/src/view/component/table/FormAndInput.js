import React, { Component} from 'react';
import { Tabs,Select,Button,message, Table,Input,Modal,Form,Radio,Cascader} from 'antd';
import TableAndSearch from './TableAndSearch';
const Search = Input.Search;
class FormAndInput extends Component{
  constructor(props) {
    super(props);
    this.state={
      columns:this.props.columns,//父组件传入的columns
      url:this.props.url,//父组件传入的url
      onSearch:this.props.onSearch,//查询输入框查询时需要调用的函数
      qfilter: this.props.qfilter ? this.props.qfilter:'',
    };
  }
  render(){
    return(
      <TableAndSearch
        columns={this.state.columns}
        url={this.state.url}
        type="radio"
        urlfilter={this.state.qfilter} 
      >
        {/* <Input
          placeholder="请输入关键字查询"
          onChange={(value)=>this.state.onSearch(value)}
          // style={{ width: 400 }}
        /> */}
      </TableAndSearch>
    );
  }

}
export default FormAndInput;