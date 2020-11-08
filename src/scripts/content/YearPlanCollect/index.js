//信息汇总
import React, { Component } from "react";
import { getService, postService } from "../../common/fetch";
import {
    Form ,
  Button,
  Input,
  DatePicker,
  Cascader,
  Select
} from "antd";
const {Option} = Select
import "./index.less";
import moment from 'moment'
import SummaryModal from "./SummaryModal";
import SearchTable from "../../common/SearchTable/index";
import { statusEnum, statusEnumTostring } from "../../base/enum/statusEnum";

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    return `/workReport/yearInvestment/getTotalList/${current}/${pageSize}?${queryStr}`;
  };


  render() {
    const columns = [
      {
        title: "填报单位",
        dataIndex: "createUnitName",
        key: "createUnitName",
        width: "20%",
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
        width: "15%",
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
      },
      {
        title: "审核时间",
        dataIndex: "admitTime",
        key: "admitTime",
      },
      {
        title: "审核人",
        dataIndex: "admitUserName",
        key: "admitUserName",
      },
    ];
    return (
      <div className="YearPlanCollect">
        <div className="middle-addBtn">
          <Button
            type="primary"
            onClick={() => {
              this.SummaryModal.show();
            }}
          >
            年底计划汇总
          </Button>
          　　
        </div>
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
        />
        <SummaryModal
          getInstance={(e) => {
            this.SummaryModal = e;
          }}
          title="年底计划汇总"
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
        style: { width: "20%", textAlign: "left" },
        key: "createUnitName",
      },
      {
        style: { width: "10%" },
        key: "tableFormSty",
      },
      {
        style: { width: "15%" },
        key: "projectName",
      },
    ];
    let year = new Date().getFullYear(),array = [];
    for(let i = year-15;i<year+16;i++){
      array.push({key:i,value:i})
    }
    
    return (
      <div className="tableFormSty">
          <Form.Item style={{ width: "20%", textAlign: "left" }}>
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
        <Form.Item style={{ width: "10%",marginLeft:'15%'}}>
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
        </Form.Item>
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
