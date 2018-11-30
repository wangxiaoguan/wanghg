import React, { Component } from 'react';
import { Form, Button, Input, DatePicker, Table, Modal, Spin,Row, Col,Select   } from 'antd';
import { getService, postService } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import './PartyBranchesDetails.less'

const FormItem = Form.Item;
const PageSize = 5;

@Form.create()
class PartyBranchesDetails extends  Component{
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
              title: "姓名",
              dataIndex: 'title',
            },
            {
              title: "员工号",
              dataIndex: 'peopleNum',
            },
            {
                title: "应缴年月",
                dataIndex: 'paidRatio',
              },
              {
                title: "缴费金额",
                dataIndex: 'unpaidRatio',
              },
            {
                title: "缴费状态",
                dataIndex: 'paidRatioState',
            },
          ];
          for(let i=1;i<200;i++){
            this.state.data.push({
              key:i,
              name:`${i}`,
              title:"张三",
              peopleNum:'01211003456',
              paidRatio:`2018年8月`,
              unpaidRatio:'****',
              paidRatioState:`未缴费`
            })
          }
    };
    goback=()=>{
        history.go(-1)
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const Option = Select.Option;
        function handleChange(value) {
            console.log(`selected ${value}`);
          }
          
          function handleBlur() {
            console.log('blur');
          }
          
          function handleFocus() {
            console.log('focus');
          }
        return(
           <div className="PartyBranchesDetails">
             <p className="header">2018年1月2日 - 至今</p>
             <Form layout="inline" className="form">
             <Row>
                <Col span={6}>
                        <FormItem label="姓名">
                            <div className="partyOrganizationInput">
                            {
                                getFieldDecorator('name')(<Input placeholder="请输入" />)
                            }
                            </div>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem label="员工号">
                            <div className="partyOrganizationInput">
                            {
                                getFieldDecorator('title')(<Input placeholder="请输入" />)
                            }
                            </div>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem label="应缴年月">
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="请选择"
                                optionFilterProp="children"
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>
                                <Option value="tom">Tom</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem label="缴费状态">
                            <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="请选择"
                            optionFilterProp="children"
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="tom">Tom</Option>
                            </Select>
                        </FormItem>
                    </Col>
             </Row>
             <Row>
             <FormItem className="allBtn">
                <Button className="queryBtn" onClick={this.submitSearch}>查询</Button>
                <Button className="resetBtn" onClick={() => {
                    this.props.form.resetFields();
                }}>重置</Button>
              </FormItem>
             </Row>
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
        )
        
    }
}

export default PartyBranchesDetails;