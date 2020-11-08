//信息审核
import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Select, Input,Cascader  } from "antd";
import "./index.less";
import SearchTable from "../../common/SearchTable/index";
import moment from "moment";
import { statusEnumTostring } from "../../base/enum/statusEnum";

const { Option } = Select;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  searchCreater = (values, current, pageSize) => {
    let queryStr = ''
    for(let key in values){
      if(values[key]){
        if(key === 'createUnitId'){
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
    return `/workReport/infoSubmit/getAuditList/${current}/${pageSize}?${queryStr}`;
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
        title: "项目名称",
        dataIndex: "projectName",
        key: "projectName",
        width: "30%",
      },
      {
        title: "提交时间",
        dataIndex: "commitTime",
        key: "commitTime",
        width: "15%",
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        width: "15%",
        render: (item) => <span>{statusEnumTostring(`${item}`)}</span>,
      },
      {
        title: "操作",
        dataIndex: "option",
        key: "option",
        width: "10%",
        render: (_, record) => (
          
          <a
            onClick={() => {
              const params = { id: record.id };
              location.hash = `/InformationExamine/Examine/${encodeURI(
                JSON.stringify(params)
              )}`;
            }}
          >
            {record.status === 2 ? '审核' : '查看'}
          </a>
        ),
      },
    ];
    return (
      <div className="InformationExamine">
        <SearchTable
          searchCreater={this.searchCreater}
          columns={columns}
          formItems={FormItems}
        />
      </div>
    );
  }
}

class FormItems extends Component {
  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }

  onChange = () => {
    setTimeout(()=>{
      this.props.refresh();
    },2000)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const list = [
      {
        key: "createUnitName",
        style: { width: "20%", textAlign: "left" },
      },
      {
        key: "createUserName",
        style: { width: "10%" },
      },
      {
        key: "projectName",
        style: { width: "30%" },
      },
    ];
    

    return (
      <div className="tableFormSty">
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
          <Form.Item style={{ width: "10%" }}>
            {getFieldDecorator('createUserName')(
              <Input.Search
                allowClear
                onSearch={() => {
                  this.props.refresh();
                }}
              />
            )}
          </Form.Item>
          <Form.Item style={{ width: "30%" }}>
            {getFieldDecorator('projectName')(
              <Input.Search
                allowClear
                onSearch={() => {
                  this.props.refresh();
                }}
              />
            )}
          </Form.Item>
        <Form.Item style={{ width: "15%", marginLeft: "15%" }}>
          {getFieldDecorator("status")(
            <Select
              allowClear
              style={{ width: "90%" }}
              onChange={() => {
                this.props.refresh();
              }}
            >
              <Option key={"2"} value={'2'}>待审核</Option>
              <Option key={"5"} value={'5'}>有更新</Option>
            </Select>
          )}
        </Form.Item>
      </div>
    );
  }
}
