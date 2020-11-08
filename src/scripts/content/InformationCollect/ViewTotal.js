import React from "react";
import GlobalModal from "../../common/GlobalModal/GlobalModal";
import { Form, Button, Select, Checkbox } from "antd";
import { getService } from "../../common/fetch";

const { Option } = Select;

// const mock = [2019, 2020, 2021];
// const options = [
//     { label: '1月', value: '01' },
//     { label: '2月', value: '02' },
//     { label: '3月', value: '03' },
//     { label: '4月', value: '04' },
//     { label: '5月', value: '05' },
//     { label: '6月', value: '06' },
//     { label: '7月', value: '07' },
//     { label: '8月', value: '08' },
//     { label: '9月', value: '09' },
//     { label: '10月', value: '10'},
//     { label: '11月', value: '11'},
//     { label: '12月', value: '12'},
//   ]

  const formItemLayout = {
    labelCol: {
        span: 4 
    },
    wrapperCol: {
        span: 20 
    },
  };

class ViewTotal extends GlobalModal {

  state = {
    yearList:[],
    options:[],
    isFlag:true,
  }

    submit = () => {
        this.props.form.validateFields((err, values) => {
            if(!err){
              const params = {
                data:values,
                isTotalView:true,
              }
                location.hash = `InformationCollect/Examine/${encodeURI(JSON.stringify(params))}`
            }
        })
    }


    componentDidMount(){
      this.getYearList();
      const newYear = String(new Date().getFullYear())
      this.getMonthList(newYear)
      this.props.form.setFieldsValue({year:newYear})
    }
    componentDidUpdate(){
      let year = this.props.form.getFieldValue('year')
      const newYear = String(new Date().getFullYear())
      if(!year){
        this.props.form.setFieldsValue({year:newYear})
      }
    }

    getYearList = () => {
      getService('/workReport/infoSubmit/getYear', res => {
        if(res && res.flag && res.data){
          this.setState({yearList: res.data})
        }
      })
    }
    getMonthList = (year) => {
      getService(`/workReport/infoSubmit/getAllCollect/${year}`, res => {
        if(res && res.flag && res.data){
          let month = res.data;
          let options = []
          month.map(item=>{
            options.push({label: `${item}月`, value: `${item}` })
          })
          
          this.setState({options})
        }
      })
    }

  renderContent = () => {
    const { getFieldDecorator } = this.props.form;
    const newYear = String(new Date().getFullYear())
    return (
      <div>
        <Form {...formItemLayout}>
          <Form.Item label="年份">
            {getFieldDecorator("year", {
              rules: [
                {
                  required: true,
                  message: "请选择年份",

                },
              ],
            })(
              <Select onChange={this.getMonthList}>
                {this.state.yearList.map((item) => (
                  <Option value={item} key={item}>{item}年</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="月份">
            {getFieldDecorator("month", {
              rules: [
                {
                  required: true,
                  message: "请选择月份!",
                },
              ],
            })(
                <Checkbox.Group options={this.state.options} />
            )}
          </Form.Item>
        </Form>
        <div className='modalFooter'>
            <Button onClick={()=>{this.close()}}>取消</Button>
            <Button type="primary" onClick={()=>{this.submit()}}>确定</Button>
        </div>
      </div>
    );
  };
}

export default Form.create()(ViewTotal);
