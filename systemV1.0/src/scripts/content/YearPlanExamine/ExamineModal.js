import React from "react";
import GlobalModal from "../../common/GlobalModal/GlobalModal";
import { Form, Button, Radio, Input, message,Spin  } from "antd";
import { postService } from "../../common/fetch";

const options = [
    { label: '通过', value: '3' },
    { label: '不通过', value: '4' },
  ]

  const formItemLayout = {
    labelCol: {
        span: 4 
    },
    wrapperCol: {
        span: 20 
    },
  };

class ExamineModal extends GlobalModal {
    state = {
      loading:false
    }

    show = (record) => {
      this.setState({visible:true, record})
    }

    submit = () => {
        this.props.form.validateFields((err, values) => {
            if(!err){
                this.setState({loading:true})
                const flag = values.status === '4' ? false : true;
                const params = flag ? {} : {notPassReason:values.notPassReason};
                postService(`/workReport/yearInvestment/review/${this.state.record.id}/${flag}`, params, res=>{
                  if(res && res.flag){
                    message.success('操作成功！');
                    if(this.props.refreshTable){
                      this.props.refreshTable();
                    }
                    this.setState({loading:false})
                    this.close();
                }else{
                    message.error(res.msg)
                    this.setState({loading:false})
                    this.close();
                }
                } )
            }
        })
    }

  renderContent = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    return (
      <Spin spinning={this.state.loading}>
      <div>
        <Form {...formItemLayout}>
          <Form.Item label="状态">
            {getFieldDecorator("status", {
              rules: [
                {
                  required: true,
                  message: "请选择审核状态!",
                },
              ],
            })(
            <Radio.Group>
                {options.map(item => <Radio value={item.value} key={item.value}>{item.label}</Radio>)}
              </Radio.Group>
            )}
          </Form.Item>
          {getFieldValue('status') === '4' ? <Form.Item label="原因">
            {getFieldDecorator("notPassReason", {
              rules: [
                {
                  required: false,
                  message: "请输入原因!",
                },
                {
                  max:200,
                  message: '不得超过200字'
                }
              ],
            })(
            <Input.TextArea rows={4}  max={200}/>
            )}
          </Form.Item>:null}
        </Form>
        <div className='modalFooter'>
            <Button onClick={()=>{this.close()}}>取消</Button>
            <Button type="primary" onClick={()=>{this.submit()}}>确定</Button>
        </div>
      </div>
      </Spin>
    );
  };
}

export default Form.create()(ExamineModal);
