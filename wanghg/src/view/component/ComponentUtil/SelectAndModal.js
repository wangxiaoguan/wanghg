import React, { Component } from 'react';
import { Select,Button,Search,Modal,Input} from 'antd';
import {connect} from 'react-redux';
import TableAndSearch from '../table/TableAndSearch';
const Option = Select.Option;
@connect(
    state => ({
      selectRowsData: state.table.selectRowsData,  //获取选中行的数据
    }),
    dispatch => ({
    })
)
export default class SelectAndModal extends  Component {
  /**
   * 封装内容如下：
   *   点击按钮，出modal，选择后展现数据   （Select+Modal+TABLE）
   */
  constructor(props){
    super(props);
    this.state={
      selectOptions:[],//下拉框选项
      showModal:false,//modal的展示
      showModalKey:0,//modal的展示
    }
  }
  //按钮点击事件  弹出modal
  handleClick=()=>{
    this.setState({
      showModal:true,
      showModalKey:this.state.showModalKey+1
    });
  }
  //modal确定     1、将选中数据设置给select  2、关闭弹窗
  handleOk=()=>{
    this.setState({
      showModal:false,
    });
    let selectedData=this.props.selectRowsData; //获取勾选的值
    console.log('选中的值为：',selectedData[0]);
    this.setState({selectOptions:[{key:selectedData[0].userid,value:selectedData[0].name}]},()=>{

    });
  }
  //modal 取消
  handleCancel=()=>{
    this.setState({
      showModal:false,
    });
  }

  render(){
    const {selectOptions,showModalKey,showModal}=this.state;
    console.log('selectOptions',selectOptions);
    const {operation,modalData,tableData}=this.props;  //前一个页面传入的props 按钮的显示文字，modal的数据
    return(
        <div>
          <Select
              disabled={true}
              value={selectOptions.length>0?selectOptions[0].key:''}
               type='integer'
          >
            {
              selectOptions&&selectOptions.map((item,index)=>{
                console.log("item",item)
                return  (<Option key={item.key} value={item.key}>
                  {item.value}
                </Option>)
              })
            }
          </Select>
          <Button onClick={this.handleClick}>
            {operation}
          </Button>
          <Modal
              title={modalData.title}
              cancelText={modalData.cancelText}
              okText={modalData.okText}
              maskClosable={false}//点击蒙层是否关闭
              key={showModalKey}
              visible={showModal}
              destroyOnClose={true}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
          >

            <TableAndSearch
                columns={tableData.columns}
                url={tableData.url}
                type="radio"
            >
            </TableAndSearch>
          </Modal>

        </div>
    );
  }
}