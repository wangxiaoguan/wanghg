import React from "react";
import GlobalModal from "../../common/GlobalModal/GlobalModal";
import { Form, Button, Checkbox } from "antd";
import { getService, postService,getExportExcelService } from "../../common/fetch";


  const formItemLayout = {
    labelCol: {
        span: 4 
    },
    wrapperCol: {
        span: 20 
    },
  };

class SummaryModal extends GlobalModal {
   state = {
    yearList:[],
  }

  componentDidMount() {
    this.getYearList();
  }

  getYearList = () => {
    getService(`/workReport/yearInvestment/getAllDate`, res => {
      if(res && res.flag && res.data){
        const list = res.data && res.data.map(item => ({label:`${item}`, value: item})) || [];
        this.setState({yearList: list})
      }
    })
  }

    submit = () => {
        this.props.form.validateFields((err, value) => {
            if(!err){
                console.log(value)
                let yearStr = value.month.join(',')
                getExportExcelService(`/workReport/yearInvestment/exportTotal?years=${yearStr}`,'年底计划汇总表格')
                this.close()
            }
        })
    }

  renderContent = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form {...formItemLayout}>
          <Form.Item label="年份">
            {getFieldDecorator("month", {
              rules: [
                {
                  required: true,
                  message: "请选择年份!",
                },
              ],
            })(
                <Checkbox.Group options={this.state.yearList} />
            )}
          </Form.Item>
        </Form>
        <div className='modalFooter'>
            <Button onClick={()=>{this.close()}}>取消</Button>
            <Button type="primary" onClick={()=>{this.submit()}}>导出</Button>
        </div>
      </div>
    );
  };
}

export default Form.create()(SummaryModal);
