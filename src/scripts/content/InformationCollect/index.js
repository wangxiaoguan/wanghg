//信息汇总
import React, { Component } from "react";
import { Button, Form, Input, Select, Divider,Cascader  } from "antd";
import "./index.less";
import ViewTotal from "./ViewTotal";
import CreateTotal from "./CreateTotal";
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
    return `/workReport/infoSubmit/getListOfCollect/${current}/${pageSize}?${queryStr}`;
  };

  viewCurrentTotal = () => {
    const params = {
      isTotalView:true,
      isviewCurrentTotal: true,
    }
      location.hash = `InformationCollect/Examine/${encodeURI(JSON.stringify(params))}`
  }

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
        width: "15%",
      },
      {
        title: "建表时间",
        dataIndex: "createTime",
        key: "createTime",
        width: "10%",
      },
      {
        title: "提交时间",
        dataIndex: "commitTime",
        key: "commitTime",
        width: "15%",
      },
      {
        title: "审核人",
        dataIndex: "admitUserName",
        key: "admitUserName",
        width: "10%",
      },
      {
        title: "操作",
        dataIndex: "option",
        key: "option",
        width: "10%",
        render: (_, record) => (
          <div>
            <a
            onClick={() => {
              const params = { id: record.id, };
              location.hash = `/InformationCollect/Examine/${encodeURI(
                JSON.stringify(params)
              )}`;
            }}
          >
            查看
          </a></div>
        ),
      },
    ];
    return (
      <div className="InformationCollect">
        <div className="middle-addBtn">
          <Button
            type="primary"
            onClick={() => {
              this.ViewTotal.show();
            }}
          >
            查看汇总
          </Button>
          　　
          <Button type="default" onClick={this.viewCurrentTotal}>预览本次汇总</Button>　　
          <Button
            type="default"
            onClick={() => {
              this.CreateTotal.show();
            }}
          >
            生成汇总
          </Button>
        </div>

        <SearchTable
          searchCreater={this.searchCreater}
          columns={columns}
          formItems={FormItems}
        />

        <ViewTotal
          getInstance={(e) => {
            this.ViewTotal = e;
          }}
          title="查看汇总"
        />
        <CreateTotal
          getInstance={(e) => {
            this.CreateTotal = e;
          }}
          title="生成汇总"
        />
      </div>
    );
  }
}

class FormItems extends Component {
  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const list = [
      {
        style: { width: "20%", textAlign: "left" },
        key: "createUnitName",
      },
      {
        style: { width: "10%" },
        key: "createUserName",
      },
      {
        style: { width: "15%" },
        key: "projectName",
      },
    ];
    return (
      <div className="tableFormSty">
        {/* {list.map((item, index) => (
          <Form.Item style={item.style} key={index}>
            {getFieldDecorator(item.key)(<Input.Search allowClear onSearch={()=>{ this.props.refresh()}} />)}
          </Form.Item>
        ))} */}
        <Form.Item style={{ width: "20%", textAlign: "left" }}>
            {getFieldDecorator('createUnitName')(
              // <Cascader
              //   changeOnSelect
              //   options={this.props.data}
              //   showSearch={()=>this.filter()}
              //   allowClear
              //   onChange={() => {
              //     this.props.refresh();
              //   }}
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
          <Form.Item style={{ width: "15%" }}>
            {getFieldDecorator('projectName')(
              <Input.Search
                allowClear
                onSearch={() => {
                  this.props.refresh();
                }}
              />
            )}
          </Form.Item>
      </div>
    );
  }
}
