import React, { Component } from 'react';
import { Form, Button, Input, DatePicker, Table, Modal, Spin } from 'antd';
import { getService, postService } from '../../myFetch';
import ServiceApi from '../../apiprefix';
import './FirstLevelOrganizationDetails.less'

const FormItem = Form.Item;
const PageSize = 5;

@Form.create()
class FirstLevelOrganizationDetails extends  Component{
    constructor(props){
        super(props);
        this.state={
            loading: false,
            data:[]
        };
        this.columns = [
            {
              title: "序号",
              dataIndex: 'name',
            },
            {
              title: "党组织名称",
              dataIndex: 'title',
            },
            {
              title: "党员人数",
              dataIndex: 'peopleNum',
            },
            {
                title: "已缴人数/已缴占比",
                dataIndex: 'paidRatio',
              },
              {
                title: "未缴人数/未缴占比",
                dataIndex: 'unpaidRatio',
              },
            {
              title: "操作",
              render: (text, record) => {
                return  <a className='operation' onClick={()=>this.GotoSecondOrganizationDetails(record) } >详情</a>;
              },
            },
          ];
          for(let i=1;i<200;i++){
            this.state.data.push({
              key:i,
              name:`${i}`,
              title:"国内销售部党总支",
              peopleNum:100,
              paidRatio:`60/60%`,
              unpaidRatio:`40/40%`
            })
          }
    }

    goback=()=>{
        history.go(-1)
    }
    
    //二级组织详情
    GotoSecondOrganizationDetails=(record)=>{
        location.hash=`/PartyBuildReport/PartyAffairsInform/PartyFeePay/SecondOrganizationDetails`
      }
    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <Spin spinning={this.state.loading}>
                <div className="FirstLevelOrganizationDetails">
                <p className="header">2018年1月2日 - 至今</p>
                <Form layout="inline" className="form">
                <FormItem label="党组织名称">
                <div className="partyOrganizationInput">
                {
                    getFieldDecorator('title')(<Input placeholder="请输入" />)
                }
                </div>
                </FormItem>
                <FormItem className="allBtn">
              <Button className="queryBtn" onClick={this.submitSearch}>查询</Button>
              <Button className="resetBtn" onClick={() => {
                this.props.form.resetFields();
              }}>重置</Button>
            </FormItem>
                </Form>
            <div className="ExportExcelDivDetail">
                <Button className="resetBtn ExportExcel " onClick={this.ExportExcel}>导出Excel</Button>
            </div>
            <Table
            className="table"
            rowKey={this.key}
            bordered
            pagination={{
              pageSize: PageSize,
              current: this.state.current,
              total: this.state.total,
              showSizeChanger :true,
              showQuickJumper: true,
              pageSizeOptions:['5',"10","15","20"],
              onChange: (page) => {
                this.setState({ current: page }, this.requestData);
              },
            }}
            columns={this.columns}
            dataSource={this.state.data}
          />
          <div className="goback">
           <Button className="queryBtn" onClick={this.goback}>返回</Button>
          </div>
                </div>
            </Spin>
        )
    }
}

export default FirstLevelOrganizationDetails;