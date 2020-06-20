//信息报送
import React, { Component } from "react";
import { Button, Modal, Divider, Select, Input, Form, message, Popconfirm,Tooltip } from "antd";
const { Option } = Select;
const FormItem = Form.Item;
import "./index.less";
import { getUserInfo } from "../../utils/ProjectUtils";
import { getService, postService } from "../../common/fetch";
import {limitStr} from '../../common/checkForm'
import SearchTable from "../../common/SearchTable/index";
import { statusEnumTostring } from "../../base/enum/statusEnum";
import moment from "moment";

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addModal: false,
      viewData: null,
      isDetail:true
    };
  }

  componentDidMount() {}

  handleSearch = (value) => {
    if (value) {
      fetch(value, (data) => this.setState({ data }));
    } else {
      this.setState({ data: [] });
    }
  };

  searchCreater = (values, current, pageSize) => {
    let queryStr = ''
    for(let key in values){
      if(values[key]){
        queryStr = queryStr + `${key}=${values[key]}&`
      }
    }
    queryStr = queryStr.substring(0, queryStr.length - 1)
    return `/workReport/yearInvestment/getList/false/${current}/${pageSize}?${queryStr}`;
  };

  deletePlan = (record) => {
    postService(`/workReport/yearInvestment/delete/${record.id}`, {}, res => {
        if(res && res.flag){
            message.success('操作成功！');
            this.refreshTable();
        }else{
            message.error(res.msg)
        }
    })
  }

  submitPlan = record => {
    postService(`/workReport/yearInvestment/commit/${record.id}`, {}, res => {
        if(res && res.flag){
            message.success('操作成功！');
            this.refreshTable();
        }else{
            message.error(res.msg)
        }
    })
  }

  handleChange = (value) => {
    this.setState({ value });
  };
  closeModal = () => {
    this.setState({ addModal: false, viewData: null });
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
        title: "填写时间",
        dataIndex: "createTime",
        key: "createTime",
        width: "10%",
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
        // render: (item) => <span>{statusEnumTostring(`${item}`)}</span>,
        render:(_,data)=>{
          let notPassReason = data.notPassReason? "未通过原因：" + data.notPassReason: "未通过原因："+ '无'
          return <div>
              {
                  data.status==1?<span>待提交</span>:
                  data.status==2?<span style={{color:'#999'}}>待审核</span>:
                  data.status==3?<span style={{color:'#20DCB2'}}>已通过</span>:
                  data.status==4?<Tooltip placement="top" title={notPassReason}>
                  <span style={{color:'red'}}>未通过</span></Tooltip>:null
              }
          </div>
      }
      },
      {
        title: "操作",
        dataIndex: "option",
        key: "option",
        width: "20%",
        render: (_, record) => (
          <div>
            {
              record.status === 1 ? 
              <span>
                <a onClick={() => { this.setState({viewData: record, addModal: true ,isDetail:true})}}>查看</a>
                <Divider type="vertical" />
                <a onClick={() => { this.setState({viewData: record, addModal: true,isDetail:false})}}>修改</a>
                <Divider type="vertical" />
                <Popconfirm title="确定提交吗?" onConfirm={()=> {this.submitPlan(record)}}>
                <a>提交</a>
                </Popconfirm>
                <Divider type="vertical" />
                <Popconfirm title="确定删除吗?" onConfirm={()=> {this.deletePlan(record)}}>
                    <a>删除</a>
                </Popconfirm>
              </span>:
              record.status === 2 || record.status === 3 ? 
              <span>
                <a onClick={() => { this.setState({viewData: record, addModal: true ,isDetail:true})}}>查看</a>
              </span>:
              record.status === 4 ?
              <span>
                <a onClick={() => { this.setState({viewData: record, addModal: true ,isDetail:false})}}>修改</a>
                <Divider type="vertical" />
                <a onClick={() => {this.submitPlan(record)}}>提交</a>
                <Divider type="vertical" />
                <Popconfirm title="确定删除吗?" onConfirm={()=> {this.deletePlan(record)}}>
                    <a>删除</a>
                </Popconfirm>
              </span>:null
            }
            
          </div>
        ),
      },
    ];
    return (
      <div className="YearPlanSubmit">
        <div className="middle-addBtn">
          <Button
            type="primary"
            onClick={() => this.setState({ addModal: true,isDetail:false })}
          >
            新增计划
          </Button>
        </div>
        <div className="table">
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
        </div>
        <Modal
          title={this.state.viewData ? '修改计划' : '新增计划'}
          footer={null}
          width={500}
          visible={this.state.addModal}
          destroyOnClose={true}
          afterClose={this.closeModal}
          onCancel={this.closeModal}
        >
          <Add closeModal={this.closeModal} isDetail={this.state.isDetail} viewData={this.state.viewData} refreshTable={this.refreshTable} />
        </Modal>
      </div>
    );
  }
}

class FormItems extends Component {
  state = {
    data:[],
    searchData:[]
  }
  componentDidMount(){
    this.getTree()
  }
  getTree = () => {
      let {data,searchData} = this.state;
      getService(`/workReport/auth/getUnitList/true`,res=>{
          if(res.flag){
              let list = res.data || [];
              data.push(...list)
              searchData.push(...list)
              this.setState({data,searchData})
          }
      })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let {searchData} = this.props;
    const list = [
      {
        key: "createUnitName",
        style: { width: "25%", textAlign: "left" },
      },
      {
        key: "createUserName",
        style: { width: "10%" },
      },
    ];

    const options = searchData.map(item => <Option key={item.unitId} value={item.unitId}>{item.unitName}</Option>);
    return (
      <div className="tableFormSty">
        {/* {list.map((item, index) => (
          <Form.Item style={item.style} key={index}>
            {getFieldDecorator(item.key)(
              <Select
                showSearch 
                filterOption={(input, option) =>option.props.children.indexOf(input) >= 0}
                style={{width:'90%'}}
                value={this.state.value}
                onChange={()=>{
                  this.props.refresh();
                }}
              >
                {options}
              </Select>
            )}
          </Form.Item>
        ))} */}
        <Form.Item style={{ width: "25%", textAlign: "left" }}>
            {getFieldDecorator('createUnitName')(
            //  <Select
            //     showSearch 
            //     allowClear
            //     filterOption={(input, option) =>option.props.children.indexOf(input) >= 0}
            //     style={{width:'calc(90% -20px)'}}
            //     onChange={()=>{
            //       this.props.refresh();
            //     }}
            //   >
            //     {options}
            //   </Select>
              <Input.Search
                allowClear
                onSearch={() => {
                  this.props.refresh();
                }}
              />
            )}
          </Form.Item>
        <Form.Item style={{ width: "10%" }}>
            {getFieldDecorator('userName')(
              <Input.Search
                allowClear
                onSearch={() => {
                  this.props.refresh();
                }}
              />
            )}
          </Form.Item>
        <Form.Item style={{ width: "10%", marginLeft: "35%" }}>
          {getFieldDecorator("status")(
            <Select
              allowClear
              style={{ width: "90%" }}
              onChange={() => {
                this.props.refresh();
              }}
            >
              <Option key={"1"} value={'1'}>待提交</Option>
              <Option key={"2"} value={'2'}>待审核</Option>
              <Option key={"3"} value={'3'}>已通过</Option>
              <Option key={"4"} value={'4'}>未通过</Option>
            </Select>
          )}
        </Form.Item>
      </div>
    );
  }
}

@Form.create()
class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yearOption: [],
      list: [],
      addModal: false,
    };
  }
  componentWillMount() {
    this.getYears();
  }
  getYears = () => {
    let yearOption = [];
    for (let i = 2005; i < 2036; i++) {
      yearOption.push({ key: String(i), value: String(i) });
    }
    this.setState({ yearOption });
  };

  handleSubmit = () => {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        this.addPlan(values);
      }
    });
  };

  addPlan = (values) => {
    values.year = `${values.year}`;
    let url = "/workReport/yearInvestment/add";
    if(this.props.viewData){
        url = '/workReport/yearInvestment/update';
        values.id = this.props.viewData.id;
    }
    postService(url, values, (res) => {
      if (res && res.flag) {
        message.success("操作成功！");
        if(this.props.refreshTable){
            this.props.refreshTable();
        }
        this.props.closeModal();
      } else {
        message.error(res.msg);
      }
    });
  };

  closeModal = () => {
    this.setState({ addModal: false });
  };

  addTableData = (data) => {
    let { list } = this.state;
    list.push(data);
    this.setState({ list });
  };

  delete = (data) => {};
  render() {
    const { yearOption } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    const { viewData,isDetail } = this.props;

    const userInfo = getUserInfo();
    const newYear = new Date().getFullYear()
    return (
      <div>
        {
          !viewData?<div style={{marginBottom:'20px',color:'red',fontSize:'16px'}}>
          说明：按年度填写安可替代预算金额，包括财政渠道的年度预算、财政渠道的专项采购预算、安可工程实施方案预算等。
          </div>:null
        }
        
        <Form>
          <FormItem label="填报单位" {...formItemLayout}>
            {getFieldDecorator("createUnitName", {
              rules: [
                {
                  required: true,
                  max:60,
                  validator:(rule,value,callback)=>limitStr(rule,value,callback,'填报单位')
                  // message:'填报单位为必填项且字数限制60字'
                  // validator:(rule,value,callback)=>{
                  //   if(!value){
                  //       callback('填报单位为必填项且字数限制60字')
                  //   }else if(!value.replace(/\s+/g,"")){
                  //       callback('填报单位不可为字符串')
                  //   }else{
                  //       callback()
                  //   }
                  // }
                },
              ],
              initialValue: viewData ? viewData.createUnitName : userInfo.unitName,
            })(<Input disabled={isDetail} style={{ width: "100%" }} />)}
          </FormItem>
          <FormItem label="年份" {...formItemLayout}>
            {getFieldDecorator("year", {
              rules: [
                {
                  required: true,
                  message: "年份为必填项",
                },
              ],
              initialValue: viewData ? viewData.year  : `${newYear}`,
            })(
              <Select style={{ width: "100%" }} disabled={isDetail}>
                {yearOption.map((item) => {
                  return (
                    <Option key={item.key} value={item.key}>
                      {item.value}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem label="金额(万元)" {...formItemLayout}>
            {getFieldDecorator("money", {
              rules: [
                {
                  required: true,
                  // message: "金额为必填项",
                  validator:(rule,value,callback)=>{
                    if(!value){
                        callback('金额为必填项')
                    }else if(isNaN(Number(value))){
                        callback('请勿输入非数字值')
                    }else if(value.indexOf('e')>-1||value.indexOf('E')>-1){
                        callback('请勿输入非数字值')
                    }else if(Number(value)<0){
                        callback('请勿输入负数')
                    }else{
                        callback()
                    }
                }
                },
              ],
              initialValue: viewData ?String(viewData.money): null,
            })(<Input disabled={isDetail} style={{ width: "100%" }} />)}
          </FormItem>
          {
            isDetail?
            <div style={{ padding: "10px 0", textAlign: "center" }}>
              <Button type="default" onClick={() => this.props.closeModal()}>返回</Button>
            </div>:
            <div style={{ padding: "10px 0", textAlign: "center" }}>
              <Button type="default" onClick={() => this.props.closeModal()}>
                取消
              </Button>
              　{}
              <Button type="primary" onClick={this.handleSubmit}>
                确认
              </Button>
            </div>
          }
          
        </Form>
      </div>
    );
  }
}
