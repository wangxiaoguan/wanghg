import React, { Component} from 'react';
import { Tabs,Select,Button,message, Table,Input,Modal,Form,Radio,Cascader,Row,Col} from 'antd';
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
      word:{target:{value:''}},
    };
  }
  componentWillReceiveProps(nextProps) { // yelu 2019-01-02 修改查询后分页后不带查询条件
    if(nextProps.qfilter != this.state.qfilter) {
      this.setState({qfilter: nextProps.qfilter});
    }
  }
  changeInput = e => {
    let {word} = this.state;
    word.target.value = e.target.value;
    this.setState({word});
  }
  resetInput = e => {
    let {word} = this.state;
    word.target.value = '';
    this.setState({word},()=>this.props.onSearch(word));
  }
  render(){
    const {word} = this.state;
    return(
      <TableAndSearch
        columns={this.state.columns}
        url={this.state.url}
        type={this.props.typeC&&this.props.typeC==='checkradio'?'checkbox':'radio'}
        urlfilter={this.state.qfilter}
        code='columnTree' 
      >
      {/* 党建园地新建党建任务修改选择用户的input框中的提示语xwx/2018/12/8 */}
        {this.props.type==='PartyTaskAddBase'?
           <Input
           placeholder="请输入用户名称查询"
           onChange={(value)=>this.state.onSearch(value)}
           // style={{ width: 400 }}
         />
         :
         <div>
            <Row>
                <Col span={16} offset={1}>
                {/* <Input placeholder="请输入关键字查询" onChange={(value)=>this.state.onSearch(value)}/> */}
                <Input placeholder="请输入关键字查询" value={word.target.value} onChange={this.changeInput}/>
                </Col>
                <Col span={2} offset={1}>
                    <Button type='primary' size='large' style={{height:34,marginLeft: '-16px'}} onClick={() =>this.state.onSearch(word)}>查询</Button>
                </Col>
                <Col span={2} offset={1}>
                    <Button size='large' style={{height:34}} onClick={this.resetInput}>重置</Button>
                </Col>
            </Row>
            
            {/* <Button>查询</Button>
            <Button>重置</Button> */}
         </div>
         
    
        }
      </TableAndSearch>
    );
  }

}
export default FormAndInput;