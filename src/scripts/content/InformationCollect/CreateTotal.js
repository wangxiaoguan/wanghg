import React from "react";
import GlobalModal from "../../common/GlobalModal/GlobalModal";
import { Form, Button, Select, Modal, message, Spin,Row,Col } from "antd";
import moment from "moment";
import "./index.less";
import { postService, getService } from "../../common/fetch";

const { Option } = Select;

const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

const year = moment(new Date()).format("YYYY");

class CreateTotal extends GlobalModal {
  state = {
    loading: false,
    yearOption:[],
    monthOption:[]

  };
  componentWillMount(){
    this.getYears()
  }
  componentDidMount(){
    const newYear = new Date().getFullYear()
    // this.props.form.setFieldsValue({year:newYear})
    this.onYearChange(newYear)
  }
  componentDidUpdate(){
    let year = this.props.form.getFieldValue('year')
    const newYear = String(new Date().getFullYear())
    if(!year){
      this.props.form.setFieldsValue({year:newYear})
    }
  }
  getYears = () => {
    let year = new Date().getFullYear();
    let yearOption = []
    for(let i=year-15;i<year+16;i++){
        yearOption.push({key:String(i),value:String(i)})
    }
    this.setState({yearOption})
}
  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Modal.confirm({
          title: "提示",
          content: `确定将未汇总数据划归到${values.month}月吗？`,
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            this.createSummary(values);
          },
        });
      }
    });
  };

  createSummary = (values) => {
    this.setState({ loading: true });
    postService(
      `/workReport/infoSubmit/addCollect?collectMonth=${values.year}-${values.month}`, {},
      (res) => {
        this.setState({ loading: false });
        if (res && res.flag) {
          message.success("操作成功！");
          this.close();
        } else {
          message.success(res.msg);
        }
      }
    );
  };
  onYearChange = (e) => {
    getService(`/workReport/infoSubmit/getUnCollect/${e}`,res=>{
      if(res.flag){
        this.setState({monthOption:res.data})
      }
    })
  }

  renderContent = () => {
    const { getFieldDecorator } = this.props.form;
    const newYear = String(new Date().getFullYear())
    return (
      <div>
        <Spin spinning={this.state.loading}>
        <div className="msgContent">
          当前未汇总的填报数据，划归到　
          <Form {...formItemLayout} className="createTotalModalForm">
            <Row>
              <Col span={12}>
              <Form.Item>
                {getFieldDecorator("year", {
                  rules: [
                    {
                      type:'string',
                      required: true,
                      message: "请选择年份",
                      initialValue:newYear
                    },
                  ],
                })(
                  <Select onChange={this.onYearChange}>
                    {this.state.yearOption.map((item) => (
                      <Option key={item.key} value={item.key}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              </Col>
              <Col span={10} offset={2}>
              <Form.Item>
              {getFieldDecorator("month", {
                rules: [
                  {
                    required: true,
                    message: "请选择月份",
                  },
                ],
              })(
                <Select>
                  {this.state.monthOption.map((item) => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
              </Col>
            </Row>
            
            
          </Form>{" "}
          &nbsp; 月
        </div>
        <div className="modalFooter">
          <Button
            onClick={() => {
              this.close();
            }}
          >
            取消
          </Button>
          <Button
            type="primary"
            onClick={() => {
              this.submit();
            }}
          >
            确定
          </Button>
        </div>
        </Spin>
      </div>
    );
  };
}

export default Form.create()(CreateTotal);
