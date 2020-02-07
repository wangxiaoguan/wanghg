import React, { Component} from 'react';
import { Tabs,Select,Button,message, Table,Input,Modal,Form,Radio,Cascader} from 'antd';
import TableAndSearch from './TableAndSearch';
const Search = Input.Search;
class TableSearch extends Component{
  constructor(props) {
    super(props);
    this.state={
      columns:this.props.columns,//父组件传入的columns
      url:this.props.url,//父组件传入的url
      onSearch:this.props.onSearch,//查询输入框查询时需要调用的函数
      qfilter: this.props.qfilter ? this.props.qfilter:'',
    };
  }
  componentWillReceiveProps(nextProps) { // yelu 2019-01-02 修改查询后分页后不带查询条件
    if(nextProps.qfilter != this.state.qfilter) {
      this.setState({qfilter: nextProps.qfilter})
    }
  }
  render(){
    const {columns,url,onSearch,qfilter}=this.state;
    return(
        <TableAndSearch
            columns={columns}
            url={url}
            type="radio"
            urlfilter={qfilter}
        >
          <Search
              placeholder="请输入关键字查询"
              onSearch={(value)=>onSearch(value)}
              // style={{ width: 400 }}
          />
        </TableAndSearch>
    );
  }

}
export default TableSearch;