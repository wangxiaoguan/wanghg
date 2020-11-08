//信息审核
import React, { Component } from "react";
import { Form, Input, DatePicker,Cascader,Select } from "antd";
import "./index.less";
import ExamineModal from "./ExamineModal";
import moment from 'moment'
import SearchTable from "../../common/SearchTable/index";
import { statusEnum, statusEnumTostring } from "../../base/enum/statusEnum";
const {Option} = Select
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      data: [],
      value: "",
    };
  }

  searchCreater = (values, current, pageSize) => {

    let queryStr = ''
    for(let key in values){
      if(values[key]){
        if(key === 'unitId'){
          let list = values[key]||[]
          if(list.length){
            queryStr = queryStr + `${key}=${list[list.length-1]}&`
          }
        }else{
          queryStr = queryStr + `${key}=${values[key]}&`
        }
        
      }
    }
    queryStr = queryStr.substring(0, queryStr.length - 1)
    return `/workReport/yearInvestment/getList/true/${current}/${pageSize}?${queryStr}`;
  };

  refreshTable = () =>{
    this.searchTable.refresh();
}
  render() {
    const columns = [
      {
        title: "填报单位",
        dataIndex: "createUnitName",
        key: "createUnitName",
        width: "25%",
      },
      {
        title: "填表人",
        dataIndex: "createUserName",
        key: "createUserName",
        width: "10%",
      },

      {
        title: "提交时间",
        dataIndex: "commitTime",
        key: "commitTime",
        width: "20%",
      },
      {
        title: "年度",
        dataIndex: "year",
        key: "year",
        width: "10%",
      },
      {
        title: "金额(万元)",
        dataIndex: "money",
        key: "money",
        width: "15%",
      },
      {
        title: "审核状态",
        dataIndex: "status",
        key: "status",
        width: "10%",
        render: (item) => <span>{statusEnumTostring(`${item}`)}</span>,
      },
      {
        title: "操作",
        dataIndex: "option",
        key: "option",
        render: (_, record) => (
          <a
            onClick={() => {
              this.ExamineModal.show(record);
            }}
          >
            审核
          </a>
        ),
      },
    ];
    return (
      <div>
        <SearchTable
          searchCreater={this.searchCreater}
          columns={columns}
          formItems={FormItems}
          transData={res => {
            return {
                data: res.data.data.list, // dataSource
                total: res.data.data.count, // 总页数
            };
        }}
        getInstance={e => { this.searchTable = e}}
        />
        <ExamineModal
          title='审核'
          getInstance={(e) => {
            this.ExamineModal = e;
          }}
          refreshTable={this.refreshTable}
        />
      </div>
    );
  }
}

class FormItems extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const list = [
      {
        style: { width: "25%", textAlign: "left" },
        key: "createUnitName",
      },
      {
        style: { width: "10%" },
        key: "createUserName",
      },
      {
        style: { width: "10%" },
        key: "createTime",
      },
    ];
    let year = new Date().getFullYear(),array = [];
    for(let i = year-15;i<year+16;i++){
      array.push({key:i,value:i})
    }
    return (
      <div className="tableFormSty">
        <Form.Item style={{ width: "25%", textAlign: "left" }}>
            {getFieldDecorator('createUnitName')(
              // <Cascader
              //   options={this.props.data}
              //   showSearch={()=>this.filter()}
              //   allowClear
              //   onChange={() => {
              //     this.props.refresh();
              //   }}
              //   changeOnSelect
              // />
              <Input.Search
                allowClear
                onSearch={() => {
                  this.props.refresh();
                }}
              />
            )}
        </Form.Item>
        <Form.Item style={{ width: "10%"}}>
          {getFieldDecorator('userName')(
            <Input.Search
              allowClear
              onSearch={() => {
                this.props.refresh();
              }}
            />
          )}
        </Form.Item>
        {/* <Form.Item style={{ width: "10%",marginLeft:'10%'}}>
          {getFieldDecorator('date')(
            <Select 
            allowClear
            onChange={() => {
              this.props.refresh();
            }}>
              {
                array.map((item,index)=>{
                return <Option key={item.key} value={item.key}>{item.value}</Option>
                })
              }
            </Select>
          )}
        </Form.Item> */}
        {/* <Form.Item style={{ width: "10%"}}>
          {getFieldDecorator('date')(
            <DatePicker
              allowClear
              onChange={() => {
                this.props.refresh();
              }}
            />
          )}
        </Form.Item> */}
        {/* {list.map((item, index) => (
          <Form.Item style={item.style} key={index}>
            {getFieldDecorator(item.key)(
              <Input.Search
                allowClear
                onSearch={() => {
                  this.props.refresh();
                }}
              />
            )}
          </Form.Item>
        ))} */}
      </div>
    );
  }
}
